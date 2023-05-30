import { z } from 'zod';

export const example = z.object({
  body: z.object({
    text: z.string(),
  }),
});
