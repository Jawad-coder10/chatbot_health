Arabic/Darija Patient Assistance Chatbot — Pipeline Documentation
Overview
This system accepts informal multilingual patient messages in Darija, Arabic, and French, and returns structured information about their medication-related requests.
The pipeline has two distinct phases: training and runtime.

Phase 1 — Training Phase
Executed once by the team to build the classifier. Not part of live system.
Step 1 — Data Preparation
Datasets used:

MedQA-MA — 114,000 Darija medical question-answer pairs labeled by medical specialty. Primary training source for medical intent and entity understanding.
DODa — 150,000 Darija entries covering Latin and Arabic script. Used for Arabizi normalization and vocabulary reference.

Goal: Build a clean, labeled dataset of patient messages mapped to intents.
Intent categories to define:
medication_request     → "3tini dwa dyal rasi"
symptom_description    → "kbdti katdwini"
quantity_request       → "3tini juj dyal doliprane"
information_request    → "chno kaydawi doliprane"

Step 2 — Preprocessing
Goal: Clean and normalize raw text before mBERT sees it.
Operations:
1. Arabizi normalization using DODa
   3 → ع  |  7 → ح  |  9 → ق

2. Remove noise
   punctuation, extra spaces, special characters

3. Normalize Arabic text
   unify different spellings of same word

4. Lowercase Latin text

Step 3 — mBERT Vectorization
Model: multilingual BERT (mBERT) from Hugging Face
Goal: Convert clean text into mathematical representation of meaning.
Why mBERT:

Trained on 104 languages including Arabic and French
Handles mixed language input natively
No translation needed — understands multilingual input as one
Open source, runs locally, no API required

Output: Vector of 768 numbers per input capturing semantic meaning

Step 4 — Classifier Training
Model: Logistic Regression trained on mBERT vectors
Goal: Learn to predict intent from meaning vectors.
Input: mBERT vectors + intent labels from MedQA-MA
Output: Trained classifier saved to file

Step 5 — Entity Extractor Training
Goal: Extract specific information from the request.
Entities to extract:
medication_name  → "doliprane", "amoxicilline"
quantity         → "juj", "wahda", "2"
symptom          → "rasi", "kbdti", "sedri"
Method: Rule-based patterns + MedQA-MA medical vocabulary

Phase 2 — Runtime Pipeline
Live system. Receives user input and returns structured output.
User message (any language, any script)
↓
[PREPROCESSING]
Arabizi normalization + noise removal + text cleaning
↓
[mBERT]
Clean text → 768-dimensional meaning vector
↓
[CLASSIFIER]
Vector → Intent label
↓
[ENTITY EXTRACTOR]
Raw text → medication name, quantity, symptom
↓
[STRUCTURED OUTPUT]
JSON response to FastAPI
Output example:
json{
  "intent": "medication_request",
  "entities": {
    "medication": "doliprane",
    "quantity": "2",
    "symptom": "headache"
  },
  "confidence": 0.94,
  "input_language": "darija"
}

Work Split
ComponentOwnerData preparation + preprocessingYoumBERT integration + classifierYouEntity extractorYouFastAPI layer + endpointsTeammateDocker environmentTeammateGit repository managementBoth

Tech Stack
ToolPurposePythonCore languageHugging Face TransformersmBERT modelScikit-learnLogistic Regression classifierPyDODaDarija normalizationFastAPIAPI layer (teammate)DockerEnvironment consistency (teammate)GitVersion control