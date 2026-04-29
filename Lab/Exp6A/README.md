# Lab/Exp6A: Nginx Static Website with Docker Compose

## Overview

This lab demonstrates how to run an Nginx web server using Docker Compose and serve a static HTML site from a local volume.

## Project Structure

- `docker-compose.yml`: Docker Compose configuration for an Nginx service.
- `html/index.html`: Static website content served by Nginx.
- `images/`: Placeholder folder for screenshots or additional assets.

## Compose Configuration

The Compose file defines a single service:

- `nginx`
  - Image: `nginx:alpine`
  - Container name: `my-nginx`
  - Port mapping: `8080:80`
  - Volume: `./html:/usr/share/nginx/html`
  - Environment: `NGINX_HOST=localhost`
  - Restart policy: `unless-stopped`

## Usage

From the `Lab/Exp6A` directory, run:

```bash
docker compose up -d
```

Then open:

```text
http://localhost:8080
```

You should see the static HTML page with the message "Welcome Kinjal 🚀".

## What is being learned

- Running a containerized Nginx service with Docker Compose.
- Mapping local files into the container using a bind mount.
- Serving static HTML content from a local directory.
- Exposing container ports to the host machine.

## Verify

- Confirm that the `my-nginx` container is running:

```bash
docker compose ps
```

- Confirm the page loads at `http://localhost:8080`.

## Cleanup

To stop and remove the container:

```bash
docker compose down
```

## Screenshot placeholders

![Nginx page output](images/nginx-page.png)

![Docker Compose status](images/docker-compose-ps.png)
