"use client";

import { useState } from "react";
import { Home, Users, BookOpen, FlaskConical, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export const MobileNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollToTop } = useSmoothScroll();

  const navItems = [
    { 
      name: "Home", 
      icon: Home, 
      href: "/departmentHead",
      color: "text-blue-600",
      activeColor: "text-blue-700 bg-blue-50"
    },
    { 
      name: "Faculty", 
      icon: Users, 
      href: "/departmentHead/faculty",
      color: "text-blue-600",
      activeColor: "text-blue-700 bg-blue-50"
    },
    { 
      name: "Classes", 
      icon: BookOpen, 
      href: "/departmentHead/classes",
      color: "text-blue-600",
      activeColor: "text-blue-700 bg-blue-50"
    },
    { 
      name: "Subjects", 
      icon: BookOpenCheck, 
      href: "/departmentHead/subjects",
      color: "text-blue-600",
      activeColor: "text-blue-700 bg-blue-50"
    },
    { 
      name: "Labs", 
      icon: FlaskConical, 
      href: "/departmentHead/labs",
      color: "text-blue-600",
      activeColor: "text-blue-700 bg-blue-50"
    },
  ];

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTop({ duration: 600, smooth: true });
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(item.href, e)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? `${item.activeColor} font-bold transform scale-105`
                  : `${item.color} hover:bg-gray-50 opacity-70 hover:opacity-100`
              }`}
            >
              <Icon 
                size={20} 
                className={`${isActive ? "text-blue-700 font-bold" : "text-blue-600"} transition-all duration-200`}
              />
              <span 
                className={`text-xs mt-1 transition-all duration-200 ${
                  isActive 
                    ? "text-blue-700 font-bold" 
                    : "text-blue-600 font-medium"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
