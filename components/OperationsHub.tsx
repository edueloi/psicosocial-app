import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileSpreadsheet,
  FileUp,
  QrCode,
  ShieldCheck,
  Users,
  AlertTriangle,
  Copy,
  Building2,
  Wrench,
  Image,
  Filter,
  CalendarRange,
  UserCheck,
} from 'lucide-react';

interface UnitCycle {
  id: string;
  unit: string;
  dueDate: string;
  status: 'Rascunho' | 'Enviado' | 'Fechado';
  launchedBy: string;
  qualityScore: number;
}

interface EvidenceItem {
  id: string;
  title: string;
  unit: string;
  date: string;
  fileName: string;
  type: 'Antes' | 'Depois' | 'Campanha';
}

interface CampaignItem {
  id: string;
  month: string;
  name: string;
  status: 'Planejada' | 'Produção' | 'Publicada';
}

interface ClientAccess {
  id: string;
  company: string;
  profile: string;
  access: 'Somente leitura';
  lastAccess: string;
}

interface EngineeringReview {
  id: string;
  project: string;
  unit: string;
  status: 'Aprovado' | 'Ajustar' | 'Vetado';
  note: string;
}

interface PilotMetric {
  id: string;
  indicator: string;
  value: number;
  target: number;
}


interface EvidenceGalleryItem {
  id: string;
  title: string;
  unit: string;
  month: string;
  category: 'Antes' | 'Depois' | 'Campanha';
  fileName: string;
}


interface ActiveBreakPlan {
  id: string;
  sector: string;
  pauseMinutes: 5 | 10 | 15;
  schedule: string;
  focus: string;
}

interface FieldLaunchLog {
  id: string;
  professional: string;
  unit: string;
  module: 'Ginástica' | 'Ergonomia' | 'Fisioterapia' | 'NR1';
  launchedAt: string;
  records: number;
}

interface PersistedHubState {
  cycles: UnitCycle[];
  presentCount: number;
  sessionLabel: string;
  attendanceMode: 'count' | 'qr' | 'exceptions';
  evidences: EvidenceItem[];
  campaigns: CampaignItem[];
  engineering: EngineeringReview[];
}

const initialCycles: UnitCycle[] = [
  { id: 'c1', unit: 'Toyota 452', dueDate: '2026-03-10', status: 'Enviado', launchedBy: 'Ana RH', qualityScore: 96 },
  { id: 'c2', unit: 'Usina Pilon', dueDate: '2026-03-10', status: 'Rascunho', launchedBy: 'Lucas Fisio', qualityScore: 74 },
  { id: 'c3', unit: 'Centro Logístico', dueDate: '2026-03-10', status: 'Fechado', launchedBy: 'Marcela SST', qualityScore: 100 },
];

const initialCampaigns: CampaignItem[] = [
  { id: 'm1', month: 'Jan', name: 'Janeiro Branco', status: 'Publicada' },
  { id: 'm2', month: 'Fev', name: 'Saúde Postural', status: 'Publicada' },
  { id: 'm3', month: 'Mar', name: 'Ergonomia na prática', status: 'Produção' },
  { id: 'm4', month: 'Abr', name: 'Movimento seguro', status: 'Planejada' },
  { id: 'm5', month: 'Set', name: 'Setembro Amarelo', status: 'Planejada' },
  { id: 'm6', month: 'Nov', name: 'Novembro Azul', status: 'Planejada' },
];


const initialEngineering: EngineeringReview[] = [
  { id: 'en1', project: 'Nova célula de solda', unit: 'Toyota 452', status: 'Ajustar', note: 'Elevar bancada em 8cm para reduzir flexão lombar.' },
  { id: 'en2', project: 'Esteira de expedição', unit: 'Centro Logístico', status: 'Aprovado', note: 'Altura e alcance dentro do recomendado.' },
  { id: 'en3', project: 'Posto de inspeção final', unit: 'Usina Pilon', status: 'Vetado', note: 'Risco biomecânico crítico para ombro e punho.' },
];


