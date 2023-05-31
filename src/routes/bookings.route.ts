import { Router } from 'express';

import { bookingsController } from '../controllers/mod';
import { validationMiddleware } from '../middlewares/mod';
import { bookingsValidation } from '../validations/mod';

export const router = Router();

router.post(
  '/',
  validationMiddleware.validate(bookingsValidation.book),
  bookingsController.book
);

export { router as bookingsRoute };