import "./portal.css";
import { ReactNode } from "react";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <div className="portal-root min-h-screen">{children}</div>;
}
