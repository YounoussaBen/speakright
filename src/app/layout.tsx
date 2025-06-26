import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Providers } from '@/components/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpeakRight - AI-Powered Pronunciation Assessment',
  description:
    'Improve your pronunciation with real-time AI feedback and personalized learning.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar
              isAuthenticated={false}
              // For testing authenticated state, you can change to:
              // isAuthenticated={true}
              // user={{
              //   name: 'John Doe',
              //   email: 'john@example.com',
              //   avatar: 'https://github.com/shadcn.png',
              // }}
            />

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
