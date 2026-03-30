# Implementation Status & Build Roadmap

## 1. Current State Assessment
| Layer | Status | Completion | Notes |
|-------|--------|------------|-------|
| **Frontend UI** | 🟢 Good | 70% | Most pages (Dashboard, OrgChart, Strategy) are built as visual shells. |
| **Frontend Logic** | 🟡 Partial | 40% | Complex logic (OrgChart drag-drop) works, but state is local/mock. |
| **Backend API** | 🔴 Meaning | 5% | Only `mockDataService.ts` exists. No real server. |
| **Database** | 🔴 Missing | 0% | No persistence. Refreshing page resets data. |
| **AI Integration** | 🟠 Dangerous| 20% | Direct calls to Gemini from browser. Keys exposed if deployed. |

## 2. Gap Analysis
To reach "Top Notch" state, the following gaps must be closed:
1.  **Data Persistence**: Users need to save their "Quarterly Rocks" and come back 3 months later.
2.  **Security**: Move AI calls to server. Implement real Login/Auth.
3.  **Performance**: Large Org Charts will lag without server-side pagination.

## 3. Detailed Build Guide (Step-by-Step)
*For a Tech-Savvy Developer to complete the project.*

### Phase 1: Backend Foundation (Weeks 1-2)
1.  **Initialize NestJS Monorepo**:
    ```bash
    npm i -g @nestjs/cli
    nest new backend
    ```
2.  **Docker Setup**:
    *   Create `docker-compose.yml` for PostgreSQL (`postgres:16`) and Redis.
3.  **Database Migration**:
    *   Use **Prisma** or **TypeORM**.
    *   Replicate the schema from `03-Database.md`.
    *   Run `npx prisma db push`.
4.  **Auth Module**:
    *   Implement Passport-JWT strategy.
    *   Create `/auth/login` and `/auth/register` endpoints.

### Phase 2: Core Feature Migration (Weeks 3-5)
1.  **DTO Creation**: Copy interfaces from frontend `types.ts` to backend DTOs (Data Transfer Objects) with validation decorators (`class-validator`).
2.  **Service Implementation**:
    *   **StrategyService**: CRUD for goals/rocks.
    *   **TeamService**: Logic for Org hierarchy.
3.  **API Gateway**: Expose REST endpoints (e.g., `GET /api/v1/strategy/rocks`).

### Phase 3: AI Service Hardening (Week 6)
1.  **Backend Proxy**: Move `geminiService.ts` logic to NestJS `AiModule`.
2.  **Swappable Adapter**: Implement the `IAIService` interface (see Architecture doc).
3.  **Prompt Engineering**: Move prompts from code to a database configuration or config files to allow tweaking without redeploying.

### Phase 4: Frontend Refactor (Weeks 7-8)
1.  **API Client**: Generate a typed API client (using **OpenAPI Generator** from NestJS Swagger json).
2.  **Replace Mocks**:
    *   Find all `mockDataService.get...` calls.
    *   Replace with `api.strategy.getRocks()`.
    *   Wrap in **React Query** (`useQuery`) for caching and loading states.
3.  **Environment Config**: update `.env` to point `VITE_API_URL` to local/prod backend.

## 4. Deployment Strategy
*   **Infrastructure**: AWS or Vercel (Frontend) + Render/Railway (Backend).
*   **CI/CD**: GitHub Actions pipeline to run `npm test` and `npm run build` on push.
