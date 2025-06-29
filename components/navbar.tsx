import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <nav className="w-full border-b border-default-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <NextLink className="flex items-center gap-2" href="/">
          <span className="font-bold text-xl">IFTAI</span>
        </NextLink>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          {/* Add your custom navbar elements here */}
        </div>
      </div>
    </nav>
  );
};
