import type { Book } from '../types';

type Props = {
    book: Book;
    onMarkRead: (id: number) => void;
    onUnmarkRead: (id: number) => void;
    isUpdating?: boolean;
};

export default function BookItem({ book, onMarkRead, onUnmarkRead, isUpdating }: Props) {
    return (
        <li className="flex items-center justify-between p-3 focus-within:ring-2 focus-within:ring-gray-900/30">
            <div className="min-w-0">
                <div className="truncate font-medium">{book.title}</div>
                <div className="truncate text-xs text-gray-500">Author: {book.author}</div>
            </div>

            <div className="ml-3 flex items-center gap-2">
                <span className={book.read ? 'badge-success' : 'badge-muted'}>
                    {book.read ? 'Read' : 'Unread'}
                </span>

                {book.read ? (
                    <button className="btn-outline px-2 py-1 text-xs" onClick={() => onUnmarkRead(book.id)} disabled={isUpdating} title="Oznacz jako nieprzeczytaną">
                        {isUpdating ? 'Undoing...' : 'Mark as unread'}
                    </button>
                ) : (
                    <button className="btn-outline px-2 py-1 text-xs" onClick={() => onMarkRead(book.id)} disabled={isUpdating} title="Oznacz jako przeczytaną">
                        {isUpdating ? 'Marking...' : 'Mark as read'}
                    </button>
                )}
            </div>
        </li>
    );
}
