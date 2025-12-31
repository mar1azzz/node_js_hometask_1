## Features
- CRUD operations with students
- Filtering by group
- Average age calculation
- PostgreSQL as the primary storage
- Database structure migrations
- Server-side data validation
- Backup subsystem (JSON snapshots)
- Swagger UI

---

## Requirements
- Node.js >= 18
- PostgreSQL >= 13

---

## Setup

### 1. Install Dependencies
```bash
npm install
```
### 2. Set Up the Environment

Create a .env file in the project root (example below):
```bash
SERVER_MODE=express
EXPRESS_PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=students_db
DB_USER=postgres
DB_PASSWORD=postgres

```
### 3. Migrate the Database
```bash
npm run db:migrate
```

This command will create all the necessary tables in PostgreSQL.

### 4. Starting the Server
```bash
npm run dev:express
```
### API Documentation

Swagger is available at:

http://localhost:3000/api-docs
