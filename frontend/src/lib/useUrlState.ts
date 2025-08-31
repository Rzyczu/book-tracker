import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortKey = 'newest' | 'title-asc' | 'title-desc' | 'author-asc' | 'author-desc';

const SORT_VALUES: SortKey[] = ['newest', 'title-asc', 'title-desc', 'author-asc', 'author-desc'];

function normalizeSort(v: string | null): SortKey {
    return SORT_VALUES.includes(v as SortKey) ? (v as SortKey) : 'newest';
}

export function useUrlState() {
    const [params, setParams] = useSearchParams();

    const q = params.get('q') ?? '';
    const unread = params.get('unread') === '1';
    const sort = normalizeSort(params.get('sort'));

    const setParam = useCallback(
        (key: string, value: string | null) => {
            const next = new URLSearchParams(params);
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
            setParams(next, { replace: true });
        },
        [params, setParams]
    );

    const setQ = useCallback((value: string) => setParam('q', value.trim()), [setParam]);
    const setUnread = useCallback((value: boolean) => setParam('unread', value ? '1' : null), [setParam]);
    const setSort = useCallback((value: SortKey) => setParam('sort', value), [setParam]);

    const clearAll = useCallback(() => {
        const next = new URLSearchParams(params);
        next.delete('q');
        next.delete('unread');
        next.delete('sort');
        setParams(next, { replace: true });
    }, [params, setParams]);

    return { q, unread, sort, setQ, setUnread, setSort, clearAll };
}
