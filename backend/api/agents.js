import express from 'express';
import { z } from 'zod';
import { asyncHandler, AppError } from '../utils/errorHandler';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Validation schema for agent creation
const createAgentSchema = z.object({
  name: z.string().min(2).max(100),
  specialization: z.string().min(2).max(100),
  department: z.string().min(2).max(100),
});

/**
 * @route POST /api/agents
 * @description Create a new agent
 * @access Private
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const validatedData = createAgentSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError(400, 'Invalid input data', validatedData.error.issues);
    }

    const { name, specialization, department } = validatedData.data;

    const newAgent = await prisma.agent.create({
      data: {
        name,
        specialization,
        department,
        createdAt: new Date().toISOString(),
      },
    });

    res.status(201).json({
      success: true,
      data: newAgent,
    });
  })
);

/**
 * @route GET /api/agents
 * @description Get all agents
 * @access Private
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: agents,
    });
  })
);

/**
 * @route GET /api/agents/:id
 * @description Get agent by ID
 * @access Private
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const agent = await prisma.agent.findUnique({
      where: { id: req.params.id },
    });

    if (!agent) {
      throw new AppError(404, 'Agent not found');
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  })
);

export default router;
