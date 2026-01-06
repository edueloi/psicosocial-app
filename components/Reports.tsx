
import React from 'react';
import { FileText, Download, Eye, Clock, ShieldCheck, Printer, AlertTriangle, BrainCircuit, ListChecks } from 'lucide-react';

const DOC_TYPES = [
  { id: 'pgr', title: 'PGR - Programa de Gerenciamento de Riscos', icon: <FileText className="text-indigo-500" />, desc: 'Inventário e Plano de Ação unificado.' },
  { id: 'risks', title: 'Inventário de Riscos Detalhado', icon: <AlertTriangle className="text-amber-500" />, desc: 'Lista completa de perigos por setor e função.' },
  { id: 'psych', title: 'Diagnóstico Psicossocial Anual', icon: <BrainCircuit className="text-rose-500" />, desc: 'Resultados anônimos das pesquisas de clima.' },
  { id: 'actions', title: 'Status do Plano de Ação', icon: <ListChecks className="text-emerald-500" />, desc: 'Cronograma de execução e evidências de controle.' },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatórios e Documentos</h2>
          <p className="text-slate-500">Geração automática de conformidade NR-01</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
          <Printer size={18} />
          Imprimir Kit Completo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOC_TYPES.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-6 hover:border-indigo-200 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
              {doc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 mb-1">{doc.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{doc.desc}</p>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
                  <Download size={14} /> Gerar PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                  <Eye size={14} /> Pré-visualizar
                </button>
              </div>
            </div>
            <div className="hidden lg:block text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Última Versão</span>
              <span className="text-xs font-bold text-slate-700">12/10/2023</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Trilha de Auditoria & Histórico</h3>
            <p className="text-xs text-slate-500">Log de segurança e modificações de documentos</p>
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:underline">Ver Log Completo</button>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[320px]">
          {[
            { user: 'Dr. Roberto', action: 'Alterou Severidade Risco #12', time: 'Há 2 horas', icon: <ShieldCheck size={14}/>, color: 'text-indigo-500' },
            { user: 'Ana RH', action: 'Subiu evidência (lista_presença.pdf) para Ação #4', time: 'Há 5 horas', icon: <Clock size={14}/>, color: 'text-emerald-500' },
            { user: 'Sistema', action: 'Gerou relatório trimestral automático', time: 'Ontem às 18:00', icon: <FileText size={14}/>, color: 'text-slate-500' },
            { user: 'Admin Master', action: 'Cadastrou nova Unidade (Planta Sul)', time: 'Há 2 dias', icon: <ShieldCheck size={14}/>, color: 'text-indigo-500' },
          ].map((log, i) => (
            <div key={i} className="px-6 py-4 flex gap-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <div className={`mt-1 ${log.color}`}>
                {log.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                <div className="flex justify-between mt-0.5">
                  <span className="text-xs text-slate-500">{log.user}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">{log.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
