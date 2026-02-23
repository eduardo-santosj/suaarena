-- =====================================================
-- SCRIPT COMPLETO DO BANCO DE DADOS - SUA ARENA
-- =====================================================

-- Adicionar campo email na tabela Alunos (ignorar erro se já existir)
SET @sql = 'ALTER TABLE Alunos ADD COLUMN email VARCHAR(255) DEFAULT NULL';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Alunos' AND COLUMN_NAME = 'email') = 0, @sql, 'SELECT "Campo email já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar campo plano na tabela Alunos (ignorar erro se já existir)
SET @sql = 'ALTER TABLE Alunos ADD COLUMN idPlano INT(11) DEFAULT NULL';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Alunos' AND COLUMN_NAME = 'idPlano') = 0, @sql, 'SELECT "Campo idPlano já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar constraint apenas se não existir
SET @sql = 'ALTER TABLE Alunos ADD CONSTRAINT Alunos_plano_fk FOREIGN KEY (idPlano) REFERENCES Planos(id)';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'Alunos' AND CONSTRAINT_NAME = 'Alunos_plano_fk') = 0, @sql, 'SELECT "Constraint já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar campos de data e senha na tabela Alunos (ignorar erro se já existirem)
SET @sql = 'ALTER TABLE Alunos ADD COLUMN data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Alunos' AND COLUMN_NAME = 'data_criacao') = 0, @sql, 'SELECT "Campo data_criacao já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = 'ALTER TABLE Alunos ADD COLUMN senha_padrao VARCHAR(255) DEFAULT "$2b$10$K7L/8Y1t85iCFyOeDrHWpuHEHPmBcVBpYuvsDeNp2CGZXwsSAhHWW"';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Alunos' AND COLUMN_NAME = 'senha_padrao') = 0, @sql, 'SELECT "Campo senha_padrao já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = 'ALTER TABLE Alunos ADD COLUMN primeiro_acesso BOOLEAN DEFAULT TRUE';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Alunos' AND COLUMN_NAME = 'primeiro_acesso') = 0, @sql, 'SELECT "Campo primeiro_acesso já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar coluna type na tabela login para tipos de perfil (ignorar erro se já existir)
SET @sql = 'ALTER TABLE login ADD COLUMN type ENUM("admin", "teacher", "student", "finance") NOT NULL DEFAULT "student"';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'login' AND COLUMN_NAME = 'type') = 0, @sql, 'SELECT "Campo type já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Comentários sobre os tipos de perfil:
-- admin: acesso total a todas as telas e funções
-- teacher: cadastra alunos, turmas e presenças  
-- finance: acessa dashboard e relatórios financeiros
-- student: acessa tela de checkin para confirmar presença nas turmas

-- Adicionar status de checkin na tabela Presencas (ignorar erro se já existir)
SET @sql = 'ALTER TABLE Presencas ADD COLUMN status_checkin ENUM("pendente", "confirmado", "rejeitado") DEFAULT "pendente"';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Presencas' AND COLUMN_NAME = 'status_checkin') = 0, @sql, 'SELECT "Campo status_checkin já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar capacidade máxima e dias da semana na tabela Turmas (ignorar erro se já existirem)
SET @sql = 'ALTER TABLE Turmas ADD COLUMN capacidade_maxima INT NOT NULL DEFAULT 20';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Turmas' AND COLUMN_NAME = 'capacidade_maxima') = 0, @sql, 'SELECT "Campo capacidade_maxima já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = 'ALTER TABLE Turmas ADD COLUMN dias_semana JSON DEFAULT NULL';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Turmas' AND COLUMN_NAME = 'dias_semana') = 0, @sql, 'SELECT "Campo dias_semana já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Criar tabela de planos (se não existir)
CREATE TABLE IF NOT EXISTS Planos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  treinos_por_semana INT(11) NOT NULL,
  valor DECIMAL(10,2) DEFAULT NULL,
  ativo TINYINT(1) DEFAULT 1,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Criar tabelas de quadras e reservas (se não existirem)
CREATE TABLE IF NOT EXISTS Quadras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Reservas_Quadras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quadra_id INT NOT NULL,
  data_reserva DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  descricao VARCHAR(255),
  usuario_id INT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quadra_id) REFERENCES Quadras(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES login(id) ON DELETE SET NULL,
  UNIQUE KEY unique_reserva (quadra_id, data_reserva, hora_inicio)
);

-- Atualizar tabela de reservas para incluir valor e recorrência (ignorar erro se já existirem)
SET @sql = 'ALTER TABLE Reservas_Quadras ADD COLUMN valor DECIMAL(10,2) DEFAULT 0.00';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Reservas_Quadras' AND COLUMN_NAME = 'valor') = 0, @sql, 'SELECT "Campo valor já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = 'ALTER TABLE Reservas_Quadras ADD COLUMN tipo_recorrencia ENUM("unica", "diaria", "semanal") DEFAULT "unica"';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Reservas_Quadras' AND COLUMN_NAME = 'tipo_recorrencia') = 0, @sql, 'SELECT "Campo tipo_recorrencia já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = 'ALTER TABLE Reservas_Quadras ADD COLUMN dias_semana JSON NULL COMMENT "Array com dias da semana [0=domingo, 1=segunda, ..., 6=sabado]"';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Reservas_Quadras' AND COLUMN_NAME = 'dias_semana') = 0, @sql, 'SELECT "Campo dias_semana já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = 'ALTER TABLE Reservas_Quadras ADD COLUMN data_fim DATE NULL COMMENT "Data final para reservas recorrentes"';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'Reservas_Quadras' AND COLUMN_NAME = 'data_fim') = 0, @sql, 'SELECT "Campo data_fim já existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Exemplo de dados para dias da semana:
-- Segunda e Quarta: [1, 3]
-- Todos os dias: [0, 1, 2, 3, 4, 5, 6]
-- Apenas sábado: [6]

-- Inserir usuário admin inicial apenas se não existir (senha: admin123)
INSERT IGNORE INTO login (username, password, type) VALUES ('admin', '$2b$10$K7L/8Y1t85iCFyOeDrHWpuHEHPmBcVBpYuvsDeNp2CGZXwsSAhHWW', 'admin');

-- Verificar se o usuário admin existe
SELECT * FROM login WHERE username = 'admin';