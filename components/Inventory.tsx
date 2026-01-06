
import React, { useState } from 'react';
import { RiskType } from '../types';
import { Plus, Filter, Download, MoreVertical, RotateCcw, Zap, ArrowDown, Calendar } from 'lucide-react';

interface InventoryProps {
  vision?: 'tech' | 'exec';
}

const MOCK_RISKS = [
  { id: '1', type: RiskType.PHYSICAL, description: 'Ruído excessivo em compressor', source: 'Manutenção', probability: 3, severity: 4, initialScore: 12, controls: ['Protetor auricular'], lastReview: '2023-10-12', validUntil: '2024-10-12' },
  { id: '2', type: RiskType.PSYCHOSOCIAL, description: 'Carga mental elevada', source: 'Comercial', probability: 4, severity: 3, initialScore: 20, controls: ['Pesquisas trimestrais'], lastReview: '2023-11-05', validUntil: '2024-05-05' },
  { id: '3', type: RiskType.ERGONOMIC, description: 'Postura inadequada', source: 'Administrativo', probability: 2, severity: 2, initialScore: 8, controls: ['Cadeiras NR-17'], lastReview: '2023-11-20', validUntil: '2024-11-20' },
  { id: '4', type: RiskType.CHEMICAL, description: 'Vapores de solventes', source: 'Pintura', probability: 3, severity: 5, initialScore: 25, controls: ['Máscaras'], lastReview: '2023-09-15', validUntil: '2024-03-15' },
];

const Inventory: React.FC<InventoryProps> = ({ vision = 'tech' }) => {
  const [filterType, setFilterType] = useState<string>('Todos');

  const getLevelColor = (prob: number, sev: number) => {
    const score = prob * sev;
    if (score >= 15) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (score >= 8) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  const getLevelName = (prob: number, sev: number) => {
    const score = prob * sev;
    if (score >= 15) return 'Crítico';
    if (score >= 8) return 'Moderado';
    return 'Tolerável';
  };

  const isValid = (date: string) => new Date(date) > new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Inventário de Riscos</h2>
          <p className="text-slate-500">
            {vision === 'exec' 
              ? 'Foco em redução de severidade e proteção legal.' 
              : 'Gestão de perigos com periodicidade de reavaliação.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all">
            <Zap size={18} />
            Mudar Processo (Gatilho PGR)
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
            <Plus size={18} />
            Novo Risco
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
                <th className="px-6 py-4">Risco / Categoria</th>
                <th className="px-6 py-4">Severidade Atual</th>
                <th className="px-6 py-4">Mitigação</th>
                <th className="px-6 py-4">Periodicidade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_RISKS.map(risk => (
                <tr key={risk.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div>
                      <span className="text-[10px] font-black text-indigo-500 uppercase block mb-1">{risk.type}</span>
                      <p className="text-sm font-bold text-slate-800">{risk.description}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{risk.source}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getLevelColor(risk.probability, risk.severity)}`}>
                      {getLevelName(risk.probability, risk.severity)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-300 line-through">{risk.initialScore}</span>
                      <ArrowDown size={12} className="text-emerald-500" />
                      <span className="text-sm font-black text-emerald-600">{risk.probability * risk.severity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className={isValid(risk.validUntil!) ? 'text-emerald-500' : 'text-rose-500'} />
                      <span className={`text-xs font-bold ${isValid(risk.validUntil!) ? 'text-slate-600' : 'text-rose-600'}`}>
                        Vence: {new Date(risk.validUntil!).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                      <RotateCcw size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
