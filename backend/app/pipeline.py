# app/pipeline.py

import re
from typing import Dict, Tuple

# Import UNIQUE depuis entity_extractor (référence) 
from .entity_extractor import (
    extract_entities,
    extract_all_entities
)

# DÉTECTION DE LANGUE
def preprocess_text(text: str) -> Tuple[str, str]:
    """
    Nettoie le texte et détecte la langue.
    Retourne (texte_nettoyé, langue)

    Langues détectées :
    - arabic  : caractères arabes [\u0600-\u06FF]
    - darija  : mots-clés darija latinisé (arabizi)
    - french  : mots-clés français
    - other   : aucune correspondance
    """
    t = text.strip()

    # Arabe — caractères unicode arabes
    if re.search(r"[\u0600-\u06FF]", t):
        return t, "arabic"

    # Darija — mots-clés arabizi courants
    darija_keywords = (
        "3tini","3indi", "bghit", "bgit", "3andi", "wach",
        "kayn", "chhal", "kifach", "juj", "wahda",
        "rasi", "kbdti", "mrid", "dwa", "tbib","hna", "lhospital",
        "sara3", "merra", "f nhar","dyal", "rah", "mashi","bchhal"
    )
    if any(w in t.lower() for w in darija_keywords):
        return t, "darija"

    # Code-switching darija+français — NOUVEAU
    # Si le texte mélange darija et français
    has_darija_digit = re.search(r"\b[37]\w*", t)  # 3indi, 7uma...
    if has_darija_digit:
        return t, "darija"
    
    # Français — mots-clés français courants
    french_keywords = (
        "je veux", "j'ai", "donne", "combien",
        "comment", "medicament", "douleur",
        "symptome", "ordonnance","urgence", "pharmacie"
    )
    if any(w in t.lower() for w in french_keywords):
        return t, "french"

    return t, "other"

# PRÉDICTION D'INTENTION
# Intentions alignées EXACTEMENT avec entity_extractor.py
def predict_intent(text: str) -> Tuple[str, float]:
    """
    Prédit l'intention du texte par règles.
    Retourne (intention, confiance)

    Intentions possibles (alignées entity_extractor.py) :
    - medication_request
    - symptom_description
    - demande_posologie
    - demande_consultation
    - demande_prix
    - remboursement_mutuelle
    - urgence
    - unknown
    """
    txt = text.lower()

    #  urgence EN PREMIER — priorité absolue 
    if any(k in txt for k in (
        "urgence", "urgent", "vite", "aide",
        "secours", "ambulance", "sara3", "appel"
    )):
        return "urgence", 0.95

    # medication_request 
    if any(k in txt for k in (
        "3tini", "3atini", "bghit", "bgit",
        "give", "prendre", "need", "dwa",
        "doliprane", "amoxicilline", "paracetamol",
        "medicament", "dawa", "dawé", "ordonnance"
    )):
        return "medication_request", 0.9

    # symptom_description 
    if any(k in txt for k in (
        "kbdti", "rasi", "headache", "pain", "fever",
        "3andi", "j'ai mal", "kat7eni", "mrid",
        "douleur", "symptome", "wja3", "7uma", "bard"
    )):
        return "symptom_description", 0.85

    #  demande_posologie 
    if any(k in txt for k in (
        "kifach", "comment prendre", "posologie",
        "dose", "fois par jour", "f nhar",
        "how to take", "merra", "combien de fois"
    )):
        return "demande_posologie", 0.88

    # demande_consultation 
    if any(k in txt for k in (
        "docteur", "medecin", "rdv", "rendez-vous",
        "consultation", "clinique", "hopital",
        "specialiste", "tbib", "cabinet"
    )):
        return "demande_consultation", 0.82

    #  demande_prix 
    if any(k in txt for k in (
        "chhal", "prix", "combien", "tarif",
        "cout", "how much", "bchhal", "thaman"
    )):
        return "demande_prix", 0.87

    #  remboursement_mutuelle 
    if any(k in txt for k in (
        "mutuelle", "remboursement", "assurance",
        "cnops", "cnss", "ramed", "couverture"
    )):
        return "remboursement_mutuelle", 0.85

    return "unknown", 0.5

# AJUSTEMENT DE CONFIANCE
def adjust_confidence(intent: str, entities: Dict, conf: float) -> float:
    """
    Augmente la confiance si les entités trouvées
    correspondent bien à l'intention prédite.
    """
    found = [v for v in entities.values() if v is not None]

    if intent == "medication_request" and entities.get("medication"):
        conf = max(conf, 0.92)

    elif intent == "symptom_description" and entities.get("symptom"):
        conf = max(conf, 0.90)

    elif intent == "demande_posologie" and entities.get("medication"):
        conf = max(conf, 0.90)

    elif intent == "demande_prix" and entities.get("medication"):
        conf = max(conf, 0.89)

    elif intent == "demande_consultation" and entities.get("specialite"):
        conf = max(conf, 0.88)

    elif intent == "remboursement_mutuelle" and entities.get("assurance"):
        conf = max(conf, 0.88)

    elif intent == "urgence":
        conf = max(conf, 0.95)

    elif intent != "unknown" and len(found) >= 2:
        conf = max(conf, 0.85)

    return round(conf, 2)

# FONCTION PRINCIPALE
def predict(text: str) -> Dict:
    """
    Pipeline complet du chatbot santé.

    Étapes :
    1. Détection langue + nettoyage (preprocess_text)
    2. Prédiction intention     (predict_intent)
    3. Extraction entités       (entity_extractor.py)
    4. Ajustement confiance     (adjust_confidence)
    5. Retour JSON structuré

    Exemple d'entrée :
        "bghit doliprane 3 boites"

    Exemple de sortie :
        {
            "intent":         "medication_request",
            "confidence":     0.92,
            "input_language": "darija",
            "entities": {
                "medication": "Doliprane",
                "quantity":   "3 boites",
                "frequency":  None
            }
        }
    """

    # ÉTAPE 1 — Nettoyage + détection langue
    clean_text, lang = preprocess_text(text)

    # ÉTAPE 2 — Prédiction intention
    intent, conf = predict_intent(clean_text)

    # ÉTAPE 3 — Extraction entités
    # intent connu  → extraction ciblée selon l'intention
    # intent inconnu → extraction complète (fallback)
    if intent != "unknown":
        entities = extract_entities(clean_text, intent)
    else:
        entities = extract_all_entities(clean_text)

    # ÉTAPE 4 — Ajustement confiance
    conf = adjust_confidence(intent, entities, conf)

    # ÉTAPE 5 — Retourner résultat structuré
    return {
        "intent":         intent,
        "confidence":     conf,
        "input_language": lang,
        "entities":       entities,
    }