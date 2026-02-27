<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1OTGU3oeSHQYv3JcOdra4oj8inRS_3k--

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Como ver o PR e usar a funcionalidade de **Forms Externos**

### 1) Abrir e revisar o PR no GitHub
1. Entre no repositório no GitHub.
2. Clique em **Pull requests**.
3. Abra o PR: **feat: adicionar Central de Formulários Externos (FormsCenter)**.
4. Use as abas:
   - **Conversation**: descrição geral e comentários.
   - **Files changed**: tudo que foi alterado no código.
   - **Commits**: histórico de commits do PR.

### 2) Testar a feature localmente (na branch do PR)
No terminal, dentro da pasta do projeto:

```bash
git fetch origin
git checkout codex/add-custom-form-creation-feature
npm install
npm run dev
```

Depois abra no navegador o endereço mostrado pelo Vite (normalmente `http://localhost:5173`).

### 3) Onde encontrar no sistema
1. Faça login com um usuário que tenha acesso (ex.: **Admin Master**).
2. No menu lateral, clique em **Forms Externos**.
3. Você verá a tela **Central de Formulários Externos**.

### 4) Como usar o módulo de Forms Externos
1. Preencha **Nome do formulário** e **Descrição**.
2. Adicione campos com os botões:
   - Input
   - Texto longo
   - Dropdown
   - Radio button
   - Data
   - Boolean
3. Em cada campo, configure:
   - título da pergunta
   - placeholder (quando aplicável)
   - texto de ajuda
   - obrigatório (checkbox)
   - opções (dropdown/radio)
4. No painel da direita:
   - copie o **link público** em **Copiar link**
   - ajuste a **mensagem de sucesso**
   - confira a **pré-visualização**

### 5) Se não aparecer para você
- Verifique se está realmente na branch do PR:
  ```bash
  git branch --show-current
  ```
  Deve retornar: `codex/add-custom-form-creation-feature`
- Se estiver em `main`, mude para a branch acima.
- Se necessário, rode:
  ```bash
  git pull --rebase origin codex/add-custom-form-creation-feature
  ```
