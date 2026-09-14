# LojaTech

## Etapa 1 — Planejamento

Este repositório iniciará a construção da **LojaTech**, uma loja virtual fictícia de produtos de tecnologia, com foco em dois objetivos:

1. disponibilizar uma aplicação web simples, funcional, responsiva e visualmente moderna;
2. estruturar dados de produtos, clientes e vendas para consumo posterior em Power BI.

Nesta etapa, o foco é **somente planejamento**, sem geração de código da aplicação.

## Resumo da solução proposta

A solução será construída com **Next.js + App Router + TypeScript + React + Tailwind CSS**, usando:

- componentes reutilizáveis e acessíveis;
- dados mockados em **JSON** e camada de serviços;
- validação com **Zod**;
- formatação brasileira para moeda, datas e números;
- rotas de API ou **Server Actions** para leitura e gravação;
- organização preparada para futura migração para **PostgreSQL** ou **MySQL**.

O projeto será dividido por domínio e responsabilidade para evitar regras de negócio dentro da UI. Cálculos de faturamento, lucro, ticket médio, estoque baixo e agregações para dashboard ficarão em funções utilitárias e serviços dedicados.

## Arquitetura escolhida

### Camadas principais

1. **App Router (UI e rotas)**
   - páginas públicas: Home, Produtos, Contato;
   - páginas administrativas: Clientes, Vendas e Dashboard;
   - layout global, navegação e componentes compartilhados.

2. **Componentes**
   - componentes base reutilizáveis;
   - componentes de domínio para produtos, clientes, vendas e dashboard;
   - estados visuais de carregamento, vazio, erro e sucesso.

3. **Camada de dados**
   - arquivos JSON para `produtos`, `clientes` e `vendas`;
   - serviços responsáveis por leitura, busca, filtros, ordenação e gravação controlada;
   - interface estável para futura troca por banco relacional.

4. **Regras de negócio**
   - cálculos financeiros e analíticos desacoplados dos componentes;
   - validação de estoque, cálculo de total da venda e atualização de saldo disponível;
   - agregações para indicadores e gráficos.

5. **Validação e formatação**
   - schemas Zod para formulários e operações de venda/contato;
   - utilitários de `Intl` para moeda, data e números no padrão brasileiro.

6. **Preparação para BI**
   - exportação em `JSON` e `CSV`;
   - documentação do modelo estrela;
   - arquivos prontos para Power BI e Power Query.

## Estrutura de pastas proposta

```text
/
├── app/
│   ├── (store)/
│   │   ├── page.tsx
│   │   ├── produtos/page.tsx
│   │   └── contato/page.tsx
│   ├── (admin)/
│   │   ├── clientes/page.tsx
│   │   ├── vendas/page.tsx
│   │   └── dashboard/page.tsx
│   ├── api/
│   │   ├── vendas/route.ts
│   │   └── contato/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   ├── customers/
│   ├── sales/
│   └── dashboard/
├── data/
│   ├── mock/
│   │   ├── produtos.json
│   │   ├── clientes.json
│   │   └── vendas.json
│   └── export/
│       ├── produtos.csv
│       ├── clientes.csv
│       ├── vendas.csv
│       ├── calendario.csv
│       └── README.md
├── lib/
│   ├── services/
│   ├── validations/
│   ├── calculations/
│   ├── formatters/
│   ├── mappers/
│   └── utils/
├── types/
│   ├── produto.ts
│   ├── cliente.ts
│   ├── venda.ts
│   └── dashboard.ts
├── tests/
│   ├── calculations/
│   ├── services/
│   └── validations/
├── public/
│   └── images/
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Modelo de dados

### Produtos (dimensão)

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id_produto` | string | chave única |
| `nome` | string | nome comercial |
| `categoria` | string | categoria padronizada |
| `preco` | number | preço de venda |
| `custo` | number | custo unitário |
| `estoque` | number | saldo disponível |
| `descricao` | string | descrição resumida/detalhada |
| `imagem` | string | URL, asset local ou placeholder |
| `avaliacao` | number | escala numérica |
| `data_cadastro` | string | data ISO |

