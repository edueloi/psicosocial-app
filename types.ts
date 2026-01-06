
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  ADMINISTRATOR = 'ADMINISTRATOR',
  SST_CONSULTANT = 'SST_CONSULTANT',
  RH_MANAGER = 'RH_MANAGER',
  AUDITOR = 'AUDITOR',
  EMPLOYEE = 'EMPLOYEE'
}

export enum UserStatus {
  ACTIVE = 'Ativo',
  SUSPENDED = 'Suspenso',
  REVOKED = 'Revogado',
  PENDING = 'Pendente'
}

export enum RiskType {
  PHYSICAL = 'Físico',
  CHEMICAL = 'Químico',
  BIOLOGICAL = 'Biológico',
  ERGONOMIC = 'Ergonômico',
  PSYCHOSOCIAL = 'Psicossocial'
}

export enum RiskLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

export enum ActionStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluído',
  OVERDUE = 'Atrasado'
}

export enum ActionType {
  ENGINEERING = 'Engenharia',
  ADMINISTRATIVE = 'Administrativa',
  TRAINING = 'Treinamento',
  PSYCHOSOCIAL = 'Psicossocial'
}

export enum IncidentStatus {
  RECEIVED = 'Recebido',
  IN_ANALYSIS = 'Em Análise',
  ACTION_CREATED = 'Ação Criada',
  CLOSED = 'Encerrado'
}

export interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  rtName?: string;
  rtLicense?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  tenantId: string;
  psychosocialAccess: boolean;
  lastAccess?: string;
  lastIp?: string;
  device?: string;
}

export interface RiskHistoryEntry {
  date: string;
  reason: string;
  previousScore: number;
  newScore: number;
  responsible: string;
}

export interface RiskEntry {
  id: string;
  type: RiskType;
  description: string;
  source: string;
  probability: number;
  severity: number;
  controls: string[];
  history?: RiskHistoryEntry[];
  lastReview?: string;
  validUntil?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  responsible: string;
  dueDate: string;
  status: ActionStatus;
  tenantId: string;
  evidenceCount: number;
  riskId: string;
  riskCategory: RiskType;
  riskLevel: string;
  actionType: ActionType;
  expectedImpact: string;
}

export interface ComplianceEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'Risk' | 'Training' | 'Survey' | 'Incident' | 'Audit';
}

export interface Sector {
  id: string;
  name: string;
  responsible: string;
  employees: number;
  risksCount: number;
  hasCriticalRisk: boolean;
  status: 'Ativo' | 'Em Reestruturação' | 'Inativo';
  lastReviewDate: string;
  nextReviewDate: string;
  reviewOverdue: boolean;
}

export interface Unit {
  id: string;
  name: string;
  type: string;
  address: string;
  responsible: string;
  status: 'Ativo' | 'Em Reestruturação' | 'Inativo';
  sectors: Sector[];
}
