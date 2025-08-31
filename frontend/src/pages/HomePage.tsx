import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../api/books';

export default function HomePage() {
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['books'],
        queryFn: () => booksApi.list(),
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
                    Brak książek. Dodaj pierwszą pozycję.
                </div>
            )}

            {/* List */}
            {!isLoading && !isError && data && data.length > 0 && (
                <ul className="divide-y divide-gray-200 rounded-md border bg-white">
                    {data.map((b) => (
                        <li key={b.id} className="flex items-center justify-between p-3">
                            <div>
                                <div className="font-medium">{b.title}</div>
                                <div className="text-xs text-gray-500">autor: {b.author}</div>
                            </div>
                            <span
                                className={
                                    'rounded-full px-2 py-0.5 text-xs ' +
                                    (b.read ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')
                                }
                            >
                                {b.read ? 'Przeczytana' : 'Nieprzeczytana'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
