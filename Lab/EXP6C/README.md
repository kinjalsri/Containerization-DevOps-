# Lab/Exp6C: Replace Standard Image with Dockerfile (Node App)

## Overview

This experiment demonstrates how to replace a standard Docker image (`node:18-alpine`) with a custom Dockerfile in a Docker Compose setup. Instead of directly using the pre-built image, you'll create a simple Node.js application, build a custom image using a Dockerfile, and deploy it via Docker Compose.

## Scenario

Given the command:

```bash
docker run -d -p 3000:3000 node:18-alpine
```

- Create a simple Node.js app (`app.js`)
- Write a `Dockerfile` to build a custom image
- Use Docker Compose with the `build:` option instead of `image:`

## Steps

### Step 1: Create app.js

Create a file named `app.js` with the following content:

```javascript
const http = require("http");

http
  .createServer((req, res) => {
    res.end("Docker Compose Build Lab");
  })
  .listen(3000);
```

This creates a simple HTTP server that responds with "Docker Compose Build Lab" on port 3000.

### Step 2: Create Dockerfile

Create a `Dockerfile` with the following content:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY app.js .
EXPOSE 3000
CMD ["node", "app.js"]
```

This Dockerfile:

- Uses `node:18-alpine` as the base image
- Sets the working directory to `/app`
- Copies `app.js` into the container
- Exposes port 3000
- Runs the Node.js app

### Step 3: Create docker-compose.yml

Create a `docker-compose.yml` file with the following content:

```yaml
version: "3.8"
services:
  nodeapp:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: custom-node-app
    ports:
      - "3000:3000"
```

This Compose file defines a service `nodeapp` that builds the image from the local Dockerfile and maps port 3000.

## Student Task

### Build and Run

From the `Lab/Exp6C` directory, run:

```bash
docker compose up --build -d
```

This command builds the custom image and starts the container in detached mode.

### Verify

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the message "Docker Compose Build Lab".

### Modify and Rebuild

1. Edit `app.js` and change the response message (e.g., to "Updated Docker Compose Build Lab").
2. Rebuild and restart:

```bash
docker compose up --build -d
```

3. Refresh the browser to see the updated message.

## Difference Between `image:` and `build:`

- **`image:`**: Uses a pre-built image from a registry (e.g., Docker Hub). It's faster for deployment but doesn't allow customization of the image contents.
- **`build:`**: Builds a custom image from a Dockerfile in the specified context. It allows you to include your application code, dependencies, and configurations directly in the image, making it tailored to your needs. However, building takes time and requires the Dockerfile and source files.

## Screenshots

![Browser showing initial message](./images/Screenshot%202026-04-12%20at%2010.47.54 PM.png)
![Browser showing initial message](./images/Screenshot%202026-04-12%20at%2010.49.00 PM.png)

## Cleanup

To stop and remove the containers:

```bash
docker compose down
```

To also remove the built image:

```bash
docker rmi custom-node-app
```
