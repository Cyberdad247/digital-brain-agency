// Chat-related schema definitions for clarity. If additional schemas are added, consider separating them into individual files.

import { z } from 'zod';

// Renamed schema to chatSchema for clear intent.
export const chatSchema = z.object({
  userId: z.string().uuid(),
  content: z.string().max(500),
  timestamp: z.date().default(new Date()),
});

// If additional schemas exist, name them accordingly, e.g.,
// export const messageSchema = z.object({
//    // ...schema definition...
// });
