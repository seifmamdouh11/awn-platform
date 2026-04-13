"use client";

import { useEffect, useState } from "react";

type Props = {
  fullScreen?: boolean;
};

export default function Spinner({ fullScreen = true }: Props) {
 
  return (
    <div
      className={`${fullScreen
          ? "fixed inset-0 z-50 backdrop-blur-sm"
          : "w-full py-10"
        }
      flex items-center justify-center`}
    >
      <div className="relative">
        {/* outer ring */}
        <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-foreground/20 border-t-foreground"></div>

        {/* inner glow */}
        <div className="absolute inset-0 rounded-full blur-md bg-foreground/10"></div>
      </div>
    </div>
  );
}