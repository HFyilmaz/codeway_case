const { admin } = require('../config/firebase');

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Middleware to verify API token for mobile clients
const verifyApiToken = (req, res, next) => {
  const apiToken = req.headers['x-api-token'];
  
  if (!apiToken || apiToken !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API token' });
  }
  
  next();
};

module.exports = { verifyFirebaseToken, verifyApiToken }; 