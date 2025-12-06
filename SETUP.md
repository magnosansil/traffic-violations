# Guia de Setup Rápido

## Passo a Passo para Configurar o Projeto

### 1. Instalar Dependências do Backend

```bash
npm install
```

### 2. Configurar Banco de Dados

Você tem duas opções:

#### Opção A: Neon (Recomendado - PostgreSQL Serverless)

1. Siga o guia completo em [NEON_SETUP.md](./NEON_SETUP.md)
2. Crie um projeto no [Neon](https://neon.tech)
3. Copie a connection string do dashboard
4. Crie um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="postgresql://usuario:senha@ep-xxx-xxx.region.neon.tech/dbname?sslmode=require"
   PORT=3000
   ```

#### Opção B: PostgreSQL Local

1. Certifique-se de que o PostgreSQL está instalado e rodando
2. Crie um banco de dados:

   ```sql
   CREATE DATABASE traffic_violations;
   ```

3. Crie um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/traffic_violations?schema=public"
   PORT=3000
   ```
   **Substitua `seu_usuario` e `sua_senha` pelas suas credenciais do PostgreSQL.**

### 3. Configurar Prisma

1. Gere o Prisma Client:

   ```bash
   npm run prisma:generate
   ```

2. Execute a migração inicial do banco de dados:
   ```bash
   npm run prisma:migrate
   ```
   Quando solicitado, dê um nome para a migração (ex: `init`)

### 4. (Opcional) Popular o Banco com Dados de Exemplo

```bash
npm run prisma:seed
```

### 5. Executar o Servidor Backend

Em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

Você pode testar a API acessando:

- Health check: `http://localhost:3000/health`
- Endpoints: `http://localhost:3000/api/...`

### 6. (Opcional) Visualizar o Banco de Dados

Para abrir o Prisma Studio e visualizar os dados:

```bash
npm run prisma:studio
```

Isso abrirá uma interface web em `http://localhost:5555`

### 7. Configurar o Frontend

1. Entre na pasta do client:

   ```bash
   cd client
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm start
   ```

O frontend estará disponível em `http://localhost:3000` (com proxy configurado) ou `http://localhost:3001`

## Estrutura de Arquivos Criada

```
traffic-violations/
├── src/
│   ├── db/
│   │   └── prisma.ts              # Configuração do Prisma Client
│   ├── services/                   # Lógica de negócio
│   │   ├── TrafficViolationTypeService.ts
│   │   ├── DriverService.ts
│   │   ├── VehicleService.ts
│   │   └── TrafficViolationService.ts
│   ├── controllers/                # Controllers HTTP
│   │   ├── TrafficViolationTypeController.ts
│   │   ├── DriverController.ts
│   │   ├── VehicleController.ts
│   │   └── TrafficViolationController.ts
│   ├── routes/
│   │   └── index.ts               # Rotas centralizadas
│   └── server.ts                   # Servidor Express
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   └── seed.ts                    # Script para popular banco
├── client/                        # Frontend React (placeholder)
└── package.json
```

## Próximos Passos

1. Testar os endpoints da API usando Postman, Insomnia ou curl
2. Verificar se todas as validações estão funcionando corretamente
3. Desenvolver o frontend completo quando estiver pronto

## Solução de Problemas

### Erro ao conectar ao banco de dados

- Verifique se o PostgreSQL está rodando
- Confirme se as credenciais no `.env` estão corretas
- Verifique se o banco de dados `traffic_violations` foi criado

### Erro ao executar migrações

- Certifique-se de que o Prisma Client foi gerado primeiro (`npm run prisma:generate`)
- Verifique se o arquivo `.env` está na raiz do projeto

### Porta já em uso

- Altere a porta no arquivo `.env` (ex: `PORT=3001`)
- Ou pare o processo que está usando a porta 3000
