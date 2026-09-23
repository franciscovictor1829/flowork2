export type TabType = 
  | 'dashboard-do-gestor' 
  | 'demandas-e-processos' 
  | 'espaco-do-funcionario' 
  | 'ponto-e-ranking'
  | 'equipe-e-acessos'
  | 'personalizacao-perfil';

export type UserRole = 'gestor' | 'co-gestor' | 'colaborador';

export interface UserAccount {
  id: string;
  name: string;
  email?: string;
  personalNumber?: string; // Número pessoal para login do colaborador (sem email)
  password?: string;
  roleTitle: string;
  department: string;
  avatar: string; // URL da foto enviada pelo usuário ou vazio para avatar de iniciais
  role: UserRole;
  isCoGestor?: boolean;
  initials: string;
  createdAt?: string;
  lastLogin?: string;
  status?: 'ativo' | 'bloqueado' | 'primeiro_acesso';
  phone?: string;
  companyName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  personalNumber?: string;
  roleTitle: string;
  department: string;
  avatar: string;
  role: UserRole;
  isCoGestor?: boolean;
  initials: string;
  phone?: string;
  companyName?: string;
}

export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type DemandStatus = 'Pendente' | 'Em Andamento' | 'Concluída' | 'Atrasada';

export interface ChecklistItem {
  id: string;
  text: string;
  subtext?: string;
  completed: boolean;
}

export type Department =
  | 'Marketing e Vendas'
  | 'Financeiro'
  | 'Logística'
  | 'Gestão de Pessoas (RH)';

export const VALID_DEPARTMENTS: Department[] = [
  'Marketing e Vendas',
  'Financeiro',
  'Logística',
  'Gestão de Pessoas (RH)',
];

export interface Demand {
  id: string;
  protocol: string;
  title: string;
  description: string;
  department: Department;
  assigneeName: string;
  assigneeRole: string;
  assigneeAvatar: string;
  assigneeInitials: string;
  requesterName: string;
  requesterRole: string;
  requesterAvatar: string;
  priority: Priority;
  status: DemandStatus;
  progressPercent: number;
  deadlineDisplay: string;
  deadlineRelative: string;
  createdAtRelative: string;
  slaBreach?: boolean;
  checklist?: ChecklistItem[];
}

export interface TeamMemberLiveStatus {
  id: string;
  name: string;
  personalNumber?: string;
  department: string;
  avatar: string;
  initials: string;
  tasksCount: number;
  status: 'online' | 'pause' | 'offline';
  statusText: string;
  punchStatus: 'Ponto Ok' | 'Em Pausa' | 'Ausente';
  punchTime: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'approval' | 'sla_breach' | 'milestone';
  read?: boolean;
  reqId?: string;
}

export interface PunchSlot {
  slot: number;
  label: string;
  time: string;
  statusText: string;
  completed: boolean;
  isCurrent?: boolean;
}

export interface DailyLedger {
  dayName: string;
  dateStr: string;
  punch1: string;
  punch2: string;
  punch3: string;
  punch4: string;
  hoursWorked: string;
  balance: string;
  isToday?: boolean;
  isFuture?: boolean;
}

export interface LeaderboardEntry {
  position: number;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  initials?: string;
  isCurrentUser?: boolean;
  isAnonymized?: boolean;
  anonymousId?: string;
  statusBadge?: string;
  statusTrend?: 'up' | 'double_up' | 'stable' | 'down';
  slaScore?: string;
  relativeStatus: string;
}
