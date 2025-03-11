\"""Model Registry for Magma Integration

This module provides a registry for managing different variants of the Magma model
and their configurations for different spatial-temporal intelligence tasks.
"""

from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
import os
import json

@dataclass
class MagmaModelConfig:
    """Configuration for a Magma model variant"""
    model_id: str
    model_name: str
    model_size: str  # e.g., "8B", "30B"
    model_type: str  # e.g., "SoM" (Set-of-Mark), "ToM" (Trace-of-Mark), "hybrid"
    checkpoint_path: Optional[str] = None
    huggingface_repo: Optional[str] = None
    quantization: Optional[str] = None  # e.g., "int8", "int4", "none"
    device: str = "cuda"  # "cuda", "cpu", etc.
    context_length: int = 4096
    vision_resolution: Optional[int] = None  # For image/video processing
    additional_params: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.additional_params is None:
            self.additional_params = {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert config to dictionary"""
        return {
            "model_id": self.model_id,
            "model_name": self.model_name,
            "model_size": self.model_size,
            "model_type": self.model_type,
            "checkpoint_path": self.checkpoint_path,
            "huggingface_repo": self.huggingface_repo,
            "quantization": self.quantization,
            "device": self.device,
            "context_length": self.context_length,
            "vision_resolution": self.vision_resolution,
            "additional_params": self.additional_params
        }
    
    @classmethod
    def from_dict(cls, config_dict: Dict[str, Any]) -> 'MagmaModelConfig':
        """Create config from dictionary"""
        return cls(
            model_id=config_dict.get("model_id", ""),
            model_name=config_dict.get("model_name", ""),
            model_size=config_dict.get("model_size", ""),
            model_type=config_dict.get("model_type", ""),
            checkpoint_path=config_dict.get("checkpoint_path"),
            huggingface_repo=config_dict.get("huggingface_repo"),
            quantization=config_dict.get("quantization"),
            device=config_dict.get("device", "cuda"),
            context_length=config_dict.get("context_length", 4096),
            vision_resolution=config_dict.get("vision_resolution"),
            additional_params=config_dict.get("additional_params", {})
        )

class MagmaModelRegistry:
    """Registry for managing Magma model variants"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.models: Dict[str, MagmaModelConfig] = {}
        self.config_path = config_path
        self._initialize_default_models()
        
        if config_path and os.path.exists(config_path):
            self.load_from_file(config_path)
    
    def _initialize_default_models(self):
        """Initialize registry with default model configurations"""
        # Magma-8B for spatial perception (SoM)
        self.register_model(MagmaModelConfig(
            model_id="magma-8b-som",
            model_name="Magma-8B-SoM",
            model_size="8B",
            model_type="SoM",
            huggingface_repo="microsoft/magma-8b",
            device="cuda",
            vision_resolution=1024,
            additional_params={
                "task_type": "spatial_perception",
                "supports_ui_automation": True,
                "supports_robotics": True
            }
        ))
        
        # Magma-8B for temporal planning (ToM)
        self.register_model(MagmaModelConfig(
            model_id="magma-8b-tom",
            model_name="Magma-8B-ToM",
            model_size="8B",
            model_type="ToM",
            huggingface_repo="microsoft/magma-8b",
            device="cuda",
            vision_resolution=1024,
            additional_params={
                "task_type": "temporal_planning",
                "supports_action_sequences": True,
                "supports_video_analysis": True
            }
        ))
        
        # Magma-8B quantized for edge deployment
        self.register_model(MagmaModelConfig(
            model_id="magma-8b-edge",
            model_name="Magma-8B-Edge",
            model_size="8B",
            model_type="hybrid",
            huggingface_repo="microsoft/magma-8b",
            quantization="int8",
            device="cuda",
            vision_resolution=512,  # Lower resolution for edge devices
            additional_params={
                "optimized_for_edge": True,
                "min_memory_requirement": "8GB"
            }
        ))
    
    def register_model(self, config: MagmaModelConfig) -> None:
        """Register a new model configuration"""
        self.models[config.model_id] = config
    
    def get_model_config(self, model_id: str) -> Optional[MagmaModelConfig]:
        """Get a model configuration by ID"""
        return self.models.get(model_id)
    
    def list_models(self, model_type: Optional[str] = None) -> List[MagmaModelConfig]:
        """List all registered models, optionally filtered by type"""
        if model_type:
            return [config for config in self.models.values() if config.model_type == model_type]
        return list(self.models.values())
    
    def save_to_file(self, file_path: Optional[str] = None) -> None:
        """Save registry to a JSON file"""
        save_path = file_path or self.config_path
        if not save_path:
            raise ValueError("No file path provided for saving registry")
        
        # Convert models to dictionaries
        models_dict = {model_id: config.to_dict() for model_id, config in self.models.items()}
        
        # Save to file
        with open(save_path, 'w') as f:
            json.dump(models_dict, f, indent=2)
    
    def load_from_file(self, file_path: Optional[str] = None) -> None:
        """Load registry from a JSON file"""
        load_path = file_path or self.config_path
        if not load_path or not os.path.exists(load_path):
            return
        
        try:
            with open(load_path, 'r') as f:
                models_dict = json.load(f)
            
            # Convert dictionaries to model configs
            for model_id, config_dict in models_dict.items():
                self.models[model_id] = MagmaModelConfig.from_dict(config_dict)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading model registry from {load_path}: {e}")
    
    def get_recommended_model(self, task_type: str, constraints: Optional[Dict[str, Any]] = None) -> Optional[MagmaModelConfig]:
        """Get a recommended model for a specific task type and constraints"""
        constraints = constraints or {}
        
        # Filter models by task type
        suitable_models = []
        for config in self.models.values():
            additional_params = config.additional_params or {}
            
            # Check if model supports the task type
            if task_type == "spatial_perception" and config.model_type in ["SoM", "hybrid"]:
                suitable_models.append(config)
            elif task_type == "temporal_planning" and config.model_type in ["ToM", "hybrid"]:
                suitable_models.append(config)
            elif task_type == "ui_automation" and additional_params.get("supports_ui_automation", False):
                suitable_models.append(config)
            elif task_type == "robotics" and additional_params.get("supports_robotics", False):
                suitable_models.append(config)
        
        if not suitable_models:
            return None
        
        # Apply constraints
        for constraint, value in constraints.items():
            if constraint == "edge_deployment" and value is True:
                suitable_models = [m for m in suitable_models if m.additional_params.get("optimized_for_edge", False)]
            elif constraint == "max_model_size":
                suitable_models = [m for m in suitable_models if self._parse_model_size(m.model_size) <= value]
            elif constraint == "quantization_required" and value is True:
                suitable_models = [m for m in suitable_models if m.quantization is not None]
        
        if not suitable_models:
            return None
        
        # Return the first suitable model (could implement more sophisticated selection logic)
        return suitable_models[0]
    
    def _parse_model_size(self, size_str: str) -> float:
        """Parse model size string (e.g., '8B') to a numeric value"""
        try:
            if size_str.endswith('B'):
                return float(size_str[:-1])
            return float(size_str)
        except ValueError:
            return float('inf')  # Return infinity if parsing fails

# Example usage
def example_usage():
    # Initialize registry
    registry = MagmaModelRegistry()
    
    # List all models
    all_models = registry.list_models()
    print(f"Found {len(all_models)} registered models:")
    for model in all_models:
        print(f"  - {model.model_name} ({model.model_size}, {model.model_type})")
    
    # Get recommended model for UI automation on edge device
    edge_model = registry.get_recommended_model(
        task_type="ui_automation",
        constraints={"edge_deployment": True}
    )
    
    if edge_model:
        print(f"\nRecommended model for edge UI automation: {edge_model.model_name}")
        print(f"  - Size: {edge_model.model_size}")
        print(f"  - Quantization: {edge_model.quantization}")
        print(f"  - HuggingFace repo: {edge_model.huggingface_repo}")

if __name__ == "__main__":
    example_usage()