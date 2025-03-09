from google import genai
from google.genai import types
import base64
import hashlib

# Initialize Redis with connection pool
redis_pool = None
if os.getenv("REDIS_ENABLED") == "true":
    try:
        redis_pool = redis.ConnectionPool(
            host=os.getenv("REDIS_HOST"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            max_connections=20
        )
        redis_client = redis.Redis(connection_pool=redis_pool, decode_responses=True)
    except Exception as e:
        print(f"Redis initialization failed: {e}")
        redis_client = None

def generate(prompt: str):
    # Generate cache key from prompt content
    prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()
    cache_key = f"genai:{prompt_hash}"
    
    if redis_client and redis_client.exists(cache_key):
        print("[Cache Hit]")
        return redis_client.get(cache_key)
    
    # Generate fresh content
    full_response = ""
    try:
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                print(chunk.text, end="")
                
    except Exception as e:
        print(f"Error generating content: {str(e)}")

if __name__ == "__main__":
    generate()