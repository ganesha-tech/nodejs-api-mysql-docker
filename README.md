# Node.js User API — MySQL + Podman
A freelance-ready backend demonstration built with Node.js, Express, MySQL 8, Jest, Supertest, Swagger/OpenAPI, and Podman.
This project provides a REST API for user management with CRUD operations, request validation, centralized error handling, automated API testing, interactive API documentation, containerized execution, and practical security hardening.

The architecture is intentionally straightforward and maintainable, making the project easy to understand, run, test, and demonstrate to clients.

## Project Overview
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
The project intentionally avoids unnecessary enterprise-level complexity and focuses on clear, demonstrable backend functionality.
Quick Start
Clone the repository and install the dependencies:
git clone <repository-url>
cd nodejs-api-mysql-docker

npm install

Start the application and MySQL containers:
podman compose up -d --build

Check the container status:
podman compose ps

Verify the API:
curl -i http://localhost:3000/health

Open the interactive API documentation:
http://localhost:3000/api-docs/

Run the automated tests:
npm test

## Technology Stack
Technology	Purpose
Node.js 20+	Backend runtime
Express	REST API framework
MySQL 8	Relational database
mysql2	MySQL driver
Jest	Testing framework
Supertest	HTTP/API testing
Swagger UI	Interactive API documentation
swagger-jsdoc	OpenAPI specification generation
swagger-ui-express	Swagger UI integration
Podman	Container runtime
Podman Compose	Multi-container development

## Architecture
The application follows a simple backend structure:
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

### Containerized Architecture
+--------------------------------+
|            Podman              |
|                                |
|  +--------------------------+  |
|  | Node.js API              |  |
|  | Port 3000                |  |
|  +------------+-------------+  |
|               |                |
|               v                |
|  +--------------------------+  |
|  | MySQL 8                  |  |
|  | Port 3306                |  |
|  +--------------------------+  |
|                                |
+--------------------------------+

The Node.js API and MySQL database run as separate containers connected through the Podman Compose network.
The API communicates with MySQL using the configured MySQL service hostname rather than localhost between containers.

The architecture is intentionally simple so that the codebase remains easy to understand, maintain, test, and extend.

## MySQL
The application uses MySQL 8 as its relational database.

## Project Structure
.
├── src/
│   ├── app.js
│   ├── db.js
│   ├── swagger.js
│   ├── validation.js
│   └── ...
├── tests/
│   └── users.test.js
├── mysql/
│   └── init.sql
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md

## Prerequisites
Install the following before starting:
Node.js 20+
npm
Podman
Podman Compose
Verify the installations:
node --version
npm --version
podman --version
podman compose version

## Installation
Clone the repository:
git clone <repository-url>
cd nodejs-api-mysql-docker

Install the Node.js dependencies:
npm install

## Environment Variables
The application uses environment variables for database and application configuration.
The available configuration values are:

Variable	Purpose
PORT	API server port
MYSQL_HOST	MySQL hostname
MYSQL_PORT	MySQL port
MYSQL_USER	MySQL username
MYSQL_PASSWORD	MySQL password
MYSQL_DATABASE	Application database name
MYSQL_TEST_DATABASE	Test database name
NODE_ENV	Application/test environment

The repository includes .env.example as a configuration template.
For containerized execution, the API uses the MySQL service hostname configured by the Compose environment.

When NODE_ENV=test, the application uses MYSQL_TEST_DATABASE instead of the normal application database.

Do not commit real passwords, credentials, or other secrets to GitHub.

Use an appropriate local .env configuration for development and testing.

## Running with Podman
The recommended way to run the complete application is with Podman Compose.
Start the application:

podman compose up -d --build

Check container status:
podman compose ps

The expected services are:
nodejs-api
mysql-db
The API is available at:
http://localhost:3000

Check the health endpoint:
curl -i http://localhost:3000/health

View API logs:
podman compose logs nodejs-api

View MySQL logs:
podman compose logs mysql-db

Stop the application:
podman compose down

### Reset the Database
To completely reset the database and recreate it from the initialization scripts:
podman compose down -v
podman compose up -d --build

Warning: podman compose down -v removes the persistent MySQL volume and deletes the stored database data.
The application uses MySQL 8 as its relational database.
When running through Podman Compose, the API and MySQL run in separate containers. The API communicates with MySQL through the internal Compose network.

The MySQL service is also exposed locally on:

localhost:3306

The database initialization script is located at:
mysql/init.sql

The initialization script creates the test database, grants the application user access to it, creates the `users` table in both application and test databases, and inserts demonstration seed data.
Database data is stored in the mysql_data container volume so that data persists across normal container restarts.

### Database Health
The API provides a health endpoint:
GET /health

Example:
curl -i http://localhost:3000/health

The endpoint checks the application's database connectivity and reports the API/database health status.
A successful response is:

{
  "status": "ok",
  "database": "connected"
}

If the database is unavailable, the endpoint returns an appropriate service-unavailable response.
## Test Database Isolation
Automated tests use a separate test database.
The test environment is selected using:

NODE_ENV=test

The test configuration uses MYSQL_TEST_DATABASE instead of MYSQL_DATABASE.
This separation helps prevent automated tests from intentionally operating against the normal application database.

Run the test suite with:

npm test

## Automated Tests
The project uses:
Jest as the test runner
Supertest for HTTP/API testing
The test command runs Jest in single-process mode:
jest --runInBand

