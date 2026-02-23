const express = require('express');
const router = express.Router();
const PresencasService = require('../services/presencasService');
const TurmasService = require('../services/turmasService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const db = require('../db');

// Rota para estudantes confirmarem presença
router.post('/confirmar', auth, authorize(['student']), async (req, res) => {
  try {
    const { idTurma, presente } = req.body;
    const userId = req.user.id;
    
    // Verificar capacidade da turma
    const turma = await TurmasService.buscar(idTurma);
    if (!turma.length) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Verificar se usuário já fez checkin hoje nesta turma
    const hoje = new Date().toISOString().split('T')[0];
    const userCheckinQuery = 'SELECT COUNT(*) as total FROM Presencas WHERE idAluno = ? AND idTurma = ? AND DATE(data) = ?';
    
    const userCheckinResult = await new Promise((resolve, reject) => {
      db.query(userCheckinQuery, [userId, idTurma, hoje], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    if (userCheckinResult[0].total > 0) {
      return res.status(400).json({ 
        error: 'Checkin já realizado', 
        message: 'Você já fez checkin nesta turma hoje' 
      });
    }
    
    // Contar checkins pendentes para esta turma hoje
    const countQuery = 'SELECT COUNT(*) as total FROM Presencas WHERE idTurma = ? AND DATE(data) = ? AND status_checkin = "pendente"';
    
    db.query(countQuery, [idTurma, hoje], async (err, countResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const checkinsPendentes = countResult[0].total;
      const capacidadeMaxima = turma[0].capacidade_maxima;
      
      if (checkinsPendentes >= capacidadeMaxima) {
        return res.status(400).json({ 
          error: 'Turma lotada', 
          message: `Capacidade máxima de ${capacidadeMaxima} alunos atingida` 
        });
      }
      
      // Criar data no horário local do Brasil (UTC-3)
      const agora = new Date();
      const brasilOffset = -3 * 60; // UTC-3 em minutos
      const dataLocal = new Date(agora.getTime() + (brasilOffset * 60 * 1000));
      
      const result = await PresencasService.cadastrar({
        idAluno: userId,
        idTurma,
        status_checkin: 'pendente',
        data: dataLocal
      });
      
      res.json({ 
        success: true, 
        message: 'Presença confirmada', 
        data: result,
        vagasRestantes: capacidadeMaxima - checkinsPendentes - 1
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para buscar turmas de um dia específico
router.get('/turmas-dia', auth, authorize(['student']), async (req, res) => {
  try {
    const { data } = req.query;
    const dataConsulta = data ? new Date(data) : new Date();
    const diaSemana = dataConsulta.getDay(); // 0=domingo, 1=segunda, ..., 6=sábado
    
    const query = `
      SELECT t.*, 
             (SELECT COUNT(*) FROM Presencas p 
              WHERE p.idTurma = t.id 
              AND DATE(p.data) = ? 
              AND p.status_checkin = 'pendente') as checkinsPendentes
      FROM Turmas t 
      WHERE JSON_CONTAINS(t.dias_semana, ?) OR t.dias_semana IS NULL
    `;
    
    const dataFormatada = dataConsulta.toISOString().split('T')[0];
    
    db.query(query, [dataFormatada, JSON.stringify(diaSemana)], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const turmasComVagas = results.map(turma => ({
        ...turma,
        vagasDisponiveis: turma.capacidade_maxima - turma.checkinsPendentes,
        turmaLotada: (turma.capacidade_maxima - turma.checkinsPendentes) <= 0
      }));
      
      res.json({ success: true, data: turmasComVagas });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para verificar vagas disponíveis em uma turma
router.get('/vagas/:idTurma', auth, authorize(['student']), async (req, res) => {
  try {
    const { idTurma } = req.params;
    const hoje = new Date().toISOString().split('T')[0];
    
    const turma = await TurmasService.buscar(idTurma);
    if (!turma.length) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    const countQuery = 'SELECT COUNT(*) as total FROM Presencas WHERE idTurma = ? AND DATE(data) = ? AND status_checkin = "pendente"';
    
    db.query(countQuery, [idTurma, hoje], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const checkinsPendentes = result[0].total;
      const capacidadeMaxima = turma[0].capacidade_maxima;
      const vagasDisponiveis = capacidadeMaxima - checkinsPendentes;
      
      res.json({
        success: true,
        capacidadeMaxima,
        checkinsPendentes,
        vagasDisponiveis,
        turmaLotada: vagasDisponiveis <= 0
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para professor ver checkins pendentes
router.get('/pendentes/:idTurma', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const { idTurma } = req.params;
    const hoje = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT p.id, p.idAluno, a.nome, p.data, p.status_checkin 
      FROM Presencas p 
      JOIN Alunos a ON p.idAluno = a.id 
      WHERE p.idTurma = ? AND DATE(p.data) = ? AND p.status_checkin = 'pendente'
    `;
    
    db.query(query, [idTurma, hoje], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, data: results });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para professor confirmar/rejeitar checkin
router.put('/aprovar/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('Dados recebidos:', { id, status });
    
    if (!status || !['confirmado', 'rejeitado'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    
    const query = 'UPDATE Presencas SET status_checkin = ? WHERE id = ?';
    
    console.log('Executando query:', query, [status, id]);
    
    db.query(query, [status, id], (err, result) => {
      if (err) {
        console.error('Erro SQL completo:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Resultado da query:', result);
      res.json({ success: true, message: `Checkin ${status}` });
    });
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ error: err.message });
  }
});

// Rota para verificar se já fez checkin na turma hoje
router.get('/status/:idTurma', auth, authorize(['student']), async (req, res) => {
  try {
    const { idTurma } = req.params;
    const userId = req.user.id;
    const hoje = new Date().toISOString().split('T')[0];
    
    const query = 'SELECT COUNT(*) as total FROM Presencas WHERE idAluno = ? AND idTurma = ? AND DATE(data) = ?';
    
    db.query(query, [userId, idTurma, hoje], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ 
        success: true, 
        jaFezCheckin: results[0].total > 0 
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para estudantes verem suas presenças
router.get('/minhas-presencas', auth, authorize(['student']), async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await PresencasService.buscar(userId);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;