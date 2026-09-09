const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../db');

const { validateUserInput } = require('../validation');

async function getAllUsers(req, res, next) {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
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
    next(error);
  }
}

async function createNewUser(req, res, next) {
  try {
    const { name, email } = req.body;

    const validationError = validateUserInput(name, email);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const user = await createUser(
      name.trim(),
      email.trim()
    );

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function updateExistingUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    const validationError = validateUserInput(name, email);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const updatedUser = await updateUser(
      id,
      name.trim(),
      email.trim()
    );

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

async function removeUser(req, res, next) {
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
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  removeUser,
};
