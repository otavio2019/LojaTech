import { NextResponse } from "next/server";
import { productSchema } from "@/lib/validations/product-schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    if (!await getAuthenticatedUser()) return NextResponse.json({ error: "Faça login para continuar." }, { status: 401 });
    const parsed = productSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Dados do produto inválidos.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    const supabase = getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase não configurado no servidor." }, { status: 503 });
    const { data, error } = await supabase.from("produtos").insert({ id_produto: `prod-${crypto.randomUUID()}`, ...parsed.data, imagem: "", avaliacao: 0, data_cadastro: new Date().toISOString().slice(0, 10) }).select("*").single();
    if (error) return NextResponse.json({ error: "Não foi possível cadastrar o produto.", details: error.message }, { status: 400 });
    return NextResponse.json({ product: data }, { status: 201 });
  } catch { return NextResponse.json({ error: "Não foi possível processar a requisição." }, { status: 500 }); }
}
