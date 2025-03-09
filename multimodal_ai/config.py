import os

# Model configuration
MODEL_PATH = os.path.join('models', 'multimodal_model.pth')
DATA_PATH = os.path.join('data', 'training_data')

# Feature extraction settings
FEATURE_EXTRACTORS = [
    'vision',
    'text',
    'audio'
]

# Prediction settings
PREDICTION_THRESHOLD = 0.7
MAX_PREDICTIONS = 5

# Image processing settings
IMAGE_SIZE = (224, 224)
IMAGE_MEAN = [0.485, 0.456, 0.406]
IMAGE_STD = [0.229, 0.224, 0.225]

# Meeting Copilot settings
MEETING_COPILOT_MODEL = 'path/to/meeting_copilot_model'
MEETING_DATA_PATH = os.path.join('data', 'meeting_data.txt')
MAX_MEETING_CONTENT_LENGTH = 100
MEETING_TEMPERATURE = 0.7

# Logging configuration
LOG_LEVEL = 'INFO'
LOG_FILE = 'multimodal_ai.log'
