import React, { useMemo, useState } from 'react';
import { BarChart3, Building2, CheckCircle2, KeyRound, Mail, Search, Shield, UserPlus, Users } from 'lucide-react';
import { ClientCompany, PermissionProfile, User, UserRole, UserStatus } from '../types';
import Button from './Button';

interface UsersModuleProps {
  users: User[];
  permissionProfiles: PermissionProfile[];
  clientCompanies: ClientCompany[];
  companyProfileMap: Record<string, string>;
  onCreateClientCompany: (name: string) => void;
  onCreateUser: (payload: Omit<User, 'id' | 'status' | 'tenantId'>) => void;
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
}

const statusBadgeClass: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  [UserStatus.PENDING]: 'border-amber-200 bg-amber-50 text-amber-700',
  [UserStatus.SUSPENDED]: 'border-rose-200 bg-rose-50 text-rose-700',
  [UserStatus.REVOKED]: 'border-slate-200 bg-slate-100 text-slate-600',
};

const UsersModule: React.FC<UsersModuleProps> = ({ users, permissionProfiles, clientCompanies, companyProfileMap, onCreateClientCompany, onCreateUser, onUpdateUserStatus }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [profileFilter, setProfileFilter] = useState<'all' | string>('all');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    name: '',
    email: '',
    role: UserRole.EMPLOYEE,
    psychosocialAccess: false,
    clientCompanyId: '',
  });

  const filteredUsers = useMemo(() => users.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    const matchesCompany = companyFilter === 'all' || u.clientCompanyId === companyFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesProfile = profileFilter === 'all' || u.permissionProfileId === profileFilter;
    return matchesSearch && matchesCompany && matchesStatus && matchesRole && matchesProfile;
  }), [users, search, companyFilter, statusFilter, roleFilter, profileFilter]);

  const usersByCompany = useMemo(() => {
    const bucket = new Map<string, number>();
    filteredUsers.forEach((user) => {
      const companyName = clientCompanies.find((company) => company.id === user.clientCompanyId)?.name || 'Sem empresa';
      bucket.set(companyName, (bucket.get(companyName) || 0) + 1);
    });
    return Array.from(bucket.entries()).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  }, [filteredUsers, clientCompanies]);

  const usersByRole = useMemo(() => {
    const bucket = new Map<string, number>();
    filteredUsers.forEach((user) => {
      bucket.set(user.role, (bucket.get(user.role) || 0) + 1);
    });
    return Array.from(bucket.entries()).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  }, [filteredUsers]);

  const stats = [
    { label: 'Total Usuários', value: users.length, icon: <Users size={16} />, color: 'text-slate-700' },
    { label: 'Empresas Clientes', value: clientCompanies.length, icon: <Building2 size={16} />, color: 'text-violet-700' },
    { label: 'Perfis de Permissão', value: permissionProfiles.length, icon: <KeyRound size={16} />, color: 'text-indigo-700' },
    { label: 'Ativos', value: users.filter(u => u.status === UserStatus.ACTIVE).length, icon: <Shield size={16} />, color: 'text-emerald-600' },
    { label: 'Pendentes', value: users.filter(u => u.status === UserStatus.PENDING).length, icon: <Mail size={16} />, color: 'text-amber-600' },
  ];

  const submitUser = () => {
    const normalizedEmail = draft.email.trim().toLowerCase();

    if (!draft.name.trim() || !normalizedEmail) {
      setFormError('Preencha nome e e-mail para criar o usuário.');
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!emailIsValid) {
      setFormError('Informe um e-mail corporativo válido.');
      return;
    }

    const emailAlreadyExists = users.some(user => user.email.trim().toLowerCase() === normalizedEmail);
    if (emailAlreadyExists) {
      setFormError('Já existe um usuário com este e-mail.');
      return;
    }

    if (!draft.clientCompanyId) {
      setFormError('Selecione a empresa cliente do usuário.');
      return;
    }

    if (!selectedProfileId) {
      setFormError('Selecione um perfil de permissão para o usuário.');
      return;
    }

    onCreateUser({
      name: draft.name,
      email: draft.email.trim(),
      role: draft.role,
      psychosocialAccess: draft.psychosocialAccess,
      permissionProfileId: selectedProfileId,
      clientCompanyId: draft.clientCompanyId,
      lastAccess: undefined,
      lastIp: undefined,
      device: undefined,
    });

    setDraft({ name: '', email: '', role: UserRole.EMPLOYEE, psychosocialAccess: false, clientCompanyId: '' });
    setSelectedProfileId('');
    setFormError(null);
    setShowInviteModal(false);
  };

  const addClientCompany = () => {
    const name = newCompanyName.trim();
    if (!name) {
      setFormError('Digite o nome da empresa cliente para adicionar.');
      return;
    }

    const companyAlreadyExists = clientCompanies.some(
      company => company.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (companyAlreadyExists) {
      setFormError('Esta empresa cliente já está cadastrada.');
      return;
    }

    onCreateClientCompany(name);
    setFormError(null);
    setInfoMessage(`Empresa ${name} adicionada com sucesso.`);
    setNewCompanyName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Usuários e Permissões</h2>
          <p className="text-slate-500 text-sm mt-1">Cadastre empresas clientes, crie usuários e associe perfis de permissão por cliente.</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} variant="primary" size="md" icon={<UserPlus size={18} />}>
          Criar Usuário
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px_200px_200px_220px] gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar por nome ou e-mail..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" />
          </div>
          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
            <option value="all">Empresa: todas</option>
            {clientCompanies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | UserStatus)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
            <option value="all">Status: todos</option>
            {Object.values(UserStatus).map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
            <option value="all">Cargo: todos</option>
            {Object.values(UserRole).map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <select value={profileFilter} onChange={(e) => setProfileFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
            <option value="all">Perfil: todos</option>
            {permissionProfiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px] gap-2">
          <input
            value={newCompanyName}
            onChange={(e) => { setNewCompanyName(e.target.value); if (formError) setFormError(null); if (infoMessage) setInfoMessage(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter') addClientCompany(); }}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            placeholder="Adicionar empresa cliente"
          />
          <button onClick={addClientCompany} className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition">Adicionar</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <p className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><Shield size={14} /> Governança de acesso por empresa</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {clientCompanies.map((company) => {
            const defaultProfile = permissionProfiles.find((profile) => profile.id === companyProfileMap[company.id]);
            const totalUsers = users.filter((user) => user.clientCompanyId === company.id).length;
            return (
              <div key={company.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-black text-slate-800">{company.name}</p>
                <p className="text-xs text-slate-500 mt-1">Usuários vinculados: <span className="font-bold text-slate-700">{totalUsers}</span></p>
                <p className="text-xs mt-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wide">Perfil padrão:</span>{' '}
                  <span className="font-semibold text-indigo-700">{defaultProfile?.name || 'Não definido'}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><Building2 size={14} /> Usuários por empresa</p>
          <div className="space-y-2">
            {usersByCompany.slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium truncate">{item.name}</span>
                <span className="text-violet-700 font-black">{item.total}</span>
              </div>
            ))}
            {!usersByCompany.length && <p className="text-xs text-slate-500">Sem dados para os filtros aplicados.</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><BarChart3 size={14} /> Usuários por função/cargo</p>
          <div className="space-y-2">
            {usersByRole.slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium truncate">{item.name}</span>
                <span className="text-indigo-700 font-black">{item.total}</span>
              </div>
            ))}
            {!usersByRole.length && <p className="text-xs text-slate-500">Sem dados para os filtros aplicados.</p>}
          </div>
        </div>
      </div>

      {formError && !showInviteModal && <p className="text-sm text-rose-600 font-semibold">{formError}</p>}
      {infoMessage && !showInviteModal && <p className="text-sm text-emerald-600 font-semibold">{infoMessage}</p>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 text-sm font-bold text-slate-700 grid grid-cols-12 gap-3">
          <span className="col-span-2">Usuário</span>
          <span className="col-span-3">E-mail</span>
          <span className="col-span-2">Empresa</span>
          <span className="col-span-1">Papel</span>
          <span className="col-span-2">Perfil Permissão</span>
          <span className="col-span-2">Status</span>
        </div>
        {!filteredUsers.length && (
          <div className="px-5 py-10 text-center text-sm text-slate-500">Nenhum usuário encontrado para os filtros aplicados.</div>
        )}
        {filteredUsers.map((u) => {
          const profile = permissionProfiles.find(p => p.id === u.permissionProfileId);
          const company = clientCompanies.find(c => c.id === u.clientCompanyId);
          return (
            <div key={u.id} className="px-5 py-4 border-b last:border-b-0 border-slate-100 text-sm grid grid-cols-12 gap-3 items-center">
              <span className="col-span-2 font-semibold text-slate-800">{u.name}</span>
              <span className="col-span-3 text-slate-600 truncate">{u.email}</span>
              <span className="col-span-2 text-violet-700 font-medium">{company?.name || 'Não definida'}</span>
              <span className="col-span-1 text-slate-600 text-xs font-semibold">{u.role}</span>
              <span className="col-span-2 text-indigo-700 font-medium">{profile?.name || 'Não definido'}</span>
              <div className="col-span-2 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs border ${statusBadgeClass[u.status]}`}>{u.status}</span>
                <select value={u.status} onChange={(e) => onUpdateUserStatus(u.id, e.target.value as UserStatus)} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  {Object.values(UserStatus).map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight">Criar usuário com permissão</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-2 rounded-xl bg-white/10"><CheckCircle2 size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input value={draft.name} onChange={(e) => setDraft(prev => ({ ...prev, name: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder="Nome completo" />
                <input value={draft.email} onChange={(e) => setDraft(prev => ({ ...prev, email: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder="E-mail corporativo" />
                <select value={draft.clientCompanyId} onChange={(e) => {
                  const companyId = e.target.value;
                  setDraft(prev => ({ ...prev, clientCompanyId: companyId }));
                  const defaultProfile = companyProfileMap[companyId];
                  setSelectedProfileId(defaultProfile || '');
                }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                  <option value="">Selecione a empresa cliente</option>
                  {clientCompanies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={draft.role} onChange={(e) => setDraft(prev => ({ ...prev, role: e.target.value as UserRole }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                  {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={selectedProfileId} onChange={(e) => setSelectedProfileId(e.target.value)} className="md:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                  <option value="">Selecione o perfil de permissão</option>
                  {permissionProfiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <label className="rounded-2xl border border-slate-200 p-3 text-sm font-medium flex items-center justify-between">
                Acesso ao módulo psicossocial
                <input type="checkbox" checked={draft.psychosocialAccess} onChange={(e) => setDraft(prev => ({ ...prev, psychosocialAccess: e.target.checked }))} />
              </label>

              {formError && <p className="text-sm text-rose-600 font-semibold">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-black uppercase">Cancelar</button>
                <button onClick={submitUser} className="flex-1 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase">Criar usuário</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersModule;
