# Fontes consultadas para exportação Power BI

- Microsoft Power Query PostgreSQL connector: https://learn.microsoft.com/en-us/power-query/connectors/postgresql
  - Power BI Desktop oferece o conector PostgreSQL com modos Import e DirectQuery.
  - A conexão pede servidor, banco e credenciais Database.
  - Versões atuais já incluem o provedor Npgsql.

- Supabase — connecting to Postgres: https://supabase.com/docs/guides/database/connecting-to-postgres
  - A string de conexão deve ser copiada pelo botão Connect do projeto.
  - Session pooler é alternativa para redes IPv4-only.
  - O banco é `postgres`; host, porta e usuário devem vir da string copiada.
  - SSL deve ser usado sempre que possível.

- Supabase — Power BI Service certificate issue: https://supabase.com/docs/guides/troubleshooting/powerbi-service-error-the-remote-certificate-is-invalid-according-to-the-validation-procedure-640a98
  - Atualizações agendadas no Power BI Service podem falhar por validação do certificado SSL do Supabase.
  - Alternativas: On-premises Data Gateway com certificado confiável ou armazenamento intermediário, como CSV.

Decisão do projeto: para a demonstração atual, usar exportação CSV autenticada; conexão direta PostgreSQL fica para uma etapa posterior.
