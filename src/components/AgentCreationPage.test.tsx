import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgentCreationPage from './AgentCreationPage';
import { useToast } from '../hooks/use-toast';

// Mock the useToast hook
jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock the useAgent hook
jest.mock('../hooks/useAgent', () => ({
  useAgent: () => ({
    createAgent: jest.fn().mockResolvedValue({}),
  }),
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', name: 'Client Management' },
      { id: '2', name: 'Creative Content' },
    ]),
  })
) as jest.Mock;

describe('AgentCreationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<AgentCreationPage />);
    expect(screen.getByLabelText(/Agent Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Specialization:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Agent/i })).toBeInTheDocument();
  });

  it('shows loading state for departments', async () => {
    render(<AgentCreationPage />);
    expect(screen.getByText(/Loading departments.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Select a department/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<AgentCreationPage />);
    fireEvent.click(screen.getByRole('button', { name: /Create Agent/i }));

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Specialization is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Department is required/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    render(<AgentCreationPage />);
    
    // Wait for departments to load
    await waitFor(() => {
      expect(screen.getByText(/Select a department/i)).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Agent Name:/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Specialization:/i), {
      target: { value: 'Digital Marketing' },
    });
    fireEvent.change(screen.getByLabelText(/Department:/i), {
      target: { value: '1' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Agent/i }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'Agent created successfully',
        description: 'The new agent has been added to the system.',
      });
    });
  });

  it('handles department fetch error', async () => {
    // Mock a failed fetch
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<AgentCreationPage />);
    
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'Error loading departments',
        description: 'Failed to load department options. Please try again later.',
        variant: 'destructive',
      });
    });
  });
});
