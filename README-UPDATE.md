a# Packaging Consultants USA | Admin CMS Update v3

## Changes
- Home & Footer now has **Home Copy & Quotes** and **Footer** only; no Contact tab. Normal form inputs and textareas (not CKEditor).
- Contact page text can still be managed separately at `/admin/contact-copy`.
- Footer link manager uses smooth FLIP reorder animation, like Navigation & Dropdowns, including drag handle, arrow buttons, and reduced-motion support.
- Navigation editor remains **unchanged** at `/admin/settings`.
- Content CMS at `/admin/cms` now has a title/URL search and only shows pre-existing, routed content pages. No Add Page button or upsert endpoint.
- Blog management is independent at `/admin/blogs`; add/edit/publish/delete through a modal with CKEditor and meta title/description.
- Published blog listing `/blog` and article `/blog/:slug`; drafts are hidden from the public API.
- CKEditor in CMS and Blog supports text color and background color; backend allows safe color styles while sanitizing HTML.
- Scoped light and lighter dark themes across admin pages, including login. Selection stored in `localStorage`.
- Home hero, Project Review, Art Templates, site header, and navigation CMS source remain unchanged.

## Install (copy only contents from replacement ZIP)

1. Backup source code and MongoDB; commit pending code changes.
2. Copy the **frontend/** and **backend/** directories of the replacement ZIP into your matching existing project directories, keeping your `.env`, uploads, DB, and other files.
3. Run `npm install` in frontend and backend. No new npm dependencies were added in this update.
4. Restart Express API and Vite/production frontend; rebuild frontend with `npm run build`.
5. Verify `/admin/settings`, `/admin/cms`, `/admin/blogs`, `/admin/site-content`, `/admin/contact-copy`, `/blog`, and `/contact-us`.

## End-to-end blog test (requires running API + MongoDB)

```sh
cd backend
RUN_INTEGRATION_TESTS=1 API_BASE=http://localhost:5050 ADMIN_EMAIL='your-admin-email' ADMIN_PASSWORD='your-admin-password' node scripts/verifyBlogs.mjs
```

**Security:** Keep `/api/admin/*` protected by your existing JWT authentication. Admin blog endpoints use `requireAdmin` through `app.js`. The image upload endpoint retains the original single-file and 10 MB checks.

**CKEditor licensing:** Existing GPL config requires GPL compliance; if you operate a closed-source commercial app, use a suitable commercial CKEditor license key.

## Verification limits

JavaScript/JSX static parse and package integrity can be verified here. aLive MongoDB writes and the browser build need npm dependencies, an active database and running app; they were not available during this packaging task. Dynamic React SEO metadata is added on the blog detail page. If you need full social crawler support, add SSR/prerendering in your deployment.
