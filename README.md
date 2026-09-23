Node.js User API — MySQL + Podman
A production-style REST API built with Node.js, Express, MySQL, Jest, Supertest, and Swagger/OpenAPI.
This project demonstrates a complete backend API workflow suitable for freelance development and client demonstrations, including CRUD operations, validation, error handling, database integration, automated testing, API documentation, containerized development, and practical security hardening.

Project Overview
The application provides a REST API for managing users.
It demonstrates:

RESTful API design
Node.js and Express backend development
MySQL database integration
CRUD operations
Request validation
Centralized error handling
Duplicate email handling
Automated API testing with Jest and Supertest
Swagger/OpenAPI documentation
Containerized development with Podman
Separate test database configuration
Environment-based configuration
Practical security hardening
The project is intentionally kept straightforward and maintainable rather than introducing unnecessary enterprise-level complexity.
Technology Stack
Technology	Purpose
Node.js	Backend runtime
Express	REST API framework
MySQL 8	Relational database
mysql2	MySQL driver
Jest	Testing framework
Supertest	HTTP/API testing
Swagger UI	Interactive API documentation
swagger-jsdoc	OpenAPI specification generation
Podman	Container runtime
podman-compose	Multi-container development

Architecture
The application follows a simple layered backend structure:
Client
  |
  v
Express API
  |
  +--> Routes
  |
  +--> Controllers
  |
  +--> Validation
  |
  +--> Error Handler
  |
  v
MySQL

Containerized development:
+-----------------------+
|       Podman          |
|                       |
|  +-----------------+  |
|  | Node.js API     |  |
|  | Port 3000       |  |
|  +--------+--------+  |
|           |            |
|           v            |
|  +-----------------+  |
|  | MySQL 8         |  |
|  | Port 3306       |  |
|  +-----------------+  |
|                       |
+-----------------------+

Project Structure
.
├── src/
│   ├── app.js
│   ├── server.js
│   ├── swagger.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── ...
├── tests/
│   └── users.test.js
├── Dockerfile
├── compose.yaml
├── package.json
├── package-lock.json
└── README.md

Prerequisites
Install the following before starting:
Node.js 20+
npm
Podman
podman-compose
Verify the installations:
node --version
npm --version
podman --version
podman compose version

Installation
Clone the repository and enter the project directory:
git clone <repository-url>
cd nodejs-api-mysql-docker

Install Node.js dependencies:
npm install

Environment Variables
The application uses environment variables for database configuration.
Typical configuration includes:

NODE_ENV
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
DB_TEST_NAME
PORT

Do not commit real passwords or other secrets to GitHub.
For local development, use an environment file appropriate to the project configuration.

Running with Podman
The recommended way to run the complete application is with Podman.
Start the application:

podman compose up -d --build

Check the containers:
podman compose ps

The expected services are:
nodejs-api
mysql-db

The API is available at:
http://localhost:3000

Check the health endpoint:
curl http://localhost:3000/health

Stop the application:
podman compose down

To remove the associated volumes as well:
podman compose down -v

The -v option removes persistent database volumes and therefore resets the database data.
MySQL
The application uses MySQL 8 as its relational database.
When running through Podman Compose, the API communicates with MySQL through the compose network rather than relying on localhost between containers.

The MySQL service is exposed locally on:

localhost:3306

The API container connects to the MySQL service using the configured database host.
Database Health
The API exposes:
GET /health

Example:
curl -i http://localhost:3000/health

The endpoint reports the application's database connectivity status.
Test Database Isolation
Automated tests use a separate test database.
The test environment is selected using:

NODE_ENV=test

The test configuration uses the test database rather than the normal application database.
This prevents automated tests from intentionally operating against the normal development database.

Run the test suite with:

npm test

Automated Tests
The project uses:
Jest for the test runner
Supertest for HTTP/API testing
The tests cover areas including:
Health endpoint
Listing users
Retrieving users
Invalid user IDs
Missing users
User creation
Input validation
Whitespace handling
Email validation
User updates
User deletion
Duplicate email handling
Run:
npm test

The test command runs Jest in single-process mode:
jest --runInBand

API Endpoints
Health
GET /health

Returns the application's health and database connection status.
Get all users
GET /users

