import React, { Suspense, lazy, useState } from 'react';
import { MOCK_USERS, MOCK_TENANTS } from './constants';
import { AppModuleId, ClientCompany, ModulePermissions, PermissionProfile, User, Tenant, UserPreferences, UserProfileSettings, UserStatus } from './types';
import Layout from './components/Layout';
import { AppDataProvider } from './appData';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Inventory = lazy(() => import('./components/Inventory'));
const ActionPlan = lazy(() => import('./components/ActionPlan'));
const PsychosocialModule = lazy(() => import('./components/PsychosocialModule'));
const Reports = lazy(() => import('./components/Reports'));
const UsersModule = lazy(() => import('./components/UsersModule'));
const UnitsModule = lazy(() => import('./components/UnitsModule'));
const AuditReadiness = lazy(() => import('./components/AuditReadiness'));
const ComplianceTimeline = lazy(() => import('./components/ComplianceTimeline'));
const FormsCenter = lazy(() => import('./components/FormsCenter'));
const OperationsHub = lazy(() => import('./components/OperationsHub'));
const PermissionsModule = lazy(() => import('./components/PermissionsModule'));
const DocumentsModule = lazy(() => import('./components/DocumentsModule'));

const SETTINGS_STORAGE_KEY = 'settings-profile-v2';

const defaultPermissions = (): Record<AppModuleId, ModulePermissions> => ({
  dashboard: { view: true, create: false, edit: false, delete: false, export: true },
  inventory: { view: true, create: true, edit: true, delete: true, export: true },
  actions: { view: true, create: true, edit: true, delete: true, export: true },
  psychosocial: { view: true, create: true, edit: true, delete: false, export: true },
  audit: { view: true, create: false, edit: false, delete: false, export: true },
  timeline: { view: true, create: false, edit: false, delete: false, export: true },
  users: { view: true, create: true, edit: true, delete: true, export: true },
  units: { view: true, create: true, edit: true, delete: false, export: true },
  forms: { view: true, create: true, edit: true, delete: true, export: true },
  operations: { view: true, create: true, edit: true, delete: true, export: true },
  documents: { view: true, create: true, edit: true, delete: true, export: true },
  reports: { view: true, create: false, edit: false, delete: false, export: true },
  permissions: { view: true, create: false, edit: true, delete: false, export: true },
});

const defaultPermissionProfiles = (): PermissionProfile[] => [
  {
    id: 'pf-admin',
    name: 'Administrador',
    parentId: null,
    access: {
      externalBlocked: false,
      startTime: '00:00',
      endTime: '23:59',
      simultaneousBlocked: false,
      sessionExpirationMin: 240,
    },
    permissions: defaultPermissions(),
  },
  {
    id: 'pf-consultor',
    name: 'Consultor SST',
    parentId: 'pf-admin',
    access: {
      externalBlocked: false,
      startTime: '07:00',
      endTime: '19:00',
      simultaneousBlocked: true,
      sessionExpirationMin: 180,
    },
    permissions: {
      ...defaultPermissions(),
      users: { view: false, create: false, edit: false, delete: false, export: false },
      permissions: { view: false, create: false, edit: false, delete: false, export: false },
    },
  },
];

const defaultPreferences: UserPreferences = {
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  digestFrequency: 'weekly',
  emailAlerts: true,
  pushAlerts: true,
};



const defaultClientCompanies = (): ClientCompany[] => [
  { id: 'c-yasaki', name: 'Yasaki' },
  { id: 'c-toyota', name: 'Toyota 452' },
  { id: 'c-usina', name: 'Usina Pilon' },
];


const countViewPermissions = (profile?: PermissionProfile) => {
  const permissions = profile?.permissions || defaultPermissions();
  return (Object.values(permissions) as ModulePermissions[]).filter((perm) => perm.view).length;
};

const roleLabels: Record<User['role'], string> = {
  'SUPER_ADMIN': 'Super Admin',
  'TENANT_ADMIN': 'Admin do Tenant',
  'ADMINISTRATOR': 'Administrador',
  'SST_CONSULTANT': 'Consultor SST',
  'RH_MANAGER': 'Gestor RH',
  'AUDITOR': 'Auditor',
  'EMPLOYEE': 'Colaborador',
};

