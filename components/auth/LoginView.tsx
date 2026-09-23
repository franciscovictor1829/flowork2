'use client';

import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Building2,
  Hash,
  UserPlus,
  Briefcase,
  Layers,
  ArrowLeft,
  Building,
} from 'lucide-react';
import { UserAccount, VALID_DEPARTMENTS, Department } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface LoginViewProps {
  accounts: UserAccount[];
  onLogin: (account: UserAccount) => void;
  onCreateManager?: (newManager: UserAccount) => void;
}

export function LoginView({ accounts, onLogin, onCreateManager }: LoginViewProps) {
  // Login modes: 'colaborador' (Login 4 dígitos + PIN 4 dígitos) or 'gestor' (E-mail ou Login 4 dígitos + PIN)
  const [loginMode, setLoginMode] = useState<'colaborador' | 'gestor'>('colaborador');
  const [isRegisteringManager, setIsRegisteringManager] = useState(false);

  // Form states for login
  const [personalNumberInput, setPersonalNumberInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states for creating manager from scratch
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newManagerCompany, setNewManagerCompany] = useState('');
  const [newManagerRoleTitle, setNewManagerRoleTitle] = useState('Gestor Geral');
  const [newManagerDepartment, setNewManagerDepartment] = useState<Department>('Gestão de Pessoas (RH)');
  const [newManagerPin, setNewManagerPin] = useState('');
  const [newManagerConfirmPin, setNewManagerConfirmPin] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Separate accounts
  const managerAccounts = accounts.filter((a) => a.role === 'gestor' || a.role === 'co-gestor');
  const employeeAccounts = accounts.filter((a) => a.role === 'colaborador');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let foundAccount: UserAccount | undefined;

    if (loginMode === 'colaborador') {
      const cleanLogin = personalNumberInput.trim().replace(/\D/g, '');
      const cleanPin = pinInput.trim().replace(/\D/g, '');

      if (cleanLogin.length !== 4) {
        setErrorMsg('O login do colaborador deve ter exatamente 4 dígitos numéricos.');
        return;
      }

      if (cleanPin.length !== 4) {
        setErrorMsg('O PIN de segurança deve ter exatamente 4 dígitos numéricos.');
        return;
      }

      foundAccount = accounts.find(
        (a) =>
          a.personalNumber?.replace(/\D/g, '') === cleanLogin ||
          a.id.toLowerCase() === cleanLogin.toLowerCase()
      );

      if (!foundAccount) {
        setErrorMsg(
          `Nenhuma conta encontrada com o login "${cleanLogin}". Verifique os 4 dígitos ou solicite ao gestor.`
        );
        return;
      }

      if (foundAccount.password && foundAccount.password !== cleanPin) {
        setErrorMsg('PIN de 4 dígitos incorreto para este colaborador.');
        return;
      }
    } else {
      // Gestor login
      const cleanInput = emailInput.trim().toLowerCase();
      const cleanPin = pinInput.trim().replace(/\D/g, '');

      if (!cleanInput) {
        setErrorMsg('Por favor, informe seu e-mail ou código de gestor.');
        return;
      }

      foundAccount = accounts.find(
        (a) =>
          (a.role === 'gestor' || a.role === 'co-gestor') &&
          (a.email?.toLowerCase() === cleanInput ||
            a.personalNumber === cleanInput ||
            a.name.toLowerCase().includes(cleanInput))
      );

      if (!foundAccount) {
        setErrorMsg('Nenhuma conta de gestor encontrada.');
        return;
      }

      if (foundAccount.password && foundAccount.password !== cleanPin && foundAccount.password !== pinInput) {
        setErrorMsg('PIN / Senha incorreta para o gestor.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(foundAccount!);
    }, 250);
  };

  // Handle Create Manager from Scratch
  const handleRegisterManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    const cleanPin = newManagerPin.trim().replace(/\D/g, '');
    const cleanConfirm = newManagerConfirmPin.trim().replace(/\D/g, '');

    if (!newManagerName.trim() || !newManagerEmail.trim()) {
      setRegisterError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (cleanPin.length !== 4) {
      setRegisterError('O PIN do gestor deve ter exatamente 4 dígitos numéricos.');
      return;
    }

    if (cleanPin !== cleanConfirm) {
      setRegisterError('Os PINs digitados não coincidem.');
      return;
    }

    // Check if email already exists
    const existing = accounts.find(
      (a) => a.email?.toLowerCase() === newManagerEmail.trim().toLowerCase()
    );
    if (existing) {
      setRegisterError('Já existe uma conta cadastrada com este e-mail corporativo.');
      return;
    }

    const initials = newManagerName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newId = `gestor-${Date.now()}`;
    // 4-digit personal number
    const personalNumber = Math.floor(1000 + Math.random() * 9000).toString();

    const createdManager: UserAccount = {
      id: newId,
      name: newManagerName.trim(),
      email: newManagerEmail.trim().toLowerCase(),
      personalNumber,
      password: cleanPin,
      roleTitle: newManagerRoleTitle.trim() || 'Gestor Geral',
      department: newManagerDepartment,
      avatar: '',
      role: 'gestor',
      initials,
      companyName: newManagerCompany.trim() || 'Nova Empresa',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastLogin: 'Primeiro Acesso',
      status: 'ativo',
    };

    if (onCreateManager) {
      onCreateManager(createdManager);
    } else {
      onLogin(createdManager);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#f8f9ff] to-[#eef2ff] flex items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Information & Quick Access */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0051d5] flex items-center justify-center shadow-lg text-white font-black text-xl tracking-tight">
              C
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block">
                CONECTA
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Plataforma de Gestão Operacional & Equipes
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Login Simplificado: <br />
              <span className="text-[#0051d5]">4 Dígitos</span> + <span className="text-emerald-600">PIN de 4 Dígitos</span>.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ambiente de trabalho segregado e direto. Colaboradores entram apenas com seu login numérico de 4 dígitos e PIN de 4 dígitos, sem necessidade de e-mail.
            </p>
          </div>

          {/* Department List Ribbon */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-xs flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Setores Ativos no Sistema:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {VALID_DEPARTMENTS.map((dept) => (
                <div
                  key={dept}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]" />
                  <span>{dept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Test Access Buttons */}
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Contas de Demonstração (Clique para Entrar Direto)
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {managerAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => onLogin(acc)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003ea8] border border-blue-200/80 text-xs font-semibold transition-all shadow-2xs"
                >
                  <SafeImage
                    src={acc.avatar}
                    alt={acc.name}
                    fallbackInitials={acc.initials}
                    className="w-5 h-5 rounded-lg"
                  />
                  <span>
                    Gestor ({acc.name.split(' ')[0]}) • {acc.personalNumber}
                  </span>
                </button>
              ))}

              {employeeAccounts.slice(0, 4).map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => onLogin(acc)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-semibold transition-all shadow-2xs"
                >
                  <SafeImage
                    src={acc.avatar}
                    alt={acc.name}
                    fallbackInitials={acc.initials}
                    className="w-5 h-5 rounded-lg"
                  />
                  <span>
                    {acc.name.split(' ')[0]} ({acc.department.split(' ')[0]}) • Nº {acc.personalNumber}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Login / Register Form */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 backdrop-blur-md">
            {isRegisteringManager ? (
              /* Create Manager From Scratch Form */
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsRegisteringManager(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Criar Perfil de Gestor do Zero
                      </h2>
                      <p className="text-xs text-slate-500">
                        Cadastre uma nova empresa e conta executiva
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0051d5] bg-blue-50 px-2 py-1 rounded-md">
                    Admin
                  </span>
                </div>

                {registerError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                    {registerError}
                  </div>
                )}

                <form onSubmit={handleRegisterManagerSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome Completo do Gestor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newManagerName}
                      onChange={(e) => setNewManagerName(e.target.value)}
                      placeholder="Ex: Roberto Siqueira"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Empresa / Workspace <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={newManagerCompany}
                          onChange={(e) => setNewManagerCompany(e.target.value)}
                          placeholder="Ex: Apex Logística"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cargo Executivo
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={newManagerRoleTitle}
                          onChange={(e) => setNewManagerRoleTitle(e.target.value)}
                          placeholder="Ex: Diretor Geral"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sector (Only the 4 valid ones) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Setor do Gestor <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={newManagerDepartment}
                        onChange={(e) => setNewManagerDepartment(e.target.value as Department)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5] bg-white cursor-pointer"
                      >
                        {VALID_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail Corporativo de Acesso <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={newManagerEmail}
                        onChange={(e) => setNewManagerEmail(e.target.value)}
                        placeholder="gestor@empresa.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        PIN (4 dígitos) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={newManagerPin}
                        onChange={(e) => setNewManagerPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="Ex: 1234"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold tracking-widest text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirmar PIN (4 dígitos) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={newManagerConfirmPin}
                        onChange={(e) => setNewManagerConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="Ex: 1234"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold tracking-widest text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setIsRegisteringManager(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                    >
                      Voltar ao Login
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-[#0051d5] text-white hover:bg-[#003ea8] text-xs font-bold shadow-sm transition-all active:scale-98"
                    >
                      Criar Gestor e Entrar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Standard Login Box with Colaborador / Gestor Switcher */
              <div className="flex flex-col gap-5 animate-fade-in">
                {/* Role Switcher Tabs */}
                <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('colaborador');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      loginMode === 'colaborador'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Hash className="w-4 h-4 text-emerald-600" />
                    <span>Sou Colaborador</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('gestor');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      loginMode === 'gestor'
                        ? 'bg-white text-[#0051d5] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0051d5]" />
                    <span>Sou Gestor</span>
                  </button>
                </div>

                {/* Subtitle Information */}
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {loginMode === 'colaborador'
                      ? 'Acesso do Colaborador (4 dígitos + PIN 4 dígitos)'
                      : 'Acesso Administrativo do Gestor'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {loginMode === 'colaborador'
                      ? 'Digite apenas seu login de 4 dígitos e PIN de 4 dígitos (sem e-mail).'
                      : 'Entre com seu e-mail ou código de 4 dígitos e PIN para gerenciar a equipe.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginMode === 'colaborador' ? (
                    /* Colaborador: 4-digit Login */
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Login do Colaborador (4 dígitos)
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={personalNumberInput}
                          onChange={(e) =>
                            setPersonalNumberInput(e.target.value.replace(/\D/g, '').slice(0, 4))
                          }
                          placeholder="1002"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left"
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Exemplo demo: <strong>1002</strong> (Beatriz Lima) ou <strong>1003</strong> (Rodrigo Mendes).
                      </span>
                    </div>
                  ) : (
                    /* Gestor: E-mail or 4-digit code */
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        E-mail ou Código de 4 dígitos do Gestor
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#0051d5] absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="carlos@conecta.com ou 1001"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4-digit PIN field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        PIN de Acesso (4 dígitos)
                      </label>
                      <span className="text-[11px] text-slate-400">Padrão demo: 1234</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                      loginMode === 'colaborador'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#0051d5] hover:bg-[#003ea8]'
                    }`}
                  >
                    {isLoading ? (
                      <span>Autenticando...</span>
                    ) : (
                      <>
                        <span>
                          {loginMode === 'colaborador'
                            ? 'Entrar com Login e PIN de 4 Dígitos'
                            : 'Acessar Painel do Gestor'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Option to create new Manager account from scratch */}
                <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
                  <span className="text-xs text-slate-500">É um novo gestor ou empresa?</span>
                  <button
                    type="button"
                    onClick={() => setIsRegisteringManager(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0051d5] hover:underline"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Criar Perfil de Gestor do Zero</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
