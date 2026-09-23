'use client';

import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  ShieldCheck,
  MapPin,
  Wifi,
  Clock,
  Calendar,
  CheckCircle2,
  Trophy,
  Lock,
  ArrowUp,
  ArrowRight,
  TrendingDown,
  Info,
  HelpCircle,
  FileCheck,
  PlusCircle,
} from 'lucide-react';
import { DailyLedger, LeaderboardEntry, PunchSlot } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';
import { IMAGE_URLS, WEEKLY_LEDGER, LEADERBOARD } from '@/lib/mockData';

interface TimeAndRankingViewProps {
  onOpenPunchModal: () => void;
  onOpenAdjustModal: () => void;
  todayPunches: PunchSlot[];
}

export function TimeAndRankingView({
  onOpenPunchModal,
  onOpenAdjustModal,
  todayPunches,
}: TimeAndRankingViewProps) {
  const [currentTimeStr, setCurrentTimeStr] = useState('14:26:45');
  const [currentDateStr, setCurrentDateStr] = useState('Quinta-feira, 24 de Outubro');
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  // Live ticking clock with official BRT time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('pt-BR', { hour12: false });
      const date = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      setCurrentTimeStr(time);
      setCurrentDateStr(date.charAt(0).toUpperCase() + date.slice(1));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = todayPunches.filter((p) => p.completed).length;
  const hoursWorkedStr =
    completedCount === 0
      ? '0h 00min'
      : completedCount === 1
      ? 'Em expediente'
      : completedCount === 2
      ? '3h 30min (Intervalo)'
      : completedCount === 3
      ? '5h 26min'
      : '8h 00min';
  const progressPercent =
    completedCount === 0 ? 0 : completedCount === 1 ? 15 : completedCount === 2 ? 45 : completedCount === 3 ? 68 : 100;

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Portaria 671 MTE & Legal Security Header */}
      <section className="p-4 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Ponto Eletrônico Certificado • Portaria 671 MTE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                REP-P Conforme
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Assinatura digital ICP-Brasil • Geocerca Corporativa • Anonimização LGPD ativa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NTP Oficial:</span>
          <span className="font-bold text-slate-900 tabular-nums">{currentTimeStr} BRT</span>
        </div>
      </section>

      {/* Main Grid: Clocking Hero & Punch Slots (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Biometric Punch Hero & Timesheet (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Punch Hero Card */}
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {currentDateStr}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {currentTimeStr}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Sincronizado
                </span>
              </div>

              {/* Geocerca & Connection status */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rede Corporativa: <strong>SP_CORP_04</strong> (IP Seguro)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-[#0051d5]" />
                  <span>Local: <strong>Rua Bela Cintra, 1149 (Matriz SP)</strong></span>
                </div>
              </div>
            </div>

            {/* Big 1-Touch Punch Button */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={onOpenPunchModal}
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#0051d5] to-[#1e66e2] text-white flex flex-col items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all ring-8 ring-blue-50 group cursor-pointer"
              >
                <Fingerprint className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold mt-1 tracking-wider uppercase">BATER PONTO</span>
              </button>
              <span className="text-[11px] text-slate-400 mt-2 font-medium">Toque para autenticar</span>
            </div>
          </section>

          {/* Today's 4 Punch Slots */}
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Marcações de Hoje (Quinta-feira)</h2>
              <span className="text-xs text-slate-500 font-medium">Jornada contratual: 8h00 diárias</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {todayPunches.map((slot) => (
                <div
                  key={slot.slot}
                  className={`p-3.5 rounded-xl border text-center flex flex-col gap-1 transition-all ${
                    slot.completed
                      ? 'bg-blue-50/50 border-blue-200 text-slate-900'
                      : slot.isCurrent
                      ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-100'
                      : 'bg-slate-50 border-slate-200/70 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {slot.label}
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                    {slot.time}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      slot.completed
                        ? 'text-emerald-700'
                        : slot.isCurrent
                        ? 'text-amber-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {slot.statusText}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar to 8h00 goal */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold mb-1 text-slate-600">
                <span>Horas trabalhadas hoje: {hoursWorkedStr}</span>
                <span className="text-[#0051d5]">Meta: 8h 00min ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0051d5] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* Weekly Timesheet & Bank of Hours */}
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Espelho Semanal de Ponto</h2>
                <p className="text-xs text-slate-500">Histórico de marcações validadas pelo ponto eletrônico</p>
              </div>

              <button
                type="button"
                onClick={onOpenAdjustModal}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#0051d5]" />
                <span>Solicitar Ajuste ou Atestado</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 rounded-l-lg">Dia</th>
                    <th className="py-2.5 px-3">1º Entrada</th>
                    <th className="py-2.5 px-3">Almoço (S)</th>
                    <th className="py-2.5 px-3">Almoço (R)</th>
                    <th className="py-2.5 px-3">4º Saída</th>
                    <th className="py-2.5 px-3">Trabalhado</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Saldo Diário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {WEEKLY_LEDGER.map((ledger) => (
                    <tr
                      key={ledger.dayName}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        ledger.isToday ? 'bg-blue-50/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                        {ledger.dayName} <span className="text-slate-400 text-[11px]">({ledger.dateStr})</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{ledger.punch1}</td>
                      <td className="py-2.5 px-3 text-slate-700">{ledger.punch2}</td>
                      <td className="py-2.5 px-3 text-slate-700">{ledger.punch3}</td>
                      <td className="py-2.5 px-3 text-slate-700">{ledger.punch4}</td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                        {ledger.hoursWorked}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <span
                          className={`font-semibold ${
                            ledger.balance.startsWith('+')
                              ? 'text-emerald-600'
                              : ledger.isToday
                              ? 'text-blue-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {ledger.balance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bank of hours balance */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <span className="font-semibold text-slate-700">
                Saldo Acumulado no Banco de Horas (Semana Vigente):
              </span>
              <span className="text-sm font-extrabold text-slate-800 font-mono">
                {completedCount > 0 ? '+0h 15min' : '0h 00min'}
              </span>
            </div>
          </section>
        </div>

        {/* Right Column: Privacy-Preserved Monthly Leaderboard (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h2 className="text-sm font-bold text-slate-900">Ranking Mensal da Equipe</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conformidade LGPD: apenas o próprio usuário visualiza métricas nominais
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="Critérios de Privacidade"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy Notice Banner */}
            {showPrivacyInfo && (
              <div className="p-3 bg-blue-50 text-slate-700 rounded-xl text-xs space-y-1 animate-fade-in border border-blue-100">
                <span className="font-bold text-[#0051d5] block">Regra de Privacidade & Compliance:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Para evitar exposição indevida ou assédio moral (conforme diretrizes MPT e LGPD), colegas de equipe
                  são exibidos por pseudônimos operacionais. Cada colaborador possui acesso exclusivo às suas próprias métricas detalhadas.
                </p>
              </div>
            )}

            {/* User Highlight Card (Top 3) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#eff4ff] to-[#dbe1ff] border border-blue-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  #3
                </div>
                <div className="flex items-center gap-2.5">
                  <SafeImage
                    src={IMAGE_URLS.beatrizLimaThumb}
                    alt="Beatriz Lima"
                    fallbackInitials="BL"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Beatriz Lima (Você)
                    </span>
                    <span className="text-[11px] text-slate-600">Top 3 do Setor Financeiro</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#0051d5] block">98% Eficácia</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-0.5">
                  <ArrowUp className="w-3 h-3" /> +2 posições
                </span>
              </div>
            </div>

            {/* Teammates List (Anonymized & Clean) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Posições Gerais do Ciclo
              </span>

              {LEADERBOARD.map((item) => {
                if (item.isCurrentUser) return null; // already highlighted above

                return (
                  <div
                    key={item.position}
                    className="p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-xs border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 font-bold text-slate-400 font-mono text-center">
                        #{item.position}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.department}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {item.relativeStatus}
                      </span>
                      {item.statusTrend === 'double_up' || item.statusTrend === 'up' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      ) : item.statusTrend === 'down' ? (
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 text-center">
              Critérios de pontuação: 50% Pontualidade de SLA, 30% Assertividade Técnica, 20% Registro de Ponto Regular.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
