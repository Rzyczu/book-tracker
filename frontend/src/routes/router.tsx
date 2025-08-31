import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import StatsPage from '../pages/StatsPage';
import AccountPage from '../pages/AccountPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'stats', element: <StatsPage /> },
            { path: 'account', element: <AccountPage /> },
        ],
    },
]);
