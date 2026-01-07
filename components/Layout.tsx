import React from 'react';
import { User, Tenant } from '../types';
import { NAV_ITEMS } from '../constants';
import { 
  LogOut, Bell, Search, User as UserIcon, ShieldCheck, 
  Settings2, UserRoundCog, ChevronLeft, ChevronRight, Command
} from 'lucide-react';

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

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentUser, 
  currentTenant, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  vision, 
  setVision 
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 font-sans text-slate-900 selection:bg-indigo-500/20">
      
      {/* --- SIDEBAR PREMIUM --- */}
      <aside 
        className={`
          group relative flex flex-col shrink-0 transition-all duration-500 ease-out
          ${collapsed ? 'w-[80px]' : 'w-[280px]'} 
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 
          border-r border-white/5 shadow-2xl shadow-black/20
        `}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-violet-600/5" />
        </div>
        
        {/* Logo Section */}
        <div className={`h-20 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-white/5 relative`}>
          <div className="flex items-center gap-3.5">
            <div className="relative group/logo cursor-pointer">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 rounded-xl blur-xl opacity-40 group-hover/logo:opacity-70 group-hover/logo:scale-110 transition-all duration-500" />
              {/* Outer ring */}
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 rounded-xl opacity-20 group-hover/logo:opacity-40 animate-pulse" />
              {/* Logo box */}
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-2xl shadow-indigo-900/60 shrink-0 ring-2 ring-white/20 group-hover/logo:ring-white/40 hover:scale-105 transition-all duration-300">
                <span className="relative z-10">NR</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl" />
              </div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <h1 className="text-base font-black text-white tracking-tight drop-shadow-sm">NR01 Master</h1>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-indigo-300/90 font-bold tracking-wider">Suite Pro</span>
                <div className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30">
                  <span className="text-[8px] text-emerald-300 font-black uppercase tracking-wider">v2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Switcher (Visual) */}
        {!collapsed && (
          <div className="px-4 py-5">
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all group/tenant backdrop-blur-sm shadow-lg shadow-black/5">
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Ambiente</span>
                <span className="text-sm font-semibold text-white truncate max-w-[160px] group-hover/tenant:text-indigo-300 transition-colors">
                  {currentTenant?.name || 'Selecione...'}
                </span>
              </div>
              <ShieldCheck size={16} className="text-emerald-400/90 group-hover/tenant:text-emerald-300 transition-colors" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar-dark">
          {filteredNav.map((item, idx) => {
            const isActive = activeTab === item.id;
            const showBadge = idx < 2; // Mostrar badge nos primeiros 2 itens
            return (
              <div key={item.id} className="relative group/wrapper">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    relative w-full flex items-center transition-all duration-300 group/nav overflow-hidden
                    ${collapsed ? 'justify-center px-0 py-4 rounded-xl' : 'px-4 py-3.5 rounded-xl gap-3.5'}
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-500/25 via-indigo-500/15 to-violet-500/10 text-white shadow-xl shadow-indigo-500/30 border border-indigo-400/30 scale-[1.02]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/8 hover:shadow-lg border border-transparent hover:border-white/10 hover:scale-[1.01]'}
                  `}
                >
                  {/* Background glow on active */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-transparent animate-pulse" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)]" />
                    </>
                  )}

                  {/* Active indicator line */}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-gradient-to-b from-indigo-400 via-violet-400 to-fuchsia-400 rounded-r-full shadow-[0_0_20px_rgba(99,102,241,0.8)]">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-r-full" />
                    </div>
                  )}

                  {/* Icon with backdrop */}
                  <div className={`shrink-0 relative z-10 transition-all duration-300 ${
                    isActive 
                      ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' 
                      : 'text-slate-400 group-hover/nav:text-slate-100 group-hover/nav:scale-110 group-hover/nav:drop-shadow-md'
                  }`}>
                    {isActive && (
                      <div className="absolute inset-0 bg-indigo-400/30 blur-lg rounded-full" />
                    )}
                    <span className="relative">
                      {React.cloneElement(item.icon as React.ReactElement, { 
                        size: collapsed ? 22 : 21, 
                        strokeWidth: isActive ? 2.5 : 2.2 
                      })}
                    </span>
                  </div>
                  
                  {!collapsed && (
                    <span className={`flex-1 text-left text-sm font-bold tracking-wide relative z-10 transition-colors ${
                      isActive ? 'text-white' : 'group-hover/nav:text-slate-100'
                    }`}>
                      {item.label}
                    </span>
                  )}

                  {/* Badge de notificação */}
                  {!collapsed && showBadge && (
                    <div className="relative z-10 flex items-center gap-1">
                      <div className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm">
                        <span className="text-[10px] font-black text-indigo-300">{idx === 0 ? '3' : '!'}</span>
                      </div>
                    </div>
                  )}

                  {/* Dot indicator when collapsed */}
                  {collapsed && isActive && (
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </button>

                {/* Tooltip aprimorado quando collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover/wrapper:opacity-100 group-hover/wrapper:visible transition-all duration-200 whitespace-nowrap shadow-2xl border border-white/10 z-50 pointer-events-none">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-white/5 bg-gradient-to-t from-black/30 to-black/20 backdrop-blur-sm relative">
          {/* Decorative top line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3.5 p-3'} rounded-xl transition-all hover:bg-white/8 cursor-pointer group/user border border-transparent hover:border-white/10 hover:shadow-lg relative overflow-hidden`}>
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-violet-500/0 group-hover/user:from-indigo-500/5 group-hover/user:via-violet-500/5 group-hover/user:to-transparent transition-all duration-500" />
            
            <div className="relative">
              {/* Avatar glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full blur-md opacity-50 group-hover/user:opacity-70 transition-opacity" />
              {/* Avatar */}
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/60 shrink-0 ring-2 ring-white/20 group-hover/user:ring-white/40 group-hover/user:scale-105 transition-all">
                <UserIcon size={20} strokeWidth={2.5} />
                <div className="absolute inset-0 bg-white/10 rounded-full" />
              </div>
              {/* Status indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-lg shadow-emerald-500/60">
                <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
              </span>
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-sm font-bold text-white truncate group-hover/user:text-indigo-200 transition-colors drop-shadow-sm">{currentUser.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-400 uppercase font-black truncate tracking-wider">
                    {currentUser.role.replace('_', ' ')}
                  </p>
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-bold">Online</span>
                </div>
              </div>
            )}
            
            {!collapsed && (
              <button 
                onClick={(e) => { e.stopPropagation(); onLogout(); }}
                className="relative z-10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all p-2 rounded-lg border border-transparent hover:border-rose-500/20 group/logout"
                title="Sair"
              >
                <LogOut size={18} className="group-hover/logout:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle Button (Floating) */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-4 top-28 w-9 h-9 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-white/10 text-slate-300 rounded-full flex items-center justify-center hover:from-indigo-600 hover:via-indigo-600 hover:to-violet-600 hover:text-white hover:border-indigo-400/40 hover:scale-110 transition-all shadow-2xl z-50 group/toggle cursor-pointer"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover/toggle:from-indigo-500/30 group-hover/toggle:to-violet-500/30 transition-all blur-sm" />
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover/toggle:opacity-100 transition-opacity" />
          {/* Icon */}
          <span className="relative z-10">
            {collapsed ? <ChevronRight size={15} strokeWidth={3} /> : <ChevronLeft size={15} strokeWidth={3} />}
          </span>
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-20 shadow-sm shadow-slate-200/30">
          
          {/* Global Search */}
          <div className="flex items-center gap-3 w-full max-w-xl group">
             <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-10" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar módulos, usuários, relatórios..." 
                  className="relative w-full bg-slate-50/80 border border-slate-200/60 text-sm pl-12 pr-20 py-3.5 rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm hover:shadow-md font-medium"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                  <div className="px-2 py-1 rounded-lg border border-slate-300/80 bg-white shadow-sm text-[10px] font-black text-slate-500 flex items-center gap-1">
                    <Command size={10} /> <span>K</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {/* Vision Switcher */}
            <div className="bg-white p-1.5 rounded-xl flex border border-slate-200 shadow-sm">
              <button
                onClick={() => setVision('tech')}
                className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${vision === 'tech' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <Settings2 size={14} strokeWidth={2.5} /> <span>Técnico</span>
              </button>
              <button
                onClick={() => setVision('exec')}
                className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${vision === 'exec' ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/30' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <UserRoundCog size={14} strokeWidth={2.5} /> <span>Executivo</span>
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <button className="relative p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group/bell">
              <Bell size={22} strokeWidth={2} className="group-hover/bell:animate-pulse" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-lg shadow-rose-500/50 animate-pulse"></span>
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;