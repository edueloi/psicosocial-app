
import React, { useState } from 'react';
import { 
  UserPlus, Mail, Shield, MoreVertical, Search, Filter, 
  ShieldCheck, Lock, Eye, History, UserMinus, UserCheck, 
  RotateCcw, Info, X, Check, BrainCircuit, Globe, Laptop,
  Fingerprint, ChevronRight, AlertTriangle, Users, CheckCircle2
} from 'lucide-react';
import { UserRole, UserStatus, User } from '../types';
import { MOCK_USERS } from '../constants';
import Button from './Button';

const ROLE_CONFIG = {
  [UserRole.TENANT_ADMIN]: { label: 'Admin Master', color: 'bg-indigo-600 text-white', icon: '👑' },
  [UserRole.ADMINISTRATOR]: { label: 'Administrador', color: 'bg-indigo-100 text-indigo-700', icon: '🛡️' },
  [UserRole.SST_CONSULTANT]: { label: 'Consultor SST', color: 'bg-emerald-100 text-emerald-700', icon: '🧠' },
  [UserRole.RH_MANAGER]: { label: 'Gestor de RH', color: 'bg-amber-100 text-amber-700', icon: '🧑‍💼' },
  [UserRole.AUDITOR]: { label: 'Auditor Externo', color: 'bg-slate-100 text-slate-700', icon: '👀' },
  [UserRole.EMPLOYEE]: { label: 'Colaborador', color: 'bg-slate-50 text-slate-500', icon: '👤' },
  [UserRole.SUPER_ADMIN]: { label: 'SaaS Admin', color: 'bg-rose-100 text-rose-700', icon: '⚡' },
};

