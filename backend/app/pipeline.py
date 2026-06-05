import torch
import os
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from entity_extractor import extract_entities

# ── Chargement du modèle ─────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "intent_model")
TOKENIZER_PATH = os.path.join(MODEL_PATH, "tokenizer")

tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

# ── Prédiction intent ────────────────────────────────────
def predict_intent(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.softmax(outputs.logits, dim=1)
    confidence = probs.max().item()
    intent_id = probs.argmax().item()
    intent = model.config.id2label[intent_id]

    return intent, confidence

# ── Pipeline principal ───────────────────────────────────
def run_pipeline(text):
    intent, confidence = predict_intent(text)
    entities = extract_entities(text, intent)

    return {
        "text": text,
        "intent": intent,
        "confidence": round(confidence, 2),
        "entities": entities
    }