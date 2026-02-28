import React from 'react';
import { AppModuleId, ModulePermissions, UserPreferences } from '../types';
import {
  BookOpenText,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Workflow,
  Settings,
  ChevronDown,
  Search,
  Filter,
  Gauge,
  CircleHelp,
  ClipboardList,
  Target,
  AlertTriangle,
  CalendarCheck2,
} from 'lucide-react';

type ManualEntry = {
  id: AppModuleId;
  title: string;
  objective: string;
  audience: string;
  frequency: string;
  prerequisites: string[];
  actions: string[];
  flow: string[];
  kpis: string[];
  commonMistakes: string[];
  tips: string[];
};

interface SystemManualProps {
  permissions: Record<AppModuleId, ModulePermissions>;
  language: UserPreferences['language'];
}

const MANUAL_SECTIONS: ManualEntry[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    objective: 'Visão executiva dos indicadores, alertas críticos, tendências e prioridades do dia.',
    audience: 'Gestores, SST e liderança.',
    frequency: 'Uso diário no início do expediente e no fechamento do dia.',
    prerequisites: ['Dados dos módulos atualizados.', 'Perfil com permissão de visualização do dashboard.'],
    actions: [
      'Validar cards de risco, pendências e tendências antes de iniciar a operação.',
      'Trocar visão Técnica/Executiva para adaptar o nível de detalhe à audiência.',
      'Abrir módulos relacionados ao clicar em alertas de criticidade.',
    ],
    flow: ['Ler alertas críticos', 'Priorizar ações', 'Delegar responsáveis', 'Acompanhar evolução no mesmo dia'],
    kpis: ['Riscos críticos ativos', 'Ações atrasadas', 'Taxa de conclusão no período'],
    commonMistakes: ['Ignorar alertas recorrentes', 'Não revisar dados desatualizados antes de apresentar resultados'],
    tips: ['Comece sempre pelo Dashboard.', 'Use os alertas como gatilho para Plano de Ação e Gestão de Riscos.'],
  },
  {
    id: 'inventory',
    title: 'Gestão de Riscos',
    objective: 'Mapear, classificar e revisar riscos ocupacionais e psicossociais com rastreabilidade.',
    audience: 'SST, responsáveis técnicos e auditoria interna.',
    frequency: 'Revisão semanal e revisão completa por ciclo de auditoria.',
    prerequisites: ['Unidades e setores cadastrados.', 'Critérios de risco definidos internamente.'],
    actions: [
      'Cadastrar riscos por tipo, fonte e impacto no ambiente de trabalho.',
      'Atualizar probabilidade/severidade para recalcular criticidade.',
      'Registrar controles existentes, responsáveis e histórico de revisão.',
    ],
    flow: ['Identificar risco', 'Classificar', 'Definir controles', 'Vincular ação', 'Revisar impacto'],
    kpis: ['Quantidade de riscos por nível', 'Tempo médio de revisão', 'Cobertura de controles implementados'],
    commonMistakes: ['Descrições genéricas sem contexto', 'Não vincular risco a ação corretiva/preventiva'],
    tips: ['Padronize nomenclaturas.', 'Ao alterar risco crítico, revise ações associadas imediatamente.'],
  },
  {
    id: 'actions',
    title: 'Plano de Ação',
    objective: 'Planejar e executar ações preventivas/corretivas com prazo, dono e evidência.',
    audience: 'Gestores, SST e RH.',
    frequency: 'Acompanhamento diário e revisão formal semanal.',
    prerequisites: ['Riscos ou ocorrências cadastradas.', 'Responsáveis definidos no processo.'],
    actions: [
      'Criar ações com responsável, prazo e impacto esperado.',
      'Atualizar status continuamente (Pendente, Em Andamento, Concluído, Atrasado).',
      'Anexar evidências para validação e auditoria.',
    ],
    flow: ['Criar ação', 'Executar tarefa', 'Anexar evidência', 'Validar conclusão', 'Encerrar'],
    kpis: ['% de ações concluídas no prazo', 'Ações atrasadas por área', 'Tempo médio de conclusão'],
    commonMistakes: ['Definir prazos irreais', 'Encerrar sem evidência mínima'],
    tips: ['Priorize ações de risco crítico.', 'Use cadência semanal com responsáveis.'],
  },
  {
    id: 'psychosocial',
    title: 'Psicossocial',
    objective: 'Monitorar fatores psicossociais e conduzir planos de mitigação com confidencialidade.',
    audience: 'RH, SST e comitê de saúde ocupacional.',
    frequency: 'Monitoramento contínuo e revisão quinzenal.',
    prerequisites: ['Fluxo de atendimento definido.', 'Responsáveis pelo sigilo e acolhimento.'],
    actions: [
      'Avaliar fatores de sobrecarga, clima, assédio e estresse ocupacional.',
      'Registrar ocorrências e planos de mitigação.',
      'Acompanhar indicadores por área e evolução do risco.',
    ],
    flow: ['Detectar sinal', 'Classificar urgência', 'Acionar plano', 'Acompanhar indicador'],
    kpis: ['Índice de fatores psicossociais por área', 'Casos acompanhados dentro do SLA'],
    commonMistakes: ['Registrar informação sensível sem contexto adequado', 'Não fechar acompanhamento'],
    tips: ['Preserve confidencialidade.', 'Conecte dados do psicossocial com ações e auditoria.'],
  },
  {
    id: 'audit',
    title: 'Status Auditoria',
    objective: 'Medir prontidão, evidências e lacunas para auditorias internas e externas.',
    audience: 'Gestão, auditoria interna e compliance.',
    frequency: 'Revisão semanal, intensificando próximo à auditoria.',
    prerequisites: ['Documentos e evidências centralizados.', 'Checklist normativo definido.'],
    actions: [
      'Validar checklist de conformidade por requisito.',
      'Apontar lacunas e atribuir responsáveis de regularização.',
      'Atualizar status de prontidão conforme entregas.',
    ],
    flow: ['Verificar requisito', 'Anexar evidência', 'Corrigir lacuna', 'Marcar pronto para auditoria'],
    kpis: ['% requisitos conformes', 'Pendências abertas por área', 'Prazo médio de regularização'],
    commonMistakes: ['Marcar item como conforme sem comprovação', 'Não registrar data de revisão'],
    tips: ['Rode pré-auditorias internas.', 'Conecte pendências ao Plano de Ação.'],
  },
  {
    id: 'timeline',
    title: 'Timeline NR-01',
    objective: 'Consolidar trilha cronológica de eventos, revisões e evidências.',
    audience: 'Auditoria, gestão e responsáveis técnicos.',
    frequency: 'Atualização contínua após cada evento relevante.',
    prerequisites: ['Eventos com data e vínculo documental.', 'Padrão de registro de mudanças.'],
    actions: [
      'Consultar eventos por data e tipo.',
      'Validar vínculo de versão/evidência.',
      'Usar histórico para comprovar evolução do programa.',
    ],
    flow: ['Registrar evento', 'Anexar referência', 'Versionar mudança', 'Auditar histórico'],
    kpis: ['Cobertura de eventos com evidência', 'Tempo entre evento e registro'],
    commonMistakes: ['Registrar evento sem referência legal/operacional', 'Falha em versionamento'],
    tips: ['Mantenha cadência de atualização.', 'Eventos documentados fortalecem defesa técnica.'],
  },
  {
    id: 'users',
    title: 'Usuários',
    objective: 'Gerenciar ciclo de vida de acessos e responsabilidades no sistema.',
    audience: 'Admin do tenant e segurança da informação.',
    frequency: 'Revisão semanal + revisão formal mensal.',
    prerequisites: ['Perfis de permissão definidos.', 'Estrutura de empresas/áreas cadastrada.'],
    actions: [
      'Criar usuários com perfil e vínculo de empresa.',
      'Atualizar status (Ativo/Suspenso/Revogado/Pendente).',
      'Aplicar revisão de menor privilégio periodicamente.',
    ],
    flow: ['Solicitar acesso', 'Aprovar perfil', 'Ativar usuário', 'Revisar periodicamente'],
    kpis: ['Usuários ativos por perfil', 'Acessos revogados no prazo', 'Pendências de aprovação'],
    commonMistakes: ['Manter conta de desligado ativa', 'Permissão excessiva sem justificativa'],
    tips: ['Evite contas genéricas.', 'Revogue acesso no mesmo dia do desligamento.'],
  },
  {
    id: 'units',
    title: 'Unidades',
    objective: 'Estruturar unidades e setores para análises e execução segmentadas.',
    audience: 'Gestão operacional e SST.',
    frequency: 'Revisão mensal ou em mudanças organizacionais.',
    prerequisites: ['Responsáveis de unidade definidos.', 'Mapa organizacional atualizado.'],
    actions: [
      'Cadastrar unidade, responsável e status.',
      'Mapear setores com colaboradores e riscos.',
      'Monitorar datas de revisão e pendências.',
    ],
    flow: ['Cadastrar unidade', 'Vincular setores', 'Associar riscos', 'Revisar periodicamente'],
    kpis: ['Unidades com revisão em dia', 'Setores sem responsável', 'Riscos críticos por unidade'],
    commonMistakes: ['Setores duplicados', 'Estrutura desatualizada após reorganização'],
    tips: ['Mantenha hierarquia coerente.', 'Revisão periódica evita inconsistência de dados.'],
  },
  {
    id: 'forms',
    title: 'Forms Externos',
    objective: 'Coletar dados de campo para análises e indicadores confiáveis.',
    audience: 'RH, SST e operação.',
    frequency: 'Conforme calendário de coleta (semanal/mensal).',
    prerequisites: ['Questionários padronizados.', 'Público-alvo definido.'],
    actions: [
      'Publicar formulários para coleta externa.',
      'Acompanhar taxa de resposta.',
      'Consolidar resultados e revisar consistência.',
    ],
    flow: ['Definir formulário', 'Publicar', 'Coletar', 'Consolidar', 'Analisar'],
    kpis: ['Taxa de resposta', 'Tempo de coleta', 'Respostas válidas vs inválidas'],
    commonMistakes: ['Perguntas ambíguas', 'Não validar respostas inconsistentes'],
    tips: ['Mantenha perguntas objetivas.', 'Padronize periodicidade para comparabilidade.'],
  },
  {
    id: 'operations',
    title: 'Operação Mensal',
    objective: 'Orquestrar rotina mensal com checklist de execução e governança.',
    audience: 'Gestão operacional, SST e RH.',
    frequency: 'Ciclo mensal com checkpoints semanais.',
    prerequisites: ['Calendário operacional definido.', 'Responsáveis por entrega definidos.'],
    actions: [
      'Executar checklist do ciclo mensal.',
      'Acompanhar atrasos e riscos de execução.',
      'Registrar lições aprendidas para o próximo ciclo.',
    ],
    flow: ['Planejar mês', 'Executar tarefas', 'Tratar desvios', 'Fechar ciclo', 'Retroalimentar planejamento'],
    kpis: ['% checklist mensal concluído', 'Atrasos por etapa', 'Conformidade do ciclo'],
    commonMistakes: ['Iniciar ciclo sem planejamento claro', 'Não registrar desvios recorrentes'],
    tips: ['Use rituais de governança mensal.', 'Cruze dados com Dashboard e Relatórios.'],
  },
  {
    id: 'documents',
    title: 'Documentos',
    objective: 'Centralizar evidências e documentos com controle e rastreabilidade.',
    audience: 'Todos os times com obrigações de compliance.',
    frequency: 'Upload contínuo e revisão semanal.',
    prerequisites: ['Padrão de nomenclatura definido.', 'Política de versionamento acordada.'],
    actions: [
      'Enviar documentos com contexto e classificação.',
      'Consultar por tipo, período e vínculo com ações/eventos.',
      'Gerenciar histórico de versões.',
    ],
    flow: ['Criar documento', 'Classificar', 'Versionar', 'Vincular', 'Auditar'],
    kpis: ['Documentos com versão atual', 'Evidências por ação', 'Itens sem classificação'],
    commonMistakes: ['Upload sem metadados', 'Versões paralelas sem controle'],
    tips: ['Padronize nomes.', 'Vincule evidências às ações e timeline.'],
  },
  {
    id: 'permissions',
    title: 'Permissões',
    objective: 'Definir governança de acesso por módulo e operação.',
    audience: 'Admin do tenant e segurança da informação.',
    frequency: 'Revisão trimestral e em mudanças de equipe.',
    prerequisites: ['Matriz de acesso definida.', 'Critérios de segregação de função.'],
    actions: [
      'Criar/editar perfis de acesso por módulo.',
      'Definir janelas de acesso e controles de sessão.',
      'Associar perfis por empresa para padronizar governança.',
    ],
    flow: ['Modelar perfil', 'Validar com gestor', 'Aplicar', 'Auditar efetividade'],
    kpis: ['Perfis ativos', 'Exceções de acesso', 'Tempo de aprovação de alteração'],
    commonMistakes: ['Permissões abertas além do necessário', 'Falta de revisão periódica'],
    tips: ['Revise trimestralmente.', 'Valide impacto antes de alterar perfis de produção.'],
  },
  {
    id: 'reports',
    title: 'Relatórios PGR',
    objective: 'Gerar relatórios técnicos e executivos para decisão e compliance.',
    audience: 'Gestores, SST, auditoria e diretoria.',
    frequency: 'Semanal para operação, mensal para executivos.',
    prerequisites: ['Dados atualizados.', 'Filtros e períodos definidos.'],
    actions: [
      'Emitir relatórios por período, criticidade e módulo.',
      'Exportar para apresentação e auditoria.',
      'Comparar tendência histórica dos indicadores.',
    ],
    flow: ['Definir corte', 'Gerar relatório', 'Validar consistência', 'Compartilhar'],
    kpis: ['Aderência de metas', 'Redução de criticidade', 'Evolução de fechamento de ações'],
    commonMistakes: ['Análise sem contexto temporal', 'Tomada de decisão sem olhar tendência'],
    tips: ['Compare períodos equivalentes.', 'Adapte nível técnico ao público-alvo.'],
  },
  {
    id: 'manual',
    title: 'Manual do Sistema',
    objective: 'Guia de referência para uso correto, padronização e adoção do sistema.',
    audience: 'Todos os usuários da plataforma.',
    frequency: 'Consulta contínua e durante onboarding.',
    prerequisites: ['Acesso à plataforma.', 'Permissões mínimas de visualização.'],
    actions: [
      'Pesquisar módulos e temas na busca rápida.',
      'Marcar checklist de leitura por seção.',
      'Usar navegação rápida para saltar entre áreas.',
    ],
    flow: ['Buscar tema', 'Abrir seção', 'Executar checklist', 'Aplicar no dia a dia'],
    kpis: ['Adoção do manual por equipe', 'Dúvidas recorrentes reduzidas'],
    commonMistakes: ['Não revisar atualizações do manual', 'Usar processos sem validar permissões'],
    tips: ['Este manual respeita as permissões do usuário.', 'Solicite ajuste de perfil para ver módulos bloqueados.'],
  },
];

