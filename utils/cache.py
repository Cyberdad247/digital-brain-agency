from functools import lru_cache
import hashlib

def hash_args(args, kwargs) -> str:
    """Create unique hash for function arguments"""
    return hashlib.sha256(
        str((args, sorted(kwargs.items()))).encode()
    ).hexdigest()

def memoize_by_args(maxsize=128):
    def decorator(func):
        @lru_cache(maxsize=maxsize)
        def wrapped(*args, **kwargs):
            return func(*args, **kwargs)
        return wrapped
    return decorator