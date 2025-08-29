import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MobileNavigation } from "@/app/_component/department-head/Navigation";
import { DepartmentHeadProtectedPage } from "@/app/_component/super-admin/AccessControl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Department Head",
  description: "Reflektion - Department Management",
};

export default function DepartmentHeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DepartmentHeadProtectedPage userEmail="rajesh.kumar@institute.edu">
      <main className="min-h-screen bg-gray-50">
        <div className="pb-16">
          {children}
        </div>
        <MobileNavigation />
      </main>
    </DepartmentHeadProtectedPage>
  );
}
