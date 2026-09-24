import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Headset } from 'lucide-react';
export const Widget = ({ botId, apiUrl = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId] = useState(() => 'sess-' + Math.random().toString(36).substring(2, 10));
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch(`${apiUrl}/api/widget/config/${botId}`)
            .then((res) => res.json())
            .then((data) => {
            if (data.success) {
                setConfig(data.data);
                setMessages([
                    {
                        sender: 'BOT',
                        text: data.data.welcomeMessage || 'Hello! How can I help you today?',
                        quickReplies: data.data.widgetConfig?.quickReplies || []
                    }
                ]);
            }
        })
            .catch((err) => console.error('Error fetching widget config:', err));
    }, [botId, apiUrl]);
    const sendMessage = async (textToSend) => {
        if (!textToSend.trim())
            return;
        const userMessage = textToSend.trim();
        setInput('');
        setMessages((prev) => [...prev, { sender: 'CUSTOMER', text: userMessage }]);
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/widget/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    botId,
                    sessionId,
                    message: userMessage
                })
            });
            const result = await res.json();
            setLoading(false);
            if (result.success && result.data?.message) {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: result.data.message.senderType,
                        text: result.data.message.content,
                        quickReplies: result.data.message.quickReplies
                    }
                ]);
            }
        }
        catch (err) {
            setLoading(false);
            setMessages((prev) => [
                ...prev,
                { sender: 'BOT', text: 'Sorry, I am having trouble connecting. Please try again.' }
            ]);
        }
    };
    const primaryColor = config?.theme?.primaryColor || '#2563eb';
    return (_jsxs("div", { className: "fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans", children: [!isOpen && (_jsx("button", { onClick: () => setIsOpen(true), style: { backgroundColor: primaryColor }, className: "w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer", children: _jsx(MessageSquare, { className: "w-7 h-7" }) })), isOpen && (_jsxs("div", { className: "w-[380px] h-[580px] bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden", children: [_jsxs("div", { style: { backgroundColor: primaryColor }, className: "p-4 text-white flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold", children: _jsx(Bot, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm leading-tight", children: config?.name || 'Customer Support' }), _jsxs("div", { className: "text-[11px] opacity-80 flex items-center gap-1", children: [_jsx(Headset, { className: "w-3 h-3" }), " Online \u2022 Non-AI Bot"] })] })] }), _jsx("button", { onClick: () => setIsOpen(false), className: "text-white/80 hover:text-white p-1 cursor-pointer", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50", children: [messages.map((m, idx) => (_jsxs("div", { className: `flex flex-col ${m.sender === 'CUSTOMER' ? 'items-end' : 'items-start'}`, children: [_jsx("div", { className: `max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${m.sender === 'CUSTOMER' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`, children: m.text }), m.quickReplies && m.quickReplies.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1.5 mt-2 max-w-[90%]", children: m.quickReplies.map((qr, qIdx) => (_jsx("button", { onClick: () => sendMessage(qr.payload || qr.label), className: "text-xs border border-blue-500/30 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1 font-medium transition-colors", children: qr.label }, qIdx))) }))] }, idx))), loading && _jsx("div", { className: "text-xs text-slate-400 italic", children: "Thinking..." })] }), _jsxs("form", { onSubmit: (e) => {
                            e.preventDefault();
                            sendMessage(input);
                        }, className: "p-3 bg-white border-t border-slate-200 flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask a question...", className: "flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500" }), _jsx("button", { type: "submit", style: { backgroundColor: primaryColor }, className: "text-white px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity", children: _jsx(Send, { className: "w-4 h-4" }) })] })] }))] }));
};
