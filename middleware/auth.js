// middleware/auth.js (version ESM)
import jwt from 'jsonwebtoken';

export default function isAuthenticated(req, res, next) {
  console.log('🛡️ [authMiddleware] Accès à', req.method, req.originalUrl);

  let token = req.session?.token;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('Token trouvé dans le header Authorization');
  }

  if (!token) {
    console.warn("❌ Aucun token fourni");

    const wantsJSON = req.headers.accept?.includes('application/json');
    return wantsJSON
      ? res.status(401).json({ message: 'Non autorisé : aucun token transmis' })
      : res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Utilisateur authentifié :', decoded);

    req.user = decoded;
    res.locals.user = decoded;
    res.locals.token = token;

    if (!req.session.token) {
      req.session.token = token;
      req.session.save((err) => {
        if (err) console.error('Erreur sauvegarde session :', err);
        else console.log('Token session mis à jour');
      });
    }

    return next();

  } catch (err) {
    console.error('❌ Token invalide ou expiré :', err.message);

    const wantsJSON = req.headers.accept?.includes('application/json');
    return wantsJSON
      ? res.status(401).json({ message: 'Token invalide ou expiré' })
      : res.redirect('/');
  }
};