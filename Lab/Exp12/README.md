# Experiment 12: Study and Analyse Container Orchestration using Kubernetes

## Overview

This experiment introduces Kubernetes as the next step in container orchestration after Docker Compose and Docker Swarm. It covers the basic concepts of Kubernetes, a hands-on lab using a local cluster tool, and practical tasks to deploy, scale, and verify a WordPress workload.

## Why Kubernetes over Docker Swarm?

Kubernetes is often preferred for production container orchestration because it offers:

- **Industry standard**: Most companies use Kubernetes in production.
- **Powerful scheduling**: Automatically decides where to run applications.
- **Large ecosystem**: Extensive tooling for monitoring, logging, and security.
- **Cloud-native support**: Works across AWS, Google Cloud, Azure, and on-premises environments.

## Core Kubernetes Concepts

| Docker Concept  | Kubernetes Equivalent | What it means                                                                          |
| --------------- | --------------------- | -------------------------------------------------------------------------------------- |
| Container       | Pod                   | A pod is the smallest deployable unit and can contain one or more containers.          |
| Compose service | Deployment            | A Deployment describes how the app should run, including replicas and rolling updates. |
| Load balancing  | Service               | A Service exposes pods and provides stable access and routing.                         |
| Scaling         | ReplicaSet            | Ensures the desired number of pod copies is always running.                            |

## Hands-On Lab (Using k3d or Minikube)

This lab assumes you already have `kubectl` and a local Kubernetes cluster available via `k3d` or `minikube`. If not, ask your instructor before continuing.

## Task 1: Create a Deployment

A Deployment tells Kubernetes:

- which container image to use
- how many replicas to run
- how to label and identify pods

Create `wordpress-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
spec:
  replicas: 2
  selector:
    matchLabels:
      app: wordpress
  template:
    metadata:
      labels:
        app: wordpress
    spec:
      containers:
        - name: wordpress
          image: wordpress:latest
          ports:
            - containerPort: 80
```

Apply the deployment:

```bash
kubectl apply -f wordpress-deployment.yaml
```

Kubernetes will create 2 pods running WordPress.

## Task 2: Expose the Deployment as a Service

A Service gives pods a stable network endpoint and makes them reachable from outside the cluster.

Create `wordpress-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: wordpress-service
spec:
  type: NodePort
  selector:
    app: wordpress
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30007
```

Apply the service:

```bash
kubectl apply -f wordpress-service.yaml
```

## Task 3: Verify Everything

Check pods:

```bash
kubectl get pods
```

Expected output:

```
NAME                         READY   STATUS    RESTARTS   AGE
wordpress-xxxxx-yyyyy        1/1     Running   0          1m
wordpress-xxxxx-zzzzz        1/1     Running   0          1m
```

Check services:

```bash
kubectl get svc
```

Expected output:

```
NAME                 TYPE       CLUSTER-IP     PORT(S)        AGE
wordpress-service    NodePort   10.43.x.x      80:30007/TCP   1m
```

Access WordPress in your browser:

```text
http://<node-ip>:30007
```

- For Minikube: `minikube ip`
- For k3d: usually `localhost`

## Task 4: Scale the Deployment

Scale the number of WordPress pods from 2 to 4:

```bash
kubectl scale deployment wordpress --replicas=4
```

Verify:

```bash
kubectl get pods
```

You should now see 4 running pods.

## Task 5: Self-Healing Demonstration

Kubernetes automatically recreates failed pods to maintain the desired state.

Delete one pod manually:

```bash
kubectl get pods
kubectl delete pod <pod-name>
```

Then verify:

```bash
kubectl get pods
```

You should still see 4 running pods because the Deployment recreates the deleted pod.

## Part C – Swarm vs Kubernetes

| Feature      | Docker Swarm | Kubernetes                       |
| ------------ | ------------ | -------------------------------- |
| Setup        | Very easy    | More complex                     |
| Scaling      | Basic        | Advanced (autoscaling available) |
| Ecosystem    | Small        | Huge                             |
| Industry use | Rare         | Standard                         |

**Conclusion:** Kubernetes is the industry-standard orchestration platform for larger deployments and cloud-native workloads.

## Part D – Advanced Lab: Real Cluster with kubeadm

A production-style cluster can be built using `kubeadm`.

### Lab requirements

- 2 or 3 virtual machines
- Ubuntu 22.04 or 24.04
- Each VM: 2+ CPU, 2+ GB RAM

### High-level kubeadm steps

1. Install kubeadm, kubelet, kubectl on all nodes.
2. Initialize the control plane on the master node:
   ```bash
   sudo kubeadm init
   ```
3. Configure kubectl for your user:
   ```bash
   mkdir -p $HOME/.kube
   sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
   sudo chown $(id -u):$(id -g) $HOME/.kube/config
   ```
4. Install a network plugin, for example Calico:
   ```bash
   kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
   ```
5. Join worker nodes using the provided `kubeadm join ...` command.
6. Verify the cluster:
   ```bash
   kubectl get nodes
   ```

## Teaching Insight: When to Use Which Tool

| Tool     | Best for                            |
| -------- | ----------------------------------- |
| k3d      | Quick local learning on your laptop |
| Minikube | Single-node cluster testing         |
| kubeadm  | Real production-style cluster       |

## Summary of Commands (Cheat Sheet)

| Goal               | Command                                        |
| ------------------ | ---------------------------------------------- |
| Apply a YAML file  | `kubectl apply -f file.yaml`                   |
| See pods           | `kubectl get pods`                             |
| See services       | `kubectl get svc`                              |
| Scale a deployment | `kubectl scale deployment <name> --replicas=N` |
| Delete a pod       | `kubectl delete pod <pod-name>`                |
| See nodes          | `kubectl get nodes`                            |

## End of Experiment

By completing this lab, you should now:

- understand why Kubernetes is used over basic orchestration tools
- know the core Kubernetes primitives: Pod, Deployment, Service, ReplicaSet
- deploy and expose an application using Kubernetes
- scale pods and observe self-healing behavior
- know the basics of a real cluster setup with `kubeadm`

## Screenshots

Use the images in the `images/` folder to document your progress:

- ![Sample Java App Issues](./images/Screenshot%202026-03-19%20at%2010.53.06 AM.png)
- ![Sample Java App Issues](./images/Screenshot%202026-03-19%20at%2010.53.18 AM.png)
- ![Sample Java App Issues](./images/Screenshot%202026-03-19%20at%2010.53.21 AM.png)
- ![Sample Java App Issues](./images/Screenshot%202026-03-19%20at%2010.53.27 AM.png)
- ![Sample Java App Issues](./images/Screenshot%202026-03-19%20at%2010.53.30 AM.png)

## Notes

- Use `minikube ip` to find the cluster IP for Minikube.
- For k3d, NodePort services are usually available on `localhost`.
- If you need a real cluster, `kubeadm` is the next step after local experimentation.
