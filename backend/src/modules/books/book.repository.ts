import { db } from '../../db/connection.js';
import type { BookRow } from './book.types.js';

// UWAGA: żadnych prepare na top-level!

function selectAll() {
    return db.prepare<[], BookRow>(`
    SELECT id, title, author, read FROM books ORDER BY id DESC
  `);
}
function selectOne() {
    return db.prepare<[number], BookRow>(`
    SELECT id, title, author, read FROM books WHERE id = ?
  `);
}
function insertStmt() {
    return db.prepare<[string, string]>(`
    INSERT INTO books (title, author) VALUES (?, ?)
  `);
}
function markReadStmt() {
    return db.prepare<[number]>(`
    UPDATE books SET read = 1 WHERE id = ?
  `);
}

export const booksRepository = {
    findAll(): BookRow[] {
        return selectAll().all();
    },
    findById(id: number): BookRow | undefined {
        return selectOne().get(id);
    },
    insert(title: string, author: string): number {
        const res = insertStmt().run(title, author);
        return Number(res.lastInsertRowid);
    },
    markRead(id: number): number {
        const res = markReadStmt().run(id);
        return res.changes;
    },
};
