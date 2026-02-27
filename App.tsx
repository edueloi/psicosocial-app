import React, { useState } from 'react';
import { MOCK_USERS, MOCK_TENANTS } from './constants';
import { AppModuleId, ClientCompany, ModulePermissions, PermissionProfile, User, Tenant, UserPreferences, UserProfileSettings, UserStatus } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ActionPlan from './components/ActionPlan';
import PsychosocialModule from './components/PsychosocialModule';
import Reports from './components/Reports';
import UsersModule from './components/UsersModule';
import UnitsModule from './components/UnitsModule';
import AuditReadiness from './components/AuditReadiness';
import ComplianceTimeline from './components/ComplianceTimeline';
import FormsCenter from './components/FormsCenter';
import OperationsHub from './components/OperationsHub';
import PermissionsModule from './components/PermissionsModule';
import { AppDataProvider } from './appData';

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
        ? parsed.permissionProfiles
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
  const activePermissions = activePermissionProfile?.permissions || defaultPermissions();

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
        ? parsed.permissionProfiles
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

  const activePermissionProfile = permissionProfiles.find(p => p.id === selectedPermissionProfileId) || permissionProfiles[0];
  const activePermissions = activePermissionProfile?.permissions || defaultPermissions();

  React.useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
      preferences,
      profile,
      permissionProfiles,
      selectedPermissionProfileId,
    }));
  }, [preferences, profile, permissionProfiles, selectedPermissionProfileId]);

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

  if (!currentUser) {
    const l = preferences.language;
    const title = l === 'en-US' ? 'Select a demo user' : l === 'es-ES' ? 'Selecciona un usuario de demostración' : 'Selecione um usuário para demonstração';
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">NR01-Master</h1>
            <p className="text-slate-500">{title}</p>
          </div>
          <div className="space-y-4">
            {users.map(u => (
              <button key={u.id} onClick={() => handleLogin(u)} className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all group">
                <div className="text-left"><p className="font-semibold text-slate-800">{u.name}</p><p className="text-xs text-slate-500 uppercase tracking-wider">{u.role}</p></div>
                <div className="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">Entrar →</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const noAccessMessage = preferences.language === 'en-US' ? 'You do not have permission to view this module.' : preferences.language === 'es-ES' ? 'No tienes permiso para ver este módulo.' : 'Você não tem permissão para visualizar este módulo.';
  const renderContent = () => {
    if (!activePermissions[activeTab]?.view) return <div className="p-10 text-center text-rose-500 font-semibold">{noAccessMessage}</div>;

    switch (activeTab) {
      case 'dashboard': return <Dashboard vision={vision} />;
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
        {renderContent()}
      </Layout>
    </AppDataProvider>
  );
};

export default App;
