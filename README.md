# Mobi Mobile

A bold, adventurous travel and exploration website built with static HTML, CSS and vanilla JavaScript.

Developer: **Raj Gautam**

---

## Overview

Mobi Mobile is a frontend-only website that helps users discover trails, browse a community gallery, read and submit reviews, and create a mock account. There is no backend: user sessions and reviews are stored in the browser's `localStorage`, and images are served from the local `images/` folder.

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, Flexbox, Grid, keyframe animations
- **Vanilla JavaScript** — DOM injection, `localStorage`, `IntersectionObserver`
- **Fonts** — Anton (headings) and Inter (body) via Google Fonts
- **Images** — local PNG assets, with an optional WebP optimization script

## Design System

| Token | Value |
| --- | --- |
| Background | `#FFFFFF` |
| Text | `#000000` |
| Accent | `#FF6B35` |
| Muted | `#6B7280` |
| Border | `#E5E7EB` |
| Card background | `#F9FAFB` |

- Headings use **Anton**, uppercase.
- Body text uses **Inter**.
- Buttons are pill-shaped, orange, and scale on hover.
- Images use `object-fit: cover` and rounded corners.

## Project Structure

```text
mobi-mobile/
├── index.html            Home page (hero, marquee, explore, stats)
├── 404.html              Custom error page
├── README.md
├── optimize_images.py    Converts images to compressed WebP
├── .nojekyll             Required for GitHub Pages
│
├── css/
│   └── style.css         Global design system and components
│
├── js/
│   ├── main.js           Navbar/footer injection, path detection, mobile menu
│   ├── auth.js           Mock register/login/logout
│   └── app.js            Counters, trail search, reviews, scroll reveal
│
├── images/
│   ├── logo.png
│   ├── hero.png
│   ├── hero1.png ... hero4.png
│   └── pasted.png, pasted-1.png ... pasted-8.png
│
└── pages/
    ├── gallery.html
    ├── trails.html
    ├── reviews.html
    ├── write-review.html
    ├── login.html
    ├── register.html
    └── dashboard.html
```

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page with hero, marquee, app previews and stats |
| `pages/gallery.html` | Responsive image grid with hover zoom |
| `pages/trails.html` | Trail cards with live search/filter |
| `pages/reviews.html` | Reviews rendered from `localStorage` |
| `pages/write-review.html` | Submit a new review |
| `pages/login.html` | Mock login |
| `pages/register.html` | Mock registration |
| `pages/dashboard.html` | Logged-in user overview (guarded) |
| `404.html` | Custom not-found page |

## Features

- **Sticky glass navbar** with blur and scroll state.
- **Path auto-detection** so the same components work from root and `/pages/`.
- **Hero animation** — staggered slide-up text and fade-in image.
- **Infinite marquee** with outlined typography.
- **Floating phone mockups** using CSS keyframes.
- **Animated stats counter** triggered on scroll with `IntersectionObserver`.
- **Trail search** filtering by name or difficulty.
- **Review system** that saves to and renders from `localStorage`.
- **Mock authentication** with session persistence and navbar greeting.
- **Scroll reveal** animations for sections.
- **Responsive layout** from 320px to 1920px.
- **Reduced-motion support** via `prefers-reduced-motion`.

## Getting Started

No build step is required. Open `index.html` directly in a browser, or serve the folder locally:

```bash
# Python
python3 -m http.server 8000

# Node.js (if installed)
npx serve .
```

Then visit `http://localhost:8000`.

## Image Optimization (Optional)

The site ships with PNG images. To compress them to WebP:

```bash
pip install Pillow
python optimize_images.py
```

This creates a `.webp` version beside each image and prints a before/after size summary. To also rewrite image references in the HTML files:

```bash
python optimize_images.py --update-html
```

## Local Storage Schema

Key: `mobi_user`

```json
{
  "id": "u_123",
  "name": "Raj Gautam",
  "email": "raj@example.com",
  "isLoggedIn": true,
  "joinedDate": "2026-11-09T00:00:00.000Z"
}
```

Key: `mobi_reviews`

```json
[
  {
    "id": "r_001",
    "name": "Sarah",
    "rating": 5,
    "comment": "Amazing app for trekking!",
    "date": "2026-11-09"
  }
]
```

> Authentication is a UI demo only. Passwords are not stored, and no real security is provided.

## Deployment (GitHub Pages)

1. Create a repository named `mobi-mobile` on GitHub.
2. Push the project, keeping the `.nojekyll` file.
3. Go to **Settings → Pages**.
4. Set the branch to `main` and the folder to `/ (root)`.
5. The site will be available at `https://<username>.github.io/mobi-mobile/`.

All asset paths are relative, so the site works from the repository subpath.

## Testing Checklist

- [ ] All built pages load without 404s.
- [ ] Navbar and footer render on root and `/pages/` correctly.
- [ ] Mobile hamburger menu opens and closes.
- [ ] Trail search filters cards and shows the empty state.
- [ ] Registration, login and logout persist via `localStorage`.
- [ ] Reviews save and render after submission.
- [ ] Stats counters animate once on scroll.
- [ ] Layout works at 375px, 768px and 1440px.

## License

This project is for educational and portfolio use. All images belong to their respective owners.
