"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { href: "/", label: "时间轴" },
  { href: "/search", label: "检索" },
  { href: "/import", label: "导入" },
  { href: "/settings", label: "设置" },
];

export function Header() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <header className="hidden md:block bg-cream-100 border-b border-cream-200">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base font-semibold text-warm-700 tracking-wide">
            信件档案
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname === link.href
                    ? "text-warm-700 bg-cream-200"
                    : "text-warm-400 hover:text-warm-700 hover:bg-cream-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={signOut}
          className="text-sm text-warm-400 hover:text-warm-700 transition-colors"
        >
          登出
        </button>
      </div>
    </header>
  );
}
