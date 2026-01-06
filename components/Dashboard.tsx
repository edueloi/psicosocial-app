
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
// Added Zap to the imports
import { Activity, AlertTriangle, CheckCircle2, Clock, Award, ShieldCheck, TrendingDown, DollarSign, Scale, Filter, Calendar, FileCheck, History, Info, ChevronDown, Zap } from 'lucide-react';

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Dashboard Top Navigation & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {vision === 'exec' ? 'Dashboard de Impacto e Governança' : 'Visão Geral Técnica NR-01'}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500 text-sm">
              {vision === 'exec' 
                ? 'Análise de ROI, risco jurídico e saúde organizacional.' 
                : 'Acompanhamento de inventário, controles e prazos.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
            <Filter size={14} className="text-slate-400" />
            <select className="text-xs font-bold text-slate-600 border-none bg-transparent outline-none focus:ring-0">
              <option>Todas as Unidades</option>
              <option>Planta Norte</option>
              <option>Escritório Central</option>
            </select>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
            <Calendar size={14} className="text-slate-400" />
            <select className="text-xs font-bold text-slate-600 border-none bg-transparent outline-none focus:ring-0">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
              <option>Sempre</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setIncludePsychosocial(true)}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${includePsychosocial ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              C/ Psicossocial
            </button>
            <button 
              onClick={() => setIncludePsychosocial(false)}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${!includePsychosocial ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              S/ Psicossocial
            </button>
          </div>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Maturity Score */}
        <div className="lg:col-span-4 bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Maturidade NR-01</p>
              <div className="group relative">
                <Info size={14} className="opacity-60 cursor-help" />
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Baseado em Inventário, Plano de Ação, Gestão Psicossocial e Evidências Documentais.
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">85</span>
              <span className="text-xl opacity-60">/100</span>
            </div>
            <p className="text-xs font-medium mt-2 text-indigo-100">Nível: <span className="font-bold">Maduro</span> • Crescimento de 12% vs mês anterior</p>
          </div>
          <div className="mt-6 flex items-center gap-2 relative z-10">
            <div className="flex -space-x-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-1.5 rounded-full bg-white/30 overflow-hidden">
                  <div className={`h-full bg-white ${i < 3 ? 'w-full' : 'w-1/2'}`}></div>
                </div>
              ))}
            </div>
          </div>
          <Award size={180} className="absolute -bottom-10 -right-10 text-white opacity-10 pointer-events-none rotate-12" />
        </div>

        {/* Readiness Detailed */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pronto para Auditoria</p>
                <p className="text-3xl font-black text-slate-800">95%</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-500 font-medium italic">Faltam <span className="text-indigo-600 font-bold">3 itens</span> para conformidade total (100%).</p>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-2">
                <div className="h-full bg-indigo-500 rounded-full w-[95%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-rose-200 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Última Revisão PGR</p>
                <p className="text-xl font-black text-slate-800">12/10/2023</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <FileCheck size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-tight">PGR Válido e Ativo</p>
              <span className="text-[10px] text-slate-400 ml-auto">Próx: 10/2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Items Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Riscos Críticos Abertos', value: '03', sub: 'Severidade Alta sem ação', icon: <AlertTriangle />, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Ações Vencidas', value: '02', sub: 'Prazos expirados hoje', icon: <Clock />, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Evidências Pendentes', value: '15', sub: 'Aguardando comprovação', icon: <History />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Último Evento NR-01', value: '09/04', sub: 'Reavaliação por Mudança', icon: <Activity />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all ${i < 2 && stat.value !== '00' ? 'border-rose-200' : ''}`}>
            <div className="flex items-center justify-between relative z-10">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="mt-4 relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate" title={stat.sub}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Evolutionary Charts */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {vision === 'exec' ? 'ROI: Prevenção vs Exposição Financeira' : 'Evolução de Execução do Plano'}
              </h3>
              <p className="text-xs text-slate-400">Desempenho consolidado das contramedidas de risco</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Concluídas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Abertas</span>
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
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Risco Legal Progressivo</h3>
            <p className="text-xs text-slate-400">Mitigação de exposição nos últimos 6 meses</p>
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
          <div className="mt-4 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>Status Atual</span>
              <span className="text-emerald-600">Blindagem Jurídica Ativa</span>
            </div>
            <p className="text-[10px] text-slate-500 italic">O sistema projeta uma redução de 80% em potenciais multas por NR-01 devido à gestão contínua e evidenciada.</p>
          </div>
        </div>
      </div>

      {/* Footer Alerts & Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-6">
          <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-200">
            <Zap size={28} />
          </div>
          <div className="flex-1">
            <h4 className="text-rose-900 font-bold mb-1">Gatilho de Reavaliação Pendente</h4>
            <p className="text-sm text-rose-700 leading-snug">Identificamos uma <span className="font-bold underline">mudança organizacional</span> (novas máquinas na Planta Norte) que exige reavaliação imediata de riscos para manter a conformidade legal.</p>
          </div>
          <button className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition-all shadow-md">
            Tratar Agora
          </button>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={18} className="text-indigo-600" />
            <h4 className="font-bold text-slate-800 text-sm">Resumo de Auditoria</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Documentos</span>
              <span className="text-emerald-600 font-bold">100% OK</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Evidências</span>
              <span className="text-amber-500 font-bold">85% OK</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">RT Assinatura</span>
              <span className="text-emerald-600 font-bold">Ativa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
