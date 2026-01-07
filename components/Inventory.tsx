
import React, { useState } from 'react';
import { RiskType } from '../types';
import { 
  Plus, Filter, Download, MoreVertical, RotateCcw, Zap, ArrowDown, 
  Calendar, ShieldAlert, AlertTriangle, FileText, Search, ChevronRight, 
  Eye, X, CheckCircle2, History, Ban, Settings2, LayoutGrid, Info
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppData } from '../appData';

interface InventoryProps {
  vision?: 'tech' | 'exec';
}

const MOCK_RISKS = [
  { 
    id: '1', 
    type: RiskType.PHYSICAL, 
    description: 'Ruído excessivo em compressor principal', 
    source: 'Máquina de compressão de ar', 
    unit: 'Planta Norte',
    sector: 'Manutenção',
    probability: 3, 
    severity: 4, 
    initialScore: 20, 
    controls: ['Protetor auricular', 'Enclausuramento'], 
    lastReview: '2023-10-12', 
    validUntil: '2024-10-12',
    status: 'Em Dia'
  },
  { 
    id: '2', 
    type: RiskType.PSYCHOSOCIAL, 
    description: 'Carga mental elevada por metas comerciais', 
    source: 'Pressão por resultados / Jornada', 
    unit: 'Escritório Central',
    sector: 'Vendas',
    probability: 4, 
    severity: 4, 
    initialScore: 25, 
    controls: ['Pesquisas trimestrais', 'Canal de Escuta'], 
    lastReview: '2023-11-05', 
    validUntil: '2024-05-05',
    status: 'Em Dia'
  },
  { 
    id: '3', 
    type: RiskType.ERGONOMIC, 
    description: 'Postura inadequada prolongada', 
    source: 'Mobiliário não ajustável', 
    unit: 'Escritório Central',
    sector: 'RH',
    probability: 2, 
    severity: 2, 
    initialScore: 8, 
    controls: ['Cadeiras NR-17', 'Treinamento'], 
    lastReview: '2023-11-20', 
    validUntil: '2024-11-20',
    status: 'Em Dia'
  },
  { 
    id: '4', 
    type: RiskType.CHEMICAL, 
    description: 'Inalação de vapores orgânicos', 
    source: 'Solventes de limpeza de bicos', 
    unit: 'Planta Norte',
    sector: 'Produção',
    probability: 3, 
    severity: 5, 
    initialScore: 25, 
    controls: ['Exaustão localizada', 'EPI Respiratório'], 
    lastReview: '2023-09-15', 
    validUntil: '2024-03-15',
    status: 'Vencido'
  },
];

const EVOLUTION_DATA = [
  { name: 'Reduzido', value: 12, color: '#10b981' },
  { name: 'Mantido', value: 8, color: '#6366f1' },
  { name: 'Piorado', value: 2, color: '#ef4444' },
];

