import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import type { Book } from '../types';
import BookItem from './BookItem';
import FilterBar, { type SortKey } from './FilterBar';
import { useUrlState } from '../lib/useUrlState';

export default function BookList() {
    const qc = useQueryClient();

    const { q, unread, sort, setQ, setUnread, setSort, clearAll } = useUrlState();
    const [queryInput, setQueryInput] = useState(q);
    useEffect(() => { setQueryInput(q); }, [q]);
    useEffect(() => {
        const t = setTimeout(() => {
            if (queryInput.trim() !== q) setQ(queryInput);
        }, 300);
        return () => clearTimeout(t);
    }, [queryInput, q, setQ]);


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

        if (q.trim()) {
            const ql = q.toLowerCase();
            rows = rows.filter(
                (b) => b.title.toLowerCase().includes(ql) || b.author.toLowerCase().includes(ql)
            );
        }

        if (unread) rows = rows.filter((b) => !b.read);

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
    }, [data, q, unread, sort]);

    return (
        <>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">Your books</h2>
                <button className="btn-outline px-3 py-1" onClick={() => refetch()} disabled={isFetching}>Refresh</button>
            </div>

            <FilterBar
                query={queryInput}
                onlyUnread={unread}
                sort={sort}
                onQueryChange={setQueryInput}
                onOnlyUnreadChange={setUnread}
                onSortChange={setSort}
                onClear={clearAll}
            />

            {isLoading && (
                <ul className="space-y-2">
                    {[...Array(3)].map((_, i) => (<li key={i} className="h-10 skeleton" />))}
                </ul>
            )}

            {isError && (
                <div className="card p-3 text-sm text-red-700 border-red-200 bg-red-50">
                    Error fetching the list: {(error as Error).message}
                </div>
            )}

            {!isLoading && !isError && filtered && filtered.length === 0 && (
                <div className="card p-4 text-sm text-gray-600">No results for the applied filters.</div>
            )}

            {!isLoading && !isError && filtered && filtered.length > 0 && (
                <ul className="card divide-y divide-gray-200">
                    {filtered.map((b) => (
                        <BookItem key={b.id} book={b} onMarkRead={(id) => markRead.mutate(id)} onUnmarkRead={(id) => unmarkRead.mutate(id)} isUpdating={pendingId === b.id} />
                    ))}
                </ul>
            )}
        </>
    )
}
