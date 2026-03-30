# ScaleIt 2.0 - Architecture & System Design

## 1. Executive Summary
This document outlines the architectural decisions, system design patterns, and technical standards for the **ScaleIt 2.0** flagship client project. Our primary goal is to deliver a high-performance, maintainable, and scalable platform that serves as a robust foundation for enterprise growth. The architecture follows a **Modular Feature-Based** approach, laying the groundwork for a transition to a strict **Ports & Adapters (Hexagonal)** architecture as business logic complexity increases.

## 2. Architecture Overview

### 2.1 Core Architectural Pattern: Modular Monolith
We have adopted a **Modular Monolith** architecture specifically organized by **Vertical Slices (Features)** rather than technical layers. This ensures that code related to a specific business domain (e.g., *Strategy*, *Team*, *Billing*) sits together, reducing cognitive load and coupling between unrelated parts of the system.

*   **Structure**: `src/features/{feature-name}`
*   **Composition**:
    *   `pages/`: Route-level entry points.
    *   `components/`: Feature-specific UI.
    *   `types.ts`: Domain models.
    *   `services/` (optional): Feature-specific logic.

**Rationale for Choice:**
*   **Option A: Layered Architecture (Controller/Service/DAO)**: Traditional but leads to "spaghetti code" where a single feature is scattered across 4-5 different folders.
*   **Option B: Microservices**: Too complex for the current stage; introduces high operational overhead and network latency.
*   **Option C (Selected): Modular Monolith**: Provides the isolation benefits of microservices (clear boundaries) with the simplicity of a single deployment unit. It allows for easy extraction of features into microservices in the future if scale demands it.

### 2.2 System Layer Design (Ports & Adapters)
To ensure long-term maintainability, the system is designed conceptually around the **Ports and Adapters** pattern:

1.  **The Core (Domain)**:
    *   Defined in `types.ts` and pure logic functions.
    *   *Role*: Contains the business rules (e.g., "A specific Role allows access to specific Tools").
    *   *Dependency*: Depends on nothing outside itself.

2.  **The Ports (Interfaces)**:
    *   Abstract definitions of what the application needs (e.g., `IAuthService`, `IDataProvider`).
    *   Currently represented by service signatures in the `services/` directory.

3.  **The Adapters (Infrastructure)**:
    *   **Primary Adapters (Driving)**: The React UI Components (`features/*/pages`). They "drive" the application by invoking core logic.
    *   **Secondary Adapters (Driven)**: The implementations of our services (e.g., `GeminiService` for AI, `mockAuth` for Authentication).

## 3. Tech Stack & Decisions

### 3.1 Frontend Framework
**Choice: React 19**
*   **Options Considered**: Angular (Too boilerplate), Vue (Less ecosystem for enterprise), React 18/19.
*   **Reasoning**: React 19 introduces high-performance transitions and server capabilities that prepare us for future SSR optimizations. Its component-based model aligns perfectly with our Modular Architecture.

### 3.2 Build Tool
**Choice: Vite**
*   **Options Considered**: Webpack (Legacy, slow), Parcel (Less config control).
*   **Reasoning**: Vite provides instant HMR (Hot Module Replacement) and optimized production builds. It is the industry standard for modern React development.

### 3.4 Styling Engine
**Choice: Tailwind CSS**
*   **Options Considered**:
    *   *CSS-in-JS (Styled Components)*: Powerful but adds runtime overhead.
    *   *BEM / SASS*: Good structure but tedious to maintain and results in large CSS bundles.
    *   *Tailwind CSS*: Selected for its proper utility-first approach, design token consistency (Colors/Spacing), and ability to rapidly build responsive "Premium" designs.
*   **Current Implementation**: Implemented via a Design System configuration (Colors: `#0C2340`, `#C89720`, Fonts: `Cinzel/Lato`) ensuring standardized aesthetics across the platform.

### 3.3 Languages
**Choice: TypeScript**
*   **Options Considered**: JavaScript (Too error-prone), ReasonML (Niche).
*   **Reasoning**: Mandatory for a "flagship" project. TypeScript provides compile-time safety, self-documenting code via Interfaces/Types, and safer refactoring capabilities.

## 4. Design Patterns Identified

### 4.1 Composite Pattern (UI)
The UI is built using the Composite pattern, where complex components (`BigPictureVisionPage`) are assembled from smaller, independent components (`SectionRow`, `MindMapCard`). This promotes reusability and isolated testing.

### 4.2 Strategy Pattern (Routing & Access)
The Application uses a Strategy pattern for Route definitions based on User Roles (`EC`, `SC`, `AM`, etc.). The `getRoutesForRole` function acts as a strategy selector, delivering a unique application structure dynamically based on the current user's context.

### 4.3 Observer Pattern (State)
React's state model (`useState`, `useEffect`) implements the Observer pattern, where the UI automatically reacts to changes in the underlying data model (e.g., updating the Mind Map when a user edits the Template view).

## 5. Codebase Analysis & Recommendations

### 5.1 Current State Analysis
*   **Strengths**:
    *   Clear separation of concerns via the `features/` directory.
    *   Consistent use of Domain Types (`types.ts`).
    *   High-quality UI implementation with attention to "Premium" micro-interactions (hover states, transitions).
*   **Areas for Evolution**:
    *   **Styling Pipeline**: Currently using a CDN-based Tailwind setup. This is excellent for prototyping but should eventually be migrated to a PostCSS build pipeline for production performance caching.
    *   **State Management**: Complex features like `StrategicVision` rely heavily on local component state. As features interact (e.g., Strategy goals appearing on the Dashboard), we should implement a global state store (Context API or Zustand) or Server State manager (React Query).
    *   **Data Persistence**: Data is currently mocked or local-only. The next phase needs to implement the "Secondary Adapters" to connect to a real backend or Firebase instance.

### 5.2 Recommended Improvements
1.  **Strict Service Layer**: Encapsulate all logical operations (calculations, validations) into pure functions within `services/` rather than keeping them inside `.tsx` components.
2.  **Shared UI Library**: Extract common UI patterns (Cards, Modals, Buttons) from specific features into the core `components/` folder to ensure absolute consistency.
3.  **Testing Strategy**: Implement Unit Tests (Vitest) for the logic in `features/strategy` before expanding further.

---
**Status**: Living Document
**Last Updated**: December 2025
**Target Audience**: Engineering Leadership, Product Stakeholders
