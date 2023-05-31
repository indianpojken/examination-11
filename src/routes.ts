import { Router } from 'express';

import { bookingsRoute } from './routes/bookings.route';

export const routes = Router();

routes.use('/bookings', bookingsRoute);
