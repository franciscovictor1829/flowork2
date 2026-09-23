'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Copy,
  Check,
  Search,
  Building,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Trash2,
  ChevronDown,
  Shield,
  UserCog,
  CheckCircle2,
} from 'lucide-react';
import { UserAccount, UserRole } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface TeamManagementViewProps {
  accounts: UserAccount[];
  currentUser: UserAccount;
  onOpenAddModal: () => void;
  onSwitchUser: (account: UserAccount) => void;
  onUpdateMemberRole: (userId: string, newRole: UserRole) => void;
  onRemoveMember: (userId: string) => void;
}

export function TeamManagementView({
  accounts,
  currentUser,
  onOpenAddModal,
  onSwitchUser,
  onUpdateMemberRole,
  onRemoveMember,
}: TeamManagementViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | 'gestor' | 'co-gestor' | 'colaborador'>('all');
  const [memberToRemove, setMemberToRemove] = useState<UserAccount | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredAccounts = accounts.filter((acc) => {
    const matchQuery =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.email && acc.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (acc.personalNumber && acc.personalNumber.includes(searchTerm)) ||
      acc.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || acc.role === filterRole;
    return matchQuery && matchRole;
  });

  const gestorCount = accounts.filter((a) => a.role === 'gestor').length;
  const coGestorCount = accounts.filter((a) => a.role === 'co-gestor').length;
  const employeeCount = accounts.filter((a) => a.role === 'colaborador').length;

  const handleCopyCredentials = (acc: UserAccount) => {
    const loginField =
      acc.role === 'colaborador'
        ? `Login (4 dígitos): ${acc.personalNumber || '1002'}`
        : `Login/Email: ${acc.email || acc.personalNumber}`;
    const text = `Credenciais de Acesso Conecta:\nNome: ${acc.name}\nSetor: ${acc.department}\n${loginField}\nPIN: ${
      acc.password || '1234'
    }\nNível de Acesso: ${
      acc.role === 'gestor' ? 'Gestor' : acc.role === 'co-gestor' ? 'Co-Gestor' : 'Colaborador'
    }`;
    navigator.clipboard.writeText(text);
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleRoleChange = (userId: string, newRole: UserRole, userName: string) => {
    onUpdateMemberRole(userId, newRole);
    const roleLabels: Record<UserRole, string> = {
      gestor: 'Gestor Titular',
      'co-gestor': 'Co-Gestor',
      colaborador: 'Colaborador',
    };
    setActionNotice(`Acesso de ${userName} alterado para ${roleLabels[newRole]}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleConfirmRemoval = () => {
    if (!memberToRemove) return;
    const removedName = memberToRemove.name;
    onRemoveMember(memberToRemove.id);
    setMemberToRemove(null);
    setActionNotice(`${removedName} foi removido(a) da equipe com sucesso.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header Banner */}
      <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0051d5] text-[11px] font-bold uppercase tracking-wider">
              Área Exclusiva de Gestão
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Controle de Equipe & Permissões</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Gestão da Equipe & Logins</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Alterne o nível de permissão entre <strong>Colaborador</strong>, <strong>Co-Gestor</strong> e <strong>Gestor</strong>, adicione novos integrantes ou remova membros da equipe com revogação imediata de credenciais.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 shrink-0 self-start md:self-auto active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          <span>Adicionar Membro & Criar Login</span>
        </button>
      </section>

      {/* Floating Action Notice Toast */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Security notice ribbon */}
      <section className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0051d5] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block">Níveis de Permissão no Sistema:</span>
            <span className="text-slate-600 text-[11px]">
              • <strong>Colaborador:</strong> Acesso restrito ao Espaço do Funcionário, tarefas e ponto diário. <br />
              • <strong>Co-Gestor:</strong> Visão executiva de demandas e equipe, mantendo seu espaço pessoal de tarefas. <br />
              • <strong>Gestor:</strong> Acesso administrativo irrestrito à organização.
            </span>
          </div>
        </div>
      </section>

      {/* KPI Counters */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total da Equipe
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {String(accounts.length).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-500 font-semibold">contas ativas</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Gestores Titulares
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#0051d5] tabular-nums">
                {String(gestorCount).padStart(2, '0')}
              </span>
              <span className="text-xs text-blue-600 font-semibold">acesso total</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Co-Gestores
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-indigo-700 tabular-nums">
                {String(coGestorCount).padStart(2, '0')}
              </span>
              <span className="text-xs text-indigo-600 font-semibold">co-liderança</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Colaboradores
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                {String(employeeCount).padStart(2, '0')}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">hub operacional</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, setor, cargo ou login de 4 dígitos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
          />
        </div>

        {/* Filter Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterRole === 'all' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({accounts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('gestor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterRole === 'gestor' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gestores ({gestorCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('co-gestor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterRole === 'co-gestor' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Co-Gestores ({coGestorCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('colaborador')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterRole === 'colaborador' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Colaboradores ({employeeCount})
          </button>
        </div>
      </section>

      {/* Team Members List Table */}
      <section className="bg-white rounded-2xl shadow-2xs border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Colaborador / Perfil</th>
                <th className="py-3 px-4">Setor Correspondente</th>
                <th className="py-3 px-4">Login (4 Dígitos)</th>
                <th className="py-3 px-4">PIN (4 Dígitos)</th>
                <th className="py-3 px-4">Nível de Acesso (Modificável)</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => {
                const isCurrent = acc.id === currentUser.id;

                return (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={acc.avatar}
                          alt={acc.name}
                          fallbackInitials={acc.initials}
                          className="w-9 h-9 rounded-full border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{acc.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                Você
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">{acc.roleTitle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                        <Building className="w-3 h-3 text-slate-400" />
                        {acc.department}
                      </span>
                    </td>

                    {/* Login (4 digits) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#003ea8] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {acc.personalNumber || '1002'}
                        </span>
                        {acc.email && (
                          <span className="text-[10px] text-slate-400 hidden xl:inline truncate max-w-[140px]">
                            ({acc.email})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Password / PIN */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                          {acc.password || '1234'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCredentials(acc)}
                          title="Copiar credenciais completas"
                          className="p-1 rounded text-slate-400 hover:text-[#0051d5] hover:bg-slate-100 transition-colors"
                        >
                          {copiedId === acc.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Role & Access (Modificável de Colaborador -> Co-Gestor -> Gestor) */}
                    <td className="py-3 px-4">
                      <div className="relative inline-block">
                        <select
                          value={acc.role}
                          onChange={(e) => handleRoleChange(acc.id, e.target.value as UserRole, acc.name)}
                          disabled={isCurrent}
                          className={`pl-2.5 pr-8 py-1 rounded-lg text-[11px] font-bold appearance-none cursor-pointer transition-colors border focus:outline-none focus:ring-2 focus:ring-[#0051d5] ${
                            acc.role === 'gestor'
                              ? 'bg-blue-50 text-[#0051d5] border-blue-200 hover:bg-blue-100'
                              : acc.role === 'co-gestor'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          } ${isCurrent ? 'opacity-80 cursor-not-allowed' : ''}`}
                          title={isCurrent ? 'Você não pode alterar sua própria permissão' : 'Clique para alterar permissão'}
                        >
                          <option value="colaborador">Colaborador (Hub Operacional)</option>
                          <option value="co-gestor">Co-Gestor (Executivo + Hub)</option>
                          <option value="gestor">Gestor Titular (Acesso Total)</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                      </div>
                    </td>

                    {/* Actions: Simular Login & Remover da Equipe */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => onSwitchUser(acc)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-[#0051d5] hover:text-white hover:border-[#0051d5] text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                            title="Alternar sessão para verificar a visão deste usuário"
                          >
                            <span>Simular Login</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {/* Botão de Remover Membro */}
                        {!isCurrent ? (
                          <button
                            type="button"
                            onClick={() => setMemberToRemove(acc)}
                            className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                            title={`Remover ${acc.name} da equipe`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium px-2 py-1">Sessão Atual</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confirmation Modal: Remover Membro da Equipe */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 flex flex-col gap-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Remover {memberToRemove.name} da Equipe?
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Esta ação revogará permanentemente as credenciais de acesso deste integrante (Login: <strong>{memberToRemove.personalNumber || memberToRemove.email}</strong>, Setor: <strong>{memberToRemove.department}</strong>). As tarefas já entregues permanecerão no histórico da empresa.
              </p>
            </div>

            <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/80 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>O colaborador perderá o acesso imediato ao Hub e ao registro de ponto.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoval}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Sim, Remover da Equipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
