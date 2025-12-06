# 🚀 Configuração do Neon Database

Este guia explica como configurar o banco de dados Neon (PostgreSQL serverless) para o projeto.

## 📋 O que é Neon?

O [Neon](https://neon.tech) é um banco de dados PostgreSQL serverless que oferece:

- ✅ Escalabilidade automática
- ✅ Pausa automática quando não está em uso (plano gratuito)
- ✅ Backups automáticos
- ✅ Conexões serverless
- ✅ Compatível com PostgreSQL padrão

## 🔧 Passo a Passo

### 1. Criar Conta no Neon

1. Acesse [https://neon.tech](https://neon.tech)
2. Faça login ou crie uma conta (pode usar GitHub, Google, etc.)
3. Crie um novo projeto

### 2. Criar Banco de Dados

1. No dashboard do Neon, crie um novo projeto
2. Escolha um nome para o projeto (ex: `traffic-violations`)
3. Selecione a região mais próxima
4. Escolha a versão do PostgreSQL (recomendado: 15 ou 16)

### 3. Obter a URL de Conexão

1. No dashboard do Neon, vá em **"Connection Details"** ou **"Connection String"**
2. Copie a **Connection String** que será algo como:
   ```
   postgresql://usuario:senha@ep-xxx-xxx.region.neon.tech/dbname?sslmode=require
   ```
3. Ou copie os dados individuais:
   - **Host**: `ep-xxx-xxx.region.neon.tech`
   - **Database**: nome do banco
   - **User**: seu usuário
   - **Password**: sua senha
   - **Port**: 5432 (padrão)

### 4. Configurar o Arquivo .env

Crie ou atualize o arquivo `.env` na raiz do projeto:

```env
# URL de conexão do Neon
DATABASE_URL="postgresql://usuario:senha@ep-xxx-xxx.region.neon.tech/dbname?sslmode=require"

# Porta do servidor
PORT=3000
```

**Importante:**

- Substitua `usuario`, `senha`, `ep-xxx-xxx.region.neon.tech` e `dbname` pelos valores do seu projeto Neon
- O parâmetro `?sslmode=require` é necessário para conexões seguras com Neon
- **NUNCA** commite o arquivo `.env` no Git (ele já deve estar no `.gitignore`)

### 5. Executar Migrações

Após configurar a `DATABASE_URL`, execute as migrações:

```bash
npm run prisma:migrate
```

Ou se for a primeira vez:

```bash
npx prisma migrate dev --name init
```

### 6. Popular o Banco (Opcional)

Para popular o banco com dados de exemplo:

```bash
npm run prisma:seed
```

## 🔐 Configurações de Segurança

### SSL/TLS

O Neon requer conexões SSL. A configuração já está incluída no código:

- **Aplicação**: O `src/db/prisma.ts` já configura SSL automaticamente quando detecta `neon.tech` na URL
- **Seed**: O Prisma Client padrão usa SSL automaticamente quando `sslmode=require` está na URL

### Pool de Conexões

O Neon funciona melhor com configurações específicas de pool:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Neon funciona melhor com conexões individuais
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
});
```

Essa configuração já está aplicada em `src/db/prisma.ts`.

## 🌐 Conexões Serverless

O Neon suporta conexões serverless que são ideais para:

- Funções serverless (AWS Lambda, Vercel Functions, etc.)
- Aplicações com tráfego intermitente
- Desenvolvimento local

### Branching (Neon Pro)

No plano Pro, o Neon oferece "branching" - a capacidade de criar branches do banco de dados, similar ao Git. Isso é útil para:

- Ambientes de desenvolvimento separados
- Testes isolados
- Preview deployments

## 📊 Monitoramento

No dashboard do Neon você pode:

- Ver métricas de uso
- Monitorar queries
- Ver logs de conexão
- Gerenciar backups

## 🔄 Migrando de PostgreSQL Local

Se você estava usando PostgreSQL local e quer migrar para Neon:

1. **Exportar dados locais** (se necessário):

   ```bash
   pg_dump -h localhost -U usuario -d traffic_violations > backup.sql
   ```

2. **Criar projeto no Neon** (seguir passos acima)

3. **Importar dados** (se necessário):

   ```bash
   psql "postgresql://usuario:senha@ep-xxx-xxx.region.neon.tech/dbname?sslmode=require" < backup.sql
   ```

4. **Atualizar DATABASE_URL** no `.env`

5. **Testar conexão**:
   ```bash
   npm run prisma:studio
   ```

## ⚠️ Limitações do Plano Gratuito

O plano gratuito do Neon tem algumas limitações:

- Banco pausa automaticamente após inatividade
- Primeira conexão após pausa pode levar alguns segundos
- Limites de armazenamento e compute

Para produção, considere o plano Pro.

## 🆘 Troubleshooting

### Erro: "Connection closed"

- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que `sslmode=require` está na URL
- Verifique se o banco não está pausado (no dashboard do Neon)

### Erro: "SSL required"

- Adicione `?sslmode=require` na `DATABASE_URL`
- Ou use `?sslmode=prefer` para tentar SSL primeiro

### Erro: "Connection timeout"

- Verifique sua conexão com a internet
- Verifique se o firewall não está bloqueando
- Tente novamente (pode ser que o banco esteja "acordando" após pausa)

### Primeira conexão lenta

- Normal após o banco estar pausado
- Conexões subsequentes serão mais rápidas

## 📚 Recursos

- [Documentação do Neon](https://neon.tech/docs)
- [Guia de Conexão Prisma + Neon](https://neon.tech/docs/guides/prisma)
- [Dashboard Neon](https://console.neon.tech)

## ✅ Checklist

- [ ] Conta criada no Neon
- [ ] Projeto criado no Neon
- [ ] `DATABASE_URL` configurada no `.env`
- [ ] Migrações executadas (`npm run prisma:migrate`)
- [ ] Seed executado (opcional: `npm run prisma:seed`)
- [ ] Teste de conexão bem-sucedido (`npm run prisma:studio`)
