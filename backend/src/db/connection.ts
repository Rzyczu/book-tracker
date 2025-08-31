import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';

const dbPath = path.resolve(process.cwd(), env.DB_FILE);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath); // synchroniczny, szybki do małego API

// Włącz foreign_keys, journal mode itp. (na przyszłość)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
