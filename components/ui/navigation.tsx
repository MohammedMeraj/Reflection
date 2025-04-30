"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChartSpline, PlusSquare, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility function for combining classNames

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  {
    icon: <Home size={18} />,  
    label: "Home",
    href: "/home",
  },
  {
    icon: <ChartSpline size={18} />,
    label: "Overview",
    href: "/overview",
  },
  {
    icon: <PlusSquare size={18} />,
    label: "Attendance",
    href: "/attendance",
  },
  {
    icon: <MessageSquare size={18} />,
    label: "Messages",
    href: "/messages",
  },
  {
    icon: <User size={18} />,
    label: "Profile",
    href: "/profile",
  },
];

export const MobileNavigation: FC = () => {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <nav className="flex justify-around items-center h-16">
        {navigationItems.map((item: NavigationItem) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div>{item.icon}</div>
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};