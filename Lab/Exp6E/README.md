# Lab/Exp6E: WordPress and MySQL with Docker Compose

## Overview

This experiment uses Docker Compose to run a WordPress site backed by a MySQL database.

The setup includes:

- `db`: MySQL 8.0 database container
- `wordpress`: WordPress container connected to MySQL

## Services

### db

- Image: `mysql:8.0`
- Restart policy: `always`
- Environment variables:
  - `MYSQL_ROOT_PASSWORD=rootpass`
  - `MYSQL_DATABASE=wordpress`
  - `MYSQL_USER=wpuser`
  - `MYSQL_PASSWORD=wppass`
- Volume: `db_data` mounted at `/var/lib/mysql`

### wordpress

- Image: `wordpress:latest`
- Depends on: `db`
- Ports: `8080:80`
- Restart policy: `always`
- Environment variables:
  - `WORDPRESS_DB_HOST=db:3306`
  - `WORDPRESS_DB_USER=wpuser`
  - `WORDPRESS_DB_PASSWORD=wppass`
  - `WORDPRESS_DB_NAME=wordpress`
- Volume: `wp_data` mounted at `/var/www/html`

## Usage

From `Lab/Exp6E`, run:

```bash
docker compose up -d
```

Then open:

```text
http://localhost:8080
```

Follow the WordPress setup wizard to complete installation.

## Swarm Scaling Note

- I first attempted to scale the WordPress service using Docker Compose, but this did not work in the lab environment.
- I then used Docker Swarm to scale the stack up and down successfully.
- After testing with Swarm, I cleaned the environment to restore the Compose setup.

## Verify

- Confirm the MySQL container is running.
- Confirm the WordPress container is running.
- Visit `http://localhost:8080` in a browser.

## Cleanup

To stop and remove containers:

```bash
docker compose down
```

To remove data volumes as well:

```bash
docker compose down -v
```

If you used Swarm during testing, also remove the stack and cleanup Swarm state as needed.

## Screenshot placeholders
