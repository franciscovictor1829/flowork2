'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  UserPlus,
  Lock,
  Building,
  Briefcase,
  ShieldAlert,
  CheckCircle2,
  Copy,
  RefreshCw,
  KeyRound,
  Shield,
  Check,
  Hash,
  Camera,
  Trash2,
} from 'lucide-react';
import { UserAccount, UserRole, TeamMemberLiveStatus, VALID_DEPARTMENTS, Department } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newAccount: UserAccount, newMemberStatus: TeamMemberLiveStatus) => void;
}

export function AddTeamMemberModal({
  isOpen,
  onClose,
  onAddMember,
}: AddTeamMemberModalProps) {
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState<Department>('Marketing e Vendas');
  const [role, setRole] = useState<UserRole>('colaborador');
  const [pin, setPin] = useState('1234');
  const [personalNumber, setPersonalNumber] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [customPhoto, setCustomPhoto] = useState('');
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdSuccess, setCreatedSuccess] = useState<UserAccount | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleGenerateNewNumber = () => {
    const nextNum = Math.floor(1000 + Math.random() * 9000).toString();
    setPersonalNumber(nextNum);
  };

  const handleGeneratePin = () => {
    const nextPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(nextPin);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomPhoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanNum = personalNumber.replace(/\D/g, '');
    const cleanPin = pin.replace(/\D/g, '');

    if (cleanNum.length !== 4) {
      setFormError('O número de login deve ter exatamente 4 dígitos.');
      return;
    }

    if (cleanPin.length !== 4) {
      setFormError('O PIN de acesso deve ter exatamente 4 dígitos.');
      return;
    }

    if (!name.trim()) {
      setFormError('Informe o nome completo do colaborador.');
      return;
    }

    const initials = name
      .trim()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const id = `colab-${Date.now()}`;
    const generatedEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@conecta.com`;

    const newAccount: UserAccount = {
      id,
      name: name.trim(),
      email: generatedEmail,
      personalNumber: cleanNum,
      password: cleanPin,
      roleTitle: roleTitle.trim() || `Especialista de ${department}`,
      department,
      avatar: customPhoto,
      role,
      isCoGestor: role === 'co-gestor',
      initials,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastLogin: 'Nunca acessou',
      status: 'ativo',
    };

    const newMemberStatus: TeamMemberLiveStatus = {
      id,
      name: name.trim(),
      personalNumber: cleanNum,
      department,
      avatar: customPhoto,
      initials,
      tasksCount: 0,
      status: 'online',
      statusText: 'Disponível',
      punchStatus: 'Ausente',
      punchTime: '--:--',
    };

    onAddMember(newAccount, newMemberStatus);
    setCreatedSuccess(newAccount);
  };

  const handleCopyCredentials = () => {
    if (!createdSuccess) return;
    const text = `Credenciais de Acesso Conecta:\nNome: ${createdSuccess.name}\nSetor: ${createdSuccess.department}\nLogin (4 dígitos): ${createdSuccess.personalNumber}\nPIN (4 dígitos): ${createdSuccess.password}\nAcesse o sistema diretamente com o Login e PIN.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetAndClose = () => {
    setCreatedSuccess(null);
    setName('');
    setRoleTitle('');
    setDepartment('Marketing e Vendas');
    setPin('1234');
    setCustomPhoto('');
    setFormError(null);
    handleGenerateNewNumber();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0051d5] flex items-center justify-center shadow-2xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {createdSuccess ? 'Login Criado com Sucesso!' : 'Adicionar Membro à Equipe'}
              </h2>
              <p className="text-xs text-slate-500">
                {createdSuccess
                  ? 'Envie as credenciais abaixo para o novo integrante'
                  : 'Cadastro de colaborador com login e PIN de 4 dígitos'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {createdSuccess ? (
            /* Success Credentials Card */
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50/40 border border-emerald-200/80 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {createdSuccess.name} cadastrado(a) em {createdSuccess.department}!
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    O colaborador já está vinculado ao setor e apto a receber tarefas diretamente.
                  </p>
                </div>
              </div>

              {/* Credential Data Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Credenciais de Acesso (Login 4 dígitos + PIN 4 dígitos)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-blue-200 flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Hash className="w-3 h-3 text-[#0051d5]" /> Login (4 dígitos)
                    </span>
                    <span className="text-xl font-mono font-bold text-slate-900 mt-1">
                      {createdSuccess.personalNumber}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" /> PIN (4 dígitos)
                    </span>
                    <span className="text-xl font-mono font-bold text-slate-900 mt-1">
                      {createdSuccess.password}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Setor Correspondente:</span>
                  <span className="font-bold text-[#0051d5]">
                    {createdSuccess.department}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Nível de Acesso:</span>
                  <span className="font-semibold text-slate-800">
                    {createdSuccess.role === 'gestor'
                      ? 'Gestor (Acesso Total)'
                      : 'Colaborador (Espaço do Funcionário & Tarefas)'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Credenciais Copiadas!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Login e PIN</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* 4-digit Login & PIN Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0051d5] text-white flex items-center justify-center font-bold shrink-0">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                        Login (4 dígitos)
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateNewNumber}
                        title="Gerar outro login"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={personalNumber}
                      onChange={(e) => setPersonalNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full text-lg font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center tracking-widest mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        PIN (4 dígitos)
                      </span>
                      <button
                        type="button"
                        onClick={handleGeneratePin}
                        title="Gerar outro PIN"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full text-lg font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-500 text-center tracking-widest mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload (Non-AI) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Foto de Perfil (Opcional)
                </label>
                <div className="flex items-center gap-4">
                  <SafeImage
                    src={customPhoto}
                    alt={name || 'Colaborador'}
                    fallbackInitials={
                      name
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase() || 'CB'
                    }
                    className="w-12 h-12 rounded-2xl border-2 border-slate-200 object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                      id="colab-photo-input"
                    />
                    <label
                      htmlFor="colab-photo-input"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>{customPhoto ? 'Trocar Foto' : 'Adicionar Foto'}</span>
                    </label>
                    {customPhoto && (
                      <button
                        type="button"
                        onClick={() => setCustomPhoto('')}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Role Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mariana Rios"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cargo / Especialidade <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="Ex: Analista Comercial"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                    />
                  </div>
                </div>
              </div>

              {/* Department (ONLY 4 ALLOWED) & Role Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Setor Correspondente <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as Department)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5] bg-white"
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
                    Nível de Acesso
                  </label>
                  <div className="relative">
                    <Shield className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5] bg-white"
                    >
                      <option value="colaborador">Colaborador (Hub Operacional)</option>
                      <option value="co-gestor">Co-Gestor (Executivo + Hub Pessoal)</option>
                      <option value="gestor">Gestor Titular (Acesso Total)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#0051d5] shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  O colaborador usará o <strong>Login ({personalNumber})</strong> e o <strong>PIN ({pin})</strong> de 4 dígitos para acessar o sistema. O colaborador ficará vinculado ao setor <strong>{department}</strong> para recebimento de demandas da equipe.
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold transition-all shadow-xs active:scale-98"
                >
                  Criar Login do Colaborador
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
