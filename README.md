<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Psicosocial App

Aplicacao React + Vite para gestao psicossocial e ocupacional, agora com backend Express no mesmo repositorio.

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
   npm --prefix backend install
   ```

3. Inicie front e back juntos:

   ```bash
   npm run dev
   ```

4. Front-end: `http://localhost:3030`
5. Back-end: `http://localhost:3001`
6. Health check: `http://localhost:3001/api/health`

## Scripts disponiveis

- `npm run dev`: inicia frontend e backend em paralelo.
- `npm run dev:front`: inicia apenas o frontend.
- `npm run dev:back`: inicia apenas o backend.
- `npm run build`: gera a versao de producao do frontend em `dist/`.
- `npm run preview`: serve localmente o build de producao.
