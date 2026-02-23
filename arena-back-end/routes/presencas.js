
const express = require('express');
const router = express.Router();
const PresencasService = require('../services/presencasService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', auth, authorize(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const result = await PresencasService.cadastrar(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const results = await PresencasService.buscar();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const results = await PresencasService.buscar(req.params.id);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Nenhuma presença encontrada' });
    }
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const updated = await PresencasService.atualizar(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Presença não encontrada' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const deleted = await PresencasService.deletar(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Presença não encontrada' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
