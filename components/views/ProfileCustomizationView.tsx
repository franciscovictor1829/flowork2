'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Trash2,
  Save,
  CheckCircle2,
  Shield,
  KeyRound,
  Building2,
  Hash,
  Copy,
  Check,
  Briefcase,
  Layers,
} from 'lucide-react';
import { UserAccount, VALID_DEPARTMENTS, Department } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface ProfileCustomizationViewProps {
  currentUser: UserAccount;
  onUpdateProfile: (updated: UserAccount) => void;
}

export function ProfileCustomizationView({
  currentUser,
  onUpdateProfile,
}: ProfileCustomizationViewProps) {
  const [name, setName] = useState(currentUser.name || '');
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle || '');
  const [department, setDepartment] = useState(currentUser.department || 'Operações');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [companyName, setCompanyName] = useState(currentUser.companyName || 'Conecta Gestão');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatar(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyPersonalNumber = () => {
    if (currentUser.personalNumber) {
      navigator.clipboard.writeText(currentUser.personalNumber);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    const updatedAccount: UserAccount = {
      ...currentUser,
      name,
      roleTitle,
      department,
      email: currentUser.role === 'gestor' ? email : currentUser.email,
      phone,
      companyName,
      avatar,
      initials: name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || currentUser.initials,
      password: newPassword ? newPassword : currentUser.password,
    };

    onUpdateProfile(updatedAccount);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 bg-white rounded-2xl border border-slate-200/70 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Personalização de Perfil</h1>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                currentUser.role === 'gestor'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {currentUser.role === 'gestor' ? 'Perfil Gestor' : 'Perfil Colaborador'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie suas informações cadastrais, foto de perfil e credenciais de acesso.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perfil atualizado com sucesso!</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Card 1: Foto do Perfil */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/70 shadow-2xs flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Camera className="w-4 h-4 text-[#0051d5]" />
            <h2 className="text-sm font-bold text-slate-900">Foto de Perfil</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <SafeImage
                src={avatar}
                alt={name || 'Usuário'}
                fallbackInitials={
                  name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'US'
                }
                className="w-24 h-24 rounded-2xl border-4 border-slate-100 shadow-md object-cover text-lg"
              />
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-sm transition-transform active:scale-95"
                  title="Remover foto e usar iniciais"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  id="profile-photo-upload"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0051d5] text-white hover:bg-[#003ea8] text-xs font-semibold shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Adicionar / Trocar Foto</span>
                </label>

                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Usar Iniciais</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Você pode enviar uma foto sua do computador ou celular (PNG, JPG ou WEBP até 5MB).
                Se nenhuma foto for enviada, suas iniciais com cor corporativa serão exibidas.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Credencial de Acesso (Número Pessoal ou E-mail) */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/70 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-[#0051d5]" />
            <h2 className="text-sm font-bold text-slate-900">Identificação no Sistema</h2>
          </div>

          {currentUser.role === 'colaborador' ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#eff4ff] to-[#f8f9ff] border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0051d5] text-white flex items-center justify-center font-bold shadow-xs">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                    Seu Número Pessoal para Login
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono font-bold text-slate-900">
                      {currentUser.personalNumber || 'Não gerado'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      Sem necessidade de e-mail
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Você pode acessar o sistema na tela de login informando apenas este número pessoal e sua senha.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPersonalNumber}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                {copiedNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Número</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail Corporativo de Login
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                  placeholder="gestor@empresa.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Empresa / Organização
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                    placeholder="Nome da Empresa"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Dados Pessoais e Cargo */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/70 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-[#0051d5]" />
            <h2 className="text-sm font-bold text-slate-900">Dados Pessoais & Atuação</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cargo / Especialidade
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Setor / Departamento
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
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
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Alterar Senha / PIN */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/70 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-[#0051d5]" />
            <h2 className="text-sm font-bold text-slate-900">Segurança & PIN (4 dígitos)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Novo PIN (4 dígitos - deixe em branco para manter)
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold tracking-widest text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                placeholder="••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirmar Novo PIN (4 dígitos)
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold tracking-widest text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                placeholder="••••"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-xs text-rose-600 font-semibold">{passwordError}</p>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0051d5] text-white hover:bg-[#003ea8] text-xs font-bold shadow-sm transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações do Perfil</span>
          </button>
        </div>
      </form>
    </div>
  );
}
