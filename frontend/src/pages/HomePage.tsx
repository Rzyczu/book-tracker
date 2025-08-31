import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import AddBookForm from '../components/AddBookForm';
import type { Book } from '../types';

export default function HomePage() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['books'],
        queryFn: () => booksApi.list(),
    });

    const markReadMutation = useMutation({
        mutationFn: (id: number) => booksApi.markRead(id),

        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['books'] });
            const previous = queryClient.getQueryData<Book[]>(['books']);

            queryClient.setQueryData<Book[]>(['books'], (curr) =>
                curr ? curr.map((b) => (b.id === id ? { ...b, read: true } : b)) : curr
            );

            return { previous };
        },

        onError: (_err, _id, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(['books'], ctx.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });

    const unmarkReadMutation = useMutation({
        mutationFn: (id: number) => booksApi.unmarkRead(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['books'] });
            const previous = queryClient.getQueryData<Book[]>(['books']);
            queryClient.setQueryData<Book[]>(['books'], (curr) =>
                curr ? curr.map((b) => (b.id === id ? { ...b, read: false } : b)) : curr
            );
            return { previous };
        },
        onError: (_e, _id, ctx) => { if (ctx?.previous) queryClient.setQueryData(['books'], ctx.previous); },
        onSettled: () => { queryClient.invalidateQueries({ queryKey: ['books'] }); },
    });

    return (
        <div className="p-4">
            <header className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Book Tracker</h1>
                <button
                    className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    Odśwież
                </button>
            </header>

            {/* Formularz */}
            <AddBookForm />

            {/* Loading */}
            {isLoading && (
                <ul className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <li key={i} className="h-10 animate-pulse rounded-md bg-gray-200" />
                    ))}
                </ul>
            )}

            {/* Error */}
            {isError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    Błąd pobierania listy: {(error as Error).message}
                </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && data && data.length === 0 && (
                <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-600">
                    Brak książek. Dodaj pierwszą pozycję powyżej.
                </div>
            )}

            {/* List */}
            {!isLoading && !isError && data && data.length > 0 && (
                <ul className="divide-y divide-gray-200 rounded-md border bg-white">
                    {data.map((b) => {
                        const isMarking = markReadMutation.isPending && markReadMutation.variables === b.id;
                        const isUnmarking = unmarkReadMutation.isPending && unmarkReadMutation.variables === b.id;

                        return (
                            <li key={b.id} className="flex items-center justify-between p-3">
                                <div>
                                    <div className="font-medium">{b.title}</div>
                                    <div className="text-xs text-gray-500">autor: {b.author}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={'rounded-full px-2 py-0.5 text-xs ' + (b.read ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}
                                    >
                                        {b.read ? 'Przeczytana' : 'Nieprzeczytana'}
                                    </span>

                                    {!b.read ? (
                                        <button
                                            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                                            onClick={() => markReadMutation.mutate(b.id)}
                                            disabled={isMarking}
                                        >
                                            {isMarking ? 'Oznaczanie…' : 'Oznacz jako przeczytaną'}
                                        </button>
                                    ) : (
                                        <button
                                            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                                            onClick={() => unmarkReadMutation.mutate(b.id)}
                                            disabled={isUnmarking}
                                        >
                                            {isUnmarking ? 'Cofanie…' : 'Oznacz jako nieprzeczytaną'}
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
