# Plan for Portal Norte em Foco Update

Updating the editorial structure, visual identity of articles, advertising spaces, and the administrative panel for better content management.

## User Improvements
### Visual Identity and Content Protection
- Remove black background from articles in the public area, replacing it with a light, cleaner background.
- Implement social sharing buttons (Facebook, WhatsApp, Telegram) in the article view.
- Update global categories: remove "Polícia" and "Eldorado do Carajás"; add "Brasil" and "Tech & Business".

### Advertising Layout
- **Homepage (Top)**: Banner between the header and featured news (1500x230).
- **Homepage (Middle)**: Banner (2560x533) that respects the sidebar grid.
- **Right Sidebar**: Dedicated column for 1:1 (Square) and 3:4 (Vertical) ads.

### Administrative Panel
- Upgrade the news editor to support rich text formatting (text size, image insertion, etc.).

## Technical Details
### Editorial Changes
- Update `MainHeader.tsx` and `src/lib/news.ts` constants to reflect new categories.
- Ensure the database or local mock data aligns with "Brasil" and "Tech & Business".

### Layout & UI
- Modify `src/routes/noticia/$slug.tsx` to use a light background and add the `ShareButtons` component.
- Adjust `src/routes/index.tsx` grid to include a persistent right column for ads.
- Update `AdBanner` component to support specific dimensions and locations.

### Admin Upgrade
- Integrate a rich text editor (like Tiptap or a simplified version using a better library if available, or enhance the current Textarea with formatting tools).
