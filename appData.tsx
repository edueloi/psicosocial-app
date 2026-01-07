import React, { createContext, useContext, useMemo, useState } from 'react';
import { ActionPlanItem, ActionStatus, ActionType, RiskType, TimelineEvent } from './types';

type AppDataContextValue = {
  actions: ActionPlanItem[];
  events: TimelineEvent[];
  addAction: (action: ActionPlanItem) => void;
  addActionFromRisk: (risk: { id: string; description: string; category: RiskType; level: string }) => void;
  addEvidence: (actionId: string) => void;
  completeAction: (actionId: string) => void;
  addEvent: (event: TimelineEvent) => void;
  navigate: (tab: string) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

const buildId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const buildHash = () => `sha256:${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`;

const initialActions: ActionPlanItem[] = [
  { 
    id: 'a1', 
    title: 'Workshop Preventivo: Saude Mental', 
    responsible: 'Ana RH', 
    dueDate: '2024-05-20', 
    status: ActionStatus.PENDING, 
    desc: 'Treinamento obrigatorio para gestores sobre prevencao ao burnout e assedio.',
    riskId: 'r2',
    riskName: 'Carga Mental Elevada',
    riskCategory: RiskType.PSYCHOSOCIAL,
    riskLevel: 'Crítico',
    actionType: ActionType.TRAINING,
    expectedImpact: 'Redução de severidade Crítico -> Moderado',
    evidenceCount: 0
  },
  { 
    id: 'a2', 
    title: 'Troca de Filtros Exaustao Pintura', 
    responsible: 'Carlos Manutencao', 
    dueDate: '2023-10-15', 
    status: ActionStatus.PENDING, 
    desc: 'Substituicao periodica obrigatoria conforme cronograma de manutencao.',
    riskId: 'r4',
    riskName: 'Inalação de Solventes',
    riskCategory: RiskType.CHEMICAL,
    riskLevel: 'Crítico',
    actionType: ActionType.ENGINEERING,
    expectedImpact: 'Controle na fonte / blindagem fiscal',
    evidenceCount: 1
  },
  { 
    id: 'a3', 
    title: 'Substituicao Mobiliario Ergonomico', 
    responsible: 'Patrimonio', 
    dueDate: '2024-12-05', 
    status: ActionStatus.IN_PROGRESS, 
    desc: 'Troca de cadeiras no faturamento conforme laudo ergonomico.',
    riskId: 'r3',
    riskName: 'Postura Inadequada',
    riskCategory: RiskType.ERGONOMIC,
    riskLevel: 'Moderado',
    actionType: ActionType.ADMINISTRATIVE,
    expectedImpact: 'Prevencao de afastamentos',
    evidenceCount: 2
  },
  { 
    id: 'a4', 
    title: 'Implantação Canal de Ouvidoria', 
    responsible: 'Dr. Roberto Santos', 
    dueDate: '2023-09-30', 
    status: ActionStatus.COMPLETED, 
    desc: 'Sistema de relatos anonimos para gestao de riscos interpessoais.',
    riskId: 'r2',
    riskName: 'Conflitos Lideranca',
    riskCategory: RiskType.PSYCHOSOCIAL,
    riskLevel: 'Moderado',
    actionType: ActionType.ADMINISTRATIVE,
    expectedImpact: 'Rastreabilidade e compliance NR-01',
    evidenceCount: 3
  },
];

const initialEvents: TimelineEvent[] = [
  { 
    id: 'ev-1',
    date: '2024-04-10', 
    title: 'Reavaliação de Riscos (Gestão de Mudanca)', 
    desc: 'Unidade Norte: troca de maquinario no setor de producao disparou gatilho de revisao do PGR conforme NR-01.', 
    type: 'change', 
    legalRef: 'NR-01, 1.5.4.4.6',
    validity: 'Vigente',
    linkLabel: 'Ir para Inventário',
    linkTarget: 'inventory',
    auditVersion: 'v2.4.1',
    evidenceHash: buildHash()
  },
  { 
    id: 'ev-2',
    date: '2024-03-25', 
    title: 'Consolidação de Diagnóstico Psicossocial', 
    desc: 'Conclusao da pesquisa trimestral. Score de clima em 82/100. Identificado hotspot no Comercial.', 
    type: 'psychosocial', 
    legalRef: 'NR-01, 1.5.3.1',
    validity: 'Reavaliar em 90 dias',
    linkLabel: 'Ver Diagnóstico',
    linkTarget: 'psychosocial',
    auditVersion: 'v2.4.0',
    evidenceHash: buildHash()
  },
  { 
    id: 'ev-3',
    date: '2024-03-12', 
    title: 'Treinamento de Lideranca: Assédio', 
    desc: 'Concluído por 95% dos gestores das unidades administrativas. Lista de presenca assinada digitalmente.', 
    type: 'training', 
    legalRef: 'NR-01, 1.4.1 (g)',
    validity: 'Vigente',
    linkLabel: 'Lista de Presença',
    linkTarget: 'reports',
    auditVersion: 'v2.3.9',
    evidenceHash: buildHash()
  },
  { 
    id: 'ev-4',
    date: '2023-11-15', 
    title: 'Assinatura Digital PGR v2.3', 
    desc: 'PGR revisado e assinado eletronicamente pelo responsavel tecnico Dr. Roberto Santos.', 
    type: 'document', 
    legalRef: 'NR-01, 1.5.4.1',
    validity: 'Vencido',
    linkLabel: 'Ver PDF Assinado',
    linkTarget: 'reports',
    auditVersion: 'v2.3.0',
    evidenceHash: buildHash()
  },
];

export const AppDataProvider: React.FC<{ children: React.ReactNode; onNavigate: (tab: string) => void }> = ({ children, onNavigate }) => {
  const [actions, setActions] = useState<ActionPlanItem[]>(initialActions);
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);

  const addEvent = (event: TimelineEvent) => {
    setEvents(prev => [event, ...prev]);
  };

  const addAction = (action: ActionPlanItem) => {
    setActions(prev => [action, ...prev]);
    addEvent({
      id: buildId('ev'),
      date: new Date().toISOString().slice(0, 10),
      title: `Ação criada: ${action.title}`,
      desc: `Ação vinculada ao risco ${action.riskName}.`,
      type: 'action',
      legalRef: 'NR-01, 1.5.3.1',
      validity: 'Vigente',
      linkLabel: 'Ir para Plano de Ação',
      linkTarget: 'actions',
      auditVersion: 'v2.4.2',
      evidenceHash: buildHash()
    });
  };

  const addActionFromRisk = (risk: { id: string; description: string; category: RiskType; level: string }) => {
    addAction({
      id: buildId('a'),
      title: `Mitigação: ${risk.description}`,
      responsible: 'Equipe SST',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: ActionStatus.PENDING,
      desc: 'Ação criada a partir do inventario de riscos.',
      riskId: risk.id,
      riskName: risk.description,
      riskCategory: risk.category,
      riskLevel: risk.level,
      actionType: ActionType.ADMINISTRATIVE,
      expectedImpact: 'Redução de severidade',
      evidenceCount: 0
    });
    onNavigate('actions');
  };

  const addEvidence = (actionId: string) => {
    setActions(prev => prev.map(action => {
      if (action.id !== actionId) return action;
      const nextCount = action.evidenceCount + 1;
      const nextStatus = action.status === ActionStatus.PENDING ? ActionStatus.IN_PROGRESS : action.status;
      return { ...action, evidenceCount: nextCount, status: nextStatus };
    }));
  };

  const completeAction = (actionId: string) => {
    setActions(prev => prev.map(action => {
      if (action.id !== actionId) return action;
      if (action.evidenceCount <= 0) return action;
      return { ...action, status: ActionStatus.COMPLETED };
    }));

    const completed = actions.find(action => action.id === actionId);
    if (completed) {
      addEvent({
        id: buildId('ev'),
        date: new Date().toISOString().slice(0, 10),
        title: `Ação concluida: ${completed.title}`,
        desc: `Evidências anexadas: ${completed.evidenceCount}.`,
        type: 'action',
        legalRef: 'NR-01, 1.5.3.1',
        validity: 'Vigente',
        linkLabel: 'Ver Plano de Ação',
        linkTarget: 'actions',
        auditVersion: 'v2.4.2',
        evidenceHash: buildHash()
      });
    }
  };

  const value = useMemo<AppDataContextValue>(() => ({
    actions,
    events,
    addAction,
    addActionFromRisk,
    addEvidence,
    completeAction,
    addEvent,
    navigate: onNavigate
  }), [actions, events, onNavigate]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
};

