# Design System & UI/UX Guidelines

## 1. Design Philosophy: "The Captain's Quarters"
The UI should feel **Premium, Authoritative, and Clear**. We avoid "Start-up Cute" in favor of "Executive Professional".
*   **Key Emotions**: Trust, Clarity, Focus, Momentum.
*   **Visual Metaphor**: Deep Navy backgrounds (Depth), Gold accents (Value/Wins), crisp White data surfaces (Clarity).

## 2. Design Tokens & Color Palette

### 2.1. Brand Colors
| Token Name | Hex Value | Function |
| :--- | :--- | :--- |
| `primary.navy` | `#0C2340` | **The Anchor**. Main navigation, headers, primary buttons. |
| `secondary.gold` | `#C89720` | **The Spark**. CTAs, active states, focus rings, "Win" indicators. |
| `neutral.white` | `#FFFFFF` | Card backgrounds, text on dark. |
| `neutral.bg` | `#FAFAFA` | Global background. Softens the contrast vs pure white. |
| `status.success` | `#178A3D` | "On Track", Growth, Revenue Up. |
| `status.warning` | `#E2A300` | "At Risk", Caution. |
| `status.error` | `#C53A32` | "Off Track", Critical Failure, Delete. |

### 2.2. Typography System
*   **Primary Font (Headings)**: `Cinzel` (Slab Serif)
    *   *Usage*: Page Titles, Executive Summaries.
    *   *Weight*: 700 (Bold) for H1, 500 (Medium) for H2.
*   **Secondary Font (UI/Body)**: `Lato` (Sans-Serif)
    *   *Usage*: Navigation, Data Tables, Form Inputs, Paragraphs.
    *   *Weight*: 400 (Regular), 700 (Bold) for Labels.

## 3. UI Component Library (Guidelines)

### 3.1. Buttons
*   **Primary Action**: Solid Navy (`#0C2340`) with White Text. `border-radius: 8px`.
*   **Growth Action**: Solid Gold (`#C89720`) with Navy Text. Used for "Add New", "Upgrade", "Celebration".
*   **Ghost**: Transparent with Navy Border. For "Cancel" or Secondary actions.

### 3.2. Cards ("The Tile System")
*   All operational data lives in **Tiles** (Cards).
*   **Stats Tile**: Number Prominent (Lato Bold), Label Small (Lato Regular), Trend Indicator.
*   **Interaction**: Hovering a tile lifts it (`translateY(-4px)`) and deepens the shadow (`box-shadow: lg`).

### 3.3. Navigation
*   **Sidebar**: Dark Mode (Navy Background). Active Item gets a vertical Gold bar on the left.
*   **Top Bar**: Minimalist White. Breadcrumbs for context. User Profile dropdown.

## 4. UX Patterns & Micro-interactions
*   **Loading States**: Do NOT use spinners for full pages. Use **Skeleton Screens** that shimmer (`bg-gray-200` to `bg-gray-300` pulse) to denote structure.
*   **Transitions**: All hover states must strictly use `transition-all duration-200 ease-in-out`. No instant snaps.
*   **Feedback**:
    *   Success: Toast notification slide-in from top-right (Green).
    *   Error: Inline validation message (Red text) + shake animation on field.

## 5. Accessibility (A11y) Standards
*   **Contrast**: Navy on White is AAA compliant. Gold text on White is NOT compliant; use Gold for graphical elements/buttons (with dark text) only.
*   **Focus Management**: All interactive elements must show a visible `outline: 2px solid #C89720` on keyboard focus.
