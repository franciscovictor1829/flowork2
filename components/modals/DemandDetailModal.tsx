'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, User, Calendar, MessageSquare, Send } from 'lucide-react';
import { Demand } from '@/lib/types';
import { SafeImage } from '@/components/SafeImage';

interface DemandDetailModalProps {
  demand: Demand | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (demandId: string, newStatus: Demand['status']) => void;
  onNotifyUrgency?: (demandId: string) => void;
}

export function DemandDetailModal({
  demand,
  isOpen,
  onClose,
  onUpdateStatus,
  onNotifyUrgency,
}: DemandDetailModalProps) {
  const [comment, setComment] = useState('');
  const [notes, setNotes] = useState<string[]>([
    'Demanda recepcionada pela esteira operacional e catalogada no ERP.',
  ]);

  if (!isOpen || !demand) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setNotes((prev) => [...prev, `${comment} (Registrado agora)`]);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#0051d5]">
                {demand.protocol}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                {demand.department}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  demand.status === 'Atrasada'
                    ? 'bg-red-100 text-red-700'
                    : demand.status === 'Concluída'
                    ? 'bg-emerald-100 text-emerald-700'
                    : demand.status === 'Em Andamento'
                    ? 'bg-blue-100 text-[#0051d5]'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {demand.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{demand.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left text-sm text-slate-700">
          {/* Overview grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <SafeImage
                src={demand.assigneeAvatar}
                alt={demand.assigneeName}
                fallbackInitials={demand.assigneeInitials}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Responsável
                </span>
                <span className="font-semibold text-slate-800 text-xs block">{demand.assigneeName}</span>
                <span className="text-[11px] text-slate-500">{demand.assigneeRole}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Prazo / SLA
                </span>
                <span className="font-semibold text-slate-800 text-xs block">{demand.deadlineDisplay}</span>
                <span className={`text-[11px] ${demand.slaBreach ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                  {demand.deadlineRelative}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
              Escopo & Detalhamento
            </h4>
            <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
              {demand.description}
            </p>
          </div>

          {/* Progress gauge */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Progresso da Demanda</span>
              <span className="text-[#0051d5] font-bold">{demand.progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  demand.status === 'Concluída'
                    ? 'bg-emerald-500'
                    : demand.status === 'Atrasada'
                    ? 'bg-red-500'
                    : 'bg-[#0051d5]'
                }`}
                style={{ width: `${demand.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Comments & Activity Log */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              Linha do Tempo & Despachos
            </h4>
            <div className="space-y-2 mb-3">
              {notes.map((note, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0051d5] mt-1.5 shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Adicionar nota de despacho ou observação..."
                className="flex-1 h-9 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
              />
              <button
                type="submit"
                className="px-3 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Despachar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {demand.status !== 'Concluída' && onUpdateStatus && (
              <button
                onClick={() => {
                  onUpdateStatus(demand.id, 'Concluída');
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Concluir Demanda
              </button>
            )}
            {demand.status === 'Atrasada' && onNotifyUrgency && (
              <button
                onClick={() => {
                  onNotifyUrgency(demand.id);
                  onClose();
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Cobrar Urgência
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
