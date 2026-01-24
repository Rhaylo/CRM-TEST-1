import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
<<<<<<< HEAD
<<<<<<< HEAD
// import AuthProvider from './components/AuthProvider';
import NeonAuthProvider from './components/NeonAuthProvider';
import ClientLayout from './components/ClientLayout';
=======
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthProvider from './components/AuthProvider';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthProvider from './components/AuthProvider';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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
<<<<<<< HEAD
<<<<<<< HEAD
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NeonAuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NeonAuthProvider>
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="layout-container">
            <Sidebar />
            <div className="main-content">
              <Header />
              <main className="page-content">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
      </body>
    </html>
  );
}

