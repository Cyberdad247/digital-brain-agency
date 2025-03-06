from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import speech_recognition as sr
import pyttsx3
import base64
import io

app = FastAPI()

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "http://127.0.0.1:8080"],  # Frontend servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize speech recognition and text-to-speech engines
recognizer = sr.Recognizer()
engine = pyttsx3.init()

class ChatMessage(BaseModel):
    message: str
    type: str = "text"  # Can be 'text' or 'voice'
    audio_data: str = ""  # Base64 encoded audio data for voice messages

@app.get("/")
async def read_root():
    return {
        "message": "Welcome to Digital Brain Agency API",
        "version": "1.0.0",
        "description": "A powerful AI-driven digital marketing assistant",
        "endpoints": {
            "/": "Root endpoint - API information",
            "/chat": "Chat endpoint for text and voice interactions"
        }
    }

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        if message.type == "text":
            # Generate a more engaging response based on the message content
            if "services" in message.message.lower():
                response = "We offer a wide range of digital marketing services including AI Strategy, Data Analytics, Growth Marketing, and more. What specific service would you like to learn about?"
            elif "pricing" in message.message.lower():
                response = "Our pricing varies based on your specific needs and requirements. Would you like to schedule a consultation to discuss your project?"
            elif "contact" in message.message.lower():
                response = "You can reach us through our contact form, or feel free to ask me any questions about our services!"
            else:
                response = f"Thank you for your message! How can I help you with your digital marketing needs today?"
            
            return {"response": response, "type": "text"}
        else:
            # Process voice message
            try:
                # Decode base64 audio data
                audio_bytes = base64.b64decode(message.audio_data)
                audio_file = io.BytesIO(audio_bytes)
                
                # Use speech recognition to convert audio to text
                with sr.AudioFile(audio_file) as source:
                    audio = recognizer.record(source)
                    text = recognizer.recognize_google(audio)
                
                # Process the transcribed text
                response = f"I understood: {text}. How can I help you with that?"
                
                # Convert response to speech
                output = io.BytesIO()
                engine.save_to_file(response, output)
                engine.runAndWait()
                output.seek(0)
                audio_data = base64.b64encode(output.read()).decode()
                
                return {
                    "response": response,
                    "type": "voice",
                    "audio_data": audio_data
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error processing voice message: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)