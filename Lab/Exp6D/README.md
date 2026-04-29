# Lab/Exp6D: Multi-Stage Docker Build

## Overview

This experiment demonstrates a multi-stage Docker build process using Docker Compose. A multi-stage build helps optimize Docker images by separating the build environment from the production environment, resulting in smaller, more efficient final images.

## Concept

**Multi-stage builds** use multiple `FROM` statements in a Dockerfile:

- **Stage 1 (Builder)**: Compiles/installs dependencies and builds the application.
- **Stage 2 (Production)**: Contains only the runtime and necessary artifacts, reducing image size.

This approach eliminates unnecessary build tools and intermediate files from the final image.

## Project Structure

- `Dockerfile`: Multi-stage Dockerfile with builder and production stages.
- `app.js`: Simple Node.js HTTP server that reads environment variables.
- `package.json`: Node.js project metadata and scripts.
- `docker-compose.yml`: Docker Compose configuration to build and run the app.

## Files

### app.js

A simple HTTP server that accepts environment variables:

- `PORT`: The port to listen on (default: 3000)
- `MESSAGE`: The message to display (default: "Default Message")

### Dockerfile

```dockerfile
# Stage 1 — Build Stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Stage 2 — Production Stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["npm", "start"]
```

**Explanation**:

- **Stage 1 (builder)**: Installs npm dependencies in a build environment.
- **Stage 2**: Copies only the necessary artifacts from the builder stage, resulting in a lean production image without build tools.

### docker-compose.yml

- Service: `nodeapp`
- Build: Uses the local Dockerfile
- Container name: `multistage-node`
- Port mapping: `3002:3000`
- Environment variables:
  - `PORT=3000`
  - `MESSAGE=Hello From Multi Stage Build`
- Volume: Mounts the current directory for development

## Usage

### Build and Run

From the `Lab/Exp6D` directory, run:

```bash
docker compose up --build -d
```

### Verify

Open your browser and navigate to:

```
http://localhost:3002
```

You should see: `Message: Hello From Multi Stage Build`

### View Logs

```bash
docker compose logs -f nodeapp
```

### Modify Message

Edit the `docker-compose.yml` and change the `MESSAGE` environment variable:

```yaml
environment:
  - PORT=3000
  - MESSAGE=Your Custom Message
```

Then rebuild:

```bash
docker compose up --build -d
```

## Benefits of Multi-Stage Builds

- **Smaller final image**: Build dependencies are not included in the production image.
- **Faster deployments**: Reduced image size means faster downloads and starts.
- **Security**: Fewer tools in the final image reduces potential vulnerabilities.
- **Cleaner separation**: Build and runtime environments are explicitly separated.

## Screenshot Locations

![Browser showing initial message](./images/Screenshot%202026-04-13%20at%201.34.40 PM.png)
![Browser showing initial message](./images/Screenshot%202026-04-13%20at%201.34.30 PM.png)

## Cleanup

To stop and remove containers:

```bash
docker compose down
```

To remove the built image:

```bash
docker rmi multistage-node
```
