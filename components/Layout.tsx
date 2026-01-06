
import React from 'react';
import { User, Tenant } from '../types';
import { NAV_ITEMS } from '../constants';
import { LogOut, Bell, Search, User as UserIcon, ShieldCheck, Settings2, UserRoundCog, HelpCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  currentTenant: Tenant | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  vision: 'tech' | 'exec';
  setVision: (v: 'tech' | 'exec') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, currentTenant, activeTab, setActiveTab, onLogout, vision, setVision }) => {
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/20">
              NR
            </div>
            <h1 className="text-lg font-black text-white tracking-tight">NR01-Master</h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-black truncate" title={currentTenant?.name}>
            {currentTenant?.name}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3 custom-scrollbar">
          {filteredNav.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all group relative overflow-hidden ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate whitespace-nowrap uppercase tracking-wider">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* LGPD Status - Essential for Data Shielding narrative */}
          <div className="px-3 py-2 bg-slate-800/40 rounded-xl flex items-center gap-2 border border-slate-700/50 group cursor-help" title="Conformidade LGPD ativa para dados psicossociais">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">LGPD Blindado</span>
            <HelpCircle size={10} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-2xl border border-slate-700/30">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
              <UserIcon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{currentUser.name}</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-tight">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-400/10 transition-all border border-transparent hover:border-rose-400/20"
          >
            <LogOut size={16} />
            SAIR DO SISTEMA
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4 text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex-1 max-w-md focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar riscos, evidências ou eventos..." 
              className="bg-transparent border-none outline-none text-xs w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Vision Toggle - Switch between Technical (SST) and Executive (CEO/Legal) */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 shadow-inner">
              <button 
                onClick={() => setVision('tech')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${vision === 'tech' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Settings2 size={12} />
                Técnica
              </button>
              <button 
                onClick={() => setVision('exec')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${vision === 'exec' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <UserRoundCog size={12} />
                Executiva
              </button>
            </div>

            <button className="relative text-slate-500 hover:text-indigo-600 transition-colors p-1 group">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white ring-1 ring-rose-200">2</span>
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-4 z-50">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Notificações</p>
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-600">⚠️ <span className="font-bold">Ação Vencida:</span> Manutenção de Exaustores</p>
                  <p className="text-[11px] text-slate-600">⚡ <span className="font-bold">Novo Gatilho:</span> Mudança Organizacional</p>
                </div>
              </div>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{currentTenant?.name}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Status: Blindado</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
