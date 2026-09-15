import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/store/vendas";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-6 py-16">
      <Card className="w-full">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Área administrativa</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Entrar na LojaTech</h1>
        <p className="mt-3 text-slate-400">Use seu e-mail e senha para acessar clientes, produtos e vendas.</p>
        <LoginForm nextPath={nextPath} />
      </Card>
    </main>
  );
}
