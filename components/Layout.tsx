import React from 'react';
import { AppModuleId, ModulePermissions, User, Tenant, UserPreferences, UserProfileSettings } from '../types';
import { NAV_ITEMS } from '../constants';
import {
  LogOut, Bell, Search, User as UserIcon, ShieldCheck,
  Settings2, UserRoundCog, ChevronLeft, ChevronRight, Command, Settings, ChevronDown, Menu, X
} from 'lucide-react';
import SettingsModule from './SettingsModule';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  currentTenant: Tenant | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  vision: 'tech' | 'exec';
  setVision: (v: 'tech' | 'exec') => void;
  preferences: UserPreferences;
  setPreferences: (next: UserPreferences) => void;
  profile: UserProfileSettings;
  setProfile: (next: UserProfileSettings) => void;
  permissions: Record<AppModuleId, ModulePermissions>;
}

const navLabels: Record<UserPreferences['language'], Record<string, string>> = {
  'pt-BR': { dashboard: 'Dashboard', inventory: 'Gestão de Riscos', actions: 'Plano de Ação', psychosocial: 'Psicossocial', audit: 'Status Auditoria', timeline: 'Timeline NR-01', users: 'Usuários', units: 'Unidades', forms: 'Forms Externos', operations: 'Operação Mensal', permissions: 'Permissões', reports: 'Relatórios PGR' },
  'en-US': { dashboard: 'Dashboard', inventory: 'Risk Management', actions: 'Action Plan', psychosocial: 'Psychosocial', audit: 'Audit Status', timeline: 'NR-01 Timeline', users: 'Users', units: 'Units', forms: 'External Forms', operations: 'Monthly Operations', permissions: 'Permissions', reports: 'PGR Reports' },
  'es-ES': { dashboard: 'Panel', inventory: 'Gestión de Riesgos', actions: 'Plan de Acción', psychosocial: 'Psicosocial', audit: 'Estado de Auditoría', timeline: 'Línea de tiempo NR-01', users: 'Usuarios', units: 'Unidades', forms: 'Formularios Externos', operations: 'Operación Mensual', permissions: 'Permisos', reports: 'Reportes PGR' },
};

const textByLang = {
  'pt-BR': { search: 'Pesquisar módulos, usuários, relatórios...', settings: 'Configurações', profile: 'Meu perfil', logout: 'Sair', tech: 'Técnico', exec: 'Executivo' },
  'en-US': { search: 'Search modules, users, reports...', settings: 'Settings', profile: 'My profile', logout: 'Sign out', tech: 'Technical', exec: 'Executive' },
  'es-ES': { search: 'Buscar módulos, usuarios, reportes...', settings: 'Configuración', profile: 'Mi perfil', logout: 'Cerrar sesión', tech: 'Técnico', exec: 'Ejecutivo' },
};

