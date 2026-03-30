# Frontend Architecture & Micro-Frontends

## 1. The Strategy: "Composer Pattern"
We treat the frontend not as a single app, but as a composition of functional domains. While physically it may reside in a Monorepo, logically it is split into distinct "Micro-Frontends" or "Feature Modules".

## 2. Directory Structure (Monorepo)
We recommend **Nx** or **Turborepo** to enforce boundaries.
```text
/apps
  /shell-app         (The Host: Layout, Auth, Routing)
  /member-portal     (The Product for Clients)
  /mentor-dashboard  (The Tool for Coaches)
  /admin-console     (Internal PGN Tool)
/libs
  /ui-kit            (Dumb Components: Buttons, Cards)
  /auth-lib          (Login Logic, Interceptors)
  /api-client        (Generated Types & Hooks)
  /utils             (Date formatting, Validation)
```

## 3. Micro-Frontend Implementation

### 3.1. Module Federation (Webpack/Vite)
*   **Shell Application**: Loads the core layout (Sidebar, Topbar) and checks Authentication.
*   **Remote Modules**:
    *   `StrategyModule`: Lazy loaded when user navigates to `/strategy`. Exposes components like `<VisionBoard />`.
    *   `DirectoryModule`: Lazy loaded at `/directory`.
*   **Benefit**: Separate teams can deploy the "Member Portal" and "Mentor Dashboard" independently. BUGS in the admin console do not crash the client app.

## 4. State Management Strategy

### 4.1. Server State (The Truth)
*   **Library**: **TanStack Query (React Query)**.
*   **Pattern**: Custom hooks (`useRocks`, `useSessionLogs`) that handle caching, deduplication, and background refetching.
*   *Rule*: Never store API data in Redux/Context. Let React Query handle the "stale-while-revalidate" lifecycle.

### 4.2. Client UI State (Ephemera)
*   **Library**: **Zustand** (or React Context for simple cases).
*   **Use Cases**: Sidebar toggle state, Modal visibility, Multi-step Form wizard progress.
*   *Why?* Extremely lightweight, no boilerplate compared to Redux.

## 5. Performance Optimization
*   **Code Splitting**: Routes are lazy-loaded.
*   **Tree Shaking**: The Design System exports individual components, so importing `Button` doesn't bundle `DateRangePicker`.
*   **Optimistic Updates**: When a user checks a "Rock" as done, UI updates instantly (`blue check`), then syncs with server. If server fails, roll back and show error toast.

## 6. Testing Strategy
*   **Unit**: **Vitest** + **Testing Library**. Focus on util functions and isolated components.
*   **E2E**: **Playwright**. Critical user journeys: "Login -> Go to Strategy -> Edit Rock -> Save".
*   **Visual Regression**: **Storybook** + **Chromatic**. Ensures `PrimaryButton` doesn't accidentally turn pink.
