from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any

from .. import entity_extractor

router = APIRouter()


class EntitiesRequest(BaseModel):
    text: str
    intent: Optional[str] = None


@router.post("/entities", response_model=Dict[str, Any], summary="Extract entities from text")
def entities_endpoint(payload: EntitiesRequest):
    """If `intent` is provided, return intent-specific entities via `extract_entities()`;
    otherwise return all possible entities via `extract_all_entities()`.
    """
    if payload.intent:
        return entity_extractor.extract_entities(payload.text, payload.intent)
    return entity_extractor.extract_all_entities(payload.text)


@router.get("/entities/sample", summary="Sample extraction")
def entities_sample():
    sample = "bghit nchuf cardiologue f rabat"
    return entity_extractor.extract_all_entities(sample)
