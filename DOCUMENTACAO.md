# Zeraphyx Bypass - Documentação Completa

## 📋 Visão Geral

**Zeraphyx Bypass** é um sistema web completo de gerenciamento de UIDs com autenticação customizada, painel administrativo e painel de vendedor. O sistema integra-se com uma API externa para registrar e alterar UIDs com suporte a diferentes períodos de validade (1, 7 e 30 dias).

## 🎨 Identidade Visual

- **Tema**: Dark Cyberpunk
- **Cores Principais**: Roxo, Ciano, Verde e Preto
- **Efeitos**: Neon, Glow, Gradientes
- **Tipografia**: Futurista/Gaming

## 🔐 Autenticação

### Credenciais Admin Padrão
- **Usuário**: `Zeraphyx`
- **Senha**: `BR@Zeraphyx`

### Tipos de Usuário
1. **Admin**: Acesso ao painel administrativo para gerenciar vendedores
2. **Vendedor**: Acesso ao dashboard para registrar e gerenciar UIDs

### Sistema de Sessão
- Sessões armazenadas em cookies HTTP-only
- Dados codificados em Base64
- Proteção contra CSRF com SameSite=Strict

## 🛠️ Funcionalidades

### Painel Administrativo

#### Gerenciamento de Vendedores
- **Listar**: Visualizar todos os vendedores cadastrados
- **Adicionar**: Criar novo vendedor com username, senha e limite de UIDs
- **Editar**: Modificar senha ou limite de UIDs de um vendedor
- **Deletar**: Remover um vendedor do sistema

#### Menu de Opções (Engrenagem)
Cada vendedor possui um ícone de engrenagem com opções para:
- 🔑 Editar Senha
- 📊 Definir Limite de UIDs
- 🗑️ Deletar Conta

### Painel do Vendedor

#### Dashboard
- **MEUS IDS GERADOS**: Quantidade total de UIDs registrados
- **USO DO LIMITE**: Visualização de UIDs usados vs. limite disponível
- **TABELA DE PREÇOS**: Custos por duração (1 dia, 7 dias, 30 dias)

#### Registro de UID
- Campo de entrada para ID do jogador
- Dropdown para seleção de duração (1, 7 ou 30 dias)
- Exibição de custo para cada opção
- Botão "Registrar" para enviar à API

#### Histórico de UIDs
- Tabela com todos os UIDs registrados
- Colunas: ID, Data de Registro, Data de Expiração, Status
- Botão de lápis para editar UID já registrado
- Indicador de status (Ativo/Expirado)

## 🔗 Integração com API

### Endpoints Utilizados

#### Add UID
```
POST http://painel.reflexo-games.com/api/add_uid
Headers:
  X-API-KEY: uid_inzA4Icak9ZORrm1d2eE_MRDri3YPoL3
  Content-Type: application/json

Body:
{
  "account_id": "string",
  "for_days": number (1, 7 ou 30)
}
```

#### Change UID
```
POST http://painel.reflexo-games.com/api/change_uid
Headers:
  X-API-KEY: uid_inzA4Icak9ZORrm1d2eE_MRDri3YPoL3
  Content-Type: application/json

Body:
{
  "account_id": "string",
  "for_days": number (1, 7 ou 30)
}
```

### Tratamento de Erros

| Erro | Mensagem Amigável |
|------|------------------|
| `ALREADY_ACTIVE` | "Este UID já está ativo no sistema." |
| `INSUFFICIENT_RESOURCES` | "Créditos/limite insuficiente para adicionar este UID." |
| `401 (Chave Inválida)` | "Chave de API inválida. Contate o administrador." |
| `ECONNREFUSED` | "Falha ao conectar com a API. O servidor pode estar indisponível." |
| `ETIMEDOUT` | "Timeout na requisição. A API está respondendo lentamente." |

## 💾 Banco de Dados

### Tabelas

#### `admins`
```sql
- id: INT (PK)
- username: VARCHAR(255)
- password_hash: VARCHAR(255)
- created_at: TIMESTAMP
```

#### `vendors`
```sql
- id: INT (PK)
- username: VARCHAR(255)
- password_hash: VARCHAR(255)
- uid_limit: INT
- used_uids: DECIMAL(10,2)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `uids`
```sql
- id: INT (PK)
- vendor_id: INT (FK)
- account_id: VARCHAR(255)
- duration_days: INT
- registered_at: TIMESTAMP
- expires_at: TIMESTAMP
- status: ENUM('active', 'expired')
- created_at: TIMESTAMP
```

## 🧪 Testes

### Executar Testes
```bash
pnpm test
```

### Cobertura de Testes
- ✅ Login com credenciais corretas
- ✅ Login com credenciais incorretas
- ✅ Logout
- ✅ Tratamento de erros da API
- ✅ Limite de UIDs
- ✅ Responsividade mobile

## 📊 Tabela de Preços

| Duração | Custo |
|---------|-------|
| 1 Dia | 0.5 |
| 7 Dias | 0.5 |
| 30 Dias | 1.0 |

## 🚀 Fluxo de Uso

### Para Admin
1. Acessar login com `Zeraphyx` / `BR@Zeraphyx`
2. Será redirecionado para o painel administrativo
3. Listar vendedores, adicionar novos, editar ou deletar conforme necessário
4. Definir limites de UIDs para cada vendedor

### Para Vendedor
1. Receber credenciais de login do admin
2. Acessar login com suas credenciais
3. Será redirecionado para o dashboard
4. Visualizar UIDs já registrados
5. Registrar novo UID selecionando ID do jogador e duração
6. Editar UID existente clicando no botão de lápis
7. Acompanhar uso do limite de UIDs

## ⚙️ Configuração

### Variáveis de Ambiente
```
API_KEY=uid_inzA4Icak9ZORrm1d2eE_MRDri3YPoL3
ADD_UID_API_URL=http://painel.reflexo-games.com/api/add_uid
CHANGE_UID_API_URL=http://painel.reflexo-games.com/api/change_uid
DATABASE_URL=<sua-url-de-banco-de-dados>
```

### Instalação de Dependências
```bash
pnpm install
```

### Iniciar Servidor de Desenvolvimento
```bash
pnpm dev
```

### Build para Produção
```bash
pnpm build
pnpm start
```

## 📝 Notas Importantes

1. **Segurança**: Senhas são armazenadas com hash bcrypt
2. **Limite de UIDs**: O sistema impede registro de novos UIDs quando o limite é atingido
3. **Expiração**: UIDs expiram automaticamente após o período selecionado
4. **API**: Todas as requisições à API externa incluem a chave de autenticação
5. **Responsividade**: O sistema é totalmente responsivo para mobile e desktop

## 🎯 Próximos Passos Sugeridos

1. Implementar notificações por email para expiração de UIDs
2. Adicionar dashboard com estatísticas de uso
3. Implementar sistema de pagamento integrado
4. Adicionar suporte a múltiplos idiomas
5. Implementar 2FA para admin

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API ou entre em contato com o administrador do sistema.

---

**Versão**: 1.0  
**Data**: 28/05/2026  
**Status**: Produção
