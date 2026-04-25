"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/calendar", label: "Takvim", icon: CalendarDays },
];

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1" aria-label="Admin menü">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              isActive
                ? "bg-rose-50 text-rose-500 font-medium"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
