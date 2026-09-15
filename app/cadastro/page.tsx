import { SignupForm } from "@/components/auth/signup-form";
import { Card } from "@/components/ui/card";

export default function CadastroPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-6 py-16">
      <Card className="w-full">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Novo acesso</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Criar conta</h1>
        <p className="mt-3 text-slate-400">Cadastre seu e-mail para acessar a área administrativa da LojaTech.</p>
        <SignupForm />
      </Card>
    </main>
  );
}
