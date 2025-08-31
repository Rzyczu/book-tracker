const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...init,
    });

    let payload: any = null;
    try {
        payload = await res.json();
    } catch {
    }

    if (!res.ok) {
        const message = payload?.error ?? `HTTP ${res.status}`;
        throw Object.assign(new Error(message), { status: res.status, payload });
    }
    return payload as T;
}