const STATUS_CONFIG = {
  [UserStatus.ACTIVE]: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  [UserStatus.SUSPENDED]: { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  [UserStatus.REVOKED]: { color: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  [UserStatus.PENDING]: { color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const UsersModule: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLogId, setShowLogId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const stats = [
    // Added Users icon to stats
    { label: 'Total Usuários', value: MOCK_USERS.length, icon: <Users size={16}/>, color: 'text-slate-600' },
    { label: 'Admin Master/Adm', value: MOCK_USERS.filter(u => u.role === UserRole.TENANT_ADMIN || u.role === UserRole.ADMINISTRATOR).length, icon: <Shield size={16}/>, color: 'text-indigo-600' },
    { label: 'Acesso Psicossocial', value: MOCK_USERS.filter(u => u.psychosocialAccess).length, icon: <BrainCircuit size={16}/>, color: 'text-rose-500' },
    { label: 'Convites Pendentes', value: MOCK_USERS.filter(u => u.status === UserStatus.PENDING).length, icon: <Mail size={16}/>, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Usuários e Permissões</h2>
          <p className="text-slate-500 text-sm mt-1">Controle de acesso granular e auditoria de logs conforme LGPD</p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          variant="primary"
          size="md"
          icon={<UserPlus size={18} />}
        >
          Convidar Usuário
        </Button>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all hover:border-slate-300">
            <div className={`w-11 h-11 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Matrix Info */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Pesquisar por nome, e-mail ou unidade..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none hover:border-slate-300 transition-colors cursor-pointer">
                <option>Papel: Todos</option>
                {Object.values(UserRole).map(v => <option key={v}>{v}</option>)}
              </select>
              <select className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none hover:border-slate-300 transition-colors cursor-pointer">
                <option>Status: Todos</option>
                {Object.values(UserStatus).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center gap-3 hover:border-indigo-300 transition-colors cursor-help">
          <div className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0">
             <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
             <p className="text-xs font-bold text-indigo-900 mb-0.5">Hierarquia Ativa</p>
             <p className="text-xs text-indigo-700 font-medium">RBAC Vigente</p>
          </div>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Papel</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Psicossocial</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm uppercase shadow-sm group-hover:scale-105 transition-transform">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${STATUS_CONFIG[user.status].dot}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          {user.name}
                          {user.role === UserRole.TENANT_ADMIN && <span className="text-amber-500" title="Proprietário da Conta">👑</span>}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${ROLE_CONFIG[user.role].color}`}>
                      <span>{ROLE_CONFIG[user.role].icon}</span>
                      {ROLE_CONFIG[user.role].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[user.status].color}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                         user.psychosocialAccess 
                           ? 'bg-rose-50 border-rose-200 text-rose-600' 
                           : 'bg-slate-50 border-slate-200 text-slate-400'
                       }`}>
                          <BrainCircuit size={16} />
                       </div>
                       <span className={`text-xs font-semibold ${user.psychosocialAccess ? 'text-rose-600' : 'text-slate-400'}`}>
                          {user.psychosocialAccess ? 'Liberado' : 'Bloqueado'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setShowLogId(showLogId === user.id ? null : user.id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Ver Logs de Acesso"
                      >
                        <Fingerprint size={18} />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenu === user.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
                                <Eye size={16} /> Editar Perfil
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                <Lock size={16} /> Permissões Avançadas
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                <UserMinus size={16} /> Suspender Acesso
                              </button>
                              <button 
                                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all ${user.role === UserRole.TENANT_ADMIN ? 'opacity-30 cursor-not-allowed' : ''}`}
                                disabled={user.role === UserRole.TENANT_ADMIN}
                              >
                                <X size={14} /> Revogar Permanentemente
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Log Expanded Area */}
        {showLogId && (
          <div className="bg-slate-900 p-8 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-3">
                     <History size={18} className="text-indigo-400" />
                     Trilha de Auditoria Individual
                  </h4>
                  <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase">Monitoramento de Segurança e Conformidade</p>
               </div>
               <button onClick={() => setShowLogId(null)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Último IP Detectado</p>
                  <div className="flex items-center gap-2 text-indigo-400">
                     <Globe size={14} />
                     <span className="text-xs font-mono font-bold">187.12.44.102</span>
                  </div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Dispositivo Confiável</p>
                  <div className="flex items-center gap-2 text-indigo-400">
                     <Laptop size={14} />
                     <span className="text-xs font-bold uppercase">MacBook Pro / Chrome v124</span>
                  </div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Identidade Verificada</p>
                  <div className="flex items-center gap-2 text-emerald-400">
                     {/* Corrected: CheckCircle2 icon usage */}
                     <CheckCircle2 size={14} />
                     <span className="text-xs font-bold uppercase">MFA ATIVO</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               {[
                 { action: 'Acesso ao Sistema', date: 'Hoje às 10:30', detail: 'Sessão iniciada com sucesso via Autenticação SSO.' },
                 { action: 'Visualização de Relatório PGR', date: 'Ontem às 15:20', detail: 'Exportação do Dossiê Completo da Unidade Norte.' },
                 { action: 'Alteração de Permissão', date: '12/04 às 09:00', detail: 'Liberado acesso ao módulo Psicossocial para gestão de riscos.' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 items-start border-l border-white/10 pl-6 pb-4 group/log">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 ring-4 ring-indigo-500/20 group-hover/log:scale-150 transition-transform"></div>
                    <div>
                       <div className="flex items-center gap-3">
                          <p className="text-xs font-black text-white uppercase">{log.action}</p>
                          <span className="text-[10px] text-slate-500 font-bold">{log.date}</span>
                       </div>
                       <p className="text-[11px] text-slate-400 mt-1">{log.detail}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserPlus size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight leading-none">Convidar Integrante</h3>
                  <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-[0.2em] mt-2 opacity-80">Rastreabilidade e Segurança LGPD</p>
                </div>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-xl">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nome Completo</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" placeholder="Ex: João da Silva" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">E-mail Corporativo</label>
                  <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" placeholder="exemplo@empresa.com" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Papel Hierárquico</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none appearance-none">
                    <option value={UserRole.ADMINISTRATOR}>Administrador</option>
                    <option value={UserRole.SST_CONSULTANT}>Consultor SST</option>
                    <option value={UserRole.RH_MANAGER}>Gestor de RH</option>
                    <option value={UserRole.AUDITOR}>Auditor Externo (Leitura)</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Unidade Vinculada</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none appearance-none">
                    <option>Todas as Unidades</option>
                    <option>Planta Norte</option>
                    <option>Escritório Central</option>
                  </select>
                </div>

                <div className="col-span-2 p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group/toggle cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 border border-slate-200 group-hover/toggle:scale-110 transition-transform">
                         <BrainCircuit size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-800 uppercase">Acesso Psicossocial</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase">Permite visualizar dados sensíveis de clima</p>
                      </div>
                   </div>
                   <div className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors group-hover/toggle:bg-indigo-200">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
                   </div>
                </div>
              </div>

              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-900 font-bold leading-relaxed uppercase">
                  Aviso: O convite expira em <span className="underline">48 horas</span>. Toda a criação de conta é registrada nos logs de segurança do tenant.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
                >
                  Enviar Convite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersModule;


