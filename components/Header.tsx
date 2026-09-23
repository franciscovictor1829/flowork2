'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  LogOut,
  UserPlus,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { UserProfile, AlertItem } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface HeaderProps {
  activeProfile: UserProfile;
  onToggleRole: (newRole: 'gestor' | 'colaborador') => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  alerts: AlertItem[];
  onOpenNewDemand?: () => void;
  onInspectAlert?: (reqId?: string) => void;
  onOpenAddTeamModal?: () => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
}

export function Header({
  activeProfile,
  onToggleRole,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  alerts,
  onOpenNewDemand,
  onInspectAlert,
  onOpenAddTeamModal,
  onLogout,
  onNavigateToProfile,
}: HeaderProps) {
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(alerts.length);

  const isManager = activeProfile.role === 'gestor' || activeProfile.role === 'co-gestor';

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 lg:px-6 border-b border-slate-200/50">
      {/* Left side: Hamburger on mobile + Search bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex items-center">
          <Search className="absolute left-3 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar demandas, pessoas ou métricas..."
            className="w-44 sm:w-64 lg:w-80 h-10 pl-9 pr-3 bg-white rounded-xl text-xs font-normal text-slate-800 placeholder:text-slate-400 border border-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Right side: Actions + Role Indicator + Notifications + Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Team Member Add for Gestor */}
        {isManager && onOpenAddTeamModal && (
          <button
            type="button"
            onClick={onOpenAddTeamModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Adicionar Equipe</span>
          </button>
        )}

        {/* Role Badge / Switcher */}
        {isManager ? (
          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-slate-200/60 shadow-2xs">
            <button
              onClick={() => onToggleRole('gestor')}
              className="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold bg-white text-slate-900 shadow-xs flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-[#0051d5]" />
              <span className="hidden sm:inline">Painel</span> {activeProfile.role === 'co-gestor' ? 'Co-Gestor' : 'Gestor'}
            </button>
            <button
              onClick={() => onToggleRole('colaborador')}
              title="Testar visão do colaborador"
              className="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Visão Equipe
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Perfil:</span>
            <span>Colaborador</span>
          </div>
        )}

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAlertsDropdown(!showAlertsDropdown);
              setUnreadCount(0);
            }}
            aria-label="Notificações"
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 animate-scale-up text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Central de Alertas & Notificações</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0051d5] text-[11px] font-semibold">
                    {alerts.length} ativos
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Nenhuma notificação recente.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="py-2.5 flex items-start gap-2.5 hover:bg-slate-50 p-2 rounded-xl transition-colors">
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                          alert.type === 'sla_breach'
                            ? 'bg-red-50 text-red-600'
                            : alert.type === 'approval'
                            ? 'bg-blue-50 text-[#0051d5]'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {alert.type === 'sla_breach' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : alert.type === 'approval' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 truncate">{alert.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{alert.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{alert.description}</p>
                        {alert.reqId && onInspectAlert && (
                          <button
                            onClick={() => {
                              setShowAlertsDropdown(false);
                              onInspectAlert(alert.reqId);
                            }}
                            className="text-[11px] font-semibold text-[#0051d5] hover:underline mt-1 inline-block"
                          >
                            Ver detalhes da demanda →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Name */}
        <div
          onClick={onNavigateToProfile}
          className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200/60 cursor-pointer hover:opacity-80 transition-opacity"
          title="Clique para personalizar seu perfil e foto"
        >
          <SafeImage
            src={activeProfile.avatar}
            alt={activeProfile.name}
            fallbackInitials={activeProfile.initials}
            className="w-8 h-8 rounded-full border border-slate-200 shadow-2xs"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
              {activeProfile.name}
            </span>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
              {activeProfile.personalNumber
                ? `Nº ${activeProfile.personalNumber}`
                : activeProfile.roleTitle || (isManager ? 'Gestor' : 'Colaborador')}
            </span>
          </div>
        </div>

        {/* Logout button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Sair da plataforma"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
