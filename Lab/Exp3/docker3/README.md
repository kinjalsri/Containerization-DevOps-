# 🚀 Deploying NGINX Using Different Base Images & Comparing Image Layers

This project demonstrates how to deploy **NGINX** containers using different base images and analyze how image size and layers differ between them.

We use Docker to run NGINX and inspect the image history to understand how lightweight images improve performance and efficiency.

---

## 📌 Objective

- Deploy NGINX using different base images
- Compare Docker image layers
- Understand how base images affect image size and build complexity

---

## 🐳 Images Used

| Image Name     | Base OS      | Purpose                               |
| -------------- | ------------ | ------------------------------------- |
| `nginx`        | Debian-based | Official default NGINX image          |
| `nginx-ubuntu` | Ubuntu       | Custom-built NGINX image using Ubuntu |
| `nginx-alpine` | Alpine Linux | Lightweight NGINX image               |

---

## Running NGINX Containers

### Run Default NGINX

```bash
docker pull nginx:latest

docker run -d --name nginx-default -p 8080:80 nginx
```

![images for exp 3](./images/img1.png)
![images for exp 3](./images/img2.png)

### Run NGINX Built on Ubuntu

```bash
docker run -d --name nginx-ubuntu -p 8082:80 nginx-ubuntu
```

![images for exp 3](./images/img3.png)
![images for exp 3](./images/img4.png)

### Run NGINX Alpine Version

```bash

docker run -d \
  --name nginx-alpine \
  -p 8087:80 \
  -v $(pwd)/html:/usr/share/nginx/html \
  nginx:alpine

```

![images for exp 3](./images/img5.png)

### Comparing Image Layers

To inspect how each image is built, we use:

```bash

docker history nginx
docker history nginx-ubuntu
docker history nginx:alpine

```

#### This command shows:

Number of layers
Size of each layer
Commands used to build each layer

![images for exp 3](./images/img6.png)

### Observations

| Image          | Size       | Layers       | Notes                                |
| -------------- | ---------- | ------------ | ------------------------------------ |
| `nginx`        | Larger     | More layers  | Includes full Debian OS              |
| `nginx-ubuntu` | Very Large | Many layers  | Ubuntu base adds extra packages      |
| `nginx:alpine` | Smallest   | Fewer layers | Minimal OS, optimized for containers |
