import React, { useEffect, useMemo, useState } from 'react';
import { ActionStatus, ActionType, RiskType } from '../types';
import { STATUS_COLORS } from '../constants';
import {
  Plus,
  MoreVertical,
  ShieldAlert,
  Clock,
  Link as LinkIcon,
  Paperclip,
  Info,
  CheckCircle2,
  X,
  Building2,
  Search,
  LayoutGrid,
  GripVertical,
} from 'lucide-react';
import { useAppData } from '../appData';

const ACTION_META_STORAGE_KEY = 'action-company-map-v1';
const ACTION_BOARD_STORAGE_KEY = 'action-board-v1';

const COMPANY_OPTIONS = [
  { id: 'c-yasaki', name: 'Yazaki', areas: ['Produção', 'Logística', 'Qualidade'] },
  { id: 'c-toyota', name: 'Toyota 452', areas: ['RH', 'Manutenção', 'Operação'] },
  { id: 'c-usina', name: 'Usina Pilon', areas: ['Operação', 'Ambulatório', 'Administração'] },
];

type ActionMeta = { companyId: string; area: string };
type ActionBoard = { status: ActionStatus; order: number };

const riskOptions = [
  { id: 'r2', name: 'Carga Mental Elevada', category: RiskType.PSYCHOSOCIAL, level: 'Crítico' },
  { id: 'r4', name: 'Inalação de Solventes', category: RiskType.CHEMICAL, level: 'Crítico' },
  { id: 'r3', name: 'Postura Inadequada', category: RiskType.ERGONOMIC, level: 'Moderado' },
];

const companyFromRisk = (riskId: string): ActionMeta => {
  if (riskId === 'r4') return { companyId: 'c-yasaki', area: 'Produção' };
  if (riskId === 'r3') return { companyId: 'c-toyota', area: 'Manutenção' };
  return { companyId: 'c-usina', area: 'Operação' };
};

const normalizeStatus = (status: ActionStatus): ActionStatus => {
  if (status === ActionStatus.OVERDUE) return ActionStatus.PENDING;
  return status;
};

const ActionPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'list'>('kanban');
  const [showNewAction, setShowNewAction] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { actions, addAction, addEvidence, completeAction } = useAppData();

  const [actionMetaMap, setActionMetaMap] = useState<Record<string, ActionMeta>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(ACTION_META_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [boardMap, setBoardMap] = useState<Record<string, ActionBoard>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(ACTION_BOARD_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ActionStatus>('all');

  const [newTitle, setNewTitle] = useState('');
  const [newRiskId, setNewRiskId] = useState('r2');
  const [newActionType, setNewActionType] = useState<ActionType>(ActionType.TRAINING);
  const [newDueDate, setNewDueDate] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newResponsible, setNewResponsible] = useState('Equipe SST');
  const [newCompanyId, setNewCompanyId] = useState(COMPANY_OPTIONS[0].id);
  const [newArea, setNewArea] = useState(COMPANY_OPTIONS[0].areas[0]);

  useEffect(() => {
    localStorage.setItem(ACTION_META_STORAGE_KEY, JSON.stringify(actionMetaMap));
  }, [actionMetaMap]);

  useEffect(() => {
    localStorage.setItem(ACTION_BOARD_STORAGE_KEY, JSON.stringify(boardMap));
  }, [boardMap]);

  useEffect(() => {
    setActionMetaMap((prev) => {
      const next = { ...prev };
      let changed = false;
      actions.forEach((action) => {
        if (!next[action.id]) {
          next[action.id] = companyFromRisk(action.riskId);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [actions]);

  useEffect(() => {
    setBoardMap((prev) => {
      const next = { ...prev };
      let changed = false;
      actions.forEach((action, index) => {
        const normalized = normalizeStatus(action.status);
        if (!next[action.id]) {
          next[action.id] = { status: normalized, order: index * 10 };
          changed = true;
        } else if (action.status === ActionStatus.COMPLETED && next[action.id].status !== ActionStatus.COMPLETED) {
          next[action.id] = { status: ActionStatus.COMPLETED, order: next[action.id].order };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [actions]);

  useEffect(() => {
    const company = COMPANY_OPTIONS.find((item) => item.id === newCompanyId) || COMPANY_OPTIONS[0];
    if (!company.areas.includes(newArea)) {
      setNewArea(company.areas[0]);
    }
  }, [newCompanyId, newArea]);

  const getActionStatus = (action: { id: string; status: ActionStatus }) => {
    return boardMap[action.id]?.status || normalizeStatus(action.status);
  };

  const getActionOrder = (actionId: string) => boardMap[actionId]?.order ?? 0;

  const isOverdue = (date: string, status: ActionStatus) => new Date(date) < new Date() && status !== ActionStatus.COMPLETED;

  const filteredActions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return actions.filter((action) => {
      const meta = actionMetaMap[action.id] || companyFromRisk(action.riskId);
      const companyName = COMPANY_OPTIONS.find((company) => company.id === meta.companyId)?.name || 'Sem empresa';
      const status = getActionStatus(action);

      const matchesSearch = !term
        || action.title.toLowerCase().includes(term)
        || action.desc.toLowerCase().includes(term)
        || action.riskName.toLowerCase().includes(term)
        || companyName.toLowerCase().includes(term)
        || meta.area.toLowerCase().includes(term);
      const matchesCompany = companyFilter === 'all' || meta.companyId === companyFilter;
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesCompany && matchesStatus;
    });
  }, [actions, actionMetaMap, searchTerm, companyFilter, statusFilter, boardMap]);

  const sortedFilteredActions = useMemo(() => {
    return [...filteredActions].sort((a, b) => getActionOrder(a.id) - getActionOrder(b.id));
  }, [filteredActions, boardMap]);

  const stats = [
    { label: 'Total de Ações', value: filteredActions.length, color: 'text-slate-600', icon: <LayoutGrid size={18} /> },
    { label: 'Ações Vencidas', value: filteredActions.filter((a) => isOverdue(a.dueDate, getActionStatus(a))).length, color: 'text-rose-600', icon: <Clock size={18} /> },
    { label: 'Sem Evidência', value: filteredActions.filter((a) => a.evidenceCount === 0 && getActionStatus(a) !== ActionStatus.COMPLETED).length, color: 'text-amber-600', icon: <Paperclip size={18} /> },
    { label: 'Riscos Críticos', value: filteredActions.filter((a) => a.riskLevel === 'Crítico').length, color: 'text-indigo-600', icon: <ShieldAlert size={18} /> },
  ];

  const companyCards = useMemo(() => {
    return COMPANY_OPTIONS.map((company) => {
      const companyActions = sortedFilteredActions.filter((action) => (actionMetaMap[action.id] || companyFromRisk(action.riskId)).companyId === company.id);
      return {
        ...company,
        total: companyActions.length,
        overdue: companyActions.filter((action) => isOverdue(action.dueDate, getActionStatus(action))).length,
        inProgress: companyActions.filter((action) => getActionStatus(action) === ActionStatus.IN_PROGRESS).length,
      };
    });
  }, [sortedFilteredActions, actionMetaMap, boardMap]);

  const columns = [
    { title: 'Pendente / Vencida', status: ActionStatus.PENDING },
    { title: 'Em Andamento', status: ActionStatus.IN_PROGRESS },
    { title: 'Concluído', status: ActionStatus.COMPLETED },
  ];

  const getColumnActions = (status: ActionStatus) => {
    return sortedFilteredActions.filter((action) => getActionStatus(action) === status);
  };

  const moveAction = (actionId: string, targetStatus: ActionStatus, targetIndex?: number) => {
    const targetList = getColumnActions(targetStatus).filter((action) => action.id !== actionId);
    const insertIndex = typeof targetIndex === 'number' ? targetIndex : targetList.length;

    targetList.splice(insertIndex, 0, actions.find((action) => action.id === actionId)!);

    setBoardMap((prev) => {
      const next = { ...prev };
      targetList.forEach((action, idx) => {
        next[action.id] = { status: targetStatus, order: idx * 10 };
      });
      return next;
    });
  };

  const handleCreateAction = () => {
    const selectedRisk = riskOptions.find((risk) => risk.id === newRiskId) || riskOptions[0];
    const id = `a-${Date.now()}`;

    addAction({
      id,
      title: newTitle.trim() || 'Nova ação corretiva',
      responsible: newResponsible.trim() || 'Equipe SST',
      dueDate: newDueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: ActionStatus.PENDING,
      desc: newDesc.trim() || 'Ação criada manualmente no plano.',
      riskId: selectedRisk.id,
      riskName: selectedRisk.name,
      riskCategory: selectedRisk.category,
      riskLevel: selectedRisk.level,
      actionType: newActionType,
      expectedImpact: newImpact.trim() || 'Redução de severidade',
      evidenceCount: 0,
    });

    setActionMetaMap((prev) => ({ ...prev, [id]: { companyId: newCompanyId, area: newArea } }));
    setBoardMap((prev) => ({ ...prev, [id]: { status: ActionStatus.PENDING, order: Date.now() } }));

    setNewTitle('');
    setNewRiskId('r2');
    setNewActionType(ActionType.TRAINING);
    setNewDueDate('');
    setNewImpact('');
    setNewDesc('');
    setNewResponsible('Equipe SST');
    setShowNewAction(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plano de Ação NR-01</h2>
          <p className="text-slate-500 text-sm mt-1">Kanban completo com arrasta-e-solta, empresa/área e rastreabilidade</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button onClick={() => setActiveTab('kanban')} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'kanban' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}>Kanban</button>
          <button onClick={() => setActiveTab('list')} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}>Lista</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-[1fr_220px_220px] gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por ação, risco, empresa ou área" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
        </div>
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
          <option value="all">Empresa: todas</option>
          {COMPANY_OPTIONS.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | ActionStatus)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
          <option value="all">Status: todos</option>
          <option value={ActionStatus.PENDING}>{ActionStatus.PENDING}</option>
          <option value={ActionStatus.IN_PROGRESS}>{ActionStatus.IN_PROGRESS}</option>
          <option value={ActionStatus.COMPLETED}>{ActionStatus.COMPLETED}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center shrink-0`}>{stat.icon}</div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {companyCards.map((company) => (
          <button key={company.id} onClick={() => setCompanyFilter(company.id)} className={`text-left bg-white border rounded-2xl p-4 shadow-sm transition ${companyFilter === company.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}>
            <p className="text-sm font-black text-slate-800 flex items-center gap-2"><Building2 size={14} /> {company.name}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div><p className="text-slate-400">Total</p><p className="font-black text-slate-700">{company.total}</p></div>
              <div><p className="text-slate-400">Vencidas</p><p className="font-black text-rose-600">{company.overdue}</p></div>
              <div><p className="text-slate-400">Andamento</p><p className="font-black text-indigo-600">{company.inProgress}</p></div>
            </div>
          </button>
        ))}
      </div>

      {activeTab === 'kanban' ? (
        <div className="flex gap-5 overflow-x-auto pb-8 custom-scrollbar min-h-[680px]">
          {columns.map((col) => {
            const columnActions = getColumnActions(col.status);
            return (
              <div key={col.status} className="flex-1 min-w-[360px] flex flex-col gap-4">
                <div className="flex items-center justify-between px-3">
                  <h3 className="font-bold text-slate-700 text-sm">{col.title}</h3>
                  <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">{columnActions.length}</span>
                </div>

                <div
                  className="flex-1 space-y-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-200"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedId) moveAction(draggedId, col.status);
                    setDraggedId(null);
                  }}
                >
                  {columnActions.map((action, index) => {
                    const overdue = isOverdue(action.dueDate, getActionStatus(action));
                    const canComplete = action.evidenceCount > 0;
                    const meta = actionMetaMap[action.id] || companyFromRisk(action.riskId);
                    const companyName = COMPANY_OPTIONS.find((company) => company.id === meta.companyId)?.name || 'Sem empresa';

                    return (
                      <div
                        key={action.id}
                        draggable
                        onDragStart={() => setDraggedId(action.id)}
                        onDragEnd={() => setDraggedId(null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedId) moveAction(draggedId, col.status, index);
                          setDraggedId(null);
                        }}
                        className={`bg-white p-5 rounded-xl border shadow-sm transition-all border-l-4 cursor-grab active:cursor-grabbing ${overdue ? 'border-l-rose-500 border-rose-200' : 'border-l-indigo-500 border-slate-200'}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${STATUS_COLORS[getActionStatus(action)]}`}>{overdue ? 'Atrasada' : getActionStatus(action)}</span>
                            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border border-slate-200 bg-slate-50 text-slate-600">{action.actionType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GripVertical size={14} className="text-slate-300" />
                            <button onClick={() => setActiveMenu(activeMenu === action.id ? null : action.id)} className="text-slate-300 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50"><MoreVertical size={18} /></button>
                          </div>
                        </div>

                        <h4 className="font-black text-slate-800 text-base mb-2 leading-tight">{action.title}</h4>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">{action.desc}</p>

                        <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><LinkIcon size={12} /> Risco Vinculado</p>
                          <p className="text-xs font-black text-slate-700 truncate">{action.riskName}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">{action.riskCategory} • {action.riskLevel}</p>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-2 text-[11px]">
                          <p className="font-bold text-slate-500"><Building2 size={12} className="inline mr-1" />{companyName}</p>
                          <p className="font-bold text-slate-500"><LayoutGrid size={12} className="inline mr-1" />{meta.area}</p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-3">
                          <span>Prazo: {new Date(action.dueDate).toLocaleDateString('pt-BR')}</span>
                          <span>Evidências: {action.evidenceCount}</span>
                        </div>

                        {getActionStatus(action) !== ActionStatus.COMPLETED && (
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => {
                                completeAction(action.id);
                                moveAction(action.id, ActionStatus.COMPLETED);
                              }}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${canComplete ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                              disabled={!canComplete}
                              title={!canComplete ? 'Exige ao menos 1 evidência documental para concluir' : 'Confirmar mitigação de risco'}
                            >
                              <CheckCircle2 size={14} /> Concluir
                            </button>
                            {!canComplete && (
                              <button onClick={() => addEvidence(action.id)} className="w-12 h-12 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-100">
                                <Plus size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button onClick={() => setShowNewAction(true)} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-500 hover:bg-white transition-all">
                    + Adicionar Ação
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lista consolidada</p>
              <h3 className="text-lg font-black text-slate-800">Ações do plano por empresa</h3>
            </div>
            <button onClick={() => setShowNewAction(true)} className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">+ Nova ação</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-3">Ação</th>
                  <th className="px-6 py-3">Empresa/Área</th>
                  <th className="px-6 py-3">Risco</th>
                  <th className="px-6 py-3">Responsável</th>
                  <th className="px-6 py-3">Prazo</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Evidências</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedFilteredActions.map((action) => {
                  const status = getActionStatus(action);
                  const overdue = isOverdue(action.dueDate, status);
                  const meta = actionMetaMap[action.id] || companyFromRisk(action.riskId);
                  const companyName = COMPANY_OPTIONS.find((company) => company.id === meta.companyId)?.name || 'Sem empresa';

                  return (
                    <tr key={action.id} className="text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-800">{action.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{action.desc}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-indigo-700">{companyName} • {meta.area}</td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-black text-slate-700">{action.riskName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">{action.riskCategory}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-black">{action.responsible}</td>
                      <td className="px-6 py-4 text-xs font-black"><span className={overdue ? 'text-rose-600' : 'text-slate-600'}>{new Date(action.dueDate).toLocaleDateString('pt-BR')}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${STATUS_COLORS[status]}`}>{overdue ? 'Atrasada' : status}</span></td>
                      <td className="px-6 py-4 text-xs font-black text-slate-600">{action.evidenceCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNewAction && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Nova Ação Corretiva</h3>
                <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-80">Kanban por empresa e área</p>
              </div>
              <button onClick={() => setShowNewAction(false)} className="p-2 rounded-xl bg-white/10"><X size={22} /></button>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder="Título da ação" />
                <input value={newResponsible} onChange={(e) => setNewResponsible(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder="Responsável" />

                <select value={newCompanyId} onChange={(e) => setNewCompanyId(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                  {COMPANY_OPTIONS.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </select>
                <select value={newArea} onChange={(e) => setNewArea(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                  {(COMPANY_OPTIONS.find((company) => company.id === newCompanyId)?.areas || []).map((area) => <option key={area}>{area}</option>)}
                </select>

                <select value={newRiskId} onChange={(e) => setNewRiskId(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2">
                  {riskOptions.map((risk) => <option key={risk.id} value={risk.id}>{risk.name} ({risk.level})</option>)}
                </select>

                <select value={newActionType} onChange={(e) => setNewActionType(e.target.value as ActionType)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                  {Object.values(ActionType).map((value) => <option key={value}>{value}</option>)}
                </select>
                <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" />
                <input value={newImpact} onChange={(e) => setNewImpact(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2" placeholder="Impacto esperado" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2 h-24 resize-none" placeholder="Descrição do plano de trabalho" />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <Info size={18} className="text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-900 font-bold leading-relaxed uppercase">Concluir ação exige ao menos 1 evidência documental vinculada.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowNewAction(false)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-black uppercase">Cancelar</button>
                <button onClick={handleCreateAction} className="flex-1 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase">Criar Plano de Ação</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPlan;
