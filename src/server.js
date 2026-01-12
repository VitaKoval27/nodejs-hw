// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFound } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import helmet from 'helmet';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json({ limit: '100kb' }));
app.use(cors());
app.use(helmet());

app.use(notesRoutes);

app.use(notFound);
app.use(errorHandler);
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
