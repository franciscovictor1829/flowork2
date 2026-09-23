'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Filter,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileDown,
  ChevronRight,
  MoreVertical,
  MessageSquare,
  Repeat,
  Play,
  FileCheck,
} from 'lucide-react';
import { Demand, DemandStatus } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

type FilterTab = 'Todas' | 'Pendentes' | 'Em Andamento' | 'Concluídas' | 'Atrasadas';

interface DemandManagementViewProps {
  demands: Demand[];
  onOpenNewDemand: () => void;
  onOpenReport: () => void;
  onInspectDemand: (demand: Demand) => void;
  onCobrarDemand: (demandId: string) => void;
  onUpdateStatus: (demandId: string, newStatus: DemandStatus) => void;
}

export function DemandManagementView({
  demands,
  onOpenNewDemand,
  onOpenReport,
  onInspectDemand,
  onCobrarDemand,
  onUpdateStatus,
}: DemandManagementViewProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('Todas');
  const [selectedDept, setSelectedDept] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const departments = [
    'Todos',
    'Marketing e Vendas',
    'Financeiro',
    'Logística',
    'Gestão de Pessoas (RH)',
  ];

  // Status counters
  const counts = {
    Todas: demands.length,
    Pendentes: demands.filter((d) => d.status === 'Pendente').length,
    'Em Andamento': demands.filter((d) => d.status === 'Em Andamento').length,
    Concluídas: demands.filter((d) => d.status === 'Concluída').length,
    Atrasadas: demands.filter((d) => d.status === 'Atrasada' || d.slaBreach).length,
  };

  const filteredDemands = demands.filter((demand) => {
    // Tab filter
    if (activeTab === 'Atrasadas') {
      if (demand.status !== 'Atrasada' && !demand.slaBreach) return false;
    } else if (activeTab === 'Pendentes') {
      if (demand.status !== 'Pendente') return false;
    } else if (activeTab === 'Em Andamento') {
      if (demand.status !== 'Em Andamento') return false;
    } else if (activeTab === 'Concluídas') {
      if (demand.status !== 'Concluída') return false;
    }

    // Department filter
    if (selectedDept !== 'Todos' && demand.department !== selectedDept) {
      return false;
    }

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        demand.title.toLowerCase().includes(q) ||
        demand.protocol.toLowerCase().includes(q) ||
        demand.assigneeName.toLowerCase().includes(q) ||
        demand.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleQuickAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header & Macro Stats */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Demandas & Processos</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-semibold">Fila Corporativa Unificada</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestão de Demandas & SLA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribuição, acompanhamento em tempo real e régua de escalonamento automático
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <span className="text-slate-500">SLA Médio do Time:</span>
            <strong className="text-emerald-600 font-bold">94.8% On-Time</strong>
          </div>

          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 shadow-2xs border border-slate-200/70 hover:bg-slate-50 text-xs font-semibold"
          >
            <FileDown className="w-4 h-4 text-slate-600" />
            <span>Relatório</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewDemand}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0051d5] text-white shadow-sm hover:bg-[#003ea8] text-xs font-semibold active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Solicitação</span>
          </button>
        </div>
      </header>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-3 bg-blue-50 text-[#003ea8] border border-blue-200 rounded-xl text-xs flex items-center justify-between font-medium animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0051d5] shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-[#0051d5] hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Filters and Search Bar Section */}
      <section className="p-5 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          {(['Todas', 'Pendentes', 'Em Andamento', 'Concluídas', 'Atrasadas'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const countVal = counts[tab];

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? tab === 'Atrasadas'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-[#dbe1ff] text-[#003ea8]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? tab === 'Atrasadas'
                        ? 'bg-red-200 text-red-900'
                        : 'bg-[#0051d5] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {countVal}
                </span>
              </button>
            );
          })}
        </div>

        {/* Department Chips and Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Setor:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar nesta esteira..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0051d5] focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* Demands Pipeline Stream */}
      <section className="space-y-4">
        {filteredDemands.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">Nenhuma solicitação encontrada</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tente redefinir os filtros de setor ou criar uma nova solicitação.
            </p>
          </div>
        ) : (
          filteredDemands.map((demand) => {
            const isOverdue = demand.status === 'Atrasada' || demand.slaBreach;
            const isDone = demand.status === 'Concluída';

            return (
              <div
                key={demand.id}
                onClick={() => onInspectDemand(demand)}
                className="p-5 rounded-2xl bg-white shadow-2xs border border-slate-200/70 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col gap-4 cursor-pointer group"
              >
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isOverdue
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : demand.status === 'Em Andamento'
                          ? 'bg-blue-50 text-[#0051d5] border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isOverdue && <AlertTriangle className="w-3 h-3" />}
                      {isDone && <CheckCircle2 className="w-3 h-3" />}
                      {isOverdue ? 'URGENTE • SLA CRÍTICO' : demand.status}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {demand.protocol}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {demand.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-medium">Prazo: {demand.deadlineDisplay}</span>
                    <span
                      className={`font-semibold ${
                        isOverdue ? 'text-red-600' : 'text-slate-700'
                      }`}
                    >
                      ({demand.deadlineRelative})
                    </span>
                  </div>
                </div>

                {/* Card Middle: Title & Scope */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0051d5] transition-colors">
                    {demand.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {demand.description}
                  </p>
                </div>

                {/* Card Bottom Row: Assignee, Progress Gauge & Actions */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Assignee & Progress */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <SafeImage
                        src={demand.assigneeAvatar}
                        alt={demand.assigneeName}
                        fallbackInitials={demand.assigneeInitials}
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-800">
                          {demand.assigneeName}
                        </span>
                        <span className="text-[10px] text-slate-400">{demand.assigneeRole}</span>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col w-28">
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-400">Progresso</span>
                        <span className="font-semibold text-slate-700">{demand.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isDone ? 'bg-emerald-500' : isOverdue ? 'bg-red-500' : 'bg-[#0051d5]'
                          }`}
                          style={{ width: `${demand.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isOverdue && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onCobrarDemand(demand.id);
                            handleQuickAction(`Notificação de urgência enviada para ${demand.assigneeName}!`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Cobrar Urgência
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAction(`Demanda ${demand.protocol} aberta para reatribuição.`)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          Reatribuir
                        </button>
                      </>
                    )}

                    {demand.status === 'Em Andamento' && (
                      <>
                        <button
                          type="button"
                          onClick={() => onInspectDemand(demand)}
                          className="px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dbe1ff] text-[#003ea8] text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Acompanhar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAction(`Canal de despacho aberto com ${demand.assigneeName}.`)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Enviar Mensagem"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {demand.status === 'Pendente' && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(demand.id, 'Em Andamento');
                          handleQuickAction(`Demanda ${demand.protocol} iniciada e alocada!`);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-semibold transition-colors"
                      >
                        Iniciar Agora
                      </button>
                    )}

                    {isDone && (
                      <button
                        type="button"
                        onClick={() => onInspectDemand(demand)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                      >
                        Ver Relatório
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
