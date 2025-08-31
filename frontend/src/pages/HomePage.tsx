import { useState, useRef } from 'react';
import AddBookForm from '../components/AddBookForm';
import BookList from '../components/BookList';
import Modal from '../components/Modal';

export default function HomePage() {
    const [open, setOpen] = useState(false);
    const addBtnRef = useRef<HTMLButtonElement>(null);

    return (
        <div className="p-4 container-app">
            <header className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Book Tracker</h1>
                    <p className="text-sm text-gray-600">Dodawaj i oznaczaj książki.</p>
                </div>
                <button ref={addBtnRef} onClick={() => setOpen(true)} className="btn-primary px-4 py-2">
                    Dodaj książkę
                </button>
            </header>

            <BookList />

            <Modal
                open={open}
                title="Dodaj nową książkę"
                onClose={() => { setOpen(false); setTimeout(() => addBtnRef.current?.focus(), 0); }}
            >
                <AddBookForm
                    onSuccess={() => { setOpen(false); setTimeout(() => addBtnRef.current?.focus(), 0); }}
                />
            </Modal>
        </div>
    );
}
