import type { Book, BookRow } from './book.types.js';

export function rowToBook(row: BookRow): Book {
    return {
        id: row.id,
        title: row.title,
        author: row.author,
        read: !!row.read,
    };
}
