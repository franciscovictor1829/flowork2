'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { LoginView } from '@/components/auth/LoginView';
import { ManagerDashboardView } from '@/components/views/ManagerDashboardView';
import { EmployeeHubView } from '@/components/views/EmployeeHubView';
import { DemandManagementView } from '@/components/views/DemandManagementView';
import { TimeAndRankingView } from '@/components/views/TimeAndRankingView';
import { TeamManagementView } from '@/components/views/TeamManagementView';
import { ProfileCustomizationView } from '@/components/views/ProfileCustomizationView';
import { NewDemandModal } from '@/components/modals/NewDemandModal';
import { PunchClockModal } from '@/components/modals/PunchClockModal';
import { ReportModal } from '@/components/modals/ReportModal';
import { AdjustTimeModal } from '@/components/modals/AdjustTimeModal';
import { DemandDetailModal } from '@/components/modals/DemandDetailModal';
import { AddTeamMemberModal } from '@/components/modals/AddTeamMemberModal';
import {
  TabType,
  Demand,
  UserRole,
  AlertItem,
  PunchSlot,
  UserAccount,
  TeamMemberLiveStatus,
  UserProfile,
} from '@/lib/types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_DEMANDS,
  TEAM_MEMBERS,
  INITIAL_ALERTS,
  SAMPLE_DEMANDS,
} from '@/lib/mockData';
import { ShieldAlert, X } from 'lucide-react';

