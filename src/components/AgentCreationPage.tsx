import React, { useState, useEffect } from 'react';
import useAgent from '../hooks/useAgent';
import { 
  AgentData,
  Department,
  ValidationErrors
} from '../types/agentTypes';
import { useToast } from '../hooks/use-toast';

const AgentCreationPage: React.FC = () => {
  const [agentData, setAgentData] = useState<AgentData>({
    name: '',
    specialization: '',
    department: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  const { createAgent, loading, error } = useAgent();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Error loading departments',
          description: 'Failed to load department options. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgentData(prevData => ({ ...prevData, [name]: value }));
    // Clear validation error when user types
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!agentData.name.trim()) {
      errors.name = 'Name is required';
    } else if (agentData.name.length < 2 || agentData.name.length > 50) {
      errors.name = 'Name must be between 2 and 50 characters';
    }

    if (!agentData.specialization.trim()) {
      errors.specialization = 'Specialization is required';
    } else if (!/^[a-zA-Z\s-]+$/.test(agentData.specialization)) {
      errors.specialization = 'Specialization can only contain letters, spaces, and hyphens';
    }

    if (!agentData.department) {
      errors.department = 'Department is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createAgent(agentData);
      if (error) {
        throw new Error(error);
      }
      // Reset form after successful submission
      setAgentData({
        name: '',
        specialization: '',
        department: '',
      });
      setValidationErrors({});
      toast({
        title: 'Agent created successfully',
        description: 'The new agent has been added to the system.',
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      setValidationErrors({
        name: error?.message || 'Failed to create agent. Please try again.',
      });
      toast({
        title: 'Error creating agent',
        description: error?.message || 'There was an error while creating the agent. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="agent-creation-page">
      <h1>Create New Agent</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Agent Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={agentData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="specialization">Specialization:</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={agentData.specialization}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={agentData.department}
            onChange={handleInputChange}
            required
            disabled={isLoadingDepartments}
          >
            <option value="">{isLoadingDepartments ? 'Loading departments...' : 'Select a department'}</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Agent'}
        </button>
      </form>
    </div>
  );
};

export default AgentCreationPage;
