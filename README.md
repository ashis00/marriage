# Aarav & Isha — Wedding Invitation

A fast, fully responsive, animated wedding-invitation website built with plain
HTML, CSS, and JavaScript. No build step, no dependencies — just open it.

## Run it

Open `index.html` in any browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

- Animated envelope intro (tap to open)
- Floating flower-petal animation on a lightweight canvas
- Live countdown timer to the wedding date
- Scroll-reveal animations (IntersectionObserver)
- "Our Story" timeline, event details, and gallery sections
- **Wishes Wall** — guests post wishes that scroll continuously across the page;
  an admin can log in to delete any wish
- RSVP form with floating labels, validation, and a heart-burst confirmation
- Sticky responsive navigation with a mobile menu
- Respects `prefers-reduced-motion` for accessibility

## Customise

| What | Where |
| --- | --- |
| Couple names | `index.html` (hero, footer, nav brand) |
| Wedding date | `index.html` hero text **and** `weddingDate` in `js/main.js` |
| Events / venues | `index.html` `#details` section |
| Story timeline | `index.html` `#story` section |
| Gallery photos | replace the `.gallery-item` tiles in `index.html` with `<img>` |
| Colours & fonts | CSS variables at the top of `css/styles.css` |

RSVP submissions are currently saved to the browser's `localStorage`. To collect
them for real, point the form `submit` handler in `js/main.js` at your backend or
a form service (e.g. Formspree, Google Forms, Netlify Forms).

## Wishes Wall & admin

Guests can post wishes that float continuously across the page. Wishes are stored
in the browser's `localStorage`, so by default they are **per-device** — a wish
posted on one phone won't show up on another. To share wishes across all visitors,
replace `loadWishes()` / `saveWishes()` in `js/main.js` with calls to a shared
backend or database (e.g. Firebase, Supabase, a tiny serverless function).

Click the small **Admin** link under the wishes to log in and delete wishes.

- Username / password live in `js/main.js` as `ADMIN_USER` / `ADMIN_PASS`.
- ⚠️ This login runs entirely in the browser, so the password is visible in the
  source. It only deters casual visitors. For real protection, validate the login
  on a server.
