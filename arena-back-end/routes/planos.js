const express = require('express');
const router = express.Router();
const PlanosService = require('../services/planosService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const results = await PlanosService.buscar();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const results = await PlanosService.buscar(req.params.id);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const { nome, treinos_por_semana, valor } = req.body;
    
    if (!nome || !treinos_por_semana) {
      return res.status(400).json({ error: 'Nome e treinos por semana são obrigatórios' });
    }
    
    const result = await PlanosService.cadastrar(req.body);
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const updated = await PlanosService.atualizar(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const deleted = await PlanosService.deletar(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;