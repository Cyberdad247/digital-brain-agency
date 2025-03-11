import requests
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class ApiClient:
    def __init__(self, base_url: str = 'https://api.promptoptimizer.com/v1'):
        self.base_url = base_url
        self.session = requests.Session()
        self.access_token: Optional[str] = None

    def authenticate(self, api_key: str) -> None:
        try:
            response = self.session.post(
                f'{self.base_url}/auth',
                headers={'Authorization': f'Bearer {api_key}'}
            )
            response.raise_for_status()
            self.access_token = response.json().get('access_token')
        except requests.exceptions.RequestException as e:
            logger.error(f"Authentication failed: {str(e)}")
            raise

    def send_request(self, 
                    method: str, 
                    endpoint: str, 
                    data: Optional[Dict[str, Any]] = None,
                    retries: int = 3
                ) -> Dict[str, Any]:
        if not self.access_token:
            raise ValueError("Not authenticated. Call authenticate() first")

        url = f'{self.base_url}/{endpoint}'
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

        for attempt in range(retries):
            try:
                response = self.session.request(
                    method=method,
                    url=url,
                    json=data,
                    headers=headers,
                    timeout=10
                )
                response.raise_for_status()
                return response.json()
            except requests.exceptions.RequestException as e:
                if attempt == retries - 1:
                    logger.error(f"API request failed after {retries} attempts: {str(e)}")
                    raise
                logger.warning(f"API request failed (attempt {attempt+1}), retrying...")