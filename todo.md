# Zeraphyx Bypass - TODO List

## Autenticação e Segurança
- [x] Implementar autenticação customizada sem OAuth (usuário/senha)
- [x] Criar hash de senha com bcrypt
- [x] Criar admin padrão: Zeraphyx / BR@Zeraphyx
- [x] Implementar sistema de sessão com JWT
- [x] Proteger rotas de admin e vendedor

## Banco de Dados
- [x] Criar tabela de vendedores (username, password_hash, uid_limit, created_at)
- [x] Criar tabela de UIDs registrados (vendor_id, account_id, duration_days, registered_at, expires_at, status)
- [x] Criar tabela de admin (username, password_hash)
- [x] Criar migrations SQL

## Tela de Login
- [x] Criar página de login customizada
- [x] Adicionar logo/título "Zeraphyx Bypass"
- [x] Implementar validação de credenciais
- [x] Implementar redirecionamento após login (admin vs vendedor)
- [x] Adicionar tema dark cyberpunk na tela de login

## Painel Administrativo
- [x] Criar layout do painel admin com sidebar
- [x] Listar todos os vendedores cadastrados
- [x] Implementar botão "Adicionar Novo Vendedor"
- [x] Implementar modal/formulário para adicionar vendedor
- [x] Implementar ícone de engrenagem com menu de opções
- [x] Implementar funcionalidade de editar senha do vendedor
- [x] Implementar funcionalidade de definir limite de UIDs
- [x] Implementar funcionalidade de excluir vendedor
- [x] Aplicar tema dark cyberpunk ao painel admin

## Painel do Vendedor
- [x] Criar layout do painel vendedor (idêntico ao PDF, sem seção de créditos)
- [x] Exibir "MEUS IDS GERADOS" (quantidade)
- [x] Exibir "USO DO LIMITE" (quantidade/limite)
- [x] Exibir tabela de preços por duração (1 dia, 7 dias, 30 dias)
- [x] Implementar formulário de registro de UID
- [x] Implementar dropdown de seleção de dias (1, 7, 30)
- [x] Exibir custo para cada opção de dias
- [x] Implementar botão "Registrar"
- [x] Exibir histórico de UIDs registrados em tabela
- [x] Adicionar coluna de status (Ativo/Expirado)
- [x] Adicionar coluna de data de registro
- [x] Adicionar coluna de data de expiração
- [x] Adicionar botão de lápis para editar UID
- [x] Aplicar tema dark cyberpunk ao painel vendedor

## Integração com API
- [x] Configurar API_KEY: uid_inzA4Icak9ZORrm1d2eE_MRDri3YPoL3
- [x] Implementar procedimento tRPC para add_uid
- [x] Implementar procedimento tRPC para change_uid
- [x] Adicionar headers X-API-KEY nas requisições
- [x] Implementar tratamento de erro ALREADY_ACTIVE
- [x] Implementar tratamento de erro INSUFFICIENT_RESOURCES
- [x] Implementar tratamento de erro 401 (chave inválida)
- [x] Implementar tratamento de erro de conexão
- [x] Exibir mensagens de erro amigáveis ao usuário
- [x] Validar resposta da API e atualizar banco de dados local

## Controle de Limite
- [x] Verificar limite de UIDs antes de registrar novo
- [x] Impedir registro se limite atingido
- [x] Exibir mensagem clara quando limite atingido
- [x] Permitir admin editar limite de cada vendedor

## Tema Dark Cyberpunk
- [x] Definir paleta de cores: roxo, ciano, verde, preto
- [x] Aplicar cores neon em elementos interativos
- [x] Criar estilo de fundo escuro com gradientes
- [x] Aplicar efeitos de brilho/glow em elementos principais
- [x] Usar fontes modernas/futuristas
- [x] Adicionar animações suaves cyberpunk
- [x] Garantir contraste adequado para acessibilidade

## Testes e Validação
- [x] Testar login com credenciais corretas
- [x] Testar login com credenciais incorretas
- [x] Testar logout
- [x] Testar fluxo de admin (adicionar/editar/deletar vendedor)
- [x] Testar fluxo de vendedor (registrar UID)
- [x] Testar integração com API add_uid
- [x] Testar integração com API change_uid
- [x] Testar tratamento de erros da API
- [x] Testar limite de UIDs
- [x] Testar responsividade em mobile
- [x] Testar performance do dashboard

## Entrega
- [x] Criar checkpoint final
- [x] Preparar documentação
- [x] Entregar site ao usuário
