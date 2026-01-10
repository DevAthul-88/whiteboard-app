import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from './components/ui/provider';
import { Toaster } from './components/ui/toaster';
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Realtime Whiteboard',
  description: 'Collaborative whiteboard with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />

        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
