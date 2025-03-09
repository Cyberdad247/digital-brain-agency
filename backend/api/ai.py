from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import json
import os

app = FastAPI()

class AIRequest(BaseModel):
    persona: str
    message: str

class AIResponse(BaseModel):
    response: str
    status: str

@app.get("/")
async def read_root():
    return {"status": "ok", "message": "AI API is running"}

@app.post("/chat", response_model=AIResponse)
async def chat(request: AIRequest):
    try:
        # Load persona configuration
        persona_path = os.path.join(os.path.dirname(__file__), "..", "personas", f"{request.persona}.json")
        
        if not os.path.exists(persona_path):
            raise HTTPException(status_code=400, detail=f"Persona '{request.persona}' not found")
            
        with open(persona_path, 'r') as f:
            persona = json.load(f)
            
        # Here you would typically make a call to your AI service
        # For now, we'll return a simple response
        response = {
            "response": f"Received message: {request.message}",
            "status": "success"
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)