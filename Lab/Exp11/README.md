# Experiment 11: Orchestration using Docker Compose & Docker Swarm

## Overview

This lab continues from Experiment 6 and introduces container orchestration using Docker Swarm. It explains how Docker Compose can be reused as a stack definition, then deployed and managed by Swarm for scaling, self-healing, and load balancing.

## Part A – Concept Continuation

From Experiment 6, you already know:

- `docker run`: Runs a single container.
  - Limitation: manual operation, no coordination.
- Docker Compose: Runs multiple containers together.
  - Limitation: single host, no automatic healing or built-in load balancing.
- New concept: **Orchestration** = automatic management of containers.

Think of orchestration like a restaurant manager:

- decides how many workers are needed (scaling)
- replaces a sick worker immediately (self-healing)
- distributes customers evenly (load balancing)

### What orchestration adds

| Feature        | What it means                                      |
| -------------- | -------------------------------------------------- |
| Scaling        | Increase or decrease the number of containers      |
| Self-healing   | Restart or replace failed containers automatically |
| Load balancing | Distribute traffic across containers               |
| Multi-host     | Run containers across multiple machines            |

## Part B – Practical (Extension of Experiment 6)

This lab extends the WordPress + MySQL example from Experiment 6, deploying it as a Swarm stack instead of a Compose application.

### Prerequisites

- Docker installed
- Swarm mode enabled on the Docker daemon
- A Compose file from Experiment 6 for WordPress + MySQL

### Example Compose file from Experiment 6

```yaml
version: "3.9"

services:
  db:
    image: mysql:5.7
    container_name: wordpress_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppass
    volumes:
      - db_data:/var/lib/mysql

  wordpress:
    image: wordpress:latest
    container_name: wordpress_app
    depends_on:
      - db
    ports:
      - "8080:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppass
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html

volumes:
  db_data:
  wp_data:
```

## Task 1: Check Current State (No Swarm)

Before starting Swarm, ensure no existing Experiment 6 containers are running.

```bash
docker compose down -v

docker ps
```

Expected: empty list or only unrelated containers.

## Task 2: Initialize Docker Swarm

Enable Swarm mode on the local machine.

```bash
docker swarm init
```

What this does:

- enables Swarm mode on Docker
- makes the current node a manager
- creates a worker join token for multi-node clusters

Verify Swarm is active:

```bash
docker node ls
```

Expected output includes your node with `Ready`, `Active`, and `Leader` status.

## Task 3: Deploy as a Stack (Not Just Compose)

Deploy the same Compose file as a Swarm stack.

```bash
docker stack deploy -c docker-compose.yml wpstack
```

What happens:

- Swarm reads the Compose file
- creates services instead of individual containers
- services manage container lifecycle automatically

Expected output:

- `Creating network wpstack_default`
- `Creating service wpstack_db`
- `Creating service wpstack_wordpress`

## Task 4: Verify the Deployment

List all services:

```bash
docker service ls
```

Expected output should show:

- `wpstack_db` with `1/1`
- `wpstack_wordpress` with `1/1`

Inspect the service tasks:

```bash
docker service ps wpstack_wordpress
```

View running containers:

```bash
docker ps
```

You should see container names like `wpstack_wordpress.1.<id>` and `wpstack_db.1.<id>`.

## Task 5: Access WordPress

Open a browser and visit:

```text
http://localhost:8080
```

The WordPress setup screen should appear, showing that Swarm is managing the same application stack.

## Task 6: Scale the Application (Swarm's Superpower)

Scale the WordPress service from 1 to 3 replicas.

```bash
docker service scale wpstack_wordpress=3
```

Verify scaling:

```bash
docker service ls
```

The `REPLICAS` column should show `3/3` for `wpstack_wordpress`.

Inspect the tasks:

```bash
docker service ps wpstack_wordpress
```

Check containers:

```bash
docker ps | grep wordpress
```

