# DevOps, CI/CD & Infrastructure as Code (IaC)

## 1. The Deployment Pipeline
We follow **GitOps** principles. The Git repository is the source of truth for infrastructure and application code.

```mermaid
graph TD
    Dev[Developer] -- Pushes Code --> GitHub
    
    subgraph "CI Pipeline (GitHub Actions)"
        Lint[Lint & Type Check]
        Test[Unit & Integration Tests]
        Build_Container[Docker Build]
        Scan[Security Vulnerability Scan]
    end
    
    GitHub --> Lint
    Lint --> Test
    Test --> Build_Container
    Build_Container --> Scan
    
    Scan -- Pass --> Registry[Container Registry (ECR/GCR)]
    
    subgraph "CD Pipeline (ArgoCD)"
        Registry -- Trigger --> Argo[ArgoCD Controller]
        Argo -- Sync --> K8s[Kubernetes Cluster]
    end
```

## 2. Infrastructure as Code (IaC)
We use **Terraform** or **Pulumi** to provision resources. No "Step 1: Go to AWS Console".
*   **Modules**:
    *   `module "vpc"`: Network isolation.
    *   `module "rds"`: PostgreSQL Database with Multi-AZ failover.
    *   `module "k8s"`: EKS Cluster configuration.

## 3. Release Strategy
To ensure "Top Notch" reliability, we never deploy to everyone at once.

### 3.1. Environments
*   **Dev**: Deployed on every PR merge. Data is ephemeral.
*   **Staging**: Mirror of Prod with anonymized data. For QA sign-off.
*   **Production**: The live environment.

### 3.2. Blue/Green Deployment
*   We spin up the new version (Green) alongside the old (Blue).
*   Run smoke tests on Green.
*   Switch Traffic Load Balancer to Green.
*   If error rate spikes > 1%, auto-rollback to Blue instantly.

## 4. Observability & Monitoring
*   **Logs**: **ELK Stack** (Elasticsearch, Logstash, Kibana) or Datadog. structured JSON logs are mandatory.
*   **Metrics**: **Prometheus** + **Grafana**. Dashboards for "API Latency", "Error Rate", "CPU Usage".
*   **Tracing**: **OpenTelemetry**. Trace a request from Frontend -> Gateway -> Core -> AI Service -> DB. Essential for debugging slow requests.

## 5. Disaster Recovery (DR)
*   **RPO (Recovery Point Objective)**: 5 Minutes (Postgres WAL logs backed up to S3 every 5 mins).
*   **RTO (Recovery Time Objective)**: 1 Hour (Automated Terraform scripts to rebuild infra in a secondary region).
