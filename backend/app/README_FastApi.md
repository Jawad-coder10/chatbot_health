# README FastAPI

Ce document résume la partie FastAPI mise en place pour le projet chatbot health.

## Ce qui a été ajouté

- `schemas.py` : définit les modèles Pydantic pour les entrées et les sorties de l'API.
- `pipeline.py` : orchestre le traitement du texte avec un flux simple de prétraitement, détection d'intention et extraction d'entités.
- `main.py` : expose les endpoints HTTP FastAPI.

## Flux principal

1. Le client envoie un texte via `POST /predict`.
2. `schemas.py` valide la requête avec `TextRequest`.
3. `pipeline.py` traite le texte et retourne :
   - `intent`
   - `entities`
   - `confidence`
   - `input_language`
4. `main.py` renvoie la réponse au format `PredictionResponse`.

## Entités extraites

- `medication` : nom du médicament détecté.
- `quantity` : quantité demandée.
- `symptom` : symptôme mentionné.

## Intents ciblés

- `medication_request`
- `symptom_description`
- `quantity_request`
- `information_request`

## Endpoints disponibles

- `GET /` : vérifie que l'API fonctionne.
- `GET /health` : healthcheck.
- `POST /predict` : renvoie l'intent et les entités extraites.

## Exemple de réponse

```json
{
  "intent": "medication_request",
  "entities": {
    "medication": "doliprane",
    "quantity": "2",
    "symptom": "headache"
  },
  "confidence": 0.94,
  "input_language": "darija"
}
```

## Remarque

La logique actuelle est volontairement simple et rule-based. Elle sert de base propre avant de brancher un vrai modèle ML ou le pipeline final du dataset.