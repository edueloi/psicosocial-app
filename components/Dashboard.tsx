
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, Clock, Award, ShieldCheck, TrendingDown, DollarSign, Scale, Filter, Calendar, FileCheck, History, Info, ChevronDown, Zap, TrendingUp } from 'lucide-react';
import { useAppData } from '../appData';
import { ActionStatus } from '../types';
import Button from './Button';

interface DashboardProps {
  vision?: 'tech' | 'exec';
}

const riskData = [
  { name: 'Físico', value: 12 },
  { name: 'Ergonômico', value: 19 },
  { name: 'Químico', value: 5 },
  { name: 'Psicossocial', value: 24 },
  { name: 'Biológico', value: 3 },
];

const actionData = [
  { name: 'Jan', concluido: 40, pendente: 24 },
  { name: 'Fev', concluido: 30, pendente: 13 },
  { name: 'Mar', concluido: 50, pendente: 98 },
  { name: 'Abr', concluido: 67, pendente: 39 },
  { name: 'Mai', concluido: 88, pendente: 28 },
  { name: 'Jun', concluido: 93, pendente: 18 },
];

const legalRiskHistory = [
  { name: 'Jan', score: 85 },
  { name: 'Fev', score: 72 },
  { name: 'Mar', score: 68 },
  { name: 'Abr', score: 45 },
  { name: 'Mai', score: 32 },
  { name: 'Jun', score: 18 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ vision = 'tech' }) => {
  const [includePsychosocial, setIncludePsychosocial] = useState(true);
  const { actions } = useAppData();
  const overdueCount = actions.filter(a => new Date(a.dueDate) < new Date() && a.status !== ActionStatus.COMPLETED).length;
  const pendingEvidence = actions.filter(a => a.evidenceCount === 0 && a.status !== ActionStatus.COMPLETED).length;
  const criticalOpen = actions.filter(a => a.riskLevel === 'CrÃ­tico' && a.status !== ActionStatus.COMPLETED).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Dashboard Top Navigation & Filters */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {vision === 'exec' ? 'Dashboard de Impacto e Governança' : 'Visão Geral Técnica NR-01'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {vision === 'exec' 
              ? 'Análise de ROI, risco jurídico e saúde organizacional' 
              : 'Acompanhamento de inventário, controles e prazos'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm hover:border-slate-300 transition-colors">
            <Filter size={16} className="text-slate-400" />
            <select className="text-xs font-semibold text-slate-700 border-none bg-transparent outline-none focus:ring-0 cursor-pointer">
              <option>Todas as Unidades</option>
              <option>Planta Norte</option>
              <option>Escritório Central</option>
            </select>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm hover:border-slate-300 transition-colors">
            <Calendar size={16} className="text-slate-400" />
            <select className="text-xs font-semibold text-slate-700 border-none bg-transparent outline-none focus:ring-0 cursor-pointer">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
              <option>Sempre</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setIncludePsychosocial(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                includePsychosocial 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              C/ Psicossocial
            </button>
            <button 
              onClick={() => setIncludePsychosocial(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !includePsychosocial 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              S/ Psicossocial
            </button>
          </div>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Maturity Score */}
        <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider opacity-90">Maturidade NR-01</p>
              <div className="group relative">
                <Info size={16} className="opacity-70 cursor-help hover:opacity-100 transition-opacity" />
                <div className="absolute right-0 bottom-full mb-2 w-56 bg-slate-900 text-white text-xs p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                  Baseado em Inventário, Plano de Ação, Gestão Psicossocial e Evidências Documentais
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-black">85</span>
              <span className="text-2xl opacity-60">/100</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp size={14} />
              <p className="text-xs font-semibold">Nível: Maduro • +12% vs mês anterior</p>
            </div>
          </div>
          <div className="mt-6 flex gap-1 relative z-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className={`h-full bg-white rounded-full transition-all ${i < 3 ? 'w-full' : 'w-1/2'}`}></div>
              </div>
            ))}
          </div>
          <Award size={160} className="absolute -bottom-8 -right-8 text-white opacity-[0.07] pointer-events-none" />
        </div>

        {/* Readiness Detailed */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Pronto para Auditoria</p>
                <p className="text-3xl font-black text-slate-900">95%</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium mb-2">Faltam <span className="text-indigo-600 font-bold">3 itens</span> para conformidade total</p>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full w-[95%] transition-all"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Última Revisão PGR</p>
                <p className="text-3xl font-black text-slate-900">12/10/2023</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <FileCheck size={22} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm font-semibold text-emerald-600">PGR Válido e Ativo</p>
              <span className="text-xs text-slate-400 ml-auto font-medium">Próx: 10/2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Items Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Riscos Críticos Abertos', value: '03', sub: 'Severidade Alta sem ação', icon: <AlertTriangle />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
          { label: 'Ações Vencidas', value: '02', sub: 'Prazos expirados hoje', icon: <Clock />, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
          { label: 'Evidências Pendentes', value: '15', sub: 'Aguardando comprovação', icon: <History />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Último Evento NR-01', value: '09/04', sub: 'Reavaliação por Mudança', icon: <Activity />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-5 rounded-2xl border ${i < 2 && stat.value !== '00' ? stat.border : 'border-slate-200'} shadow-sm hover:shadow-md transition-all group cursor-pointer`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon, { size: 20, strokeWidth: 2.5 })}
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-xs text-slate-600 font-medium" title={stat.sub}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Evolutionary Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {vision === 'exec' ? 'ROI: Prevenção vs Exposição Financeira' : 'Evolução de Execução do Plano'}
              </h3>
              <p className="text-sm text-slate-500">Desempenho consolidado das contramedidas de risco</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-semibold text-slate-600">Concluídas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-xs font-semibold text-slate-600">Abertas</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={actionData}>
                <defs>
                  <linearGradient id="colorConc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="concluido" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorConc)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                <Area type="monotone" dataKey="pendente" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legal Risk / Mitigation Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Risco Legal Progressivo</h3>
            <p className="text-sm text-slate-500">Mitigação de exposição nos últimos 6 meses</p>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={legalRiskHistory}>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Line type="step" dataKey="score" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} label={{ position: 'top', fontSize: 10, fill: '#ef4444', fontWeight: 'bold' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <span className="text-slate-600">Status Atual</span>
              <span className="text-emerald-600">Blindagem Jurídica Ativa</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">O sistema projeta uma redução de 80% em potenciais multas por NR-01 devido à gestão contínua e evidenciada</p>
          </div>
        </div>
      </div>

      {/* Footer Alerts & Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-rose-50 border border-rose-200 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <Zap size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="text-rose-900 font-bold mb-1.5 text-base">Gatilho de Reavaliação Pendente</h4>
            <p className="text-sm text-rose-700 leading-relaxed">Identificamos uma <span className="font-bold">mudança organizacional</span> (novas máquinas na Planta Norte) que exige reavaliação imediata de riscos para manter a conformidade legal</p>
          </div>
          <Button 
            variant="danger" 
            size="md"
            className="shrink-0 whitespace-nowrap"
          >
            Tratar Agora
          </Button>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} className="text-indigo-600" strokeWidth={2.5} />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Resumo de Auditoria</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Documentos</span>
              <span className="text-emerald-600 font-bold">100% OK</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Evidências</span>
              <span className="text-amber-500 font-bold">85% OK</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">RT Assinatura</span>
              <span className="text-emerald-600 font-bold">Ativa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



