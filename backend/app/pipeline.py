import re
from typing import Dict, Tuple

# Minimal rule-based pipeline to match project README expectations.

MEDICATION_VOCAB = {"doliprane", "amoxicilline", "paracetamol", "aspirin", "ibuprofen"}
QUANTITY_WORDS = {"juj", "wahda", "wahd", "wa7d", "one", "two", "2", "1"}
SYMPTOM_WORDS = {"rasi", "headache", "fever", "kbditi", "kbdti", "sedri", "pain"}

#Nettoie le texte d'entrée et détecte la langue (arabe, darija, ou autre) en utilisant des heuristiques simples basées sur les caractères et les mots présents dans le texte.
def preprocess_text(text: str) -> Tuple[str, str]:
    t = text.strip()
    # simple language detection heuristic
    if re.search(r"[\u0600-\u06FF]", t):
        lang = "arabic"
    elif re.search(r"\d+", t) or any(w in t.lower() for w in ("3tini", "juj", "wahda", "rasi")):
        lang = "darija"
    else:
        lang = "other"
    return t, lang

#Prédit l'intention du texte en utilisant des règles basées sur la présence de mots-clés spécifiques. Chaque intention a une confiance associée, qui peut être ajustée en fonction de la présence d'entités correspondantes.
def predict_intent(text: str) -> Tuple[str, float]:
    txt = text.lower()
    # intent rules following README categories
    if any(k in txt for k in ("3tini", "3atini", "give", "prendre", "need", "dwa", "doliprane", "amoxicilline")):
        return "medication_request", 0.9
    if any(k in txt for k in ("kbdti", "rasi", "headache", "pain", "fever")):
        return "symptom_description", 0.85
    if any(k in txt for k in ("juj", "two", "2", "1", "dose", "pill", "wahda")):
        return "quantity_request", 0.88
    if any(k in txt for k in ("chno", "what", "info", "how", "details")):
        return "information_request", 0.75
    return "unknown", 0.5

#Extrait les entités du texte en utilisant des règles basées sur la présence de mots-clés spécifiques pour les médicaments, les quantités et les symptômes. Les entités sont retournées dans un dictionnaire avec des valeurs optionnelles.
def extract_entities(text: str) -> Dict[str, str]:
    txt = text.lower()
    entities = {"medication": None, "quantity": None, "symptom": None}

    # medication lookup
    for med in MEDICATION_VOCAB:
        if med in txt:
            entities["medication"] = med
            break

    # quantity detection: digits or keywords
    m = re.search(r"(\d+)", txt)
    if m:
        entities["quantity"] = m.group(1)
    else:
        for q in QUANTITY_WORDS:
            if q in txt:
                entities["quantity"] = q
                break

    # symptom detection
    for s in SYMPTOM_WORDS:
        if s in txt:
            entities["symptom"] = s
            break

    return entities

#La fonction principale du pipeline qui prend un texte en entrée, le prétraite, 
# prédit l'intention, extrait les entités, et retourne un dictionnaire contenant 
# l'intention prédite, les entités extraites, la confiance de la prédiction et la langue d'entrée. 
# La confiance peut être ajustée si les entités correspondent à l'intention prédite.
def predict(text: str) -> Dict:
    clean_text, lang = preprocess_text(text)
    intent, conf = predict_intent(clean_text)
    entities = extract_entities(clean_text)
    # Slightly adjust confidence if entities match intent
    if intent == "medication_request" and entities.get("medication"):
        conf = max(conf, 0.9)
    return {
        "intent": intent,
        "entities": entities,
        "confidence": round(conf, 2),
        "input_language": lang,
    }
