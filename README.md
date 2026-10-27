# Packaging Consultants USA

Pixel-faithful Vite + React implementation based on the supplied header/hero and footer artwork.

## Local development

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a local `.env` file when the backend is hosted on another origin. During local development, Vite proxies `/api` to `http://127.0.0.1:5050`. All API requests are centralized through `src/context/ApiContext.jsx`.

The public header reads its desktop dropdowns and mobile submenus from the API. Administration is available without authentication for the current development phase:

- `/admin` — dashboard
- `/admin/settings` — top-navigation and dropdown-link editor

The admin workspace includes a persistent light/dark theme toggle. Packaging Services content from the supplied source document is available at `/packaging-services` and its ten service-detail routes.

## Production build

```bash
npm run build
```
