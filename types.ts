
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  SST_CONSULTANT = 'SST_CONSULTANT',
  RH_MANAGER = 'RH_MANAGER',
  EMPLOYEE = 'EMPLOYEE'
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
  tenantId: string;
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
}

export interface ComplianceEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'Risk' | 'Training' | 'Survey' | 'Incident' | 'Audit';
}
