import { Router } from 'express';

import { bookingsController } from '../controllers/mod';
import { validationMiddleware } from '../middlewares/mod';
import { bookingsValidation } from '../validations/mod';

export const router = Router();

router.get(
  '/',
  validationMiddleware.validate(bookingsValidation.schedule),
  bookingsController.schedule
);

router.post(
  '/',
  validationMiddleware.validate(bookingsValidation.book),
  bookingsController.book
);

router.put(
  '/:bookingNumber',
  validationMiddleware.validate(bookingsValidation.book),
  bookingsController.edit
);

router.get('/:bookingNumber', bookingsController.view);

router.delete('/:bookingNumber', bookingsController.remove);

export { router as bookingsRoute };
