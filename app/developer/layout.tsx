"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Shield, Settings, Users, Activity, LogOut, Menu } from "lucide-react";
import DeveloperAuthWrapper from "../_component/developer/DeveloperAuthWrapper";

interface DeveloperLayoutProps {
  children: React.ReactNode;
}

export default function DeveloperLayout({ children }: DeveloperLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [developerData, setDeveloperData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem("developerData");
      if (data) {
        setDeveloperData(JSON.parse(data));
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("developerAuth");
      localStorage.removeItem("developerId");
      localStorage.removeItem("developerData");
    }
    router.push("/developer");
  };

  // Don't show layout for login page
  if (pathname === "/developer") {
    return <>{children}</>;
  }

  return (
    <DeveloperAuthWrapper>
      <div className="min-h-screen bg-slate-50">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center px-6 py-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-semibold">Developer Portal</h1>
                  <p className="text-slate-400 text-xs">{developerData?.username || 'Loading...'}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <NavItem 
                icon={Activity} 
                label="Dashboard" 
                href="/developer/dashboard"
                active={pathname === "/developer/dashboard"}
              />
              <NavItem 
                icon={Users} 
                label="Super Admins" 
                href="/developer/admins"
                active={pathname === "/developer/admins"}
              />
              <NavItem 
                icon={Settings} 
                label="System Settings" 
                href="/developer/settings"
                active={pathname === "/developer/settings"}
              />
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <main className="p-6">
            {children}
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </DeveloperAuthWrapper>
  );
}

interface NavItemProps {
  icon: any;
  label: string;
  href: string;
  active: boolean;
}

function NavItem({ icon: Icon, label, href, active }: NavItemProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
          : 'text-slate-400 hover:text-white hover:bg-slate-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
