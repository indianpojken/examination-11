import { Router } from 'express';

import { examplesRoute } from './routes/examples.route';

export const routes = Router();

routes.use('/examples', examplesRoute);
