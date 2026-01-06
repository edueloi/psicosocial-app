
import React from 'react';
import { LayoutDashboard, ShieldAlert, ClipboardList, Users, FileText, BrainCircuit, Building2, History, ShieldCheck } from 'lucide-react';
import { UserRole, Tenant, User, ActionStatus } from './types';

export const MOCK_TENANTS: Tenant[] = [
  { 
    id: 't1', 
    name: 'Grupo Atividade Laboral', 
    cnpj: '12.345.678/0001-90', 
    plan: 'Pro',
    rtName: 'Dr. Roberto Santos',
    rtLicense: 'CRM/SST 12345-SP'
  },
  { 
    id: 't2', 
    name: 'TecnoCorp Soluções', 
    cnpj: '98.765.432/0001-11', 
    plan: 'Enterprise',
    rtName: 'Eng. Amanda Silva',
    rtLicense: 'CREA 987654/D'
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin Master', email: 'admin@laboral.com', role: UserRole.TENANT_ADMIN, tenantId: 't1' },
  { id: 'u2', name: 'Dr. Roberto SST', email: 'roberto@sst.com', role: UserRole.SST_CONSULTANT, tenantId: 't1' },
  { id: 'u3', name: 'Ana RH', email: 'ana@rh.com', role: UserRole.RH_MANAGER, tenantId: 't1' }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT, UserRole.RH_MANAGER, UserRole.SUPER_ADMIN] },
  { id: 'inventory', label: 'Gestão de Riscos', icon: <ShieldAlert size={20} />, roles: [UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT] },
  { id: 'actions', label: 'Plano de Ação', icon: <ClipboardList size={20} />, roles: [UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT, UserRole.RH_MANAGER] },
  { id: 'psychosocial', label: 'Psicossocial', icon: <BrainCircuit size={20} />, roles: [UserRole.TENANT_ADMIN, UserRole.RH_MANAGER, UserRole.SST_CONSULTANT] },
  { id: 'audit', label: 'Status Auditoria', icon: <ShieldCheck size={20} />, roles: [UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT] },
  { id: 'timeline', label: 'Timeline NR-01', icon: <History size={20} />, roles: [UserRole.TENANT_ADMIN, UserRole.RH_MANAGER] },
  { id: 'users', label: 'Usuários', icon: <Users size={20} />, roles: [UserRole.TENANT_ADMIN] },
  { id: 'units', label: 'Unidades', icon: <Building2 size={20} />, roles: [UserRole.TENANT_ADMIN] },
  { id: 'reports', label: 'Relatórios PGR', icon: <FileText size={20} />, roles: [UserRole.TENANT_ADMIN, UserRole.SST_CONSULTANT] },
];

export const STATUS_COLORS = {
  [ActionStatus.PENDING]: 'bg-amber-100 text-amber-700 border-amber-200',
  [ActionStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ActionStatus.COMPLETED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [ActionStatus.OVERDUE]: 'bg-rose-100 text-rose-700 border-rose-200',
};
