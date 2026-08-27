const express = require('express');
const { checkDatabaseConnection, getUsers, createUser } = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await checkDatabaseConnection();

    res.json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);

    res.status(503).json({
      status: 'ok',
      database: 'disconnected',
    });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error.message);

    res.status(500).json({
      error: 'Failed to fetch users',
    });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required',
      });
    }

    const user = await createUser(name, email);

    res.status(201).json(user);
  } catch (error) {
    console.error('Failed to create user:', error.message);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Email already exists',
      });
    }

    res.status(500).json({
      error: 'Failed to create user',
    });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
