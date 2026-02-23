ALTER TABLE Presencas ADD COLUMN status_checkin ENUM('pendente', 'confirmado', 'rejeitado') DEFAULT 'pendente';
