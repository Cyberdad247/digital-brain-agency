
from flask import Flask, request, jsonify
from transformers import pipeline
from PIL import Image
import torch
import os

app = Flask(__name__)

# Initialize AI models
image_processor = pipeline('image-classification')
text_generator = pipeline('text-generation')
voice_recognizer = pipeline('automatic-speech-recognition')

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    try:
        data = request.get_json()
        content_type = data.get('type')
        content = data.get('content')

        if content_type == 'image':
            result = image_processor(content)
        elif content_type == 'text':
            result = text_generator(content, max_length=100)
        elif content_type == 'voice':
            result = voice_recognizer(content)
        else:
            return jsonify({'error': 'Unsupported content type'}), 400

        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)
