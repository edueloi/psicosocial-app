import React from 'react';
import { AppModuleId, ModulePermissions, UserPreferences } from '../types';
import { BookOpenText, CheckCircle2, ShieldCheck, Sparkles, Workflow, Settings } from 'lucide-react';

type ManualEntry = {
  id: AppModuleId;
  title: string;
  objective: string;
  actions: string[];
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
    objective: 'Visão executiva dos indicadores, alertas críticos e prioridades do dia.',
    actions: [
      'Validar cards de risco, pendências e tendências antes de iniciar a operação.',
      'Trocar visão Técnica/Executiva para adaptar o nível de detalhe.',
      'Usar os gráficos para identificar áreas com maior exposição e necessidade de intervenção.',
    ],
    tips: [
      'Comece sempre pelo Dashboard para decidir quais módulos priorizar.',
      'Use os alertas como gatilho para abrir Plano de Ação e Gestão de Riscos.',
    ],
  },
  {
    id: 'inventory',
    title: 'Gestão de Riscos',
    objective: 'Mapeamento, avaliação e acompanhamento de riscos ocupacionais e psicossociais.',
    actions: [
      'Cadastrar riscos por tipo, fonte e impacto no ambiente de trabalho.',
      'Revisar probabilidade e severidade para recalcular criticidade.',
      'Registrar controles existentes e histórico de revisão para auditoria.',
    ],
    tips: [
      'Padronize descrições dos riscos para melhorar relatórios e rastreabilidade.',
      'Após alteração relevante, revise ações vinculadas para manter coerência.',
    ],
  },
  {
    id: 'actions',
    title: 'Plano de Ação',
    objective: 'Planejamento e execução das ações preventivas/corretivas com responsáveis e prazos.',
    actions: [
      'Criar ações com responsável, prazo e impacto esperado.',
      'Acompanhar status (Pendente, Em Andamento, Concluído e Atrasado).',
      'Anexar evidências para comprovar cumprimento de requisitos.',
    ],
    tips: [
      'Mantenha prazos realistas e responsáveis definidos para evitar atrasos recorrentes.',
      'Priorize ações ligadas a riscos críticos e não conformidades auditáveis.',
    ],
  },
  {
    id: 'psychosocial',
    title: 'Psicossocial',
    objective: 'Gestão dos fatores psicossociais com monitoramento de sinais, planos e acompanhamento.',
    actions: [
      'Avaliar fatores de sobrecarga, clima, assédio e estresse ocupacional.',
      'Registrar ocorrências e planos de mitigação com foco em prevenção.',
      'Acompanhar indicadores de saúde mental e risco psicossocial por área.',
    ],
    tips: [
      'Mantenha confidencialidade e linguagem adequada em registros sensíveis.',
      'Cruze dados com ações e auditoria para demonstrar efetividade do programa.',
    ],
  },
  {
    id: 'audit',
    title: 'Status Auditoria',
    objective: 'Acompanhamento da prontidão para auditorias e conformidade regulatória.',
    actions: [
      'Verificar checklist de conformidade por requisito aplicável.',
      'Identificar lacunas, evidências pendentes e responsáveis por regularização.',
      'Atualizar status de prontidão conforme evolução das entregas.',
    ],
    tips: [
      'Use esta área antes de auditorias internas/externas para reduzir surpresas.',
      'Conecte pendências com Plano de Ação para fechar ciclo de conformidade.',
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline NR-01',
    objective: 'Histórico cronológico de eventos, revisões e evidências da gestão.',
    actions: [
      'Consultar eventos por data e tipo (mudança, ação, documento, treinamento).',
      'Validar vínculo com versões e evidências para trilha de auditoria.',
      'Usar o histórico para comprovar evolução contínua do programa.',
    ],
    tips: [
      'Mantenha cadência de atualização para preservar histórico confiável.',
      'Eventos com documentação fortalecem defesa técnica em fiscalizações.',
    ],
  },
  {
    id: 'users',
    title: 'Usuários',
    objective: 'Cadastro e governança de acessos dos usuários do tenant.',
    actions: [
      'Criar usuários com perfil e vínculo de empresa/área.',
      'Atualizar status (Ativo, Suspenso, Revogado, Pendente).',
      'Revisar permissões periodicamente conforme princípio do menor privilégio.',
    ],
    tips: [
      'Evite contas genéricas para garantir rastreabilidade de ações.',
      'Revogue acessos de desligamentos imediatamente.',
    ],
  },
  {
    id: 'units',
    title: 'Unidades',
    objective: 'Estruturação de unidades e setores para organizar a gestão por operação.',
    actions: [
      'Cadastrar unidades com responsáveis e status operacional.',
      'Mapear setores com quantidade de colaboradores e riscos associados.',
      'Monitorar datas de revisão para evitar vencimentos.',
    ],
    tips: [
      'Estrutura organizacional correta melhora qualidade dos indicadores.',
      'Use revisão periódica para manter base atualizada e auditável.',
    ],
  },
  {
    id: 'forms',
    title: 'Forms Externos',
    objective: 'Coleta estruturada de dados externos para alimentar indicadores e análises.',
    actions: [
      'Publicar e acompanhar formulários para coleta de informações de campo.',
      'Consolidar respostas para apoiar decisões e planos de ação.',
      'Revisar consistência dos dados recebidos antes de publicar análises.',
    ],
    tips: [
      'Defina perguntas objetivas e alinhadas aos objetivos da análise.',
      'Padronize periodicidade de coleta para manter comparabilidade histórica.',
    ],
  },
  {
    id: 'operations',
    title: 'Operação Mensal',
    objective: 'Ritmo de execução mensal com checklist, entregas e monitoramento de performance.',
    actions: [
      'Executar rotina mensal e validar status das entregas operacionais.',
      'Conferir itens críticos, atrasos e pendências por responsável.',
      'Registrar evolução e pontos de atenção para o próximo ciclo.',
    ],
    tips: [
      'Use este módulo como ritual de governança mensal.',
      'Integre com Dashboard e Relatórios para visão de desempenho.',
    ],
  },
  {
    id: 'documents',
    title: 'Documentos',
    objective: 'Centralização e controle de documentos, evidências e versões.',
    actions: [
      'Upload de documentos com classificação e contexto.',
      'Consulta por tipo, data e relação com ações/eventos.',
      'Manter histórico de versões para rastreabilidade completa.',
    ],
    tips: [
      'Padronize nomenclatura para facilitar buscas futuras.',
      'Vincule documentos relevantes às ações e à timeline.',
    ],
  },
  {
    id: 'permissions',
    title: 'Permissões',
    objective: 'Definição de perfis de acesso e controle granular por módulo.',
    actions: [
      'Criar/editar perfis com regras de visualização, criação, edição e exportação.',
      'Definir janela de acesso, bloqueio externo e expiração de sessão.',
      'Associar perfis às empresas para padronizar governança de acesso.',
    ],
    tips: [
      'Revisões trimestrais de permissão reduzem risco de acesso indevido.',
      'Sempre valide impacto antes de alterar perfis em produção.',
    ],
  },
  {
    id: 'reports',
    title: 'Relatórios PGR',
    objective: 'Geração de relatórios consolidados para gestão, auditoria e tomada de decisão.',
    actions: [
      'Emitir relatórios com filtros por período, módulo e criticidade.',
      'Exportar dados para apresentação executiva e compliance.',
      'Comparar evolução de indicadores para medir eficácia de ações.',
    ],
    tips: [
      'Use cortes por período para análises de tendência mais precisas.',
      'Combine relatórios técnicos e executivos para públicos diferentes.',
    ],
  },
  {
    id: 'manual',
    title: 'Manual do Sistema',
    objective: 'Guia oficial de funcionamento, fluxos e boas práticas por módulo.',
    actions: [
      'Consultar este manual sempre que houver dúvidas operacionais.',
      'Validar recursos visíveis conforme seu perfil de permissão.',
      'Usar as recomendações para padronizar o uso entre equipes.',
    ],
    tips: [
      'Este conteúdo é dinâmico e respeita o que seu perfil pode visualizar.',
      'Para acessar mais módulos, solicite ajuste no perfil de permissões.',
    ],
  },
];

