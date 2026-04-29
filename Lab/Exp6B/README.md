# Lab/Exp6B: Docker Compose and Multi-Service Workflows

## Overview

This experiment explores Docker Compose with multiple related exercises in `Lab/Exp6B`. It includes a WordPress/MySQL Compose stack and separate task-based service examples.

## Main Compose Application

The top-level `docker-compose.yml` defines a small WordPress application stack:

- `mysql`: MySQL 8.0 database container
- `wordpress`: WordPress container connected to MySQL

The application is exposed on port `8082` and uses a persistent Docker volume for MySQL data.

## Tasks

### Task 3

- Link: [Task 3](./Task2/README.md)
- Description: Simple Docker Compose setup for a Node.js web application using `node:18-alpine`.

### Task 4

- Link: [Task 4](./Task3/README.md)
- Description: Docker Compose setup for a PostgreSQL database and Python backend stack.

## Usage

To start the main WordPress/MySQL stack in `Lab/Exp6B`:

```bash
docker compose up -d
```

Open the application at:

```text
http://localhost:8082
```

## Notes

- Task 3 and Task 4 are documented in their respective subdirectories.
- The Task 4 content is currently available in `Lab/Exp6B/Task3/README.md`.
- Use `docker compose down` to stop the main stack.

## Cleanup

```bash
docker compose down -v
```
