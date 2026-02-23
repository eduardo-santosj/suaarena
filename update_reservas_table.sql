-- Atualizar tabela de reservas para incluir valor e recorrência
ALTER TABLE reservas_quadras 
ADD COLUMN valor DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN tipo_recorrencia ENUM('unica', 'diaria', 'semanal') DEFAULT 'unica',
ADD COLUMN dias_semana JSON NULL COMMENT 'Array com dias da semana [0=domingo, 1=segunda, ..., 6=sabado]',
ADD COLUMN data_fim DATE NULL COMMENT 'Data final para reservas recorrentes';

-- Exemplo de dados para dias da semana:
-- Segunda e Quarta: [1, 3]
-- Todos os dias: [0, 1, 2, 3, 4, 5, 6]
-- Apenas sábado: [6]