const labelsByLang = {
  'pt-BR': {
    title: 'Manual do Sistema',
    subtitle: 'Guia completo de uso e funcionamento, organizado por módulo e filtrado conforme suas permissões.',
    access: 'Acesso conforme perfil',
    visible: 'módulos visíveis para você',
    hiddenTitle: 'Módulos sem acesso no seu perfil',
    hiddenDescription: 'As áreas abaixo não aparecem para você no menu principal. Solicite liberação a um administrador se necessário.',
    permissionsTag: 'Permissões',
    objective: 'Objetivo',
    keyActions: 'Ações principais',
    tips: 'Boas práticas',
    settingsTitle: 'Configurações e Perfil',
    settingsBody: 'O menu de usuário (canto inferior da barra lateral) permite atualizar dados do perfil, idioma, fuso e preferências. Esse ajuste impacta sua experiência sem alterar permissões de módulos.',
  },
  'en-US': {
    title: 'System Manual',
    subtitle: 'Complete guide to usage and behavior by module, filtered by your permission profile.',
    access: 'Profile-based access',
    visible: 'modules visible to you',
    hiddenTitle: 'Modules hidden by your profile',
    hiddenDescription: 'The areas below are not displayed in your main menu. Ask an admin for access if needed.',
    permissionsTag: 'Permissions',
    objective: 'Objective',
    keyActions: 'Key actions',
    tips: 'Best practices',
    settingsTitle: 'Settings and Profile',
    settingsBody: 'The user menu (bottom of the sidebar) lets you update profile data, language, timezone and preferences. These settings change your experience but not module permissions.',
  },
  'es-ES': {
    title: 'Manual del Sistema',
    subtitle: 'Guía completa de uso y funcionamiento por módulo, filtrada según tu perfil de permisos.',
    access: 'Acceso por perfil',
    visible: 'módulos visibles para ti',
    hiddenTitle: 'Módulos ocultos por tu perfil',
    hiddenDescription: 'Las áreas de abajo no aparecen en tu menú principal. Solicita acceso a un administrador si es necesario.',
    permissionsTag: 'Permisos',
    objective: 'Objetivo',
    keyActions: 'Acciones clave',
    tips: 'Buenas prácticas',
    settingsTitle: 'Configuraciones y Perfil',
    settingsBody: 'El menú de usuario (parte inferior de la barra lateral) permite actualizar perfil, idioma, zona horaria y preferencias. Eso cambia tu experiencia, no tus permisos de módulos.',
  },
};

