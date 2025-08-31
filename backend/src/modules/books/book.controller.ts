import { Request, Response } from 'express';
import { booksService } from './book.service.js';
import { BookCreateInput } from './book.schema.js';

export const booksController = {
    list: (_req: Request, res: Response) => {
        const data = booksService.list();
        res.json(data);
    },

    create: (req: Request<{}, {}, BookCreateInput>, res: Response) => {
        const { title, author } = req.body;
        const book = booksService.create(title, author);
        res.status(201).json(book);
    },

    markRead: (req: Request<{ id: string }>, res: Response) => {
        const id = Number(req.params.id);
        const book = booksService.markRead(id);
        res.json(book);
    },

    unmarkRead: (req: Request<{ id: string }>, res: Response) => {
        const id = Number(req.params.id);
        const book = booksService.unmarkRead(id);
        res.json(book);
    },
};
