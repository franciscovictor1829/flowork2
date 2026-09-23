import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Conecta - Gestão Operacional & Produtividade',
  description: 'Plataforma corporativa de gestão de demandas, processos, SLA, ponto eletrônico e ranking de produtividade para PMEs.',
  openGraph: {
    title: 'Conecta - Gestão Operacional & Produtividade',
    description: 'Plataforma corporativa de gestão de demandas, processos, SLA, ponto eletrônico e ranking de produtividade para PMEs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conecta - Gestão Operacional & Produtividade',
    description: 'Plataforma corporativa de gestão de demandas, processos, SLA, ponto eletrônico e ranking de produtividade para PMEs.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="antialiased bg-[#f8f9ff] text-[#0b1c30] min-h-screen selection:bg-[#0051d5]/15 selection:text-[#0051d5]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
