
import React, { useState } from 'react';
/* Added LayoutGrid to the imports */
import { 
  FileText, Download, Eye, Clock, ShieldCheck, Printer, AlertTriangle, 
  BrainCircuit, ListChecks, Filter, Search, Calendar, UserCheck, 
  FileSignature, Lock, History, ChevronRight, Info, CheckCircle2, 
  AlertCircle, Archive, Share2, FilterX, LayoutGrid
} from 'lucide-react';
import { useAppData } from '../appData';
import { ActionStatus } from '../types';
import Button from './Button';

const DOCS = [
  { 
    id: 'pgr-1', 
    title: 'PGR - Programa de Gerenciamento de Riscos', 
    type: 'Documento Base',
    icon: <FileText className="text-indigo-500" />, 
    desc: 'Inventário e Plano de Ação unificado conforme item 1.5.3.1 da NR-01.',
    version: 'v2.4',
    date: '12/10/2023',
    validUntil: '12/10/2024',
    status: 'Válido',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rt: 'Dr. Roberto Santos (CRM/SST 12345)',
    scope: 'Todas as Unidades (Norte/Central)',
    isOfficial: true,
    hash: 'sha256:88a1...f00d'
  },
  { 
    id: 'risks-1', 
    title: 'Inventário de Riscos Detalhado', 
    type: 'Inventário',
    icon: <AlertTriangle className="text-amber-500" />, 
    desc: 'Lista exaustiva de perigos, riscos e medidas de controle por GHE.',
    version: 'v1.8',
    date: '10/01/2024',
    validUntil: '10/01/2025',
    status: 'Vencendo em 30 dias',
    statusColor: 'text-amber-600 bg-amber-50 border-amber-100',
    rt: 'Eng. Amanda Silva (CREA 987654)',
    scope: 'Unidade Industrial Norte',
    isOfficial: true,
    hash: 'sha256:b33e...22cc'
  },
  { 
    id: 'psych-1', 
    title: 'Diagnóstico Psicossocial Anual', 
    type: 'Psicossocial',
    icon: <BrainCircuit className="text-rose-500" />, 
    desc: 'Resultados consolidados e anônimos do clima organizacional.',
    version: 'v1.0',
    date: '15/03/2024',
    validUntil: '15/03/2025',
    status: 'Válido',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rt: 'Psic. Luciana Rocha (CRP 06/123)',
    scope: 'Grupo Corporativo (Blindado)',
    isOfficial: true,
    hash: 'sha256:99ff...aa11'
  },
  { 
    id: 'actions-1', 
    title: 'Status do Plano de Ação', 
    type: 'Gestão',
    icon: <ListChecks className="text-emerald-500" />, 
    desc: 'Cronograma de execução e trilha de evidências de controle.',
    version: 'Dinâmico',
    date: 'Hoje (Atualizado)',
    validUntil: 'N/A',
    status: 'Em Aberto',
    statusColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    rt: 'Equipe SST / Gestão Interna',
    scope: 'Plano Estratégico 2024',
    isOfficial: false
  },
];

