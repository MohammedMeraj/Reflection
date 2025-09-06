import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Dashboard - Vertex",
  description: "Developer dashboard for managing super admins",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
