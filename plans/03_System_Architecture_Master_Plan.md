# System Architecture Master Plan

## 1. Architectural Style: Hybrid Monolith-Microservices
We adopt a **Pragmactic Microservices** approach. We start with a modular monolith for the core (to move fast) but deploy specialized independent services for high-load or distinct logic (AI, Notifications).

```mermaid
graph TD
    User((User))
    CDN[Cloudfront CDN]
    LB[Load Balancer]
    
    subgraph "Frontend Layer"
        SPA[React SPA]
        MF_Member[Module: Member Portal]
        MF_Mentor[Module: Mentor Dashboard]
    end
    
    subgraph "API Gateway Layer"
        Gateway[API Gateway / Ingress]
        Auth[Auth Service (Identity Provider)]
    end
    
    subgraph "Backend Service Mesh"
        CoreAPI[Core Business API (NestJS)]
        AI_Svc[AI Orchestrator (Python/Node)]
        RPT_Svc[Reporting & Analytics Engine]
        Notif_Svc[Notification Service]
    end
    
    subgraph "Data Persistence"
        DB_Primary[(PostgreSQL - OLTP)]
        DB_Vector[(Vector DB - Pinecone)]
        Cache[(Redis)]
        ObjectStore[S3 - Documents/Media]
    end
    
    User --> CDN
    CDN --> SPA
    SPA --> LB
    LB --> Gateway
    
    Gateway --> Auth
    Gateway --> CoreAPI
    Gateway --> AI_Svc
    
    CoreAPI --> DB_Primary
    CoreAPI --> Cache
    CoreAPI --> Notif_Svc
    
    AI_Svc --> DB_Vector
    AI_Svc --> ObjectStore
    
    RPT_Svc --> DB_Primary
```

## 2. High-Level Stack Decisions

### 2.1. Frontend
*   **Framework**: React 19.
*   **Meta-Framework**: Vite (SPA mode) for Dashboard responsiveness.
*   **State**: React Query (Server State) + Context/Zustand (Global UI State).

### 2.2. Backend
*   **Language**: TypeScript (Node.js).
*   **Framework**: **NestJS**. Chosen for its strict module system, dependency injection, and enterprise readiness.
*   **Communication**: REST (JSON) standard. gRPC for internal service-to-service calls (e.g., Core API -> AI Service) for performance.

### 2.3. Infrastructure
*   **Containerization**: Docker & Kubernetes (K8s) for orchestration.
*   **Cloud Provider Agnostic**: Designed to run on AWS (EKS), Azure (AKS), or Google (GKE).

## 3. Key Architectural Patterns

### 3.1. Command Query Responsibility Segregation (CQRS)
*   *Implementation*: Separate Read/Write models for complex domains like "Strategy".
*   *Writes*: Go through rigorous validation in the Domain Model.
*   *Reads*: Optimised SQL queries or Read-Replicas for Dashboards.

### 3.2. Hexagonal Architecture (Ports & Adapters)
*   **Core Domain Logic** is isolated from infrastructure.
*   *Benefit*: We can swap the AI Provider (Gemini -> OpenAI) or Database (Postgres -> Aurora) without touching business rules.

### 3.3. Event-Driven Architecture
*   Use a Message Bus (RabbitMQ or Redis Streams) for async tasks.
*   *Example*: When a `Session` is marked `Completed` -> Emit `SessionCompletedEvent`.
    *   **Listener 1**: Trigger "Billing Service" to invoice.
    *   **Listener 2**: Trigger "AI Service" to generate summary.
    *   **Listener 3**: Trigger "Notification Service" to email the client.

## 4. Scalability & Performance Strategy
*   **Vertical Scaling**: Database optimization (Indexing).
*   **Horizontal Scaling**: Stateless Backend Services behind Load Balancer.
*   **Caching Strategy**: "Cache Aside" pattern for User Profile and Organization Config data in Redis.
