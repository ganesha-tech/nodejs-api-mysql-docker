process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

const {
  closeDatabaseConnection,
} = require('../src/db');

describe('Health endpoint', () => {
  test('GET /health returns database status', async () => {
    const response = await request(app)
      .get('/health');

    expect([200, 503]).toContain(response.statusCode);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('database');
  });
});

describe('GET /users', () => {
  test('returns a list of users', async () => {
    const response = await request(app)
      .get('/users');

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('GET /users/:id', () => {
  test('returns a user when the ID exists', async () => {
    const response = await request(app)
      .get('/users/1');

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  test('returns 400 for an invalid user ID', async () => {
    const response = await request(app)
      .get('/users/abc');

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid user ID',
    });
  });

  test('returns 404 when user does not exist', async () => {
    const response = await request(app)
      .get('/users/9999');

    expect(response.statusCode).toBe(404);

    expect(response.body).toEqual({
      error: 'User not found',
    });
  });
});

describe('POST /users validation', () => {
  test('rejects missing name', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'missingname@example.com',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Name is required',
    });
  });

  test('rejects missing email', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Missing Email',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Email is required',
    });
  });

  test('rejects invalid email', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Invalid Email',
        email: 'not-an-email',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid email address',
    });
  });

  test('rejects whitespace-only name', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: '   ',
        email: 'whitespace@example.com',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Name is required',
    });
  });
});

describe('POST /users', () => {
  test('creates a new user', async () => {
    const uniqueEmail = `jest-${Date.now()}@example.com`;

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Jest Test User',
        email: uniqueEmail,
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Jest Test User');
    expect(response.body.email).toBe(uniqueEmail);
  });
});

test('trims whitespace from name and email', async () => {
  const uniqueEmail = `trim-${Date.now()}@example.com`;

  const response = await request(app)
    .post('/users')
    .send({
      name: '  Trim Test  ',
      email: `  ${uniqueEmail}  `,
    });

  expect(response.statusCode).toBe(201);

  expect(response.body.name).toBe('Trim Test');
  expect(response.body.email).toBe(uniqueEmail);
});

describe('PUT /users/:id', () => {
  test('rejects invalid email', async () => {
    const response = await request(app)
      .put('/users/1')
      .send({
        name: 'Updated User',
        email: 'invalid-email',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid email address',
    });
  });

  test('rejects missing name', async () => {
    const response = await request(app)
      .put('/users/1')
      .send({
        email: 'updated@example.com',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Name is required',
    });
  });

  test('rejects missing email', async () => {
    const response = await request(app)
      .put('/users/1')
      .send({
        name: 'Updated User',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Email is required',
    });
  });

  test('rejects invalid user ID', async () => {
    const response = await request(app)
      .put('/users/abc')
      .send({
        name: 'Updated User',
        email: 'updated@example.com',
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid user ID',
    });
  });
});

describe('DELETE /users/:id', () => {
  test('rejects invalid user ID', async () => {
    const response = await request(app)
      .delete('/users/abc');

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid user ID',
    });
  });
});

describe('Duplicate email handling', () => {
  test('returns 409 when email already exists', async () => {
    const uniqueEmail = `duplicate-${Date.now()}@example.com`;

    const firstResponse = await request(app)
      .post('/users')
      .send({
        name: 'Original User',
        email: uniqueEmail,
      });

    expect(firstResponse.statusCode).toBe(201);

    const duplicateResponse = await request(app)
      .post('/users')
      .send({
        name: 'Duplicate User',
        email: uniqueEmail,
      });

    expect(duplicateResponse.statusCode).toBe(409);

    expect(duplicateResponse.body).toEqual({
      error: 'Email already exists',
    });
  });
});

afterAll(async () => {
  await closeDatabaseConnection();
});

