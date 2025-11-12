"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
  const clerk = useClerk();

  useEffect(() => {
    // Programmatically sign out and redirect home
    if (clerk && typeof clerk.signOut === "function") {
      clerk.signOut({ redirectUrl: "/" });
    }
  }, [clerk]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-zinc-600 dark:text-zinc-400">Signing out...</p>
    </div>
  );
}
