
import React, { useState } from 'react';
import { ActionStatus, ActionType, RiskType } from '../types';
import { STATUS_COLORS } from '../constants';
import { 
  Plus, Search, Calendar, User, FileText, CheckCircle, 
  AlertTriangle, Filter, MoreVertical, ShieldAlert, 
  Clock, Link as LinkIcon, TrendingDown, Paperclip, ChevronRight,
  Info, History, CheckCircle2, X
} from 'lucide-react';
import { useAppData } from '../appData';
import Button from './Button';
import Modal from './Modal';

const ActionPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('kanban');
  const [showNewAction, setShowNewAction] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { actions, addAction, addEvidence, completeAction } = useAppData();
  const [newTitle, setNewTitle] = useState('');
  const [newRiskId, setNewRiskId] = useState('r2');
  const [newActionType, setNewActionType] = useState<ActionType>(ActionType.TRAINING);
  const [newDueDate, setNewDueDate] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const riskOptions = [
    { id: 'r2', name: 'Carga Mental Elevada', category: RiskType.PSYCHOSOCIAL, level: 'Crítico' },
    { id: 'r4', name: 'Inalação de Solventes', category: RiskType.CHEMICAL, level: 'Crítico' },
    { id: 'r3', name: 'Postura Inadequada', category: RiskType.ERGONOMIC, level: 'Moderado' },
  ];

  const stats = [
    { label: 'Total de Ações', value: actions.length, color: 'text-slate-600', icon: <FileText size={18}/> },
    { label: 'Ações Vencidas', value: actions.filter(a => new Date(a.dueDate) < new Date() && a.status !== ActionStatus.COMPLETED).length, color: 'text-rose-600', icon: <Clock size={18}/> },
    { label: 'Sem Evidência', value: actions.filter(a => a.evidenceCount === 0 && a.status !== ActionStatus.COMPLETED).length, color: 'text-amber-600', icon: <Paperclip size={18}/> },
    { label: 'Riscos Críticos', value: actions.filter(a => a.riskLevel === 'Crítico' || a.riskLevel === 'Crítico').length, color: 'text-indigo-600', icon: <ShieldAlert size={18}/> },
  ];

  const columns = [
    { title: 'Pendente / Vencida', status: ActionStatus.PENDING },
    { title: 'Em Andamento', status: ActionStatus.IN_PROGRESS },
    { title: 'Concluído', status: ActionStatus.COMPLETED },
  ];

  const isOverdue = (date: string, status: ActionStatus) => {
    return new Date(date) < new Date() && status !== ActionStatus.COMPLETED;
  };

  const handleCreateAction = () => {
    const selectedRisk = riskOptions.find(risk => risk.id === newRiskId) || riskOptions[0];
    const title = newTitle.trim() || 'Nova ação corretiva';

    addAction({
      id: `a-${Date.now()}`,
      title,
      responsible: 'Equipe SST',
      dueDate: newDueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: ActionStatus.PENDING,
      desc: newDesc.trim() || 'Ação criada manualmente no plano.',
      riskId: selectedRisk.id,
      riskName: selectedRisk.name,
      riskCategory: selectedRisk.category,
      riskLevel: selectedRisk.level,
      actionType: newActionType,
      expectedImpact: newImpact.trim() || 'Redução de severidade',
      evidenceCount: 0
    });

    setNewTitle('');
    setNewRiskId('r2');
    setNewActionType(ActionType.TRAINING);
    setNewDueDate('');
    setNewImpact('');
    setNewDesc('');
    setShowNewAction(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plano de Ação NR-01</h2>
          <p className="text-slate-500 text-sm mt-1">Contramedidas vinculadas aos riscos e rastreabilidade documental</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'kanban' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kanban
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-300 transition-all">
            <div className={`w-11 h-11 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'kanban' ? (
      <div className="flex gap-5 overflow-x-auto pb-8 custom-scrollbar min-h-[700px]">
        {columns.map(col => (
          <div key={col.status} className="flex-1 min-w-[340px] flex flex-col gap-4">
            <div className="flex items-center justify-between px-3">
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[col.status]?.split(' ')[0]}`}></span>
                {col.title}
              </h3>
              <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {actions.filter(a => col.status === ActionStatus.PENDING ? (a.status === ActionStatus.PENDING || a.status === ActionStatus.OVERDUE) : a.status === col.status).length}
              </span>
            </div>

            <div className="flex-1 space-y-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-200">
              {actions.filter(a => col.status === ActionStatus.PENDING ? (a.status === ActionStatus.PENDING || a.status === ActionStatus.OVERDUE) : a.status === col.status).map(action => {
                const overdue = isOverdue(action.dueDate, action.status);
                const canComplete = action.evidenceCount > 0;
                
                return (
                  <div 
                    key={action.id} 
                    className={`bg-white p-5 rounded-xl border shadow-sm hover:shadow-lg transition-all group relative border-l-4 ${
                      overdue ? 'border-l-rose-500 border-rose-200 bg-rose-50/30' : 'border-l-indigo-500 border-slate-200'
                    }`}
                  >
                    {/* Expiration Alert */}
                    {overdue && (
                      <div className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg ring-2 ring-white">
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
                      <div className={`w-1.5 h-10 rounded-full shrink-0 ${action.riskLevel === 'Crítico' || action.riskLevel === 'Crítico' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                          <LinkIcon size={12} /> Risco Vinculado
                        </p>
                        <p className="text-xs font-black text-slate-700 truncate">{action.riskName}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">{action.riskCategory} • {action.riskLevel}</p>
                      </div>
                      <ShieldAlert size={16} className={action.riskLevel === 'Crítico' || action.riskLevel === 'Crítico' ? 'text-rose-400' : 'text-amber-400'} />
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
                        <button onClick={() => completeAction(action.id)} 
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
                          <button onClick={() => addEvidence(action.id)} className="w-12 h-12 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">
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
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lista consolidada</p>
              <h3 className="text-lg font-black text-slate-800">Acoes do plano</h3>
            </div>
            <button
              onClick={() => setShowNewAction(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              + Nova ação
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-3">Ação</th>
                  <th className="px-6 py-3">Risco</th>
                  <th className="px-6 py-3">Responsável</th>
                  <th className="px-6 py-3">Prazo</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Evidências</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {actions.map(action => {
                  const overdue = isOverdue(action.dueDate, action.status);

                  return (
                    <tr key={action.id} className="text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-800">{action.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{action.desc}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-black text-slate-700">{action.riskName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">{action.riskCategory}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-black">{action.responsible}</td>
                      <td className="px-6 py-4 text-xs font-black">
                        <span className={overdue ? 'text-rose-600' : 'text-slate-600'}>
                          {new Date(action.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border shadow-sm ${STATUS_COLORS[action.status]}`}>
                          {overdue ? 'Atrasada' : action.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-slate-600">
                        <span className={action.evidenceCount > 0 ? 'text-indigo-600' : 'text-slate-400'}>
                          {action.evidenceCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <button onClick={handleCreateAction} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Título da Ação</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" placeholder="SubstituiÃ§Ã£o de filtros de exaustÃ£o" />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Vincular Risco (Obrigatório)</label>
                  <select value={newRiskId} onChange={(e) => setNewRiskId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all border-l-4 border-l-rose-500">
  {riskOptions.map(risk => (
    <option key={risk.id} value={risk.id}>
      {risk.name} ({risk.level})
    </option>
  ))}
</select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Tipo de Ação</label>
                  <select value={newActionType} onChange={(e) => setNewActionType(e.target.value as ActionType)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none">
                    {Object.values(ActionType).map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Prazo de Conclusão</label>
                  <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Impacto Esperado (Severidade Final)</label>
                  <input type="text" value={newImpact} onChange={(e) => setNewImpact(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none" placeholder="ReduÃ§Ã£o para nÃ­vel Moderado" />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Descrição do Plano de Trabalho</label>
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none h-28 resize-none" placeholder="Detalhe as etapas e recursos necessÃ¡rios..." />
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
                  onClick={handleCreateAction}
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


















