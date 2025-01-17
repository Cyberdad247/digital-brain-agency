import express from 'express';
const router = express.Router();

/**
 * @route POST /api/agents
 * @description Create a new agent
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { name, specialization, department } = req.body;
    
    // TODO: Add validation
    // TODO: Add database persistence
    
    const newAgent = {
      id: Date.now().toString(),
      name,
      specialization, 
      department,
      createdAt: new Date().toISOString()
    };

    res.status(201).json(newAgent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ message: 'Failed to create agent' });
  }
});

export default router;
