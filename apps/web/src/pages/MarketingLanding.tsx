import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ShieldCheck, Zap, Database, Search, GitBranch, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';

export const MarketingLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">chatbots<span className="text-blue-500">.ai</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-md shadow-blue-600/20">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4" /> 100% Deterministic Customer Support — Zero Generative AI
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Customizable Business Chatbots Powered By <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Your Own Business Data</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Deliver instant, accurate 24/7 customer support using deterministic rules, searchable knowledge bases, decision tree workflows, and database lookups without relying on unpredicted AI models.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register" className="w-full sm:w-auto text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">
            Start Building Your Bot <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto text-base font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-8 py-3.5 rounded-xl transition-all flex items-center justify-center">
            Explore Architecture
          </a>
        </div>

        {/* Product Preview Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-2xl backdrop-blur max-w-4xl mx-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-left font-mono text-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 ml-2">chatbots.ai // Rule Engine & Order Data Query</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active Session</span>
            </div>

            <div className="space-y-3">
              <div className="text-slate-400"><span className="text-blue-400">Customer:</span> "Where is my order ORD-10025?"</div>
              <div className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-emerald-400">[Engine Executed]:</span> Exact Order Regex Match `ORD-10025`<br />
                <span className="text-purple-400">[PostgreSQL Query]:</span> `SELECT * FROM "orders" WHERE order_number = 'ORD-10025'`<br />
                <span className="text-blue-400">[Bot Response]:</span> "📦 Order ORD-10025 Status: In Transit. Carrier: UPS Ground (1Z999...). Delivery Status: Out for delivery today."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-slate-950 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need for Enterprise Support</h2>
            <p className="text-slate-400">Total control over bot responses, customer interactions, data retrieval, and live support handoffs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deterministic Rule Engine</h3>
              <p className="text-slate-400 text-sm">Configure keyword, phrase, and intent category triggers. Never hallucinate responses or invent policies.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Database Retrieval</h3>
              <p className="text-slate-400 text-sm">Connect customer queries directly to stored orders, products, services, and custom collections like branches or courses.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Decision Tree Workflows</h3>
              <p className="text-slate-400 text-sm">Design interactive multi-step decision flows that collect customer data, prompt for options, and execute support actions.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Knowledge Base & Search</h3>
              <p className="text-slate-400 text-sm">Organize FAQs and articles with fast deterministic ranking across exact titles, tags, and category taxonomies.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Agent WebSockets</h3>
              <p className="text-slate-400 text-sm">Seamless human handoff with real-time WebSocket communication, workspace agent assignment, and typing status.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Embeddable Widget</h3>
              <p className="text-slate-400 text-sm">Customize colors, avatars, and launchers. Paste a single line snippet onto any external website or Web app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Transparent Pricing for Growing Businesses</h2>
          <p className="text-slate-400">Scale your automated support without hidden AI token usage fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Starter</h3>
              <div className="text-4xl font-extrabold text-white mb-6">$29 <span className="text-sm font-normal text-slate-400">/ month</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Up to 2 Chatbots</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 100 Knowledge FAQs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Unlimited Conversations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Standard Widget Theme</li>
              </ul>
            </div>
            <Link to="/register" className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors">Start Starter Trial</Link>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-900/40 to-slate-900 border-2 border-blue-500 flex flex-col justify-between relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Professional</h3>
              <div className="text-4xl font-extrabold text-white mb-6">$89 <span className="text-sm font-normal text-slate-400">/ month</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Up to 10 Chatbots</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Decision Tree Workflow Builder</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Custom Collections (Branches/Courses)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Live Agent Handoff & WebSockets</li>
              </ul>
            </div>
            <Link to="/register" className="w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/30">Get Started Pro</Link>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Enterprise</h3>
              <div className="text-4xl font-extrabold text-white mb-6">$249 <span className="text-sm font-normal text-slate-400">/ month</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Unlimited Chatbots</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Unlimited Team Agents & Roles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Dedicated Audit Logging</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Priority SLA & Onboarding</li>
              </ul>
            </div>
            <Link to="/register" className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors">Contact Enterprise</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-12 px-6 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-base">chatbots.ai</span>
          </div>
          <div>© {new Date().getFullYear()} chatbots.ai Inc. All rights reserved. Non-AI Rule-Based Support Platform.</div>
        </div>
      </footer>
    </div>
  );
};
