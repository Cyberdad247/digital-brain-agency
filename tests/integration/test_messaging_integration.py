import pytest
from src.lib.messaging.message_broker import MessageBroker
from src.lib.messaging.shared_memory import SharedMemoryManager
from unittest.mock import Mock

@pytest.fixture
def broker():
    return MessageBroker()

@pytest.fixture
def shared_memory(broker):
    return SharedMemoryManager(broker)

def test_message_routing(broker):
    mock_handler = Mock()
    broker.subscribe_to_context('test_context', mock_handler)
    
    test_message = {
        'sender': 'test_sender',
        'context': 'test_context',
        'payload': {'data': 'test_value'}
    }
    
    broker.route_message('test_sender', 'test_context', test_message['payload'])
    
    mock_handler.assert_called_once()
    received = mock_handler.call_args[0][0]
    assert received['context'] == 'test_context'
    assert received['payload']['data'] == 'test_value'


def test_shared_memory_sync(shared_memory, broker):
    test_key = 'sync_test'
    test_value = {'timestamp': 123456789}
    
    # Write with sync
    shared_memory.write(test_key, test_value)
    
    # Check redis storage
    stored_value = json.loads(shared_memory.redis.get(f'{shared_memory.namespace}:{test_key}'))
    assert stored_value == test_value
    
    # Verify broadcast message
    mock_handler = Mock()
    broker.subscribe_to_context('memory_update', mock_handler)
    shared_memory.sync(test_key)
    
    mock_handler.assert_called_once()
    update_msg = mock_handler.call_args[0][0]['payload']
    assert update_msg['key'] == test_key
    assert update_msg['value'] == test_value