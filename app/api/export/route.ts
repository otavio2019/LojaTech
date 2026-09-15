import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";
import { getCustomersFromDatabase } from "@/lib/services/customer-service";
import { getProductsFromDatabase } from "@/lib/services/product-service";
import { getSalesFromDatabase } from "@/lib/services/sales-service";
import { toCsv } from "@/lib/utils/csv";

const exports = {
  clientes: {
    filename: "lojatech-clientes.csv",
    columns: ["id_cliente", "nome", "cidade", "estado", "data_cadastro", "email"],
  },
  produtos: {
    filename: "lojatech-produtos.csv",
    columns: ["id_produto", "nome", "categoria", "preco", "custo", "estoque", "descricao", "imagem", "avaliacao", "data_cadastro"],
  },
  vendas: {
    filename: "lojatech-vendas.csv",
    columns: ["id_venda", "data_venda", "id_cliente", "id_produto", "quantidade", "valor_unitario", "valor_total", "forma_pagamento"],
  },
  calendario: {
    filename: "lojatech-calendario.csv",
    columns: ["data", "ano", "mes", "nome_mes", "trimestre", "semestre"],
  },
} as const;

type ExportName = keyof typeof exports;

function buildCalendar(dates: string[]) {
  if (!dates.length) return [];
  const sorted = [...dates].sort();
  const start = new Date(`${sorted[0]}T00:00:00`);
  const end = new Date(`${sorted[sorted.length - 1]}T00:00:00`);
  const rows: Record<string, unknown>[] = [];
  const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    rows.push({
      data: date.toISOString().slice(0, 10),
      ano: year,
      mes: month,
      nome_mes: monthNames[month - 1],
      trimestre: Math.ceil(month / 3),
      semestre: month <= 6 ? 1 : 2,
    });
  }
  return rows;
}

export async function GET(request: Request) {
  if (!await getAuthenticatedUser()) return NextResponse.json({ error: "Faça login para exportar os dados." }, { status: 401 });

  const name = new URL(request.url).searchParams.get("tipo") as ExportName | null;
  if (!name || !(name in exports)) return NextResponse.json({ error: "Tipo de exportação inválido." }, { status: 400 });

  const [customers, products, sales] = await Promise.all([
    getCustomersFromDatabase(),
    getProductsFromDatabase(),
    getSalesFromDatabase(),
  ]);
  const config = exports[name];
  let rows: Record<string, unknown>[];

  if (name === "calendario") {
    rows = buildCalendar(sales.map((sale) => sale.data_venda));
  } else if (name === "clientes") {
    rows = customers as unknown as Record<string, unknown>[];
  } else if (name === "produtos") {
    rows = products as unknown as Record<string, unknown>[];
  } else {
    rows = sales as unknown as Record<string, unknown>[];
  }

  return new NextResponse(toCsv(rows, [...config.columns]), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${config.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
