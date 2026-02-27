import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Clock,
  ShieldCheck,
  Printer,
  AlertTriangle,
  BrainCircuit,
  ListChecks,
  Search,
  FileSignature,
  Lock,
  History,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Share2,
  FilterX,
  LayoutGrid,
  Building2,
  Factory,
  Sparkles,
} from 'lucide-react';
import { useAppData } from '../appData';
import { ActionStatus } from '../types';
import Button from './Button';

const REPORT_GENERATION_STORAGE_KEY = 'reports-generation-v1';

type ReportStatus = 'Disponível' | 'Em geração' | 'Erro';

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
    hash: 'sha256:88a1...f00d',
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
    hash: 'sha256:b33e...22cc',
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
    hash: 'sha256:99ff...aa11',
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
    isOfficial: false,
  },
];

const COMPANY_REPORTS = [
  {
    id: 'c-yasaki',
    company: 'Yazaki',
    areas: [
      {
        id: 'a-producao',
        name: 'Produção',
        reports: [
          { id: 'r-yz-1', title: 'Relatório Mensal SST - Produção', month: 'Jan/2026', type: 'Mensal', status: 'Disponível' as ReportStatus },
          { id: 'r-yz-2', title: 'Análise Ergonômica Setorial', month: 'Fev/2026', type: 'Ergonomia', status: 'Disponível' as ReportStatus },
        ],
      },
      {
        id: 'a-logistica',
        name: 'Logística',
        reports: [
          { id: 'r-yz-3', title: 'Funil Clínico - Queixas e Reabilitação', month: 'Fev/2026', type: 'Fisioterapia', status: 'Em geração' as ReportStatus },
        ],
      },
    ],
  },
  {
    id: 'c-toyota',
    company: 'Toyota 452',
    areas: [
      {
        id: 'a-rh',
        name: 'RH',
        reports: [
          { id: 'r-ty-1', title: 'Diagnóstico Psicossocial por Setor', month: 'Jan/2026', type: 'NR1 Psicossocial', status: 'Disponível' as ReportStatus },
        ],
      },
      {
        id: 'a-manutencao',
        name: 'Manutenção',
        reports: [
          { id: 'r-ty-2', title: 'Matriz de Risco Biomecânico', month: 'Fev/2026', type: 'Implantação', status: 'Disponível' as ReportStatus },
          { id: 'r-ty-3', title: 'Plano de Ação com Evidências', month: 'Fev/2026', type: 'Plano de Ação', status: 'Disponível' as ReportStatus },
        ],
      },
    ],
  },
  {
    id: 'c-usina',
    company: 'Usina Pilon',
    areas: [
      {
        id: 'a-operacao',
        name: 'Operação',
        reports: [
          { id: 'r-up-1', title: 'Participação em Ginástica Laboral', month: 'Fev/2026', type: 'Mensal', status: 'Disponível' as ReportStatus },
        ],
      },
    ],
  },
];

