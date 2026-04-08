"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/portal/logout-button";

interface PortalNavProps {
  teamId: string;
  teamName: string;
}

export default function PortalNav({ teamId, teamName }: PortalNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/submit", label: "Submit PPT" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-amber-100/90 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <div className="w-full rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 sm:w-auto">
          <p className="portal-kicker">EPOCH '26 Portal</p>
          <h1 className="mt-2 text-xl text-slate-900 sm:text-2xl">{teamName}</h1>
          <p className="mt-1 text-xs text-slate-600">Team ID: {teamId}</p>
        </div>

        <nav className="portal-nav-scroll flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:overflow-visible sm:pb-0">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-amber-300 bg-amber-100 text-amber-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
