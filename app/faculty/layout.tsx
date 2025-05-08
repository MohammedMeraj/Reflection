import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MobileNavigation } from "../_component/faculty/Navigation";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faculty",
  description: "Reflektion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
        <main className="min-h-screen ">
            {children}
         <MobileNavigation/>
        </main>
         
      
  );
}