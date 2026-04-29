# Task 3

## Overview

This task demonstrates a simple Docker Compose setup for a Node.js web application container.

## Services

- `webapp`: runs the `node:18-alpine` image and exposes port `5000`.

## Environment

- `APP_ENV=production`
- `DEBUG=false`

## Usage

From the `Lab/Exp6B/Task3` directory, run:

```bash
docker compose up -d
```

Then access the application at:

```text
http://localhost:5000
```

## Stop and remove containers

```bash
docker compose down
```
