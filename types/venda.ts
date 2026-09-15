export type FormaPagamento = 'credito' | 'debito' | 'boleto' | 'pix';

export interface Venda {
    id_venda: string;
    id_cliente: string;
    id_produto: string;
    data_venda: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    forma_pagamento: FormaPagamento;
}