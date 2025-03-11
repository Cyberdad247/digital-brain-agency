import os
import json
from typing import Dict, Optional
from cryptography.fernet import Fernet
from .llm_config import LLMConfig  # Assume we have config loader

class LLMProviderManager:
    def __init__(self, config_path: str = 'llm_config.json'):
        self.config = LLMConfig.load(config_path)
        self.fernet = Fernet(os.getenv('LLM_ENCRYPTION_KEY').encode())
        self.keys_file = os.path.join(os.path.dirname(__file__), 'api_keys.json')
        self._load_keys()

    def _load_keys(self):
        try:
            with open(self.keys_file, 'r') as f:
                encrypted_data = json.load(f)
                self.api_keys = {
                    provider: self._decrypt_data(data)
                    for provider, data in encrypted_data.items()
                }
        except (FileNotFoundError, json.JSONDecodeError):
            self.api_keys = {}

    def _decrypt_data(self, data: dict) -> dict:
        return {
            key: self.fernet.decrypt(value.encode()).decode()
            if key != 'encrypted' else value
            for key, value in data.items()
        }

    def get_credentials(self, provider: str) -> Dict[str, str]:
        config = self.config.providers.get(provider)
        if not config:
            raise ValueError(f'Unsupported provider: {provider}')

        credentials = self.api_keys.get(provider, {})
        credentials.update({
            param: os.getenv(f'{provider.upper()}_{param}')
            for param in config['required_params']
        })

        missing = [p for p in config['required_params'] if not credentials.get(p)]
        if missing:
            raise ValueError(f'Missing required parameters for {provider}: {missing}')

        return credentials

    def add_keys(self, provider: str, keys: Dict[str, str]):
        if provider not in self.config.providers:
            raise ValueError(f'Invalid provider: {provider}')

        encrypted = {
            key: self.fernet.encrypt(value.encode()).decode()
            for key, value in keys.items()
        }
        self.api_keys[provider] = encrypted
        self._save_keys()

    def _save_keys(self):
        with open(self.keys_file, 'w') as f:
            json.dump(self.api_keys, f, indent=2)