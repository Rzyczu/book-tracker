import { NavLink } from 'react-router-dom';

const linkBase = 'px-3 py-2 rounded-md text-sm font-medium';
const active = 'bg-gray-900 text-white';
const inactive = 'text-gray-300 hover:bg-gray-700 hover:text-white';

export default function NavBar() {
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-5xl px-4">
                <div className="flex h-12 items-center gap-2">
                    <div className="text-white font-semibold mr-4">📚 Book Tracker</div>
                    <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
                        Home
                    </NavLink>
                    <NavLink to="/stats" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
                        Statystyki
                    </NavLink>
                    <NavLink to="/account" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
                        Konto
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}
