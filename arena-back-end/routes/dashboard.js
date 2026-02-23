const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const db = require('../db');

router.get('/', auth, authorize(['admin', 'finance']), async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    // Queries para buscar dados no período
    const totalAlunosQuery = `
      SELECT COUNT(*) as total 
      FROM Alunos 
      WHERE DATE(data_criacao) BETWEEN ? AND ?
    `;
    const totalTurmasQuery = `
      SELECT COUNT(DISTINCT t.id) as total 
      FROM Turmas t
      JOIN Presencas p ON t.id = p.idTurma
      WHERE DATE(p.data) BETWEEN ? AND ?
    `;
    const presencasQuery = `
      SELECT COUNT(*) as total 
      FROM Presencas 
      WHERE status_checkin = 'confirmado' 
      AND DATE(data) BETWEEN ? AND ?
    `;
    const receitaQuery = `
      SELECT SUM(valor_pago) as total 
      FROM Alunos a
      JOIN Presencas p ON a.id = p.idAluno
      WHERE p.status_checkin = 'confirmado' 
      AND DATE(p.data) BETWEEN ? AND ?
    `;
    
    // Executar queries
    const [totalAlunos] = await new Promise((resolve, reject) => {
      db.query(totalAlunosQuery, [dataInicio, dataFim], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    const [totalTurmas] = await new Promise((resolve, reject) => {
      db.query(totalTurmasQuery, [dataInicio, dataFim], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    const [presencas] = await new Promise((resolve, reject) => {
      db.query(presencasQuery, [dataInicio, dataFim], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    const [receita] = await new Promise((resolve, reject) => {
      db.query(receitaQuery, [dataInicio, dataFim], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    res.json({
      success: true,
      data: {
        totalAlunos: totalAlunos.total,
        totalTurmas: totalTurmas.total,
        presencasPeriodo: presencas.total,
        receitaPeriodo: parseFloat(receita.total) || 0
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;