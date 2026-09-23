'use client';

import React, { useState } from 'react';
import { X, ClipboardCheck, Paperclip, CheckCircle2 } from 'lucide-react';

interface AdjustTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdjustTimeModal({ isOpen, onClose }: AdjustTimeModalProps) {
  const [type, setType] = useState<'ajuste' | 'atestado'>('ajuste');
  const [date, setDate] = useState('2024-10-24');
  const [slot, setSlot] = useState('4º Saída');
  const [correctedTime, setCorrectedTime] = useState('18:00');
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] text-white flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Solicitar Ajuste ou Atestado</h3>
              <p className="text-xs text-slate-500">Validação pelo RH e gestor direto dentro do prazo legal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('ajuste')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                type === 'ajuste' ? 'bg-white text-[#0051d5] shadow-sm' : 'text-slate-600'
              }`}
            >
              Ajuste de Horário
            </button>
            <button
              type="button"
              onClick={() => setType('atestado')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                type === 'atestado' ? 'bg-white text-[#0051d5] shadow-sm' : 'text-slate-600'
              }`}
            >
              Atestado Médico / Declaração
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Data da Ocorrência</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5]"
            />
          </div>

          {type === 'ajuste' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Marcação</label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] bg-white cursor-pointer"
                >
                  <option value="1º Entrada">1º Entrada</option>
                  <option value="2º Almoço">2º Almoço</option>
                  <option value="3º Retorno">3º Retorno</option>
                  <option value="4º Saída">4º Saída</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horário Real</label>
                <input
                  type="time"
                  value={correctedTime}
                  onChange={(e) => setCorrectedTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Justificativa Legal</label>
            <textarea
              rows={2}
              required
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Descreva o motivo (ex: atendimento externo, instabilidade de conexão, consulta médica)..."
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] resize-none"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-slate-400" /> Anexar Comprovante (PDF/JPG)
            </span>
            <button type="button" className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50">
              Selecionar
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all flex items-center gap-1.5 ${
                isSuccess ? 'bg-emerald-600' : 'bg-[#0051d5] hover:bg-[#003ea8]'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Solicitação Enviada!
                </>
              ) : isSubmitting ? (
                'Enviando...'
              ) : (
                'Enviar ao RH'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
