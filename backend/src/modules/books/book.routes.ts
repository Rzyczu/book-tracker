import { Router } from 'express';
import { booksController } from './book.controller.js';
import { validateBody } from '../../common/middlewares/validate.js';
import { BookCreateSchema, BookMarkReadSchema } from './book.schema.js';

export const booksRouter = Router();

booksRouter.get('/', booksController.list);
booksRouter.post('/', validateBody(BookCreateSchema), booksController.create);
booksRouter.patch('/:id/read', validateBody(BookMarkReadSchema), booksController.markRead);
booksRouter.patch('/:id/unread', booksController.unmarkRead);
