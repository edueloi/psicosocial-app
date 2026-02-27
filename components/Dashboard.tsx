import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Eye,
  HeartPulse,
  LayoutGrid,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAppData } from '../appData';
import { ActionStatus, UserRole } from '../types';

interface DashboardProps {
  vision?: 'tech' | 'exec';
  userRole?: UserRole;
}

type DashboardMode = 'traditional' | 'operational' | 'custom';

type WidgetId = 'kpis' | 'participation' | 'riskMatrix' | 'lostDays' | 'campaigns' | 'admission' | 'actionStatus' | 'psychosocial';

type WidgetConfig = {
  id: WidgetId;
  title: string;
  allowedRoles: UserRole[];
};

const WIDGET_STORAGE_KEY = 'dashboard-custom-widgets-v1';

const participationData = [
  { month: 'Jan', adesao: 72 },
  { month: 'Fev', adesao: 78 },
  { month: 'Mar', adesao: 81 },
  { month: 'Abr', adesao: 83 },
  { month: 'Mai', adesao: 79 },
  { month: 'Jun', adesao: 86 },
  { month: 'Jul', adesao: 88 },
  { month: 'Ago', adesao: 84 },
];

const riskMatrixData = [
  { sector: 'Fundição', risco: 92 },
  { sector: 'Prensas', risco: 84 },
  { sector: 'Montagem', risco: 66 },
  { sector: 'Expedição', risco: 58 },
  { sector: 'Admin', risco: 31 },
];

const lostDaysData = [
  { month: 'Jan', cidF: 35, cidG: 38, cidI: 23 },
  { month: 'Fev', cidF: 32, cidG: 34, cidI: 21 },
  { month: 'Mar', cidF: 27, cidG: 31, cidI: 21 },
  { month: 'Abr', cidF: 25, cidG: 29, cidI: 19 },
  { month: 'Mai', cidF: 23, cidG: 27, cidI: 18 },
  { month: 'Jun', cidF: 21, cidG: 25, cidI: 18 },
];

const campaignData = [
  { item: 'Setembro Amarelo', progresso: 100 },
  { item: 'Outubro Rosa', progresso: 100 },
  { item: 'Novembro Azul', progresso: 92 },
  { item: 'Demais campanhas', progresso: 84 },
];

const admissionData = [
  { name: 'Recomendados', value: 847 },
  { name: 'Não recomendados', value: 153 },
];

const psychosocialData = [
  { month: 'Jan', risco: 41 },
  { month: 'Fev', risco: 36 },
  { month: 'Mar', risco: 33 },
  { month: 'Abr', risco: 31 },
  { month: 'Mai', risco: 28 },
  { month: 'Jun', risco: 24 },
];

const PIE_COLORS = ['#16a34a', '#ef4444'];

const roleLabel: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  TENANT_ADMIN: 'Admin Tenant',
  ADMINISTRATOR: 'Administrador',
  SST_CONSULTANT: 'Consultor SST',
  RH_MANAGER: 'Gestor RH',
  AUDITOR: 'Auditor',
  EMPLOYEE: 'Colaborador',
};

const widgetCatalog: WidgetConfig[] = [
  { id: 'kpis', title: 'KPIs Operacionais', allowedRoles: Object.values(UserRole) },
  { id: 'participation', title: 'Adesão por mês', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT, UserRole.RH_MANAGER] },
  { id: 'riskMatrix', title: 'Matriz de Risco', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT, UserRole.AUDITOR] },
  { id: 'lostDays', title: 'Dias perdidos por CID', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT, UserRole.RH_MANAGER] },
  { id: 'campaigns', title: 'Campanhas anuais', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.RH_MANAGER] },
  { id: 'admission', title: 'Admissional recomendado x não', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT] },
  { id: 'actionStatus', title: 'Status do Plano de Ação', allowedRoles: Object.values(UserRole) },
  { id: 'psychosocial', title: 'Risco psicossocial', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.RH_MANAGER, UserRole.SST_CONSULTANT] },
];

