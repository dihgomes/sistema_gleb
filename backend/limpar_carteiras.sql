-- Script para remover todas as carteiras do banco de dados
-- ATENÇÃO: Esta operação é IRREVERSÍVEL!

-- Verifica quantas carteiras existem antes de deletar
SELECT COUNT(*) as total_carteiras FROM carteiras;

-- Lista todas as carteiras que serão deletadas
SELECT id, nome, codigo_unico, criado_em 
FROM carteiras 
ORDER BY criado_em DESC;

-- DESCOMENTE A LINHA ABAIXO PARA EXECUTAR A EXCLUSÃO
-- DELETE FROM carteiras;

-- Verifica se a tabela está vazia após a exclusão
-- SELECT COUNT(*) as total_carteiras_apos FROM carteiras;

-- Reseta a sequência de IDs (opcional)
-- ALTER SEQUENCE carteiras_id_seq RESTART WITH 1;
