import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Users,
  Zap,
  BrainCircuit,
  FileText,
  CheckCircle2,
  Search,
  History,
  Lock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Download,
  Info,
  Eye,
  Fingerprint,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import { useAppData } from '../appData';
import Button from './Button';

type TimelineStatusFilter = 'Todos' | 'Vigente' | 'Atenção' | 'Vencido';

const ComplianceTimeline: React.FC = () => {
  const [filterType, setFilterType] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState<TimelineStatusFilter>('Todos');
  const [unitFilter, setUnitFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogId, setShowLogId] = useState<string | null>(null);
  const { events: appEvents, navigate } = useAppData();

  const events = [
    {
      id: 'ev-1',
      date: '2024-04-10',
      title: 'Reavaliação de Riscos (Gestão de Mudança)',
      desc: 'Unidade Norte: Troca de maquinário no setor de produção disparou gatilho de revisão do PGR conforme NR-01.',
      icon: <Zap className="text-rose-500" />,
      bg: 'bg-rose-50',
      type: 'Gestão de Mudança',
      legalRef: 'NR-01, 1.5.4.4.6',
      validity: 'Vigente',
      validityColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      link: 'Ir para Inventário',
      linkTarget: 'inventory',
      auditVersion: 'v2.4.1',
      evidenceHash: 'sha256:7b92...f8a2',
      unit: 'Planta Norte',
    },
    {
      id: 'ev-2',
      date: '2024-03-25',
      title: 'Consolidação de Diagnóstico Psicossocial',
      desc: 'Conclusão da pesquisa trimestral. Score de clima em 82/100. Identificado hotspot no Comercial.',
      icon: <BrainCircuit className="text-indigo-500" />,
      bg: 'bg-indigo-50',
      type: 'Psicossocial',
      legalRef: 'NR-01, 1.5.3.1',
      validity: 'Reavaliar em 90 dias',
      validityColor: 'text-amber-600 bg-amber-50 border-amber-100',
      link: 'Ver Diagnóstico',
      linkTarget: 'psychosocial',
      auditVersion: 'v2.4.0',
      evidenceHash: 'sha256:49ac...e211',
      unit: 'Escritório Central',
    },
    {
      id: 'ev-3',
      date: '2024-03-12',
      title: 'Treinamento de Liderança: Assédio',
      desc: 'Concluído por 95% dos gestores das unidades Administrativas. Lista de presença assinada digitalmente.',
      icon: <Users className="text-emerald-500" />,
      bg: 'bg-emerald-50',
      type: 'Treinamento',
      legalRef: 'NR-01, 1.4.1 (g)',
      validity: 'Vigente',
      validityColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      link: 'Lista de Presença',
      linkTarget: 'forms',
      auditVersion: 'v2.3.9',
      evidenceHash: 'sha256:d91a...33bc',
      unit: 'Escritório Central',
    },
    {
      id: 'ev-4',
      date: '2023-11-15',
      title: 'Assinatura Digital PGR v2.3',
      desc: 'PGR revisado e assinado eletronicamente pelo responsável técnico Dr. Roberto Santos.',
      icon: <FileText className="text-slate-500" />,
      bg: 'bg-slate-50',
      type: 'Documento',
      legalRef: 'NR-01, 1.5.4.1',
      validity: 'Vencido',
      validityColor: 'text-rose-600 bg-rose-50 border-rose-100',
      link: 'Ver PDF Assinado',
      linkTarget: 'reports',
      auditVersion: 'v2.3.0',
      evidenceHash: 'sha256:11bb...99cc',
      unit: 'Planta Norte',
    },
  ];

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'change':
      case 'Gestão de Mudança':
        return { icon: <Zap className="text-rose-500" />, bg: 'bg-rose-50', label: 'Gestão de Mudança' };
      case 'psychosocial':
      case 'Psicossocial':
        return { icon: <BrainCircuit className="text-indigo-500" />, bg: 'bg-indigo-50', label: 'Psicossocial' };
      case 'training':
      case 'Treinamento':
        return { icon: <Users className="text-emerald-500" />, bg: 'bg-emerald-50', label: 'Treinamento' };
      case 'document':
      case 'Documento':
        return { icon: <FileText className="text-slate-500" />, bg: 'bg-slate-50', label: 'Documento' };
      case 'action':
        return { icon: <CheckCircle2 className="text-indigo-500" />, bg: 'bg-indigo-50', label: 'Ação' };
      default:
        return { icon: <Info className="text-slate-400" />, bg: 'bg-slate-50', label: type || 'Geral' };
    }
  };

  const getValidityColor = (validity: string) => {
    if (validity.toLowerCase().includes('vencido')) {
      return 'text-rose-600 bg-rose-50 border-rose-100';
    }
    if (validity.toLowerCase().includes('reavaliar') || validity.toLowerCase().includes('vencendo')) {
      return 'text-amber-600 bg-amber-50 border-amber-100';
    }
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  const getValidityTag = (validity: string): Exclude<TimelineStatusFilter, 'Todos'> => {
    if (validity.toLowerCase().includes('vencido')) return 'Vencido';
    if (validity.toLowerCase().includes('reavaliar') || validity.toLowerCase().includes('vencendo')) return 'Atenção';
    return 'Vigente';
  };

  const uiEvents = useMemo(() => {
    const mappedAppEvents = appEvents.map(event => {
      const style = getTypeStyle(event.type);
      return {
        ...event,
        icon: style.icon,
        bg: style.bg,
        type: style.label,
        validityColor: getValidityColor(event.validity),
        validityTag: getValidityTag(event.validity),
        link: event.linkLabel,
        unit: 'Operação Geral',
      };
    });

    const mappedStaticEvents = events.map(event => ({
      ...event,
      validityTag: getValidityTag(event.validity),
    }));

    return [...mappedAppEvents, ...mappedStaticEvents].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [appEvents]);

  const filteredEvents = useMemo(() => uiEvents.filter((event) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term
      || event.title.toLowerCase().includes(term)
      || event.desc.toLowerCase().includes(term)
      || event.legalRef.toLowerCase().includes(term)
      || (event.evidenceHash || '').toLowerCase().includes(term);

    const matchesType = filterType === 'Todos' || event.type === filterType;
    const matchesStatus = statusFilter === 'Todos' || event.validityTag === statusFilter;
    const matchesUnit = unitFilter === 'Todas' || event.unit === unitFilter;

    return matchesSearch && matchesType && matchesStatus && matchesUnit;
  }), [uiEvents, searchTerm, filterType, statusFilter, unitFilter]);

  const stats = useMemo(() => {
    const total = uiEvents.length;
    const critical = uiEvents.filter(event => event.validityTag === 'Vencido' || event.validityTag === 'Atenção').length;
    const noEvidence = uiEvents.filter(event => !event.evidenceHash).length;
    const latest = uiEvents[0]?.date;

    return [
      { label: 'Eventos Registrados', value: String(total), icon: <History size={16} />, color: 'text-slate-600' },
      { label: 'Eventos Críticos', value: String(critical), icon: <ShieldAlert size={16} />, color: 'text-rose-600' },
      { label: 'Sem Evidência', value: String(noEvidence).padStart(2, '0'), icon: <AlertTriangle size={16} />, color: noEvidence ? 'text-amber-600' : 'text-emerald-600' },
      { label: 'Última Revisão PGR', value: latest ? new Date(latest).toLocaleDateString('pt-BR') : '--', icon: <FileText size={16} />, color: 'text-indigo-600' },
    ];
  }, [uiEvents]);

  const availableUnits = useMemo(() => ['Todas', ...Array.from(new Set(uiEvents.map((event) => event.unit)))], [uiEvents]);
  const availableTypes = useMemo(() => ['Todos', ...Array.from(new Set(uiEvents.map((event) => event.type)))], [uiEvents]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Timeline de Conformidade</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-500" />
              Período: <span className="text-slate-800">01/01/2024 → {new Date().toLocaleDateString('pt-BR')}</span>
            </p>
            <div className="h-3 w-px bg-slate-300 hidden sm:block" />
            <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-indigo-500" />
              Escopo: <span className="text-slate-800 uppercase">Eventos Jurídicos NR-01</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Download size={16} /> Exportar Timeline
          </Button>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Diligência Comprovada</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
              <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Pesquisar evento, base legal ou hash de evidência..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            {availableUnits.map((unit) => <option key={unit} value={unit}>{`Unidade: ${unit}`}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            {availableTypes.map((type) => <option key={type} value={type}>{`Tipo: ${type}`}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TimelineStatusFilter)} className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            {(['Todos', 'Vigente', 'Atenção', 'Vencido'] as TimelineStatusFilter[]).map((status) => <option key={status} value={status}>{`Status: ${status}`}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 py-3 bg-indigo-900 text-indigo-100 rounded-2xl border border-indigo-800 shadow-lg">
        <Lock size={16} className="shrink-0" />
        <p className="text-xs font-bold">
          Este histórico é <span className="text-white underline font-black">IMUTÁVEL</span>. Correções geram novos eventos de retificação para garantir integridade jurídica.
        </p>
      </div>

      <div className="relative space-y-12">
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-200 via-slate-200 to-transparent" />

        {!filteredEvents.length && (
          <div className="pl-20">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
              Nenhum evento encontrado para os filtros aplicados.
            </div>
          </div>
        )}

        {filteredEvents.map((event) => (
          <div key={event.id} className="relative pl-20 group animate-in slide-in-from-left duration-500">
            <div className={`absolute left-4 top-4 w-8 h-8 rounded-xl ${event.bg} flex items-center justify-center border-4 border-white shadow-md z-10 group-hover:scale-110 transition-transform`}>
              {event.icon}
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden group/card">
              <div className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                      <Calendar size={12} />
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border shadow-sm ${event.validityColor}`}>
                      {event.validity}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg uppercase border border-slate-100 flex items-center gap-1.5">
                      <FileText size={10} /> {event.type}
                    </span>
                    <span className="text-[9px] font-black text-violet-500 bg-violet-50 px-3 py-1 rounded-lg uppercase border border-violet-100 flex items-center gap-1.5">
                      <Building2 size={10} /> {event.unit}
                    </span>
                  </div>
                  <div className="group/audit relative">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase border border-emerald-100 cursor-help flex items-center gap-1">
                      <ShieldCheck size={10} /> Auditado {event.auditVersion}
                    </span>
                    <div className="absolute right-0 bottom-full mb-2 w-56 bg-slate-900 text-white text-[10px] p-3 rounded-2xl opacity-0 invisible group-hover/audit:opacity-100 group-hover/audit:visible transition-all shadow-2xl z-50">
                      <p className="font-black text-emerald-400 mb-1 uppercase tracking-widest">Selo de Auditoria</p>
                      Auditado pelo sistema em {new Date(event.date).toLocaleDateString('pt-BR')}. Imutabilidade garantida por Hash.
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 text-xl mb-2 leading-tight group-hover/card:text-indigo-600 transition-colors">{event.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-4">{event.desc}</p>

                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Legal:</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded italic">{event.legalRef}</span>
                    </div>
                  </div>

                  <div className="lg:w-48 shrink-0 space-y-2">
                    <button
                      onClick={() => event.linkTarget && navigate(event.linkTarget)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-xl transition-all group/btn"
                    >
                      <span className="text-[10px] font-black text-slate-500 group-hover/btn:text-indigo-600 uppercase tracking-tighter">{event.link}</span>
                      <ExternalLink size={12} className="text-slate-300 group-hover/btn:text-indigo-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center gap-2">
                      <Eye size={14} />
                      Ver Prova Documental
                    </button>
                    <button
                      onClick={() => setShowLogId(showLogId === event.id ? null : event.id)}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center gap-2"
                    >
                      <Fingerprint size={14} className={showLogId === event.id ? 'text-indigo-500' : ''} />
                      Log de Segurança
                    </button>
                  </div>
                  <div className="flex -space-x-1.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-indigo-600 shadow-sm" title="Responsável Técnico">RS</div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-500 shadow-sm" title="Sistema Automatizado">NR</div>
                  </div>
                </div>

                {showLogId === event.id && (
                  <div className="mt-4 p-5 bg-slate-900 rounded-2xl border border-slate-800 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Trilha de Auditoria Digital</p>
                      <span className="text-[9px] font-mono text-slate-500">{event.evidenceHash}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Criação do Registro</span>
                        <span className="text-slate-300 font-bold">{event.date} 09:12:04</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] border-b border-slate-800 pb-2">
                        <span className="text-slate-500">IP de Origem</span>
                        <span className="text-slate-300 font-bold">187.12.44.102</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Assinatura Digital</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> Validada via RSA-2048
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-10">
        <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 hover:text-slate-800 transition-all border border-slate-200">
          Carregar Histórico Completo (2023)
        </button>
      </div>
    </div>
  );
};

export default ComplianceTimeline;
