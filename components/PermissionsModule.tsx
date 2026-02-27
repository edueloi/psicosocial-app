import React from 'react';
import { KeyRound, Plus, Search, ShieldCheck } from 'lucide-react';
import { AppModuleId, ModulePermissions, PermissionProfile } from '../types';

interface PermissionsModuleProps {
  profiles: PermissionProfile[];
  selectedProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, parentId?: string) => void;
  onUpdateProfile: (id: string, patch: Partial<Omit<PermissionProfile, 'id'>>) => void;
}

const moduleLabels: Record<AppModuleId, string> = {
  dashboard: 'Dashboard',
  inventory: 'Gestão de Riscos',
  actions: 'Plano de Ação',
  psychosocial: 'Psicossocial',
  audit: 'Status Auditoria',
  timeline: 'Timeline NR-01',
  users: 'Usuários',
  units: 'Unidades',
  forms: 'Forms Externos',
  operations: 'Operação Mensal',
  permissions: 'Permissões',
  reports: 'Relatórios PGR',
};

const groupedModules: { title: string; modules: AppModuleId[] }[] = [
  { title: 'Operação e Risco', modules: ['dashboard', 'inventory', 'actions', 'operations', 'forms'] },
  { title: 'Governança', modules: ['psychosocial', 'audit', 'timeline', 'reports'] },
  { title: 'Administração', modules: ['users', 'units', 'permissions'] },
];

const actions: Array<keyof ModulePermissions> = ['view', 'create', 'edit', 'delete', 'export'];
const actionLabels: Record<keyof ModulePermissions, string> = {
  view: 'Visualizar',
  create: 'Criar',
  edit: 'Editar',
  delete: 'Excluir',
  export: 'Exportar',
};

const PermissionsModule: React.FC<PermissionsModuleProps> = ({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
}) => {
  const [newProfileName, setNewProfileName] = React.useState('');
  const [parentProfileId, setParentProfileId] = React.useState('');
  const [profileSearch, setProfileSearch] = React.useState('');
  const [permissionSearch, setPermissionSearch] = React.useState('');

  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  const filteredProfiles = profiles.filter(p => p.name.toLowerCase().includes(profileSearch.toLowerCase()));

  const togglePermission = (moduleId: AppModuleId, action: keyof ModulePermissions) => {
    if (!selectedProfile) return;
    const nextPermissions = {
      ...selectedProfile.permissions,
      [moduleId]: {
        ...selectedProfile.permissions[moduleId],
        [action]: !selectedProfile.permissions[moduleId][action],
      },
    };
    onUpdateProfile(selectedProfile.id, { permissions: nextPermissions });
  };

  const handleCreateProfile = () => {
    const trimmed = newProfileName.trim();
    if (!trimmed) return;
    onCreateProfile(trimmed, parentProfileId || undefined);
    setNewProfileName('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-5 pb-10">
      <aside className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h3 className="font-black text-slate-900 text-lg mb-3">Perfis de acesso</h3>
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={profileSearch} onChange={(e) => setProfileSearch(e.target.value)} placeholder="Buscar perfil" className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {filteredProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition ${selectedProfile?.id === profile.id ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              {profile.name}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
          <input value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="Nome do novo perfil" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <select value={parentProfileId} onChange={(e) => setParentProfileId(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">Sem perfil pai</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={handleCreateProfile} className="w-full rounded-xl bg-indigo-600 text-white text-sm font-semibold px-3 py-2.5 hover:bg-indigo-700 flex items-center justify-center gap-2">
            <Plus size={14} /> Criar perfil
          </button>
        </div>
      </aside>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Permissões do perfil</h2>
            <p className="text-sm text-slate-500">Perfil selecionado: <span className="font-semibold text-slate-700">{selectedProfile?.name}</span></p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-1">
            <ShieldCheck size={13} /> Controle avançado
          </span>
        </div>

        {selectedProfile && (
          <>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><KeyRound size={15} /> Acessos</p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <label className="rounded-xl border border-slate-200 px-3 py-2 text-xs flex items-center justify-between">Acesso externo bloqueado <input type="checkbox" checked={selectedProfile.access.externalBlocked} onChange={(e) => onUpdateProfile(selectedProfile.id, { access: { ...selectedProfile.access, externalBlocked: e.target.checked } })} /></label>
                <label className="rounded-xl border border-slate-200 px-3 py-2 text-xs">Entrada
                  <input type="time" value={selectedProfile.access.startTime} onChange={(e) => onUpdateProfile(selectedProfile.id, { access: { ...selectedProfile.access, startTime: e.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs" />
                </label>
                <label className="rounded-xl border border-slate-200 px-3 py-2 text-xs">Saída
                  <input type="time" value={selectedProfile.access.endTime} onChange={(e) => onUpdateProfile(selectedProfile.id, { access: { ...selectedProfile.access, endTime: e.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs" />
                </label>
                <label className="rounded-xl border border-slate-200 px-3 py-2 text-xs flex items-center justify-between">Acesso simultâneo bloqueado <input type="checkbox" checked={selectedProfile.access.simultaneousBlocked} onChange={(e) => onUpdateProfile(selectedProfile.id, { access: { ...selectedProfile.access, simultaneousBlocked: e.target.checked } })} /></label>
                <label className="rounded-xl border border-slate-200 px-3 py-2 text-xs">Expiração sessão (min)
                  <input type="number" min={15} value={selectedProfile.access.sessionExpirationMin} onChange={(e) => onUpdateProfile(selectedProfile.id, { access: { ...selectedProfile.access, sessionExpirationMin: Number(e.target.value) || 15 } })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs" />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-sm font-black text-slate-800">Permissões</p>
                <div className="relative w-full max-w-sm">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={permissionSearch} onChange={(e) => setPermissionSearch(e.target.value)} placeholder="Buscar permissões" className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2 text-sm" />
                </div>
              </div>

              <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">
                {groupedModules.map((group) => {
                  const visibleModules = group.modules.filter((moduleId) => moduleLabels[moduleId].toLowerCase().includes(permissionSearch.toLowerCase()));
                  if (!visibleModules.length) return null;
                  return (
                    <div key={group.title} className="border border-slate-200 rounded-xl p-3">
                      <h4 className="text-sm font-bold text-slate-800 mb-2">{group.title}</h4>
                      <div className="space-y-2">
                        {visibleModules.map((moduleId) => (
                          <div key={moduleId} className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 md:items-center border border-slate-100 rounded-lg p-2">
                            <p className="text-sm font-semibold text-slate-700">{moduleLabels[moduleId]}</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
                              {actions.map((action) => (
                                <label key={action} className="text-[11px] rounded-md border border-slate-200 px-2 py-1.5 flex items-center justify-between text-slate-600">
                                  {actionLabels[action]}
                                  <input type="checkbox" checked={selectedProfile.permissions[moduleId][action]} onChange={() => togglePermission(moduleId, action)} />
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default PermissionsModule;
