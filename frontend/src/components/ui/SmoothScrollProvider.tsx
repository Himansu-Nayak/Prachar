"use client";

import React, { useEffect } from "react";
import { initSmoothScroll } from "@/lib/motion";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return <>{children}</>;
}
