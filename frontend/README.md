# Frontend Sistema IDAM

Interface web do Sistema IDAM, desenvolvida em React, TypeScript e Vite.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- lucide-react
- react-router-dom
- react-to-print
- Recharts

## Setup

```bash
cd frontend
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Variaveis De Ambiente

Crie `frontend/.env` quando precisar trocar a URL da API:

```env
VITE_API_URL=http://localhost:8000/api
```

Sem essa variavel, o frontend usa `http://localhost:8000/api` somente em
desenvolvimento. Em producao, configure `VITE_API_URL` com a URL publica da API,
incluindo o prefixo `/api` (por exemplo, `https://api.exemplo.com/api`).

## Deploy No Vercel

O arquivo `vercel.json` na raiz configura o build da pasta `frontend`, publica
`frontend/dist` e redireciona rotas do React Router para a aplicacao. Importe o
repositorio no Vercel mantendo a raiz do projeto como diretório raiz e configure
a variavel `VITE_API_URL` nas configuracoes do projeto para apontar ao backend
Django publicado. O Vercel publica a interface; o backend Django precisa estar
hospedado e acessivel separadamente, com CORS permitindo o dominio do frontend.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Tambem e possivel rodar pela raiz:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estrutura Principal

```text
src/
  app/          Rotas e shell principal
  components/   Componentes compartilhados e UI base
  constants/    Opcoes de formularios
  features/     Modulos funcionais
  hooks/        Hooks reutilizaveis
  pages/        Entradas de paginas
  services/     Clientes de API e persistencia local
  styles/       Estilos globais, tema e impressao
  types/        Tipos TypeScript compartilhados
```

## Modulos Da Interface

- Login e controle de sessao.
- Dashboard administrativo.
- Cadastro e relatorio de produtores.
- Atendimento e historico tecnico.
- Emissao de documentos.
- Cronograma de visitas.
- Comunidades e veiculos.
- Recomendacoes tecnicas.

## Integracao Com A API

O cliente HTTP fica em:

```text
src/services/apiClient.ts
```

Ele usa JWT salvo pelo fluxo de autenticacao e envia:

```text
Authorization: Bearer <access_token>
```

Quando a API fica indisponivel, algumas telas mantem fallback local em
`localStorage` para preservar a operacao basica.

## Validacao

```bash
npm run build
npm run lint
```

O build valida TypeScript e empacota a aplicacao para producao.

## Impressao E Documentos

Os componentes de documentos usam `react-to-print` e estilos de impressao em
cada modelo. Ao alterar declaracoes, SEFAZ ou documentos de atendimento, teste a
visualizacao e o comando de impressao/PDF.
