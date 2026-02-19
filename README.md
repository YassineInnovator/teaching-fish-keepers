# Club Poisson - Monorepo

Projet universitaire DevOps/Full-Stack pour rendre une application deployable en production.

## 1) Architecture

```text
teaching-fish-keepers/
|- backend/                  # API Bun + TypeScript + PostgreSQL
|- frontend/                 # React 19 + Vite 7 + Tailwind v4
|- docker-compose.yml        # Orchestration locale/prod (services)
|- .github/workflows/
|  |- ci.yml                 # CI: lint + format + tests
|  |- deploy.yml             # CD: build/push images + deploy SSH
|- package.json              # Scripts monorepo (lint/format)
```

## 2) Stack technique

- Backend: Bun, TypeScript, package `postgres`
- Frontend: React 19, React Router, Vite 7, Tailwind CSS v4
- Base de donnees: PostgreSQL 17
- Conteneurisation: Docker, Docker Compose
- CI/CD: GitHub Actions + GHCR + SSH deploy

## 3) Prerequis

- Bun >= 1.3.x
- Docker + Docker Compose
- Git

## 4) Variables d'environnement

Backend:

- `ADMIN_PASSWORD`
- `PGHOST`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`
- `PGPORT` (optionnel, defaut 5432)

Pour Docker Compose, definir au minimum:

```env
ADMIN_PASSWORD=change-me
```

## 5) Lancement en developpement (sans Docker)

### 5.1 Backend

```bash
cd backend
bun install
bun run dev
```

### 5.2 Frontend

```bash
cd frontend
bun install
bun run dev
```

### 5.3 Qualite globale (depuis la racine)

```bash
bun install
bun run lint
bun run format:check
```

## 6) Tests

### 6.1 Backend (Bun test runner)

```bash
cd backend
bun test
```

Test principal: route protegee `POST /api/events` retourne `401` sans token.

### 6.2 Frontend (Vitest)

```bash
cd frontend
bun run test
```

## 7) Docker / Compose

### 7.1 Demarrage

Depuis la racine:

```bash
docker compose up -d
```

Services:

- `postgres` (PostgreSQL 17 + volume persistant `pgdata`)
- `adminer` (UI DB)
- `backend` (image GHCR)
- `frontend` (build local via `frontend/Dockerfile`)

### 7.2 Verification rapide

```bash
curl -i http://localhost:3000/api/health
```

Reponse attendue: `HTTP/1.1 200 OK` avec `{"status":"ok"}`.

## 8) CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

Declenchement:

- Push sur toutes les branches
- Pull Request

Etapes:

1. Checkout
2. Setup Bun
3. Install dependances
4. Lint monorepo
5. Format check Prettier
6. Tests frontend
7. Tests backend

Le merge est bloque si une etape echoue.

## 9) CD (GitHub Actions)

Workflow: `.github/workflows/deploy.yml`

Declenchement:

- Push sur `main`

Etapes:

1. Build + push images Docker sur GHCR
2. Deploy SSH (placeholder operationnel) avec `docker compose pull` puis `docker compose up -d`

Secrets GitHub utilises:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_PORT`
- `DEPLOY_PATH`

## 10) Choix techniques (resume)

- Bun pour un backend TS simple, rapide a lancer.
- PostgreSQL 17 pour la persistance relationnelle.
- Dockerfiles dedies front/back pour portabilite.
- Compose pour standardiser execution locale/serveur.
- CI pour garantir qualite continue.
- CD pour reduire les deploiements manuels.

## 11) Limites actuelles

- Session auth backend en memoire (pas distribuee, pas persistante).
- Tag Docker principalement `latest` (peut etre ameliore avec SHA/version semantique).
- Pas encore de TLS/HTTPS automatise dans la stack.

## 12) Pistes d'amelioration

- Tags d'images Docker avec commit SHA + version.
- Reverse proxy unique avec HTTPS (Caddy/Nginx + certificats).
- Monitoring + alerting (logs centralises, metrics).
- Strategie de rollback et environnement de staging.

---

Pour la soutenance, demonstrer au minimum:

1. CI verte (lint/format/tests)
2. CD sur push `main`
3. `GET /api/health` => 200
4. `POST /api/events` sans token => 401
