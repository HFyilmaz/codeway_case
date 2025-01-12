const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyFirebaseToken, verifyApiToken } = require('../middleware/auth');

// Get all configurations (for panel)
router.get('/all', verifyFirebaseToken, async (req, res) => {
  try {
    const configsSnapshot = await db.collection('configurations').get();
    const configs = [];
    
    configsSnapshot.forEach(doc => {
      configs.push({
        key: doc.id,
        ...doc.data()
      });
    });

    res.json(configs);
  } catch (error) {
    console.error('Error fetching configurations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get configuration (for mobile clients)
router.get('/', verifyApiToken, async (req, res) => {
  try {
    const configsSnapshot = await db.collection('configurations').get();
    const configs = {};
    
    configsSnapshot.forEach(doc => {
      configs[doc.id] = doc.data().value;
    });

    res.json(configs);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new configuration parameter
router.post('/add_config', verifyFirebaseToken, async (req, res) => {
  try {
    const { key, value, description } = req.body;

    // Validate required fields
    if (!key || !value || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if key already exists
    const configRef = db.collection('configurations').doc(key);
    const configDoc = await configRef.get();

    if (configDoc.exists) {
        return res.status(400).json({ error: 'Configuration key already exists' });
    }

    // Create new configuration object
    const newConfig = {
        key,
        value,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add the configuration
    await configRef.set(newConfig);

    res.status(201).json({
        message: 'Configuration added successfully',
        config: {
            key,
            ...newConfig
      }
    });
  } catch (error) {
    console.error('Error adding configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update configuration
router.put('/update/:key', verifyFirebaseToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    // Validate required fields
    if (!value || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const configRef = db.collection('configurations').doc(key);
    const configDoc = await configRef.get();

    if (!configDoc.exists) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    // Update configuration
    const updateData = {
      value,
      description,
      updatedAt: new Date().toISOString()
    };

    await configRef.update(updateData);

    res.json({
      message: 'Configuration updated successfully',
      config: {
        key,
        ...updateData,
        createdAt: configDoc.data().createdAt
      }
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete configuration
router.delete('/delete/:key', verifyFirebaseToken, async (req, res) => {
  try {
    const { key } = req.params;
    const configRef = db.collection('configurations').doc(key);
    const configDoc = await configRef.get();

    if (!configDoc.exists) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    await configRef.delete();

    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 