# Sistema de Gerenciamento de Infrações de Trânsito

Sistema fullstack para gerenciamento de infrações de trânsito desenvolvido com Node.js, TypeScript, Prisma ORM (PostgreSQL), React e Tailwind CSS 4.

## 📋 Descrição

Este sistema permite o gerenciamento completo de infrações de trânsito conforme o Código Brasileiro de Trânsito (Lei Federal nº 9.503/1997). O sistema cadastra condutores, veículos, tipos de infrações e registra autos de infração em uma rodovia de 120 quilômetros.

## 🏗️ Arquitetura

O projeto está organizado da seguinte forma:

```
traffic-violations/
├── src/
│   ├── db/                 # Configuração do Prisma Client
│   ├── services/           # Lógica de negócio
│   ├── controllers/        # Controllers HTTP
│   ├── routes/             # Rotas centralizadas
│   └── server.ts           # Servidor Express
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
├── client/                 # Frontend React com Tailwind CSS 4 (placeholder)
└── package.json
```

## 🗄️ Banco de Dados

### Tecnologia

- **PostgreSQL** - Banco de dados relacional escolhido devido à necessidade de integridade referencial e relacionamentos complexos entre as entidades.
- **Neon** - Banco de dados PostgreSQL serverless usado para hospedagem (veja [NEON_SETUP.md](./NEON_SETUP.md) para configuração)

### Entidades

1. **TrafficViolationType** (Tipo de Infração)

   - Descrição
   - Nível (LEVE, MEDIA, GRAVE, GRAVISSIMA)
   - Pontos (3, 4, 5 ou 7 pontos respectivamente)

2. **Driver** (Condutor)

   - Nome
   - Sexo
   - Data de nascimento
   - Número de registro de habilitação (único)
   - Validade da habilitação

3. **Vehicle** (Veículo)

   - Placa (única)
   - Espécie (PASSAGEIROS, CARGA, MISTO, COMPETICAO, TRACAO, ESPECIAL, COLECAO)
   - Marca
   - Modelo
   - Proprietário (opcional, referência a Driver)

4. **TrafficViolation** (Auto de Infração)
   - Tipo de infração
   - Veículo infrator
   - Condutor
   - Data e horário da infração
   - Local na rodovia (quilômetro entre 1 e 120)

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL instalado e rodando
- npm ou yarn

### Instalação

1. Clone o repositório e entre na pasta:

```bash
cd traffic-violations
```

2. Instale as dependências do backend:

```bash
npm install
```

3. Configure o banco de dados:

   - Crie um arquivo `.env` na raiz do projeto:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/traffic_violations?schema=public"
   PORT=3000
   ```

   - Substitua `user`, `password` e `localhost:5432` pelas suas credenciais do PostgreSQL.

4. Gere o Prisma Client:

```bash
npm run prisma:generate
```

5. Execute as migrações do banco de dados:

```bash
npm run prisma:migrate
```

6. (Opcional) Abra o Prisma Studio para visualizar o banco:

```bash
npm run prisma:studio
```

### Executar o Backend

Em modo de desenvolvimento:

```bash
npm run dev
```

Para produção:

```bash
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3000`

### Executar o Frontend

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

O frontend estará disponível em `http://localhost:3000` (se configurado proxy) ou `http://localhost:3001`

## 📡 Endpoints da API

### Tipos de Infração

- `GET /api/traffic-violation-types` - Lista todos os tipos
- `GET /api/traffic-violation-types/:id` - Busca por ID
- `POST /api/traffic-violation-types` - Cria novo tipo
- `PUT /api/traffic-violation-types/:id` - Atualiza tipo
- `DELETE /api/traffic-violation-types/:id` - Remove tipo

### Condutores

- `GET /api/drivers` - Lista todos os condutores
- `GET /api/drivers/:id` - Busca por ID
- `GET /api/drivers/violators` - Lista condutores infratores ordenados por pontuação
- `POST /api/drivers` - Cria novo condutor
- `PUT /api/drivers/:id` - Atualiza condutor
- `DELETE /api/drivers/:id` - Remove condutor

### Veículos

- `GET /api/vehicles` - Lista todos os veículos
- `GET /api/vehicles/:id` - Busca por ID
- `GET /api/vehicles/species/:species` - Lista veículos por espécie
- `POST /api/vehicles` - Cria novo veículo
- `PUT /api/vehicles/:id` - Atualiza veículo
- `DELETE /api/vehicles/:id` - Remove veículo

### Infrações

- `GET /api/traffic-violations` - Lista todas as infrações
- `GET /api/traffic-violations/:id` - Busca por ID
- `GET /api/traffic-violations/detailed` - Lista detalhada com informações completas
- `POST /api/traffic-violations` - Cria nova infração
- `PUT /api/traffic-violations/:id` - Atualiza infração
- `DELETE /api/traffic-violations/:id` - Remove infração

### Health Check

- `GET /health` - Verifica status da API

## 🔒 Validações e Regras de Negócio

1. **Número de registro de habilitação único**: Não é possível cadastrar dois condutores com o mesmo número de registro.

2. **Placa única**: Não é possível cadastrar dois veículos com a mesma placa.

3. **Localização da rodovia**: O local da infração deve ser um valor entre 1 e 120 quilômetros.

4. **Pontuação automática**: A pontuação é calculada automaticamente baseada no nível da infração:

   - Leve: 3 pontos
   - Média: 4 pontos
   - Grave: 5 pontos
   - Gravíssima: 7 pontos

5. **Relacionamentos obrigatórios**: Ao criar uma infração, o tipo, veículo e condutor devem existir no banco.

## 📝 Exemplos de Uso

### Criar um Tipo de Infração

```bash
POST /api/traffic-violation-types
Content-Type: application/json

{
  "description": "Dirigir sem cinto de segurança",
  "level": "GRAVE"
}
```

### Criar um Condutor

```bash
POST /api/drivers
Content-Type: application/json

{
  "name": "João Silva",
  "gender": "MASCULINO",
  "birthDate": "1990-05-15",
  "licenseNumber": "123456789",
  "licenseValidity": "2025-12-31"
}
```

### Criar um Veículo

```bash
POST /api/vehicles
Content-Type: application/json

{
  "plate": "ABC-1234",
  "species": "PASSAGEIROS",
  "brand": "Toyota",
  "model": "Corolla",
  "ownerId": "uuid-do-condutor"
}
```

### Registrar uma Infração

```bash
POST /api/traffic-violations
Content-Type: application/json

{
  "violationTypeId": "uuid-do-tipo",
  "vehicleId": "uuid-do-veiculo",
  "driverId": "uuid-do-condutor",
  "violationDateTime": "2024-01-15T14:30:00",
  "roadLocation": 45
}
```

## 🛠️ Tecnologias Utilizadas

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL

### Frontend

- React
- React Scripts
- Tailwind CSS 4

## 📄 Licença

ISC

## 👤 Autor

Magno Silva