export default function Home() {
  // Accounts State (Manager + Employees with logins) with lazy initializer
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('conecta_accounts');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_ACCOUNTS;
  });

  // Current authenticated user session with lazy initializer
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('conecta_current_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.id) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_ACCOUNTS[0]; // Default: Carlos Eduardo (Gestor)
  });

  // Active Tab State with lazy initializer
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('conecta_current_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.role === 'colaborador') return 'espaco-do-funcionario';
        }
      } catch {
        // fallback
      }
    }
    return 'dashboard-do-gestor';
  });

  const [demands, setDemands] = useState<Demand[]>(INITIAL_DEMANDS);
  const [teamMembers, setTeamMembers] = useState<TeamMemberLiveStatus[]>(TEAM_MEMBERS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  // Modals state
  const [isNewDemandModalOpen, setIsNewDemandModalOpen] = useState(false);
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);

  // Today's punch cards (ZERADOS)
  const [todayPunches, setTodayPunches] = useState<PunchSlot[]>([
    {
      slot: 1,
      label: '1º Entrada',
      time: '--:--',
      statusText: 'Aguardando registro',
      completed: false,
      isCurrent: true,
    },
    {
      slot: 2,
      label: '2º Almoço',
      time: '--:--',
      statusText: 'Pendente',
      completed: false,
      isCurrent: false,
    },
    {
      slot: 3,
      label: '3º Retorno',
      time: '--:--',
      statusText: 'Pendente',
      completed: false,
      isCurrent: false,
    },
    {
      slot: 4,
      label: '4º Saída',
      time: '--:--',
      statusText: 'Pendente',
      completed: false,
      isCurrent: false,
    },
  ]);

  // Derived effective tab: strict RBAC guard without cascading render
  const isColaborador = currentUser?.role === 'colaborador';
  const effectiveTab: TabType =
    isColaborador && (currentTab === 'dashboard-do-gestor' || currentTab === 'equipe-e-acessos')
      ? 'espaco-do-funcionario'
      : currentTab;

  // Derived active profile
  const activeProfile: UserProfile = currentUser
    ? {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        personalNumber: currentUser.personalNumber,
        roleTitle: currentUser.roleTitle,
        department: currentUser.department,
        avatar: currentUser.avatar,
        role: currentUser.role,
        initials: currentUser.initials,
      }
    : {
        id: 'anon',
        name: 'Usuário',
        email: 'usuario@conecta.com',
        roleTitle: 'Visitante',
        department: 'Operações',
        avatar: '',
        role: 'colaborador',
        initials: 'US',
      };

  // Login handler
  const handleLogin = (account: UserAccount) => {
    setCurrentUser(account);
    if (account.role === 'colaborador') {
      setCurrentTab('espaco-do-funcionario');
    } else {
      setCurrentTab('dashboard-do-gestor');
    }
    try {
      localStorage.setItem('conecta_current_user', JSON.stringify(account));
    } catch {
      // ignore
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('conecta_current_user');
    } catch {
      // ignore
    }
  };

  // Create new manager from scratch
  const handleCreateManager = (newManager: UserAccount) => {
    const updated = [newManager, ...accounts];
    setAccounts(updated);
    try {
      localStorage.setItem('conecta_accounts', JSON.stringify(updated));
    } catch {
      // ignore
    }
    handleLogin(newManager);
  };

  // Update profile
  const handleUpdateProfile = (updated: UserAccount) => {
    setCurrentUser(updated);
    const updatedList = accounts.map((acc) => (acc.id === updated.id ? updated : acc));
    setAccounts(updatedList);
    try {
      localStorage.setItem('conecta_current_user', JSON.stringify(updated));
      localStorage.setItem('conecta_accounts', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  };

  // Add team member and create their login
  const handleAddTeamMember = (newAccount: UserAccount, newMemberStatus: TeamMemberLiveStatus) => {
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    setTeamMembers((prev) => [...prev, newMemberStatus]);

    try {
      localStorage.setItem('conecta_accounts', JSON.stringify(updatedAccounts));
    } catch {
      // ignore
    }

    setAlerts((prev) => [
      {
        id: `alert-user-${Date.now()}`,
        title: 'Novo Colaborador Cadastrado',
        description: `Matrícula ${newAccount.personalNumber || 'gerada'} atribuída a ${newAccount.name} (${newAccount.department}). Login sem e-mail ativo.`,
        timeAgo: 'Agora',
        type: 'milestone',
      },
      ...prev,
    ]);
  };

  // Switch session (testing convenience for manager)
  const handleSwitchUser = (account: UserAccount) => {
    handleLogin(account);
  };

  // Update member access role (Colaborador <-> Co-Gestor <-> Gestor)
  const handleUpdateMemberRole = (userId: string, newRole: UserRole) => {
    const updatedAccounts = accounts.map((acc) =>
      acc.id === userId
        ? {
            ...acc,
            role: newRole,
            isCoGestor: newRole === 'co-gestor',
            roleTitle:
              newRole === 'gestor'
                ? 'Gestor Titular'
                : newRole === 'co-gestor'
                ? 'Co-Gestor Operacional'
                : acc.roleTitle.includes('Gestor')
                ? `Especialista de ${acc.department}`
                : acc.roleTitle,
          }
        : acc
    );
    setAccounts(updatedAccounts);

    try {
      localStorage.setItem('conecta_accounts', JSON.stringify(updatedAccounts));
    } catch {
      // ignore
    }

    if (currentUser?.id === userId) {
      const updatedUser = {
        ...currentUser,
        role: newRole,
        isCoGestor: newRole === 'co-gestor',
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('conecta_current_user', JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
    }

    const target = accounts.find((a) => a.id === userId);
    setAlerts((prev) => [
      {
        id: `alert-role-${Date.now()}`,
        title: 'Nível de Acesso Alterado',
        description: `O perfil de ${target?.name || 'membro'} foi atualizado para ${
          newRole === 'gestor' ? 'Gestor Titular' : newRole === 'co-gestor' ? 'Co-Gestor' : 'Colaborador'
        }.`,
        timeAgo: 'Agora',
        type: 'milestone',
      },
      ...prev,
    ]);
  };

  // Remove member from team and revoke access
  const handleRemoveMember = (userId: string) => {
    const target = accounts.find((a) => a.id === userId);
    const updatedAccounts = accounts.filter((acc) => acc.id !== userId);
    setAccounts(updatedAccounts);
    setTeamMembers((prev) => prev.filter((m) => m.id !== userId));

    try {
      localStorage.setItem('conecta_accounts', JSON.stringify(updatedAccounts));
    } catch {
      // ignore
    }

    setAlerts((prev) => [
      {
        id: `alert-remove-${Date.now()}`,
        title: 'Membro Removido da Equipe',
        description: `${target?.name || 'Colaborador'} foi removido da equipe e seu login foi desativado.`,
        timeAgo: 'Agora',
        type: 'approval',
      },
      ...prev,
    ]);
  };

  // Safe Tab selector with RBAC enforcement
  const handleSelectTab = (tab: TabType) => {
    if (currentUser?.role === 'colaborador') {
      if (tab === 'dashboard-do-gestor' || tab === 'equipe-e-acessos') {
        setSecurityNotice(
          'Acesso restrito: Colaboradores têm acesso exclusivo ao Espaço do Funcionário, Suas Demandas e Ponto Eletrônico.'
        );
        return;
      }
    }
    setSecurityNotice(null);
    setCurrentTab(tab);
  };

  // Toggle role helper
  const handleToggleRole = (forcedRole?: UserRole) => {
    if (currentUser?.role !== 'gestor') return;
    const nextRole = forcedRole || (currentUser.role === 'gestor' ? 'colaborador' : 'gestor');
    if (nextRole === 'colaborador') {
      setCurrentTab('espaco-do-funcionario');
    } else {
      setCurrentTab('dashboard-do-gestor');
    }
  };

  // Add new demand
  const handleCreateDemand = (demandData: Partial<Demand>) => {
    const newId = `REQ-${Math.floor(8920 + Math.random() * 80)}`;
    const newDemand: Demand = {
      id: newId,
      protocol: `#${newId}`,
      title: demandData.title || 'Nova Demanda Operacional',
      description: demandData.description || 'Descrição da demanda corporativa.',
      department: demandData.department || 'Marketing e Vendas',
      assigneeName: demandData.assigneeName || 'Mariana Rios',
      assigneeRole: demandData.assigneeRole || 'Especialista de Marketing',
      assigneeAvatar: demandData.assigneeAvatar || '',
      assigneeInitials: demandData.assigneeInitials || 'MR',
      requesterName: currentUser?.name || 'Carlos Eduardo',
      requesterRole: currentUser?.roleTitle || 'Gestor Geral',
      requesterAvatar: currentUser?.avatar || '',
      priority: demandData.priority || 'Alta',
      status: 'Em Andamento',
      progressPercent: 0,
      deadlineDisplay: 'Hoje às 18:00',
      deadlineRelative: 'Restam 3h 30m',
      createdAtRelative: 'Agora',
      checklist: [
        { id: '1', text: 'Triagem e validação dos dados de entrada', completed: false },
        { id: '2', text: 'Execução do procedimento padrão', completed: false },
        { id: '3', text: 'Revisão de qualidade e despacho', completed: false },
      ],
    };

    setDemands([newDemand, ...demands]);
    setIsNewDemandModalOpen(false);
  };

  // Handle Punch Confirmation
  const handleConfirmPunch = (timeStr: string) => {
    setTodayPunches((prev) => {
      const targetIdx = prev.findIndex((s) => !s.completed);
      if (targetIdx === -1) return prev;
      return prev.map((slot, idx) => {
        if (idx === targetIdx) {
          return {
            ...slot,
            time: timeStr,
            completed: true,
            isCurrent: false,
          };
        }
        if (idx === targetIdx + 1) {
          return {
            ...slot,
            isCurrent: true,
            statusText: 'Próxima marcação',
          };
        }
        return slot;
      });
    });
  };

  // Zerar todas as informações
  const handleResetAll = () => {
    setDemands([]);
    setAlerts([]);
    setTodayPunches([
      {
        slot: 1,
        label: '1º Entrada',
        time: '--:--',
        statusText: 'Aguardando registro',
        completed: false,
        isCurrent: true,
      },
      {
        slot: 2,
        label: '2º Almoço',
        time: '--:--',
        statusText: 'Pendente',
        completed: false,
        isCurrent: false,
      },
      {
        slot: 3,
        label: '3º Retorno',
        time: '--:--',
        statusText: 'Pendente',
        completed: false,
        isCurrent: false,
      },
      {
        slot: 4,
        label: '4º Saída',
        time: '--:--',
        statusText: 'Pendente',
        completed: false,
        isCurrent: false,
      },
    ]);
    setTeamMembers((prev) =>
      prev.map((m) => ({
        ...m,
        tasksCount: 0,
        status: 'online',
        statusText: 'Disponível',
        punchStatus: 'Ausente',
        punchTime: '--:--',
      }))
    );
  };

  // Carregar dados de demonstração
  const handleLoadSample = () => {
    setDemands(SAMPLE_DEMANDS);
    setAlerts([
      {
        id: 'alt-1',
        title: 'SLA Crítico - Fechamento Fiscal',
        description: 'Demanda #REQ-8901 ultrapassou 80% da tolerância máxima permitida.',
        timeAgo: 'Há 12 min',
        type: 'sla_breach',
        reqId: 'REQ-8901',
      },
      {
        id: 'alt-2',
        title: 'Aprovação Executiva Solicitada',
        description: 'Beatriz Lima finalizou o Dossiê de Auditoria e solicita validação.',
        timeAgo: 'Há 25 min',
        type: 'approval',
        reqId: 'REQ-8902',
      },
    ]);
  };

  const handleCobrarDemand = (demandId: string) => {
    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        title: 'Cobrança de SLA Registrada',
        description: `Notificação enviada ao responsável pela demanda ${demandId}.`,
        timeAgo: 'Agora',
        type: 'sla_breach',
      },
      ...prev,
    ]);
  };

  const handleApproveDemand = (demandId: string) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, status: 'Concluída', progressPercent: 100 } : d))
    );
  };

  const handleUpdateStatus = (demandId: string, newStatus: any) => {
    setDemands((prev) =>
      prev.map((d) =>
        d.id === demandId
          ? {
              ...d,
              status: newStatus,
              progressPercent: newStatus === 'Concluída' ? 100 : d.progressPercent,
            }
          : d
      )
    );
  };

  // If no user is authenticated, render the dedicated Login Screen
  if (!currentUser) {
    return (
      <LoginView
        accounts={accounts}
        onLogin={handleLogin}
        onCreateManager={handleCreateManager}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex text-slate-900 font-sans antialiased">
      {/* Sidebar with dynamic RBAC items */}
      <Sidebar
        currentTab={effectiveTab}
        onSelectTab={handleSelectTab}
        activeProfile={activeProfile}
        onToggleRole={currentUser.role === 'gestor' ? () => handleToggleRole() : undefined}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Global Navigation Header */}
        <Header
          activeProfile={activeProfile}
          onToggleRole={handleToggleRole}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alerts={alerts}
          onOpenNewDemand={() => setIsNewDemandModalOpen(true)}
          onOpenAddTeamModal={currentUser.role === 'gestor' ? () => setIsAddTeamModalOpen(true) : undefined}
          onLogout={handleLogout}
          onNavigateToProfile={() => setCurrentTab('personalizacao-perfil')}
          onInspectAlert={(reqId) => {
            const found = demands.find((d) => d.id === reqId || d.protocol === reqId);
            if (found) setSelectedDemand(found);
          }}
        />

        {/* View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 max-w-7xl w-full mx-auto animate-fade-in flex flex-col gap-4">
          {/* Security Toast Warning if access denied */}
          {securityNotice && (
            <div className="p-3.5 bg-red-50 text-red-900 border border-red-200 rounded-2xl text-xs flex items-center justify-between animate-fade-in font-medium shadow-xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                <span>{securityNotice}</span>
              </div>
              <button
                onClick={() => setSecurityNotice(null)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Data State Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/60 shadow-2xs text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-800">
                Logado como: {currentUser.name} (
                {currentUser.role === 'gestor'
                  ? 'Gestor'
                  : currentUser.role === 'co-gestor'
                  ? 'Co-Gestor'
                  : 'Colaborador'}
                )
              </span>
              {currentUser.personalNumber && (
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Login: {currentUser.personalNumber}
                </span>
              )}
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-500 hidden sm:inline">
                {currentUser.role === 'gestor' || currentUser.role === 'co-gestor'
                  ? 'Acesso Executivo habilitado (Dashboard, Demandas, Equipe & Logins, Espaço Pessoal)'
                  : 'Acesso às suas atividades operacionais (Hub do Colaborador, Demandas, Ponto)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(currentUser.role === 'gestor' || currentUser.role === 'co-gestor') && (
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#0051d5] text-white hover:bg-[#003ea8] text-[11px] font-semibold transition-colors shadow-2xs"
                >
                  + Criar Login para Equipe
                </button>
              )}
              <button
                type="button"
                onClick={() => setCurrentTab('personalizacao-perfil')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
              >
                Editar Perfil / Foto
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-red-600 text-[11px] font-semibold transition-colors"
                title="Zerar todas as demandas, alertas e marcações de ponto"
              >
                Zerar Dados
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dbe1ff] text-[#003ea8] text-[11px] font-semibold transition-colors"
                title="Carregar lote de solicitações de teste"
              >
                Carregar Exemplo
              </button>
            </div>
          </div>

          {/* Tab Views with Strict Role Control */}
          {effectiveTab === 'dashboard-do-gestor' &&
            (currentUser.role === 'gestor' || currentUser.role === 'co-gestor') && (
              <ManagerDashboardView
                demands={demands}
                teamMembers={teamMembers}
                alerts={alerts}
                onOpenNewDemand={() => setIsNewDemandModalOpen(true)}
                onOpenReport={() => setIsReportModalOpen(true)}
                onNavigateToDemands={() => setCurrentTab('demandas-e-processos')}
                onNavigateToTimeClock={() => setCurrentTab('ponto-e-ranking')}
                onInspectDemand={(demand) => setSelectedDemand(demand)}
                onCobrarDemand={handleCobrarDemand}
                onApproveDemand={handleApproveDemand}
                onOpenAddTeam={() => setIsAddTeamModalOpen(true)}
                onNavigateToTeam={() => setCurrentTab('equipe-e-acessos')}
              />
            )}

          {effectiveTab === 'equipe-e-acessos' &&
            (currentUser.role === 'gestor' || currentUser.role === 'co-gestor') && (
              <TeamManagementView
                accounts={accounts}
                currentUser={currentUser}
                onOpenAddModal={() => setIsAddTeamModalOpen(true)}
                onSwitchUser={handleSwitchUser}
                onUpdateMemberRole={handleUpdateMemberRole}
                onRemoveMember={handleRemoveMember}
              />
            )}

          {effectiveTab === 'demandas-e-processos' && (
            <DemandManagementView
              demands={demands}
              onOpenNewDemand={() => setIsNewDemandModalOpen(true)}
              onOpenReport={() => setIsReportModalOpen(true)}
              onInspectDemand={(demand) => setSelectedDemand(demand)}
              onCobrarDemand={handleCobrarDemand}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {effectiveTab === 'espaco-do-funcionario' && (
            <EmployeeHubView
              currentUser={currentUser}
              demands={demands}
              onNavigateToRanking={() => setCurrentTab('ponto-e-ranking')}
              onNavigateToDemands={() => setCurrentTab('demandas-e-processos')}
              onInspectDemand={(demand) => setSelectedDemand(demand)}
              onOpenNewDemand={() => setIsNewDemandModalOpen(true)}
            />
          )}

          {effectiveTab === 'ponto-e-ranking' && (
            <TimeAndRankingView
              onOpenPunchModal={() => setIsPunchModalOpen(true)}
              onOpenAdjustModal={() => setIsAdjustModalOpen(true)}
              todayPunches={todayPunches}
            />
          )}

          {effectiveTab === 'personalizacao-perfil' && (
            <ProfileCustomizationView
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <NewDemandModal
        isOpen={isNewDemandModalOpen}
        onClose={() => setIsNewDemandModalOpen(false)}
        onSubmit={handleCreateDemand}
        accounts={accounts}
      />

      <AddTeamMemberModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        onAddMember={handleAddTeamMember}
      />

      <PunchClockModal
        isOpen={isPunchModalOpen}
        onClose={() => setIsPunchModalOpen(false)}
        onConfirmPunch={handleConfirmPunch}
        currentTimeStr="14:26:45"
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <AdjustTimeModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
      />

      <DemandDetailModal
        demand={selectedDemand}
        isOpen={selectedDemand !== null}
        onClose={() => setSelectedDemand(null)}
        onUpdateStatus={handleUpdateStatus}
        onNotifyUrgency={handleCobrarDemand}
      />
    </div>
  );
}
