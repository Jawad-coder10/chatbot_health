from typing import Optional, Dict
from PIL.ImImagePlugin import number
from pydantic import BaseModel, Field

#Cette classe définit les entités extraites du texte, 
#avec des exemples pour la documentation de l'API. Les champs sont optionnels car ils peuvent ne pas être présents dans tous les textes.
class Entities(BaseModel):
    medication: Optional[str] = Field(None, example="doliprane")
    quantity: Optional[str] = Field(None, example="2")
    symptom: Optional[str] = Field(None, example="headache")

#décrit le corps de la requête que tu envoies à /predict. Ici on attend juste un champ text
class TextRequest(BaseModel):
    text: str = Field(..., example="3tini juj dyal doliprane, rani 3andi rasi")

#écrit la réponse JSON renvoyée par l’API, avec intent, entities, confidence, input_language.
class PredictionResponse(BaseModel):
    intent: str = Field(..., example="medication_request")
    entities: Dict[str, Optional[str]] = Field(..., example={"medication": "doliprane", "quantity": "2", "symptom": "headache"})
    confidence: float = Field(..., example=0.94)
    input_language: str = Field(..., example="darija")


