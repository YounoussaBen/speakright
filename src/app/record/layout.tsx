// src/app/record/layout.tsx
export default function RecordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Record page renders without footer - just navbar and content
  return <>{children}</>;
}