const Inventory: React.FC<InventoryProps> = ({ vision = 'tech' }) => {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { addActionFromRisk } = useAppData();

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestão de Inventário de Riscos</h2>
          <p className="text-slate-500 text-sm font-medium">Controle vivo de perigos e rastreabilidade total conforme NR-01.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowChangeModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all border border-rose-500"
          >
            <Zap size={16} />
            Mudar Processo (Gatilho PGR)
          </button>
          <button 
            onClick={() => setShowRiskModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all border border-indigo-500"
          >
            <Plus size={16} />
            Novo Risco
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Riscos', value: '48', color: 'text-slate-600', icon: <FileText size={18}/> },
          { label: 'Riscos Críticos', value: '06', color: 'text-rose-600', icon: <ShieldAlert size={18}/> },
          { label: 'Revisão Vencida', value: '03', color: 'text-amber-600', icon: <AlertTriangle size={18}/> },
          { label: 'Riscos Psicossociais', value: '12', color: 'text-indigo-600', icon: <Zap size={18}/> },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 ${card.color} flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{card.label}</p>
              <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar risco, setor, fonte ou unidade..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Unidade</option>
            <option>Planta Norte</option>
            <option>Escritório Central</option>
          </select>
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Categoria</option>
            {Object.values(RiskType).map(v => <option key={v}>{v}</option>)}
          </select>
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Nível</option>
            <option>Crítico</option>
            <option>Moderado</option>
            <option>Tolerável</option>
          </select>
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Status Revisão</option>
            <option>Em Dia</option>
            <option>Vencendo</option>
            <option>Vencido</option>
          </select>
        </div>
      </div>

      {/* Risks Table Area */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                <th className="px-6 py-5">Risco / Categoria</th>
                <th className="px-6 py-5">Unidade / Setor</th>
                <th className="px-6 py-5">Severidade Atual</th>
                <th className="px-6 py-5">Mitigação</th>
                <th className="px-6 py-5">Periodicidade</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_RISKS.map(risk => {
                const expiring = !isValid(risk.validUntil!);
                return (
                  <tr key={risk.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-1.5 h-12 rounded-full shrink-0 ${risk.type === RiskType.PSYCHOSOCIAL ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                        <div>
                          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-1">{risk.type}</span>
                          <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{risk.description}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">Fonte: {risk.source}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{risk.unit}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-1">{risk.sector}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border inline-block w-fit shadow-sm ${getLevelColor(risk.probability, risk.severity)}`}>
                          {getLevelName(risk.probability, risk.severity)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-slate-800">{risk.probability * risk.severity} pts</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`w-1.5 h-3 rounded-full ${i < risk.severity ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300 font-bold line-through">{risk.initialScore}</span>
                        <ArrowDown size={14} className="text-emerald-500" />
                        <span className="text-sm font-black text-emerald-600">{risk.probability * risk.severity}</span>
                        <div className="ml-2 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase border border-emerald-100">Mitigado</div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className={expiring ? 'text-rose-500' : 'text-slate-400'} />
                          <span className={`text-xs font-bold ${expiring ? 'text-rose-600 font-black' : 'text-slate-600'}`}>
                            {new Date(risk.validUntil!).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full w-fit ${expiring ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {expiring ? '⚠️ Vencido' : '🟢 Em Dia'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === risk.id ? null : risk.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {activeMenu === risk.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                              <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                                <Eye size={14} /> Ver Detalhes (Drawer)
                              </button>
                              <button onClick={() => {
                                addActionFromRisk({
                                  id: risk.id,
                                  description: risk.description,
                                  category: risk.type,
                                  level: getLevelName(risk.probability, risk.severity)
                                });
                                setActiveMenu(null);
                              }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                                <CheckCircle2 size={14} /> Criar Ação
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                                <FileText size={14} /> Editar Dados Técnicos
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-y border-slate-50">
                                <RotateCcw size={14} /> Reavaliar (Nova Versão)
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                <Ban size={14} /> Inativar (Eliminado)
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Evolução de Severidade</h3>
              <p className="text-xs text-slate-400">Eficiência das contramedidas (6 meses)</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
              Melhoria Contínua
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EVOLUTION_DATA} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {EVOLUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-2">Geração de Relatório PGR</h3>
            <p className="text-indigo-100 text-sm opacity-80 leading-relaxed mb-6">
              O Inventário consolidado e o Plano de Ação compõem o documento principal para defesa jurídica e fiscalização.
            </p>
            <button className="flex items-center gap-3 px-6 py-3 bg-white text-indigo-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-lg">
              <Download size={16} /> Exportar Kit PGR Completo
            </button>
          </div>
          <ShieldAlert size={180} className="absolute -bottom-10 -right-10 text-white opacity-5 rotate-12" />
        </div>
      </div>

      {/* Organizational Change Modal (Gatilho PGR) */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Gatilho de Reavaliação</h3>
              </div>
              <button onClick={() => setShowChangeModal(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
                NR-01: Mudanças em processos, pessoal ou organização exigem revisão obrigatória dos riscos.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tipo de Mudança</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500/20">
                    <option>Troca de Maquinário / Equipamento</option>
                    <option>Alteração de Layout Físico</option>
                    <option>Novas Tecnologias ou Processos</option>
                    <option>Mudança de Turno ou Jornada</option>
                    <option>Novos Insumos Químicos / Biológicos</option>
                    <option>Mudança em Quadro de Pessoal</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Unidade</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option>Planta Norte</option>
                      <option>Escritório Central</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Data Evento</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Descrição do Fato</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none h-24 resize-none"
                    placeholder="Descreva o que mudou e por que isso pode afetar a saúde/segurança..."
                  />
                </div>
                <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <Info size={20} className="text-rose-600 shrink-0" />
                  <p className="text-[10px] text-rose-800 font-bold leading-tight uppercase">
                    Ao confirmar, o sistema marcará o PGR como <span className="underline">"EM REVISÃO"</span> até a validação técnica.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowChangeModal(false)} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowChangeModal(false)}
                  className="flex-1 px-6 py-3 bg-rose-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
                >
                  Registrar e Revisar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Risk Modal */}
      {showRiskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Novo Risco / Perigo</h3>
              </div>
              <button onClick={() => setShowRiskModal(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nome do Risco</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Ex: Queda em mesmo nível" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Categoria Técnica</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                    {Object.values(RiskType).map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Probabilidade</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none">
                      <option>1 - Baixa</option>
                      <option>2 - Média</option>
                      <option>3 - Alta</option>
                      <option>4 - Crítica</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Severidade</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none">
                      <option>1 - Leve</option>
                      <option>2 - Moderada</option>
                      <option>3 - Grave</option>
                      <option>4 - Crítica</option>
                      <option>5 - Fatal</option>
                    </select>
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest">Nível Calculado</p>
                   <p className="text-lg font-black text-indigo-600">MODERADO (8 pts)</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Unidade / Setor</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                    <option>Planta Norte - Manutenção</option>
                    <option>Planta Norte - Produção</option>
                    <option>Escritório Central - Vendas</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fonte / Causa</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Ex: Piso irregular" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Medidas Existentes</label>
                  <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none h-20 resize-none" placeholder="EPCs, EPIs já adotados..." />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Responsável Técnico</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                    <option>Dr. Roberto Santos (RT)</option>
                    <option>Eng. Amanda Silva</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8 pt-0 flex gap-3">
              <button onClick={() => setShowRiskModal(false)} className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl hover:bg-slate-200 transition-all">
                Cancelar
              </button>
              <button onClick={() => setShowRiskModal(false)} className="flex-1 px-6 py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                Salvar e Gerar Ação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;





