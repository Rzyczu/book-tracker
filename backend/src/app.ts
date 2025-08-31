import express from 'express';
import cors from 'cors';
import { booksRouter } from './modules/books/book.routes.js';
import { notFound } from './common/middlewares/not-found.js';
import { errorHandler } from './common/middlewares/error-handler.js';
import { migrate } from './db/migrate.js';

const app = express();

app.use(cors());
app.use(express.json());

// Migruj schemat przy starcie (prosty use-case)
migrate();

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/books', booksRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
