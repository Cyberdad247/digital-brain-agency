from typing import Dict, Callable, Any
import redis
from concurrent.futures import ThreadPoolExecutor

class MessageBroker:
    def __init__(self, host: str = 'localhost', port: int = 6379):
        self.redis = redis.Redis(host=host, port=port)
        self.executor = ThreadPoolExecutor(max_workers=10)
        self.subscriptions: Dict[str, Callable[[Dict[str, Any]], None]] = {}
        self.context_routing: Dict[str, List[Callable[[Dict[str, Any]], None]]] = {}

    def publish(self, channel: str, message: Dict[str, Any]) -> None:
        """Publish a message to a specific channel"""
        self.redis.publish(channel, json.dumps(message))

    def subscribe(self, channel: str, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Subscribe to a channel with a callback handler"""
        self.subscriptions[channel] = callback
        self.executor.submit(self._listen, channel)

    def _listen(self, channel: str) -> None:
        """Internal method to continuously listen on a channel"""
        pubsub = self.redis.pubsub()
        pubsub.subscribe(channel)
        for message in pubsub.listen():
            if message['type'] == 'message':
                data = json.loads(message['data'])
                if channel in self.subscriptions:
                    self.subscriptions[channel](data)

    def route_message(self, sender_id: str, context: str, payload: Dict[str, Any]) -> None:
        """Route messages based on task context"""
        receivers = self._evaluate_context(context, payload)
        message = {
            'sender': sender_id,
            'context': context,
            'timestamp': time.time(),
            'payload': payload
        }
        for receiver_id in receivers:
            channel = f"agent:{receiver_id}"
            self.publish(channel, message)

    def subscribe_to_context(self, context: str, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Subscribe to messages matching specific context"""
        if context not in self.context_routing:
            self.context_routing[context] = []
        self.context_routing[context].append(callback)

    def _evaluate_context(self, context: str, payload: Dict[str, Any]) -> List[str]:
        """Determine appropriate receivers based on context"""
        # Default implementation routes to all context subscribers
        # Can be enhanced with ML models for intelligent routing
        return [sub for sub in self.context_routing.get(context, [])]

    def _handle_context_message(self, message: Dict[str, Any]) -> None:
        """Dispatch context-based messages to subscribers"""
        context = message.get('context')
        if context and context in self.context_routing:
            for handler in self.context_routing[context]:
                self.executor.submit(handler, message)

    def broadcast_system_message(self, message_type: str, payload: Dict[str, Any]) -> None:
        """Broadcast system-wide notifications"""
        self.publish('system:notifications', {
            'type': message_type,
            'payload': payload,
            'timestamp': time.time()
        })