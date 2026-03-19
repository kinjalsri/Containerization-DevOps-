# Kubernetes Basics (kubectl, k3d, Nodes, Pods)

## 🔹 What is kubectl?

`kubectl` is the command-line tool used to interact with a Kubernetes cluster.

- Kubernetes manages containers
- kubectl is how you control Kubernetes

### What you can do:

- Create applications
- Check status
- Scale apps
- Debug issues

---

## 🔹 What is k3d?

k3d is a tool that runs **K3s (lightweight Kubernetes)** inside Docker.

### Simple hierarchy:

```
k3d → runs K3s → which is Kubernetes
kubectl → controls it
```

### Why use k3d?

- Lightweight
- Fast
- Perfect for local development

---

## 🔹 Installation (using Homebrew)

### Install kubectl

```
brew install kubectl
```

### Install k3d

```
brew install k3d
```

---

## 🔹 How it Works

1. Create cluster:

```
k3d cluster create mycluster
```

2. k3d creates Docker containers (nodes)
3. Kubernetes runs inside them
4. kubectl connects to the cluster

---

## 🔹 What is a Node?

A **node** is a machine that runs your applications.

### It can be:

- Physical server
- Virtual machine
- Docker container (in k3d)

### Types of Nodes:

#### 1. Control Plane Node

- Brain of Kubernetes
- Handles scheduling and decisions

#### 2. Worker Node

- Runs your applications (pods)

### Command:

```
kubectl get nodes
```

---

## 🔹 What is a Pod?

A **pod** is the smallest unit in Kubernetes that runs your application.

### Key idea:

- A pod wraps one or more containers

### Example:

```
kubectl create deployment nginx --image=nginx
```

This creates:

- A pod
- Inside it → nginx container

### Command:

```
kubectl get pods
```

---

## 🔹 Node vs Pod

| Feature    | Node           | Pod              |
| ---------- | -------------- | ---------------- |
| What it is | Machine        | Running app unit |
| Level      | Infrastructure | Application      |
| Contains   | Pods           | Containers       |

---

## 🔹 How Nodes & Pods Work Together

```
kubectl create deployment nginx --image=nginx
```

Flow:

1. Kubernetes creates a pod
2. Scheduler picks a node
3. Node runs the pod

---

## 🔹 Basic kubectl Commands

### Check cluster

```
kubectl cluster-info
```

### Get nodes

```
kubectl get nodes
```

### Create deployment

```
kubectl create deployment nginx --image=nginx
```

### Get pods

```
kubectl get pods
```

### Expose service

```
kubectl expose deployment nginx --type=NodePort --port=80
```

### Get services

```
kubectl get svc
```

### Delete deployment

```
kubectl delete deployment nginx
```

---

## 🔹 Basic k3d Commands

### Create cluster

```
k3d cluster create mycluster
```

### List clusters

```
k3d cluster list
```

### Delete cluster

```
k3d cluster delete mycluster
```

---

## 🔹 Quick Mental Model

- Docker → runs containers
- Kubernetes → manages containers
- k3d → runs Kubernetes locally
- kubectl → controls Kubernetes

---

## 🔹 Visual Structure

```
Cluster
 ├── Node 1
 │    ├── Pod (nginx)
 │    ├── Pod (app)
 │
 ├── Node 2
      ├── Pod (redis)
```

---

## 🔹 Summary

- Node = where things run
- Pod = what runs
- kubectl = control tool
- k3d = local Kubernetes setup
