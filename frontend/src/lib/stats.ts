import type { Book } from '../types';

export type Stats = {
    total: number;
    read: number;
    unread: number;
    completion: number;
    topAuthors: { author: string; count: number }[];
};

export function computeStats(books: Book[]): Stats {
    const total = books.length;
    const read = books.filter(b => b.read).length;
    const unread = total - read;
    const completion = total === 0 ? 0 : Math.round((read / total) * 100);

    const map = new Map<string, number>();
    for (const b of books) {
        const key = b.author.trim() || '—';
        map.set(key, (map.get(key) ?? 0) + 1);
    }
    const topAuthors = [...map.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pl'))
        .slice(0, 5)
        .map(([author, count]) => ({ author, count }));

    return { total, read, unread, completion, topAuthors };
}