const Reports: React.FC = () => {
  const [filterType, setFilterType] = useState('Todos');
  const [docSearch, setDocSearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(COMPANY_REPORTS[0].id);
  const [selectedAreaId, setSelectedAreaId] = useState('all');
  const [reportSearch, setReportSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState<'Todos' | ReportStatus>('Todos');
  const [reportMonthFilter, setReportMonthFilter] = useState('Todos');
  const [reportGenerationMap, setReportGenerationMap] = useState<Record<string, { status: ReportStatus; generatedAt?: string }>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(REPORT_GENERATION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const { actions } = useAppData();
  const openActions = actions.filter(action => action.status !== ActionStatus.COMPLETED).length;

  useEffect(() => {
    localStorage.setItem(REPORT_GENERATION_STORAGE_KEY, JSON.stringify(reportGenerationMap));
  }, [reportGenerationMap]);

  const selectedCompany = COMPANY_REPORTS.find((company) => company.id === selectedCompanyId) || COMPANY_REPORTS[0];

  const getReportStatus = (report: { id: string; status: ReportStatus }): ReportStatus => {
    return reportGenerationMap[report.id]?.status || report.status;
  };

  const filteredCompanyReports = useMemo(() => {
    const areaFiltered = selectedCompany.areas.filter((area) => selectedAreaId === 'all' || area.id === selectedAreaId);
    const term = reportSearch.trim().toLowerCase();

    return areaFiltered
      .map((area) => ({
        ...area,
        reports: area.reports.filter((report) => {
          const status = getReportStatus(report);
          const matchesStatus = reportStatusFilter === 'Todos' || status === reportStatusFilter;
          const matchesMonth = reportMonthFilter === 'Todos' || report.month === reportMonthFilter;
          const matchesSearch = !term || report.title.toLowerCase().includes(term) || report.type.toLowerCase().includes(term) || report.month.toLowerCase().includes(term);
          return matchesSearch && matchesStatus && matchesMonth;
        }),
      }))
      .filter((area) => area.reports.length > 0);
  }, [selectedCompany, selectedAreaId, reportSearch, reportStatusFilter, reportMonthFilter, reportGenerationMap]);

  const reportStats = useMemo(() => {
    const allReports = COMPANY_REPORTS.flatMap(company => company.areas.flatMap(area => area.reports));
    const available = allReports.filter((report) => getReportStatus(report) === 'Disponível').length;
    const generating = allReports.filter((report) => getReportStatus(report) === 'Em geração').length;
    const failed = allReports.filter((report) => getReportStatus(report) === 'Erro').length;
    return { total: allReports.length, available, generating, failed };
  }, [reportGenerationMap]);

  const availableMonths = useMemo(() => ['Todos', ...Array.from(new Set(selectedCompany.areas.flatMap((area) => area.reports.map((report) => report.month))))], [selectedCompany]);

  const filteredDocs = useMemo(() => {
    const term = docSearch.trim().toLowerCase();
    return DOCS.filter((doc) => {
      const status = doc.status.toLowerCase();
      const matchesType = filterType === 'Todos'
        || (filterType === 'Válido' && status.includes('válido'))
        || (filterType === 'Vencido' && (status.includes('vencendo') || status.includes('vencido')))
        || (filterType === 'Em Aberto' && status.includes('aberto'));
      const matchesSearch = !term || doc.title.toLowerCase().includes(term) || doc.version.toLowerCase().includes(term) || (doc.hash || '').toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [filterType, docSearch]);

  const handleGenerateReport = (reportId: string) => {
    setReportGenerationMap((prev) => ({ ...prev, [reportId]: { status: 'Em geração' } }));
    window.setTimeout(() => {
      const fail = Math.random() < 0.15;
      setReportGenerationMap((prev) => ({
        ...prev,
        [reportId]: fail
          ? { status: 'Erro' }
          : { status: 'Disponível', generatedAt: new Date().toLocaleString('pt-BR') },
      }));
    }, 1200);
  };

  const handleGenerateArea = (reportIds: string[]) => {
    setReportGenerationMap((prev) => {
      const next = { ...prev };
      reportIds.forEach((id) => { next[id] = { status: 'Em geração' }; });
      return next;
    });

    window.setTimeout(() => {
      setReportGenerationMap((prev) => {
        const next = { ...prev };
        reportIds.forEach((id) => {
          next[id] = { status: 'Disponível', generatedAt: new Date().toLocaleString('pt-BR') };
        });
        return next;
      });
    }, 1500);
  };


  const handleGenerateCompany = () => {
    const reportIds = selectedCompany.areas.flatMap((area) => area.reports.map((report) => report.id));
    handleGenerateArea(reportIds);
  };

  const handleDownloadCompanyPackage = () => {
    const packageLines = filteredCompanyReports.flatMap((area) =>
      area.reports.map((report) => `${selectedCompany.company} | ${area.name} | ${report.title} | ${report.month} | ${report.type} | ${getReportStatus(report)}`),
    );
    const content = packageLines.length ? packageLines.join('\n') : 'Sem relatórios para os filtros aplicados.';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacote_${selectedCompany.company.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleDownloadReport = (report: { title: string; month: string; type: string }) => {
    const content = `Relatório: ${report.title}\nPeríodo: ${report.month}\nTipo: ${report.type}\nGerado em: ${new Date().toLocaleString('pt-BR')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Docs Oficiais', value: String(DOCS.filter((doc) => doc.isOfficial).length), icon: <FileSignature size={16} />, color: 'text-indigo-600' },
    { label: 'Relatórios por Empresa', value: String(COMPANY_REPORTS.length), icon: <Building2 size={16} />, color: 'text-violet-600' },
    { label: 'Prontos para Download', value: String(reportStats.available), icon: <CheckCircle2 size={16} />, color: 'text-emerald-600' },
    { label: 'Em Geração', value: String(reportStats.generating), icon: <Clock size={16} />, color: 'text-amber-600' },
    { label: 'Falhas de Geração', value: String(reportStats.failed), icon: <AlertCircle size={16} />, color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Central de Documentos e Relatórios</h2>
          <p className="text-slate-500 text-sm font-medium">Geração de relatórios por empresa e área, com download, prévia e status de geração.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary"><Share2 size={18} /> Compartilhar Kit</Button>
          <Button variant="primary"><Printer size={18} /> Imprimir Dossiê</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-slate-50 ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Factory size={18} className="text-indigo-600" /> Relatórios por Empresa e Área</h3>
          <p className="text-xs text-slate-500">Escolha a empresa (ex.: Yazaki), a área e gere/baixe os relatórios por contexto.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <aside className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            {COMPANY_REPORTS.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  setSelectedCompanyId(company.id);
                  setSelectedAreaId('all');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-semibold transition ${selectedCompanyId === company.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-100'}`}
              >
                {company.company}
              </button>
            ))}
          </aside>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <select value={selectedAreaId} onChange={(e) => setSelectedAreaId(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50">
                <option value="all">Áreas: todas</option>
                {selectedCompany.areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
              </select>
              <select value={reportStatusFilter} onChange={(e) => setReportStatusFilter(e.target.value as 'Todos' | ReportStatus)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50">
                <option value="Todos">Status: todos</option>
                <option value="Disponível">Status: disponível</option>
                <option value="Em geração">Status: em geração</option>
                <option value="Erro">Status: erro</option>
              </select>
              <select value={reportMonthFilter} onChange={(e) => setReportMonthFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50">
                {availableMonths.map((month) => <option key={month} value={month}>{`Mês: ${month}`}</option>)}
              </select>
              <div className="relative flex-1 min-w-[220px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={reportSearch} onChange={(e) => setReportSearch(e.target.value)} placeholder="Buscar relatório por nome, tipo ou mês" className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={handleGenerateCompany} className="text-[11px] font-black uppercase tracking-wider px-3 py-2 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 transition">
                <Sparkles size={12} className="inline mr-1" /> Gerar empresa
              </button>
              <button onClick={handleDownloadCompanyPackage} className="text-[11px] font-black uppercase tracking-wider px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition">
                <Download size={12} className="inline mr-1" /> Baixar pacote
              </button>
            </div>

            <div className="space-y-3">
              {filteredCompanyReports.map((area) => (
                <div key={area.id} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-black text-slate-700">{area.name}</p>
                    <button
                      onClick={() => handleGenerateArea(area.reports.map((report) => report.id))}
                      className="text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition"
                    >
                      <Sparkles size={12} className="inline mr-1" /> Gerar área
                    </button>
                  </div>
                  <div className="space-y-2">
                    {area.reports.map((report) => {
                      const status = getReportStatus(report);
                      const statusColor = status === 'Disponível'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : status === 'Em geração'
                          ? 'text-amber-700 bg-amber-50 border-amber-200'
                          : 'text-rose-700 bg-rose-50 border-rose-200';

                      return (
                        <div key={report.id} className="border border-slate-100 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{report.title}</p>
                            <p className="text-xs text-slate-500">{report.month} • {report.type}</p>
                            <p className={`inline-block mt-1 px-2 py-1 rounded-md border text-[11px] font-bold ${statusColor}`}>{status}</p>
                            {reportGenerationMap[report.id]?.generatedAt && (
                              <p className="text-[10px] text-slate-400 mt-1">Gerado em: {reportGenerationMap[report.id]?.generatedAt}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleGenerateReport(report.id)}>
                              <Sparkles size={14} /> Gerar
                            </Button>
                            {status === 'Erro' && (
                              <Button variant="secondary" onClick={() => handleGenerateReport(report.id)}>
                                <AlertCircle size={14} /> Tentar
                              </Button>
                            )}
                            <Button variant="primary" onClick={() => handleDownloadReport(report)} className={status !== 'Disponível' ? 'opacity-50 pointer-events-none' : ''}>
                              <Download size={14} /> Baixar
                            </Button>
                            <Button variant="secondary"><Eye size={14} /> Prévia</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!filteredCompanyReports.length && (
                <div className="p-4 border border-dashed border-slate-200 rounded-xl text-sm text-slate-500">Nenhum relatório encontrado para os filtros aplicados.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={docSearch} onChange={(e) => setDocSearch(e.target.value)} type="text" placeholder="Pesquisar por título, versão ou hash do documento..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            <option>Todos</option>
            <option>Válido</option>
            <option>Vencido</option>
            <option>Em Aberto</option>
          </select>
          <button onClick={() => { setFilterType('Todos'); setDocSearch(''); }} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-xl transition-all">
            <FilterX size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => {
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
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">{doc.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-500 uppercase">{doc.type}</span>
                        <div className="h-1 w-1 bg-slate-300 rounded-full" />
                        <span className="text-xs font-medium text-slate-400">v{doc.version}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 leading-tight">{doc.title}</h3>
                    </div>
                  </div>
                  {doc.isOfficial && <Lock size={16} className="text-slate-300" />}
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
                    <span className="font-medium text-slate-700 flex items-center gap-1 text-xs"><LayoutGrid size={12} className="text-indigo-400" /> {doc.scope}</span>
                  </div>
                </div>

                {doc.hash && (
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-xs font-mono text-slate-500 font-medium">{doc.hash}</span>
                    </div>
                    <button className="text-slate-300 hover:text-indigo-500 transition-colors"><Info size={14} /></button>
                  </div>
                )}
              </div>

              <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
                <Button variant="primary" className="flex-1"><Download size={16} /> Baixar</Button>
                <Button variant="secondary" className="flex-1"><Eye size={16} /> Prévia</Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg tracking-tight flex items-center gap-3"><History size={20} className="text-indigo-600" /> Trilha de Auditoria & Versionamento</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Log completo de modificações estruturais e geração de documentos.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {[
            { user: 'Dr. Roberto Santos', action: 'Geração do PGR v2.4 (Documento Oficial)', time: 'Hoje, 10:45', category: 'Documento', icon: <FileSignature size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { user: 'Ana Martins (RH)', action: 'Subiu evidência: Lista de Presença Treinamento Assédio', time: 'Hoje, 09:12', category: 'Evidência', icon: <CheckCircle2 size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { user: 'Sistema Automático', action: 'Gatilho de Reavaliação: Mudança estrutural Planta Norte', time: 'Ontem, 16:30', category: 'Risco', icon: <AlertCircle size={16} />, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((log, i) => (
            <div key={i} className="p-5 flex gap-4 hover:bg-slate-50/80 transition-all group">
              <div className={`w-10 h-10 rounded-xl ${log.bg} ${log.color} flex items-center justify-center shrink-0 shadow-sm`}>{log.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-slate-400">{log.category}</span>
                  <div className="h-1 w-1 bg-slate-300 rounded-full" />
                  <span className="text-xs font-medium text-slate-400">{log.time}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight">{log.action}</h4>
                <p className="text-xs text-slate-500 font-medium mt-2">{log.user}</p>
              </div>
              <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"><ChevronRight size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
