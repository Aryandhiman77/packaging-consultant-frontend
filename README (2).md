# Packaging Consultants USA | React + Vite

See the combined **../README.md** for setup and verification. The original user-supplied header, home hero, project-review flow and Art Templates are preserved.

New admin routes:

- `/admin/content-pages` (CKEditor content page editing)
- `/admin/site-content` (selected home copy/quotes, contact copy, footer and footer link reorder)
- `/admin/contact-messages` (Contact Us submissions)

New public route `/contact-us`. The source Contact PDF was used as a layout/form reference, not served as an image. Form submissions go through MongoDB-backed Express API.
