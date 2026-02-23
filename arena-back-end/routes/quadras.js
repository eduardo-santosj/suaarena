const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Listar quadras
router.get('/', auth, async (req, res) => {
  try {
    const [quadras] = await db.execute(`
      SELECT q.*, 
             COUNT(r.id) as total_reservas
      FROM quadras q
      LEFT JOIN reservas_quadras r ON q.id = r.quadra_id
      WHERE q.ativa = TRUE
      GROUP BY q.id
      ORDER BY q.nome
    `);
    
    res.json({ success: true, data: quadras });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Criar quadra
router.post('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    if (!nome) {
      return res.status(400).json({ success: false, error: 'Nome é obrigatório' });
    }

    const [result] = await db.execute(
      'INSERT INTO quadras (nome, descricao) VALUES (?, ?)',
      [nome, descricao || null]
    );

    res.json({ success: true, data: { id: result.insertId, nome, descricao } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Atualizar quadra
router.put('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, ativa } = req.body;

    await db.execute(
      'UPDATE quadras SET nome = ?, descricao = ?, ativa = ? WHERE id = ?',
      [nome, descricao || null, ativa !== undefined ? ativa : true, id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deletar quadra
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('UPDATE quadras SET ativa = FALSE WHERE id = ?', [id]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar reservas por período
router.get('/reservas', auth, async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    const [reservas] = await db.execute(`
      SELECT r.*, q.nome as quadra_nome, l.username as usuario_nome
      FROM reservas_quadras r
      JOIN quadras q ON r.quadra_id = q.id
      LEFT JOIN login l ON r.usuario_id = l.id
      WHERE r.data_reserva BETWEEN ? AND ?
      ORDER BY r.data_reserva, r.hora_inicio
    `, [data_inicio, data_fim]);

    res.json({ success: true, data: reservas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Criar reserva
router.post('/reservas', auth, authorize(['admin']), async (req, res) => {
  try {
    const { quadra_id, data_reserva, hora_inicio, hora_fim, descricao, valor, tipo_recorrencia, dias_semana, data_fim } = req.body;
    
    if (!quadra_id || !data_reserva || !hora_inicio || !hora_fim || valor === undefined) {
      return res.status(400).json({ success: false, error: 'Dados obrigatórios não informados' });
    }

    // Função para criar uma reserva
    const criarReserva = async (data) => {
      // Verificar conflitos de horário para esta data específica
      const [conflitos] = await db.execute(`
        SELECT id FROM reservas_quadras 
        WHERE quadra_id = ? AND data_reserva = ? 
        AND (
          (hora_inicio < ? AND hora_fim > ?) OR
          (hora_inicio < ? AND hora_fim > ?) OR
          (hora_inicio >= ? AND hora_fim <= ?)
        )
      `, [quadra_id, data, hora_fim, hora_inicio, hora_inicio, hora_inicio, hora_inicio, hora_fim]);

      if (conflitos.length > 0) {
        throw new Error(`Conflito de horário em ${data}! Já existe uma reserva neste período.`);
      }

      return await db.execute(
        'INSERT INTO reservas_quadras (quadra_id, data_reserva, hora_inicio, hora_fim, descricao, valor, tipo_recorrencia, dias_semana, data_fim, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [quadra_id, data, hora_inicio, hora_fim, descricao || null, valor, tipo_recorrencia || 'unica', dias_semana ? JSON.stringify(dias_semana) : null, data_fim || null, req.user.id]
      );
    };

    const datasReservas = [];
    
    if (tipo_recorrencia === 'unica') {
      // Reserva única
      datasReservas.push(data_reserva);
    } else if (tipo_recorrencia === 'diaria') {
      // Reserva diária até data_fim
      const inicio = new Date(data_reserva);
      const fim = new Date(data_fim);
      
      for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
        datasReservas.push(d.toISOString().split('T')[0]);
      }
    } else if (tipo_recorrencia === 'semanal' && dias_semana) {
      // Reserva semanal nos dias especificados
      const inicio = new Date(data_reserva);
      const fim = new Date(data_fim);
      
      for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
        if (dias_semana.includes(d.getDay())) {
          datasReservas.push(d.toISOString().split('T')[0]);
        }
      }
    }

    // Criar todas as reservas
    const resultados = [];
    for (const data of datasReservas) {
      const [result] = await criarReserva(data);
      resultados.push({ id: result.insertId, data });
    }

    res.json({ success: true, data: { reservas: resultados, total: resultados.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;