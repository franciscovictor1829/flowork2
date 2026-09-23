'use client';

import React, { useState } from 'react';
import { X, Fingerprint, ShieldCheck, CheckCircle2, MapPin, Wifi } from 'lucide-react';

interface PunchClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPunch: (timeStr: string) => void;
  currentTimeStr: string;
}

export function PunchClockModal({
  isOpen,
  onClose,
  onConfirmPunch,
  currentTimeStr,
}: PunchClockModalProps) {
  const [step, setStep] = useState<'scan' | 'verifying' | 'success'>('scan');

  if (!isOpen) return null;

  const handleStartPunch = () => {
    setStep('verifying');
    setTimeout(() => {
      setStep('success');
      onConfirmPunch(currentTimeStr.slice(0, 5));
      setTimeout(() => {
        setStep('scan');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-6 text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'scan' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 text-[#0051d5] flex items-center justify-center mb-4 ring-8 ring-blue-50/50">
              <Fingerprint className="w-12 h-12" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Registro de Ponto Eletrônico
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-xs">
              Conformidade Portaria 671 MTE com verificação de vivacidade facial e geocerca corporativa ativa.
            </p>

            <div className="w-full bg-slate-50 rounded-xl p-3 mb-6 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" /> Rede Conectada
                </span>
                <span className="font-semibold text-slate-800">SP_CORP_04</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0051d5]" /> Geocerca
                </span>
                <span className="font-semibold text-emerald-600">Dentro do Perímetro (Matriz)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-1.5">
                <span className="text-slate-500">Horário NTP Oficial</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{currentTimeStr}</span>
              </div>
            </div>

            <button
              onClick={handleStartPunch}
              className="w-full py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl font-semibold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-5 h-5" />
              <span>Confirmar Registro Biométrico</span>
            </button>
          </div>
        )}

        {step === 'verifying' && (
          <div className="py-8 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-[#0051d5] animate-spin" />
              <ShieldCheck className="w-8 h-8 text-[#0051d5]" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Validando Certificado Digital</h4>
            <p className="text-xs text-slate-500 mt-1">Carimbo de tempo e vivacidade ICP-Brasil...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 flex flex-col items-center animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Ponto Batido com Sucesso!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Registro gravado às {currentTimeStr.slice(0, 5)} com comprovante gerado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
