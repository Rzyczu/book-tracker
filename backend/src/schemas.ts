import { z } from 'zod';

export const BookCreateSchema = z.object({
    title: z.string().min(1),
    author: z.string().min(1),
});

// /books/:id/read 
export const BookMarkReadSchema = z.object({
    read: z.literal(true).optional(),
});

export type BookCreateInput = z.infer<typeof BookCreateSchema>;
