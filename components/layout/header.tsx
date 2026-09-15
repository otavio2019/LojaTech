import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";

const links = [
  { href: "/", label: "Início" },
  { href: "/store/produtos", label: "Produtos" },
  { href: "/store/clientes", label: "Clientes" },
  { href: "/store/vendas", label: "Vendas" },
  { href: "/store/dashboard", label: "Dashboard" },
];

export async function Header() {
  const user = await getAuthenticatedUser();
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-cyan-400 text-slate-950">LT</span>
          <span className="text-lg">Loja<span className="text-cyan-400">Tech</span></span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 sm:flex" aria-label="Navegação principal">
          {links.filter((link) => user || !["/store/clientes", "/store/vendas", "/store/dashboard"].includes(link.href)).map((link) => <Link key={link.href} href={link.href} className="hover:text-cyan-300">{link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-4">
          {user ? <LogoutButton /> : <Link href="/login" className="text-sm text-slate-300 hover:text-cyan-300">Entrar</Link>}
          <Link href="/store/produtos" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Explorar loja</Link>
        </div>
      </div>
    </header>
  );
}
