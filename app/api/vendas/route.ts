import { NextResponse } from "next/server";
import { saleSchema } from "@/lib/validations/sale-schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    if (!await getAuthenticatedUser()) return NextResponse.json({ error: "Faça login para continuar." }, { status: 401 });
    const body = await request.json();
    const parsed = saleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados da venda inválidos.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase não configurado no servidor." }, { status: 503 });

    const { id_cliente, id_produto, quantidade, forma_pagamento } = parsed.data;
    const { data: product, error: productError } = await supabase.from("produtos").select("preco, estoque").eq("id_produto", id_produto).single();
    if (productError || !product) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    if (product.estoque < quantidade) return NextResponse.json({ error: `Estoque insuficiente. Disponível: ${product.estoque} unidade(s).` }, { status: 409 });

    const { data: sale, error } = await supabase.from("vendas").insert({
      id_venda: `ven-${crypto.randomUUID()}`,
      id_cliente,
      id_produto,
      data_venda: new Date().toISOString().slice(0, 10),
      quantidade,
      valor_unitario: product.preco,
      forma_pagamento,
    }).select("*").single();

    if (error) return NextResponse.json({ error: "Não foi possível registrar a venda.", details: error.message }, { status: 400 });
    return NextResponse.json({ sale }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar a requisição." }, { status: 500 });
  }
}
