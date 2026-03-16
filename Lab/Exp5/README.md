# Experiment 5: Docker – Volumes, Environment Variables, Monitoring & Networks

## Objective

The objective of this experiment is to understand advanced Docker concepts such as data persistence using volumes, configuration using environment variables, monitoring container performance, and enabling communication between containers through Docker networks.

---

# Technologies Used

- Docker
- Ubuntu Docker Image
- Docker Volumes
- Environment Variables
- Docker Networking
- Docker Monitoring Tools
- Terminal / CLI

---

# Part 1: Docker Volumes – Persistent Data Storage

## Problem: Container Data is Ephemeral

By default, data stored inside a Docker container is temporary. When a container is removed, all its data is lost.

---

## Step 1: Create a Container Without Volume

Run a container:

```bash
docker run -it --name test-container ubuntu /bin/bash
```

Inside the container, create a file:

```bash
echo "Hello World" > /data/message.txt
cat /data/message.txt
```

Output:

```
Hello World
```

Exit the container:

```bash
exit
```

Restart the container and check the file:

```bash
docker start test-container
docker exec test-container cat /data/message.txt
```

Result:

```
File does not exist
```

This shows that container data is not persistent.

---

# Solution: Docker Volumes

Docker volumes allow data to persist even after containers are stopped or removed.

---

## Step 2: Create a Docker Volume

```bash
docker volume create my-volume
```

List volumes:

```bash
docker volume ls
```

---

## Step 3: Run Container with Volume

```bash
docker run -it -v my-volume:/data --name volume-container ubuntu /bin/bash
```

Inside container:

```bash
echo "Persistent Data" > /data/message.txt
cat /data/message.txt
exit
```

Restart container:

```bash
docker start volume-container
docker exec volume-container cat /data/message.txt
```

Output:

```
Persistent Data
```

This confirms that Docker volumes preserve data.

---

# Part 2: Environment Variables in Docker

Environment variables allow configuration of applications without modifying code.

---

## Run Container with Environment Variable

```bash
docker run -e APP_ENV=development ubuntu env
```

Output will include:

```
APP_ENV=development
```

---

## Example: Multiple Environment Variables

```bash
docker run -e DB_HOST=localhost -e DB_PORT=5432 ubuntu env
```

Environment variables are commonly used for:

- Database configuration
- API keys
- Application settings
- Runtime configuration

---

# Part 3: Monitoring Docker Containers

Docker provides built-in commands to monitor container resource usage.

---

## View Running Containers

```bash
docker ps
```

---

## Monitor Container Resource Usage

```bash
docker stats
```

This displays:

- CPU usage
- Memory usage
- Network usage
- Disk I/O

---

# Part 4: Docker Networking

Docker networks allow containers to communicate with each other.

---

## Step 1: Create a Network

```bash
docker network create my-network
```

List networks:

```bash
docker network ls
```

---

## Step 2: Run Containers on the Network

Container 1:

```bash
docker run -dit --name container1 --network my-network ubuntu
```

Container 2:

```bash
docker run -dit --name container2 --network my-network ubuntu
```

---

## Step 3: Test Communication

Access container1:

```bash
docker exec -it container1 bash
```

Ping container2:

```bash
ping container2
```

Successful ping confirms that containers can communicate through the Docker network.

---

# Useful Docker Commands

| Command               | Description              |
| --------------------- | ------------------------ |
| docker volume create  | Create a volume          |
| docker volume ls      | List volumes             |
| docker network create | Create network           |
| docker network ls     | List networks            |
| docker stats          | Monitor containers       |
| docker exec           | Run command in container |

---

# Key Concepts Learned

- Understanding ephemeral container storage
- Creating and using Docker volumes for persistent storage
- Using environment variables for configuration
- Monitoring container resource usage
- Enabling communication between containers using Docker networks

---
