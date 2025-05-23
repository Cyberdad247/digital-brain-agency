# ONNX Model API

A FastAPI-based API for serving ONNX models with versioning support, monitoring, and CI/CD integration.

## Features

- **Model Versioning**: Support for multiple model versions with automatic latest version selection
- **Prometheus Metrics**: Built-in monitoring for model inference latency and error rates
- **API Documentation**: Swagger UI and ReDoc integration for easy API exploration
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing and deployment
- **Terraform Integration**: Infrastructure as Code with state locking for safe deployments

## Setup

### Prerequisites

- Python 3.10+
- pip

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd digital-brain-agency-clone

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r api/requirements.txt
```

## Running the API

```bash
# Start the API server
cd api
python app.py
```

The API will be available at http://localhost:8000

## API Endpoints

- `GET /`: Root endpoint, returns a welcome message
- `GET /models`: List all available model versions
- `POST /predict`: Run inference on a model
- `GET /metrics`: Prometheus metrics endpoint
- `GET /docs`: Swagger UI documentation
- `GET /redoc`: ReDoc documentation
- `GET /openapi.json`: OpenAPI specification

### Predict Endpoint

The `/predict` endpoint accepts POST requests with the following JSON structure:

```json
{
  "inputs": {
    "input": [1.0, 2.0, 3.0, 4.0]
  },
  "model_version": "latest"
}
```

Where:
- `inputs`: A dictionary of input tensors (names and values)
- `model_version`: Optional, specifies which model version to use (defaults to "latest")

Response:

```json
{
  "outputs": {
    "output": [2.0, 4.0, 6.0, 8.0]
  },
  "model_version": "1.0.0",
  "inference_time_ms": 1.23
}
```

## Model Versioning

Models are versioned using semantic versioning (e.g., 1.0.0, 1.1.0). The model registry is stored in `api/models/model_registry.json`.

To add a new model version, use the CI/CD pipeline with a workflow dispatch event, specifying the new version number.

## Monitoring

The API exposes Prometheus metrics at the `/metrics` endpoint. A Grafana dashboard configuration is provided in `api/monitoring/grafana-dashboard.json`.

Metrics include:
- `predict_requests_total`: Counter of prediction requests by model version and status
- `predict_latency_seconds`: Histogram of prediction latency by model version

## CI/CD Pipeline

The CI/CD pipeline is defined in `.github/workflows/onnx_model_pipeline.yml` and includes:

1. **Testing**: Runs integration tests for the API
2. **Model Building**: Registers new model versions
3. **Deployment**: Deploys the API and infrastructure using Terraform

## Terraform State Locking

Terraform state is stored in an S3 bucket with DynamoDB-based locking to prevent concurrent modifications. The configuration is in `terraform/main.tf`.

## Integration Tests

Integration tests are located in `tests/integration/test_predict_api.py` and can be run with pytest:

```bash
python -m pytest tests/integration/test_predict_api.py -v
```

## License

MIT