const Layout: React.FC<LayoutProps> = ({
  children,
  currentUser,
  currentTenant,
  activeTab,
  setActiveTab,
  onLogout,
  vision,
  setVision,
  preferences,
  setPreferences,
  profile,
  setProfile,
  permissions,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentUser.role) && permissions[item.id as AppModuleId]?.view);
  const tx = textByLang[preferences.language];

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 font-sans text-slate-900 selection:bg-indigo-500/20 overflow-hidden">
      {mobileMenuOpen && <button className="fixed inset-0 bg-slate-950/45 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu" />}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 group flex flex-col transition-all duration-300 ease-out bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 shadow-2xl shadow-black/20 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${collapsed ? 'md:w-[80px]' : 'w-[280px]'}`}
      >
        <div className={`h-20 flex items-center ${collapsed ? 'md:justify-center justify-start px-6' : 'px-6'} border-b border-white/5 relative`}>
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">NR</div>
            {!collapsed && <div><h1 className="text-base font-black text-white tracking-tight">NR01 Master</h1><span className="text-[10px] text-indigo-300/90 font-bold tracking-wider">Suite Pro</span></div>}
          </div>
        </div>

        {!collapsed && (
          <div className="px-4 py-5">
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Ambiente</span>
                <span className="text-sm font-semibold text-white truncate max-w-[160px]">{currentTenant?.name || 'Selecione...'}</span>
              </div>
              <ShieldCheck size={16} className="text-emerald-400/90" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar-dark">
          {filteredNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => handleNavClick(item.id)}
                className={`${collapsed ? 'md:justify-center md:px-0 px-4 py-3 rounded-xl' : 'px-4 py-3.5 rounded-xl gap-3.5'} w-full flex items-center transition-all duration-300 ${isActive ? 'bg-indigo-500/25 text-white border border-indigo-400/30' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
                <div className={`${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>{item.icon}</div>
                {!collapsed && <span className="font-semibold tracking-tight text-sm">{navLabels[preferences.language][item.id] || item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 relative">
          {!collapsed && (
            <div className="relative">
              <button onClick={() => setShowUserMenu(v => !v)} className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5 text-white">
                <div className="flex items-center gap-2"><div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center"><UserIcon size={16} /></div><div className="text-left"><p className="text-sm font-semibold truncate max-w-[140px]">{profile.fullName || currentUser.name}</p><p className="text-[10px] text-slate-400">{currentUser.role}</p></div></div>
                <ChevronDown size={14} />
              </button>

              {showUserMenu && (
                <div className="absolute bottom-14 left-0 right-0 rounded-xl border border-slate-700 bg-slate-900 p-1.5 z-50 shadow-2xl">
                  <button onClick={() => { setShowSettingsModal(true); setShowUserMenu(false); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10 text-sm flex items-center gap-2"><Settings size={14}/> {tx.settings}</button>
                  <button onClick={() => { setShowSettingsModal(true); setShowUserMenu(false); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10 text-sm flex items-center gap-2"><UserIcon size={14}/> {tx.profile}</button>
                  <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-500/10 text-sm flex items-center gap-2"><LogOut size={14}/> {tx.logout}</button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setCollapsed(c => !c)} className="hidden md:flex absolute -right-4 top-5 w-9 h-9 bg-slate-800 border border-white/10 text-slate-300 rounded-full items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-2xl z-50">
            {collapsed ? <ChevronRight size={15} strokeWidth={3} /> : <ChevronLeft size={15} strokeWidth={3} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative md:ml-0">
        <header className="h-20 px-4 md:px-8 flex items-center justify-between gap-3 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-20 shadow-sm shadow-slate-200/30">
          <div className="flex items-center gap-2 md:gap-3 w-full max-w-xl group">
            <button className="md:hidden p-2 rounded-lg border border-slate-200 bg-white text-slate-700" onClick={() => setMobileMenuOpen(v => !v)}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder={tx.search} className="relative w-full bg-slate-50/80 border border-slate-200/60 text-sm pl-12 pr-20 py-3 rounded-xl" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg border border-slate-300/80 bg-white text-[10px] font-black text-slate-500 items-center gap-1 hidden md:flex"><Command size={10} />K</div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <div className="bg-white p-1 rounded-xl flex border border-slate-200 shadow-sm">
              <button onClick={() => setVision('tech')} className={`px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${vision === 'tech' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><Settings2 size={13} strokeWidth={2.5} /> <span>{tx.tech}</span></button>
              <button onClick={() => setVision('exec')} className={`px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${vision === 'exec' ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><UserRoundCog size={13} strokeWidth={2.5} /> <span>{tx.exec}</span></button>
            </div>
            <button className="relative p-2.5 md:p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Bell size={20} strokeWidth={2} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">{children}</div>
        </div>
      </main>

      {showSettingsModal && (
        <SettingsModule
          profile={profile}
          preferences={preferences}
          onProfileChange={setProfile}
          onPreferencesChange={setPreferences}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};

export default Layout;