You should see three WordPress containers running.

## What Just Happened?

| Before Scaling        | After Scaling          |
| --------------------- | ---------------------- |
| 1 WordPress container | 3 WordPress containers |
| No load distribution  | Swarm balances traffic |
| Manual scaling        | One-command scaling    |

### How can 3 containers share port 8080?

Swarm uses an internal load balancer:

- the load balancer listens on port `8080`
- traffic is distributed to all WordPress replicas
- you still access the app via `http://localhost:8080`

## Task 7: Test Self-Healing (Automatic Recovery)

Self-healing means Swarm replaces failed containers automatically.

1. Find a WordPress container:

```bash
docker ps | grep wordpress
```

2. Kill one container:

```bash
docker kill <container-id>
```

3. Watch Swarm recover:

```bash
docker service ps wpstack_wordpress
```

The killed container should show `Shutdown` or `Failed`, while Swarm starts a replacement.

4. Confirm three WordPress containers remain:

```bash
docker ps | grep wordpress
```

## Task 8: Remove the Stack

Clean up the Swarm deployment:

```bash
docker stack rm wpstack
```

Verify cleanup:

```bash
docker service ls
docker ps
```

Note: volumes remain unless removed manually with `docker volume prune`.

## Part C – Analysis (Compose vs Swarm)

| Feature           | Docker Compose                    | Docker Swarm                      |
| ----------------- | --------------------------------- | --------------------------------- |
| Scope             | Single host only                  | Multi-node cluster                |
| Scaling           | `--scale` (basic, no internal LB) | `docker service scale` (built-in) |
| Load balancing    | No                                | Yes                               |
| Self-healing      | No                                | Yes                               |
| Rolling updates   | No                                | Yes                               |
| Service discovery | Container names                   | DNS + VIP                         |
| Use case          | Development, testing              | Simple production clusters        |

### When to use what

- Development → Compose
- Testing → Compose
- Small production → Swarm
- Large production → Kubernetes

## Part D – Important Observations for Students

- **Compose File Reuse**: The same YAML file can work for both Compose and Swarm.
  - `docker compose up -d` → Compose mode
  - `docker stack deploy -c docker-compose.yml wpstack` → Swarm mode
- **Containers vs Services**:
  - Container = single running instance
  - Service = desired state definition
  - In Swarm, you manage services, not individual containers.
- **Port handling**:
  - Compose cannot scale multiple services using the same published port on one host.
  - Swarm solves this with an internal load balancer.

## Part E – Learning Outcome Check

Answer these questions in your lab book:

1. Why is Compose not enough for production?
2. What does `docker stack deploy` do differently than `docker compose up`?
3. How does Swarm achieve self-healing?
4. What happens if you run `docker kill` on a container managed by Swarm?
5. Can you use the same Compose file for both development and production? Why?

## Part F – Optional: Multi-Node Swarm (Advanced)

If multiple machines are available, Swarm can span nodes.

1. On the manager node, get the worker join token:
   ```bash
   docker swarm join-token worker
   ```
2. On a worker node, join the cluster:
   ```bash
   docker swarm join --token <token> <manager-ip>:2377
   ```
3. Verify from the manager:
   ```bash
   docker node ls
   ```

Now the stack can distribute containers across machines automatically.

## Summary

You started with:

- `docker run`: single container
- Docker Compose: multi-container application on one host

Now you can:

- deploy a stack with Docker Swarm
- scale services with one command
- rely on automated recovery and load balancing

**Final takeaway**: Compose defines the application, while Swarm runs it reliably.

## Quick Reference Card

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml <stack-name>

# List services
docker service ls

# Scale service
docker service scale <stack-name>_<service-name>=<replicas>

# See service tasks
docker service ps <service-name>

# Remove stack
docker stack rm <stack-name>

# Leave Swarm (if needed)
docker swarm leave --force
```

## Screenshots

Use the images in the `photos/` folder to document the lab steps
