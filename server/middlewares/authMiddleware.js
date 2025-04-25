import jwt from 'jsonwebtoken';

export const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token invalide (manquant)' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.user = decoded;

      // Vérifie si l'utilisateur a un rôle autorisé
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès interdit, rôle insuffisant' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
  };
};
export default verifyToken