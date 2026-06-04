"use client";

import { ReactNode } from "react";

interface ReaderViewProps {
  children: ReactNode;
  className?: string;
}

export default function ReaderView({ children, className = "" }: ReaderViewProps) {
  return (
    <div className={`max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 ${className}`}>
      {children}
    </div>
  );
}
