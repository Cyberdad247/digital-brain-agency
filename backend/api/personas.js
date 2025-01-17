import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const staffDir = path.join(currentDir, '..', 'personas');
    
    // Ensure directory exists
    if (!fs.existsSync(staffDir)) {
      console.warn(`Personas directory not found: ${staffDir}`);
      return res.status(404).json({ error: 'Personas directory not found' });
    }

    // Get all files and filter for JSON files
    const files = fs.readdirSync(staffDir);
    const personas = files
      .filter(file => {
        const filePath = path.join(staffDir, file);
        return fs.statSync(filePath).isFile() && file.endsWith('.json');
      })
      .map(file => {
        try {
          const filePath = path.join(staffDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const persona = JSON.parse(content);
          return {
            id: file.replace('.json', ''),
            ...persona
          };
        } catch (error) {
          console.error(`Error processing persona file ${file}:`, error);
          return null;
        }
      })
      .filter(persona => persona !== null); // Remove any failed persona loads

    res.status(200).json(personas);
  } catch (error) {
    console.error('Error reading personas:', error);
    res.status(500).json({ error: 'Failed to load personas' });
  }
});

export default router;
