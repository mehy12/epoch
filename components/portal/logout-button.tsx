"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await fetch("/api/portal/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="portal-btn-secondary portal-logout-btn disabled:opacity-70"
    >
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}
