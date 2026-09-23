'use client';

import React, { useState } from 'react';
import {
  Trophy,
  ArrowRight,
  Clock,
  CheckCircle2,
  Flame,
  CheckSquare,
  Square,
  FileCheck,
  Pause,
  Coffee,
  Brain,
  Video,
  Inbox,
  Plus,
  Hash,
  Sparkles,
} from 'lucide-react';
import { Demand, UserAccount } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface EmployeeHubViewProps {
  currentUser: UserAccount;
  demands: Demand[];
  onNavigateToRanking: () => void;
  onNavigateToDemands: () => void;
  onInspectDemand: (demand: Demand) => void;
  onOpenNewDemand?: () => void;
}

export function EmployeeHubView({
  currentUser,
  demands,
  onNavigateToRanking,
  onNavigateToDemands,
  onInspectDemand,
  onOpenNewDemand,
}: EmployeeHubViewProps) {
  const [focusMode, setFocusMode] = useState<'foco' | 'pausa' | 'reuniao'>('foco');
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Personal daily checklist for the user
  const [personalChecklist, setPersonalChecklist] = useState([
    { id: 'c1', text: 'Revisar pendências críticas da esteira operacional', completed: false },
    { id: 'c2', text: 'Registrar marcação de ponto no horário correto', completed: false },
    { id: 'c3', text: 'Alinhar entregas do dia com a coordenação', completed: false },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Filter demands assigned to the current user (or where requester is current user if gestor)
  const myDemands = demands.filter(
    (d) =>
      d.assigneeName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      (currentUser.role === 'gestor' &&
        d.requesterName.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

  const pendingDemands = myDemands.filter((d) => d.status !== 'Concluída');
  const completedDemands = myDemands.filter((d) => d.status === 'Concluída');

  const toggleChecklist = (id: string) => {
    setPersonalChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setPersonalChecklist((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, text: newChecklistText.trim(), completed: false },
    ]);
    setNewChecklistText('');
    setIsAddingItem(false);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-fade-in">
      {/* Top Personalized Greeting & Focus Banner */}
      <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <SafeImage
              src={currentUser.avatar}
              alt={currentUser.name}
              fallbackInitials={currentUser.initials}
              className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Olá, {currentUser.name}</h1>
              <span className="text-sm">✨</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  currentUser.role === 'gestor'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {currentUser.role === 'gestor'
                  ? 'Espaço do Gestor & Produtividade'
                  : 'Meu Espaço de Trabalho'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{currentUser.roleTitle}</span>
              <span>•</span>
              <span>{currentUser.department}</span>
              {currentUser.personalNumber && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[#0051d5] font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                    <Hash className="w-3 h-3" />
                    ID: {currentUser.personalNumber}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Focus Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1.5 rounded-xl border border-slate-200/50">
          <button
            onClick={() => setFocusMode('foco')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              focusMode === 'foco'
                ? 'bg-[#0051d5] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Foco Ativo</span>
          </button>
          <button
            onClick={() => setFocusMode('pausa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              focusMode === 'pausa'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Pausa</span>
          </button>
          <button
            onClick={() => setFocusMode('reuniao')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              focusMode === 'reuniao'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Reunião</span>
          </button>
        </div>
      </section>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Minhas Demandas Ativas
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingDemands.length}</span>
            <span className="text-xs text-slate-500">atribuídas a você</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Checklist do Dia
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {personalChecklist.filter((c) => c.completed).length} / {personalChecklist.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {Math.round(
                (personalChecklist.filter((c) => c.completed).length / personalChecklist.length) * 100
              )}
              % concluído
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pontuação & Ponto
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-slate-900">99.4%</span>
            <button
              onClick={onNavigateToRanking}
              className="text-xs font-semibold text-[#0051d5] hover:underline flex items-center gap-1"
            >
              Ver Ranking <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Daily Checklist & Current Assigned Demands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Checklist Card */}
        <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0051d5]" />
              <h2 className="text-sm font-bold text-slate-900">Metas & Rotina do Dia</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="p-1 rounded-lg hover:bg-slate-100 text-[#0051d5] transition-colors"
              title="Adicionar item"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isAddingItem && (
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 animate-fade-in">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Nova tarefa ou meta..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#003ea8]"
              >
                Salvar
              </button>
            </form>
          )}

          <div className="space-y-2">
            {personalChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200/80 hover:border-blue-300 text-slate-800'
                }`}
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-medium leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Rotina pessoal de produtividade</span>
            <span>{personalChecklist.filter((c) => c.completed).length} concluídos</span>
          </div>
        </section>

        {/* Assigned Demands Column */}
        <section className="lg:col-span-2 p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Suas Demandas em Aberto</h2>
              <p className="text-xs text-slate-500">
                {currentUser.role === 'gestor'
                  ? 'Demandas prioritárias sob seu monitoramento ou despacho'
                  : 'Tarefas operacionais delegadas a você'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.role === 'gestor' && onOpenNewDemand && (
                <button
                  type="button"
                  onClick={onOpenNewDemand}
                  className="px-3 py-1.5 rounded-xl bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#003ea8] transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar Demanda</span>
                </button>
              )}
              <button
                type="button"
                onClick={onNavigateToDemands}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Ver Todas
              </button>
            </div>
          </div>

          {pendingDemands.length > 0 ? (
            <div className="space-y-3">
              {pendingDemands.map((demand) => (
                <div
                  key={demand.id}
                  onClick={() => onInspectDemand(demand)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051d5] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {demand.protocol.replace('#', '')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{demand.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            demand.priority === 'Alta' || demand.priority === 'Urgente'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {demand.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {demand.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>Setor: {demand.department}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-600 font-semibold">
                          <Clock className="w-3 h-3" /> {demand.deadlineDisplay}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      {demand.status}
                    </span>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
              <Inbox className="w-8 h-8 text-slate-300" />
              <span className="text-xs font-bold text-slate-700">Fila de demandas zerada</span>
              <p className="text-[11px] text-slate-400 max-w-sm">
                Nenhuma solicitação pendente no momento. Você está em dia com todas as entregas!
              </p>
              {currentUser.role === 'gestor' && onOpenNewDemand && (
                <button
                  type="button"
                  onClick={onOpenNewDemand}
                  className="mt-2 px-3.5 py-1.5 rounded-xl bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#003ea8]"
                >
                  + Criar Nova Solicitação
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
