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
  ];

  return (
    <header className="portal-nav-header">
      <div className="portal-nav-inner">
        <div className="portal-team-badge">
          <p className="portal-kicker">EPOCH '26 Portal</p>
          <h1 className="portal-team-name">{teamName}</h1>
          <p className="portal-team-id">Team ID: {teamId}</p>
        </div>

        <nav className="portal-nav-scroll portal-nav-links" aria-label="Portal navigation">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`portal-nav-link${active ? " is-active" : ""}`}
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