const Dashboard: React.FC<DashboardProps> = ({ vision = 'tech', userRole = UserRole.TENANT_ADMIN }) => {
  const [mode, setMode] = useState<DashboardMode>('traditional');
  const { actions } = useAppData();

  const allowedWidgets = useMemo(
    () => widgetCatalog.filter((widget) => widget.allowedRoles.includes(userRole)),
    [userRole],
  );

  const [selectedWidgets, setSelectedWidgets] = useState<WidgetId[]>(() => {
    if (typeof window === 'undefined') return ['kpis', 'actionStatus', 'participation', 'riskMatrix'];
    try {
      const raw = localStorage.getItem(WIDGET_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) && parsed.length ? parsed : ['kpis', 'actionStatus', 'participation', 'riskMatrix'];
    } catch {
      return ['kpis', 'actionStatus', 'participation', 'riskMatrix'];
    }
  });

  useEffect(() => {
    localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(selectedWidgets));
  }, [selectedWidgets]);

  useEffect(() => {
    setSelectedWidgets((prev) => prev.filter((id) => allowedWidgets.some((w) => w.id === id)));
  }, [allowedWidgets]);

  const metrics = useMemo(() => {
    const totalActions = actions.length || 1;
    const completed = actions.filter((action) => action.status === ActionStatus.COMPLETED).length;
    const inProgress = actions.filter((action) => action.status === ActionStatus.IN_PROGRESS).length;
    const pending = actions.filter((action) => action.status === ActionStatus.PENDING).length;
    const evidenceCoverage = Math.round((actions.filter((action) => action.evidenceCount > 0).length / totalActions) * 100);
    const overdue = actions.filter((action) => new Date(action.dueDate) < new Date() && action.status !== ActionStatus.COMPLETED).length;

    return {
      completionRate: Math.round((completed / totalActions) * 100),
      evidenceCoverage,
      overdue,
      totalActions: actions.length,
      inProgress,
      pending,
      completed,
    };
  }, [actions]);

  const statusData = [
    { name: 'Pendente', total: metrics.pending },
    { name: 'Andamento', total: metrics.inProgress },
    { name: 'Concluído', total: metrics.completed },
  ];

  const toggleWidget = (id: WidgetId) => {
    setSelectedWidgets((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const moveWidget = (id: WidgetId, dir: 'up' | 'down') => {
    setSelectedWidgets((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) return prev;
      const nextIndex = dir === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const renderWidget = (id: WidgetId) => {
    if (id === 'kpis') {
      const cards = [
        { label: 'Ações totais', value: metrics.totalActions, icon: <ClipboardList size={16} className="text-indigo-600" />, tone: 'bg-indigo-50 border-indigo-200' },
        { label: 'Cobertura de evidências', value: `${metrics.evidenceCoverage}%`, icon: <CheckCircle2 size={16} className="text-emerald-600" />, tone: 'bg-emerald-50 border-emerald-200' },
        { label: 'Vencidas', value: metrics.overdue, icon: <ShieldAlert size={16} className="text-rose-600" />, tone: 'bg-rose-50 border-rose-200' },
        { label: 'Taxa de conclusão', value: `${metrics.completionRate}%`, icon: <TrendingUp size={16} className="text-amber-600" />, tone: 'bg-amber-50 border-amber-200' },
      ];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((card) => (
            <article key={card.label} className={`rounded-xl border p-4 ${card.tone}`}>
              <div className="flex items-center justify-between"><p className="text-xs uppercase font-bold text-slate-500">KPI</p>{card.icon}</div>
              <p className="text-2xl font-black text-slate-900 mt-2">{card.value}</p>
              <p className="text-sm font-semibold text-slate-700">{card.label}</p>
            </article>
          ))}
        </div>
      );
    }

    if (id === 'participation') {
      return (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Adesão']} />
              <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Meta 80%', position: 'insideTopRight', fontSize: 11 }} />
              <Bar dataKey="adesao" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (id === 'riskMatrix') {
      return (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={riskMatrixData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="sector" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Risco" dataKey="risco" stroke="#f43f5e" fill="#fb7185" fillOpacity={0.35} />
              <Tooltip formatter={(value) => [`${value} pts`, 'Risco']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (id === 'lostDays') {
      return (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lostDaysData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cidF" stackId="lost" fill="#a855f7" name="CID F" />
              <Bar dataKey="cidG" stackId="lost" fill="#3b82f6" name="CID G" />
              <Bar dataKey="cidI" stackId="lost" fill="#14b8a6" name="CID I" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (id === 'campaigns') {
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="item" width={120} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Progresso']} />
              <Bar dataKey="progresso" fill="#14b8a6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (id === 'admission') {
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={admissionData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3}>
                {admissionData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (id === 'actionStatus') {
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={psychosocialData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="risco" stroke="#ef4444" strokeWidth={2.5} name="Risco psicossocial" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{vision === 'exec' ? 'Dashboard Executivo' : 'Dashboard Integrado de Performance'}</h2>
          <p className="text-slate-600 text-sm mt-1">Tradicional, operacional e personalizado com componentes liberados conforme o acesso.</p>
        </div>
        <div className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 uppercase inline-flex items-center gap-2">
          <Users size={14} /> acesso: {roleLabel[userRole]}
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
        {([
          ['traditional', 'Tradicional'],
          ['operational', 'Operacional'],
          ['custom', 'Personalizado'],
        ] as [DashboardMode, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} className={`px-4 py-2 text-xs font-semibold rounded-lg ${mode === id ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}>{label}</button>
        ))}
      </div>

      {mode !== 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <article className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold mb-3">Fluxo operacional mensal</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><ClipboardList size={16} className="mt-0.5 text-indigo-300" /> Entrada até dia 10: equipes lançam dados direto no sistema.</li>
              <li className="flex gap-2"><Activity size={16} className="mt-0.5 text-indigo-300" /> Processamento automático de gráficos e comparativos por setor.</li>
              <li className="flex gap-2"><Eye size={16} className="mt-0.5 text-indigo-300" /> Portal cliente com acesso leitura para engenharia/RH.</li>
              <li className="flex gap-2"><HeartPulse size={16} className="mt-0.5 text-indigo-300" /> Monitoramento psicossocial e preventivo contínuo.</li>
              <li className="flex gap-2"><CalendarClock size={16} className="mt-0.5 text-indigo-300" /> Agenda mensal com checkpoints e evidências.</li>
              <li className="flex gap-2"><Stethoscope size={16} className="mt-0.5 text-indigo-300" /> Embrião NR1 com acompanhamento de saúde ocupacional.</li>
            </ul>
          </article>
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3">Status do Plano de Ação</h3>
            {renderWidget('actionStatus')}
          </div>
        </div>
      )}

      {mode === 'traditional' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">Adesão por mês</h3>
            {renderWidget('participation')}
          </section>
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">Matriz de risco biomecânico</h3>
            {renderWidget('riskMatrix')}
          </section>
        </div>
      )}

      {mode === 'operational' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">Dias perdidos por CID</h3>
            {renderWidget('lostDays')}
          </section>
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">Campanhas anuais</h3>
            {renderWidget('campaigns')}
          </section>
        </div>
      )}

      {mode === 'custom' && (
        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-5">
          <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 inline-flex items-center gap-2"><LayoutGrid size={16} /> Personalizar Dashboard</h3>
            <p className="text-xs text-slate-500">Selecione componentes permitidos para seu acesso e organize a ordem de exibição.</p>

            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Componentes disponíveis</p>
              {allowedWidgets.map((widget) => (
                <label key={widget.id} className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium">
                  <span>{widget.title}</span>
                  <input type="checkbox" checked={selectedWidgets.includes(widget.id)} onChange={() => toggleWidget(widget.id)} />
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Ordem atual</p>
              {selectedWidgets.map((id, idx) => (
                <div key={id} className="border border-slate-200 rounded-xl p-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">{idx + 1}. {widgetCatalog.find((w) => w.id === id)?.title}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveWidget(id, 'up')} className="p-1 rounded-md hover:bg-slate-100"><ArrowUp size={14} /></button>
                    <button onClick={() => moveWidget(id, 'down')} className="p-1 rounded-md hover:bg-slate-100"><ArrowDown size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="space-y-4">
            {!selectedWidgets.length && <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">Nenhum componente selecionado. Marque widgets à esquerda.</div>}
            {selectedWidgets.map((id) => (
              <article key={id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3">{widgetCatalog.find((w) => w.id === id)?.title}</h4>
                {renderWidget(id)}
              </article>
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
