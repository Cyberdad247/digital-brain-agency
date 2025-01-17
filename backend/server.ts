import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);

const app = express();
const PORT = 3001;

// Input validation schema
const chatSchema = z.object({
  message: z.string().min(1).max(1000),
});

// Chatbot state
let isOnline = true;

// Import routers
import personasRouter from './api/personas.js';
import agentsRouter from './api/agents.js';

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/personas', personasRouter);
app.use('/api/agents', agentsRouter);

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Agency data endpoint
app.get('/api/agency-data', (req, res) => {
  if (req.query.mock === 'true') {
    const mockData = {
      metrics: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [12000, 19000, 3000, 5000]
      },
      projects: [
        {
          id: '1',
          name: 'Website Redesign',
          status: 'in-progress',
          progress: 65,
          dueDate: '2024-06-15'
        },
        {
          id: '2',
          name: 'Marketing Campaign',
          status: 'planned',
          progress: 10,
          dueDate: '2024-07-01'
        }
      ],
      employees: [
        {
          id: '1',
          name: 'John Doe',
          completedTasks: 12,
          rating: 4.5,
          department: 'Marketing',
          lastEvaluation: '2024-01-15'
        },
        {
          id: '2',
          name: 'Jane Smith',
          completedTasks: 18,
          rating: 4.8,
          department: 'Development',
          lastEvaluation: '2024-02-01'
        }
      ],
      chatbot: {
        usageData: [120, 150, 200, 180],
        months: ['Jan', 'Feb', 'Mar', 'Apr']
      }
    };
    res.json(mockData);
  } else {
    res.status(501).json({ error: 'Production data not implemented' });
  }
});

// Chatbot toggle endpoint
app.post('/api/chatbot/toggle', (req, res) => {
  isOnline = !isOnline;
  res.json({
    status: 'success',
    mode: isOnline ? 'online' : 'offline',
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // Validate input
    const { message } = chatSchema.parse(req.body);

    const response = { response: 'Chat functionality not implemented yet' };

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Chatbot initialized in', isOnline ? 'online' : 'offline', 'mode');
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
  console.error('Server error:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