Returns a list of users.
Get user by ID
GET /users/:id

Example:
GET /users/1

Create user
POST /users
Content-Type: application/json

Example request:
{
  "name": "Guru",
  "email": "guru@example.com"
}

Successful response:
{
  "id": 1,
  "name": "Guru",
  "email": "guru@example.com"
}

Update user
PUT /users/:id
Content-Type: application/json

Example:
{
  "name": "Updated Guru",
  "email": "updated@example.com"
}

Delete user
DELETE /users/:id

Example:
DELETE /users/1

A successful deletion returns:
204 No Content

Validation
The API validates user input before performing database operations.
Examples include:

Required name
Required email
Non-empty name
Valid email format
Valid numeric user ID
Invalid requests return appropriate HTTP error responses.
Error Handling
The application uses centralized error handling.
Examples include:

Situation	HTTP Status
Invalid request	400
User not found	404
Duplicate email	409
Database/server error	500
Database unavailable	503

Duplicate email errors are converted into a 409 Conflict response rather than exposing the raw database error to the API consumer.
Swagger / OpenAPI Documentation
Interactive API documentation is available at:
http://localhost:3000/api-docs/

Swagger UI provides an interactive view of the API endpoints and allows API operations to be explored from the browser.
The project uses swagger-jsdoc to generate the OpenAPI specification and Swagger UI to display the documentation.

Example API Request
Create a user:
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Guru",
    "email": "guru@example.com"
  }'

Retrieve users:
curl http://localhost:3000/users

Retrieve a specific user:
curl http://localhost:3000/users/1

Update a user:
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Guru",
    "email": "updated@example.com"
  }'

Delete a user:
curl -X DELETE http://localhost:3000/users/1

Troubleshooting
API container is not running
Check the container status:
podman compose ps

View API logs:
podman compose logs nodejs-api

MySQL is not healthy
Check the MySQL container:
podman compose ps

View MySQL logs:
podman compose logs mysql-db

Recreate the containers
podman compose down
podman compose up -d --build

Reset the database
If a completely fresh database is required:
podman compose down -v
podman compose up -d --build

This removes the database volume and therefore deletes the existing database data.
API is running but database requests fail
Check:
podman compose ps
podman compose logs mysql-db
podman compose logs nodejs-api

Verify that the configured database name, username, password, and host match the MySQL configuration.
Swagger UI appears blank
First verify that the API is running:
curl -i http://localhost:3000/api-docs/

Then verify the Swagger assets:
curl -I http://localhost:3000/api-docs/swagger-ui.css
curl -I http://localhost:3000/api-docs/swagger-ui-bundle.js
curl -I http://localhost:3000/api-docs/swagger-ui-standalone-preset.js
curl -I http://localhost:3000/api-docs/swagger-ui-init.js

If these return 200 OK, the Swagger resources are being served by the application.
Browser-specific rendering issues can also be tested using another browser.

Security Considerations
The project includes practical security measures appropriate for a freelance/demo application, including:
Environment-based configuration
No hard-coded production secrets
Input validation
Centralized error handling
Appropriate HTTP status codes
Duplicate database constraint handling
Containerized application execution
Separation of test and application databases
The project intentionally avoids unnecessary enterprise security infrastructure that would add complexity without materially improving the demonstration.
Running the Complete Project
A typical development workflow is:
npm install

Start the containers:
podman compose up -d --build

Check their status:
podman compose ps

Check the API:
curl http://localhost:3000/health

Open Swagger:
http://localhost:3000/api-docs/

Run automated tests:
npm test

Stop the containers when finished:
podman compose down

Project Demonstration
The project demonstrates a complete backend development workflow:
Requirements
    ↓
REST API
    ↓
Input Validation
    ↓
MySQL Persistence
    ↓
Error Handling
    ↓
Automated Tests
    ↓
OpenAPI Documentation
    ↓
Containerized Deployment
    ↓
Client-Ready Documentation

Freelance Project Value
This project can be presented as an example of delivering a maintainable backend service from development through documentation and containerized execution.
It demonstrates practical experience with:

Backend API development
Database integration
API validation
Automated testing
API documentation
Containerized environments
Environment configuration
Security-conscious development
Client-oriented technical documentation
License
Add the appropriate license for your intended use of the project.