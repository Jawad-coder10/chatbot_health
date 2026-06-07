import re
import os
import unicodedata

# try fuzzy matching libs: fuzzywuzzy preferred, fallback to rapidfuzz if available
try:
	from fuzzywuzzy import process
except Exception:
	try:
		from rapidfuzz import process
	except Exception:
		process = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_list(filename):
	path = os.path.join(BASE_DIR, "datasets", "entity", filename)
	try:
		with open(path, "r", encoding="utf-8") as f:
			return [line.strip() for line in f.read().splitlines() if line.strip()]
	except FileNotFoundError:
		return []

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


#  Normalisation 
def normalize(text):
	if text is None:
		return ""
	return unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8').lower()


#  Fuzzy matching générique 
def fuzzy_match(text, word_list, threshold=80):
	norm_text = normalize(text)
	norm_list = [normalize(w) for w in word_list]

	# direct substring match
	for i, nl in enumerate(norm_list):
		if nl and nl in norm_text:
			return word_list[i]

	# token-based fuzzy matching if a matching library is available
	if process is None:
		return None

	words = norm_text.split()
	for word in words:
		res = process.extractOne(normalize(word), norm_list)
		if not res:
			continue
		# fuzzywuzzy returns (match, score); rapidfuzz may return (match, score, idx)
		if isinstance(res, tuple):
			if len(res) >= 2:
				match = res[0]
				score = int(res[1])
			else:
				continue
		else:
			# unexpected format
			continue

		if score >= threshold:
			return word_list[norm_list.index(match)]

	return None

# Extracteurs par entité 
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
        r'\b(\d+)\s*(comprim[ée]s?|boites?|sachets?|mg|ml|boîtes?|gelules?|ampoules?)\b',
        text or "", re.IGNORECASE
    )
    return pattern.group(0) if pattern else None

def extract_frequency(text):
	pattern = re.search(
		r'\b(\d+|une|deux|trois|merra|mra)\s*(fois|f nhar|times|مرات|مرة)\s*(par jour|par semaine|in a day)?\b',
		text or "", re.IGNORECASE
	)
	return pattern.group(0) if pattern else None

def extract_duration(text):
	pattern = re.search(
		r'\b(\d+)\s*(jours?|iyam|يوم|أيام|semaines?)\b',
		text or "", re.IGNORECASE
	)
	return pattern.group(0) if pattern else None

def extract_assurance(text):
	return fuzzy_match(text, assurances)

def extract_lieu(text):
	return fuzzy_match(text, lieux)


def extract_all_entities(text):
	"""Return all entity candidates (useful when intent is unknown)."""
	return {
		"medication": extract_medication(text),
		"quantity":   extract_quantity(text),
		"frequency":  extract_frequency(text),
		"duration":   extract_duration(text),
		"symptom":    extract_symptom(text),
		"body_part":  extract_body_part(text),
		"urgence_type": extract_urgence_type(text),
		"specialite": extract_specialite(text),
		"assurance":  extract_assurance(text),
		"lieu":       extract_lieu(text),
	}


# Pipeline principal selon intent 
def extract_entities(text, intent):
	entities = {}

	if intent == "medication_request":
		entities["medication"] = extract_medication(text)
		entities["quantity"]   = extract_quantity(text)
		entities["frequency"]  = extract_frequency(text)

	elif intent == "demande_posologie":
		entities["medication"] = extract_medication(text)
		entities["frequency"]  = extract_frequency(text)
		entities["duration"]   = extract_duration(text)

	elif intent == "symptom_description":
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

