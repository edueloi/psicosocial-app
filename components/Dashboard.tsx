import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Activity,
  CalendarClock,
  CircleCheck,
  ClipboardList,
  Eye,
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAppData } from '../appData';
import { ActionStatus } from '../types';

interface DashboardProps {
  vision?: 'tech' | 'exec';
}

const evolutionData = [
  { year: '2020', baseline: 82, atual: 70 },
  { year: '2021', baseline: 82, atual: 63 },
  { year: '2022', baseline: 82, atual: 55 },
  { year: '2023', baseline: 82, atual: 47 },
  { year: '2024', baseline: 82, atual: 38 },
  { year: '2025', baseline: 82, atual: 31 },
];

const participationData = [
  { month: 'Jan', adesao: 72 },
  { month: 'Fev', adesao: 78 },
  { month: 'Mar', adesao: 81 },
  { month: 'Abr', adesao: 83 },
  { month: 'Mai', adesao: 79 },
  { month: 'Jun', adesao: 86 },
  { month: 'Jul', adesao: 88 },
  { month: 'Ago', adesao: 84 },
];

const ambulatoryData = [
  { sector: 'Toyota 452', ombro: 18, coluna: 24, joelho: 12 },
  { sector: 'Usina Pilon', ombro: 14, coluna: 21, joelho: 9 },
  { sector: 'Logística', ombro: 10, coluna: 16, joelho: 7 },
  { sector: 'Administrativo', ombro: 6, coluna: 8, joelho: 4 },
];

const preventionData = [
  { month: 'Jan', momentaneas: 37, reabilitados: 26 },
  { month: 'Fev', momentaneas: 40, reabilitados: 29 },
  { month: 'Mar', momentaneas: 34, reabilitados: 28 },
  { month: 'Abr', momentaneas: 31, reabilitados: 25 },
  { month: 'Mai', momentaneas: 29, reabilitados: 24 },
  { month: 'Jun', momentaneas: 27, reabilitados: 23 },
];

const cidAbsenceData = [
  { cid: 'F', ate15: 41, acima15: 13 },
  { cid: 'G', ate15: 33, acima15: 9 },
  { cid: 'I', ate15: 26, acima15: 8 },
];

const riskMatrixData = [
  { sector: 'Fundição', risco: 92 },
  { sector: 'Prensas', risco: 84 },
  { sector: 'Montagem', risco: 66 },
  { sector: 'Expedição', risco: 58 },
  { sector: 'Adm', risco: 31 },
];

const admissionData = [
  { name: 'Recomendados', value: 847 },
  { name: 'Não recomendados', value: 153 },
];

const campaignData = [
  { item: 'Setembro Amarelo', progresso: 100 },
  { item: 'Outubro Rosa', progresso: 100 },
  { item: 'Novembro Azul', progresso: 92 },
  { item: 'Demais campanhas', progresso: 84 },
];

const flexibilityData = [
  { year: '2021', indice: 61 },
  { year: '2022', indice: 67 },
  { year: '2023', indice: 72 },
  { year: '2024', indice: 78 },
  { year: '2025', indice: 83 },
];

const lostDaysData = [
  { month: 'Jan', diasPerdidos: 96, cidF: 35, cidG: 38, cidI: 23 },
  { month: 'Fev', diasPerdidos: 87, cidF: 32, cidG: 34, cidI: 21 },
  { month: 'Mar', diasPerdidos: 79, cidF: 27, cidG: 31, cidI: 21 },
  { month: 'Abr', diasPerdidos: 73, cidF: 25, cidG: 29, cidI: 19 },
  { month: 'Mai', diasPerdidos: 68, cidF: 23, cidG: 27, cidI: 18 },
  { month: 'Jun', diasPerdidos: 64, cidF: 21, cidG: 25, cidI: 18 },
];

