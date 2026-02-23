-- Adicionar campo plano na tabela Alunos
ALTER TABLE Alunos ADD COLUMN idPlano INT(11) DEFAULT NULL;
ALTER TABLE Alunos ADD CONSTRAINT Alunos_plano_fk FOREIGN KEY (idPlano) REFERENCES Planos(id);