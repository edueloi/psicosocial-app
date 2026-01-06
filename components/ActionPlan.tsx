
import React, { useState } from 'react';
import { ActionStatus, ActionType, RiskType } from '../types';
import { STATUS_COLORS } from '../constants';
import { 
  Plus, Search, Calendar, User, FileText, CheckCircle, 
  AlertTriangle, Filter, MoreVertical, ShieldAlert, 
  Clock, Link as LinkIcon, TrendingDown, X, Paperclip, ChevronRight,
  Info, History, CheckCircle2
} from 'lucide-react';

const MOCK_ACTIONS = [
  { 
    id: 'a1', 
    title: 'Workshop Preventivo: Saúde Mental', 
    responsible: 'Ana RH', 
    dueDate: '2024-05-20', 
    status: ActionStatus.PENDING, 
    desc: 'Treinamento obrigatório para gestores sobre prevenção ao Burnout e assédio.',
    riskId: 'r2',
    riskName: 'Carga Mental Elevada',
    riskCategory: RiskType.PSYCHOSOCIAL,
    riskLevel: 'Crítico',
    actionType: ActionType.TRAINING,
    expectedImpact: 'Redução de severidade Crítico → Moderado',
    evidenceCount: 0
  },
  { 
    id: 'a2', 
    title: 'Troca de Filtros Exaustão Pintura', 
    responsible: 'Carlos Manutenção', 
    dueDate: '2023-10-15', 
    status: ActionStatus.PENDING, 
    desc: 'Substituição periódica obrigatória conforme cronograma de manutenção.',
    riskId: 'r4',
    riskName: 'Inalação de Solventes',
    riskCategory: RiskType.CHEMICAL,
    riskLevel: 'Crítico',
    actionType: ActionType.ENGINEERING,
    expectedImpact: 'Controle na fonte / Blindagem fiscal',
    evidenceCount: 1
  },
  { 
    id: 'a3', 
    title: 'Substituição Mobiliário Ergonômico', 
    responsible: 'Patrimônio', 
    dueDate: '2024-12-05', 
    status: ActionStatus.IN_PROGRESS, 
    desc: 'Troca de cadeiras no faturamento conforme laudo ergonômico.',
    riskId: 'r3',
    riskName: 'Postura Inadequada',
    riskCategory: RiskType.ERGONOMIC,
    riskLevel: 'Moderado',
    actionType: ActionType.ADMINISTRATIVE,
    expectedImpact: 'Prevenção de afastamentos',
    evidenceCount: 2
  },
  { 
    id: 'a4', 
    title: 'Implantação Canal de Ouvidoria', 
    responsible: 'Dr. Roberto Santos', 
    dueDate: '2023-09-30', 
    status: ActionStatus.COMPLETED, 
    desc: 'Sistema de relatos anônimos para gestão de riscos interpessoais.',
    riskId: 'r2',
    riskName: 'Conflitos Liderança',
    riskCategory: RiskType.PSYCHOSOCIAL,
    riskLevel: 'Moderado',
    actionType: ActionType.ADMINISTRATIVE,
    expectedImpact: 'Rastreabilidade e Compliance NR-01',
    evidenceCount: 3
  },
];

const ActionPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('kanban');
  const [showNewAction, setShowNewAction] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const stats = [
    { label: 'Total de Ações', value: MOCK_ACTIONS.length, color: 'text-slate-600', icon: <FileText size={18}/> },
    { label: 'Ações Vencidas', value: MOCK_ACTIONS.filter(a => new Date(a.dueDate) < new Date() && a.status !== ActionStatus.COMPLETED).length, color: 'text-rose-600', icon: <Clock size={18}/> },
    { label: 'Sem Evidência', value: MOCK_ACTIONS.filter(a => a.evidenceCount === 0 && a.status !== ActionStatus.COMPLETED).length, color: 'text-amber-600', icon: <Paperclip size={18}/> },
    { label: 'Riscos Críticos', value: MOCK_ACTIONS.filter(a => a.riskLevel === 'Crítico').length, color: 'text-indigo-600', icon: <ShieldAlert size={18}/> },
  ];

  const columns = [
    { title: 'Pendente / Vencida', status: ActionStatus.PENDING },
    { title: 'Em Andamento', status: ActionStatus.IN_PROGRESS },
    { title: 'Concluído', status: ActionStatus.COMPLETED },
  ];

  const isOverdue = (date: string, status: ActionStatus) => {
    return new Date(date) < new Date() && status !== ActionStatus.COMPLETED;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Plano de Ação NR-01</h2>
          <p className="text-slate-500 text-sm font-medium">Contramedidas vinculadas aos riscos e rastreabilidade documental.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'kanban' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Kanban
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Container */}
      <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar min-h-[700px]">
        {columns.map(col => (
          <div key={col.status} className="flex-1 min-w-[360px] flex flex-col gap-4">
            <div className="flex items-center justify-between px-3">
              <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[col.status]?.split(' ')[0]} border border-white shadow-sm ring-1 ring-slate-200`}></span>
                {col.title}
              </h3>
              <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full border border-white shadow-sm">
                {MOCK_ACTIONS.filter(a => col.status === ActionStatus.PENDING ? (a.status === ActionStatus.PENDING || a.status === ActionStatus.OVERDUE) : a.status === col.status).length}
              </span>
            </div>

            <div className="flex-1 space-y-5 bg-slate-100/40 p-3 rounded-3xl border border-dashed border-slate-200">
              {MOCK_ACTIONS.filter(a => col.status === ActionStatus.PENDING ? (a.status === ActionStatus.PENDING || a.status === ActionStatus.OVERDUE) : a.status === col.status).map(action => {
                const overdue = isOverdue(action.dueDate, action.status);
                const canComplete = action.evidenceCount > 0;
                
                return (
                  <div 
                    key={action.id} 
                    className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-xl transition-all group relative cursor-grab active:cursor-grabbing border-l-4 ${
                      overdue ? 'border-l-rose-500 border-rose-200 bg-rose-50/5' : 'border-l-indigo-500 border-slate-200'
                    }`}
                  >
                    {/* Expiration Alert */}
                    {overdue && (
                      <div className="absolute -top-3 -right-2 bg-rose-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-xl animate-pulse ring-4 ring-white">
                        VENCIDA
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border shadow-sm ${STATUS_COLORS[action.status]}`}>
                          {overdue ? 'Atrasada' : action.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border border-slate-200 bg-slate-50 text-slate-600">
                          {action.actionType}
                        </span>
                      </div>
                      <div className="relative group/menu">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === action.id ? null : action.id)}
                          className="text-slate-300 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-50"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-black text-slate-800 text-base mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{action.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed line-clamp-2">{action.desc}</p>
                    
                    {/* Mandatory Risk Connection Badge */}
                    <div className="mb-5 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group/risk hover:border-indigo-200 transition-all">
                      <div className={`w-1.5 h-10 rounded-full shrink-0 ${action.riskLevel === 'Crítico' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                          <LinkIcon size={12} /> Risco Vinculado
                        </p>
                        <p className="text-xs font-black text-slate-700 truncate">{action.riskName}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">{action.riskCategory} • {action.riskLevel}</p>
                      </div>
                      <ShieldAlert size={16} className={action.riskLevel === 'Crítico' ? 'text-rose-400' : 'text-amber-400'} />
                    </div>

                    <div className="flex flex-col gap-4 pt-5 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-2xl bg-slate-100 border border-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-500">
                            {action.responsible.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-800 tracking-tight">{action.responsible}</span>
                            <span className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${overdue ? 'text-rose-600' : 'text-slate-400'}`}>
                              <Calendar size={12} /> {new Date(action.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                            <Paperclip size={14} className={action.evidenceCount > 0 ? 'text-indigo-500' : 'text-slate-300'} />
                            <span className={action.evidenceCount > 0 ? 'text-indigo-600' : ''}>{action.evidenceCount} Evidências</span>
                          </div>
                        </div>
                        
                        <div className="group/impact relative">
                          <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 hover:scale-110 transition-transform cursor-help">
                            <TrendingDown size={16} />
                          </div>
                          <div className="absolute right-0 bottom-full mb-3 w-48 bg-slate-900 text-white text-[10px] font-bold p-3 rounded-2xl opacity-0 invisible group-hover/impact:opacity-100 group-hover/impact:visible transition-all shadow-2xl z-50">
                            <p className="text-emerald-400 uppercase tracking-widest mb-1">Impacto Esperado</p>
                            {action.expectedImpact}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contextual Action Button */}
                    {action.status !== ActionStatus.COMPLETED && (
                      <div className="mt-5 flex gap-2">
                        <button 
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            canComplete 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          disabled={!canComplete}
                          title={!canComplete ? "Exige ao menos 1 evidência documental para concluir" : "Confirmar mitigação de risco"}
                        >
                          <CheckCircle size={16} /> Concluir
                        </button>
                        {!canComplete && (
                          <button className="w-12 h-12 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">
                            <Plus size={20} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <button 
                onClick={() => setShowNewAction(true)}
                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-500 hover:bg-white transition-all"
              >
                + Adicionar Ação
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Action Form Modal */}
      {showNewAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Nova Ação Corretiva</h3>
                  <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-80">Rastreabilidade NR-01</p>
                </div>
              </div>
              <button onClick={() => setShowNewAction(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Título da Ação</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" placeholder="Ex: Substituição de filtros de exaustão" />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Vincular Risco (Obrigatório)</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all border-l-4 border-l-rose-500">
                    <option>Selecione um risco do inventário...</option>
                    <option>Risco Psicossocial - Carga Mental (Crítico)</option>
                    <option>Risco Químico - Inalação Solventes (Crítico)</option>
                    <option>Risco Físico - Ruído (Moderado)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Tipo de Ação</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none">
                    {Object.values(ActionType).map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Prazo de Conclusão</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Impacto Esperado (Severidade Final)</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none" placeholder="Ex: Redução para nível Moderado" />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Descrição do Plano de Trabalho</label>
                  <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none h-28 resize-none" placeholder="Detalhe as etapas e recursos necessários..." />
                </div>
              </div>

              <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                <Info size={20} className="text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-900 font-bold leading-relaxed uppercase">
                  Aviso: Conforme NR-01, esta ação só poderá ser movida para "Concluído" após o upload de <span className="underline">evidências técnicas comprobatórias</span>.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowNewAction(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowNewAction(false)}
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
                >
                  Criar Plano de Ação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPlan;
