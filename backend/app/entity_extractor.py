import re
import os
import unicodedata
from fuzzywuzzy import process


# ── Chargement ─────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_list(filename):
    path = os.path.join(BASE_DIR, "datasets", "entity", filename)
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f.read().splitlines() if line.strip()]

medications  = load_list("medications.txt")
body_parts   = load_list("body_part")
frequencies  = load_list("frequency")
quantities   = load_list("unites_quantities")
symptoms     = load_list("type_symptome")
urgences     = load_list("type_d'urgence")
specialites  = load_list("specialiter_medical")
procedures   = load_list("procedure_medicale")
assurances   = load_list("assurant")
lieux        = load_list("lieu")

# ── Normalisation ────────────────────────────────────────
def normalize(text):
    return unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8').lower()

# ── Fuzzy matching générique ─────────────────────────────
def fuzzy_match(text, word_list, threshold=80):
    words = text.split()
    norm_list = [normalize(w) for w in word_list]
    for word in words:
        match, score = process.extractOne(normalize(word), norm_list)
        if score >= threshold:
            return word_list[norm_list.index(match)]
    return None

# ── Extracteurs par entité ───────────────────────────────
def extract_medication(text):
    return fuzzy_match(text, medications, threshold=85)

def extract_body_part(text):
    return fuzzy_match(text, body_parts)

def extract_symptom(text):
    return fuzzy_match(text, symptoms)

def extract_urgence_type(text):
    return fuzzy_match(text, urgences)

def extract_specialite(text):
    return fuzzy_match(text, specialites)

def extract_quantity(text):
    pattern = re.search(
        r'\b(\d+)\s*(comprim[ée]s?|boite|sachet|mg|ml|boîte|gelule|ampoule)\b',
        text, re.IGNORECASE
    )
    return pattern.group(0) if pattern else None

def extract_frequency(text):
    pattern = re.search(
        r'\b(\d+|une|deux|trois|merra|mra)\s*(fois|f nhar|times|مرات|مرة)\s*(par jour|par semaine|in a day)?\b',
        text, re.IGNORECASE
    )
    return pattern.group(0) if pattern else None

def extract_duration(text):
    pattern = re.search(
        r'\b(\d+)\s*(jours?|iyam|يوم|أيام|semaines?)\b',
        text, re.IGNORECASE
    )
    return pattern.group(0) if pattern else None

def extract_assurance(text):
    return fuzzy_match(text, assurances)

def extract_lieu(text):
    return fuzzy_match(text, lieux)

# ── Pipeline principal selon intent ─────────────────────
def extract_entities(text, intent):
    entities = {}

    if intent == "demande_medicament":
        entities["medication"] = extract_medication(text)
        entities["quantity"]   = extract_quantity(text)
        entities["frequency"]  = extract_frequency(text)

    elif intent == "demande_posologie":
        entities["medication"] = extract_medication(text)
        entities["frequency"]  = extract_frequency(text)
        entities["duration"]   = extract_duration(text)

    elif intent == "description_symptome":
        entities["symptom"]    = extract_symptom(text)
        entities["body_part"]  = extract_body_part(text)

    elif intent == "urgence":
        entities["urgence_type"] = extract_urgence_type(text)
        entities["body_part"]    = extract_body_part(text)

    elif intent == "demande_consultation":
        entities["specialite"] = extract_specialite(text)
        entities["lieu"]       = extract_lieu(text)

    elif intent == "remboursement_mutuelle":
        entities["medication"] = extract_medication(text)
        entities["assurance"]  = extract_assurance(text)

    elif intent == "demande_prix":
        entities["medication"] = extract_medication(text)
        entities["lieu"]       = extract_lieu(text)

    return entities

print(extract_entities("3andi alam f rassi bzzaf" , "description_symptome"))
print(extract_entities("bghit nchuf cardiologue f rabat", "demande_consultation"))
print(extract_entities("wash smecta mrebbda f cnops", "remboursement_mutuelle"))
print(extract_entities("3tini doliprann dyal ras", "demande_medicament"))

