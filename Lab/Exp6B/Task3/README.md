# Task 4

## Overview

This task uses Docker Compose to run a small application stack with PostgreSQL and a Python backend.

## Services

- `postgres-db`: PostgreSQL 15 database server.
- `backend`: Python 3.11 application container that connects to the database.

## Configuration

### PostgreSQL

- `POSTGRES_USER=admin`
- `POSTGRES_PASSWORD=secret`

The database data is persisted using the named volume `pgdata`.

### Backend

- `DB_HOST=postgres-db`
- `DB_USER=admin`
- `DB_PASS=secret`

The backend is exposed on `localhost:8001` and depends on the PostgreSQL service.

## Usage

From the `Lab/Exp6B/Task4` directory, run:

```bash
docker compose up -d
```

Then access the backend at:

```text
http://localhost:8001
```

## Stop and remove containers

```bash
docker compose down -v
```
