import type { Book } from '../types';

type Props = {
    book: Book;
    onMarkRead: (id: number) => void;
    onUnmarkRead: (id: number) => void;
    isUpdating?: boolean;
};

export default function BookItem({ book, onMarkRead, onUnmarkRead, isUpdating }: Props) {
    return (
        <li className="flex items-center justify-between p-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <div className="min-w-0">
                <div className="truncate font-medium">{book.title}</div>
                <div className="truncate text-xs text-gray-500">autor: {book.author}</div>
            </div>

            <div className="ml-3 flex items-center gap-2">
                <span
                    className={
                        'rounded-full px-2 py-0.5 text-xs transition ' +
                        (book.read ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')
                    }
                >
                    {book.read ? 'Przeczytana' : 'Nieprzeczytana'}
                </span>

                {book.read ? (
                    <button
                        className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => onUnmarkRead(book.id)}
                        disabled={isUpdating}
                        title="Oznacz jako nieprzeczytaną"
                        aria-label={`Oznacz „${book.title}” jako nieprzeczytaną`}
                    >
                        {isUpdating ? 'Cofanie…' : 'Oznacz jako nieprzeczytaną'}
                    </button>
                ) : (
                    <button
                        className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => onMarkRead(book.id)}
                        disabled={isUpdating}
                        title="Oznacz jako przeczytaną"
                        aria-label={`Oznacz „${book.title}” jako przeczytaną`}
                    >
                        {isUpdating ? 'Oznaczanie…' : 'Oznacz jako przeczytaną'}
                    </button>
                )}
            </div>
        </li>
    );
}
