import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <nav className="w-full border-b border-default-200/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <NextLink className="flex items-center gap-2 hover:opacity-80 transition-opacity" href="/">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IF</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            IFTAI
          </span>
        </NextLink>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
};
