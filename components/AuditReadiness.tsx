
import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Printer, Eye, PenTool } from 'lucide-react';

const AuditReadiness: React.FC = () => {
  const checklist = [
    { id: 1, title: 'Inventário de Riscos Atualizado', status: 'ready', desc: 'Última revisão em 12/10/2023' },
    { id: 2, title: 'Plano de Ação em Execução', status: 'warning', desc: '2 ações críticas pendentes de evidência' },
    { id: 3, title: 'Avaliação Psicossocial (NR-01)', status: 'ready', desc: 'Relatório anual consolidado' },
    { id: 4, title: 'Treinamentos de NR em Dia', status: 'ready', desc: 'Certificados disponíveis no módulo RH' },
    { id: 5, title: 'Canal de Denúncia Ativo', status: 'error', desc: 'Sem relatos analisados nos últimos 30 dias' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Status para Fiscalização</h2>
          <p className="text-slate-500">Prontidão para auditoria do MTE e compliance jurídico.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
            <Printer size={18} /> Imprimir Dossiê
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
            <Eye size={18} /> Simular Fiscalização
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* RT Block */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Responsável Técnico (RT)</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <PenTool size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Dr. Roberto Santos</h4>
                <p className="text-xs text-slate-500">CRM/SST 12345-SP</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-100">
              <ShieldCheck size={14} /> Assinatura Digital Validada
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center">
                <span className="text-4xl font-black text-emerald-500">92%</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white">
                <ShieldCheck size={20} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Risco Legal Baixo</h3>
            <p className="text-sm text-slate-500 mt-2">Sua empresa cumpre os requisitos técnicos para uma fiscalização segura.</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Checklist de Conformidade Fiscal</h3>
            <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">PGR Válido até 10/2024</span>
          </div>
          <div className="divide-y divide-slate-50">
            {checklist.map((item) => (
              <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-slate-50 transition-colors">
                <div className="shrink-0">
                  {item.status === 'ready' && <CheckCircle2 className="text-emerald-500" size={24} />}
                  {item.status === 'warning' && <AlertCircle className="text-amber-500" size={24} />}
                  {item.status === 'error' && <XCircle className="text-rose-500" size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button className="text-xs font-bold text-indigo-600 px-3 py-1.5 bg-indigo-50 rounded-lg">Evidências</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReadiness;
