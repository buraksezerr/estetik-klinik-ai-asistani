// Minimal outer wrapper — login sayfası buradan geçer, header içermez.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
