import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';

import type { Book } from '../types';

const Schema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
    author: z.string().min(1, 'Author is required').max(200, 'Name is too long'),
});
type FormValues = z.infer<typeof Schema>;

export default function AddBookForm({ onSuccess }: { onSuccess?: (b: Book) => void }) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: { title: '', author: '' },
        mode: 'onBlur',
    });

    const { isSubmitting, errors } = formState;

    const mutation = useMutation({
        mutationFn: (vals: FormValues) => booksApi.add(vals),
        onSuccess: (created: Book) => {
            queryClient.setQueryData<Book[]>(['books'], (prev) => (prev ? [created, ...prev] : [created]));
            reset();
            onSuccess?.(created);
        },
    });

    return (
        <form onSubmit={handleSubmit((vals) => mutation.mutate(vals))}>
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium">Title</label>
                    <input className="input" placeholder="e.g. Clean Code" {...register('title')} autoFocus />
                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Author</label>
                    <input className="input" placeholder="e.g. Robert C. Martin" {...register('author')} />
                    {errors.author && <p className="mt-1 text-xs text-red-600">{errors.author.message}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button type="submit" disabled={isSubmitting || mutation.isPending} className="btn-primary px-4 py-2">
                    {mutation.isPending ? 'Adding...' : 'Done'}
                </button>
                {mutation.isError && <span className="text-sm text-red-700">{(mutation.error as Error).message}</span>}
            </div>
        </form>
    );

}
