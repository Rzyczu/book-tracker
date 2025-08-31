import { db } from './connection.js';

export function migrate() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0 CHECK (read IN (0,1))
    );
  `);
}
