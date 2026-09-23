'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  BadgeCheck,
  Timer,
  Building2,
  ChevronsUpDown,
  ArrowLeftRight,
  Check,
  Menu,
  X,
  Users,
  LogOut,
  ShieldCheck,
  Lock,
  User,
} from 'lucide-react';
import { TabType, UserProfile, UserRole } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';
import { IMAGE_URLS } from '@/lib/mockData';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activeProfile: UserProfile;
  onToggleRole?: () => void;
  onLogout?: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  activeProfile,
  onToggleRole,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [workspace, setWorkspace] = useState('Matriz Operacional');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const workspaces = ['Matriz Operacional', 'Filial Faria Lima', 'Hub Tecnológico Alphaville'];

  const isManager = activeProfile.role === 'gestor' || activeProfile.role === 'co-gestor';

  // Navigation Items according to strict RBAC:
  // Colaborador CANNOT access Dashboard do Gestor or Equipe & Acessos
  const navItems = isManager
    ? [
        {
          id: 'dashboard-do-gestor' as TabType,
          label: 'Dashboard do Gestor',
          icon: LayoutDashboard,
          badge: 'Executivo',
        },
        {
          id: 'demandas-e-processos' as TabType,
          label: 'Demandas & Processos',
          icon: GitBranch,
        },
        {
          id: 'equipe-e-acessos' as TabType,
          label: 'Equipe & Logins',
          icon: Users,
          badge: 'Gestão',
        },
        {
          id: 'espaco-do-funcionario' as TabType,
          label: 'Meu Espaço Pessoal',
          icon: BadgeCheck,
        },
        {
          id: 'ponto-e-ranking' as TabType,
          label: 'Ponto & Ranking',
          icon: Timer,
        },
        {
          id: 'personalizacao-perfil' as TabType,
          label: 'Meu Perfil & Foto',
          icon: User,
        },
      ]
    : [
        {
          id: 'espaco-do-funcionario' as TabType,
          label: 'Meu Espaço de Trabalho',
          icon: BadgeCheck,
        },
        {
          id: 'demandas-e-processos' as TabType,
          label: 'Minhas Demandas',
          icon: GitBranch,
        },
        {
          id: 'ponto-e-ranking' as TabType,
          label: 'Meu Ponto & Horas',
          icon: Timer,
        },
        {
          id: 'personalizacao-perfil' as TabType,
          label: 'Meu Perfil & Foto',
          icon: User,
        },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SafeImage
                src={IMAGE_URLS.brandLogo}
                alt="Conecta Logo"
                className="h-8 w-auto object-contain"
                fallbackInitials="CO"
              />
              <span className="font-semibold text-lg text-slate-900 tracking-tight">Conecta</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Workspace selector dropdown */}
          <div className="px-4 py-2 relative">
            <button
              type="button"
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#eff4ff] text-slate-900 hover:bg-[#e5eeff] transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden text-left">
                <Building2 className="w-4 h-4 text-[#0051d5] shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Workspace Ativo
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {workspace}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showWorkspaceMenu && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-1 space-y-0.5">
                {workspaces.map((ws) => (
                  <button
                    key={ws}
                    type="button"
                    onClick={() => {
                      setWorkspace(ws);
                      setShowWorkspaceMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs rounded-lg flex items-center justify-between transition-colors ${
                      workspace === ws ? 'bg-[#dbe1ff] text-[#003ea8] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{ws}</span>
                    {workspace === ws && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section title & Role Indicator */}
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isManager ? 'Módulos de Gestão' : 'Módulos Operacionais'}
            </span>
            {isManager ? (
              <span className="text-[10px] font-bold text-[#0051d5] bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Gestor
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Lock className="w-3 h-3" /> Restrito
              </span>
            )}
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-1 px-3 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-[#dbe1ff] text-[#003ea8]'
                      : 'text-slate-600 hover:bg-[#dce9ff]/40 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0051d5]' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-white text-[#0051d5] border border-blue-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile card & Logout */}
        <div className="p-3 flex flex-col gap-2 bg-[#eff4ff]/60 border-t border-slate-100">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Usuário Conectado
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isManager ? 'bg-[#dbe1ff] text-[#003ea8]' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isManager ? 'Gestor' : 'Colaborador'}
            </span>
          </div>

          <div
            onClick={() => onSelectTab('personalizacao-perfil')}
            className="flex items-center justify-between p-2 rounded-xl bg-white shadow-xs border border-slate-100 cursor-pointer hover:border-blue-300 transition-colors"
            title="Clique para personalizar seu perfil e foto"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <SafeImage
                src={activeProfile.avatar}
                alt={activeProfile.name}
                fallbackInitials={activeProfile.initials}
                className="w-8 h-8 rounded-full shrink-0"
              />
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {activeProfile.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {activeProfile.personalNumber
                    ? `Nº ${activeProfile.personalNumber}`
                    : activeProfile.email}
                </span>
              </div>
            </div>

            {onToggleRole && isManager && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRole();
                }}
                title="Trocar Visão para Colaborador"
                className="p-1.5 text-slate-400 hover:text-[#0051d5] hover:bg-slate-50 rounded-lg transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Plataforma</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
