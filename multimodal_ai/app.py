from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictionRequest(BaseModel):
    data: dict

@app.post("/predict")
async def predict(request: PredictionRequest):
    # AI logic here
    return {"result": "prediction"}
