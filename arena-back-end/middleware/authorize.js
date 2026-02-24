const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userType = req.user?.userType;
    const method = req.method;
    
    if (!userType) {
      return res.status(403).json({ error: 'Tipo de usuário não encontrado' });
    }
    
    // Viewer pode fazer GET em qualquer rota
    if (userType === 'viewer' && method === 'GET') {
      return next();
    }
    
    // Viewer não pode fazer POST, PUT, DELETE
    if (userType === 'viewer' && ['POST', 'PUT', 'DELETE'].includes(method)) {
      return res.status(403).json({ error: 'Acesso negado: usuário viewer não pode modificar dados' });
    }
    
    if (!allowedRoles.includes(userType)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil' });
    }
    
    next();
  };
};

module.exports = authorize;