const labelsByLang = {
  'pt-BR': {
    title: 'Manual do Sistema',
    subtitle: 'Guia completo, animado e interativo de uso do sistema, com acesso por permissões.',
    access: 'Acesso conforme perfil',
    visible: 'módulos visíveis para você',
    hiddenTitle: 'Módulos sem acesso no seu perfil',
    hiddenDescription: 'As áreas abaixo não aparecem para você no menu principal. Solicite liberação a um administrador se necessário.',
    permissionsTag: 'Permissões',
    objective: 'Objetivo',
    keyActions: 'Ações principais',
    flow: 'Fluxo recomendado',
    kpis: 'Indicadores para acompanhar',
    mistakes: 'Erros comuns a evitar',
    tips: 'Boas práticas',
    settingsTitle: 'Configurações e Perfil',
    settingsBody: 'No menu de usuário (rodapé da barra lateral), você ajusta perfil, idioma, fuso e preferências. Isso personaliza sua experiência sem alterar permissões funcionais.',
    searchPlaceholder: 'Buscar módulo, ação, indicador ou prática...',
    noResults: 'Nenhum módulo encontrado para o filtro atual.',
    noResultsHelp: 'Tente palavras-chave diferentes ou limpe os filtros.',
    expandAll: 'Expandir tudo',
    collapseAll: 'Recolher tudo',
    quickAccess: 'Acesso rápido',
    completion: 'Progresso de leitura',
    checklist: 'Checklist de uso',
    markDone: 'Marcar tudo',
    clearDone: 'Limpar marcações',
    activeAccess: 'Acesso ativo',
  },
  'en-US': {
    title: 'System Manual',
    subtitle: 'Complete, interactive and animated guide to system usage with permission-based access.',
    access: 'Profile-based access',
    visible: 'modules visible to you',
    hiddenTitle: 'Modules hidden by your profile',
    hiddenDescription: 'The areas below are not displayed in your main menu. Ask an admin for access if needed.',
    permissionsTag: 'Permissions',
    objective: 'Objective',
    keyActions: 'Key actions',
    flow: 'Recommended flow',
    kpis: 'Key indicators',
    mistakes: 'Common mistakes to avoid',
    tips: 'Best practices',
    settingsTitle: 'Settings and Profile',
    settingsBody: 'In the user menu (sidebar footer), you can update profile, language, timezone and preferences. This personalizes your experience without changing functional permissions.',
    searchPlaceholder: 'Search module, action, indicator or practice...',
    noResults: 'No modules found for the current filter.',
    noResultsHelp: 'Try different keywords or clear filters.',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
    quickAccess: 'Quick access',
    completion: 'Reading progress',
    checklist: 'Usage checklist',
    markDone: 'Mark all',
    clearDone: 'Clear checks',
    activeAccess: 'Active access',
  },
  'es-ES': {
    title: 'Manual del Sistema',
    subtitle: 'Guía completa, interactiva y animada de uso del sistema con acceso por permisos.',
    access: 'Acceso por perfil',
    visible: 'módulos visibles para ti',
    hiddenTitle: 'Módulos ocultos por tu perfil',
    hiddenDescription: 'Las áreas de abajo no aparecen en tu menú principal. Solicita acceso a un administrador si es necesario.',
    permissionsTag: 'Permisos',
    objective: 'Objetivo',
    keyActions: 'Acciones clave',
    flow: 'Flujo recomendado',
    kpis: 'Indicadores clave',
    mistakes: 'Errores comunes a evitar',
    tips: 'Buenas prácticas',
    settingsTitle: 'Configuraciones y Perfil',
    settingsBody: 'En el menú de usuario (pie de la barra lateral), puedes actualizar perfil, idioma, zona horaria y preferencias. Esto personaliza tu experiencia sin cambiar permisos funcionales.',
    searchPlaceholder: 'Buscar módulo, acción, indicador o práctica...',
    noResults: 'No se encontraron módulos para el filtro actual.',
    noResultsHelp: 'Prueba otras palabras clave o limpia filtros.',
    expandAll: 'Expandir todo',
    collapseAll: 'Colapsar todo',
    quickAccess: 'Acceso rápido',
    completion: 'Progreso de lectura',
    checklist: 'Checklist de uso',
    markDone: 'Marcar todo',
    clearDone: 'Limpiar marcas',
    activeAccess: 'Acceso activo',
  },
};

