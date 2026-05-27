-- =====================================================
-- MIGRAÇÃO COMPLETA DO BANCO DE DADOS
-- Sistema de Carteira Digital - GLEB
-- =====================================================

-- =====================================================
-- 1. ATUALIZAR TABELA ADMINS
-- =====================================================

-- Adicionar campos para gerenciamento de senha, foto, role e bloqueio
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS primeiro_acesso BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS senha_expirada_em TIMESTAMP,
ADD COLUMN IF NOT EXISTS ultima_senha_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS penultima_senha_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS senha_alterada_em TIMESTAMP,
ADD COLUMN IF NOT EXISTS tentativas_login INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bloqueado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bloqueado_em TIMESTAMP,
ADD COLUMN IF NOT EXISTS bloqueado_por_id UUID,
ADD COLUMN IF NOT EXISTS desbloqueado_em TIMESTAMP,
ADD COLUMN IF NOT EXISTS desbloqueado_por_id UUID,
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Adicionar constraint para validar role
ALTER TABLE admins
ADD CONSTRAINT check_role CHECK (role IN ('admin', 'user'));

-- Adicionar constraint unique no nome (usado como login)
ALTER TABLE admins
ADD CONSTRAINT unique_admin_nome UNIQUE (nome);

-- Comentários dos campos de admins
COMMENT ON COLUMN admins.role IS 'Papel do usuário: admin (pode criar usuários) ou user (não pode criar usuários)';
COMMENT ON COLUMN admins.foto_url IS 'URL da foto de perfil do administrador';
COMMENT ON COLUMN admins.primeiro_acesso IS 'Indica se é o primeiro acesso (obriga troca de senha)';
COMMENT ON COLUMN admins.senha_expirada_em IS 'Data de expiração da senha (180 dias após última alteração)';
COMMENT ON COLUMN admins.ultima_senha_hash IS 'Hash da última senha (para evitar reutilização)';
COMMENT ON COLUMN admins.penultima_senha_hash IS 'Hash da penúltima senha (para evitar reutilização)';
COMMENT ON COLUMN admins.senha_alterada_em IS 'Data da última alteração de senha';
COMMENT ON COLUMN admins.tentativas_login IS 'Contador de tentativas de login incorretas';
COMMENT ON COLUMN admins.bloqueado IS 'Indica se o usuário está bloqueado (após 5 tentativas incorretas)';
COMMENT ON COLUMN admins.bloqueado_em IS 'Data e hora em que o usuário foi bloqueado';
COMMENT ON COLUMN admins.bloqueado_por_id IS 'ID do admin que bloqueou manualmente (se aplicável)';
COMMENT ON COLUMN admins.desbloqueado_em IS 'Data e hora em que o usuário foi desbloqueado';
COMMENT ON COLUMN admins.desbloqueado_por_id IS 'ID do admin que desbloqueou o usuário';
COMMENT ON COLUMN admins.ativo IS 'Indica se o administrador está ativo no sistema';

-- =====================================================
-- 2. ATUALIZAR TABELA CARTEIRAS
-- =====================================================

-- Adicionar novos campos de dados pessoais
ALTER TABLE carteiras 
ADD COLUMN IF NOT EXISTS cpf VARCHAR(14),
ADD COLUMN IF NOT EXISTS cargo VARCHAR(255),
ADD COLUMN IF NOT EXISTS data_nascimento VARCHAR(10),
ADD COLUMN IF NOT EXISTS unidades_administradas TEXT;

-- Adicionar campo de relacionamento com admin criador
ALTER TABLE carteiras
ADD COLUMN IF NOT EXISTS criado_por_id UUID;

-- Remover campos não utilizados (se existirem)
ALTER TABLE carteiras 
DROP COLUMN IF EXISTS datas_maconicas,
DROP COLUMN IF EXISTS lojas,
DROP COLUMN IF EXISTS loja;

-- Comentários dos campos de carteiras
COMMENT ON COLUMN carteiras.cpf IS 'CPF do titular da carteira (formato: 000.000.000-00)';
COMMENT ON COLUMN carteiras.cargo IS 'Cargo ou função do titular';
COMMENT ON COLUMN carteiras.data_nascimento IS 'Data de nascimento no formato DD/MM/AAAA';
COMMENT ON COLUMN carteiras.unidades_administradas IS 'Unidades de saúde administradas pelo titular';
COMMENT ON COLUMN carteiras.criado_por_id IS 'ID do administrador que criou a carteira';

-- =====================================================
-- 3. CRIAR FOREIGN KEY
-- =====================================================

-- Adicionar constraint de chave estrangeira
ALTER TABLE carteiras
ADD CONSTRAINT fk_carteiras_criado_por 
FOREIGN KEY (criado_por_id) 
REFERENCES admins(id) 
ON DELETE SET NULL;

