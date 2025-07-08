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
    <div className="bg-yellow-100 border-yellow-500 text-yellow-700 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm">
            <strong>Demo Mode:</strong> You're viewing a demonstration of IFTAI. 
            External services are mocked and some features are restricted.
          </p>
        </div>
      </div>
    </div>
  );
}