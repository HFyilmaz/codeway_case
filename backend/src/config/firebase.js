const admin = require('firebase-admin');
require('dotenv').config();

const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
};

admin.initializeApp(firebaseConfig);

const db = admin.firestore();

module.exports = { admin, db }; 