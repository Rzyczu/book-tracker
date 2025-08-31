import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import type { Book } from '../types';

const Schema = z.object({
    title: z.string().min(1, 'Tytuł jest wymagany').max(200, 'Za długi tytuł'),
    author: z.string().min(1, 'Autor jest wymagany').max(200, 'Za długie nazwisko'),
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
                    <label className="mb-1 block text-sm font-medium">Tytuł</label>
                    <input
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
                        placeholder="np. Clean Code"
                        {...register('title')}
                        autoFocus
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Autor</label>
                    <input
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
                        placeholder="np. Robert C. Martin"
                        {...register('author')}
                    />
                    {errors.author && <p className="mt-1 text-xs text-red-600">{errors.author.message}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting || mutation.isPending}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                    {mutation.isPending ? 'Dodawanie…' : 'Dodaj'}
                </button>
                {mutation.isError && (
                    <span className="text-sm text-red-700">{(mutation.error as Error).message}</span>
                )}
            </div>
        </form>
    );
}
