from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import logging
import os
import sys
import base64
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_KEY")
if not GEMINI_API_KEY:
    logger.warning("GEMINI_KEY environment variable not set. Gemini API will not function properly.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Create FastAPI app
app = FastAPI(
    title="Digital Brain WebSocket API",
    description="WebSocket API for the Digital Brain voice assistant",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conversation history storage
conversation_store = {}

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_history: Dict[WebSocket, List[Dict[str, Any]]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_history[websocket] = []
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        if websocket in self.connection_history:
            del self.connection_history[websocket]
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
            
    def get_history(self, websocket: WebSocket, max_items: int = 5):
        if websocket not in self.connection_history:
            return []
        return self.connection_history[websocket][-max_items:]
    
    def add_to_history(self, websocket: WebSocket, role: str, content: str, image_url: Optional[str] = None):
        if websocket not in self.connection_history:
            self.connection_history[websocket] = []
        
        entry = {
            "role": role,
            "content": content,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        if image_url:
            entry["image_url"] = image_url
            
        self.connection_history[websocket].append(entry)

manager = ConnectionManager()

# Initialize Gemini models
def get_gemini_model(vision: bool = False):
    try:
        if not GEMINI_API_KEY:
            return None
        
        model_name = 'gemini-pro-vision' if vision else 'gemini-pro'
        return genai.GenerativeModel(model_name)
    except Exception as e:
        logger.error(f"Error initializing Gemini model: {e}")
        return None

# Process message with Gemini
async def process_with_gemini(message: str, history: List[Dict[str, Any]], image_data: Optional[str] = None):
    # Choose the appropriate model based on whether we have an image
    model = get_gemini_model(vision=bool(image_data))
    if not model:
        return "I'm sorry, I'm having trouble connecting to my AI services right now."
    
    try:
        if image_data:
            # Handle multimodal input (text + image)
            # Clean the base64 string if needed
            if image_data.startswith('data:image/'):
                # Extract the actual base64 content
                image_data = image_data.split(',')[1]
            
            # Prepare the multimodal content
            content = [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_data}"
                    }
                },
                {"type": "text", "text": message}
            ]
            
            # Generate response with the vision model
            response = model.generate_content(content)
            return response.text
        else:
            # Text-only processing
            # Format conversation history for Gemini
            formatted_history = []
            for entry in history:
                formatted_history.append({
                    "role": "user" if entry["role"] == "user" else "model",
                    "parts": [entry["content"]]
                })
            
            # Add current message
            formatted_history.append({
                "role": "user",
                "parts": [message]
            })
            
            # Create a chat session
            chat = model.start_chat(history=formatted_history[:-1] if formatted_history else [])
            
            # Generate response
            response = chat.send_message(message)
            return response.text
    except Exception as e:
        logger.error(f"Error generating response with Gemini: {e}")
        return "I'm sorry, I encountered an error processing your request. Please try again."

# WebSocket endpoint for chat
@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            logger.info(f"Message received: {data[:100]}...")  # Log only the first 100 chars to avoid huge logs
            
            try:
                # Parse the message
                message_data = json.loads(data)
                user_message = message_data.get("text", "")
                image_data = message_data.get("image", None)
                
                # Add user message to history
                manager.add_to_history(websocket, "user", user_message, image_data)
                
                # Get conversation history
                history = manager.get_history(websocket)
                
                # Process with Gemini
                ai_response = await process_with_gemini(user_message, history, image_data)
                
                # Add AI response to history
                manager.add_to_history(websocket, "assistant", ai_response)
                
                # Send response back to client
                response = {
                    "message": ai_response
                }
                
                await manager.send_message(json.dumps(response), websocket)
            except json.JSONDecodeError:
                logger.error("Invalid JSON received")
                await manager.send_message(json.dumps({"error": "Invalid JSON"}), websocket)
            except Exception as e:
                logger.error(f"Error processing message: {str(e)}")
                await manager.send_message(json.dumps({"error": str(e)}), websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"message": "WebSocket server is running. Connect to /chat for WebSocket communication."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("websocket_server:app", host="0.0.0.0", port=8000, reload=True)