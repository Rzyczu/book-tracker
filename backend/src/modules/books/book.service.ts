import { booksRepository } from './book.repository.js';
import { rowToBook } from './book.model.js';
import type { Book } from './book.types.js';

export const booksService = {
    list(): Book[] {
        return booksRepository.findAll().map(rowToBook);
    },

    create(title: string, author: string): Book {
        const id = booksRepository.insert(title, author);
        const row = booksRepository.findById(id);
        // row nie powinno być undefined, ale dla bezpieczeństwa:
        if (!row) throw new Error('Failed to fetch inserted book');
        return rowToBook(row);
    },

    markRead(id: number): Book {
        const changes = booksRepository.markRead(id);
        if (changes === 0) {
            const err = new Error('Book not found') as any;
            err.status = 404;
            throw err;
        }
        const row = booksRepository.findById(id)!;
        return rowToBook(row);
    },
};
