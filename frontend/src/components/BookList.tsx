import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import type { Book } from '../types';
import BookItem from './BookItem';
import FilterBar, { type SortKey } from './FilterBar';

export default function BookList() {
    const qc = useQueryClient();

    const [query, setQuery] = useState('');
    const [onlyUnread, setOnlyUnread] = useState(false);
    const [sort, setSort] = useState<SortKey>('newest');

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['books'],
        queryFn: () => booksApi.list(),
    });

    const markRead = useMutation({
        mutationFn: (id: number) => booksApi.markRead(id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ['books'] });
            const previous = qc.getQueryData<Book[]>(['books']);
            qc.setQueryData<Book[]>(['books'], (curr) =>
                curr ? curr.map((b) => (b.id === id ? { ...b, read: true } : b)) : curr
            );
            return { previous };
        },
        onError: (_e, _id, ctx) => {
            if (ctx?.previous) qc.setQueryData(['books'], ctx.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ['books'] }),
    });

    const unmarkRead = useMutation({
        mutationFn: (id: number) => booksApi.unmarkRead(id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ['books'] });
            const previous = qc.getQueryData<Book[]>(['books']);
            qc.setQueryData<Book[]>(['books'], (curr) =>
                curr ? curr.map((b) => (b.id === id ? { ...b, read: false } : b)) : curr
            );
            return { previous };
        },
        onError: (_e, _id, ctx) => {
            if (ctx?.previous) qc.setQueryData(['books'], ctx.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ['books'] }),
    });

    const pendingId =
        (markRead.isPending ? markRead.variables : undefined) ??
        (unmarkRead.isPending ? unmarkRead.variables : undefined);

    const filtered = useMemo(() => {
        let rows = (data ?? []).slice();

        if (query.trim()) {
            const q = query.trim().toLowerCase();
            rows = rows.filter(
                (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
            );
        }

        if (onlyUnread) rows = rows.filter((b) => !b.read);

        rows.sort((a, b) => {
            switch (sort) {
                case 'title-asc': return a.title.localeCompare(b.title, 'pl');
                case 'title-desc': return b.title.localeCompare(a.title, 'pl');
                case 'author-asc': return a.author.localeCompare(b.author, 'pl');
                case 'author-desc': return b.author.localeCompare(a.author, 'pl');
                case 'newest':
                default: return b.id - a.id;
            }
        });

        return rows;
    }, [data, query, onlyUnread, sort]);

    const clearFilters = () => {
        setQuery('');
        setOnlyUnread(false);
        setSort('newest');
    };

    return (
        <>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">Twoje książki</h2>
                <button
                    className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    Odśwież
                </button>
            </div>

            {/* Pasek filtrów */}
            <FilterBar
                query={query}
                onlyUnread={onlyUnread}
                sort={sort}
                onQueryChange={setQuery}
                onOnlyUnreadChange={setOnlyUnread}
                onSortChange={setSort}
                onClear={clearFilters}
            />

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
            {!isLoading && !isError && filtered && filtered.length === 0 && (
                <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-600">
                    Brak wyników dla zastosowanych filtrów.
                </div>
            )}

            {/* List */}
            {!isLoading && !isError && filtered && filtered.length > 0 && (
                <ul className="divide-y divide-gray-200 rounded-md border bg-white">
                    {filtered.map((b) => (
                        <BookItem
                            key={b.id}
                            book={b}
                            onMarkRead={(id) => markRead.mutate(id)}
                            onUnmarkRead={(id) => unmarkRead.mutate(id)}
                            isUpdating={pendingId === b.id}
                        />
                    ))}
                </ul>
            )}
        </>
    );
}