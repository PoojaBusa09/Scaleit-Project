# Design System & UI/UX Guidelines

## 1. Design Philosophy
**ScaleIt 2.0** embodies a "Premium Professional" aesthetic. It balances the gravitas of a high-end consultancy with the dynamism of a modern tech platform.

*   **Keywords**: Trust, Clarity, Momentum, Prestige.
*   **Visual Metaphor**: "The Captain's Quarters" – Dark navy, gold accents, clear instrumentation.

## 2. Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `Primary` | **#0C2340** | Navy Blue. Backgrounds for sidebars, headers, primary buttons. The "Anchor". |
| `Secondary` | **#C89720** | Gold/Amber. Call-to-actions (CTAs), highlights, "Wins". The "Spark". |
| `Surface` | **#FFFFFF** | Pure White. Cards, main content areas. |
| `Background` | **#FAFAFA** | Off-white/Light Grey. Global page background to reduce eye strain. |

### Semantic Colors
*   **Success**: `#178A3D` (Green) - Used for "On Track" KPIs.
*   **Warning**: `#E2A300` (Yellow) - Used for "At Risk".
*   **Error**: `#C53A32` (Red) - Used for "Off Track" or deletions.
*   **Info**: `#1669B5` (Blue) - Informational toasts.

## 3. Typography
We use a dual-font system to establish hierarchy.

### Headings: **Cinzel**
*   *Style*: Serif, Capitalized, Regal.
*   *Usage*: Page Titles (H1), Major Section Headers (H2).
*   *Why?* evokes a sense of tradition and solidity.

### Body & UI: **Lato**
*   *Style*: Sans-serif, Clean, Humanist.
*   *Usage*: Navigation, Body text, Buttons, Data Tables.
*   *Why?* Highly legible at small sizes, friendly but professional.

## 4. Component Library (UI Kit)

### Buttons
*   **Primary**: Navy background (#0C2340), White text, subtle hover lift.
*   **Secondary**: Gold background (#C89720), White/Navy text. Use for "Upgrade" or "New Win".
*   **Ghost/Outline**: Transparent background, Navy border. For secondary actions (Cancel).

### Cards
*   **Style**: White background, 1px border (#E3E1DE), rounded corners (8px/12px).
*   **Interaction**: Hover state lifts the card (`translateY(-4px)`) and increases shadow depth. This "Micro-interaction" makes the interface feel alive.

### Navigation
*   **Sidebar**: Dark theme (Navy). Active state indicated by Gold accent bar on the left or background tint.
*   **Breadcrumbs**: Lato font, grey text, current page in Navy.

## 5. Frontend Implementation Strategy
Currently, the project uses a mix of Tailwind classes and custom CSS.

**Recommended Standardization Path:**
1.  **Strict Tailwind Config**: Move all colors and fonts into `tailwind.config.js`.
2.  **Component Abstraction**: Create a `design-system` folder.
    *   `<Button variant="primary" />` (Wraps tailwind classes)
    *   `<Card />`
    *   `<PageHeader />`
3.  **Removal of Global CSS**: Minimize `index.css` to only standard resets and variable definitions. All component styling should be colocated (CSS Modules or Tailwind).

## 6. Accessibility (A11y)
*   **Contrast**: Navy on White is 16:1 (AAA). Gold on White needs checking (ensure dark enough Gold or use black text on Gold).
*   **Focus States**: All interactive elements must have a visible Golden Focus Ring (`outline: 2px solid #C89720`) for keyboard navigation.
