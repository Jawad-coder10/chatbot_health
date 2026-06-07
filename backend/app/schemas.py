# app/schemas.py

from typing import Optional, Dict
from pydantic import BaseModel, Field


# ENTITÉS — alignées exactement avec entity_extractor.py
class Entities(BaseModel):
    """
    Entités extraites selon l'intention détectée.
    Chaque champ est optionnel car il dépend de l'intention.

    Mapping intentions → entités (entity_extractor.py) :

    medication_request     → medication, quantity, frequency
    symptom_description    → symptom, body_part
    demande_posologie      → medication, frequency, duration
    demande_consultation   → specialite, lieu
    demande_prix           → medication, lieu
    remboursement_mutuelle → medication, assurance
    urgence                → urgence_type, body_part
    unknown                → tous les champs (fallback)
    """

    #  medication_request / demande_posologie / demande_prix
    medication: Optional[str] = Field(
        None,
        example="Doliprane",
        description="Nom du médicament détecté"
    )

    #  medication_request / demande_posologie
    quantity: Optional[str] = Field(
        None,
        example="3 boites",
        description="Quantité détectée (ex: 2 comprimés, 1 boite)"
    )
    frequency: Optional[str] = Field(
        None,
        example="2 fois par jour",
        description="Fréquence de prise (ex: 3 fois f nhar)"
    )

    #  demande_posologie
    duration: Optional[str] = Field(
        None,
        example="7 jours",
        description="Durée du traitement (ex: 5 jours, 2 semaines)"
    )

    #  symptom_description / urgence
    symptom: Optional[str] = Field(
        None,
        example="maux de tête",
        description="Symptôme détecté"
    )
    body_part: Optional[str] = Field(
        None,
        example="tête",
        description="Partie du corps concernée"
    )

    #  urgence
    urgence_type: Optional[str] = Field(
        None,
        example="accident",
        description="Type d'urgence détecté"
    )

    #  demande_consultation
    specialite: Optional[str] = Field(
        None,
        example="cardiologue",
        description="Spécialité médicale demandée"
    )

    #  demande_consultation / demande_prix
    lieu: Optional[str] = Field(
        None,
        example="pharmacie Agdal",
        description="Lieu mentionné (pharmacie, hôpital...)"
    )

    #  remboursement_mutuelle
    assurance: Optional[str] = Field(
        None,
        example="CNOPS",
        description="Organisme d'assurance mentionné"
    )

# REQUÊTE — ce que le frontend envoie
class TextRequest(BaseModel):
    """
    Corps de la requête POST /predict.
    Le frontend envoie uniquement le texte du patient.
    """
    text: str = Field(
        ...,
        example="bghit doliprane 3 boites",
        description="Message du patient en Arabe, Darija ou Français"
    )

# RÉPONSE — ce que l'API retourne
class PredictionResponse(BaseModel):
    """
    Réponse JSON retournée par POST /predict.

    Exemple complet :
    {
        "intent":         "medication_request",
        "confidence":     0.92,
        "input_language": "darija",
        "entities": {
            "medication":   "Doliprane",
            "quantity":     "3 boites",
            "frequency":    null,
            "duration":     null,
            "symptom":      null,
            "body_part":    null,
            "urgence_type": null,
            "specialite":   null,
            "lieu":         null,
            "assurance":    null
        }
    }
    """

    intent: str = Field(
        ...,
        example="medication_request",
        description=(
            "Intention détectée. Valeurs possibles : "
            "medication_request, symptom_description, "
            "demande_posologie, demande_consultation, "
            "demande_prix, remboursement_mutuelle, "
            "urgence, unknown"
        )
    )

    confidence: float = Field(
        ...,
        example=0.92,
        description="Score de confiance entre 0 et 1"
    )

    input_language: str = Field(
        ...,
        example="darija",
        description="Langue détectée : arabic, darija, french, other"
    )

    entities: Entities = Field(
        ...,
        description="Entités extraites selon l'intention détectée"
    )