"use client";

import { MotionConfig } from "motion/react";
import { StoreProvider } from "@/lib/store";
import { AmbianceProvider } from "@/lib/ambiance";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AmbianceProvider>
        <StoreProvider>{children}</StoreProvider>
      </AmbianceProvider>
    </MotionConfig>
  );
}
