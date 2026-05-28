# ⚙️ Configuração Correta para Cloudflare Pages

## 🚨 Importante: Não Use wrangler deploy!

O Cloudflare Pages é **diferente** do Cloudflare Workers. Você deve usar o **Cloudflare Pages Dashboard**, não o `wrangler deploy`.

## 📋 Configuração do Build no Cloudflare Pages Dashboard

### Passo 1: Conectar Repositório GitHub

1. Acesse https://dash.cloudflare.com
2. Vá para **Pages** na barra lateral
3. Clique em **Create a project** → **Connect to Git**
4. Selecione seu repositório GitHub `zeraphyx-bypass`

### Passo 2: Configurar Build Settings

Na tela de configuração, use **exatamente** estes valores:

| Campo | Valor |
|-------|-------|
| **Framework preset** | None |
| **Build command** | `pnpm build` |
| **Build output directory** | `dist/public` |
| **Root directory** | `/` |

### Passo 3: Configurar Variáveis de Ambiente

1. Clique em **Settings**
2. Vá para **Environment variables**
3. Clique em **Add variable** para cada uma:

```
DATABASE_URL = sua_url_de_banco_de_dados
JWT_SECRET = sua_chave_jwt_secreta_aleatoria
VITE_APP_ID = seu_app_id
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://portal.manus.im
OWNER_OPEN_ID = seu_owner_id
OWNER_NAME = Zeraphyx
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = sua_api_key
VITE_FRONTEND_FORGE_API_KEY = sua_frontend_key
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
```

**Importante**: Clique em **Encrypt** para variáveis sensíveis!

### Passo 4: Salvar e Deploy

1. Clique em **Save and Deploy**
2. Aguarde o build completar (verá ✅ Success)
3. Seu site estará em `https://seu-projeto.pages.dev`

## 📁 Arquivos Importantes

### wrangler.toml
- Deixe como está (arquivo vazio/comentado)
- Não será usado pelo Pages

### _redirects
- Arquivo de redirecionamento para SPA
- Garante que todas as rotas funcionem corretamente

### .gitignore
- Evita fazer commit de arquivos sensíveis
- Inclui `.env.local` e `node_modules`

## 🔄 Deploy Contínuo

Agora toda vez que você fizer push para `main`:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

O Cloudflare Pages fará o build e deploy **automaticamente**! ✨

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

- [ ] Site está acessível em `https://seu-projeto.pages.dev`
- [ ] Login funciona com `Zeraphyx` / `BR@Zeraphyx`
- [ ] Painel admin carrega corretamente
- [ ] Pode adicionar vendedores
- [ ] Pode registrar UIDs

## 🆘 Se o Build Falhar

1. Verifique o **Build Log** no Cloudflare Pages
2. Procure por mensagens de erro
3. Testes comuns:
   ```bash
   pnpm install
   pnpm build
   pnpm test
   ```

## 🌍 Configurar Domínio Personalizado

1. No Cloudflare Pages, vá para **Custom domains**
2. Clique em **Add custom domain**
3. Digite seu domínio (ex: `zeraphyx.com`)
4. Siga as instruções de validação

## 📞 Suporte

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Cloudflare Community: https://community.cloudflare.com/

---

**Versão**: 2.0 (Corrigido)  
**Data**: 28/05/2026