const initialEvidenceGallery: EvidenceGalleryItem[] = [
  { id: 'g1', title: 'Troca de cadeira ergonômica', unit: 'Toyota 452', month: 'Fev/2026', category: 'Antes', fileName: 'cadeira-antes-01.jpg' },
  { id: 'g2', title: 'Troca de cadeira ergonômica', unit: 'Toyota 452', month: 'Fev/2026', category: 'Depois', fileName: 'cadeira-depois-01.jpg' },
  { id: 'g3', title: 'Campanha Setembro Amarelo', unit: 'Usina Pilon', month: 'Set/2026', category: 'Campanha', fileName: 'setembro-banner.jpg' },
  { id: 'g4', title: 'Ajuste de bancada produção', unit: 'Centro Logístico', month: 'Mar/2026', category: 'Antes', fileName: 'bancada-antes.jpg' },
  { id: 'g5', title: 'Ajuste de bancada produção', unit: 'Centro Logístico', month: 'Mar/2026', category: 'Depois', fileName: 'bancada-depois.jpg' },
  { id: 'g6', title: 'Campanha Novembro Azul', unit: 'Toyota 452', month: 'Nov/2026', category: 'Campanha', fileName: 'novembro-banner.jpg' },
];

const pilotMetrics: PilotMetric[] = [
  { id: 'p1', indicator: 'Vidas no piloto NR1 (Cerquilho)', value: 1000, target: 1000 },
  { id: 'p2', indicator: 'Questionários leves coletados', value: 642, target: 900 },
  { id: 'p3', indicator: 'Sinal de ansiedade identificado', value: 118, target: 120 },
  { id: 'p4', indicator: 'Encaminhamentos preventivos', value: 74, target: 80 },
];


const activeBreakPlans: ActiveBreakPlan[] = [
  { id: 'ab1', sector: 'Fundição', pauseMinutes: 10, schedule: '08:20 / 14:30', focus: 'Mobilidade lombar e ombro' },
  { id: 'ab2', sector: 'Prensas', pauseMinutes: 5, schedule: '09:10 / 15:10', focus: 'Punho, antebraço e cervical' },
  { id: 'ab3', sector: 'Expedição', pauseMinutes: 15, schedule: '10:00 / 16:00', focus: 'MMII, lombar e flexibilidade' },
  { id: 'ab4', sector: 'Administrativo', pauseMinutes: 5, schedule: '11:00 / 16:20', focus: 'Postura sentada e cervical' },
];

const fieldLaunchLogs: FieldLaunchLog[] = [
  { id: 'l1', professional: 'Lucas Fisio', unit: 'Toyota 452', module: 'Ginástica', launchedAt: '2026-03-06 08:41', records: 54 },
  { id: 'l2', professional: 'Ana RH', unit: 'Usina Pilon', module: 'NR1', launchedAt: '2026-03-06 10:12', records: 29 },
  { id: 'l3', professional: 'Marcela SST', unit: 'Centro Logístico', module: 'Ergonomia', launchedAt: '2026-03-06 11:05', records: 16 },
  { id: 'l4', professional: 'Dr. Roberto SST', unit: 'Toyota 452', module: 'Fisioterapia', launchedAt: '2026-03-06 13:27', records: 21 },
];

const initialClients: ClientAccess[] = [
  { id: 'cl1', company: 'Toyota 452', profile: 'Eng. Produção', access: 'Somente leitura', lastAccess: '2026-02-24 09:22' },
  { id: 'cl2', company: 'Usina Pilon', profile: 'RH Corporativo', access: 'Somente leitura', lastAccess: '2026-02-24 10:15' },
  { id: 'cl3', company: 'Centro Logístico', profile: 'Coord. SST', access: 'Somente leitura', lastAccess: '2026-02-23 16:41' },
];

const HUB_STORAGE_KEY = 'operations-hub-state-v1';

