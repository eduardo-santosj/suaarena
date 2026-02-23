-- Deletar usuário admin se existir e inserir novamente
DELETE FROM login WHERE username = 'admin';

-- Inserir usuário admin inicial (senha: admin123)
INSERT INTO login (username, password, type) VALUES ('admin', '$2b$10$K7L/8Y1t85iCFyOeDrHWpuHEHPmBcVBpYuvsDeNp2CGZXwsSAhHWW', 'admin');