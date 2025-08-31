import { NavLink } from 'react-router-dom';

const base = 'px-3 py-2 rounded-md text-sm font-medium transition';
const active = 'bg-gray-900 text-white';
const inactive = 'text-gray-200 hover:bg-gray-700 hover:text-white';

export default function NavBar() {
    return (
        <nav className="bg-gray-800">
            <div className="container-app">
                <div className="flex h-12 items-center gap-3">
                    <div className="mr-2 select-none font-semibold text-white">Book Tracker</div>
                    <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                        Home
                    </NavLink>
                    <NavLink to="/stats" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                        Statistics
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}
