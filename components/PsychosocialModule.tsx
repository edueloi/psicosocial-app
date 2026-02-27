
import React, { useState } from 'react';
import { 
  BrainCircuit, MessageSquare, ShieldCheck, TrendingUp, TrendingDown, 
  Users, AlertTriangle, ChevronRight, CheckCircle2, Info, Filter, 
  Search, Calendar, LayoutGrid, Zap, History, X, Plus, AlertCircle, Clock
} from 'lucide-react';
import { IncidentStatus, ActionStatus, ActionType, RiskType } from '../types';
import { useAppData } from '../appData';
import Button from './Button';

interface PsychosocialProps {
  vision?: 'tech' | 'exec';
}

const PsychosocialModule: React.FC<PsychosocialProps> = ({ vision = 'tech' }) => {
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const { addAction, navigate } = useAppData();

  const handleLinkToPgr = () => {
    addAction({
      id: `a-${Date.now()}`,
      title: 'Reestruturação de Metas e Jornada',
      responsible: 'RH / SST',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: ActionStatus.PENDING,
      desc: 'Plano sugerido pelo modulo psicossocial.',
      riskId: 'r2',
      riskName: 'Carga Mental Elevada',
      riskCategory: RiskType.PSYCHOSOCIAL,
      riskLevel: 'Crítico',
      actionType: ActionType.PSYCHOSOCIAL,
      expectedImpact: 'Redução de stress e absenteismo',
      evidenceCount: 0
    });
    navigate('actions');
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return { label: 'Crítico', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    if (score >= 60) return { label: 'Alto', color: 'bg-rose-50 text-rose-600 border-rose-100' };
    if (score >= 40) return { label: 'Moderado', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Baixo', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch(status) {
      case IncidentStatus.RECEIVED: return 'bg-slate-100 text-slate-600';
      case IncidentStatus.IN_ANALYSIS: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case IncidentStatus.ACTION_CREATED: return 'bg-amber-50 text-amber-600 border-amber-100';
      case IncidentStatus.CLOSED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500';
    }
  };


  const embryoQuestions = [
    { id: 'q1', question: 'Você sentiu ansiedade nesta semana?', type: 'boolean', sensitivity: 'Baixa' },
    { id: 'q2', question: 'Está em acompanhamento terapêutico?', type: 'boolean', sensitivity: 'Média' },
    { id: 'q3', question: 'Como está sua carga mental de trabalho?', type: 'likert', sensitivity: 'Baixa' },
    { id: 'q4', question: 'Você percebe suporte da liderança imediata?', type: 'likert', sensitivity: 'Baixa' },
  ];

  const coffeeRitual = {
    cadence: 'Quinta-feira às 10h',
    participants: 'Advogada + Psicóloga + SST + RH',
    objective: 'Definir o que pode/não pode no questionário NR1 sem gerar passivo trabalhista',
  };

  const pilotSnapshot = [
    { label: 'Vidas no piloto (Usina)', value: '1.000', note: 'Base inicial para o embrião NR1' },
    { label: 'Perguntas seguras aprovadas', value: '12', note: 'Revisadas no café técnico' },
    { label: 'Triagens com sinal de atenção', value: '118', note: 'Encaminhamento preventivo' },
    { label: 'Planos de ação abertos', value: '27', note: 'Vinculados ao PGR psicossocial' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestão de Riscos Psicossociais</h2>
          <p className="text-slate-500 text-sm font-medium italic">Diagnóstico e intervenção preventiva baseada na NR-01.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="danger"
            onClick={() => setShowIncidentModal(true)}
          >
            <AlertCircle size={16} />
            Relatar Incidente
          </Button>
          <Button 
            variant="primary"
            onClick={() => setShowSurveyModal(true)}
          >
            <Plus size={16} />
            Nova Pesquisa
          </Button>
        </div>
      </div>

      {/* Global Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrar por setor ou unidade..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            <option>Unidade</option>
            <option>Planta Norte</option>
            <option>Escritório Central</option>
          </select>
          <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            <option>Período: 2024</option>
            <option>Período: 2023</option>
          </select>
          <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none">
            <option>Fonte: Todas</option>
            <option>Pesquisas</option>
            <option>Relatos</option>
            <option>Indicadores</option>
          </select>
        </div>
      </div>

      {/* Hero Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap/Risk Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                Mapa de Risco Psicossocial por Setor
                <div className="group relative">
                  <Info size={14} className="text-slate-300 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-900 text-white text-xs p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                    Baseado em: Pesquisa Psicossocial (Likert), Volume de Relatos, Taxas de Absenteísmo e Turnover. Classificação conforme matriz de risco NR-01.
                  </div>
                </div>
              </h3>
              <p className="text-xs text-slate-400 font-medium">Classificação técnica de exposição organizacional</p>
            </div>
            <div className="flex gap-2">
               <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase rounded-lg border border-rose-100">02 Setores em Atenção</span>
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            {[
              { label: 'Setor Comercial', score: 85, source: 'Pesquisa + Relatos', trend: 'up' },
              { label: 'Produção Industrial', score: 62, source: 'Indicadores', trend: 'down' },
              { label: 'Logística', score: 45, source: 'Pesquisa', trend: 'stable' },
              { label: 'Administrativo', score: 18, source: 'Pesquisa', trend: 'down' },
            ].map((sector, i) => {
              const risk = getRiskLabel(sector.score);
              return (
                <div key={i} className="space-y-2 group/row">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm font-black text-slate-800">{sector.label}</span>
                      <p className="text-xs text-slate-400 font-medium">Fonte: {sector.source}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border mb-1 inline-block ${risk.color}`}>
                        {risk.label}
                      </span>
                      <div className="flex items-center gap-2 justify-end">
                        {sector.trend === 'up' && <TrendingUp size={12} className="text-rose-500" />}
                        {sector.trend === 'down' && <TrendingDown size={12} className="text-emerald-500" />}
                        <span className="font-black text-slate-800 text-base">{sector.score}<span className="text-slate-300 text-xs">/100</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        sector.score >= 80 ? 'bg-rose-600' : sector.score >= 60 ? 'bg-rose-400' : sector.score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${sector.score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-black text-slate-800">4.2</p>
                <TrendingUp size={14} className="text-rose-500" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">Absenteísmo (%)</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-black text-emerald-500">82%</p>
                <TrendingUp size={14} className="text-emerald-500" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">Engajamento</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-black text-rose-500">12%</p>
                <TrendingDown size={14} className="text-rose-500" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">Rotatividade</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-black text-indigo-500">15</p>
                <span className="text-xs font-medium text-slate-400">+3</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">Ações PGR Ativas</p>
            </div>
          </div>
        </div>

        {/* Incident Center */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 uppercase">
              <MessageSquare size={16} className="text-indigo-600" />
              Relatos e Incidentes
            </h3>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full shadow-sm">02 Críticos</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {[
              { id: 'rel-1', type: 'Sobrecarga de Trabalho', date: 'Hoje', status: IncidentStatus.IN_ANALYSIS, sector: 'Comercial', urgent: true },
              { id: 'rel-2', type: 'Conflito Interpessoal', date: 'Ontem', status: IncidentStatus.ACTION_CREATED, sector: 'Logística', urgent: false },
              { id: 'rel-3', type: 'Assédio Moral (Relato)', date: '3 dias atrás', status: IncidentStatus.IN_ANALYSIS, sector: 'Produção', urgent: true },
              { id: 'rel-4', type: 'Feedback de Clima Negativo', date: 'Semana passada', status: IncidentStatus.CLOSED, sector: 'RH', urgent: false },
            ].map((rel, i) => (
              <div key={i} className="p-5 border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer group relative">
                {rel.urgent && <div className="absolute left-0 top-5 bottom-5 w-1 bg-rose-500 rounded-r"></div>}
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusBadge(rel.status)}`}>
                    {rel.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{rel.date}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{rel.type}</h4>
                <p className="text-xs text-slate-500 font-medium mb-3">Setor: {rel.sector}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-xs font-bold text-slate-500">RT</div>
                  </div>
                  <button className="text-xs font-bold text-indigo-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Analisar <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="p-4 text-center text-xs font-bold text-indigo-600 uppercase hover:bg-indigo-50 transition-colors border-t border-slate-100">
            Gerenciar Todos os Incidentes
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Embrião NR1: Questionário Seguro e Progressivo</h3>
              <p className="text-xs text-slate-500">Começar simples para mapear risco psicossocial sem aprofundamento jurídico sensível.</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
              Estratégia: mapeamento leve
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {embryoQuestions.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-800">{item.question}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">Tipo: {item.type}</span>
                  <span className={`px-2 py-1 rounded-lg border ${item.sensitivity === 'Média' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    Sensibilidade: {item.sensitivity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl border border-indigo-200 bg-indigo-50">
            <p className="text-xs font-black uppercase tracking-wider text-indigo-700">Ritual de governança do conteúdo</p>
            <p className="text-xs text-indigo-900 mt-1"><span className="font-semibold">Cadência:</span> {coffeeRitual.cadence}</p>
            <p className="text-xs text-indigo-900"><span className="font-semibold">Participantes:</span> {coffeeRitual.participants}</p>
            <p className="text-xs text-indigo-900"><span className="font-semibold">Objetivo:</span> {coffeeRitual.objective}</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-black text-slate-800 text-base mb-4">Snapshot do Piloto Psicossocial</h3>
          <div className="space-y-2">
            {pilotSnapshot.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 p-2.5">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-xl font-black text-slate-800">{item.value}</p>
                <p className="text-[11px] text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Intervention Trails & Blindagem */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              Intervenções Sugeridas (Compliance NR-01)
            </h3>
            <p className="text-xs text-slate-400 font-medium italic">Sugestões automatizadas para suporte à decisão do responsável técnico.</p>
          </div>
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-xl border border-indigo-100 flex items-center gap-2">
            <Zap size={14} /> Ativação em 1 Clique
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase rounded-lg shadow-sm">Urgência: Alta</span>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Hotspot: Setor Comercial</p>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">Reestruturação de Metas e Jornada</h4>
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 font-medium">Implantar política de desconexão fora do horário</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 font-medium">Revisão do escalonamento de metas (Modelo Likert)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 font-medium">Workshop de Gestão de Conflitos para Líderes</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleLinkToPgr}
                className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Vincular ao PGR
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase rounded-lg shadow-sm">Prevenção</span>
               <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Alerta: Liderança Produção</p>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">Programa de Apoio Psicológico</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
              Detectamos que 40% dos colaboradores da produção sentem baixo suporte da liderança. Sugerimos trilha de escuta ativa e canal de suporte individual.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                Agendar Treinamento
              </button>
              <button className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                Ver Laudo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Modal Placeholder */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BrainCircuit size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Nova Pesquisa Psicossocial</h3>
              </div>
              <button onClick={() => setShowSurveyModal(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Tipo de Avaliação</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none">
                    <option>Diagnóstico de Clima Organizacional</option>
                    <option>Avaliação de Carga Mental de Trabalho</option>
                    <option>Pesquisa de Qualidade de Liderança</option>
                    <option>Triagem de Riscos de Assédio</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Unidades/Setores Alvo</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none">
                    <option>Toda a Empresa</option>
                    <option>Planta Norte - Somente Produção</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <ShieldCheck size={20} className="text-indigo-600 shrink-0" />
                  <p className="text-[10px] text-indigo-900 font-bold uppercase leading-relaxed">
                    Pesquisa será realizada de forma <span className="underline">Totalmente Anônima</span> conforme diretrizes de ética e LGPD.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowSurveyModal(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowSurveyModal(false)}
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
                >
                  Iniciar Coleta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incident Modal Placeholder */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertCircle size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Registro de Incidente</h3>
              </div>
              <button onClick={() => setShowIncidentModal(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Natureza do Relato</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none">
                    <option>Sobrecarga de Trabalho / Stress</option>
                    <option>Conflito Interpessoal / Gestão</option>
                    <option>Indício de Assédio Moral</option>
                    <option>Esgotamento (Near Burnout)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Setor Afetado</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none">
                    <option>Comercial</option>
                    <option>Logística</option>
                    <option>Produção</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Fatos Observados</label>
                  <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none h-24 resize-none" placeholder="Relato técnico dos fatos..." />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowIncidentModal(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowIncidentModal(false)}
                  className="flex-1 px-8 py-4 bg-rose-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all"
                >
                  Registrar Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychosocialModule;


