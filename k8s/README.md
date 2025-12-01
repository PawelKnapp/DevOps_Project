# Kubernetes manifests for DevOps_Project

This folder contains minimal Deployments and Services for local Minikube:

- postgres: `Deployment` + `ClusterIP Service` on 5432
- backend: `Deployment` + `ClusterIP Service` on 8080 (image `devops-backend:latest`)
- frontend: `Deployment` + `NodePort Service` on 80 (nodePort 30080, image `devops-frontend:latest`)

The frontend's nginx proxies `/api/*` to the Service named `backend` on port 8080.
The backend connects to PostgreSQL via Service named `postgres` using the same credentials as docker-compose.

## Quickstart

1. Install Docker, kubectl and Minikube on your Ubuntu VM.

2. Start Minikube and point Docker to its daemon:
```bash
minikube start --driver=docker
minikube status
eval $(minikube -p minikube docker-env)
```

3. Build local images so Minikube can pull them:
```bash
# from repo root
docker build -t devops-frontend:latest ./frontend

docker build -t devops-backend:latest -f ./backend/DockerfileBuild ./backend
```

4. Apply manifests in order (DB → backend → frontend):
```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

5. Check resources:
```bash
kubectl get pods -o wide
kubectl get svc
```

6. Access the app:
```bash
# Option A: open in browser via minikube helper
minikube service frontend --url

# Option B: nodePort
minikube ip  # open http://<minikube-ip>:30080
```

7. Scale backend to 2 replicas:
```bash
kubectl scale deployment/backend --replicas=2
kubectl get pods -l app=backend
```

8. Cleanup:
```bash
kubectl delete -f k8s/frontend-service.yaml -f k8s/frontend-deployment.yaml \
  -f k8s/backend-service.yaml -f k8s/backend-deployment.yaml \
  -f k8s/postgres-service.yaml -f k8s/postgres-deployment.yaml
```
