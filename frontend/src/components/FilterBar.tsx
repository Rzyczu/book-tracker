import { useId } from 'react';

export type SortKey = 'newest' | 'title-asc' | 'title-desc' | 'author-asc' | 'author-desc';

type Props = {
    query: string;
    onlyUnread: boolean;
    sort: SortKey;
    onQueryChange: (v: string) => void;
    onOnlyUnreadChange: (v: boolean) => void;
    onSortChange: (v: SortKey) => void;
    onClear: () => void;
};

export default function FilterBar({
    query, onlyUnread, sort, onQueryChange, onOnlyUnreadChange, onSortChange, onClear,
}: Props) {
    const qId = useId();
    const cId = useId();
    const sId = useId();

    return (
        <div className="mb-4 card p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                    <label htmlFor={qId} className="mb-1 block text-sm font-medium">Szukaj (tytuł/autor)</label>
                    <input id={qId} className="input" placeholder="np. Martin…" value={query} onChange={(e) => onQueryChange(e.target.value)} />
                </div>

                <div className="sm:w-52">
                    <label htmlFor={sId} className="mb-1 block text-sm font-medium">Sortowanie</label>
                    <select id={sId} className="select" value={sort} onChange={(e) => onSortChange(e.target.value as Props['sort'])}>
                        <option value="newest">Najnowsze (ID ↓)</option>
                        <option value="title-asc">Tytuł A→Z</option>
                        <option value="title-desc">Tytuł Z→A</option>
                        <option value="author-asc">Autor A→Z</option>
                        <option value="author-desc">Autor Z→A</option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor={cId} className="inline-flex items-center gap-2 text-sm">
                        <input id={cId} type="checkbox" className="checkbox" checked={onlyUnread} onChange={(e) => onOnlyUnreadChange(e.target.checked)} />
                        Tylko nieprzeczytane
                    </label>

                    <button type="button" onClick={onClear} className="btn-outline px-3 py-2">Wyczyść</button>
                </div>
            </div>
        </div>
    );
}
