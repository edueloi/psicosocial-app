
import React, { useState } from 'react';
/* Added ShieldAlert to imports from lucide-react */
import { 
  Calendar, Shield, Users, Zap, BrainCircuit, FileText, 
  CheckCircle2, Search, Filter, History, Lock, ArrowRight, 
  ExternalLink, ShieldCheck, AlertTriangle, Clock, Download, 
  Info, ChevronDown, Eye, Fingerprint, ShieldAlert
} from 'lucide-react';
import { useAppData } from '../appData';

const ComplianceTimeline: React.FC = () => {
  const [filterType, setFilterType] = useState('Todos');
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
      auditVersion: 'v2.4.1',
      evidenceHash: 'sha256:7b92...f8a2'
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
      auditVersion: 'v2.4.0',
      evidenceHash: 'sha256:49ac...e211'
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
      auditVersion: 'v2.3.9',
      evidenceHash: 'sha256:d91a...33bc'
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
      auditVersion: 'v2.3.0',
      evidenceHash: 'sha256:11bb...99cc'
    },
  ];

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'change':
        return { icon: <Zap className="text-rose-500" />, bg: 'bg-rose-50' };
      case 'psychosocial':
        return { icon: <BrainCircuit className="text-indigo-500" />, bg: 'bg-indigo-50' };
      case 'training':
        return { icon: <Users className="text-emerald-500" />, bg: 'bg-emerald-50' };
      case 'document':
        return { icon: <FileText className="text-slate-500" />, bg: 'bg-slate-50' };
      case 'action':
        return { icon: <CheckCircle2 className="text-indigo-500" />, bg: 'bg-indigo-50' };
      default:
        return { icon: <Info className="text-slate-400" />, bg: 'bg-slate-50' };
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

  const uiEvents = [
    ...appEvents.map(event => {
      const style = getTypeStyle(event.type);
      return {
        ...event,
        icon: style.icon,
        bg: style.bg,
        validityColor: getValidityColor(event.validity),
        link: event.linkLabel
      };
    }),
    ...events
  ];

  const stats = [
    { label: 'Eventos Registrados', value: String(uiEvents.length), icon: <History size={16}/>, color: 'text-slate-600' },
    { label: 'Eventos Críticos', value: '12', icon: <ShieldAlert size={16}/>, color: 'text-rose-600' },
    { label: 'Sem Evidência', value: '00', icon: <AlertTriangle size={16}/>, color: 'text-emerald-600' },
    { label: 'Última Revisão PGR', value: '10/04', icon: <FileText size={16}/>, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Header with Scope & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Timeline de Conformidade</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            <p className="text-slate-500 text-xs font-bold flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-500" />
              Período: <span className="text-slate-800">01/01/2024 → {new Date().toLocaleDateString('pt-BR')}</span>
            </p>
            <div className="h-3 w-px bg-slate-300 hidden sm:block"></div>
            <p className="text-slate-500 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-indigo-500" />
              Escopo: <span className="text-slate-800 uppercase tracking-tighter">Eventos Jurídicos NR-01</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all">
            <Download size={16} className="text-indigo-600" /> Exportar Linha do Tempo
          </button>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Diligência Comprovada</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
             <div className={`w-8 h-8 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center`}>
                {stat.icon}
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{stat.label}</p>
                <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar evento, responsável ou hash de evidência..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Unidade: Todas</option>
            <option>Planta Norte</option>
            <option>Escritório Central</option>
          </select>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter"
          >
            <option>Tipo: Todos</option>
            <option>Gestão de Mudança</option>
            <option>Psicossocial</option>
            <option>Treinamento</option>
            <option>Documento</option>
          </select>
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Status: Vigente</option>
            <option>Status: Vencido</option>
          </select>
        </div>
      </div>

      {/* Immutability Alert */}
      <div className="flex items-center gap-3 px-5 py-3 bg-indigo-900 text-indigo-100 rounded-2xl border border-indigo-800 shadow-lg">
        <Lock size={16} className="shrink-0" />
        <p className="text-[10px] font-black uppercase tracking-[0.1em]">
          Este histórico é <span className="text-white underline">IMUTÁVEL</span>. Correções geram novos eventos de retificação para garantir integridade jurídica.
        </p>
      </div>

      {/* Timeline Structure */}
      <div className="relative space-y-12">
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-200 via-slate-200 to-transparent"></div>

        {uiEvents.map((event) => (
          <div key={event.id} className="relative pl-20 group animate-in slide-in-from-left duration-500">
            {/* Timeline Icon */}
            <div className={`absolute left-4 top-4 w-8 h-8 rounded-xl ${event.bg} flex items-center justify-center border-4 border-white shadow-md z-10 group-hover:scale-110 transition-transform`}>
              {event.icon}
            </div>
            
            {/* Event Card */}
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
                  </div>
                  <div className="flex items-center gap-3">
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

                  {/* Direct Module Links */}
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
                
                {/* Event Footer: Evidence & Security Logs */}
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
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-indigo-600 shadow-sm" title="Responsável Técnico">RS</div>
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-500 shadow-sm" title="Sistema Automatizado">NR</div>
                    </div>
                  </div>
                </div>

                {/* Expanded Security Log Area */}
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


