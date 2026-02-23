-- =====================================================
-- SCRIPT PARA CLEVER CLOUD - SUA ARENA
-- =====================================================

-- Criar tabela de login
CREATE TABLE IF NOT EXISTS login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  type ENUM('admin', 'teacher', 'student', 'finance') NOT NULL DEFAULT 'student',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar tabela de planos
CREATE TABLE IF NOT EXISTS Planos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  treinos_por_semana INT NOT NULL,
  valor DECIMAL(10,2) DEFAULT NULL,
  ativo TINYINT(1) DEFAULT 1,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar tabela de alunos
CREATE TABLE IF NOT EXISTS Alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  telefone VARCHAR(20) DEFAULT NULL,
  data_nascimento DATE DEFAULT NULL,
  idPlano INT DEFAULT NULL,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  senha_padrao VARCHAR(255) DEFAULT '$2b$10$K7L/8Y1t85iCFyOeDrHWpuHEHPmBcVBpYuvsDeNp2CGZXwsSAhHWW',
  primeiro_acesso BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (idPlano) REFERENCES Planos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar tabela de turmas
CREATE TABLE IF NOT EXISTS Turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  horario TIME NOT NULL,
  capacidade_maxima INT NOT NULL DEFAULT 20,
  dias_semana JSON DEFAULT NULL,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar tabela de presenças
CREATE TABLE IF NOT EXISTS Presencas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idAluno INT NOT NULL,
  idTurma INT NOT NULL,
  data DATE NOT NULL,
  presente BOOLEAN DEFAULT FALSE,
  status_checkin ENUM('pendente', 'confirmado', 'rejeitado') DEFAULT 'pendente',
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idAluno) REFERENCES Alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (idTurma) REFERENCES Turmas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar tabela de quadras
CREATE TABLE IF NOT EXISTS Quadras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar tabela de reservas
CREATE TABLE IF NOT EXISTS Reservas_Quadras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quadra_id INT NOT NULL,
  data_reserva DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  descricao VARCHAR(255),
  usuario_id INT,
  valor DECIMAL(10,2) DEFAULT 0.00,
  tipo_recorrencia ENUM('unica', 'diaria', 'semanal') DEFAULT 'unica',
  dias_semana JSON NULL,
  data_fim DATE NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quadra_id) REFERENCES Quadras(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES login(id) ON DELETE SET NULL,
  UNIQUE KEY unique_reserva (quadra_id, data_reserva, hora_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir usuário admin inicial (senha: admin123)
INSERT INTO login (username, password, type) 
VALUES ('admin', '$2b$10$K7L/8Y1t85iCFyOeDrHWpuHEHPmBcVBpYuvsDeNp2CGZXwsSAhHWW', 'admin')
ON DUPLICATE KEY UPDATE username=username;
