import { useEffect, useRef } from 'react';

type ModalProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // hooki ZAWSZE się wywołują; logika w środku zależna od `open`
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: 720,
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                    outline: 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '12px 16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{title ?? 'Dialog'}</h3>
                    <button
                        onClick={onClose}
                        aria-label="Zamknij"
                        style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 8px', background: 'white', cursor: 'pointer' }}
                    >
                        ✕
                    </button>
                </div>
                <div style={{ padding: 16 }}>{children}</div>
            </div>
        </div>
    );
}
