"use client";

import { MotionConfig } from "motion/react";
import { StoreProvider } from "@/lib/store";
import { AmbianceProvider } from "@/lib/ambiance";
import { FlyToCart } from "@/components/cart/FlyToCart";
import { PageTransition } from "./PageTransition";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AmbianceProvider>
        <StoreProvider>
          {children}
          <FlyToCart />
          <PageTransition />
        </StoreProvider>
      </AmbianceProvider>
    </MotionConfig>
  );
}
