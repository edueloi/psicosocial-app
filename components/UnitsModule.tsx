
import React, { useState } from 'react';
import { 
  Building2, Plus, ChevronRight, Users, Shield, Factory, 
  MapPin, MoreVertical, Search, Filter, User, Calendar, 
  ShieldAlert, AlertTriangle, CheckCircle2, X, Archive, 
  Settings2, LayoutGrid, Info, Eye, ExternalLink, History,
  ShieldCheck
} from 'lucide-react';
import { Unit, Sector } from '../types';

const MOCK_STRUCTURE: Unit[] = [
  {
    id: 'u1',
    name: 'Planta Industrial Norte',
    type: 'Unidade Industrial',
    address: 'Rodovia BR-101, KM 20',
    responsible: 'Eng. Roberto Santos',
    status: 'Ativo',
    sectors: [
      { 
        id: 's1', 
        name: 'Produção A', 
        responsible: 'Marco Silva',
        employees: 45, 
        risksCount: 12, 
        hasCriticalRisk: true,
        status: 'Ativo',
        lastReviewDate: '2023-10-12',
        nextReviewDate: '2024-10-12',
        reviewOverdue: false
      },
      { 
        id: 's2', 
        name: 'Manutenção', 
        responsible: 'Carla Dias',
        employees: 12, 
        risksCount: 8, 
        hasCriticalRisk: false,
        status: 'Ativo',
        lastReviewDate: '2023-08-05',
        nextReviewDate: '2024-02-05',
        reviewOverdue: true
      },
      { 
        id: 's3', 
        name: 'Logística', 
        responsible: 'Júlio Neves',
        employees: 20, 
        risksCount: 5, 
        hasCriticalRisk: false,
        status: 'Em Reestruturação',
        lastReviewDate: '2024-01-15',
        nextReviewDate: '2025-01-15',
        reviewOverdue: false
      },
    ]
  },
  {
    id: 'u2',
    name: 'Escritório Administrativo',
    type: 'Escritório',
    address: 'Av. Paulista, 1000 - 12º andar',
    responsible: 'Ana Oliveira',
    status: 'Ativo',
    sectors: [
      { 
        id: 's4', 
        name: 'RH & Financeiro', 
        responsible: 'Luciana Martins',
        employees: 15, 
        risksCount: 2, 
        hasCriticalRisk: false,
        status: 'Ativo',
        lastReviewDate: '2024-03-20',
        nextReviewDate: '2025-03-20',
        reviewOverdue: false
      },
      { 
        id: 's5', 
        name: 'Vendas', 
        responsible: 'Ricardo Lima',
        employees: 30, 
        risksCount: 3, 
        hasCriticalRisk: false,
        status: 'Ativo',
        lastReviewDate: '2023-12-10',
        nextReviewDate: '2024-12-10',
        reviewOverdue: false
      },
    ]
  }
];

const STATUS_COLORS = {
  'Ativo': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Em Reestruturação': 'bg-amber-100 text-amber-700 border-amber-200',
  'Inativo': 'bg-slate-100 text-slate-500 border-slate-200',
};

