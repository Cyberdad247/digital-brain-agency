from typing import Dict, Any
import redis
from redlock import Redlock
from .message_broker import MessageBroker

class SharedMemoryManager:
    def __init__(self, broker: MessageBroker, namespace: str = 'global'):
        self.redis = redis.Redis()
        self.redlock = Redlock([{'host': 'localhost', 'port': 6379}])
        self.broker = broker
        self.namespace = namespace
        self.local_cache: Dict[str, Any] = {}

    def write(self, key: str, value: Any, sync: bool = True) -> None:
        """Write to shared memory with optional synchronization"""
        with self.acquire_lock(f'{self.namespace}:{key}'):
            self.local_cache[key] = value
            self.redis.set(f'{self.namespace}:{key}', json.dumps(value))
            if sync:
                self.sync(key)

    def read(self, key: str) -> Any:
        """Read from shared memory with local cache check"""
        if key in self.local_cache:
            return self.local_cache[key]
        
        value = self.redis.get(f'{self.namespace}:{key}')
        if value:
            self.local_cache[key] = json.loads(value)
        return self.local_cache.get(key)

    def acquire_lock(self, resource: str, ttl: int = 3000) -> Any:
        """Distributed lock acquisition for concurrent access"""
        return self.redlock.lock(resource, ttl)

    def sync(self, key: str) -> None:
        """Broadcast memory updates through the message broker"""
        self.broker.broadcast_system_message(
            'memory_update',
            {
                'namespace': self.namespace,
                'key': key,
                'value': self.local_cache[key]
            }
        )

    def register_handler(self, context: str = 'memory_update') -> None:
        """Register callback for memory synchronization events"""
        self.broker.subscribe_to_context(context, self._handle_memory_update)

    def _handle_memory_update(self, message: Dict[str, Any]) -> None:
        """Update local cache from broadcasted memory changes"""
        if message['payload']['namespace'] == self.namespace:
            self.local_cache[message['payload']['key']] = message['payload']['value']