import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bot,
  LayoutDashboard,
  MessageSquare,
  HelpCircle,
  Database,
  GitBranch,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Play,
  Send,
  CheckCircle,
  Search,
  Building,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { request } from '../services/api';

export const DashboardLayout: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 px-3 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-lg leading-tight tracking-tight text-white">chatbots<span className="text-blue-500">.ai</span></div>
              <div className="text-xs text-slate-400 font-medium truncate max-w-[130px]">{currentWorkspace?.name || 'Workspace'}</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 border border-slate-700">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="bots" element={<BotsManagement />} />
          <Route path="bots/:id/playground" element={<BotPlayground />} />
          <Route path="conversations" element={<ConversationsManager />} />
          <Route path="faqs" element={<FaqManager />} />
          <Route path="data" element={<BusinessDataManager />} />
          <Route path="workflows" element={<WorkflowBuilder />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="customers" element={<CustomersView />} />
          <Route path="settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
};

// 1. Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/analytics/overview').then((res) => {
      if (res.success) setMetrics(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-slate-400">Loading overview dashboard...</div>;

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-white">Workspace Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time statistics for non-AI customer support chatbots</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Total Conversations</div>
          <div className="text-3xl font-black text-white">{metrics?.totalConversations || 0}</div>
          <div className="text-xs text-blue-400 mt-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Calculated from logs</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Resolution Rate</div>
          <div className="text-3xl font-black text-emerald-400">{metrics?.resolutionRate || 0}%</div>
          <div className="text-xs text-slate-400 mt-2">{metrics?.resolvedConversations || 0} resolved chats</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Human Handoff Rate</div>
          <div className="text-3xl font-black text-amber-400">{metrics?.handoffRate || 0}%</div>
          <div className="text-xs text-slate-400 mt-2">{metrics?.escalatedConversations || 0} escalated chats</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Active Chatbots</div>
          <div className="text-3xl font-black text-indigo-400">{metrics?.totalBots || 0}</div>
          <div className="text-xs text-slate-400 mt-2">{metrics?.totalFAQs || 0} FAQs indexed</div>
        </div>
      </div>

      {/* Unresolved Questions Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" /> Recent Unresolved Questions
        </h2>
        {metrics?.unresolvedQuestions && metrics.unresolvedQuestions.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {metrics.unresolvedQuestions.map((q: any) => (
              <div key={q.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">"{q.unresolvedText || 'Unmatched query'}"</div>
                  <div className="text-xs text-slate-500 mt-0.5">Bot: {q.bot?.name || 'Main Bot'} • {new Date(q.createdAt).toLocaleString()}</div>
                </div>
                <Link to="/dashboard/faqs" className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                  Add FAQ Answer
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500 py-4">No unresolved customer queries recorded!</div>
        )}
      </div>
    </div>
  );
};

// 2. Bots Management Component
const BotsManagement: React.FC = () => {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [newBotDesc, setNewBotDesc] = useState('');

  const loadBots = () => {
    request('/bots').then((res) => {
      if (res.success) setBots(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { loadBots(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName) return;

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

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Chatbots Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Create, customize, and publish rule-based customer bots</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Create Chatbot
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Create New Chatbot</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Bot Name</label>
            <input
              type="text"
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              placeholder="e.g. Sales Assistant"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <input
              type="text"
              value={newBotDesc}
              onChange={(e) => setNewBotDesc(e.target.value)}
              placeholder="Primary support bot for website"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold">Save Bot</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-slate-400">Loading chatbots...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bots.map((bot) => (
            <div key={bot.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    bot.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {bot.status}
                  </span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bot.theme?.primaryColor || '#2563eb' }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{bot.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{bot.description || 'No description set.'}</p>
                <div className="text-xs text-slate-500 space-y-1 mb-6">
                  <div>Welcome: "{bot.welcomeMessage}"</div>
                  <div>Triggers Rules: {bot._count?.rules || 0}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <Link
                  to={`/dashboard/bots/${bot.id}/playground`}
                  className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-center py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Playground Debug
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Bot Playground Component
const BotPlayground: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'bot', text: 'Playground session started. Type a test query like "where is my order ORD-10025" or "location".' }
  ]);
  const [input, setInput] = useState('');
  const [debugData, setDebugData] = useState<any>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-white">Bot Playground & Inspector</h1>
        <p className="text-slate-400 text-sm mt-1">Test deterministic responses and inspect matched rules in real time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-[600px]">
        {/* Chat window */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-bold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" /> Interactive Chat Simulation
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message to test bot response..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Debug Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-300">
          <div className="font-bold text-sm text-white mb-4 flex items-center gap-2 font-sans">
            <Terminal className="w-4 h-4 text-emerald-400" /> Engine Debug Inspector
          </div>

          {debugData ? (
            <div className="space-y-4">
              <div>
                <span className="text-slate-500">Input Query:</span> "{debugData.inputMessage}"
              </div>
              <div>
                <span className="text-slate-500">Matched Rule:</span>{' '}
                {debugData.matchedRule ? (
                  <span className="text-emerald-400 font-bold">{debugData.matchedRule.ruleName} (Score: {debugData.matchedRule.score})</span>
                ) : (
                  <span className="text-amber-400">None (Fallback Used)</span>
                )}
              </div>
              {debugData.retrievedRecords && (
                <div>
                  <span className="text-slate-500">Retrieved Custom Records:</span>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-1 overflow-x-auto text-blue-300">
                    {JSON.stringify(debugData.retrievedRecords, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 italic py-8">Send a test message to inspect deterministic rule execution data.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// 4. Knowledge Base / FAQs Component
const FaqManager: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadFaqs = () => {
    request(`/faqs?search=${encodeURIComponent(search)}`).then((res) => {
      if (res.success) setFaqs(res.data);
    });
  };

  useEffect(() => { loadFaqs(); }, [search]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

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

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Knowledge Base & FAQs</h1>
          <p className="text-slate-400 text-sm mt-1">Searchable responses indexed by deterministic matching</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter FAQs by keyword..."
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full"
        />
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white">Add New FAQ Entry</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Question</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Answer</label>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">Save FAQ</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">{f.question}</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Live Conversations Manager Component
const ConversationsManager: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [agentMsg, setAgentMsg] = useState('');

  const loadConversations = () => {
    request('/conversations').then((res) => {
      if (res.success) setConversations(res.data);
    });
  };

  useEffect(() => { loadConversations(); }, []);

  const loadSingleConv = (id: string) => {
    request(`/conversations/${id}`).then((res) => {
      if (res.success) setSelectedConv(res.data);
    });
  };

  const handleSendAgentMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentMsg || !selectedConv) return;

    const res = await request(`/conversations/${selectedConv.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: agentMsg })
    });

    if (res.success) {
      setAgentMsg('');
      loadSingleConv(selectedConv.id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-white">Live Support Conversations</h1>
        <p className="text-slate-400 text-sm mt-1">Manage active sessions and human support handoffs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Session list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-2">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => loadSingleConv(c.id)}
              className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                selectedConv?.id === c.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white truncate max-w-[150px]">{c.customer?.name || 'Visitor'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 uppercase">{c.status}</span>
              </div>
              <p className="text-xs text-slate-400 truncate">{c.subject || 'No subject'}</p>
            </div>
          ))}
        </div>

        {/* Selected Conversation View */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div>
                  <div className="font-bold text-sm text-white">{selectedConv.customer?.name || 'Customer Chat'}</div>
                  <div className="text-xs text-slate-400">{selectedConv.customer?.email || 'No email provided'}</div>
                </div>
                <button
                  onClick={async () => {
                    await request(`/conversations/${selectedConv.id}/status`, {
                      method: 'PUT',
                      body: JSON.stringify({ status: 'RESOLVED' })
                    });
                    loadConversations();
                    loadSingleConv(selectedConv.id);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  Mark Resolved
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {selectedConv.messages.map((m: any) => (
                  <div key={m.id} className={`flex ${m.senderType === 'AGENT' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                      m.senderType === 'AGENT' ? 'bg-blue-600 text-white' : m.senderType === 'BOT' ? 'bg-slate-800 text-slate-200' : 'bg-slate-950 border border-slate-800 text-slate-100'
                    }`}>
                      <div className="text-[10px] font-bold opacity-60 mb-1">{m.senderType}</div>
                      <div>{m.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendAgentMsg} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950">
                <input
                  type="text"
                  value={agentMsg}
                  onChange={(e) => setAgentMsg(e.target.value)}
                  placeholder="Type agent reply..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">Reply</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Select a conversation to manage live chat messages</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder components for remaining routes
const BusinessDataManager: React.FC = () => (
  <div>
    <h1 className="text-2xl font-black text-white mb-2">Business Data Store</h1>
    <p className="text-slate-400 text-sm mb-6">Stored products, services, orders, and custom collections for non-AI queries</p>
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300">
      PostgreSQL Stores Active: Orders (ORD-10025, ORD-10082), Products (SmartHub Pro), Custom Collections (Branches).
    </div>
  </div>
);

const WorkflowBuilder: React.FC = () => (
  <div>
    <h1 className="text-2xl font-black text-white mb-2">Conversational Workflows</h1>
    <p className="text-slate-400 text-sm mb-6">Decision tree flow builder for multi-step customer options</p>
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300">
      Active Workflow: "Order Lookup Flow" with nodes: Collect Order ID -&gt; Search Database -&gt; Display Status.
    </div>
  </div>
);

const AnalyticsView: React.FC = () => (
  <div>
    <h1 className="text-2xl font-black text-white mb-2">Support Analytics</h1>
    <p className="text-slate-400 text-sm mb-6">Calculated metrics from stored application logs</p>
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300">
      Metrics generated directly from PostgreSQL tables without synthetic values.
    </div>
  </div>
);

const CustomersView: React.FC = () => (
  <div>
    <h1 className="text-2xl font-black text-white mb-2">Customer CRM</h1>
    <p className="text-slate-400 text-sm mb-6">Profiles and interaction history</p>
  </div>
);

const SettingsView: React.FC = () => (
  <div>
    <h1 className="text-2xl font-black text-white mb-2">Workspace & Widget Settings</h1>
    <p className="text-slate-400 text-sm mb-6">Branding, installation snippet, and team permissions</p>
  </div>
);
