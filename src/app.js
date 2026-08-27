const express = require('express');
const { checkDatabaseConnection, getUsers, createUser, getUserById, updateUser, deleteUser,} = require('./db');

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

app.get('/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error.message);

    res.status(500).json({
      error: 'Failed to fetch user',
    });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required',
      });
    }

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const updatedUser = await updateUser(id, name, email);

    res.json(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error.message);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Email already exists',
      });
    }

    res.status(500).json({
      error: 'Failed to update user',
    });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete user:', error.message);

    res.status(500).json({
      error: 'Failed to delete user',
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
