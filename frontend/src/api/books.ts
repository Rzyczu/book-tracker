import type { Book } from '../types';
import { api } from './client';

export const booksApi = {
    list(): Promise<Book[]> {
        return api<Book[]>('/books');
    },
};
