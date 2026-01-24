import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import AuthProvider from './components/AuthProvider';
import NeonAuthProvider from './components/NeonAuthProvider';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xyre Holdings CRM',
  description: 'Custom Wholesale CRM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NeonAuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NeonAuthProvider>
      </body >
    </html >
  );
}
