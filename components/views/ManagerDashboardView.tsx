'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  FileDown,
  Plus,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  ArrowUp,
  ArrowRight,
  Filter,
  RefreshCw,
  MoreVertical,
  Repeat,
  Eye,
  Users,
  BellRing,
  Fingerprint,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import { Demand, TeamMemberLiveStatus, AlertItem } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';
import { IMAGE_URLS } from '@/lib/mockData';

interface ManagerDashboardViewProps {
  demands: Demand[];
  teamMembers: TeamMemberLiveStatus[];
  alerts: AlertItem[];
  onOpenNewDemand: () => void;
  onOpenReport: () => void;
  onNavigateToDemands: () => void;
  onNavigateToTimeClock: () => void;
  onInspectDemand: (demand: Demand) => void;
  onCobrarDemand: (demandId: string) => void;
  onApproveDemand: (demandId: string) => void;
  onOpenAddTeam?: () => void;
  onNavigateToTeam?: () => void;
}

export function ManagerDashboardView({
  demands,
  teamMembers,
  alerts,
  onOpenNewDemand,
  onOpenReport,
  onNavigateToDemands,
  onNavigateToTimeClock,
  onInspectDemand,
  onCobrarDemand,
  onApproveDemand,
  onOpenAddTeam,
  onNavigateToTeam,
}: ManagerDashboardViewProps) {
  const [chartViewMode, setChartViewMode] = useState<'diario' | 'semanal'>('diario');
  const [tableFilter, setTableFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  const pendingCount = demands.filter((d) => d.status === 'Pendente').length;
  const inProgressCount = demands.filter((d) => d.status === 'Em Andamento').length;
  const concludedCount = demands.filter((d) => d.status === 'Concluída').length;
  const criticalCount = demands.filter((d) => d.status === 'Atrasada' || d.priority === 'Urgente').length;

  const filteredDemands = demands.filter((d) => {
    if (!tableFilter) return true;
    const q = tableFilter.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.protocol.toLowerCase().includes(q) ||
      d.assigneeName.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleQuickApprove = (alertId: string, reqId?: string) => {
    if (reqId) {
      onApproveDemand(reqId);
    }
    setApprovalFeedback('Solicitação aprovada e protocolada com sucesso!');
    setTimeout(() => setApprovalFeedback(null), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Operational Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Olá, Carlos Eduardo</h1>
            <span className="px-2 py-0.5 rounded-md bg-[#dbe1ff] text-[#003ea8] text-xs font-semibold">
              Visão Gestor Ativa
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestão de Operações & PMEs • Visão Geral Corporativa • Tempo Real
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Selector Pill */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-2xs border border-slate-200/70 text-xs font-semibold text-slate-800">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span>19 Mai - 25 Mai, 2025</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Export Report Action */}
          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 shadow-2xs border border-slate-200/70 hover:bg-slate-50 transition-all text-xs font-semibold"
          >
            <FileDown className="w-4 h-4 text-slate-600" />
            <span>Relatório</span>
          </button>

          {/* Add Team Member CTA */}
          {onOpenAddTeam && (
            <button
              type="button"
              onClick={onOpenAddTeam}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#0051d5] shadow-2xs border border-blue-200 hover:bg-blue-50 transition-all text-xs font-semibold"
            >
              <UserPlus className="w-4 h-4 text-[#0051d5]" />
              <span>+ Adicionar Equipe</span>
            </button>
          )}

          {/* Primary Action CTA */}
          <button
            type="button"
            onClick={onOpenNewDemand}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0051d5] text-white shadow-sm hover:bg-[#003ea8] transition-all text-xs font-semibold active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Solicitação</span>
          </button>
        </div>
      </header>

      {/* 4-KPI Metric Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Pendentes */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-2xs border border-slate-200/60 hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Pendentes
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {String(pendingCount).padStart(2, '0')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#B45309]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] text-[11px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span> +2 vs. ontem
            </span>
            <span className="text-xs text-slate-500">aguardando triagem</span>
          </div>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-2xs border border-slate-200/60 hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Em Andamento
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {String(inProgressCount).padStart(2, '0')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0051d5]">
              <Play className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0051d5] text-[11px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]"></span> Fluxo ativo
            </span>
            <span className="text-xs text-slate-500">8 squads envolvidos</span>
          </div>
        </div>

        {/* Card 3: Concluídas */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-2xs border border-slate-200/60 hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Concluídas (Semana)
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {concludedCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0c9488]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#0D9488] text-[11px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> +18% na semana
            </span>
            <span className="text-xs text-slate-500 font-medium">SLA 98.2%</span>
          </div>
        </div>

        {/* Card 4: Atrasadas */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow-2xs border border-slate-200/60 hover:shadow-xs transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Atrasadas / SLA Crítico
              </span>
              <span className="text-3xl font-extrabold text-red-600 mt-1 tabular-nums">
                {String(criticalCount).padStart(2, '0')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded-full bg-[#FFF1F2] text-[#E11D48] text-[11px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"></span> Atenção imediata
            </span>
            <span className="text-xs text-slate-500">Operações & Suporte</span>
          </div>
        </div>
      </section>

      {/* Main Asymmetric Workspace Layout (8 Cols + 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Metrics Chart & Demands Table (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Weekly Productivity Chart Section */}
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#0051d5]" />
                  <h2 className="text-base font-bold text-slate-900">
                    Produtividade Semanal das Equipes
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparativo de entregas dentro do prazo por setor e volume diário
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-xs font-medium text-slate-600">
                  Média: <strong className="text-slate-900 font-bold">94.2% On-Time</strong>
                </span>
                <div className="flex items-center bg-[#eff4ff] rounded-lg p-0.5 border border-slate-200/50">
                  <button
                    onClick={() => setChartViewMode('diario')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      chartViewMode === 'diario'
                        ? 'bg-white shadow-xs text-slate-900'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Diário
                  </button>
                  <button
                    onClick={() => setChartViewMode('semanal')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      chartViewMode === 'semanal'
                        ? 'bg-white shadow-xs text-slate-900'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Semanal
                  </button>
                </div>
              </div>
            </div>

            {/* Sector Performance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#eff4ff]/60 border border-slate-200/50">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-500">Marketing e Vendas</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">92%</span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#0D9488]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-500">Financeiro</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">96%</span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#0D9488]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-500">Logística</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">94%</span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#0D9488]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-500">Gestão de Pessoas (RH)</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">98%</span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#0D9488]" />
                </div>
              </div>
            </div>

            {/* High-Fidelity SVG Chart */}
            <div className="w-full pt-1">
              <div className="w-full h-52 flex flex-col justify-end">
                <svg
                  className="w-full h-40 overflow-visible"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 600 160"
                >
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="10" x2="600" y2="10" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="130" x2="600" y2="130" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Monday Group */}
                  <rect x="50" y="42" width="22" height="88" rx="4" fill="#cbd5e1" />
                  <rect x="76" y="24" width="22" height="106" rx="4" fill="#0051d5" />

                  {/* Tuesday Group */}
                  <rect x="170" y="36" width="22" height="94" rx="4" fill="#cbd5e1" />
                  <rect x="196" y="16" width="22" height="114" rx="4" fill="#0051d5" />

                  {/* Wednesday Group */}
                  <rect x="290" y="52" width="22" height="78" rx="4" fill="#cbd5e1" />
                  <rect x="316" y="30" width="22" height="100" rx="4" fill="#0051d5" />

                  {/* Thursday Group */}
                  <rect x="410" y="40" width="22" height="90" rx="4" fill="#cbd5e1" />
                  <rect x="436" y="12" width="22" height="118" rx="4" fill="#0051d5" />

                  {/* Friday Group */}
                  <rect x="530" y="60" width="22" height="70" rx="4" fill="#cbd5e1" />
                  <rect x="556" y="38" width="22" height="92" rx="4" fill="#0051d5" />

                  {/* SLA Target Polyline */}
                  <path
                    d="M 87 22 L 207 14 L 327 28 L 447 10 L 567 34"
                    fill="none"
                    stroke="#0c9488"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Polyline Points */}
                  <circle cx="87" cy="22" r="3.5" fill="#ffffff" stroke="#0c9488" strokeWidth="2" />
                  <circle cx="207" cy="14" r="3.5" fill="#ffffff" stroke="#0c9488" strokeWidth="2" />
                  <circle cx="327" cy="28" r="3.5" fill="#ffffff" stroke="#0c9488" strokeWidth="2" />
                  <circle cx="447" cy="10" r="3.5" fill="#ffffff" stroke="#0c9488" strokeWidth="2" />
                  <circle cx="567" cy="34" r="3.5" fill="#ffffff" stroke="#0c9488" strokeWidth="2" />
                </svg>

                {/* Horizontal Axis Labels */}
                <div className="flex justify-between items-center px-4 pt-2 text-[11px] font-semibold text-slate-500">
                  <span>Seg (42/48)</span>
                  <span>Ter (50/54)</span>
                  <span>Qua (38/41)</span>
                  <span className="text-[#0051d5] font-bold">Qui (56/60)</span>
                  <span>Sex (32/36)</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#cbd5e1]"></span> Demandas Previstas
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#0051d5]"></span> Demandas Entregues
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#0c9488] rounded-full"></span> % Aderência SLA
                </span>
              </div>
              <span className="text-slate-400 font-medium">Ciclo: Sprint 21</span>
            </div>
          </section>

          {/* Critical & Recent Demands Table Section */}
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Solicitações Críticas & Recentes
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fila operacional priorizada por criticidade de SLA
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={tableFilter}
                    onChange={(e) => setTableFilter(e.target.value)}
                    placeholder="Filtrar demandas..."
                    className="h-8 pl-7 pr-3 rounded-lg bg-[#eff4ff] text-xs font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0051d5] border border-slate-200/50"
                  />
                  <Filter className="w-3.5 h-3.5 absolute left-2 top-2.5 text-slate-400" />
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                  title="Atualizar fila"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#eff4ff]/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3 rounded-l-lg">ID & Tarefa</th>
                    <th className="py-2.5 px-3">Setor</th>
                    <th className="py-2.5 px-3">Responsável</th>
                    <th className="py-2.5 px-3">Prioridade</th>
                    <th className="py-2.5 px-3">Prazo / SLA</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDemands.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Clock className="w-8 h-8 text-slate-300" />
                          <span className="text-xs font-semibold text-slate-700">Nenhuma solicitação ativa</span>
                          <p className="text-[11px] text-slate-400 max-w-xs">
                            A esteira de demandas está zerada. Clique no botão abaixo para registrar a primeira solicitação operacional.
                          </p>
                          <button
                            type="button"
                            onClick={onOpenNewDemand}
                            className="mt-2 px-3.5 py-1.5 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#003ea8] transition-colors"
                          >
                            Nova Solicitação
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDemands.map((demand) => {
                    const isOverdue = demand.status === 'Atrasada';
                    return (
                      <tr
                        key={demand.id}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                        onClick={() => onInspectDemand(demand)}
                      >
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 group-hover:text-[#0051d5] transition-colors">
                              {demand.title}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {demand.protocol} • {demand.createdAtRelative}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[11px] font-semibold text-slate-700">
                            {demand.department}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <SafeImage
                              src={demand.assigneeAvatar}
                              alt={demand.assigneeName}
                              fallbackInitials={demand.assigneeInitials}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-slate-800 font-medium">{demand.assigneeName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                              demand.priority === 'Urgente'
                                ? 'bg-red-50 text-red-600'
                                : demand.priority === 'Alta'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                demand.priority === 'Urgente'
                                  ? 'bg-red-600'
                                  : demand.priority === 'Alta'
                                  ? 'bg-amber-600'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {demand.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span
                              className={`font-semibold ${
                                isOverdue ? 'text-red-600 font-bold' : 'text-slate-800'
                              }`}
                            >
                              {demand.deadlineRelative}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {demand.deadlineDisplay}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {isOverdue && (
                              <button
                                type="button"
                                onClick={() => onCobrarDemand(demand.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-semibold transition-colors"
                              >
                                Cobrar
                              </button>
                            )}
                            {demand.status === 'Pendente' && (
                              <button
                                type="button"
                                onClick={() => onApproveDemand(demand.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#0051d5] text-white hover:bg-[#003ea8] text-[11px] font-semibold transition-colors"
                              >
                                Aprovar
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onInspectDemand(demand)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Mostrando {filteredDemands.length} de {demands.length} demandas ativas</span>
              <button
                type="button"
                onClick={onNavigateToDemands}
                className="font-semibold text-[#0051d5] hover:underline flex items-center gap-1"
              >
                Ver todas as demandas <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Real-Time Team Status, Approvals & Quick Audits (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Team Members Real-Time Status */}
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0051d5]" />
                <h2 className="text-sm font-bold text-slate-900">Equipe em Tempo Real</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#0D9488] text-[11px] font-semibold">
                8/9 Presentes
              </span>
            </div>

            {/* Collaborators Stack */}
            <div className="flex flex-col gap-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <SafeImage
                        src={member.avatar}
                        alt={member.name}
                        fallbackInitials={member.initials}
                        className="w-9 h-9 rounded-full"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          member.status === 'online' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                        }`}
                        title={member.statusText}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">
                        {member.department} • {member.tasksCount} tarefas
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-[11px] font-semibold ${
                        member.punchStatus === 'Ponto Ok' ? 'text-[#0D9488]' : 'text-[#B45309]'
                      }`}
                    >
                      {member.punchStatus}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{member.punchTime}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={onNavigateToTimeClock}
                className="w-full sm:flex-1 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-slate-800 text-xs font-semibold transition-colors text-center"
              >
                Ver Escala & Ponto
              </button>
              {onNavigateToTeam && (
                <button
                  type="button"
                  onClick={onNavigateToTeam}
                  className="w-full sm:flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors text-center"
                >
                  Gerenciar Logins
                </button>
              )}
            </div>
          </section>

          {/* Central de Alertas */}
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#0051d5]" />
                <h2 className="text-sm font-bold text-slate-900">Central de Alertas</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{alerts.length} novos</span>
            </div>

            {approvalFeedback && (
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{approvalFeedback}</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {alerts.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">Tudo em conformidade</span>
                  <p className="text-[11px] text-slate-400">Nenhum alerta crítico ou aprovação pendente.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 ${
                      alert.type === 'sla_breach'
                        ? 'bg-red-50/50 border-red-100 text-red-900'
                        : alert.type === 'approval'
                        ? 'bg-blue-50/50 border-blue-100 text-slate-800'
                        : 'bg-[#eff4ff]/60 border-slate-200/60 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs flex items-center gap-1">
                        {alert.type === 'sla_breach' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0051d5]" />
                        )}
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{alert.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{alert.description}</p>

                    {alert.type === 'approval' && (
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleQuickApprove(alert.id, alert.reqId)}
                          className="px-2.5 py-1 rounded-lg bg-[#0051d5] text-white text-[11px] font-semibold hover:bg-[#003ea8] transition-colors"
                        >
                          Aprovar Agora
                        </button>
                        <button
                          type="button"
                          onClick={() => setApprovalFeedback('Solicitação recusada e enviada para revisão.')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Recusar
                        </button>
                      </div>
                    )}

                    {alert.type === 'sla_breach' && (
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={onNavigateToDemands}
                          className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-semibold hover:bg-red-700 transition-colors"
                        >
                          Intervir na Fila
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Quick Compliance Action Banner */}
          <section className="p-5 rounded-2xl bg-gradient-to-br from-[#131b2e] to-[#0051d5] text-white shadow-md flex flex-col justify-between gap-4 relative overflow-hidden">
            <div className="flex flex-col gap-1 relative z-10">
              <div className="flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-[#89f5e7]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#dbe1ff]">
                  Compliance & RH
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Auditoria de Espelho de Ponto</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                02 registros pendentes de validação para o fechamento quinzenal.
              </p>
            </div>

            <div className="flex items-center justify-between relative z-10 pt-1">
              <button
                type="button"
                onClick={onNavigateToTimeClock}
                className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
              >
                Auditar Marcações
              </button>
              <span className="text-xs text-blue-200 font-mono">Corte: 25/05</span>
            </div>

            {/* Ambient decorative glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          </section>
        </div>
      </div>
    </div>
  );
}
