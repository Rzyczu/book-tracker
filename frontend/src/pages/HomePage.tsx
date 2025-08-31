import AddBookForm from '../components/AddBookForm';
import BookList from '../components/BookList';

export default function HomePage() {
    return (
        <div className="p-4">
            <header className="mb-4">
                <h1 className="text-xl font-semibold">Book Tracker</h1>
                <p className="text-sm text-gray-600">Dodawaj i oznaczaj książki.</p>
            </header>

            <AddBookForm />
            <BookList />
        </div>
    );
}
