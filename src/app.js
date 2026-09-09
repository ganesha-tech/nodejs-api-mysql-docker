const express = require('express');

const { checkDatabaseConnection } = require('./db');

const usersRouter = require('./routes/users');

const errorHandler = require('./middleware/errorHandler');

const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use('/users', usersRouter);

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

module.exports = app;

