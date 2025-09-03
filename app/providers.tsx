"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <KindeProvider>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </KindeProvider>
  );
}