-- =====================================================
-- 3.1. CRIAR TABELA DE LOGS
-- =====================================================

-- Tabela para auditoria e rastreamento de ações
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(50) NOT NULL,
  entidade VARCHAR(50),
  entidade_id UUID,
  usuario_id UUID,
  usuario_nome VARCHAR(255),
  usuario_email VARCHAR(255),
  usuario_role VARCHAR(20),
  acao TEXT NOT NULL,
  detalhes JSONB,
  ip VARCHAR(45),
  user_agent TEXT,
  sucesso BOOLEAN DEFAULT true,
  erro TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentários dos campos de logs
COMMENT ON TABLE logs IS 'Tabela de auditoria para rastreamento de todas as ações no sistema';
COMMENT ON COLUMN logs.tipo IS 'Tipo de ação: login, logout, create, update, delete, block, unblock, qrcode, etc';
COMMENT ON COLUMN logs.entidade IS 'Entidade afetada: admin, carteira, user';
COMMENT ON COLUMN logs.entidade_id IS 'ID da entidade afetada';
COMMENT ON COLUMN logs.usuario_id IS 'ID do usuário que executou a ação';
COMMENT ON COLUMN logs.usuario_nome IS 'Nome do usuário que executou a ação';
COMMENT ON COLUMN logs.usuario_email IS 'Email do usuário que executou a ação';
COMMENT ON COLUMN logs.usuario_role IS 'Role do usuário: admin ou user';
COMMENT ON COLUMN logs.acao IS 'Descrição detalhada da ação realizada';
COMMENT ON COLUMN logs.detalhes IS 'Dados adicionais em formato JSON';
COMMENT ON COLUMN logs.ip IS 'Endereço IP de onde a ação foi executada';
COMMENT ON COLUMN logs.user_agent IS 'User-Agent do navegador/cliente';
COMMENT ON COLUMN logs.sucesso IS 'Indica se a ação foi bem-sucedida';
COMMENT ON COLUMN logs.erro IS 'Mensagem de erro caso a ação tenha falhado';
COMMENT ON COLUMN logs.criado_em IS 'Data e hora da ação';

-- =====================================================
-- 4. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índice para busca por CPF
CREATE INDEX IF NOT EXISTS idx_carteiras_cpf ON carteiras(cpf);

-- Índice para busca por admin criador
CREATE INDEX IF NOT EXISTS idx_carteiras_criado_por ON carteiras(criado_por_id);

-- Índice para busca de admins ativos
CREATE INDEX IF NOT EXISTS idx_admins_ativo ON admins(ativo);

-- Índice para busca de senhas expiradas
CREATE INDEX IF NOT EXISTS idx_admins_senha_expirada ON admins(senha_expirada_em);

-- Índice para busca por role
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Índice para busca de usuários bloqueados
CREATE INDEX IF NOT EXISTS idx_admins_bloqueado ON admins(bloqueado);

-- Índices para tabela de logs
CREATE INDEX IF NOT EXISTS idx_logs_tipo ON logs(tipo);
CREATE INDEX IF NOT EXISTS idx_logs_entidade ON logs(entidade);
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_criado_em ON logs(criado_em);
CREATE INDEX IF NOT EXISTS idx_logs_sucesso ON logs(sucesso);

-- =====================================================
-- 5. ATUALIZAR DADOS EXISTENTES
-- =====================================================

-- Definir todos os admins existentes como 'admin' (com permissão total)
UPDATE admins 
SET role = 'admin' 
WHERE role IS NULL OR role = 'user';

-- Marcar todos os admins existentes como já tendo feito primeiro acesso
UPDATE admins 
SET primeiro_acesso = false 
WHERE primeiro_acesso IS NULL;

-- Definir data de expiração de senha para admins existentes (180 dias a partir de agora)
UPDATE admins 
SET senha_expirada_em = CURRENT_TIMESTAMP + INTERVAL '180 days',
    senha_alterada_em = CURRENT_TIMESTAMP
WHERE senha_expirada_em IS NULL;

-- =====================================================
-- 6. FUNÇÃO PARA CALCULAR EXPIRAÇÃO DE SENHA
-- =====================================================

-- Criar função que calcula automaticamente a data de expiração
CREATE OR REPLACE FUNCTION calcular_expiracao_senha()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a senha foi alterada, calcular nova data de expiração (180 dias)
  IF NEW.senha_hash IS DISTINCT FROM OLD.senha_hash THEN
    NEW.senha_expirada_em := CURRENT_TIMESTAMP + INTERVAL '180 days';
    NEW.senha_alterada_em := CURRENT_TIMESTAMP;
    NEW.penultima_senha_hash := OLD.ultima_senha_hash;
    NEW.ultima_senha_hash := OLD.senha_hash;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar a função
