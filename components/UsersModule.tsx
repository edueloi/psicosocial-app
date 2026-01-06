
import React from 'react';
import { UserPlus, Mail, Shield, MoreVertical, Search, Filter } from 'lucide-react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../constants';

const ROLE_LABELS = {
  [UserRole.TENANT_ADMIN]: { label: 'Admin da Empresa', color: 'bg-indigo-100 text-indigo-700' },
  [UserRole.SST_CONSULTANT]: { label: 'Consultor SST', color: 'bg-emerald-100 text-emerald-700' },
  [UserRole.RH_MANAGER]: { label: 'Gestor de RH', color: 'bg-amber-100 text-amber-700' },
  [UserRole.EMPLOYEE]: { label: 'Colaborador', color: 'bg-slate-100 text-slate-700' },
  [UserRole.SUPER_ADMIN]: { label: 'Super Admin', color: 'bg-rose-100 text-rose-700' },
};

const UsersModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Usuários e Permissões</h2>
          <p className="text-slate-500">Gerencie quem tem acesso aos dados da sua empresa</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
          <UserPlus size={18} />
          Convidar Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total de Usuários</p>
            <p className="text-xl font-bold text-slate-800">{MOCK_USERS.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Assentos Ativos</p>
            <p className="text-xl font-bold text-slate-800">3 / 10</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Convites Pendentes</p>
            <p className="text-xl font-bold text-slate-800">1</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Buscar por nome ou e-mail..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Papel / Função</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Último Acesso</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ROLE_LABELS[user.role].color}`}>
                      {ROLE_LABELS[user.role].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-slate-600">Ativo</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    Há 2 horas
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersModule;
