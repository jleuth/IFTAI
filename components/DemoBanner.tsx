"use client";

import { useState, useEffect } from "react";
import { isDemoMode } from "@/config/demo";

export default function DemoBanner() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    setShowBanner(isDemoMode);
  }, []);
  
  if (!showBanner) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <strong className="text-amber-800 dark:text-amber-200 font-semibold">
              Demo Mode Active
            </strong>
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            You're viewing a demonstration of IFTAI. External services are mocked and some features are restricted.
          </p>
        </div>
      </div>
    </div>
  );
}