DROP TRIGGER IF EXISTS trigger_expiracao_senha ON admins;
CREATE TRIGGER trigger_expiracao_senha
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION calcular_expiracao_senha();

-- =====================================================
-- 7. VIEW PARA CONSULTAS ÚTEIS
-- =====================================================

-- View de admins com senhas próximas da expiração (30 dias)
CREATE OR REPLACE VIEW admins_senha_expirando AS
SELECT 
  id,
  nome,
  email,
  role,
  senha_expirada_em,
  EXTRACT(DAY FROM (senha_expirada_em - CURRENT_TIMESTAMP)) as dias_restantes
FROM admins
WHERE ativo = true
  AND senha_expirada_em IS NOT NULL
  AND senha_expirada_em <= CURRENT_TIMESTAMP + INTERVAL '30 days'
  AND senha_expirada_em > CURRENT_TIMESTAMP
ORDER BY senha_expirada_em ASC;

-- View de carteiras com informações do criador
CREATE OR REPLACE VIEW carteiras_com_criador AS
SELECT 
  c.id,
  c.codigo_unico,
  c.nome,
  c.cpf,
  c.cargo,
  c.data_nascimento,
  c.unidades_administradas,
  c.foto_url,
  c.situacao_atual,
  c.ativo,
  c.criado_em,
  a.nome as criado_por_nome,
  a.email as criado_por_email,
  a.role as criado_por_role
FROM carteiras c
LEFT JOIN admins a ON c.criado_por_id = a.id
ORDER BY c.criado_em DESC;

-- View de apenas administradores (com permissão para criar usuários)
CREATE OR REPLACE VIEW apenas_admins AS
SELECT 
  id,
  nome,
  email,
  foto_url,
  primeiro_acesso,
  senha_expirada_em,
  ativo,
  criado_em,
  atualizado_em
FROM admins
WHERE role = 'admin'
  AND ativo = true
ORDER BY nome ASC;

-- View de apenas usuários (sem permissão para criar usuários)
CREATE OR REPLACE VIEW apenas_users AS
SELECT 
  id,
  nome,
  email,
  foto_url,
  primeiro_acesso,
  senha_expirada_em,
  ativo,
  criado_em,
  atualizado_em
FROM admins
WHERE role = 'user'
  AND ativo = true
ORDER BY nome ASC;

-- View de logs de login (últimos 30 dias)
CREATE OR REPLACE VIEW logs_login_recentes AS
SELECT 
  id,
  tipo,
  usuario_nome,
  usuario_email,
  usuario_role,
  ip,
  sucesso,
  erro,
  criado_em
FROM logs
WHERE tipo IN ('login', 'login_falho')
  AND criado_em >= CURRENT_TIMESTAMP - INTERVAL '30 days'
ORDER BY criado_em DESC;

-- View de ações em carteiras (últimos 7 dias)
CREATE OR REPLACE VIEW logs_carteiras_recentes AS
SELECT 
  id,
  tipo,
  entidade_id,
  usuario_nome,
  usuario_email,
  acao,
  detalhes,
  criado_em
FROM logs
WHERE entidade = 'carteira'
  AND criado_em >= CURRENT_TIMESTAMP - INTERVAL '7 days'
ORDER BY criado_em DESC;

-- View de usuários bloqueados/desbloqueados
CREATE OR REPLACE VIEW logs_bloqueios AS
SELECT 
  id,
  tipo,
  usuario_nome,
  usuario_email,
  acao,
  detalhes,
  criado_em
FROM logs
WHERE tipo IN ('block', 'unblock')
ORDER BY criado_em DESC;

-- View de atividades por usuário (resumo)
CREATE OR REPLACE VIEW resumo_atividades_usuarios AS
SELECT 
  usuario_id,
  usuario_nome,
  usuario_email,
  usuario_role,
  COUNT(*) as total_acoes,
  COUNT(CASE WHEN tipo = 'login' THEN 1 END) as total_logins,
  COUNT(CASE WHEN tipo = 'create' THEN 1 END) as total_criados,
  COUNT(CASE WHEN tipo = 'update' THEN 1 END) as total_atualizados,
  COUNT(CASE WHEN tipo = 'delete' THEN 1 END) as total_deletados,
  MAX(criado_em) as ultima_atividade
FROM logs
WHERE usuario_id IS NOT NULL
GROUP BY usuario_id, usuario_nome, usuario_email, usuario_role
ORDER BY ultima_atividade DESC;

-- =====================================================
-- 8. GRANTS DE PERMISSÃO (ajuste conforme necessário)
-- =====================================================

-- Garantir que o usuário da aplicação tenha acesso às views
-- GRANT SELECT ON admins_senha_expirando TO seu_usuario_app;
-- GRANT SELECT ON carteiras_com_criador TO seu_usuario_app;

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================

-- Verificar estrutura final
SELECT 'Migração concluída com sucesso!' as status;
