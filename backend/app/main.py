
from fastapi import FastAPI
from pydantic import BaseModel, Field


class RootResponse(BaseModel):
    message: str = Field(..., example="Chatbot Health backend is running")


class HealthResponse(BaseModel):
    status: str = Field(..., example="ok")


app = FastAPI(title="Chatbot Health API", version="0.1.0")


@app.get("/", response_model=RootResponse, summary="Read Root")
def read_root():
    return {"message": "Chatbot Health backend is running"}


@app.get("/health", response_model=HealthResponse, summary="Health Check")
def health_check():
    return {"status": "ok"}