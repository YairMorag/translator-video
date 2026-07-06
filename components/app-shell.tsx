"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  ShieldCheck,
  X,
  LayoutDashboard,
  Users2,
  FileBarChart,
  ClipboardPlus,
  CalendarDays,
  ListChecks,
  TrendingUp,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { RoleBadge } from "@/components/role-badge";
import { signOut } from "@/lib/auth/actions";
import { APP_NAME } from "@/lib/config";
import type { Role } from "@/lib/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Nav config lives here (not passed in from server layouts) because Server
// Components cannot pass component references like Lucide icons as props
// into a Client Component — only serializable data crosses that boundary.
const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  school_admin: [
    { label: "לוח בקרה", href: "/admin", icon: LayoutDashboard },
    { label: "קבוצות", href: "/admin/teams", icon: Users2 },
    { label: "דוחות", href: "/admin/reports", icon: FileBarChart },
  ],
  coach: [
    { label: "לוח בקרה", href: "/coach", icon: LayoutDashboard },
    { label: "הקבוצות שלי", href: "/coach/teams", icon: Users2 },
    { label: "הקצאת משימות", href: "/coach/assign", icon: ClipboardPlus },
  ],
  parent: [
    { label: "בית", href: "/parent", icon: Home },
    { label: "אישור הורה", href: "/parent/consent", icon: ShieldCheck },
  ],
  player: [
    { label: "היום", href: "/player", icon: CalendarDays },
    { label: "השבוע שלי", href: "/player/week", icon: ListChecks },
    { label: "התקדמות", href: "/player/progress", icon: TrendingUp },
  ],
};

export function AppShell({
  role,
  userName,
  schoolName,
  children,
}: {
  role: Role;
  userName: string;
  schoolName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  }

  const nav = (
    <nav className="flex-1 space-y-1 px-3">
      {NAV_BY_ROLE[role].map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-active text-white"
                : "text-sidebar-foreground hover:bg-sidebar-active/60 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const identity = (
    <div className="space-y-3 border-t border-white/10 px-4 pt-4">
      <div>
        <p className="text-sm font-medium text-white">{userName}</p>
        {schoolName && <p className="text-xs text-sidebar-muted">{schoolName}</p>}
      </div>
      <RoleBadge role={role} />
      <form action={signOut}>
        <button
          type="submit"
          className="flex items-center gap-2 text-xs text-sidebar-muted transition-colors hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> התנתקות
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-60 flex-col bg-sidebar py-5 md:flex">
        <div className="flex items-center gap-2 px-4 pb-4">
          <ShieldCheck className="h-6 w-6 text-white" />
          <span className="text-sm font-semibold text-white">{APP_NAME}</span>
        </div>
        {nav}
        <div className="mt-auto">{identity}</div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm font-semibold">{APP_NAME}</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="פתיחת תפריט"
          className="rounded-md p-2 text-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 start-0 flex w-64 flex-col bg-sidebar py-5">
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">{APP_NAME}</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="סגירת תפריט"
                className="rounded-md p-1 text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            <div className="mt-auto">{identity}</div>
          </div>
        </div>
      )}

      <main className="md:ms-60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
