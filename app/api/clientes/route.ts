import { NextResponse } from "next/server";
import { customerSchema } from "@/lib/validations/customer-schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    if (!await getAuthenticatedUser()) return NextResponse.json({ error: "Faça login para continuar." }, { status: 401 });
    const parsed = customerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Dados do cliente inválidos.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    const supabase = getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase não configurado no servidor." }, { status: 503 });
    const { data, error } = await supabase.from("clientes").insert({ id_cliente: `cli-${crypto.randomUUID()}`, ...parsed.data, data_cadastro: new Date().toISOString().slice(0, 10) }).select("*").single();
    if (error) return NextResponse.json({ error: error.code === "23505" ? "Este e-mail já está cadastrado." : "Não foi possível cadastrar o cliente.", details: error.message }, { status: 400 });
    return NextResponse.json({ customer: data }, { status: 201 });
  } catch { return NextResponse.json({ error: "Não foi possível processar a requisição." }, { status: 500 }); }
}