const SystemManual: React.FC<SystemManualProps> = ({ permissions, language }) => {
  const tx = labelsByLang[language];

  const visibleSections = MANUAL_SECTIONS.filter((section) => permissions[section.id]?.view);
  const hiddenSections = MANUAL_SECTIONS.filter((section) => !permissions[section.id]?.view);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/70 to-cyan-50/50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-700">
              <BookOpenText size={13} />
              {tx.access}
            </p>
            <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900">{tx.title}</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl">{tx.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">{tx.permissionsTag}</p>
            <p className="text-2xl font-black text-emerald-700">{visibleSections.length}</p>
            <p className="text-xs text-emerald-700/90">{tx.visible}</p>
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

      <section className="space-y-4">
        {visibleSections.map((section) => (
          <article key={section.id} className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                <p className="mt-2 text-sm text-slate-600"><span className="font-bold text-slate-700">{tx.objective}:</span> {section.objective}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                <ShieldCheck size={12} />
                Acesso ativo
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">{tx.keyActions}</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {section.actions.map((action) => (
                    <li key={action} className="flex gap-2"><Workflow size={15} className="mt-0.5 shrink-0 text-indigo-500" />{action}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-amber-600">{tx.tips}</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {section.tips.map((tip) => (
                    <li key={tip} className="flex gap-2"><Sparkles size={15} className="mt-0.5 shrink-0 text-amber-500" />{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

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
