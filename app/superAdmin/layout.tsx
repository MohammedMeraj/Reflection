import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SuperAdminNavigation } from "../_component/super-admin/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Super Admin",
  description: "Reflektion - Super Admin Dashboard",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      {children}
      <SuperAdminNavigation />
    </main>
  );
}
