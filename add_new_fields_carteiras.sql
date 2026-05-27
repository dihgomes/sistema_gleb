-- Adicionar novos campos na tabela carteiras
-- Execute este SQL no banco de dados

ALTER TABLE carteiras 
ADD COLUMN IF NOT EXISTS cpf VARCHAR(14),
ADD COLUMN IF NOT EXISTS cargo VARCHAR(255),
ADD COLUMN IF NOT EXISTS data_nascimento VARCHAR(10),
ADD COLUMN IF NOT EXISTS unidades_administradas TEXT;

-- Comentários dos campos
COMMENT ON COLUMN carteiras.cpf IS 'CPF do titular da carteira';
COMMENT ON COLUMN carteiras.cargo IS 'Cargo ou função do titular';
COMMENT ON COLUMN carteiras.data_nascimento IS 'Data de nascimento no formato DD/MM/AAAA';
COMMENT ON COLUMN carteiras.unidades_administradas IS 'Unidades de saúde administradas pelo titular';
