import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'EdUGaP AI - Education Gap Filler AI',
  description: 'AI-driven learning gap detection, integrity-monitored assessments, personalized study planning, and PyTorch MLP academic risk prediction for modern institutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white font-sans">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
