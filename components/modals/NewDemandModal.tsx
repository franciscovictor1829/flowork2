'use client';

import React, { useState } from 'react';
import { X, Plus, AlertTriangle, CheckCircle2, User, Building } from 'lucide-react';
import { Demand, Priority, Department, VALID_DEPARTMENTS, UserAccount } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface NewDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (demand: Partial<Demand>) => void;
  accounts?: UserAccount[];
}

export function NewDemandModal({ isOpen, onClose, onSubmit, accounts = [] }: NewDemandModalProps) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('Marketing e Vendas');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<Priority>('Alta');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:00');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter accounts by department
  const sectorCollaborators = accounts.filter(
    (acc) => acc.department === department && acc.role === 'colaborador'
  );

  // All collaborators for fallback
  const allCollaborators = accounts.filter((acc) => acc.role === 'colaborador');

  // Available options: sector collaborators first, fallback to all collaborators
  const activeOptions = sectorCollaborators.length > 0 ? sectorCollaborators : allCollaborators;

  if (!isOpen) return null;

  const selectedCollaborator = activeOptions.find((acc) => acc.id === assigneeId) || activeOptions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assigneeName = selectedCollaborator ? selectedCollaborator.name : 'Colaborador Responsável';
    const assigneeRole = selectedCollaborator
      ? `${selectedCollaborator.roleTitle} • ${selectedCollaborator.department}`
      : `Analista • ${department}`;
    const assigneeAvatar = selectedCollaborator?.avatar || '';
    const assigneeInitials =
      selectedCollaborator?.initials ||
      assigneeName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        title,
        department,
        assigneeName,
        assigneeRole,
        assigneeAvatar,
        assigneeInitials,
        priority,
        status: 'Pendente',
        progressPercent: 0,
        deadlineDisplay: `${date.split('-').reverse().slice(0, 2).join('/')} às ${time}`,
        deadlineRelative: priority === 'Urgente' ? 'Urgente (24h)' : 'Dentro do SLA',
        createdAtRelative: 'Criado agora',
        description: description || `Demanda enviada para o setor de ${department}.`,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setTitle('');
        setDescription('');
      }, 1000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] text-white flex items-center justify-center font-bold text-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Enviar Nova Tarefa à Equipe</h2>
              <p className="text-xs text-slate-500">
                A tarefa será atribuída ao colaborador do setor correspondente
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Tarefa / Demanda <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Relatório de Vendas Trimestral ou Conciliação Fiscal"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sector Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Setor Responsável <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                <select
                  value={department}
                  onChange={(e) => {
                    const newDept = e.target.value as Department;
                    setDepartment(newDept);
                    const colabsInNewDept = accounts.filter(
                      (acc) => acc.department === newDept && acc.role === 'colaborador'
                    );
                    if (colabsInNewDept.length > 0) {
                      setAssigneeId(colabsInNewDept[0].id);
                    }
                  }}
                  className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] bg-white cursor-pointer font-medium text-slate-800"
                >
                  {VALID_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Collaborator Selector - Dynamic according to sector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Colaborador Destinatário <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                <select
                  value={selectedCollaborator?.id || ''}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] bg-white cursor-pointer font-medium text-slate-800"
                >
                  {sectorCollaborators.length > 0 ? (
                    sectorCollaborators.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (Nº {acc.personalNumber})
                      </option>
                    ))
                  ) : (
                    allCollaborators.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.department})
                      </option>
                    ))
                  )}
                </select>
              </div>
              {sectorCollaborators.length === 0 && allCollaborators.length > 0 && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Nenhum colaborador alocado neste setor ainda. Exibindo membros de outros setores.
                </p>
              )}
            </div>
          </div>

          {/* Selected Collaborator Preview Card */}
          {selectedCollaborator && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <SafeImage
                  src={selectedCollaborator.avatar}
                  alt={selectedCollaborator.name}
                  fallbackInitials={selectedCollaborator.initials}
                  className="w-8 h-8 rounded-full border border-blue-200"
                />
                <div>
                  <span className="font-bold text-slate-900 block">{selectedCollaborator.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {selectedCollaborator.roleTitle} • {selectedCollaborator.department}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#0051d5] bg-white px-2 py-0.5 rounded border border-blue-200">
                Login: {selectedCollaborator.personalNumber}
              </span>
            </div>
          )}

          {/* Priority selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Nível de Prioridade</label>
              <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Impacta régua de SLA
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1 rounded-xl">
              {(['Baixa', 'Média', 'Alta', 'Urgente'] as Priority[]).map((p) => {
                const isActive = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? p === 'Urgente'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-[#0051d5] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data Limite (SLA)</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horário Limite</label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instruções e Detalhamento da Demanda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as etapas essenciais, links de apoio ou diretrizes para a execução..."
              className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold transition-all shadow-xs active:scale-98 disabled:opacity-50"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Tarefa Enviada!</span>
                </>
              ) : isSubmitting ? (
                <span>Distribuindo...</span>
              ) : (
                <span>Enviar Tarefa para {selectedCollaborator?.name.split(' ')[0] || 'Colaborador'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
