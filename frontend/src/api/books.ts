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
    markRead(id: number): Promise<Book> {
        return api<Book>(`/books/${id}/read`, { method: 'PATCH', body: '{}' });
    },
    unmarkRead(id: number) {
        return api<Book>(`/books/${id}/unread`, { method: 'PATCH' });
    },
};