const getInitialHubState = (): PersistedHubState => {
  if (typeof window === 'undefined') {
    return {
      cycles: initialCycles,
      presentCount: 38,
      sessionLabel: 'Turno A - Linha 3',
      attendanceMode: 'count',
      evidences: [
        { id: 'e1', title: 'Ajuste ergonômico de bancada', unit: 'Toyota 452', date: '2026-02-04', fileName: 'bancada-antes.jpg', type: 'Antes' },
        { id: 'e2', title: 'Ajuste ergonômico de bancada', unit: 'Toyota 452', date: '2026-02-20', fileName: 'bancada-depois.jpg', type: 'Depois' },
        { id: 'e3', title: 'Campanha Setembro Amarelo', unit: 'Usina Pilon', date: '2026-02-12', fileName: 'setembro-amarelo-banner.png', type: 'Campanha' },
      ],
      campaigns: initialCampaigns,
      engineering: initialEngineering,
    };
  }

  try {
    const raw = window.localStorage.getItem(HUB_STORAGE_KEY);
    if (!raw) throw new Error('no persisted state');
    const parsed = JSON.parse(raw) as PersistedHubState;
    return parsed;
  } catch {
    return {
      cycles: initialCycles,
      presentCount: 38,
      sessionLabel: 'Turno A - Linha 3',
      attendanceMode: 'count',
      evidences: [
        { id: 'e1', title: 'Ajuste ergonômico de bancada', unit: 'Toyota 452', date: '2026-02-04', fileName: 'bancada-antes.jpg', type: 'Antes' },
        { id: 'e2', title: 'Ajuste ergonômico de bancada', unit: 'Toyota 452', date: '2026-02-20', fileName: 'bancada-depois.jpg', type: 'Depois' },
        { id: 'e3', title: 'Campanha Setembro Amarelo', unit: 'Usina Pilon', date: '2026-02-12', fileName: 'setembro-amarelo-banner.png', type: 'Campanha' },
      ],
      campaigns: initialCampaigns,
      engineering: initialEngineering,
    };
  }
};

