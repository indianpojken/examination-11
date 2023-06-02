import { Router } from 'express';

import { bookingsController } from '../controllers/mod';
import { validationMiddleware } from '../middlewares/mod';
import { bookingsValidation } from '../validations/mod';

export const router = Router();

router.get('/:bookingNumber', bookingsController.getBooking);

router.post(
  '/',
  validationMiddleware.validate(bookingsValidation.book),
  bookingsController.addBooking
);

router.put(
  '/:bookingNumber',
  validationMiddleware.validate(bookingsValidation.book),
  bookingsController.editBooking
);

router.delete('/:bookingNumber', bookingsController.removeBooking);

router.get(
  '/',
  validationMiddleware.validate(bookingsValidation.schedule),
  bookingsController.getBookingSchedule
);

export { router as bookingsRoute };
