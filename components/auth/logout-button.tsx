"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await createSupabaseBrowserClient().auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return <button type="button" onClick={handleLogout} disabled={isSubmitting} className="text-sm text-slate-400 hover:text-cyan-300 disabled:opacity-50">{isSubmitting ? "Saindo..." : "Sair"}</button>;
}
