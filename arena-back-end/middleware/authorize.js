const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userType = req.user?.userType;
    
    if (!userType) {
      return res.status(403).json({ error: 'Tipo de usuário não encontrado' });
    }
    
    if (!allowedRoles.includes(userType)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil' });
    }
    
    next();
  };
};

module.exports = authorize;