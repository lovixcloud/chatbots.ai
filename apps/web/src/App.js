import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketingLanding } from './pages/MarketingLanding';
import { Login, Register } from './pages/Login';
import { DashboardLayout } from './pages/Dashboard';
const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading)
        return _jsx("div", { className: "min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans", children: "Loading chatbots.ai..." });
    if (!token)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(_Fragment, { children: children });
};
export const App = () => {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(MarketingLanding, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/dashboard/*", element: _jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
};
export default App;
