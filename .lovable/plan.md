# Plan: News Portal Layout Reorganization

Reorganizing the Norte em Foco portal home page to follow a modern regional journalistic structure, improving editorial hierarchy and commercial integration.

## Proposed Changes

### 🎨 UI Architect
- **Header (`MainHeader.tsx` & `TopBar.tsx`)**:
  - Unify into a single sticky header with Dark Blue background.
  - Left: Menu & Search icons. Center: Logo. Right: Social media.
  - Create a clean sub-navigation bar for cities and categories.
- **Hero Section (`src/routes/index.tsx`)**:
  - Redesign to a 2-column layout (Left: Large Image; Right: Meta + Title + "Veja também" list).
- **News Cards (`NewsGrid.tsx` & `index.tsx`)**:
  - Standardize 4-column grid for secondary and thematic sections.
  - Add specific styling: rounded corners, colored accent lines, category tags.
- **Editorial Blocks**:
  - Implement a 3-column section (Região, Política, Brasil) with vertical accent bars and list items.
- **Special Dark Section**:
  - Create a high-impact section with Dark Blue background for "Polícia/Plantão" news.
- **Advertising**:
  - Insert large horizontal ad banners in 3 strategic positions with consistent spacing.
- **Footer (`Footer.tsx`)**:
  - Redesign with Dark Blue background, logo, institutional links, and business info.

### 🗄️ Supabase Engineer
- Ensure news fetching supports filtering by categories (Política, Polícia, Esportes) and cities (Parauapebas, etc.) as required by the new layout.

### 🔍 Code Auditor
- Verify responsivity transitions (4 columns -> 2 columns -> 1 column).
- Ensure semantic HTML and accessibility (aria-labels for new icons).

## Technical Details
- Using **OKLCH** colors for the Dark Blue (`oklch(0.2 0.05 250)`) and primary orange.
- **Framer Motion** for smooth transitions between layout states.
- **Tailwind Grid/Flex** for the complex multi-column layouts.
- Dynamic data mapping from existing `Post` type in `src/lib/news.ts`.
