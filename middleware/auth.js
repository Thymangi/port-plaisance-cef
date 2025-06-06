// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('🛡️ [authMiddleware] Appel sur', req.method, req.originalUrl);
  console.log('🧪 Session ID:', req.sessionID);
  console.trace("↪️ Auth middleware déclenché");

  let token = req.session?.token;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('📥 Token trouvé dans le header Authorization');
  }

  if (!token) {
    console.warn("❌ Aucun token transmis");
    const wantsJSON = req.headers.accept?.includes('application/json');
    if (req.originalUrl === '/login') return next();

    return wantsJSON
      ? res.status(401).json({ message: 'Non autorisé : aucun token transmis' })
      : res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Utilisateur authentifié :', decoded);

    req.user = decoded;
    res.locals.user = decoded;
    res.locals.token = token;

    // 📌 Sauvegarde en session si pas déjà présent
    if (!req.session.token) {
      req.session.token = token;
      req.session.save(err => {
        if (err) {
          console.error("❌ Erreur sauvegarde session :", err);
        } else {
          console.log("💾 Token stocké et session sauvegardée");
        }
      });
    }

    next();
  } catch (err) {
    console.error('❌ Token invalide ou expiré :', err.message);
    const wantsJSON = req.headers.accept?.includes('application/json');
    return wantsJSON
      ? res.status(401).json({ message: 'Token invalide ou expiré' })
      : res.redirect('/login');
  }
};
