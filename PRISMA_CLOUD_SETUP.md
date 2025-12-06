# 🚀 Configurando Prisma Data Platform (Prisma Cloud)

Este guia explica como configurar seu banco de dados no Prisma Cloud usando Prisma Accelerate.

## 📋 Pré-requisitos

1. Uma conta no [Prisma Cloud](https://cloud.prisma.io) (gratuita para começar)
2. Um banco de dados PostgreSQL (pode ser local, na nuvem, ou criado pelo Prisma)

## 🔧 Passo a Passo

### 1. Criar Conta no Prisma Cloud

1. Acesse [https://cloud.prisma.io](https://cloud.prisma.io)
2. Faça login ou crie uma conta (pode usar GitHub, Google, etc.)
3. Crie um novo projeto

### 2. Conectar seu Banco de Dados

Você tem duas opções:

#### Opção A: Usar um Banco Existente

1. No Prisma Cloud, vá em **"Add Database"**
2. Escolha **"Connect existing database"**
3. Forneça a URL de conexão do seu banco PostgreSQL:
   ```
   postgresql://usuario:senha@host:porta/nome_do_banco?schema=public
   ```
4. O Prisma irá criar uma conexão segura

#### Opção B: Criar um Banco Novo (Recomendado)

1. No Prisma Cloud, vá em **"Add Database"**
2. Escolha **"Create new database"**
3. Selecione um provedor (ex: Neon, Supabase, Railway, etc.)
4. Siga as instruções para criar o banco
5. O Prisma irá fornecer a URL de conexão automaticamente

### 3. Obter a URL do Prisma Accelerate

1. No seu projeto no Prisma Cloud, vá em **"Accelerate"**
2. Copie a **Accelerate URL** (formato: `prisma://accelerate.prisma-data.net/?api_key=...`)
3. Esta URL é diferente da URL direta do banco

### 4. Configurar o Arquivo .env

Adicione as seguintes variáveis no seu arquivo `.env`:

```env
# URL direta do banco (para migrações)
DATABASE_URL="postgresql://usuario:senha@host:porta/nome_do_banco?schema=public"

# URL do Prisma Accelerate (para a aplicação)
PRISMA_ACCELERATE_URL="prisma://accelerate.prisma-data.net/?api_key=seu_api_key_aqui"

# Porta do servidor
PORT=3000
```

**Importante:**

- `DATABASE_URL`: Usada para migrações (`prisma migrate`)
- `PRISMA_ACCELERATE_URL`: Usada pela aplicação em runtime (mais rápida e com cache)

### 5. Executar Migrações

Com o `DATABASE_URL` configurado, execute:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6. Testar a Aplicação

```bash
npm run dev
```

A aplicação agora usará o Prisma Accelerate automaticamente!

## 🔄 Como Funciona

O código está configurado para:

- **Usar Prisma Accelerate** quando `PRISMA_ACCELERATE_URL` estiver definida
- **Usar conexão direta** quando apenas `DATABASE_URL` estiver definida

Isso permite flexibilidade entre desenvolvimento local e produção na nuvem.

## 📚 Recursos Adicionais

- [Documentação do Prisma Accelerate](https://www.prisma.io/docs/accelerate)
- [Prisma Cloud Dashboard](https://cloud.prisma.io)
- [Guia de Migração para Prisma 7](https://www.prisma.io/docs/orm/prisma-7)

## ⚠️ Notas de Segurança

- **Nunca** commite o arquivo `.env` no Git
- Mantenha suas URLs seguras
- Use variáveis de ambiente em produção
- O Prisma Accelerate usa conexões seguras (HTTPS)
