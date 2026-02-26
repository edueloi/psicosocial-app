
import React, { useState } from 'react';
import { 
  ShieldCheck, AlertCircle, CheckCircle2, XCircle, Printer, Eye, 
  PenTool, Info, Filter, Calendar, LayoutGrid, FileText, 
  ArrowRight, ShieldAlert, History, Lock, Unlock, Hash, AlertTriangle
} from 'lucide-react';
import { useAppData } from '../appData';
import { ActionStatus } from '../types';
import Button from './Button';

const AuditReadiness: React.FC = () => {
  const [isAuditorMode, setIsAuditorMode] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('Todas as Unidades');
  const { actions } = useAppData();
  const overdueActions = actions.filter(action => new Date(action.dueDate) < new Date() && action.status !== ActionStatus.COMPLETED).length;
  const missingEvidence = actions.filter(action => action.evidenceCount === 0 && action.status !== ActionStatus.COMPLETED).length;
  const actionStatus = overdueActions > 0 || missingEvidence > 0 ? 'warning' : 'ready';
  
  const referenceDate = new Date().toLocaleString('pt-BR');

  const checklist = [
    { 
      id: 1, 
      title: 'Inventário de Riscos Atualizado', 
      status: 'ready', 
      desc: 'Última revisão em 12/10/2023',
      nextStep: 'Monitorar gatilhos de mudança organizacional.',
      category: 'Riscos'
    },
    { 
      id: 2, 
      title: 'Plano de Ação em Execução', 
      status: actionStatus, 
      desc: '2 ações críticas pendentes de evidência técnica.',
      nextStep: 'Anexar evidencias e revisar prazos.',
      category: 'Ações',
      justification: 'Atraso no fornecimento de EPIs específicos pelo fornecedor homologado.'
    },
    { 
      id: 3, 
      title: 'Avaliação Psicossocial (NR-01)', 
      status: 'ready', 
      desc: 'Relatório anual consolidado e auditado.',
      nextStep: 'Aplicar pesquisa de pulso no próximo trimestre.',
      category: 'Psicossocial'
    },
    { 
      id: 4, 
      title: 'Treinamentos de NR em Dia', 
      status: 'ready', 
      desc: '95% de adesão. Certificados assinados digitalmente.',
      nextStep: 'Reciclagem agendada para Setor de Pintura.',
      category: 'Capacitação'
    },
    { 
      id: 5, 
      title: 'Gestão de Relatos e Canal de Escuta', 
      status: 'error', 
      desc: 'Sem apuração de incidentes nos últimos 30 dias.',
      nextStep: 'Revisar fluxo de análise da CIPA/RH.',
      category: 'Canais',
      justification: 'Fluxo em revisão pela diretoria para inclusão de comitê de ética externo.'
    },
  ];

  return (
    <div className={`space-y-8 pb-20 transition-all duration-500 ${isAuditorMode ? 'bg-slate-100 p-8 rounded-[40px] ring-8 ring-indigo-500/10' : ''}`}>
      {/* Header with Reference Data & Auditor Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Status para Fiscalização</h2>
            {isAuditorMode && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-lg shadow-lg animate-pulse">
                <Lock size={12} /> Modo Auditor Ativo
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-500" />
              Status referente a: <span className="text-slate-800">{referenceDate}</span>
            </p>
            <div className="h-3 w-px bg-slate-300 hidden sm:block"></div>
            <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-indigo-500" />
              Escopo: <span className="text-slate-800 uppercase">NR-01 | PGR | Psicossocial | Plano de Ação</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex items-center shadow-sm">
             <button 
              onClick={() => setIsAuditorMode(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${!isAuditorMode ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}
             >
               Edição
             </button>
             <button 
              onClick={() => setIsAuditorMode(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${isAuditorMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
             >
               Auditoria
             </button>
          </div>
          <Button variant="secondary">
            <Printer size={16} /> Imprimir Dossiê
          </Button>
        </div>
      </div>

      {/* Global Dashboard Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
            <Filter size={14} /> Filtro Visual:
          </div>
          <select 
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option>Todas as Unidades</option>
            <option>Planta Norte</option>
            <option>Escritório Central</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
           <Hash size={14} className="text-slate-400" />
           <span className="text-xs font-mono text-slate-500">ID Sessão: 0XF-492B-NR01</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Metrics & RT */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Risk Score Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase">Risco Legal Consolidado</p>
                <div className="group/info relative">
                  <Info size={14} className="text-slate-300 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-slate-900 text-white text-xs p-4 rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                    <p className="font-bold text-indigo-400 mb-1 uppercase">Critérios do Score:</p>
                    <ul className="space-y-1 opacity-80 list-disc list-inside">
                      <li>Inventário (25%)</li>
                      <li>Plano de Ação (30%)</li>
                      <li>Evidências (25%)</li>
                      <li>Gestão Psicossocial (20%)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative inline-block mb-5">
                <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center bg-white shadow-inner">
                  <span className="text-3xl font-black text-emerald-500">92%</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center border-4 border-white shadow-xl">
                  <ShieldCheck size={20} />
                </div>
              </div>
              
              <h3 className="text-lg font-black text-slate-800 uppercase">Status: Blindado</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium px-4">
                Sua empresa atende aos requisitos técnicos para uma fiscalização sem interdições ou multas graves.
              </p>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          </div>

          {/* Critical Pendencies Card */}
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                  <ShieldAlert size={20} />
               </div>
               <div>
                  <h4 className="font-black text-rose-900 text-sm uppercase">Pendências Críticas</h4>
                  <p className="text-xs text-rose-700 font-medium">Impedem 100% de Conformidade</p>
               </div>
            </div>
            <div className="space-y-2">
              <div className="bg-white/60 p-3 rounded-xl flex items-center justify-between border border-rose-200">
                 <span className="text-sm font-medium text-rose-900">Evidência Manutenção</span>
                 <ArrowRight size={14} className="text-rose-400" />
              </div>
              <div className="bg-white/60 p-3 rounded-xl flex items-center justify-between border border-rose-200">
                 <span className="text-sm font-medium text-rose-900">Análise de Relatos Setoriais</span>
                 <ArrowRight size={14} className="text-rose-400" />
              </div>
            </div>
          </div>

          {/* RT Signature Block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-4">Responsável Técnico (RT)</p>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <PenTool size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base">Dr. Roberto Santos</h4>
                <p className="text-xs text-slate-500 font-medium uppercase">CRM/SST 12345-SP</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase flex items-center gap-2 border border-emerald-100 shadow-sm">
              <ShieldCheck size={16} className="shrink-0" /> Assinatura Digital Ativa
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Checklist */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 text-lg uppercase">Checklist de Prontidão NR-01</h3>
                <p className="text-sm text-slate-400 font-medium">Verificação detalhada de obrigações legais e técnicas.</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 shadow-sm">PGR Válido (v2.4)</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {checklist.map((item) => (
                <div key={item.id} className="p-6 flex flex-col gap-5 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 mt-1">
                      {item.status === 'ready' && <CheckCircle2 className="text-emerald-500" size={24} />}
                      {/* Fixed: AlertTriangle is now correctly imported */}
                      {item.status === 'warning' && <AlertTriangle className="text-amber-500" size={24} />}
                      {item.status === 'error' && <XCircle className="text-rose-500" size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-500 uppercase">{item.category}</span>
                        <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-400">Atualizado: 12/10/2023</span>
                      </div>
                      <h4 className="font-black text-slate-800 text-base mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    {!isAuditorMode && (
                      <Button variant="ghost" size="sm">
                        Ver Evidências
                      </Button>
                    )}
                  </div>

                  {/* Contextual Insights for Legal Defense */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-14">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <ArrowRight size={12} className="text-indigo-400" /> Próxima Ação Recomendada
                      </p>
                      <p className="text-xs font-bold text-slate-700">{item.nextStep}</p>
                    </div>
                    
                    {item.justification && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <History size={12} className="text-amber-400" /> Justificativa de Não-Conformidade
                        </p>
                        <p className="text-xs font-bold text-amber-800 italic leading-snug">"{item.justification}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History / Past Audits */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <History size={18} className="text-slate-400" /> Histórico de Fiscalizações Anteriores
              </h3>
              <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Ver Histórico Completo</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                    <FileText size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Auditoria MTE (Routine)</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">15 de Março de 2023</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Sem Autuação</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReadiness;



