import { Link } from "@heroui/link";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <nav className="w-full border-b border-default-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <NextLink href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">IFTAI</span>
        </NextLink>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {siteConfig.navItems.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              className="text-default-600 hover:text-foreground transition-colors"
            >
              {item.label}
            </NextLink>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          {/* Add your custom navbar elements here */}
        </div>
      </div>
    </nav>
  );
};
