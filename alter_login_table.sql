-- Adicionar coluna type na tabela login para tipos de perfil
ALTER TABLE login 
ADD COLUMN type ENUM('admin', 'teacher', 'student', 'finance') NOT NULL DEFAULT 'student';

-- Comentários sobre os tipos de perfil:
-- admin: acesso total a todas as telas e funções
-- teacher: cadastra alunos, turmas e presenças  
-- finance: acessa dashboard e relatórios financeiros
-- student: acessa tela de checkin para confirmar presença nas turmas