from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import time
import logging
from typing import Dict, List, Optional, Any
import numpy as np
import onnxruntime as ort
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="ONNX Model API",
    description="API for ONNX model inference with versioning support",
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

# Define Prometheus metrics
PREDICT_REQUESTS = Counter(
    'predict_requests_total', 
    'Total number of predict requests', 
    ['model_version', 'status']
)

PREDICT_LATENCY = Histogram(
    'predict_latency_seconds', 
    'Latency of predict requests in seconds',
    ['model_version']
)

# Model registry - stores loaded models
MODEL_REGISTRY = {}

# Define request and response models
class PredictRequest(BaseModel):
    inputs: Dict[str, List[float]]
    model_version: Optional[str] = "latest"

class PredictResponse(BaseModel):
    outputs: Dict[str, List[float]]
    model_version: str
    inference_time_ms: float

class ModelInfo(BaseModel):
    version: str
    path: str
    metadata: Optional[Dict[str, Any]] = None
    active: bool = False

# Model configuration
MODEL_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "models", "model_registry.json")
os.makedirs(os.path.dirname(MODEL_CONFIG_PATH), exist_ok=True)

# Initialize model registry if it doesn't exist
if not os.path.exists(MODEL_CONFIG_PATH):
    with open(MODEL_CONFIG_PATH, "w") as f:
        json.dump({"models": []}, f)

def get_model_registry():
    """Load model registry from file"""
    try:
        with open(MODEL_CONFIG_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading model registry: {e}")
        return {"models": []}

def save_model_registry(registry):
    """Save model registry to file"""
    try:
        with open(MODEL_CONFIG_PATH, "w") as f:
            json.dump(registry, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving model registry: {e}")

def get_model_session(model_version: str = "latest"):
    """Get ONNX model session for the specified version"""
    # Check if model is already loaded
    if model_version in MODEL_REGISTRY:
        return MODEL_REGISTRY[model_version]
    
    # Load model registry
    registry = get_model_registry()
    
    # Find requested model version
    model_info = None
    if model_version == "latest":
        # Find the latest active model
        active_models = [m for m in registry["models"] if m["active"]]
        if active_models:
            model_info = active_models[-1]  # Get the last active model
    else:
        # Find the specific model version
        for model in registry["models"]:
            if model["version"] == model_version and model["active"]:
                model_info = model
                break
    
    if not model_info:
        raise HTTPException(status_code=404, detail=f"Model version {model_version} not found or not active")
    
    try:
        # Load the ONNX model
        model_path = model_info["path"]
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail=f"Model file not found at {model_path}")
        
        # Create ONNX Runtime session
        session = ort.InferenceSession(model_path)
        
        # Store in registry
        MODEL_REGISTRY[model_version] = {
            "session": session,
            "info": model_info
        }
        
        return MODEL_REGISTRY[model_version]
    except Exception as e:
        logger.error(f"Error loading model {model_version}: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

@app.get("/")
async def root():
    return {"message": "ONNX Model API is running. Visit /docs for API documentation."}

@app.get("/models")
async def list_models():
    """List all available model versions"""
    registry = get_model_registry()
    return registry

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """Run inference on the ONNX model"""
    model_version = request.model_version
    start_time = time.time()
    
    try:
        # Get model session
        model_data = get_model_session(model_version)
        session = model_data["session"]
        actual_version = model_data["info"]["version"]
        
        # Prepare input data
        ort_inputs = {}
        for input_name, input_data in request.inputs.items():
            ort_inputs[input_name] = np.array(input_data, dtype=np.float32)
        
        # Run inference
        with PREDICT_LATENCY.labels(actual_version).time():
            ort_outputs = session.run(None, ort_inputs)
        
        # Prepare response
        output_names = [output.name for output in session.get_outputs()]
        outputs = {}
        for i, output_name in enumerate(output_names):
            outputs[output_name] = ort_outputs[i].tolist()
        
        inference_time = (time.time() - start_time) * 1000  # ms
        
        # Record success metric
        PREDICT_REQUESTS.labels(actual_version, "success").inc()
        
        return PredictResponse(
            outputs=outputs,
            model_version=actual_version,
            inference_time_ms=inference_time
        )
    except Exception as e:
        # Record failure metric
        if model_version in MODEL_REGISTRY:
            actual_version = MODEL_REGISTRY[model_version]["info"]["version"]
        else:
            actual_version = model_version
        PREDICT_REQUESTS.labels(actual_version, "error").inc()
        
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
async def metrics():
    """Expose Prometheus metrics"""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    )

@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return get_openapi(title=app.title, version=app.version, routes=app.routes)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)