const PIE_COLORS = ['#16a34a', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ vision = 'tech' }) => {
  const [includePsychosocial, setIncludePsychosocial] = useState(true);
  const { actions } = useAppData();

  const metrics = useMemo(() => {
    const totalActions = actions.length || 1;
    const completed = actions.filter((action) => action.status === ActionStatus.COMPLETED).length;
    const evidenceCoverage = Math.round((actions.filter((action) => action.evidenceCount > 0).length / totalActions) * 100);
    const overdue = actions.filter((action) => new Date(action.dueDate) < new Date() && action.status !== ActionStatus.COMPLETED).length;

    return {
      completionRate: Math.round((completed / totalActions) * 100),
      evidenceCoverage,
      overdue,
      totalActions: actions.length,
    };
  }, [actions]);

  const avgParticipation = Math.round(participationData.reduce((sum, item) => sum + item.adesao, 0) / participationData.length);
  const rehabRate = Math.round(
    (preventionData.reduce((sum, item) => sum + item.reabilitados, 0) /
      preventionData.reduce((sum, item) => sum + item.momentaneas, 0)) *
      100,
  );

  const totalLostDays = lostDaysData.reduce((sum, item) => sum + item.diasPerdidos, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {vision === 'exec' ? 'Resultados Integrados da Operação Atividade' : 'Dashboard Integrado: Ginástica, Ergonomia, Fisioterapia e NR1'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Indicadores em tempo real para eliminar retrabalho de planilha, acelerar decisões e fortalecer auditorias com evidências.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setIncludePsychosocial(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              includePsychosocial ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            C/ Psicossocial
          </button>
          <button
            onClick={() => setIncludePsychosocial(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !includePsychosocial ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            S/ Psicossocial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Adesão média na ginástica',
            value: `${avgParticipation}%`,
            note: 'Meta contratual: > 80%',
            icon: <Users size={18} />,
            tone: 'text-indigo-700 bg-indigo-50 border-indigo-200',
          },
          {
            label: 'Reabilitados sem afastamento',
            value: `${rehabRate}%`,
            note: 'Queixas momentâneas tratadas preventivamente',
            icon: <HeartPulse size={18} />,
            tone: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Planos com evidência (foto/doc)',
            value: `${metrics.evidenceCoverage}%`,
            note: `${metrics.totalActions} ações ativas no plano`,
            icon: <CircleCheck size={18} />,
            tone: 'text-sky-700 bg-sky-50 border-sky-200',
          },
          {
            label: 'Pendências fora do prazo',
            value: `${metrics.overdue}`,
            note: `Execução geral: ${metrics.completionRate}% concluída`,
            icon: <CalendarClock size={18} />,
            tone: 'text-rose-700 bg-rose-50 border-rose-200',
          },
        ].map((card) => (
          <article key={card.label} className={`rounded-2xl border p-4 ${card.tone}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase font-semibold tracking-[0.12em] opacity-80">KPI</p>
              {card.icon}
            </div>
            <p className="text-3xl font-black mb-1">{card.value}</p>
            <p className="text-sm font-semibold">{card.label}</p>
            <p className="text-xs mt-1 opacity-80">{card.note}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">1) Evolução de Queixas Musculares (Linha de Base)</h3>
          <p className="text-xs text-slate-500 mb-4">Comparativo histórico entre início de contrato (linha vermelha) e cenário atual (linha azul).</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="baseline" stroke="#ef4444" strokeWidth={2.5} name="Linha base (início contrato)" />
                <Line type="monotone" dataKey="atual" stroke="#2563eb" strokeWidth={3} name="Situação atual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">2) Adesão por mês</h3>
          <p className="text-xs text-slate-500 mb-4">Participação na ginástica laboral com meta de 80%.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Adesão']} />
                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Meta 80%', position: 'insideTopRight', fontSize: 11 }} />
                <Bar dataKey="adesao" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">3) Queixas ambulatoriais por setor e estrutura corporal</h3>
          <p className="text-xs text-slate-500 mb-4">Visão para priorizar intervenção ergonômica e fisioterapêutica.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ambulatoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="sector" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ombro" stackId="a" fill="#f97316" name="Ombro" />
                <Bar dataKey="coluna" stackId="a" fill="#0ea5e9" name="Coluna" />
                <Bar dataKey="joelho" stackId="a" fill="#22c55e" name="Joelho" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">4) Queixas momentâneas x reabilitados</h3>
          <p className="text-xs text-slate-500 mb-4">Indicador preventivo para evitar afastamentos acima de 15 dias.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={preventionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="momentaneas" stroke="#ef4444" strokeWidth={2.5} name="Queixas momentâneas" />
                <Line type="monotone" dataKey="reabilitados" stroke="#16a34a" strokeWidth={2.5} name="Reabilitados" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">5) Absenteísmo por CID (F, G, I)</h3>
          <p className="text-xs text-slate-500 mb-4">Separação por afastamentos até 15 dias e acima de 15 dias.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cidAbsenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cid" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ate15" fill="#0ea5e9" name="Até 15 dias" />
                <Bar dataKey="acima15" fill="#8b5cf6" name="> 15 dias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">6) Matriz de Risco Biomecânico</h3>
          <p className="text-xs text-slate-500 mb-4">Classificação de risco por setor na fase de implantação.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskMatrixData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="sector" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Risco biomecânico" dataKey="risco" stroke="#f43f5e" fill="#fb7185" fillOpacity={0.35} />
                <Tooltip formatter={(value) => [`${value} pts`, 'Risco']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">7) Recomendados x Não recomendados</h3>
          <p className="text-xs text-slate-500 mb-4">Resultado da avaliação admissional cinesiofuncional.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={admissionData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3}>
                  {admissionData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">8) Teste de flexibilidade (anual)</h3>
          <p className="text-xs text-slate-500 mb-4">Quanto maior o índice de flexibilidade, menor a chance de lesão osteomuscular.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flexibilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Índice']} />
                <ReferenceLine y={75} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Meta 75%', position: 'insideTopRight', fontSize: 11 }} />
                <Line type="monotone" dataKey="indice" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Flexibilidade" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">9) Dias perdidos por absenteísmo (CID F/G/I)</h3>
          <p className="text-xs text-slate-500 mb-4">Impacto mensal consolidado para visão gerencial e negociação com cliente.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lostDaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cidF" stackId="lost" fill="#a855f7" name="CID F" />
                <Bar dataKey="cidG" stackId="lost" fill="#3b82f6" name="CID G" />
                <Bar dataKey="cidI" stackId="lost" fill="#14b8a6" name="CID I" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-600 mt-2">Total no semestre: <span className="font-bold text-slate-900">{totalLostDays} dias perdidos</span>.</p>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-900 mb-2">10) Campanhas anuais e governança de conteúdo</h3>
          <p className="text-xs text-slate-500 mb-4">
            Painel para as 12 campanhas fixas do ano (Setembro Amarelo, Outubro Rosa, Novembro Azul etc.) com status de publicação.
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="item" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Progresso']} />
                <Bar dataKey="progresso" fill="#14b8a6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold mb-3">Fluxo operacional mensal</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><ClipboardList size={16} className="mt-0.5 text-indigo-300" /> Entrada até dia 10: profissionais lançam dados direto no sistema.</li>
            <li className="flex gap-2"><Activity size={16} className="mt-0.5 text-indigo-300" /> Processamento automático de gráficos e comparativos por setor.</li>
            <li className="flex gap-2"><Eye size={16} className="mt-0.5 text-indigo-300" /> Portal cliente com acesso somente leitura para engenharia/RH.</li>
            <li className="flex gap-2"><ShieldAlert size={16} className="mt-0.5 text-indigo-300" /> Evidência visual obrigatória para auditoria (fotos antes/depois).</li>
            <li className="flex gap-2"><Stethoscope size={16} className="mt-0.5 text-indigo-300" /> Embrião NR1: perguntas leves de psicossocial para mapeamento inicial.</li>
            <li className="flex gap-2"><TrendingUp size={16} className="mt-0.5 text-indigo-300" /> Meta crítica: manter adesão &gt;80% e reduzir queixas ano a ano.</li>
          </ul>
        </article>
      </div>
    </div>
  );
};

export default Dashboard;
