
import React from 'react';
import { Building2, Plus, ChevronRight, Users, Shield, Factory, MapPin } from 'lucide-react';

const MOCK_STRUCTURE = [
  {
    id: 'u1',
    name: 'Planta Industrial Norte',
    type: 'Unidade',
    address: 'Rodovia BR-101, KM 20',
    sectors: [
      { id: 's1', name: 'Produção A', employees: 45, risks: 12 },
      { id: 's2', name: 'Manutenção', employees: 12, risks: 8 },
      { id: 's3', name: 'Logística', employees: 20, risks: 5 },
    ]
  },
  {
    id: 'u2',
    name: 'Escritório Administrativo',
    type: 'Unidade',
    address: 'Av. Paulista, 1000 - 12º andar',
    sectors: [
      { id: 's4', name: 'RH & Financeiro', employees: 15, risks: 2 },
      { id: 's5', name: 'Vendas', employees: 30, risks: 3 },
    ]
  }
];

const UnitsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Unidades e Setores</h2>
          <p className="text-slate-500">Estruture a hierarquia da empresa para o PGR</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
          <Plus size={18} />
          Nova Unidade
        </button>
      </div>

      <div className="space-y-6">
        {MOCK_STRUCTURE.map((unit) => (
          <div key={unit.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Factory size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{unit.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <MapPin size={12} />
                    {unit.address}
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Plus size={16} /> Adicionar Setor
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unit.sectors.map((sector) => (
                  <div key={sector.id} className="p-5 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{sector.name}</h4>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">{sector.employees} Colabs.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-rose-400" />
                        <span className="text-xs font-semibold text-slate-600">{sector.risks} Riscos</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden mr-4">
                        <div className="h-full bg-emerald-500" style={{ width: '80%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">80% OK</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitsModule;