const Reports: React.FC = () => {
  const [filterType, setFilterType] = useState('Todos');
  const [showImmutabilityInfo, setShowImmutabilityInfo] = useState(false);
  const { actions } = useAppData();
  const openActions = actions.filter(action => action.status !== ActionStatus.COMPLETED).length;

  const stats = [
    { label: 'Docs Oficiais', value: '03', icon: <FileSignature size={16}/>, color: 'text-indigo-600' },
    { label: 'Status: Blindado', value: '100%', icon: <ShieldCheck size={16}/>, color: 'text-emerald-600' },
    { label: 'Próximo Vencimento', value: '30 dias', icon: <Clock size={16}/>, color: 'text-amber-600' },
    { label: 'Total de Versões', value: '12', icon: <History size={16}/>, color: 'text-slate-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Central de Documentos e Relatórios</h2>
          <p className="text-slate-500 text-sm font-medium">Geração automática de conformidade NR-01 com blindagem jurídica.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">
            <Share2 size={18} /> Compartilhar Kit
          </Button>
          <Button variant="primary">
            <Printer size={18} /> Imprimir Dossiê
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className={`w-10 h-10 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center`}>
                {stat.icon}
             </div>
             <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por título, versão ou hash do documento..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            <option>Unidade: Todas</option>
            <option>Planta Norte</option>
            <option>Escritório Central</option>
          </select>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
          >
            <option>Status: Válido</option>
            <option>Status: Vencido</option>
          </select>
          <button className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-xl transition-all">
            <FilterX size={18} />
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOCS.map((doc) => {
          const isActionsDoc = doc.id === 'actions-1';
          const status = isActionsDoc ? (openActions > 0 ? 'Em Aberto' : 'Concluído') : doc.status;
          const statusColor = isActionsDoc 
            ? (openActions > 0 ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100')
            : doc.statusColor;

          return (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-200 hover:shadow-xl transition-all">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {doc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-500 uppercase">{doc.type}</span>
                      <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                      <span className="text-xs font-medium text-slate-400">v{doc.version}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
                  </div>
                </div>
                {doc.isOfficial && (
                  <div className="group/lock relative">
                    <Lock size={16} className="text-slate-300 hover:text-indigo-500 cursor-help" />
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 text-white text-xs p-3 rounded-xl opacity-0 invisible group-hover/lock:opacity-100 group-hover/lock:visible transition-all shadow-2xl z-50">
                      <p className="font-bold text-emerald-400 mb-1 uppercase">Documento Oficial</p>
                      Esta versão é imutável e assinada digitalmente.
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5">{doc.desc}</p>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
                  <span className="font-bold text-slate-400 uppercase">Status Validade</span>
                  <span className={`px-2 py-1 rounded-lg font-bold text-xs border ${statusColor}`}>{status}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
                  <span className="font-bold text-slate-400 uppercase">Responsável Técnico</span>
                  <span className="font-medium text-slate-700 text-xs">{doc.rt}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
                  <span className="font-bold text-slate-400 uppercase">Escopo Coberto</span>
                  <span className="font-medium text-slate-700 flex items-center gap-1 text-xs">
                    <LayoutGrid size={12} className="text-indigo-400" /> {doc.scope}
                  </span>
                </div>
              </div>

              {doc.hash && (
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-xs font-mono text-slate-500 group-hover:text-indigo-600 font-medium">{doc.hash}</span>
                   </div>
                   <button className="text-slate-300 hover:text-indigo-500 transition-colors">
                      <Info size={14} />
                   </button>
                </div>
              )}
            </div>

            <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
              <Button variant="primary" className="flex-1">
                <Download size={16} /> Baixar
              </Button>
              <Button variant="secondary" className="flex-1">
                <Eye size={16} /> Prévia
              </Button>
            </div>
          </div>
        );
        })}
      </div>

      {/* Audit & Compliance History */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg tracking-tight flex items-center gap-3">
              <History size={20} className="text-indigo-600" />
              Trilha de Auditoria & Versionamento
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Log completo de modificações estruturais e geração de documentos.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-xs font-bold text-slate-400">Documentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-400">Evidências</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-xs font-bold text-slate-400">Riscos</span>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
          {[
            { user: 'Dr. Roberto Santos', action: 'Geração do PGR v2.4 (Documento Oficial)', time: 'Hoje, 10:45', category: 'Documento', icon: <FileSignature size={16}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { user: 'Ana Martins (RH)', action: 'Subiu evidência: Lista de Presença Treinamento Assédio', time: 'Hoje, 09:12', category: 'Evidência', icon: <CheckCircle2 size={16}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { user: 'Sistema Automático', action: 'Gatilho de Reavaliação: Mudança estrutural Planta Norte', time: 'Ontem, 16:30', category: 'Risco', icon: <AlertCircle size={16}/>, color: 'text-rose-600', bg: 'bg-rose-50' },
            { user: 'Eng. Amanda Silva', action: 'Aprovação técnica do Inventário de Riscos Detalhado', time: 'Ontem, 14:00', category: 'Documento', icon: <ShieldCheck size={16}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { user: 'Admin Master', action: 'Assinatura digital do Diagnóstico Psicossocial v1.0', time: '12/05 às 11:20', category: 'Documento', icon: <Lock size={16}/>, color: 'text-slate-500', bg: 'bg-slate-50' },
          ].map((log, i) => (
            <div key={i} className="p-5 flex gap-4 hover:bg-slate-50/80 transition-all group">
              <div className={`w-10 h-10 rounded-xl ${log.bg} ${log.color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                {log.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-slate-400">{log.category}</span>
                  <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                  <span className="text-xs font-medium text-slate-400">{log.time}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight">{log.action}</h4>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 border border-white shadow-sm">{log.user[0]}</div>
                   <p className="text-xs text-slate-500 font-medium">{log.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                    <ChevronRight size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-slate-900 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase mb-3">Integridade de Dados Assegurada por Blockchain / Hash Imutável</p>
          <Button variant="ghost" className="text-white border-white/10 hover:bg-white/20">
            Ver Log Completo de Auditoria
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reports;


