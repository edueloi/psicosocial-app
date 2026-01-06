
import React, { useState } from 'react';
import { ActionStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { Plus, Search, Calendar, User, FileText, CheckCircle } from 'lucide-react';

const MOCK_ACTIONS = [
  { id: 'a1', title: 'Treinamento de Liderança: Assédio', responsible: 'Ana RH', dueDate: '2023-11-20', status: ActionStatus.PENDING, desc: 'Workshop obrigatório para gerentes sobre prevenção ao assédio moral.' },
  { id: 'a2', title: 'Manutenção Preventiva Exaustores', responsible: 'Carlos Eng', dueDate: '2023-10-15', status: ActionStatus.OVERDUE, desc: 'Verificar filtros e motores dos exaustores do setor de pintura.' },
  { id: 'a3', title: 'Revisão de Cadeiras Ergonômicas', responsible: 'Dr. Roberto', dueDate: '2023-12-05', status: ActionStatus.IN_PROGRESS, desc: 'Substituir 5 cadeiras avariadas no setor administrativo.' },
  { id: 'a4', title: 'Implantação Canal de Escuta', responsible: 'Compliance', dueDate: '2023-09-30', status: ActionStatus.COMPLETED, desc: 'Criação do portal anônimo para relatos de riscos psicossociais.' },
];

const ActionPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('kanban');

  const columns = [
    { title: 'Pendente', status: ActionStatus.PENDING },
    { title: 'Em Andamento', status: ActionStatus.IN_PROGRESS },
    { title: 'Concluído', status: ActionStatus.COMPLETED },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Plano de Ação</h2>
          <p className="text-slate-500">Gestão de contramedidas e evidências de execução</p>
        </div>
        <div className="flex gap-2 bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'kanban' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Kanban
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Lista
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrar por ação ou responsável..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
          <Plus size={18} />
          Nova Ação
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map(col => (
          <div key={col.status} className="flex-1 min-w-[320px] flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[col.status].split(' ')[0]}`}></span>
                {col.title}
              </h3>
              <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {MOCK_ACTIONS.filter(a => a.status === col.status).length}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {MOCK_ACTIONS.filter(a => a.status === col.status).map(action => (
                <div key={action.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_COLORS[action.status]}`}>
                      {action.status}
                    </span>
                    <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={16} />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2 leading-snug">{action.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{action.desc}</p>
                  
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <User size={14} className="text-slate-400" />
                        {action.responsible}
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(action.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {[1, 2].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              <FileText size={12} />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">2 anexos</span>
                      </div>
                      <button className="text-indigo-600 p-1 hover:bg-indigo-50 rounded transition-colors">
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlan;
