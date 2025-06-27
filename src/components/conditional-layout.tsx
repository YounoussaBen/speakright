// src/components/conditional-layout.tsx
'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Pages that should not show navbar and footer
  const excludeNavFooter = ['/auth'];

  // Pages that should show navbar but no footer (minimal layout)
  const excludeFooter = ['/record'];

  const shouldExcludeNavFooter = excludeNavFooter.some(path =>
    pathname.startsWith(path)
  );

  const shouldExcludeFooter = excludeFooter.some(path =>
    pathname.startsWith(path)
  );

  if (shouldExcludeNavFooter) {
    // Render only the content for auth pages
    return <>{children}</>;
  }

  if (shouldExcludeFooter) {
    // Render with navbar only for record page (minimal layout)
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // Render with navbar and footer for all other pages
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
