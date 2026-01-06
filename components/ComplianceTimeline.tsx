
import React from 'react';
import { Calendar, Shield, Users, Zap, BrainCircuit, FileText, CheckCircle2, Search } from 'lucide-react';

const ComplianceTimeline: React.FC = () => {
  const events = [
    { date: '2024-04-10', title: 'Reavaliação de Riscos (Gestão de Mudança)', desc: 'Unidade Norte: Troca de maquinário no setor de produção disparou gatilho de revisão do PGR conforme NR-01.', icon: <Zap className="text-rose-500" />, bg: 'bg-rose-50', evidence: true },
    { date: '2024-03-25', title: 'Consolidação de Diagnóstico Psicossocial', desc: 'Conclusão da pesquisa trimestral. Score de clima em 82/100. Identificado hotspot no Comercial.', icon: <BrainCircuit className="text-indigo-500" />, bg: 'bg-indigo-50', evidence: true },
    { date: '2024-03-12', title: 'Treinamento de Liderança: Assédio', desc: 'Concluído por 95% dos gestores das unidades Administrativas. Lista de presença assinada digitalmente.', icon: <Users className="text-emerald-500" />, bg: 'bg-emerald-50', evidence: true },
    { date: '2024-02-15', title: 'Assinatura Digital PGR v2.4', desc: 'PGR revisado e assinado eletronicamente pelo responsável técnico Dr. Roberto Santos.', icon: <FileText className="text-slate-500" />, bg: 'bg-slate-50', evidence: true },
    { date: '2024-01-05', title: 'Identificação de Novos Riscos Ergonômicos', desc: 'Auditoria interna identificou falhas em 12 postos de trabalho. Plano de ação corretiva gerado.', icon: <Shield className="text-amber-500" />, bg: 'bg-amber-50', evidence: true },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Timeline de Conformidade</h2>
          <p className="text-slate-500 text-sm">Histórico narrativo e prova documental de gestão contínua NR-01.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 shadow-sm shadow-emerald-100">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Rastreabilidade 100%</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input type="text" placeholder="Pesquisar evento no histórico jurídico..." className="bg-transparent border-none outline-none text-xs w-full" />
      </div>

      <div className="relative space-y-12">
        {/* The vertical timeline line */}
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-200 via-slate-200 to-transparent"></div>

        {events.map((event, idx) => (
          <div key={idx} className="relative pl-20 group">
            <div className={`absolute left-4 top-2 w-8 h-8 rounded-xl ${event.bg} flex items-center justify-center border-4 border-white shadow-md z-10 group-hover:scale-110 transition-transform`}>
              {event.icon}
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 bg-indigo-50 px-2 py-0.5 rounded-md">
                  <Calendar size={12} />
                  {new Date(event.date).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase border border-slate-100">Auditado v2.4</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight">{event.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{event.desc}</p>
              
              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center gap-1.5">
                    <FileText size={12} />
                    Ver Evidência
                  </button>
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                    Log de Segurança
                  </button>
                </div>
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-indigo-600">RS</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-emerald-600">RT</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
          Carregar Histórico Completo (2023)
        </button>
      </div>
    </div>
  );
};

export default ComplianceTimeline;
