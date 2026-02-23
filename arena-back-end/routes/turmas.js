
const express = require('express');
const router = express.Router();
const TurmasService = require('../services/turmasService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, authorize(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const results = await TurmasService.buscar();
    res.json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, authorize(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const results = await TurmasService.buscar(req.params.id);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const result = await TurmasService.cadastrar(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const updated = await TurmasService.atualizar(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const deleted = await TurmasService.deletar(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
