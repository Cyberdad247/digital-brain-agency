import express from 'express';
import fs from 'fs';
import path from 'path';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { Persona } from '../types/persona.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const personasDir = path.join(currentDir, '..', 'personas');

    // Ensure directory exists
    if (!fs.existsSync(personasDir)) {
      throw new AppError(404, 'Personas directory not found');
    }

    // Get all files and filter for JSON files
    const files = fs.readdirSync(personasDir);
    const personas: Persona[] = files
      .filter((file) => {
        const filePath = path.join(personasDir, file);
        return fs.statSync(filePath).isFile() && file.endsWith('.json');
      })
      .map((file) => {
        try {
          const filePath = path.join(personasDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const persona = JSON.parse(content);
          return {
            id: file.replace('.json', ''),
            ...persona,
          } as Persona;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          throw new AppError(500, `Error processing persona file ${file}: ${message}`);
        }
      });

    res.status(200).json({ success: true, data: personas });
  })
);

export default router;
