import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import pytest
import z3
from terraform.dependency_resolver import TerraformDependencyResolver

@pytest.fixture
def simple_graph():
    return {
        'a': [],
        'b': ['a'],
        'c': ['b'],
        'd': ['c']
    }

@pytest.fixture
def timeout_graph():
    return {f'r{i}': [f'r{i-1}'] for i in range(1, 100)}

@pytest.fixture
def cyclic_graph():
    return {
        'a': ['b'],
        'b': ['c'],
        'c': ['a']
    }

def test_sat_solver_resolution(simple_graph):
    resolver = TerraformDependencyResolver('.', parse_files=False)
    resolver.dependency_graph = simple_graph
    order = resolver.resolve_conflicts()
    
    # Verify dependency order
    order_dict = {res: idx for res, idx in order}
    assert order_dict['a'] < order_dict['b']
    assert order_dict['b'] < order_dict['c']
    assert order_dict['c'] < order_dict['d']

def test_timeout_fallback(timeout_graph):
    resolver = TerraformDependencyResolver('.', parse_files=False)
    resolver.timeout = 1  # Force timeout
    resolver.dependency_graph = timeout_graph
    order = resolver.resolve_conflicts()
    
    # Should fallback to topological sort
    assert len(order) == len(timeout_graph)

def test_cyclic_dependency_handling(cyclic_graph):
    resolver = TerraformDependencyResolver('.', parse_files=False)
    resolver.dependency_graph = cyclic_graph
    order = resolver.resolve_conflicts()
    
    # Should handle cycle with topological sort
    assert len(order) == 3
    order_dict = {res: idx for res, idx in order}
    assert all(isinstance(idx, int) for _, idx in order)
    assert len({res for res, _ in order}) == 3  # All resources present