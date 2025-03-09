import os
from dotenv import load_dotenv

class EnvironmentManager:
    _loaded = False
    
    @classmethod
    def load(cls):
        if not cls._loaded:
            load_dotenv('.env.production' if os.getenv('PROD') else '.env')
            cls._validate()
            cls._loaded = True

    @staticmethod
    def _validate():
        required = ['VERTEX_PROJECT', 'VERTEX_LOCATION', 'REDIS_HOST']
        missing = [var for var in required if not os.getenv(var)]
        if missing:
            raise EnvironmentError(f"Missing critical env vars: {missing}")