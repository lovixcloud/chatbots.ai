import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, LogIn } from 'lucide-react';
import { request } from '../services/api';
import { useAuth } from '../context/AuthContext';
export const Login = () => {
    const [email, setEmail] = useState('owner@acmesupport.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        setLoading(false);
        if (res.success && res.data) {
            login(res.data.token, res.data.user, res.data.workspaces);
            navigate('/dashboard');
        }
        else {
            setError(res.error?.message || 'Login failed. Please check credentials.');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans", children: _jsxs("div", { className: "w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl", children: [_jsxs("div", { className: "flex flex-col items-center mb-8", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30", children: _jsx(Bot, { className: "w-7 h-7" }) }), _jsx("h2", { className: "text-2xl font-extrabold text-white", children: "Log in to chatbots.ai" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Manage your business support chatbots" })] }), error && (_jsx("div", { className: "mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2", children: loading ? 'Logging in...' : _jsxs(_Fragment, { children: [_jsx(LogIn, { className: "w-5 h-5" }), " Log In"] }) })] }), _jsxs("div", { className: "mt-8 text-center text-sm text-slate-400", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-blue-400 hover:text-blue-300 font-semibold", children: "Register here" })] })] }) }));
};
export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [workspaceName, setWorkspaceName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, workspaceName })
        });
        setLoading(false);
        if (res.success && res.data) {
            login(res.data.token, res.data.user, [res.data.workspace]);
            navigate('/dashboard');
        }
        else {
            setError(res.error?.message || 'Registration failed.');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans", children: _jsxs("div", { className: "w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl", children: [_jsxs("div", { className: "flex flex-col items-center mb-8", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30", children: _jsx(Bot, { className: "w-7 h-7" }) }), _jsx("h2", { className: "text-2xl font-extrabold text-white", children: "Create Your Account" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Start building non-AI business chatbots" })] }), error && (_jsx("div", { className: "mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Full Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Business Workspace Name" }), _jsx("input", { type: "text", value: workspaceName, onChange: (e) => setWorkspaceName(e.target.value), placeholder: "e.g. Acme Support Corp", required: true, className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 mt-2", children: loading ? 'Creating Account...' : 'Get Started' })] }), _jsxs("div", { className: "mt-8 text-center text-sm text-slate-400", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-blue-400 hover:text-blue-300 font-semibold", children: "Log in" })] })] }) }));
};
