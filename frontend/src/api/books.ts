import type { Book } from '../types';
import { api } from './client';

export const booksApi = {
    list(): Promise<Book[]> {
        return api<Book[]>('/books');
    },
    add(input: { title: string; author: string }): Promise<Book> {
        return api<Book>('/books', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },
};
