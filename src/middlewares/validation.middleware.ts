import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

import { ApiFail } from '../errors/api.error';

function formatZodError(error: z.ZodError) {
  return error.errors.map((e) => ({ [e.path.at(1) as string]: e.message }));
}

export function validate(validation: z.AnyZodObject) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await validation.parseAsync(request);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiFail(400, { data: formatZodError(error) }));
      }
    }
  };
}
