// /middleware/checkRole.js

const checkRole = (roles) => {
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Accès refusé. Rôle non autorisé.' });
      }
  
      // Vérifie si le rôle de l'utilisateur correspond à un des rôles autorisés
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les autorisations nécessaires.' });
      }
  
      next(); // L'utilisateur a le rôle autorisé, on passe à la route suivante
    };
  };
  
  module.exports = checkRole;
  