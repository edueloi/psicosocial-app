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
  Columns3,
  Settings2,
} from 'lucide-react';
import { useAppData } from '../appData';

const ACTION_META_STORAGE_KEY = 'action-company-map-v1';
const ACTION_BOARD_STORAGE_KEY = 'action-board-v2';
const ACTION_COLUMNS_STORAGE_KEY = 'action-columns-v1';
const ACTION_PREFLIGHT_STORAGE_KEY = 'action-prefilter-v1';

const COMPANY_OPTIONS = [
  { id: 'c-yasaki', name: 'Yazaki', areas: ['Produção', 'Logística', 'Qualidade'] },
  { id: 'c-toyota', name: 'Toyota 452', areas: ['RH', 'Manutenção', 'Operação'] },
  { id: 'c-usina', name: 'Usina Pilon', areas: ['Operação', 'Ambulatório', 'Administração'] },
];

type ActionMeta = { companyId: string; area: string };
type ActionBoard = { columnId: string; order: number };
type BoardColumn = { id: string; title: string; system?: boolean };

const defaultColumns: BoardColumn[] = [
  { id: ActionStatus.PENDING, title: 'Pendente / Vencida', system: true },
  { id: ActionStatus.IN_PROGRESS, title: 'Em Andamento', system: true },
  { id: ActionStatus.COMPLETED, title: 'Concluído', system: true },
];

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
  const [activeColumnMenu, setActiveColumnMenu] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const { actions, addAction, addEvidence, completeAction } = useAppData();

  const [columns, setColumns] = useState<BoardColumn[]>(() => {
    if (typeof window === 'undefined') return defaultColumns;
    try {
      const raw = localStorage.getItem(ACTION_COLUMNS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : defaultColumns;
    } catch {
      return defaultColumns;
    }
  });

  const [showSelector, setShowSelector] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(ACTION_PREFLIGHT_STORAGE_KEY) !== 'done';
  });

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
    localStorage.setItem(ACTION_COLUMNS_STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

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
          next[action.id] = { columnId: normalized, order: index * 10 };
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

  const getActionColumnId = (action: { id: string; status: ActionStatus }) => boardMap[action.id]?.columnId || normalizeStatus(action.status);
  const getActionOrder = (actionId: string) => boardMap[actionId]?.order ?? 0;
  const isCompletedColumn = (columnId: string) => columnId === ActionStatus.COMPLETED;
  const getColumnTitle = (columnId: string) => columns.find((col) => col.id === columnId)?.title || columnId;
  const getBadgeColor = (columnId: string) => STATUS_COLORS[columnId as ActionStatus] || 'border-slate-200 bg-slate-50 text-slate-600';

  const isOverdue = (date: string, columnId: string) => new Date(date) < new Date() && !isCompletedColumn(columnId);

  const filteredActions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return actions.filter((action) => {
      const meta = actionMetaMap[action.id] || companyFromRisk(action.riskId);
      const companyName = COMPANY_OPTIONS.find((company) => company.id === meta.companyId)?.name || 'Sem empresa';
      const columnId = getActionColumnId(action);

      const matchesSearch = !term
        || action.title.toLowerCase().includes(term)
        || action.desc.toLowerCase().includes(term)
        || action.riskName.toLowerCase().includes(term)
        || companyName.toLowerCase().includes(term)
        || meta.area.toLowerCase().includes(term);
      const matchesCompany = companyFilter === 'all' || meta.companyId === companyFilter;
      const matchesStatus = statusFilter === 'all' || columnId === statusFilter;

      return matchesSearch && matchesCompany && matchesStatus;
    });
  }, [actions, actionMetaMap, searchTerm, companyFilter, statusFilter, boardMap]);

  const sortedFilteredActions = useMemo(() => [...filteredActions].sort((a, b) => getActionOrder(a.id) - getActionOrder(b.id)), [filteredActions, boardMap]);

  const stats = [
    { label: 'Total de Ações', value: filteredActions.length, color: 'text-slate-600', icon: <LayoutGrid size={18} /> },
    { label: 'Ações Vencidas', value: filteredActions.filter((a) => isOverdue(a.dueDate, getActionColumnId(a))).length, color: 'text-rose-600', icon: <Clock size={18} /> },
    { label: 'Sem Evidência', value: filteredActions.filter((a) => a.evidenceCount === 0 && !isCompletedColumn(getActionColumnId(a))).length, color: 'text-amber-600', icon: <Paperclip size={18} /> },
    { label: 'Riscos Críticos', value: filteredActions.filter((a) => a.riskLevel === 'Crítico').length, color: 'text-indigo-600', icon: <ShieldAlert size={18} /> },
  ];

  const getColumnActions = (columnId: string) => sortedFilteredActions.filter((action) => getActionColumnId(action) === columnId);

  const moveAction = (actionId: string, targetColumnId: string, targetIndex?: number) => {
    const draggedAction = actions.find((action) => action.id === actionId);
    if (!draggedAction) return;

    const targetList = getColumnActions(targetColumnId).filter((action) => action.id !== actionId);
    const insertIndex = typeof targetIndex === 'number' ? targetIndex : targetList.length;
    targetList.splice(insertIndex, 0, draggedAction);

    setBoardMap((prev) => {
      const next = { ...prev };
      targetList.forEach((action, idx) => {
        next[action.id] = { columnId: targetColumnId, order: idx * 10 };
      });
      return next;
    });
  };

  const handleDragStart = (actionId: string, event: React.DragEvent<HTMLElement>) => {
    setDraggedId(actionId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', actionId);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverColumn(null);
    setDragOverCardId(null);
  };

  const addColumn = () => {
    const name = window.prompt('Nome da nova coluna:');
    if (!name?.trim()) return;
    const id = `col-${Date.now()}`;
    setColumns((prev) => [...prev, { id, title: name.trim() }]);
  };

  const renameColumn = (columnId: string) => {
    const current = columns.find((col) => col.id === columnId);
    if (!current) return;
    const name = window.prompt('Novo nome da coluna:', current.title);
    if (!name?.trim()) return;
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, title: name.trim() } : col)));
  };

  const removeColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || column.system) return;
    setBoardMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        if (next[id].columnId === columnId) next[id] = { columnId: ActionStatus.PENDING, order: next[id].order };
      });
      return next;
    });
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
    setActiveColumnMenu(null);
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
    setBoardMap((prev) => ({ ...prev, [id]: { columnId: ActionStatus.PENDING, order: Date.now() } }));
    setShowNewAction(false);
  };

  if (showSelector) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Pré-visualização</p>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Escolha o que quer ver no Plano de Ação</h2>
          <p className="text-sm text-slate-500">Antes de abrir o quadro, selecione empresa e modo de visualização.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold bg-slate-50">
            <option value="all">Todas as empresas</option>
            {COMPANY_OPTIONS.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </select>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setActiveTab('kanban')} className={`flex-1 px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === 'kanban' ? 'bg-white text-indigo-600' : 'text-slate-600'}`}>Kanban</button>
            <button onClick={() => setActiveTab('list')} className={`flex-1 px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === 'list' ? 'bg-white text-indigo-600' : 'text-slate-600'}`}>Lista</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => { setShowSelector(false); localStorage.setItem(ACTION_PREFLIGHT_STORAGE_KEY, 'done'); }} className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-black uppercase">Abrir Plano de Ação</button>
          <button onClick={() => { setCompanyFilter('all'); setActiveTab('kanban'); }} className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-black uppercase">Resetar filtros</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plano de Ação NR-01</h2>
          <p className="text-slate-500 text-sm mt-1">Kanban com colunas personalizáveis, ações no menu e rastreabilidade</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSelector(true)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 uppercase inline-flex items-center gap-2"><Settings2 size={14} /> Selecionar visão</button>
          <button onClick={addColumn} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase inline-flex items-center gap-2"><Columns3 size={14} /> Nova coluna</button>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setActiveTab('kanban')} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'kanban' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}>Kanban</button>
            <button onClick={() => setActiveTab('list')} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}>Lista</button>
          </div>
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
          <option value={ActionStatus.PENDING}>Pendente</option>
          <option value={ActionStatus.IN_PROGRESS}>Em andamento</option>
          <option value={ActionStatus.COMPLETED}>Concluído</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"><div className={`w-11 h-11 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center shrink-0`}>{stat.icon}</div><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{stat.label}</p><p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p></div></div>)}
      </div>

      {activeTab === 'kanban' ? (
        <div className="flex gap-5 overflow-x-auto pb-8 custom-scrollbar min-h-[680px] items-start">
          {columns.map((col) => {
            const columnActions = getColumnActions(col.id);
            return (
              <div key={col.id} className="flex-1 min-w-[340px] flex flex-col gap-4">
                <div className="flex items-center justify-between px-2 relative">
                  <h3 className="font-bold text-slate-700 text-sm">{col.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">{columnActions.length}</span>
                    <button onClick={() => setActiveColumnMenu(activeColumnMenu === col.id ? null : col.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><MoreVertical size={16} /></button>
                  </div>
                  {activeColumnMenu === col.id && (
                    <div className="absolute right-0 top-9 z-20 bg-white border border-slate-200 rounded-xl shadow-lg w-48 p-1.5">
                      <button onClick={() => { renameColumn(col.id); setActiveColumnMenu(null); }} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50">Renomear coluna</button>
                      {!col.system && <button onClick={() => removeColumn(col.id)} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-rose-50 text-rose-600">Excluir coluna</button>}
                    </div>
                  )}
                </div>

                <div className={`flex-1 space-y-4 p-3 rounded-2xl border transition-all ${dragOverColumn === col.id ? 'bg-indigo-50 border-indigo-300 shadow-inner' : 'bg-slate-50/50 border-slate-200'}`} onDragOver={(e) => e.preventDefault()} onDragEnter={() => setDragOverColumn(col.id)} onDrop={(e) => { e.preventDefault(); if (draggedId) moveAction(draggedId, col.id); handleDragEnd(); }}>
                  {columnActions.map((action, index) => {
                    const columnId = getActionColumnId(action);
                    const overdue = isOverdue(action.dueDate, columnId);
                    const canComplete = action.evidenceCount > 0;
                    const meta = actionMetaMap[action.id] || companyFromRisk(action.riskId);
                    const companyName = COMPANY_OPTIONS.find((company) => company.id === meta.companyId)?.name || 'Sem empresa';
                    return (
                      <div key={action.id} onDragOver={(e) => e.preventDefault()} onDragEnter={() => { if (draggedId && draggedId !== action.id) setDragOverCardId(action.id); }} onDrop={(e) => { e.preventDefault(); if (draggedId && draggedId !== action.id) moveAction(draggedId, col.id, index); handleDragEnd(); }} className={`bg-white p-5 rounded-xl border shadow-sm transition-all border-l-4 ${dragOverCardId === action.id ? 'ring-2 ring-indigo-300' : ''} ${overdue ? 'border-l-rose-500 border-rose-200' : 'border-l-indigo-500 border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-4 relative">
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${getBadgeColor(columnId)}`}>{overdue ? 'Atrasada' : getColumnTitle(columnId)}</span>
                            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border border-slate-200 bg-slate-50 text-slate-600">{action.actionType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button draggable onDragStart={(e) => handleDragStart(action.id, e)} onDragEnd={handleDragEnd} title="Arraste para mover" className="text-slate-300 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 cursor-grab"><GripVertical size={14} /></button>
                            <button onClick={() => setActiveMenu(activeMenu === action.id ? null : action.id)} className="text-slate-300 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50"><MoreVertical size={18} /></button>
                          </div>
                          {activeMenu === action.id && (
                            <div className="absolute right-0 top-10 z-20 bg-white border border-slate-200 rounded-xl shadow-lg w-52 p-1.5">
                              <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Ações</p>
                              {columns.map((target) => <button key={target.id} onClick={() => { moveAction(action.id, target.id); setActiveMenu(null); }} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50">Mover para: {target.title}</button>)}
                              <button onClick={() => { addEvidence(action.id); setActiveMenu(null); }} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50">Adicionar evidência</button>
                            </div>
                          )}
                        </div>
                        <h4 className="font-black text-slate-800 text-base mb-2 leading-tight">{action.title}</h4>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">{action.desc}</p>
                        <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><LinkIcon size={12} /> Risco Vinculado</p><p className="text-xs font-black text-slate-700 truncate">{action.riskName}</p><p className="text-[9px] font-bold text-slate-500 uppercase">{action.riskCategory} • {action.riskLevel}</p></div>
                        <div className="mb-4 grid grid-cols-2 gap-2 text-[11px]"><p className="font-bold text-slate-500"><Building2 size={12} className="inline mr-1" />{companyName}</p><p className="font-bold text-slate-500"><LayoutGrid size={12} className="inline mr-1" />{meta.area}</p></div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-3"><span>Prazo: {new Date(action.dueDate).toLocaleDateString('pt-BR')}</span><span>Evidências: {action.evidenceCount}</span></div>
                        {!isCompletedColumn(columnId) && <button onClick={() => { completeAction(action.id); moveAction(action.id, ActionStatus.COMPLETED); }} className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase ${canComplete ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`} disabled={!canComplete}><CheckCircle2 size={14} /> Concluir</button>}
                      </div>
                    );
                  })}
                  <button onClick={() => setShowNewAction(true)} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-500 hover:bg-white transition-all">+ Adicionar Ação</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="overflow-x-auto"><table className="min-w-full text-left"><thead className="bg-slate-50"><tr className="text-[10px] font-black uppercase tracking-widest text-slate-400"><th className="px-6 py-3">Ação</th><th className="px-6 py-3">Empresa/Área</th><th className="px-6 py-3">Risco</th><th className="px-6 py-3">Responsável</th><th className="px-6 py-3">Prazo</th><th className="px-6 py-3">Coluna</th><th className="px-6 py-3">Evidências</th></tr></thead><tbody className="divide-y divide-slate-100">{sortedFilteredActions.map((action) => { const columnId = getActionColumnId(action); const overdue = isOverdue(action.dueDate, columnId); const meta = actionMetaMap[action.id] || companyFromRisk(action.riskId); const companyName = COMPANY_OPTIONS.find((company) => company.id === meta.companyId)?.name || 'Sem empresa'; return (<tr key={action.id} className="text-sm text-slate-700 hover:bg-slate-50 transition-colors"><td className="px-6 py-4"><p className="font-black text-slate-800">{action.title}</p><p className="text-xs text-slate-500 line-clamp-1">{action.desc}</p></td><td className="px-6 py-4 text-xs font-black text-indigo-700">{companyName} • {meta.area}</td><td className="px-6 py-4"><p className="text-xs font-black text-slate-700">{action.riskName}</p><p className="text-[10px] font-black text-slate-400 uppercase">{action.riskCategory}</p></td><td className="px-6 py-4 text-xs font-black">{action.responsible}</td><td className="px-6 py-4 text-xs font-black"><span className={overdue ? 'text-rose-600' : 'text-slate-600'}>{new Date(action.dueDate).toLocaleDateString('pt-BR')}</span></td><td className="px-6 py-4"><span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${getBadgeColor(columnId)}`}>{overdue ? 'Atrasada' : getColumnTitle(columnId)}</span></td><td className="px-6 py-4 text-xs font-black text-slate-600">{action.evidenceCount}</td></tr>); })}</tbody></table></div>
        </div>
      )}

      {showNewAction && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[92vh] flex flex-col">
            <div className="px-4 py-4 sm:px-6 sm:py-5 bg-indigo-600 text-white flex items-start justify-between gap-3"><div><h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Nova Ação Corretiva</h3><p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-80">Kanban por empresa e área</p></div><button onClick={() => setShowNewAction(false)} className="p-2 rounded-xl bg-white/10"><X size={20} /></button></div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder="Título da ação" />
                <input value={newResponsible} onChange={(e) => setNewResponsible(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder="Responsável" />
                <select value={newCompanyId} onChange={(e) => setNewCompanyId(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">{COMPANY_OPTIONS.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select>
                <select value={newArea} onChange={(e) => setNewArea(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">{(COMPANY_OPTIONS.find((company) => company.id === newCompanyId)?.areas || []).map((area) => <option key={area}>{area}</option>)}</select>
                <select value={newRiskId} onChange={(e) => setNewRiskId(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2">{riskOptions.map((risk) => <option key={risk.id} value={risk.id}>{risk.name} ({risk.level})</option>)}</select>
                <select value={newActionType} onChange={(e) => setNewActionType(e.target.value as ActionType)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">{Object.values(ActionType).map((value) => <option key={value}>{value}</option>)}</select>
                <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" />
                <input value={newImpact} onChange={(e) => setNewImpact(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2" placeholder="Impacto esperado" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2 h-24 sm:h-28 resize-none" placeholder="Descrição do plano de trabalho" />
              </div>
              <div className="p-3 sm:p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3"><Info size={18} className="text-amber-600 shrink-0" /><p className="text-[11px] text-amber-900 font-bold leading-relaxed uppercase">Concluir ação exige ao menos 1 evidência documental vinculada.</p></div>
              <div className="flex flex-col sm:flex-row gap-3 pb-1"><button onClick={() => setShowNewAction(false)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-black uppercase">Cancelar</button><button onClick={handleCreateAction} className="flex-1 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase">Criar Plano de Ação</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPlan;
