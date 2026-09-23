'use client';

import React, { useState } from 'react';
import { X, FileDown, Check, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [downloading, setDownloading] = useState<'pdf' | 'csv' | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (format: 'pdf' | 'csv') => {
    setDownloading(format);
    setTimeout(() => {
      setDownloading(null);
      setDownloadSuccess(format.toUpperCase());
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 2500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] text-white flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Relatório Operacional Consolidado</h3>
              <p className="text-xs text-slate-500">Métricas de SLA, demandas, horas trabalhadas e ranking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Ciclo Vigente</span>
              <span className="font-semibold text-slate-800 text-sm">Sprint 21 (Q3 2024)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Aderência Global</span>
              <span className="font-semibold text-emerald-600 text-sm">98.2% dentro do SLA</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100/60">
            <p className="font-semibold text-slate-800">Conteúdo do Relatório:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Mapeamento de 42 demandas ativas e histórico semanal</li>
              <li>Aderência por setor: Financeiro (95%), Operações (92%), Suporte (88%), Comercial (90%)</li>
              <li>Espelho de ponto consolidado e saldo de banco de horas (+1h 15m)</li>
              <li>Auditoria de compliance LGPD e Portaria 671 MTE</li>
            </ul>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Relatório em {downloadSuccess} gerado e transferido com sucesso!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading !== null}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              {downloading === 'pdf' ? 'Gerando PDF...' : 'Baixar PDF'}
            </button>
            <button
              onClick={() => handleDownload('csv')}
              disabled={downloading !== null}
              className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              {downloading === 'csv' ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
