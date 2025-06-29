import React from "react";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTitle({
  children,
  className = "",
}: PageTitleProps) {
  return <h1 className={`text-3xl font-bold mb-8 ${className}`}>{children}</h1>;
}
