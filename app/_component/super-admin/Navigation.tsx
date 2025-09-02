"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart3, UserPlus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  {
    icon: <Home size={18} />,  
    label: "Home",
    href: "/superAdmin",
  },
  {
    icon: <BarChart3 size={18} />,
    label: "Analytics",
    href: "/superAdmin/analytics",
  },
  {
    icon: <UserPlus size={18} />,
    label: "Manage",
    href: "/superAdmin/manage",
  },
  {
    icon: <Settings size={18} />,
    label: "Settings",
    href: "/superAdmin/settings",
  },
];

export const SuperAdminNavigation: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const { scrollToTop } = useSmoothScroll();

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setClickedItem(href);
    
    // Scroll to top smoothly, then navigate
    scrollToTop({ duration: 600, smooth: true });
    
    // Navigate after scroll animation starts
    setTimeout(() => {
      router.push(href);
      setClickedItem(null);
    }, 100);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <nav className="flex justify-around items-center h-16">
        {navigationItems.map((item: NavigationItem) => {
          const isActive = pathname === item.href;
          const isClicked = clickedItem === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(item.href, e)}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <div className="flex flex-col items-center justify-center">
                {/* Icon container with click effect */}
                <div className="relative p-2 rounded-full overflow-hidden">
                  {/* Active state background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-purple-100 rounded-full" />
                  )}
                  
                  {/* Click ripple effect */}
                  {isClicked && (
                    <div className="absolute inset-0 rounded-full">
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-300/60 rounded-full animate-ping"
                        style={{
                          width: '8px',
                          height: '8px',
                          animationDuration: '200ms',
                          animationFillMode: 'forwards',
                          animationTimingFunction: 'ease-out'
                        }}
                      />
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-200/40 rounded-full"
                        style={{
                          width: '8px',
                          height: '8px',
                          animation: 'ripple 200ms ease-out forwards'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={cn(
                    "relative z-10 transition-colors duration-200",
                    isActive ? "text-purple-600" : "text-muted-foreground"
                  )}>
                    {item.icon}
                  </div>
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200 mt-1",
                  isActive ? "text-purple-600" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <style jsx>{`
        @keyframes ripple {
          0% {
            width: 8px;
            height: 8px;
            opacity: 1;
          }
          100% {
            width: 32px;
            height: 32px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
