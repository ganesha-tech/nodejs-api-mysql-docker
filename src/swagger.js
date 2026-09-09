const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Node.js User API',
      version: '1.0.0',
      description: 'REST API for managing users',
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],

    components: {
      schemas: {
        UserInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              example: 'Guru',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'guru@example.com',
            },
          },
        },

        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Guru',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'guru@example.com',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-09-09T10:30:00.000Z',
            },
          },
        },
      },
    },
  },

  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
