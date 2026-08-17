# Plan for Portal Norte em Foco Update

Updating the editorial structure, visual identity of articles, advertising spaces, and the administrative panel for better content management.

## User Improvements
### Visual Identity and Content Protection
- **Article Visuals**: Remove the black background from article pages (`/noticia/:slug`) and replace it with a clean white/light gray aesthetic.
- **Social Sharing**: Add Facebook, WhatsApp, and Telegram sharing buttons to article pages.
- **Category Cleanup**: Remove "Polícia" and "Eldorado do Carajás" from the menu; add "Brasil" and "Tech & Business".

### Advertising Layout (Home Page)
- **Top Banner**: Insert a 1500x230 banner between the header and the main featured news.
- **Middle Banner**: Insert a 2560x533 banner in the middle of the home page, ensuring it fits the responsive grid.
- **Right Sidebar**: Add a dedicated column for ads in 1:1 (Square) and 3:4 (Vertical) formats.

### Administrative Panel
- **Rich Editor**: Enhance the news content field with formatting options (text size, image insertion) to allow better article layouting.

## Technical Details
### Editorial Logic
- Update `MainHeader.tsx` category list.
- Adjust `fetchNews` and category-specific filters in `src/lib/news.ts` if necessary.

### UI Components
- Update `src/routes/noticia/$slug.tsx` styling: change `bg-brand-black` to `bg-white` and text colors accordingly.
- Create a new `ShareButtons` component for social interaction.
- Modify `src/routes/index.tsx` to implement the new grid structure (Main Content + Ad Sidebar).

### Admin Features
- Update `src/routes/admin/noticias/nova.tsx` and `src/routes/admin/noticias/$id/index.tsx` to use a more capable editor.
