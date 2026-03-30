# Backend Microservices & API Gateway

## 1. Architecture Overview
The backend is a constellation of services sitting behind a unified Intelligent Gateway.

```mermaid
graph LR
    Client[Client Apps] --> Gateway[API Gateway (Kong/Traefik)]
    
    Gateway --> ServiceA[Auth Service (Identity)]
    Gateway --> ServiceB[Core Business Logic]
    Gateway --> ServiceC[AI Orchestrator]
    Gateway --> ServiceD[Notification/Messaging]
    
    ServiceB -.-> ServiceD
    ServiceC -.-> ServiceB
```

## 2. The API Gateway
**Role**: The Doorman.
*   **Technology**: **Kong** or **NestJS Gateway** (if pure Node stack).
*   **Responsibilities**:
    *   **Rate Limiting**: Prevent abuse (e.g., 100 req/min per user).
    *   **Authentication Validation**: Decodes JWT, checks expiry, injects `User-ID` header before passing to services.
    *   **Request Aggregation**: In GraphQL scenarios, stitches schemas from multiple services.

## 3. Microservice Breakdown

### 3.1. Core Service ("ScaleIt Engine")
*   **Tech**: NestJS + PostgreSQL.
*   **Domain**: User Profiles, Team Structure, Strategic Plans, Rocks, Meeting Data.
*   **Nature**: Monolithic in code (for ease of refactoring) but modular in design.

### 3.2. AI Orchestrator Service
*   **Tech**: Python (FastAPI) or Node.js (LangChain).
*   **Why Separate?** AI libraries (PyTorch, LangChain) evolve faster than core business logic. Separation allows independent scaling (GPU instances) and frequent deployments.
*   **Endpoints**: `/analyze-transcript`, `/suggest-mentor`.

### 3.3. Notification Service
*   **Tech**: Node.js + Redis Queue (BullMQ).
*   **Function**: Listens for events and sends Emails (SendGrid), SMS (Twilio), or Push Notifications.
*   **Reliability**: Must implement Retries and Dead Letter Queues (DLQ) so no alert is lost.

## 4. Service-to-Service Communication
*   **Synchronous (Blocking)**: REST or gRPC.
    *   *Usage*: Gateway -> Core Service (User needs data NOW).
*   **Asynchronous (Non-Blocking)**: Message Bus (RabbitMQ/Kafka).
    *   *Usage*: Core Service -> AI Service ("Here is a transcript, analyze it when ready").
    *   *Benefit*: The user interface doesn't hang while AI is thinking for 30 seconds.

## 5. API Design Guidelines
*   **RESTful maturity**: Level 2 (HTTP Verbs).
    *   `GET /teams/123/rocks` (List)
    *   `POST /teams/123/rocks` (Create)
    *   `PATCH /rocks/456` (Partial Update)
*   **Versioning**: `/api/v1/...` in URL. Breaking changes require `/api/v2`.
*   **Documentation**: **Swagger/OpenAPI**. Auto-generated from NestJS Decorators (`@ApiTags`, `@ApiResponse`).
