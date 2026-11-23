"use client";

import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="ayu-page-transition">
      {children}
    </div>
  );
}
