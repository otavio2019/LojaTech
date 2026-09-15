"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ nextPath = "/store/vendas" }: { nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("E-mail ou senha inválidos.");
        return;
      }
      router.push(nextPath.startsWith("/") ? nextPath : "/store/vendas");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao serviço de autenticação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">{error}</p>}
      <label className="block text-sm font-medium text-slate-200">
        E-mail
        <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field mt-2" placeholder="voce@exemplo.com" />
      </label>
      <label className="block text-sm font-medium text-slate-200">
        Senha
        <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="field mt-2" placeholder="Sua senha" />
      </label>
      <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
