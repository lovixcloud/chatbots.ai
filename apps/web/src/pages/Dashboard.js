import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, LayoutDashboard, MessageSquare, HelpCircle, Database, GitBranch, Users, BarChart3, Settings, LogOut, Plus, Play, Send, CheckCircle, Search, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { request } from '../services/api';
export const DashboardLayout = () => {
    const { user, currentWorkspace, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Chatbots', path: '/dashboard/bots', icon: Bot },
        { label: 'Conversations', path: '/dashboard/conversations', icon: MessageSquare },
        { label: 'Knowledge Base', path: '/dashboard/faqs', icon: HelpCircle },
        { label: 'Business Data', path: '/dashboard/data', icon: Database },
        { label: 'Workflows', path: '/dashboard/workflows', icon: GitBranch },
        { label: 'Customers', path: '/dashboard/customers', icon: Users },
        { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Settings', path: '/dashboard/settings', icon: Settings }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 flex font-sans", children: [_jsxs("aside", { className: "w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 px-3 py-3 mb-6", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20", children: _jsx(Bot, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-extrabold text-lg leading-tight tracking-tight text-white", children: ["chatbots", _jsx("span", { className: "text-blue-500", children: ".ai" })] }), _jsx("div", { className: "text-xs text-slate-400 font-medium truncate max-w-[130px]", children: currentWorkspace?.name || 'Workspace' })] })] }), _jsx("nav", { className: "space-y-1", children: navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                                    return (_jsxs(Link, { to: item.path, className: `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), item.label] }, item.path));
                                }) })] }), _jsxs("div", { className: "pt-4 border-t border-slate-800", children: [_jsxs("div", { className: "flex items-center gap-3 px-3 py-2 mb-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 border border-slate-700", children: user?.name ? user.name[0] : 'U' }), _jsxs("div", { className: "overflow-hidden", children: [_jsx("div", { className: "text-xs font-semibold text-white truncate", children: user?.name }), _jsx("div", { className: "text-[11px] text-slate-400 truncate", children: user?.email })] })] }), _jsxs("button", { onClick: () => {
                                    logout();
                                    navigate('/login');
                                }, className: "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors", children: [_jsx(LogOut, { className: "w-4 h-4" }), " Log Out"] })] })] }), _jsx("main", { className: "flex-1 overflow-y-auto p-8", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(DashboardOverview, {}) }), _jsx(Route, { path: "bots", element: _jsx(BotsManagement, {}) }), _jsx(Route, { path: "bots/:id/playground", element: _jsx(BotPlayground, {}) }), _jsx(Route, { path: "conversations", element: _jsx(ConversationsManager, {}) }), _jsx(Route, { path: "faqs", element: _jsx(FaqManager, {}) }), _jsx(Route, { path: "data", element: _jsx(BusinessDataManager, {}) }), _jsx(Route, { path: "workflows", element: _jsx(WorkflowBuilder, {}) }), _jsx(Route, { path: "analytics", element: _jsx(AnalyticsView, {}) }), _jsx(Route, { path: "customers", element: _jsx(CustomersView, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsView, {}) })] }) })] }));
};
// 1. Dashboard Overview Component
const DashboardOverview = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        request('/analytics/overview').then((res) => {
            if (res.success)
                setMetrics(res.data);
            setLoading(false);
        });
    }, []);
    if (loading)
        return _jsx("div", { className: "text-slate-400", children: "Loading overview dashboard..." });
    return (_jsxs("div", { className: "space-y-8 max-w-7xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white", children: "Workspace Overview" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Real-time statistics for non-AI customer support chatbots" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-slate-900 border border-slate-800", children: [_jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Total Conversations" }), _jsx("div", { className: "text-3xl font-black text-white", children: metrics?.totalConversations || 0 }), _jsxs("div", { className: "text-xs text-blue-400 mt-2 flex items-center gap-1", children: [_jsx(CheckCircle, { className: "w-3.5 h-3.5" }), " Calculated from logs"] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-slate-900 border border-slate-800", children: [_jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Resolution Rate" }), _jsxs("div", { className: "text-3xl font-black text-emerald-400", children: [metrics?.resolutionRate || 0, "%"] }), _jsxs("div", { className: "text-xs text-slate-400 mt-2", children: [metrics?.resolvedConversations || 0, " resolved chats"] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-slate-900 border border-slate-800", children: [_jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Human Handoff Rate" }), _jsxs("div", { className: "text-3xl font-black text-amber-400", children: [metrics?.handoffRate || 0, "%"] }), _jsxs("div", { className: "text-xs text-slate-400 mt-2", children: [metrics?.escalatedConversations || 0, " escalated chats"] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-slate-900 border border-slate-800", children: [_jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Active Chatbots" }), _jsx("div", { className: "text-3xl font-black text-indigo-400", children: metrics?.totalBots || 0 }), _jsxs("div", { className: "text-xs text-slate-400 mt-2", children: [metrics?.totalFAQs || 0, " FAQs indexed"] })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-slate-900 border border-slate-800", children: [_jsxs("h2", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(HelpCircle, { className: "w-5 h-5 text-amber-400" }), " Recent Unresolved Questions"] }), metrics?.unresolvedQuestions && metrics.unresolvedQuestions.length > 0 ? (_jsx("div", { className: "divide-y divide-slate-800", children: metrics.unresolvedQuestions.map((q) => (_jsxs("div", { className: "py-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-white", children: ["\"", q.unresolvedText || 'Unmatched query', "\""] }), _jsxs("div", { className: "text-xs text-slate-500 mt-0.5", children: ["Bot: ", q.bot?.name || 'Main Bot', " \u2022 ", new Date(q.createdAt).toLocaleString()] })] }), _jsx(Link, { to: "/dashboard/faqs", className: "text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg", children: "Add FAQ Answer" })] }, q.id))) })) : (_jsx("div", { className: "text-sm text-slate-500 py-4", children: "No unresolved customer queries recorded!" }))] })] }));
};
// 2. Bots Management Component
const BotsManagement = () => {
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newBotName, setNewBotName] = useState('');
    const [newBotDesc, setNewBotDesc] = useState('');
    const loadBots = () => {
        request('/bots').then((res) => {
            if (res.success)
                setBots(res.data);
            setLoading(false);
        });
    };
    useEffect(() => { loadBots(); }, []);
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newBotName)
            return;
        const res = await request('/bots', {
            method: 'POST',
            body: JSON.stringify({ name: newBotName, description: newBotDesc })
        });
        if (res.success) {
            setShowCreate(false);
            setNewBotName('');
            setNewBotDesc('');
            loadBots();
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-7xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white", children: "Chatbots Manager" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Create, customize, and publish rule-based customer bots" })] }), _jsxs("button", { onClick: () => setShowCreate(true), className: "bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), " Create Chatbot"] })] }), showCreate && (_jsxs("form", { onSubmit: handleCreate, className: "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4", children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Create New Chatbot" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: "Bot Name" }), _jsx("input", { type: "text", value: newBotName, onChange: (e) => setNewBotName(e.target.value), placeholder: "e.g. Sales Assistant", className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: "Description" }), _jsx("input", { type: "text", value: newBotDesc, onChange: (e) => setNewBotDesc(e.target.value), placeholder: "Primary support bot for website", className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => setShowCreate(false), className: "px-4 py-2 text-sm text-slate-400 hover:text-white", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold", children: "Save Bot" })] })] })), loading ? (_jsx("div", { className: "text-slate-400", children: "Loading chatbots..." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: bots.map((bot) => (_jsxs("div", { className: "p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: `text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${bot.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`, children: bot.status }), _jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: bot.theme?.primaryColor || '#2563eb' } })] }), _jsx("h3", { className: "text-xl font-bold text-white mb-1", children: bot.name }), _jsx("p", { className: "text-slate-400 text-sm mb-4", children: bot.description || 'No description set.' }), _jsxs("div", { className: "text-xs text-slate-500 space-y-1 mb-6", children: [_jsxs("div", { children: ["Welcome: \"", bot.welcomeMessage, "\""] }), _jsxs("div", { children: ["Triggers Rules: ", bot._count?.rules || 0] })] })] }), _jsx("div", { className: "flex items-center gap-3 pt-4 border-t border-slate-800", children: _jsxs(Link, { to: `/dashboard/bots/${bot.id}/playground`, className: "flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-center py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2", children: [_jsx(Play, { className: "w-4 h-4" }), " Playground Debug"] }) })] }, bot.id))) }))] }));
};
// 3. Bot Playground Component
const BotPlayground = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Playground session started. Type a test query like "where is my order ORD-10025" or "location".' }
    ]);
    const [input, setInput] = useState('');
    const [debugData, setDebugData] = useState(null);
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        const userText = input;
        setInput('');
        setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
        const res = await request('/bots/acme-main-bot/playground', {
            method: 'POST',
            body: JSON.stringify({ message: userText })
        });
        if (res.success && res.data) {
            setDebugData(res.data);
            setMessages((prev) => [...prev, { sender: 'bot', text: res.data.finalResponse }]);
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-7xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white", children: "Bot Playground & Inspector" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Test deterministic responses and inspect matched rules in real time" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6 h-[600px]", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-slate-800 font-bold text-sm text-white flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-4 h-4 text-blue-500" }), " Interactive Chat Simulation"] }), _jsx("div", { className: "flex-1 p-4 overflow-y-auto space-y-3", children: messages.map((m, idx) => (_jsx("div", { className: `flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[80%] rounded-xl p-3 text-sm ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`, children: m.text }) }, idx))) }), _jsxs("form", { onSubmit: handleSend, className: "p-3 border-t border-slate-800 flex gap-2 bg-slate-950", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type message to test bot response...", className: "flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm", children: _jsx(Send, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-300", children: [_jsxs("div", { className: "font-bold text-sm text-white mb-4 flex items-center gap-2 font-sans", children: [_jsx(Terminal, { className: "w-4 h-4 text-emerald-400" }), " Engine Debug Inspector"] }), debugData ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-500", children: "Input Query:" }), " \"", debugData.inputMessage, "\""] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500", children: "Matched Rule:" }), ' ', debugData.matchedRule ? (_jsxs("span", { className: "text-emerald-400 font-bold", children: [debugData.matchedRule.ruleName, " (Score: ", debugData.matchedRule.score, ")"] })) : (_jsx("span", { className: "text-amber-400", children: "None (Fallback Used)" }))] }), debugData.retrievedRecords && (_jsxs("div", { children: [_jsx("span", { className: "text-slate-500", children: "Retrieved Custom Records:" }), _jsx("pre", { className: "bg-slate-950 p-3 rounded-lg border border-slate-800 mt-1 overflow-x-auto text-blue-300", children: JSON.stringify(debugData.retrievedRecords, null, 2) })] }))] })) : (_jsx("div", { className: "text-slate-500 italic py-8", children: "Send a test message to inspect deterministic rule execution data." }))] })] })] }));
};
// 4. Knowledge Base / FAQs Component
const FaqManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [search, setSearch] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [showForm, setShowForm] = useState(false);
    const loadFaqs = () => {
        request(`/faqs?search=${encodeURIComponent(search)}`).then((res) => {
            if (res.success)
                setFaqs(res.data);
        });
    };
    useEffect(() => { loadFaqs(); }, [search]);
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!question || !answer)
            return;
        const res = await request('/faqs', {
            method: 'POST',
            body: JSON.stringify({ question, answer })
        });
        if (res.success) {
            setQuestion('');
            setAnswer('');
            setShowForm(false);
            loadFaqs();
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-7xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white", children: "Knowledge Base & FAQs" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Searchable responses indexed by deterministic matching" })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add FAQ"] })] }), _jsxs("div", { className: "flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md", children: [_jsx(Search, { className: "w-4 h-4 text-slate-500" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Filter FAQs by keyword...", className: "bg-transparent border-none text-sm text-white focus:outline-none w-full" })] }), showForm && (_jsxs("form", { onSubmit: handleAdd, className: "p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4", children: [_jsx("h3", { className: "font-bold text-white", children: "Add New FAQ Entry" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: "Question" }), _jsx("input", { type: "text", value: question, onChange: (e) => setQuestion(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: "Answer" }), _jsx("textarea", { value: answer, onChange: (e) => setAnswer(e.target.value), rows: 3, className: "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowForm(false), className: "px-4 py-2 text-sm text-slate-400", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold", children: "Save FAQ" })] })] })), _jsx("div", { className: "space-y-4", children: faqs.map((f) => (_jsxs("div", { className: "p-5 rounded-2xl bg-slate-900 border border-slate-800", children: [_jsx("h4", { className: "font-bold text-white text-base mb-2", children: f.question }), _jsx("p", { className: "text-slate-300 text-sm leading-relaxed", children: f.answer })] }, f.id))) })] }));
};
// 5. Live Conversations Manager Component
const ConversationsManager = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [agentMsg, setAgentMsg] = useState('');
    const loadConversations = () => {
        request('/conversations').then((res) => {
            if (res.success)
                setConversations(res.data);
        });
    };
    useEffect(() => { loadConversations(); }, []);
    const loadSingleConv = (id) => {
        request(`/conversations/${id}`).then((res) => {
            if (res.success)
                setSelectedConv(res.data);
        });
    };
    const handleSendAgentMsg = async (e) => {
        e.preventDefault();
        if (!agentMsg || !selectedConv)
            return;
        const res = await request(`/conversations/${selectedConv.id}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content: agentMsg })
        });
        if (res.success) {
            setAgentMsg('');
            loadSingleConv(selectedConv.id);
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-7xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white", children: "Live Support Conversations" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Manage active sessions and human support handoffs" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]", children: [_jsx("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-2", children: conversations.map((c) => (_jsxs("div", { onClick: () => loadSingleConv(c.id), className: `p-3.5 rounded-xl cursor-pointer border transition-all ${selectedConv?.id === c.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs font-bold text-white truncate max-w-[150px]", children: c.customer?.name || 'Visitor' }), _jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 uppercase", children: c.status })] }), _jsx("p", { className: "text-xs text-slate-400 truncate", children: c.subject || 'No subject' })] }, c.id))) }), _jsx("div", { className: "md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden", children: selectedConv ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950", children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm text-white", children: selectedConv.customer?.name || 'Customer Chat' }), _jsx("div", { className: "text-xs text-slate-400", children: selectedConv.customer?.email || 'No email provided' })] }), _jsx("button", { onClick: async () => {
                                                await request(`/conversations/${selectedConv.id}/status`, {
                                                    method: 'PUT',
                                                    body: JSON.stringify({ status: 'RESOLVED' })
                                                });
                                                loadConversations();
                                                loadSingleConv(selectedConv.id);
                                            }, className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold", children: "Mark Resolved" })] }), _jsx("div", { className: "flex-1 p-4 overflow-y-auto space-y-3", children: selectedConv.messages.map((m) => (_jsx("div", { className: `flex ${m.senderType === 'AGENT' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] rounded-xl p-3 text-sm ${m.senderType === 'AGENT' ? 'bg-blue-600 text-white' : m.senderType === 'BOT' ? 'bg-slate-800 text-slate-200' : 'bg-slate-950 border border-slate-800 text-slate-100'}`, children: [_jsx("div", { className: "text-[10px] font-bold opacity-60 mb-1", children: m.senderType }), _jsx("div", { children: m.content })] }) }, m.id))) }), _jsxs("form", { onSubmit: handleSendAgentMsg, className: "p-3 border-t border-slate-800 flex gap-2 bg-slate-950", children: [_jsx("input", { type: "text", value: agentMsg, onChange: (e) => setAgentMsg(e.target.value), placeholder: "Type agent reply...", className: "flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold", children: "Reply" })] })] })) : (_jsx("div", { className: "flex-1 flex items-center justify-center text-slate-500 text-sm", children: "Select a conversation to manage live chat messages" })) })] })] }));
};
// Placeholder components for remaining routes
const BusinessDataManager = () => (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white mb-2", children: "Business Data Store" }), _jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Stored products, services, orders, and custom collections for non-AI queries" }), _jsx("div", { className: "p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300", children: "PostgreSQL Stores Active: Orders (ORD-10025, ORD-10082), Products (SmartHub Pro), Custom Collections (Branches)." })] }));
const WorkflowBuilder = () => (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white mb-2", children: "Conversational Workflows" }), _jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Decision tree flow builder for multi-step customer options" }), _jsx("div", { className: "p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300", children: "Active Workflow: \"Order Lookup Flow\" with nodes: Collect Order ID -> Search Database -> Display Status." })] }));
const AnalyticsView = () => (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white mb-2", children: "Support Analytics" }), _jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Calculated metrics from stored application logs" }), _jsx("div", { className: "p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300", children: "Metrics generated directly from PostgreSQL tables without synthetic values." })] }));
const CustomersView = () => (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white mb-2", children: "Customer CRM" }), _jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Profiles and interaction history" })] }));
const SettingsView = () => (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-white mb-2", children: "Workspace & Widget Settings" }), _jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Branding, installation snippet, and team permissions" })] }));
