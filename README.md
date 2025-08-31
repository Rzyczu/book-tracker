# Book Tracker

A simple book tracker with a **Node.js** (**Express** + **TypeScript** + **SQLite**) backend and a **React** + **TypeScript** frontend.  
You can browse the list, add new books, and mark/unmark them as read. The frontend includes filters, sorting, and a small statistics page.

---

## Tech Stack

- **Backend:** Node.js, Express, TypeScript (ESM/NodeNext), SQLite (better-sqlite3), Zod  
- **Frontend:** React + TypeScript, Vite, TanStack Query, React Router, Tailwind CSS v3 (+ @tailwindcss/forms), React Hook Form + Zod  
- **Backend architecture:** controllers → services → repositories → DB (SQLite)

---

## Quick Start

> **Requirements:**  
> Node **18 / 20 (LTS)** and npm.  
> (Node 23+ can show warnings with some tools; LTS is recommended.)

### 1) Clone the repository
```bash
git clone <YOUR_REPO_URL>
cd book-tracker
```

### 2) Backend — install & run
```bash
cd backend
npm i
# (the first run will create the DB file and the `books` table)
npm run dev
# API: http://localhost:4000
```

**Config (`backend/.env`, optional):**
```env
PORT=4000
DB_FILE=./data/books.db
```

Directory layout (short):
```
backend/src
  app.ts, index.ts
  config/env.ts
  db/{connection.ts,migrate.ts}
  common/{middlewares,errors.ts}
  modules/books/{book.*.ts}
```

### 3) Frontend — install & run
Using a new terminal:
```bash
cd frontend
npm i
npm run dev
# App: http://localhost:5173
```

**Config (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:4000
```

> Run dev in two terminals: one for the backend, one for the frontend.

---

## API (short)

Base URL: `http://localhost:4000`

- `GET /books` → list books
- `POST /books` → add a book  
  body:
  ```json
  { "title": "Clean Code", "author": "Robert C. Martin" }
  ```
- `PATCH /books/:id/read` → mark as read
- `PATCH /books/:id/unread` → unmark as read

**Model:**
```ts
type Book = {
  id: number;
  title: string;
  author: string;
  read: boolean;
};
```

Examples:
```bash
# list
curl http://localhost:4000/books

# add
curl -X POST http://localhost:4000/books   -H "Content-Type: application/json"   -d '{"title":"Clean Code","author":"Robert C. Martin"}'

# mark read
curl -X PATCH http://localhost:4000/books/1/read

# unmark read
curl -X PATCH http://localhost:4000/books/1/unread
```

---

## Frontend Features

- Books list with caching (TanStack Query)
- Add book in a **modal**
- Mark/unmark read (optimistic update + rollback)
- Filters (query, only unread) and sorting
- Filter state synced to **URL** (`?q=&unread=1&sort=...`)
- **Statistics** page (totals, completion %, top authors)

---

## Scripts

### Backend (`backend/package.json`)
- `dev` — start dev server (tsx / ts-node-dev depending on setup)
- `build` — TypeScript build
- `start` — run compiled app

### Frontend (`frontend/package.json`)
- `dev` — Vite dev server
- `build` — `tsc` + `vite build`
- `preview` — preview built app
- `lint` — ESLint

---

## Troubleshooting

- **Missing `books` table on startup:** ensure migrations run **before** preparing statements (this project calls `migrate()` on startup and uses lazy `prepare()` in repositories).
- **`better-sqlite3` typings:** install `@types/better-sqlite3`.
- **TypeScript ESM (NodeNext):** remember local import **`.js`** suffixes in TS (e.g., `import { migrate } from './db/migrate.js'`).
- **`moduleResolution` deprecation:** project uses `NodeNext`; avoid the old `Node` mode.
- **HTTP 400 on `PATCH /read`:** do not send `Content-Type: application/json` without a body; the frontend client sends the header only when `body` exists.
- **Tailwind `@tailwindcss/postcss` / `unknown utility` errors:** this project uses **Tailwind v3**. Ensure:
  - devDeps: `tailwindcss@^3`, `postcss`, `autoprefixer`, `@tailwindcss/forms`
  - `postcss.config.js`:
    ```js
    export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
    ```
  - `tailwind.config.js` (ESM):
    ```js
    import forms from '@tailwindcss/forms';
    export default { content: ['./index.html','./src/**/*.{ts,tsx}'], theme:{extend:{}}, plugins:[forms()] };
    ```
  - clear Vite cache: remove `node_modules/.vite` and run `npm run dev` again.

---


## License

MIT (or your preferred license).
