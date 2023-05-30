import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { routes } from './routes';

import { errorsMiddleware } from './middlewares/mod';
import { databaseService } from './services/mod';

const app = express();
const port = process.env.PORT || 8000;

const { database } = databaseService;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorsMiddleware.errors);

app.listen(port);