const OperationsHub: React.FC = () => {
  const initialState = React.useMemo(() => getInitialHubState(), []);
  const [cycles, setCycles] = React.useState<UnitCycle[]>(initialState.cycles);
  const [presentCount, setPresentCount] = React.useState(initialState.presentCount);
  const [targetPeople] = React.useState(50);
  const [sessionLabel, setSessionLabel] = React.useState(initialState.sessionLabel);
  const [attendanceMode, setAttendanceMode] = React.useState<'count' | 'qr' | 'exceptions'>(initialState.attendanceMode);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [copiedPortalLink, setCopiedPortalLink] = React.useState(false);
  const [galleryUnitFilter, setGalleryUnitFilter] = React.useState('Todas');
  const [galleryMonthFilter, setGalleryMonthFilter] = React.useState('Todos');
  const [evidences, setEvidences] = React.useState<EvidenceItem[]>(initialState.evidences);
  const [campaigns, setCampaigns] = React.useState<CampaignItem[]>(initialState.campaigns);
  const [engineering, setEngineering] = React.useState<EngineeringReview[]>(initialState.engineering);
  const [galleryItems] = React.useState<EvidenceGalleryItem[]>(initialEvidenceGallery);

  const adherence = Math.round((presentCount / targetPeople) * 100);
  const portalLink = 'https://portal.nr01master.com/cliente-view/atividade';
  const closedCycles = cycles.filter(item => item.status === 'Fechado').length;
  const publishedCampaigns = campaigns.filter(item => item.status === 'Publicada').length;
  const blockedProjects = engineering.filter(item => item.status === 'Vetado').length;
  const filteredGallery = React.useMemo(() => galleryItems.filter(item => (galleryUnitFilter === 'Todas' || item.unit === galleryUnitFilter) && (galleryMonthFilter === 'Todos' || item.month === galleryMonthFilter)), [galleryItems, galleryUnitFilter, galleryMonthFilter]);
  const avgPhotosPerUnit = Math.round(galleryItems.length / new Set(galleryItems.map(item => item.unit)).size);
  const totalLaunches = fieldLaunchLogs.reduce((sum, item) => sum + item.records, 0);

  React.useEffect(() => {
    const state: PersistedHubState = {
      cycles,
      presentCount,
      sessionLabel,
      attendanceMode,
      evidences,
      campaigns,
      engineering,
    };
    window.localStorage.setItem(HUB_STORAGE_KEY, JSON.stringify(state));
  }, [cycles, presentCount, sessionLabel, attendanceMode, evidences, campaigns, engineering]);

  const qualityChecklist = [
    { label: 'Presença lançada para todos os turnos', ok: true },
    { label: 'Queixas ambulatoriais por setor preenchidas', ok: true },
    { label: 'CID F/G/I com dias perdidos informados', ok: false },
    { label: 'Plano de ação com evidência visual anexada', ok: evidences.length > 0 },
  ];

  const updateCycleStatus = (cycleId: string, status: UnitCycle['status']) => {
    setCycles(prev => prev.map(item => (item.id === cycleId ? { ...item, status } : item)));
  };

  const onSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const createEvidenceFromFiles = () => {
    if (!selectedFiles.length) return;

    const mapped = selectedFiles.map((file, idx): EvidenceItem => ({
      id: `e-${Date.now()}-${idx}`,
      title: 'Evidência enviada manualmente',
      unit: 'Unidade não definida',
      date: new Date().toISOString().slice(0, 10),
      fileName: file.name,
      type: 'Depois',
    }));

    setEvidences(prev => [...mapped, ...prev]);
    setSelectedFiles([]);
  };

  const cycleEngineeringStatus = (id: string) => {
    setEngineering(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (item.status === 'Aprovado') return { ...item, status: 'Ajustar' };
      if (item.status === 'Ajustar') return { ...item, status: 'Vetado' };
      return { ...item, status: 'Aprovado' };
    }));
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (item.status === 'Planejada') return { ...item, status: 'Produção' };
      if (item.status === 'Produção') return { ...item, status: 'Publicada' };
      return { ...item, status: 'Planejada' };
    }));
  };

  const exportOperationalSnapshot = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      attendance: {
        sessionLabel,
        presentCount,
        targetPeople,
        adherence,
        mode: attendanceMode,
      },
      cycles,
      campaigns,
      engineering,
      evidences,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapshot-operacao-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyPortalLink = async () => {
    try {
      await navigator.clipboard.writeText(portalLink);
      setCopiedPortalLink(true);
      setTimeout(() => setCopiedPortalLink(false), 1500);
    } catch {
      setCopiedPortalLink(false);
    }
  };

  const resetDemoState = () => {
    window.localStorage.removeItem(HUB_STORAGE_KEY);
    const resetState = getInitialHubState();
    setCycles(resetState.cycles);
    setPresentCount(resetState.presentCount);
    setSessionLabel(resetState.sessionLabel);
    setAttendanceMode(resetState.attendanceMode);
    setEvidences(resetState.evidences);
    setCampaigns(resetState.campaigns);
    setEngineering(resetState.engineering);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 overflow-y-auto h-full">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">Operação</p>
            <h2 className="text-2xl font-bold text-slate-900">Hub de Operação Mensal</h2>
            <p className="text-sm text-slate-500 mt-1">
              Entrada até dia 10, presença rápida em campo, campanhas e evidências visuais para auditoria sem retrabalho em planilhas e PPTs pesados.
            </p>
          </div>
          <button onClick={resetDemoState} className="w-fit px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Restaurar demo
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Unidades fechadas no mês</p>
          <p className="text-2xl font-black text-slate-900">{closedCycles}/{cycles.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Evidências anexadas</p>
          <p className="text-2xl font-black text-slate-900">{evidences.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Campanhas publicadas</p>
          <p className="text-2xl font-black text-slate-900">{publishedCampaigns}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Projetos vetados (prevenção)</p>
          <p className="text-2xl font-black text-rose-600">{blockedProjects}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Registros lançados hoje</p>
          <p className="text-2xl font-black text-slate-900">{totalLaunches}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <article className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Ciclo mensal por unidade</h3>
            <span className="text-xs px-2 py-1 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold">Prazo: dia 10</span>
          </div>

          <div className="space-y-3">
            {cycles.map(cycle => (
              <div key={cycle.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{cycle.unit}</p>
                    <p className="text-xs text-slate-500">Lançado por {cycle.launchedBy} • fechamento {new Date(cycle.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold">Qualidade: {cycle.qualityScore}%</span>
                    <select
                      value={cycle.status}
                      onChange={(e) => updateCycleStatus(cycle.id, e.target.value as UnitCycle['status'])}
                      className="text-xs border border-slate-300 rounded-lg px-2 py-1.5"
                    >
                      <option>Rascunho</option>
                      <option>Enviado</option>
                      <option>Fechado</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Checklist de qualidade</h3>
          <div className="space-y-2">
            {qualityChecklist.map((item, idx) => (
              <div key={idx} className={`text-xs rounded-lg border p-2 flex items-start gap-2 ${item.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                {item.ok ? <CheckCircle2 size={14} className="mt-0.5" /> : <AlertTriangle size={14} className="mt-0.5" />}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <button onClick={exportOperationalSnapshot} className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 flex items-center justify-center gap-2">
            <Download size={14} /> Exportar snapshot JSON
          </button>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Presença rápida da ginástica</h3>
            <Users size={18} className="text-indigo-600" />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => setAttendanceMode('count')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${attendanceMode === 'count' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'border-slate-300 text-slate-700'}`}>Contagem rápida</button>
            <button onClick={() => setAttendanceMode('qr')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${attendanceMode === 'qr' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'border-slate-300 text-slate-700'}`}>QR em massa</button>
            <button onClick={() => setAttendanceMode('exceptions')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${attendanceMode === 'exceptions' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'border-slate-300 text-slate-700'}`}>Somente exceções</button>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 mb-4">
            <label className="text-xs text-slate-500 font-semibold">Sessão</label>
            <input value={sessionLabel} onChange={(e) => setSessionLabel(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Presentes</p>
              <p className="text-3xl font-black text-slate-900">{presentCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Adesão</p>
              <p className={`text-3xl font-black ${adherence >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{adherence}%</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setPresentCount((p) => Math.max(0, p - 1))} className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold">-1</button>
            <button onClick={() => setPresentCount((p) => Math.min(targetPeople, p + 1))} className="flex-1 rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm font-semibold">+1 rápido</button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <QrCode size={14} /> Modo atual: {attendanceMode === 'count' ? 'Contagem rápida' : attendanceMode === 'qr' ? 'QR em massa' : 'Somente exceções'}
          </div>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Importação e evidências</h3>
            <FileUp size={18} className="text-indigo-600" />
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50">
            <p className="text-sm font-semibold text-slate-700 mb-1">Importar planilha atual (CSV/XLSX)</p>
            <p className="text-xs text-slate-500 mb-3">Migração gradual do processo manual para o sistema.</p>
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white">
                <input type="file" multiple className="hidden" onChange={onSelectFiles} />
                Selecionar arquivos
              </label>
              <button onClick={createEvidenceFromFiles} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold">Anexar evidência</button>
            </div>
            {selectedFiles.length > 0 && (
              <p className="text-xs text-slate-600 mt-2">{selectedFiles.length} arquivo(s) pronto(s) para anexar.</p>
            )}
          </div>

          <div className="mt-4 space-y-2 max-h-52 overflow-auto pr-1">
            {evidences.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-2.5 text-xs flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                  <p className="text-slate-500 truncate">{item.fileName} • {item.unit} • {new Date(item.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold">{item.type}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <article className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Campanhas fixas (12 meses)</h3>
            <CalendarDays size={18} className="text-indigo-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {campaigns.map(item => (
              <button key={item.id} onClick={() => toggleCampaignStatus(item.id)} className="text-left rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors">
                <p className="text-xs text-slate-500">{item.month}</p>
                <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                <span className={`inline-flex mt-1 text-xs px-2 py-1 rounded-lg border ${item.status === 'Publicada' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : item.status === 'Produção' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  {item.status}
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Portal cliente (read-only)</h3>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs mb-3">
            <p className="font-semibold text-slate-700">Link seguro</p>
            <p className="break-all text-slate-600 mt-1">{portalLink}</p>
            <button onClick={copyPortalLink} className="mt-2 text-indigo-600 font-semibold inline-flex items-center gap-1">
              <Copy size={12} /> {copiedPortalLink ? 'Copiado!' : 'Copiar link'}
            </button>
          </div>

          <div className="space-y-2">
            {initialClients.map(client => (
              <div key={client.id} className="rounded-lg border border-slate-200 p-2.5 text-xs">
                <p className="font-semibold text-slate-800">{client.company}</p>
                <p className="text-slate-500">{client.profile} • {client.access}</p>
                <p className="text-slate-400">Último acesso: {client.lastAccess}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-slate-200 p-2 flex items-center gap-2"><Eye size={13} /> Sem edição</div>
            <div className="rounded-lg border border-slate-200 p-2 flex items-center gap-2"><ShieldCheck size={13} /> Perfil seguro</div>
            <div className="col-span-2 rounded-lg border border-slate-200 p-2 flex items-center gap-2"><FileSpreadsheet size={13} /> Visualiza dashboards e evidências</div>
          </div>
        </article>
      </section>


      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">Módulo de Evidências Visuais (Galeria)</h3>
            <p className="text-xs text-slate-500">Organização por unidade/mês para substituir PPT pesado e facilitar auditoria visual.</p>
          </div>
          <div className="text-xs px-2 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
            Média atual: {avgPhotosPerUnit} fotos por unidade (meta 7-10)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-xs text-slate-600">
            <Filter size={13} /> Filtrar galeria
          </div>
          <div className="rounded-xl border border-slate-200 px-2 py-1.5 bg-slate-50 text-xs text-slate-600">{filteredGallery.length} evidências exibidas</div>
          <select value={galleryUnitFilter} onChange={(e) => setGalleryUnitFilter(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-xs">
            <option>Todas</option>
            <option>Toyota 452</option>
            <option>Usina Pilon</option>
            <option>Centro Logístico</option>
          </select>
          <select value={galleryMonthFilter} onChange={(e) => setGalleryMonthFilter(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-xs">
            <option>Todos</option>
            <option>Fev/2026</option>
            <option>Mar/2026</option>
            <option>Set/2026</option>
            <option>Nov/2026</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredGallery.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className={`h-24 flex items-center justify-center text-xs font-semibold ${item.category === 'Antes' ? 'bg-amber-50 text-amber-700' : item.category === 'Depois' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                <Image size={14} className="mr-1" /> {item.fileName}
              </div>
              <div className="p-2.5 text-xs">
                <p className="font-semibold text-slate-800">{item.title}</p>
                <p className="text-slate-500">{item.unit} • {item.month}</p>
                <span className="inline-flex mt-1 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <article className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Consultoria de Engenharia (prevenção de projeto ruim)</h3>
            <Building2 size={18} className="text-indigo-600" />
          </div>

          <div className="space-y-2">
            {engineering.map(item => (
              <button key={item.id} onClick={() => cycleEngineeringStatus(item.id)} className="w-full text-left rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{item.project}</p>
                    <p className="text-xs text-slate-500">{item.unit}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg border ${item.status === 'Aprovado' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : item.status === 'Ajustar' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{item.note}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Clique no card para alternar status e simular parecer técnico.</p>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Piloto NR1 (Embrião)</h3>
            <Wrench size={18} className="text-indigo-600" />
          </div>

          <div className="space-y-2">
            {pilotMetrics.map(metric => {
              const pct = Math.min(100, Math.round((metric.value / metric.target) * 100));
              return (
                <div key={metric.id} className="rounded-lg border border-slate-200 p-2.5">
                  <p className="text-xs text-slate-600">{metric.indicator}</p>
                  <div className="flex items-center justify-between text-xs font-semibold mt-1">
                    <span className="text-slate-800">{metric.value}</span>
                    <span className="text-slate-500">Meta {metric.target}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 mt-2">
                    <div className={`h-2 rounded-full ${pct >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Calendário de Pausa Ativa por Setor</h3>
            <CalendarRange size={18} className="text-indigo-600" />
          </div>
          <div className="space-y-2">
            {activeBreakPlans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-slate-200 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{plan.sector}</p>
                  <span className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-semibold">{plan.pauseMinutes} min</span>
                </div>
                <p className="text-slate-600 mt-1">Horários: {plan.schedule}</p>
                <p className="text-slate-500">Foco: {plan.focus}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Input descentralizado (ponta)</h3>
            <UserCheck size={18} className="text-indigo-600" />
          </div>
          <div className="space-y-2">
            {fieldLaunchLogs.map((log) => (
              <div key={log.id} className="rounded-xl border border-slate-200 p-3 text-xs">
                <p className="font-semibold text-slate-800">{log.professional} • {log.module}</p>
                <p className="text-slate-600">{log.unit} • {log.launchedAt}</p>
                <p className="text-slate-500">Registros enviados: <span className="font-semibold text-slate-800">{log.records}</span></p>
              </div>
            ))}
          </div>
        </article>
      </section>


      <section className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Clock3 size={18} className="mt-0.5 text-indigo-300" />
          <div>
            <p className="font-semibold">Fluxo recomendado</p>
            <p className="text-sm text-slate-300 mt-1">
              Até o dia 10 as pontas lançam dados, o sistema consolida indicadores automaticamente e o cliente externo acompanha em modo leitura.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OperationsHub;
