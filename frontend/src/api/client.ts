const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export function getBaseUrl() {
    return String(BASE).replace(/\/$/, '');
}
