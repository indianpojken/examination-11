import { Router } from 'express';

import { examplesController } from '../controllers/mod';
import { validationMiddleware } from '../middlewares/mod';
import { examplesValidation } from '../validations/mod';

export const router = Router();

router.get('/', examplesController.exampleOne);

router.post(
  '/',
  validationMiddleware.validate(examplesValidation.example),
  examplesController.exampleTwo
);

export { router as examplesRoute };