### Clientes (dimensão)

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id_cliente` | string | chave única |
| `nome` | string | nome completo |
| `cidade` | string | cidade brasileira |
| `estado` | string | UF |
| `data_cadastro` | string | data ISO |
| `email` | string | e-mail válido |

### Vendas (tabela fato)

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id_venda` | string | chave única |
| `data` | string | data ISO |
| `id_cliente` | string | FK para clientes |
| `id_produto` | string | FK para produtos |
| `quantidade` | number | quantidade vendida |
| `valor_unitario` | number | preço capturado no momento da venda |
| `valor_total` | number | `quantidade * valor_unitario` |
| `forma_pagamento` | string | Pix, crédito, débito, boleto |

### Calendário (dimensão futura/exportação)

| Campo | Tipo | Observação |
| --- | --- | --- |
| `data` | string | chave de relacionamento |
| `ano` | number | ano |
| `mes` | number | mês numérico |
| `nome_mes` | string | mês por extenso |
| `trimestre` | number | trimestre |
| `semestre` | number | semestre |

### Relacionamentos previstos

- `Vendas[id_cliente]` → `Clientes[id_cliente]`
- `Vendas[id_produto]` → `Produtos[id_produto]`
- `Vendas[data]` → `Calendario[data]`

## Dependências necessárias

### Base da aplicação

- `next`
- `react`
- `react-dom`
- `typescript`

### Estilo e UI

- `tailwindcss`
- `postcss`
- `autoprefixer`
- `clsx`
- `tailwind-merge`

### Validação e formulários

- `zod`
- `react-hook-form`
- `@hookform/resolvers`

### Dashboard e visualização

- `recharts`

### Qualidade

- `eslint`
- `eslint-config-next`
- ferramenta de testes compatível com a configuração criada na Etapa 2 (preferencialmente `vitest` + `@testing-library/react` para regras e componentes)

> Decisão: como o repositório ainda está vazio, a definição final das dependências será aplicada na **Etapa 2**, mantendo o planejamento independente de implementação prematura.

## Etapas de implementação

### Etapa 2 — Fundação

- inicializar o projeto Next.js com App Router e TypeScript;
- configurar Tailwind CSS;
- criar layout global, identidade visual e navegação;
- definir tipos TypeScript;
- criar dados mock iniciais;
- implementar utilitários de formatação;
- criar camada de serviços para leitura e escrita controlada.

### Etapa 3 — Páginas principais

- implementar Home com hero, destaques, categorias, promoções e rodapé;
- implementar Produtos com busca, filtro, ordenação, estoque e detalhes;
- implementar Clientes com tabela responsiva, filtros e ordenação;
- implementar Vendas com listagem, resumo, formulário e atualização de estoque;
- implementar Contato com formulário validado e feedback visual.

### Etapa 4 — Dashboard

- implementar cálculos reutilizáveis;
- criar indicadores principais;
- criar gráficos baseados em dados reais da camada mock;
- validar coerência entre os totais do dashboard e os registros de vendas.

### Etapa 5 — Exportação para Power BI

- gerar arquivos CSV e JSON de exportação;
- criar calendário analítico;
- documentar modelo estrela, relacionamentos e tipos;
- sugerir medidas DAX iniciais.

### Etapa 6 — Qualidade

- executar lint, testes e build;
- corrigir erros encontrados;
- revisar acessibilidade, responsividade e tratamento de estados;
- finalizar documentação de instalação, uso e importação no Power BI.

## Estratégia incremental de validação

Após cada etapa:

1. revisar os arquivos alterados;
2. validar visualmente a funcionalidade criada;
3. executar testes direcionados da área alterada;
4. executar `npm run lint`, `npm run build` e os testes ao final da implementação.

## O que foi criado nesta etapa

- **criado:** planejamento funcional e técnico do projeto;
- **arquivo alterado:** `/home/runner/work/LojaTech/LojaTech/README.md`;
- **como validar:** revisar este README e confirmar que ele cobre resumo da solução, arquitetura, estrutura de pastas, modelo de dados, dependências e plano incremental antes de aprovar a Etapa 2.
