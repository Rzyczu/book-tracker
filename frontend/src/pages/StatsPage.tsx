import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { computeStats } from '../lib/stats';

export default function StatsPage() {
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['books'],
        queryFn: () => booksApi.list(),
    });

    const stats = data ? computeStats(data) : null;

    return (
        <div className="p-4 container-app">
            <header className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Statistics</h1>
                <button className="btn-outline px-3 py-1" onClick={() => refetch()} disabled={isFetching}>Refresh</button>
            </header>

            {isLoading && (
                <div className="grid gap-3 sm:grid-cols-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
                </div>
            )}

            {isError && (
                <div className="card p-3 text-sm text-red-700 border-red-200 bg-red-50">
                    Failed to fetch date: {(error as Error).message}
                </div>
            )}

            {!isLoading && !isError && stats && (
                <>
                    <section className="mb-4 grid gap-3 sm:grid-cols-4">
                        <StatCard label="All" value={stats.total} />
                        <StatCard label="Read" value={stats.read} />
                        <StatCard label="Unread" value={stats.unread} />
                        <StatCard label="Complete" value={`${stats.completion}%`} />
                    </section>

                    <section className="mb-6 card p-4">
                        <h2 className="mb-2 text-base font-semibold">Reading progress</h2>
                        <div className="h-3 w-full overflow-hidden rounded bg-gray-200">
                            <div className="h-full bg-gray-900 transition-all" style={{ width: `${stats.completion}%` }} aria-label={`Complete ${stats.completion}%`} />
                        </div>
                        <p className="mt-2 text-xs text-gray-600">{stats.read} / {stats.total} books read</p>
                    </section>

                    <section className="card p-4">
                        <h2 className="mb-2 text-base font-semibold">Top authors</h2>
                        {stats.topAuthors.length === 0 ? (
                            <p className="text-sm text-gray-600">No data.</p>
                        ) : (
                            <ul className="space-y-2">
                                {stats.topAuthors.map(({ author, count }) => (
                                    <li key={author}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="truncate pr-3">{author}</span>
                                            <span className="tabular-nums text-gray-600">{count}</span>
                                        </div>
                                        <div className="mt-1 h-2 w-full rounded bg-gray-100">
                                            <div className="h-2 rounded bg-gray-800" style={{ width: `${Math.min(100, (count / stats.topAuthors[0].count) * 100)}%` }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            )}

            {!isLoading && !isError && data && data.length === 0 && (
                <div className="card p-4 text-sm text-gray-600"> No books to compute statistics. Add items on the home page</div>
            )}
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="card p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
    );
}