const defaultProfile: UserProfileSettings = {
  fullName: 'Admin Master',
  email: 'admin@laboral.com',
  phone: '+55 11 99999-9999',
  roleTitle: 'Administrador do Tenant',
  department: 'SST / Governança',
  bio: 'Responsável por governança NR-01 e acompanhamento dos indicadores psicossociais.',
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(MOCK_TENANTS[0]);
  const [activeTab, setActiveTab] = useState<AppModuleId>('dashboard');
  const [vision, setVision] = useState<'tech' | 'exec'>('tech');
  const [users, setUsers] = useState<User[]>(() => MOCK_USERS);
  const [clientCompanies, setClientCompanies] = useState<ClientCompany[]>(() => defaultClientCompanies());
  const [companyProfileMap, setCompanyProfileMap] = useState<Record<string, string>>({});
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences;
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return defaultPreferences;
      const parsed = JSON.parse(raw);
      return { ...defaultPreferences, ...parsed.preferences };
    } catch { return defaultPreferences; }
  });

  const [profile, setProfile] = useState<UserProfileSettings>(() => {
    if (typeof window === 'undefined') return defaultProfile;
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return defaultProfile;
      const parsed = JSON.parse(raw);
      return { ...defaultProfile, ...parsed.profile };
    } catch { return defaultProfile; }
  });

  const [permissionProfiles, setPermissionProfiles] = useState<PermissionProfile[]>(() => {
    if (typeof window === 'undefined') return defaultPermissionProfiles();
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return defaultPermissionProfiles();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.permissionProfiles) && parsed.permissionProfiles.length
        ? parsed.permissionProfiles.map((profileItem: PermissionProfile) => ({
          ...profileItem,
          permissions: { ...defaultPermissions(), ...(profileItem.permissions || {}) },
        }))
        : defaultPermissionProfiles();
    } catch { return defaultPermissionProfiles(); }
  });

  const [selectedPermissionProfileId, setSelectedPermissionProfileId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'pf-admin';
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return 'pf-admin';
      const parsed = JSON.parse(raw);
      return parsed.selectedPermissionProfileId || 'pf-admin';
    } catch { return 'pf-admin'; }
  });

  const activePermissionProfile =
    permissionProfiles.find(p => p.id === currentUser?.permissionProfileId)
    || permissionProfiles.find(p => p.id === selectedPermissionProfileId)
    || permissionProfiles[0];
  const activePermissions = { ...defaultPermissions(), ...(activePermissionProfile?.permissions || {}) };

  React.useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
      preferences,
      profile,
      permissionProfiles,
      selectedPermissionProfileId,
      users,
      clientCompanies,
      companyProfileMap,
    }));
  }, [preferences, profile, permissionProfiles, selectedPermissionProfileId, users, clientCompanies, companyProfileMap]);


  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.users) && parsed.users.length) {
        setUsers(parsed.users as User[]);
      }
      if (Array.isArray(parsed.clientCompanies) && parsed.clientCompanies.length) {
        setClientCompanies(parsed.clientCompanies as ClientCompany[]);
      }
      if (parsed.companyProfileMap && typeof parsed.companyProfileMap === 'object') {
        setCompanyProfileMap(parsed.companyProfileMap as Record<string, string>);
      }
    } catch {
      // keep defaults
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setCurrentTenant(null);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const tenant = MOCK_TENANTS.find(t => t.id === user.tenantId) || null;
    setCurrentTenant(tenant);
  };

  const handleCreatePermissionProfile = (name: string, parentId?: string) => {
    const parent = permissionProfiles.find(p => p.id === parentId);
    const next: PermissionProfile = {
      id: `pf-${Date.now()}`,
      name,
      parentId: parentId || null,
      access: parent?.access || {
        externalBlocked: false,
        startTime: '00:00',
        endTime: '23:59',
        simultaneousBlocked: false,
        sessionExpirationMin: 240,
      },
      permissions: parent?.permissions || defaultPermissions(),
    };
    setPermissionProfiles(prev => [next, ...prev]);
    setSelectedPermissionProfileId(next.id);
  };

  const handleUpdatePermissionProfile = (id: string, patch: Partial<Omit<PermissionProfile, 'id'>>) => {
    setPermissionProfiles(prev => prev.map(profileItem => profileItem.id === id ? { ...profileItem, ...patch } : profileItem));
  };

  const createClientCompany = (name: string, defaultProfileId?: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) return;

    const companyAlreadyExists = clientCompanies.some(
      company => company.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (companyAlreadyExists) return;

    const id = `c-${Date.now()}`;
    setClientCompanies(prev => [{ id, name: normalizedName }, ...prev]);
    if (defaultProfileId) {
      setCompanyProfileMap(prev => ({ ...prev, [id]: defaultProfileId }));
    }
  };


  const handleEmailLogin = () => {
    const email = loginEmail.trim().toLowerCase();
    if (!email || !loginPassword.trim()) {
      setLoginError('Preencha e-mail e senha para continuar.');
      return;
    }

    const user = users.find((item) => item.email.trim().toLowerCase() === email);
    if (!user) {
      setLoginError('Usuário não encontrado para este e-mail.');
      return;
    }

    if (loginPassword.trim().length < 4) {
      setLoginError('Senha inválida. Use ao menos 4 caracteres.');
      return;
    }

    setLoginError(null);
    handleLogin(user);
  };

  if (!currentUser) {
    const l = preferences.language;
    const title = l === 'en-US' ? 'Secure login and access profile selection' : l === 'es-ES' ? 'Inicio seguro y selección de perfil de acceso' : 'Login seguro e seleção de perfil de acesso';

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[0.4fr_0.6fr] gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 shadow-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-200">NR01 MASTER • LOGIN</p>
            <h1 className="text-3xl font-black mt-3">Entrar com e-mail e senha</h1>
            <p className="text-sm text-slate-300 mt-2">{title}</p>

            <div className="mt-6 space-y-3">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); if (loginError) setLoginError(null); }}
                placeholder="E-mail corporativo"
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); if (loginError) setLoginError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEmailLogin(); }}
                placeholder="Senha"
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              {loginError && <p className="text-xs font-semibold text-rose-300">{loginError}</p>}
              <button onClick={handleEmailLogin} className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase">Logar</button>
              <button onClick={() => setLoginError('Recuperação de senha enviada para o e-mail informado (simulação).')} className="text-xs font-semibold text-indigo-200 hover:text-white underline">Esqueci a senha</button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><p className="text-[10px] uppercase text-slate-400">Módulos</p><p className="text-xl font-black text-indigo-200">13</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><p className="text-[10px] uppercase text-slate-400">Perfis</p><p className="text-xl font-black text-indigo-200">{permissionProfiles.length}</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><p className="text-[10px] uppercase text-slate-400">Empresas</p><p className="text-xl font-black text-indigo-200">{clientCompanies.length}</p></div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 text-slate-900">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-indigo-600">Acesso rápido (cards)</h2>
              <p className="text-sm text-slate-500 mt-1">Entre direto em perfis prontos para demonstração.</p>
            </div>
            <div className="space-y-3">
              {users.map((u) => {
                const profile = permissionProfiles.find((p) => p.id === u.permissionProfileId);
                const permissionCount = countViewPermissions(profile);
                return (
                  <button key={u.id} onClick={() => handleLogin(u)} className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 transition group">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-800">{u.name}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{roleLabels[u.role]}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${u.status === UserStatus.ACTIVE ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>{u.status}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">{profile?.name || 'Sem perfil'}</span>
                      <span className="px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200">{permissionCount} módulos liberados</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const noAccessMessage = preferences.language === 'en-US' ? 'You do not have permission to view this module.' : preferences.language === 'es-ES' ? 'No tienes permiso para ver este módulo.' : 'Você não tem permissão para visualizar este módulo.';
  const renderContent = () => {
    if (!activePermissions[activeTab]?.view) return <div className="p-10 text-center text-rose-500 font-semibold">{noAccessMessage}</div>;

    switch (activeTab) {
      case 'dashboard': return <Dashboard vision={vision} userRole={currentUser.role} />;
      case 'inventory': return <Inventory vision={vision} />;
      case 'actions': return <ActionPlan />;
      case 'psychosocial': return <PsychosocialModule vision={vision} />;
      case 'permissions': return <PermissionsModule profiles={permissionProfiles} clientCompanies={clientCompanies} companyProfileMap={companyProfileMap} selectedProfileId={selectedPermissionProfileId} onSelectProfile={setSelectedPermissionProfileId} onCreateProfile={handleCreatePermissionProfile} onUpdateProfile={handleUpdatePermissionProfile} onAssignProfileToCompany={(companyId, profileId) => setCompanyProfileMap(prev => ({ ...prev, [companyId]: profileId }))} onCreateClientCompany={createClientCompany} />;
      case 'reports': return <Reports />;
      case 'users': return <UsersModule users={users} permissionProfiles={permissionProfiles} clientCompanies={clientCompanies} companyProfileMap={companyProfileMap} onCreateClientCompany={(name) => createClientCompany(name)} onCreateUser={(payload) => setUsers(prev => [{ ...payload, id: `u-${Date.now()}`, status: UserStatus.PENDING, tenantId: currentTenant?.id || 't1' }, ...prev])} onUpdateUserStatus={(userId, status) => setUsers(prev => prev.map((userItem) => userItem.id === userId ? { ...userItem, status } : userItem))} />;
      case 'units': return <UnitsModule />;
      case 'audit': return <AuditReadiness />;
      case 'timeline': return <ComplianceTimeline />;
      case 'forms': return <FormsCenter />;
      case 'operations': return <OperationsHub />;
      case 'documents': return <DocumentsModule currentUser={currentUser} clientCompanies={clientCompanies} />;
      default: return <div className="p-10 text-center text-slate-400">Em desenvolvimento: {activeTab}</div>;
    }
  };

  return (
    <AppDataProvider onNavigate={(tab) => setActiveTab(tab as AppModuleId)}>
      <Layout
        currentUser={currentUser}
        currentTenant={currentTenant}
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as AppModuleId)}
        onLogout={logout}
        vision={vision}
        setVision={setVision}
        preferences={preferences}
        setPreferences={setPreferences}
        profile={profile}
        setProfile={setProfile}
        permissions={activePermissions}
      >
        <Suspense fallback={<div className="p-10 text-center text-slate-400">Carregando módulo...</div>}>
          {renderContent()}
        </Suspense>
      </Layout>
    </AppDataProvider>
  );
};

export default App;