const UnitsModule: React.FC = () => {
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const stats = [
    { label: 'Total Unidades', value: MOCK_STRUCTURE.length, icon: <Building2 size={16}/>, color: 'text-slate-600' },
    { label: 'Setores Mapeados', value: MOCK_STRUCTURE.reduce((acc, u) => acc + u.sectors.length, 0), icon: <LayoutGrid size={16}/>, color: 'text-indigo-600' },
    { label: 'Colaboradores', value: MOCK_STRUCTURE.reduce((acc, u) => acc + u.sectors.reduce((sAcc, s) => sAcc + s.employees, 0), 0), icon: <Users size={16}/>, color: 'text-slate-600' },
    { label: 'Setores Críticos', value: MOCK_STRUCTURE.reduce((acc, u) => acc + u.sectors.filter(s => s.hasCriticalRisk).length, 0), icon: <ShieldAlert size={16}/>, color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Estrutura Organizacional</h2>
          <p className="text-slate-500 text-sm font-medium">Gestão hierárquica de unidades e setores para inventário NR-01.</p>
        </div>
        <button 
          onClick={() => setShowUnitModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all border border-indigo-500"
        >
          <Plus size={18} />
          Nova Unidade
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar unidade, setor ou responsável..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Status: Todos</option>
            <option>Ativo</option>
            <option>Em Reestruturação</option>
            <option>Inativo</option>
          </select>
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Riscos: Todos</option>
            <option>Apenas Críticos</option>
            <option>Sem Riscos Críticos</option>
          </select>
          <select className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none uppercase tracking-tighter">
            <option>Revisão: Em Dia</option>
            <option>Revisão: Vencida</option>
          </select>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-8">
        {MOCK_STRUCTURE.map((unit) => (
          <div key={unit.id} className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Unit Header */}
            <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative group">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-white rounded-[24px] border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Factory size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{unit.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[unit.status]}`}>
                      {unit.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                      <MapPin size={14} className="text-slate-400" />
                      {unit.address}
                    </p>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                      <User size={14} className="text-slate-400" />
                      Responsável: <span className="text-slate-800">{unit.responsible}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 shadow-sm transition-all">
                  <Plus size={16} className="text-indigo-600" /> Adicionar Setor
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {selectedUnit === unit.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setSelectedUnit(null)}></div>
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Settings2 size={14}/> Editar Unidade</button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Users size={14}/> Gestão de Pessoal</button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-y border-slate-50"><ShieldCheck size={14}/> Relatório Unificado PGR</button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Archive size={14}/> Desativar Unidade</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sectors Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unit.sectors.map((sector) => (
                  <div key={sector.id} className="group p-6 rounded-[32px] border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative flex flex-col h-full">
                    {/* Sector Criticality Badge */}
                    {sector.hasCriticalRisk && (
                      <div className="absolute -top-3 left-6 px-3 py-1 bg-rose-600 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-rose-200 flex items-center gap-1.5 z-10 animate-pulse">
                        <ShieldAlert size={12} /> CRÍTICO
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-5">
                      <div className="min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border mb-2 inline-block ${STATUS_COLORS[sector.status]}`}>
                          {sector.status}
                        </span>
                        <h4 className="font-black text-slate-800 text-lg leading-tight truncate group-hover:text-indigo-600 transition-colors">{sector.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1.5">
                          <User size={12} /> {sector.responsible}
                        </p>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedSector(selectedSector === sector.id ? null : sector.id); }}
                          className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {selectedSector === sector.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setSelectedSector(null)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-lg transition-all"><Eye size={14}/> Ver Inventário</button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-lg transition-all"><History size={14}/> Ver Timeline</button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Archive size={14}/> Desativar Setor</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-1 group-hover:bg-white group-hover:border-indigo-50 transition-all">
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tight">
                           <Users size={12} /> Efetivo
                        </div>
                        <span className="text-sm font-black text-slate-800">{sector.employees} Colabs.</span>
                      </div>
                      <div className={`p-3 rounded-2xl border flex flex-col gap-1 transition-all ${sector.hasCriticalRisk ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100 group-hover:bg-white group-hover:border-indigo-50'}`}>
                        <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-tight ${sector.hasCriticalRisk ? 'text-rose-400' : 'text-slate-400'}`}>
                           <Shield size={12} /> Riscos
                        </div>
                        <span className={`text-sm font-black ${sector.hasCriticalRisk ? 'text-rose-600' : 'text-slate-800'}`}>{sector.risksCount} Perigos</span>
                      </div>
                    </div>
                    
                    {/* Review Dates & Status */}
                    <div className="mt-auto pt-5 border-t border-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <Calendar size={12} /> Última: {new Date(sector.lastReviewDate).toLocaleDateString('pt-BR')}
                         </div>
                         <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${sector.reviewOverdue ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
                            {sector.reviewOverdue ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                            {sector.reviewOverdue ? 'Revisão Vencida' : 'Em Dia'}
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                           <span>Score de Conformidade</span>
                           <span className={sector.reviewOverdue ? 'text-rose-600' : 'text-emerald-600'}>{sector.reviewOverdue ? '65%' : '92%'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${sector.reviewOverdue ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: sector.reviewOverdue ? '65%' : '92%' }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <button className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                        Inventário
                      </button>
                      <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all">
                        Plano Ação
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Empty State / Add Sector Card */}
                <button className="p-8 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-4 group">
                   <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <Plus size={32} />
                   </div>
                   <div className="text-center">
                      <p className="text-sm font-black text-slate-500 group-hover:text-indigo-600 transition-colors uppercase">Novo Setor</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vincular nova área ao PGR</p>
                   </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Unit Modal Placeholder */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Building2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Nova Unidade</h3>
                  <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-80 mt-2">Cadastro de Localização Estratégica</p>
                </div>
              </div>
              <button onClick={() => setShowUnitModal(false)} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-xl">
                <X size={24} />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Nome Fantasia da Unidade</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" placeholder="Ex: Planta Industrial Sul" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Endereço Completo</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" placeholder="Rua, Número, Bairro, Cidade - UF" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Responsável (Gestor)</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none appearance-none">
                    <option>Selecione um gestor...</option>
                    <option>Eng. Roberto Santos</option>
                    <option>Ana Oliveira</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Tipo de Local</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none appearance-none">
                    <option>Industrial</option>
                    <option>Administrativo</option>
                    <option>Depósito / CD</option>
                    <option>Obra Temporária</option>
                  </select>
                </div>
              </div>

              <div className="p-5 bg-indigo-50 rounded-[24px] border border-indigo-100 flex gap-4">
                <Info size={20} className="text-indigo-600 shrink-0" />
                <p className="text-[10px] text-indigo-900 font-bold leading-relaxed uppercase">
                  Nota: A criação de uma nova unidade gerará automaticamente um <span className="underline">Evento de Gestão de Mudança</span> na Timeline de Conformidade.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowUnitModal(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowUnitModal(false)}
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitsModule;
