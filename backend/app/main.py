
from fastapi import FastAPI
from pydantic import BaseModel, Field

from .schemas import TextRequest, PredictionResponse
from . import pipeline


class RootResponse(BaseModel):
    message: str = Field(..., example="Chatbot Health backend is running")


class HealthResponse(BaseModel):
    status: str = Field(..., example="ok")


app = FastAPI(title="Chatbot Health API", version="0.1.0")
from .routers.entities import router as entities_router
app.include_router(entities_router, prefix="/api")


@app.get("/", response_model=RootResponse, summary="Read Root")
def read_root():
    return {"message": "Chatbot Health backend is running"}


@app.get("/health", response_model=HealthResponse, summary="Health Check")
def health_check():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse, summary="Predict intent and extract entities")
def predict_route(req: TextRequest):
    """Accepts a text payload and returns predicted intent+entities."""
    result = pipeline.predict(req.text)
    return result