
import React from 'react';
/* Added CheckCircle2 to the imports from lucide-react */
import { BrainCircuit, MessageSquare, ShieldCheck, TrendingUp, Users, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

const PsychosocialModule: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-200 border border-indigo-500/50 mb-4 inline-block">
            Módulo Exclusivo NR-01
          </span>
          <h2 className="text-3xl font-bold mb-4">Gestão de Riscos Psicossociais</h2>
          <p className="text-indigo-100 text-lg opacity-90 leading-relaxed">
            Identifique hotspots emocionais e intervenha preventivamente para reduzir absenteísmo e passivos jurídicos.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
              Aplicar Nova Pesquisa
            </button>
            <button className="px-6 py-3 bg-indigo-800 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors border border-indigo-700">
              Heatmap por Setor
            </button>
          </div>
        </div>
        <BrainCircuit size={300} className="absolute top-1/2 -right-20 -translate-y-1/2 text-white/5 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap/Stats Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Mapa de Risco Emocional (Heatmap)</h3>
            <span className="text-xs text-slate-400 italic">Atualizado hoje às 09:00</span>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Setor Comercial', risk: 85, trend: '+12%', color: 'bg-rose-500' },
              { label: 'Produção Industrial', risk: 42, trend: '-5%', color: 'bg-amber-500' },
              { label: 'Administrativo', risk: 18, trend: 'Estável', color: 'bg-emerald-500' },
              { label: 'Logística', risk: 65, trend: '+2%', color: 'bg-rose-400' },
            ].map((sector, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700">{sector.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{sector.trend}</span>
                    <span className="font-black text-slate-800">{sector.risk}/100</span>
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${sector.color} transition-all duration-1000`} style={{ width: `${sector.risk}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-slate-800">4.2</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Absenteísmo</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-500">82%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Engajamento</p>
            </div>
            <div>
              <p className="text-2xl font-black text-rose-500">12%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Rotatividade</p>
            </div>
            <div>
              <p className="text-2xl font-black text-indigo-500">15</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Ações de Bem-estar</p>
            </div>
          </div>
        </div>

        {/* Incident Center */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-600" />
              Central de Incidentes
            </h3>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full">2 NOVOS</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {[
              { id: 'rel-1', type: 'Sobrecarga', date: 'Hoje', urgency: 'Alta', status: 'Em Análise' },
              { id: 'rel-2', type: 'Conflito Liderança', date: 'Ontem', urgency: 'Média', status: 'Ação Criada' },
              { id: 'rel-3', type: 'Assédio (Relato)', date: '3 dias atrás', urgency: 'Crítica', status: 'Em Apuração' },
            ].map((rel, i) => (
              <div key={i} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    rel.urgency === 'Crítica' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {rel.urgency}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{rel.date}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{rel.type}</h4>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-500 font-medium">{rel.status}</span>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
          <button className="p-4 text-center text-xs font-bold text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-colors border-t border-slate-100">
            Gerenciar Todos os Relatos
          </button>
        </div>
      </div>

      {/* Intervention Trails */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-500" />
          Trilhas de Intervenção Sugeridas pelo Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
            <p className="text-xs font-black text-indigo-500 uppercase mb-2">Sugestão p/ Setor Comercial</p>
            <h4 className="font-bold text-slate-800 mb-4">Ajuste de Fluxo de Trabalho e Metas</h4>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Workshop de Resiliência</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Revisão do limite de jornada</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Canal de feedback anônimo</li>
            </ul>
            <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
              Ativar Plano de Ação
            </button>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-black text-rose-500 uppercase mb-2">Alerta Preventivo</p>
            <h4 className="font-bold text-slate-800 mb-4">Treinamento de Gestão Emocional para Líderes</h4>
            <p className="text-sm text-slate-500 mb-6">Identificamos que 40% dos relatos do setor industrial mencionam falta de apoio da supervisão imediata.</p>
            <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
              Agendar Treinamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychosocialModule;
