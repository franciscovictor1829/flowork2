import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9ff] text-slate-800 p-4">
      <h2 className="text-2xl font-bold mb-2">Página não encontrada</h2>
      <p className="text-sm text-slate-500 mb-4">A página solicitada não existe ou foi movida.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#0051d5] text-white rounded-xl text-xs font-semibold hover:bg-[#003ea8]"
      >
        Voltar para a Conecta
      </Link>
    </div>
  );
}
