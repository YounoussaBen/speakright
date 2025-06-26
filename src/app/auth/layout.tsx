// src/app/auth/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages render without navbar and footer - just the content
  return <>{children}</>;
}
