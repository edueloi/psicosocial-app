<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Psicosocial App

Aplicacao React + Vite para gestao psicossocial e ocupacional, com backend Express + SQLite no mesmo repositorio.

## Pre-requisitos

- Node.js 18+
- npm 9+

## Executar localmente (Full Stack)

1. Instale as dependencias do front-end:

   ```bash
   npm install
   ```

2. Instale as dependencias do backend:

   ```bash
   cd backend
   npm install
   cd ..
   ```

3. Inicie front e back juntos:

   ```bash
   npm run dev
   ```

4. Front-end: `http://localhost:3030`
5. Back-end: `http://localhost:3001`

## SQLite

- Banco: `backend/data/psicosocial.sqlite`
- O schema e o seed inicial de riscos/plano de acao sao criados automaticamente no start do backend.

## Endpoints de Gestao de Riscos

- `GET /api/health`
- `GET /api/risk-management/summary`
- `GET /api/risk-management/risks`
- `POST /api/risk-management/risks`
- `GET /api/risk-management/actions`
- `POST /api/risk-management/actions`

## Scripts disponiveis

- `npm run dev`: inicia frontend e backend em paralelo.
- `npm run dev:front`: inicia apenas o frontend.
- `npm run dev:back`: inicia apenas o backend.
- `npm run build`: gera a versao de producao do frontend em `dist/`.
- `npm run preview`: serve localmente o build de producao.
