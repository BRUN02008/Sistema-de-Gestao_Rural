# Sistema IDAM

Sistema web para apoio ao atendimento rural do IDAM, com cadastro de produtores,
acompanhamento tecnico, emissao documental, cronograma de visitas, relatorios e
gestao administrativa.

O projeto esta dividido em duas aplicacoes:

- `frontend/`: interface React + Vite.
- `backend/`: API Django REST Framework.

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Radix UI e lucide-react.
- Backend: Python, Django 5, Django REST Framework, SimpleJWT e drf-spectacular.
- Banco: SQLite em desenvolvimento local sem `DATABASE_URL`; PostgreSQL via Docker
  ou ambiente configurado.
- Infra local: Docker Compose para subir API e PostgreSQL.

## Principais Modulos

- Autenticacao e usuarios.
- Cadastro e consulta de produtores.
- Perfil do produtor, atividades rurais, localizacao e documentos.
- Agricultura, criacao animal, meliponicultura, carteira, registro e PAA via API.
- Comunidades, veiculos, cronogramas, recomendacoes tecnicas e atendimentos.
- Emissao de declaracoes e documentos SEFAZ.
- Dashboard e relatorios.

## Requisitos

- Node.js 20+.
- npm.
- Python 3.11+.
- Docker e Docker Compose, caso prefira rodar com PostgreSQL em container.

## Rodar Rapido

Instale as dependencias do frontend:

```bash
cd frontend
npm install
```

Prepare o backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Em outro terminal, rode o frontend:

```bash
cd frontend
npm run dev
```

URLs locais:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000/api/`
- Swagger: `http://localhost:8000/api/docs/`
- Admin Django: `http://localhost:8000/admin/`

## Rodar Com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

O Compose sobe:

- `db`: PostgreSQL 16.
- `backend`: Django/DRF em `http://localhost:8000`.

Depois rode o frontend em outro terminal:

```bash
npm --prefix frontend run dev
```

## Scripts Da Raiz

Os scripts da raiz encaminham comandos para o frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Variaveis De Ambiente

Backend:

```bash
copy backend\.env.example backend\.env
```

Principais variaveis:

- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `DATABASE_URL`
- `CORS_ALLOWED_ORIGINS`
- `ACCESS_TOKEN_LIFETIME_MINUTES`
- `REFRESH_TOKEN_LIFETIME_DAYS`

Frontend:

Crie `frontend/.env` se precisar apontar para outra API:

```env
VITE_API_URL=http://localhost:8000/api
```

Sem essa variavel, o frontend usa `http://localhost:8000/api` somente em
desenvolvimento. Em producao, `VITE_API_URL` precisa apontar para a API pública,
incluindo `/api`.

## Deploy No Vercel

O `vercel.json` da raiz configura a publicacao do frontend React/Vite. Importe o
repositorio no Vercel usando a raiz do projeto como diretório raiz e defina
`VITE_API_URL` com a URL publica da API Django, incluindo `/api`. O backend
precisa estar hospedado separadamente e permitir, em `CORS_ALLOWED_ORIGINS`, o
dominio do frontend no Vercel.

## Testes E Validacao

Backend:

```bash
backend\.venv\Scripts\python.exe backend\manage.py test apps
backend\.venv\Scripts\python.exe backend\manage.py makemigrations --check --dry-run
```

Frontend:

```bash
npm --prefix frontend run build
npm --prefix frontend run lint
```

## Estrutura

```text
sistema-idam/
  backend/
    apps/
    config/
    manage.py
    requirements.txt
  frontend/
    src/
      app/
      components/
      features/
      pages/
      services/
      styles/
    package.json
  docker-compose.yml
  package.json
```

## Observacoes De Desenvolvimento

- Execute migrations sempre que houver alteracao em modelos Django.
- Os endpoints protegidos usam JWT no header `Authorization: Bearer <token>`.
- O frontend tambem possui fallback local em algumas telas para manter a operacao
  durante indisponibilidade temporaria da API.
