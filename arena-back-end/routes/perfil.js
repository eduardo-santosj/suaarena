const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;
    
    // Buscar dados do login
    const loginQuery = 'SELECT username, type FROM login WHERE id = ?';
    const loginResult = await new Promise((resolve, reject) => {
      db.query(loginQuery, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
    
    let perfilData = {
      username: loginResult.username,
      type: loginResult.type
    };
    
    // Se for aluno, buscar dados adicionais
    if (userType === 'student') {
      const alunoQuery = `
        SELECT a.nome, a.valor_pago, t.nome as nomeTurma, t.horario
        FROM Alunos a
        LEFT JOIN Turmas t ON a.idTurma = t.id
        WHERE a.id = ?
      `;
      
      const alunoResult = await new Promise((resolve, reject) => {
        db.query(alunoQuery, [userId], (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        });
      });
      
      if (alunoResult) {
        perfilData = {
          ...perfilData,
          nome: alunoResult.nome,
          valorPago: alunoResult.valor_pago,
          turma: alunoResult.nomeTurma,
          horario: alunoResult.horario
        };
      }
    }
    
    res.json({ success: true, data: perfilData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;