import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

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

    const target = document.getElementById('modal-root') ?? document.body;

    return createPortal(
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 animate-overlay"
            onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl outline-none animate-modal"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="card-section flex items-center justify-between">
                    <h3 className="text-base font-semibold">{title ?? 'Dialog'}</h3>
                    <button onClick={onClose} className="btn-outline px-2 py-1" aria-label="Close">✕</button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>,
        target
    );
}
