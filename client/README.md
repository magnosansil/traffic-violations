# Frontend - Traffic Violations

Frontend React com Tailwind CSS 4.

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Execute o servidor de desenvolvimento:

```bash
npm start
```

## Tailwind CSS

O projeto está configurado com Tailwind CSS 4. Os estilos são aplicados através de classes utilitárias do Tailwind.

### Arquivos de Configuração

- `tailwind.config.js` - Configuração do Tailwind CSS
- `postcss.config.js` - Configuração do PostCSS
- `src/index.css` - Diretivas do Tailwind e estilos base

### Uso

Todas as classes do Tailwind estão disponíveis diretamente nos componentes React. Exemplo:

```jsx
<div className="bg-gray-800 text-white p-4 rounded-lg">Conteúdo</div>
```

## Estrutura

- `src/App.js` - Componente principal
- `src/index.js` - Ponto de entrada
- `src/index.css` - Estilos globais com Tailwind
