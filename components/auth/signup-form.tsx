"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: "error", text: "A senha precisa ter pelo menos 6 caracteres." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não conferem." });
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message.toLowerCase().includes("already registered") ? "Este e-mail já está cadastrado." : "Não foi possível criar a conta." });
        return;
      }

      if (data.session) {
        router.push("/store/vendas");
        router.refresh();
        return;
      }

      setMessage({ type: "success", text: "Conta criada. Verifique seu e-mail para confirmar o cadastro antes de entrar." });
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ type: "error", text: "Não foi possível conectar ao serviço de autenticação." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {message && <p role={message.type === "error" ? "alert" : "status"} className={`rounded-xl border p-3 text-sm ${message.type === "error" ? "border-rose-400/20 bg-rose-400/10 text-rose-300" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"}`}>{message.text}</p>}
      <label className="block text-sm font-medium text-slate-200">E-mail<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field mt-2" placeholder="voce@exemplo.com" /></label>
      <label className="block text-sm font-medium text-slate-200">Senha<input required type="password" minLength={6} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="field mt-2" placeholder="Mínimo de 6 caracteres" /></label>
      <label className="block text-sm font-medium text-slate-200">Confirmar senha<input required type="password" minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="field mt-2" placeholder="Repita sua senha" /></label>
      <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Criando conta..." : "Criar conta"}</button>
      <p className="text-center text-sm text-slate-400">Já possui uma conta? <Link href="/login" className="text-cyan-300 hover:text-cyan-200">Entrar</Link></p>
    </form>
  );
}