The test suite covers areas including:
Health endpoint
User listing
User retrieval
Invalid user IDs
Missing users
User creation
Input validation
Whitespace handling
Email validation
User updates
User deletion
Duplicate email handling
Run the complete test suite with:
npm test

## API Endpoints
Health Check
GET /health

Checks application and database connectivity.
Get All Users
GET /users

Returns a list of users.
Get User by ID
GET /users/:id

Returns a specific user when the requested ID exists.
Example:

GET /users/1

Create User
POST /users
Content-Type: application/json

Example request:
{
  "name": "Guru",
  "email": "guru@example.com"
}

A successful request creates a new user and returns the created user information.
Update User
PUT /users/:id
Content-Type: application/json

Example:
PUT /users/1

Request body:
{
  "name": "Updated Guru",
  "email": "updated@example.com"
}

Updates the specified user when the ID and input are valid.
Delete User
DELETE /users/:id

Example:
DELETE /users/1

A successful deletion returns:
204 No Content

## Validation
The API validates user input before performing database operations.
Validation includes:

Required name
Required email
Non-empty name
Valid email format
Valid numeric user ID
Invalid requests return appropriate HTTP error responses.
## Error Handling
The application uses centralized error handling to provide consistent API responses.
Common HTTP responses include:

Situation	HTTP Status
Invalid request	400
User not found	404
Duplicate email	409
Database/server error	500
Database unavailable	503

Duplicate email database constraint errors are converted into a 409 Conflict response rather than exposing the raw database error to the API consumer.
## Swagger / OpenAPI Documentation
Interactive API documentation is available at:
http://localhost:3000/api-docs/

Swagger UI provides an interactive interface for exploring the API endpoints.
The project uses:

OpenAPI to describe the API contract
swagger-jsdoc to generate the OpenAPI specification
swagger-ui-express to serve the interactive Swagger UI
The Swagger documentation can be used to inspect available endpoints and explore the API interactively.
## Example API Requests
Create a User
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Guru",
    "email": "guru@example.com"
  }'

Retrieve Users
curl http://localhost:3000/users

Retrieve a Specific User
curl http://localhost:3000/users/1

Update a User
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Guru",
    "email": "updated@example.com"
  }'

Delete a User
curl -X DELETE http://localhost:3000/users/1

The example user IDs are illustrative. A fresh installation may contain different data depending on the database initialization state.
## Troubleshooting
API Container Is Not Running
Check the container status:
podman compose ps

View the API logs:
podman compose logs nodejs-api

MySQL Is Not Healthy
Check the container status:
podman compose ps

View the MySQL logs:
podman compose logs mysql-db

Recreate the Containers
Stop the existing containers:
podman compose down

Rebuild and start them:
podman compose up -d --build

Reset the Database
If a completely fresh database is required:
podman compose down -v
podman compose up -d --build

This removes the persistent database volume and recreates the database.
Warning: Existing database data will be deleted.
API Is Running but Database Requests Fail
Check the container status:
podman compose ps

Check MySQL logs:
podman compose logs mysql-db

Check API logs:
podman compose logs nodejs-api

Verify that the configured database host, database name, username, and password match the MySQL configuration.
Swagger UI Appears Blank
First verify that the Swagger page is being served:
curl -i http://localhost:3000/api-docs/

Then verify the Swagger assets:
curl -I http://localhost:3000/api-docs/swagger-ui.css

curl -I http://localhost:3000/api-docs/swagger-ui-bundle.js

curl -I http://localhost:3000/api-docs/swagger-ui-standalone-preset.js

curl -I http://localhost:3000/api-docs/swagger-ui-init.js

If these resources return 200 OK, the application is successfully serving the Swagger HTML, CSS, and JavaScript assets.
If the assets are served successfully but Swagger does not render in a particular browser, test the page using another browser to determine whether the issue is browser-specific.

## Security Considerations
The project includes practical security measures appropriate for a freelance/portfolio demonstration.
Implemented measures include:

Environment-based configuration
No hard-coded production secrets
Input validation
Centralized error handling
Appropriate HTTP status codes
Duplicate database constraint handling
Helmet security middleware
JSON request size limit
Non-root container execution
Separate test and application databases
Containerized application execution
The security approach is intentionally practical and proportional to the scope of the project. The goal is to demonstrate security-conscious backend development without introducing unnecessary enterprise infrastructure.
## Running the Complete Project
A typical development workflow is:
1. Install Dependencies
npm install

2. Start the Containers
podman compose up -d --build

3. Check the Containers
podman compose ps

4. Check the API
curl -i http://localhost:3000/health

5. Open Swagger
http://localhost:3000/api-docs/

6. Run Automated Tests
npm test

7. Stop the Containers
podman compose down

## Project Demonstration
The project demonstrates a complete backend development workflow:
Requirements
     |
     v
REST API
     |
     v
Input Validation
     |
     v
MySQL Persistence
     |
     v
Error Handling
     |
     v
Automated Tests
     |
     v
OpenAPI Documentation
     |
     v
Containerized Development
     |
     v
Client-Ready Documentation

## Freelance Project Value
This project demonstrates the ability to deliver a maintainable backend service from development through testing, documentation, and containerized execution.
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
The project is suitable as a portfolio demonstration of a straightforward, maintainable backend API that a client can install, run, test, and explore locally.
## License
Add the appropriate license for the intended use and distribution of this project.