const sectionMatchesSearch = (entry: ManualEntry, query: string) => {
  if (!query.trim()) return true;
  const haystack = [
    entry.title,
    entry.objective,
    entry.audience,
    entry.frequency,
    ...entry.prerequisites,
    ...entry.actions,
    ...entry.flow,
    ...entry.kpis,
    ...entry.commonMistakes,
    ...entry.tips,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

const SystemManual: React.FC<SystemManualProps> = ({ permissions, language }) => {
  const tx = labelsByLang[language];

  const [search, setSearch] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [checklistState, setChecklistState] = React.useState<Record<string, boolean>>({});

  const visibleSections = React.useMemo(
    () => MANUAL_SECTIONS.filter((section) => permissions[section.id]?.view),
    [permissions],
  );

  const hiddenSections = React.useMemo(
    () => MANUAL_SECTIONS.filter((section) => !permissions[section.id]?.view),
    [permissions],
  );

  const filteredSections = React.useMemo(
    () => visibleSections.filter((section) => sectionMatchesSearch(section, search)),
    [visibleSections, search],
  );

  const totalChecklistItems = filteredSections.reduce((acc, section) => acc + section.actions.length, 0);
  const completedChecklistItems = filteredSections.reduce(
    (acc, section) => acc + section.actions.filter((action) => checklistState[`${section.id}-${action}`]).length,
    0,
  );

  const completionPercent = totalChecklistItems
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
    : 0;

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    filteredSections.forEach((section) => {
      next[section.id] = true;
    });
    setExpandedSections(next);
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    filteredSections.forEach((section) => {
      next[section.id] = false;
    });
    setExpandedSections(next);
  };

  const markAllSectionActions = (section: ManualEntry, value: boolean) => {
    setChecklistState((prev) => {
      const next = { ...prev };
      section.actions.forEach((action) => {
        next[`${section.id}-${action}`] = value;
      });
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/70 to-cyan-50/60 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-700">
              <BookOpenText size={13} />
              {tx.access}
            </p>
            <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900">{tx.title}</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-4xl">{tx.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right min-w-[180px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">{tx.permissionsTag}</p>
              <p className="text-2xl font-black text-emerald-700">{visibleSections.length}</p>
              <p className="text-xs text-emerald-700/90">{tx.visible}</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 min-w-[180px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">{tx.completion}</p>
              <div className="mt-2 h-2 w-full rounded-full bg-indigo-100 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500" style={{ width: `${completionPercent}%` }} />
              </div>
              <p className="mt-1 text-xs font-semibold text-indigo-700">{completionPercent}% ({completedChecklistItems}/{totalChecklistItems})</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tx.searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-700"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={expandAll} className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100">{tx.expandAll}</button>
            <button onClick={collapseAll} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">{tx.collapseAll}</button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900">
          <Settings size={16} className="text-indigo-600" />
          <h2 className="text-lg font-black">{tx.settingsTitle}</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600">{tx.settingsBody}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3">{tx.quickAccess}</p>
        <div className="flex flex-wrap gap-2">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setExpandedSections((prev) => ({ ...prev, [section.id]: true }));
                document.getElementById(`manual-section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              {section.title}
            </button>
          ))}
        </div>
      </section>

      {filteredSections.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Filter className="mx-auto text-slate-400" size={20} />
          <h3 className="mt-3 text-base font-black text-slate-800">{tx.noResults}</h3>
          <p className="text-sm text-slate-500 mt-1">{tx.noResultsHelp}</p>
        </section>
      ) : (
        <section className="space-y-4">
          {filteredSections.map((section) => {
            const isExpanded = expandedSections[section.id] ?? true;

            return (
              <article
                key={section.id}
                id={`manual-section-${section.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleExpand(section.id)}
                  className="w-full flex items-start justify-between gap-3 text-left"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-bold text-slate-700">{tx.objective}:</span> {section.objective}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      <ShieldCheck size={12} />
                      {tx.activeAccess}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Público</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">{section.audience}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Frequência</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">{section.frequency}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Pré-requisitos</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">{section.prerequisites.length}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Indicadores</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">{section.kpis.length}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                          <ClipboardList size={14} /> {tx.checklist}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => markAllSectionActions(section, true)} className="rounded-lg border border-indigo-200 bg-white px-2 py-1 text-[11px] font-bold text-indigo-700">{tx.markDone}</button>
                          <button onClick={() => markAllSectionActions(section, false)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700">{tx.clearDone}</button>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          {section.actions.map((action) => {
                            const key = `${section.id}-${action}`;
                            const checked = !!checklistState[key];
                            return (
                              <li key={action} className="flex items-start gap-2">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => setChecklistState((prev) => ({ ...prev, [key]: e.target.checked }))}
                                  className="mt-1 h-4 w-4 rounded border-slate-300"
                                />
                                <span className={checked ? 'line-through text-slate-400' : ''}>{action}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-cyan-700 flex items-center gap-1">
                          <Workflow size={14} /> {tx.flow}
                        </p>
                        <ol className="mt-2 space-y-2 text-sm text-slate-700 list-decimal pl-5">
                          {section.flow.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                          <Gauge size={14} /> {tx.kpis}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-slate-700">
                          {section.kpis.map((kpi) => (
                            <li key={kpi} className="flex gap-2"><Target size={14} className="mt-0.5 shrink-0 text-emerald-600" />{kpi}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1">
                          <AlertTriangle size={14} /> {tx.mistakes}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-slate-700">
                          {section.commonMistakes.map((mistake) => (
                            <li key={mistake} className="flex gap-2"><CircleHelp size={14} className="mt-0.5 shrink-0 text-rose-600" />{mistake}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                          <Sparkles size={14} /> {tx.tips}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-slate-700">
                          {section.tips.map((tip) => (
                            <li key={tip} className="flex gap-2"><CalendarCheck2 size={14} className="mt-0.5 shrink-0 text-amber-600" />{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {hiddenSections.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-base font-black text-slate-800">{tx.hiddenTitle}</h3>
          <p className="mt-1 text-sm text-slate-600">{tx.hiddenDescription}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {hiddenSections.map((section) => (
              <span key={section.id} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                <CheckCircle2 size={12} className="text-slate-400" />
                {section.title}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SystemManual;
