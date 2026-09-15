import { Card } from "@/components/ui/card";
import { CustomerForm } from "@/components/customers/customer-form";
import { getCustomersFromDatabase } from "@/lib/services/customer-service";
import { formatDate } from "@/lib/formatters";

export default async function ClientesPage() {
  const customers = await getCustomersFromDatabase();
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Administração</p><h1 className="mt-3 text-4xl font-bold">Clientes</h1><p className="mt-3 text-slate-400">Base com {customers.length} clientes cadastrados.</p><div className="mt-8"><CustomerForm /></div><Card className="mt-8 overflow-x-auto p-0"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Cliente</th><th className="px-5 py-4">Localização</th><th className="px-5 py-4">E-mail</th><th className="px-5 py-4">Cadastro</th></tr></thead><tbody className="divide-y divide-white/5">{customers.map((customer) => <tr key={customer.id_cliente} className="hover:bg-white/[0.03]"><td className="px-5 py-4 font-medium text-white">{customer.nome}</td><td className="px-5 py-4 text-slate-300">{customer.cidade} - {customer.estado}</td><td className="px-5 py-4 text-slate-400">{customer.email}</td><td className="px-5 py-4 text-slate-400">{formatDate(customer.data_cadastro)}</td></tr>)}</tbody></table></Card></main>;
}
