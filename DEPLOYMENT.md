# Guia de Deployment - Zeraphyx Bypass no Cloudflare Pages

## 📋 Pré-requisitos

1. Conta no Cloudflare (https://dash.cloudflare.com)
2. Repositório Git (GitHub, GitLab ou Gitea)
3. Node.js 18+ instalado localmente
4. pnpm instalado (`npm install -g pnpm`)

## 🚀 Opção 1: Deployment via GitHub (Recomendado)

### Passo 1: Preparar o Repositório

```bash
# Clonar ou inicializar o repositório
git init
git add .
git commit -m "Initial commit: Zeraphyx Bypass"
git branch -M main
git remote add origin https://github.com/seu-usuario/zeraphyx-bypass.git
git push -u origin main
```

### Passo 2: Conectar ao Cloudflare Pages

1. Acesse https://dash.cloudflare.com
2. Vá para **Pages** na barra lateral
3. Clique em **Create a project** → **Connect to Git**
4. Selecione seu repositório GitHub
5. Configure as opções de build:
   - **Framework preset**: None
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist/public`
   - **Root directory**: `/`

### Passo 3: Configurar Variáveis de Ambiente

No Cloudflare Pages:
1. Vá para **Settings** → **Environment variables**
2. Adicione as variáveis:

```
DATABASE_URL=sua_url_de_banco_de_dados
JWT_SECRET=sua_chave_jwt_secreta
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=Zeraphyx
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
VITE_FRONTEND_FORGE_API_KEY=sua_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Passo 4: Deploy

1. Faça um push para a branch `main`
2. Cloudflare Pages fará o build e deploy automaticamente
3. Seu site estará disponível em `https://seu-projeto.pages.dev`

---

## 🔧 Opção 2: Deployment Manual via CLI

### Passo 1: Instalar Wrangler CLI

```bash
npm install -g wrangler
```

### Passo 2: Autenticar

```bash
wrangler login
```

### Passo 3: Fazer Build

```bash
pnpm build
```

### Passo 4: Deploy

```bash
wrangler pages deploy dist/public
```

---

## 🌐 Opção 3: Usar Seu Próprio Domínio

### Passo 1: Apontar Domínio para Cloudflare

1. Vá para o registrador do seu domínio
2. Altere os nameservers para:
   - `ns1.cloudflare.com`
   - `ns2.cloudflare.com`

### Passo 2: Configurar no Cloudflare

1. No Cloudflare Pages, vá para **Custom domains**
2. Clique em **Add custom domain**
3. Digite seu domínio (ex: `zeraphyx.com`)
4. Siga as instruções para validação

---

## 📦 Estrutura de Arquivos para Deploy

```
zeraphyx-bypass/
├── dist/
│   ├── public/           # Frontend compilado (servido pelo Pages)
│   │   ├── index.html
│   │   ├── assets/
│   │   └── __manus__/
│   └── index.js          # Backend (para Workers)
├── src/                  # Código-fonte frontend
├── server/               # Código-fonte backend
├── drizzle/              # Migrações de banco de dados
├── package.json
├── pnpm-lock.yaml
├── wrangler.toml         # Configuração Cloudflare Workers
├── vite.config.ts
├── tsconfig.json
└── DEPLOYMENT.md
```

---

## ⚠️ Limitações do Cloudflare Pages

O Cloudflare Pages é otimizado para **sites estáticos**. Para usar com backend Node.js:

### Opção A: Usar Cloudflare Workers (Recomendado)
- Deploy o backend como Worker
- Frontend no Pages
- Comunicação via tRPC

### Opção B: Usar Servidor Externo
- Deploy frontend no Pages
- Deploy backend em outro servidor (Railway, Render, Heroku)
- Configure CORS para comunicação

### Opção C: Usar Netlify Functions
- Deploy tudo no Netlify
- Suporte nativo a Node.js

---

## 🔒 Segurança

### Antes de Fazer Deploy:

1. **Remova dados sensíveis**:
   ```bash
   # Remova arquivo .env.local
   rm .env.local
   ```

2. **Configure variáveis de ambiente** no Cloudflare (não no código)

3. **Use HTTPS** (Cloudflare fornece automaticamente)

4. **Configure CORS** se necessário:
   ```typescript
   // server/_core/index.ts
   app.use(cors({
     origin: 'https://seu-dominio.com',
     credentials: true
   }));
   ```

5. **Hash de senhas**: Já implementado com bcrypt ✓

---

## 🧪 Testar Antes de Deploy

```bash
# Executar testes
pnpm test

# Fazer build
pnpm build

# Verificar se build foi bem-sucedido
ls -la dist/
```

---

## 📊 Monitoramento

### No Cloudflare Dashboard:

1. **Analytics**: Veja tráfego, requisições e erros
2. **Logs**: Monitore erros em tempo real
3. **Performance**: Verifique tempos de carregamento

---

## 🆘 Troubleshooting

### Erro: "Build failed"
- Verifique se `pnpm build` funciona localmente
- Confira se todas as dependências estão em `package.json`
- Verifique variáveis de ambiente

### Erro: "Database connection failed"
- Confirme se `DATABASE_URL` está configurada
- Verifique se banco de dados é acessível de fora
- Adicione IP do Cloudflare à whitelist do banco

### Erro: "API requests failing"
- Verifique CORS no backend
- Confirme se API_KEY está correta
- Teste requisições localmente com `curl`

---

## 📞 Suporte

Para dúvidas sobre Cloudflare Pages:
- Documentação: https://developers.cloudflare.com/pages/
- Community: https://community.cloudflare.com/

Para dúvidas sobre Zeraphyx Bypass:
- Consulte DOCUMENTACAO.md

---

**Última atualização**: 28/05/2026  
**Versão**: 1.0
