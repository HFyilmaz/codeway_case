const express = require('express');
const cors = require('cors');
require('dotenv').config();

const configRoutes = require('./routes/config');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://config-management-frontend.onrender.com']
    : ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/config', configRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 