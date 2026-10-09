import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AquaHeat — Mumbai Heat Safety | Predict → Prevent → Respond',
  description:
    'A calm, human-centered heat safety and personal well-being companion for Greater Mumbai.',
  keywords: [
    'AquaHeat',
    'Mumbai Heat Safety',
    'Heat Wave Action Plan',
    'Hydration',
    'Mumbai Weather Relief',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F8FAF7] text-[#132A2F] antialiased font-sans selection:bg-[#4FC3C8]/30 selection:text-[#087F8C]">
        {children}
      </body>
    </html>
  );
}
