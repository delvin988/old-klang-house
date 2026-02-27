# Gericht | Restaurant Landing Page 2 - React, Vite, TypeScript, Framer Motion, CSS Modules, Frontend Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.34.3-BB4B96)](https://www.framer.com/motion/)
[![React Icons](https://img.shields.io/badge/React_Icons-4.3.1-F26896)](https://react-icons.github.io/react-icons/)

A modern, fully responsive restaurant website (Gericht) built with **React 18**, **Vite 7**, **TypeScript**, and **Framer Motion**. It showcases a premium dining experience with smooth scroll-triggered animations, an auto-playing photo gallery, video hero section, menu, awards, and contact sections. Ideal for learning React component architecture, TypeScript, Vite, and animation patterns.

- **Live Demo:** [https://restaurant-ui-2.vercel.app/](https://restaurant-ui-2.vercel.app/)

![Screenshot 2025-07-30 at 15 57 02](https://github.com/user-attachments/assets/d9f0ec6f-ccb7-4505-a470-665ab157b6bb)
![Screenshot 2025-07-30 at 15 57 22](https://github.com/user-attachments/assets/fc1e2406-61f2-4716-aadf-2c7ff040fd59)
![Screenshot 2025-07-30 at 15 57 37](https://github.com/user-attachments/assets/3b3552bd-52ef-452a-b9e1-5cc890ccdac1)
![Screenshot 2025-07-30 at 15 57 50](https://github.com/user-attachments/assets/896d2550-d3d6-4ceb-9620-7fc655269c79)
![Screenshot 2025-07-30 at 15 58 06](https://github.com/user-attachments/assets/67b95060-db2a-4261-8bb5-2e18dd4915bc)
![Screenshot 2025-07-30 at 15 58 17](https://github.com/user-attachments/assets/46e2ddcd-05eb-481d-bfba-db95cc6e2e54)
![Screenshot 2025-07-30 at 15 58 28](https://github.com/user-attachments/assets/44b5986c-0f12-4af8-a181-1cc43b89a157)
![Screenshot 2025-07-30 at 15 58 37](https://github.com/user-attachments/assets/b02f5d0e-7ed1-48e0-9398-5b01a03aaa19)
![Screenshot 2025-07-30 at 15 58 50](https://github.com/user-attachments/assets/286236b9-5cc7-4a3a-85a1-d885bb2666fb)

## Table of Contents

- [Project Overview](#project-overview)
- [Features & Functionalities](#features--functionalities)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Components & Containers](#components--containers)
- [How to Run & Use](#how-to-run--use)
- [Project Walkthrough](#project-walkthrough)
- [Reusing Components](#reusing-components)
- [Environment Variables (.env)](#environment-variables-env)
- [API & Backend](#api--backend)
- [Scripts Reference](#scripts-reference)
- [Keywords](#keywords)
- [Conclusion](#conclusion)
- [License](#license)

---

## Project Overview

**Gericht** is a single-page application (SPA) for a fictional fine-dining restaurant. It is a **frontend-only** project: all content is static or driven by local data (no backend or external API). The app uses **Vite** for fast development and production builds, **TypeScript** for type safety, and **Framer Motion** for entrance and scroll-based animations (navbar, hero, sections, footer). The design uses a dark theme with golden and white accents, custom fonts (Cormorant Upright, Open Sans), and modular CSS per component.

---

## Features & Functionalities

| Feature               | Description                                                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Responsive layout** | Works on desktop, tablet, and mobile with breakpoints in CSS.                                                                                                                                              |
| **Animated sections** | Navbar, hero, About Us (knife “stabbing” from bottom), Menu (center image rise), Chef, Intro video, Laurels, Gallery, Find Us, Footer — each has a distinct entrance (fade, slide from left/right/bottom). |
| **Hero section**      | “The Key To Fine Dining” with staggered text and image animation.                                                                                                                                          |
| **About Us**          | Left/right text columns and a central knife image that animates up from the bottom.                                                                                                                        |
| **Today’s Special**   | Wine & Beer and Cocktails lists plus a central cocktail image; title, columns, and image animate in.                                                                                                       |
| **Chef’s Word**       | Chef image, quote, and signature with staggered text animation.                                                                                                                                            |
| **Video Intro**       | Full-viewport video; auto-plays when in view; overlay with “What We Believe In” and tagline; play/pause control.                                                                                           |
| **Awards (Laurels)**  | Award cards with icons and descriptions; staggered card animation.                                                                                                                                         |
| **Photo Gallery**     | Horizontal scroll with auto-play carousel (infinite loop), smooth scroll-snap, and pause on hover; left/right arrow controls.                                                                              |
| **Find Us**           | Contact address, opening hours, and map image.                                                                                                                                                             |
| **Footer**            | Newsletter card (email + Subscribe), Contact Us, GERÍCHT logo with quote and social icons, Working Hours, and copyright.                                                                                   |
| **Navigation**        | Top navbar with logo, links (Home, About, Menu, Awards, Contact), and Book Table; mobile hamburger menu with overlay.                                                                                      |

---

## Technology Stack

| Category              | Technology                                                                 |
| --------------------- | -------------------------------------------------------------------------- |
| **Build & dev**       | Vite 7                                                                     |
| **UI library**        | React 18                                                                   |
| **Language**          | TypeScript 5.9                                                             |
| **Animations**        | Framer Motion                                                              |
| **Icons**             | React Icons (Fi, Bs, Gi, Md)                                               |
| **Styling**           | Plain CSS (modular per component), CSS variables for theme (colors, fonts) |
| **Testing**           | Jest + React Testing Library (via react-scripts)                           |
| **Lint / type-check** | ESLint (Airbnb-style), TypeScript `tsc --noEmit`                           |

---

## Project Structure

```bash
restaurant-2/
├── index.html              # Entry HTML (root); Vite injects /src/main.tsx
├── vite.config.js           # Vite config: React plugin, public dir, build outDir
├── tsconfig.json            # TypeScript config for src
├── tsconfig.node.json       # TypeScript config for Vite config
├── package.json
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── main.tsx             # React 18 createRoot; mounts <App />
│   ├── App.tsx               # Root component: Navbar + all section containers
│   ├── App.css               # Global layout (section padding, flex, buttons, typography)
│   ├── index.css             # Reset, fonts, CSS variables, global animations
│   ├── vite-env.d.ts         # Vite client types; asset modules (.png, .svg, .mp4); prop-types
│   ├── assets/               # Images, SVG, video (imported in constants)
│   ├── components/            # Reusable UI building blocks
│   │   ├── index.ts          # Barrel: SubHeading, Newsletter, FooterOverlay, MenuItem, Navbar
│   │   ├── Navbar/
│   │   ├── SubHeading/
│   │   ├── Menuitem/
│   │   └── Footer/           # Newsletter, FooterOverlay
│   ├── container/            # Page sections (one per major block)
│   │   ├── index.ts          # Barrel: AboutUs, Chef, FindUs, Footer, Gallery, Header, Intro, Laurels, SpecialMenu
│   │   ├── Header/
│   │   ├── AboutUs/
│   │   ├── Menu/
│   │   ├── Chef/
│   │   ├── Intro/
│   │   ├── Laurels/
│   │   ├── Gallery/
│   │   ├── Findus/
│   │   └── Footer/
│   └── constants/
│       ├── index.ts          # Re-exports images, meal, data
│       ├── images.ts         # Image imports (logo, menu, gallery, etc.)
│       └── data.ts           # wines, cocktails, awards arrays
└── build/                    # Output of `npm run build` (static assets)
```

---

## Components & Containers

### Components (`src/components`)

Reusable, presentational pieces used across the app.

| Component         | Purpose                                                          | Props / usage                      |
| ----------------- | ---------------------------------------------------------------- | ---------------------------------- |
| **Navbar**        | Top bar: logo, nav links, login/book, mobile hamburger + overlay | None. Uses `images.gericht`.       |
| **SubHeading**    | Small title + spoon image (section subheadings).                 | `title: string`                    |
| **MenuItem**      | One menu row: title, price, tags + golden dash.                  | `title`, `price`, `tags` (strings) |
| **Newsletter**    | Newsletter card: heading + email input + Subscribe button.       | None.                              |
| **FooterOverlay** | Footer background (black bar + bg image).                        | None.                              |

**Example: SubHeading**

```tsx
import { SubHeading } from "./components";

<SubHeading title="Menu that fits your palatte" />;
```

**Example: MenuItem**

```tsx
import { MenuItem } from "./components";

<MenuItem title="Chapel Hill Shiraz" price="$56" tags="AU | Bottle" />;
```

### Containers (`src/container`)

Full-width sections that compose the page. Each typically uses Framer Motion `useInView` for scroll-triggered entrance animations.

| Container       | Content                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Header**      | Hero: SubHeading, “The Key To Fine Dining”, paragraph, Explore Menu button, welcome image.                             |
| **AboutUs**     | G overlay, “About Us” + “Our History” columns and central knife image.                                                 |
| **SpecialMenu** | “Today’s Special” title; Wine & Beer list, center image, Cocktails list; View More.                                    |
| **Chef**        | Chef image (left), “Chef’s word”, “What we believe in”, quote, Kevin Luo, signature.                                   |
| **Intro**       | Full-screen video (meal.mp4), overlay with “What We Believe In” + tagline, play/pause circle. Auto-plays when in view. |
| **Laurels**     | “Our Laurels” + grid of award cards (icon, title, subtitle).                                                           |
| **Gallery**     | “Photo Gallery” text + horizontal auto-play image strip (infinite), arrows.                                            |
| **FindUs**      | Contact, address, opening hours, map image, Visit Us button.                                                           |
| **Footer**      | Newsletter, Contact Us, GERÍCHT logo + quote + spoon + social icons, Working Hours, copyright.                         |

---

## How to Run & Use

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or yarn / pnpm)

### Install & run

```bash
# Clone the repository
git clone https://github.com/arnobt78/Restaurant-Landing-Page-2--React-Frontend.git
cd restaurant-2

# Install dependencies
npm install
# If you see peer dependency conflicts (e.g. with react-scripts):
# npm install --legacy-peer-deps

# Start development server (Vite)
npm start
```

Then open **<http://localhost:5173/>** in your browser. The app is a single page; scroll to see all sections and animations.

### Build for production

```bash
npm run build
```

Output is in **`build/`**: `index.html`, `assets/` (JS, CSS, images, video). Serve that folder with any static host (e.g. Vercel, Netlify, GitHub Pages).

### Preview production build locally

```bash
npm run preview
```

---

## Known behavior: first trackpad swipe

On some setups (e.g. **Chrome on macOS** with a trackpad), the **first** vertical swipe after load or after a direction change can feel like it “bounces back” or doesn’t scroll; the **second** swipe in the same direction usually scrolls with normal momentum. This is a **browser/platform quirk** (scroll chaining / momentum handling), not a bug in this project. Things already tried in the codebase:

- No `overflow-y: auto` on `html` (so the document scroll isn’t forced).
- Horizontal overflow only on `#root` (no `overflow-x: hidden` on `html`/`body`).
- No `overscroll-behavior` or `touch-action` that would block or alter scroll.
- No scroll-related delays or “scroll ready” logic.

Further “fixes” (e.g. `overscroll-behavior`, `touch-action: pan-y`) either didn’t help or broke normal scrolling, so the app is left in a minimal, predictable state. If you see this behavior, a second swipe in the same direction will scroll normally; or try another browser (e.g. Safari) to compare.

---

## Project Walkthrough

1. **Entry point**  
   `index.html` at the project root loads the app and references `/src/main.tsx`. Vite serves this and bundles TypeScript/React.

2. **React tree**  
   `main.tsx` creates the root with `ReactDOM.createRoot`, renders `<App />` inside `<React.StrictMode>`. `App.tsx` composes one `<Navbar />` and then the section containers in order: Header → AboutUs → SpecialMenu → Chef → Intro → Laurels → Gallery → FindUs → Footer.

3. **Data flow**
   - **constants/data.ts** exports `wines`, `cocktails`, `awards`.
   - **constants/images.ts** exports an object of image URLs (and **constants/index.ts** re-exports `images`, `meal`, `data`).
   - Containers and components import from `constants` and use the data (e.g. `SpecialMenu` maps over `data.wines` and `data.cocktails` with `MenuItem`).

4. **Styling**
   - **index.css**: fonts (Google Fonts), CSS variables (e.g. `--color-golden`, `--font-base`), reset, global helpers (e.g. `.flex__center`).
   - **App.css**: section padding, app wrapper, buttons, typography classes (e.g. `.p__cormorant`, `.headtext__cormorant`).
   - Each component/container has its own `.css` (e.g. `Navbar.css`, `Header.css`) for layout and visuals.

5. **Animations**
   - Framer Motion is used with `useInView` (and optional `once: true`) so elements animate when they enter the viewport.
   - Easing is typically a 4-number array (e.g. `[0.65, 0, 0.35, 1]`).
   - Examples: Navbar slides down; Hero left column staggers, right image slides in; About Us knife moves up; Gallery auto-plays and loops; Footer columns slide from left/right, newsletter from bottom.

6. **Video (Intro)**
   - Video is muted and loops. When the Intro section is in view (`useInView`), the video is played; when out of view, it is paused.
   - Overlay text and play/pause button are animated separately.

7. **Gallery**
   - Duplicated image set for infinite scroll. A `setInterval` advances scroll by one card width; when past the first set, scroll position is reset so the loop is seamless.
   - CSS `scroll-behavior: smooth` and `scroll-snap-type` give smooth, card-aligned sliding.

---

## Reusing Components

Components are designed to be copyable into other projects. Each lives in its own folder with a `.tsx` and `.css` file.

**Using SubHeading in another project**

1. Copy `src/components/SubHeading/` (SubHeading.tsx + SubHeading.css if any).
2. Copy or adapt the `constants` that SubHeading needs (e.g. `images.spoon`). In this project, `images` comes from `constants/images.ts` (asset imports).
3. Use the same props interface: `title: string`.

```tsx
interface SubHeadingProps {
  title: string;
}
const SubHeading = ({ title }: SubHeadingProps) => ( ... );
```

**Using MenuItem in another project**

1. Copy `src/components/Menuitem/` (MenuItem.tsx, MenuItem.css).
2. Ensure parent CSS or global styles provide `.p__cormorant`, `.p__opensans` (or replace with your own classes).
3. Pass `title`, `price`, `tags` (strings).

```tsx
<MenuItem title="Dish Name" price="$24" tags="Description or origin" />
```

**Using a full section (e.g. Footer)**

Copy the container folder (e.g. `Footer/`) and the `constants` it depends on (e.g. `images.gericht`, `images.spoon`). Update import paths to match your project structure. Same idea applies to Header, SpecialMenu, etc., if you want to reuse whole sections.

---

## Environment Variables (.env)

This project is **static and frontend-only**. It does **not** use any environment variables in the source code. All content and asset paths are fixed or imported from `src/constants`.

If you later add a backend or external API:

1. **Vite** exposes env via `import.meta.env`. Only variables prefixed with `VITE_` are available in the client.
2. Create a `.env` (or `.env.local`) in the project root:

   ```env
   VITE_API_BASE_URL=https://api.example.com
   VITE_CONTACT_EMAIL=contact@example.com
   ```

3. Use in code:

   ```ts
   const apiBase = import.meta.env.VITE_API_BASE_URL;
   ```

4. Add `.env` and `.env.local` to `.gitignore` if they contain secrets (this project’s `.gitignore` already includes common env file names).

For the **current** Gericht app, **no .env file is required** to run or build.

---

## API & Backend

There is **no backend and no API** in this project. All data is:

- Hardcoded in `src/constants/data.ts` (wines, cocktails, awards), or
- Rendered from static content in components (address, hours, newsletter form is UI-only).

The newsletter form does not submit to a server. To add a real subscription flow you would:

- Add a backend or use a third-party service (e.g. Mailchimp, Formspree).
- Optionally use a `VITE_` env variable for the API URL and call it from the Newsletter component (e.g. with `fetch` or axios).

---

## Scripts Reference

| Command           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm start`       | Starts Vite dev server (default: <http://localhost:5173>). |
| `npm run build`   | Production build; output in `build/`.                      |
| `npm run preview` | Serves the `build/` output locally.                        |
| `npm run lint`    | Type-checks with `tsc --noEmit` (no build).                |
| `npm test`        | Runs Jest via react-scripts (if tests are added).          |

---

## Keywords

React, React 18, Vite, TypeScript, Framer Motion, restaurant website, landing page, responsive design, UI components, single-page application, SPA, frontend, CSS modules, scroll animations, auto-play gallery, video hero, newsletter, reusable components, Gericht, fine dining, learning project, open source.

---

## Conclusion

This project is a **learning-friendly** restaurant landing page built with a modern stack (Vite, React 18, TypeScript, Framer Motion). It demonstrates:

- Component-based structure (components vs containers).
- TypeScript interfaces and type-safe props.
- Scroll- and viewport-based animations.
- Static data flow via constants.
- Responsive layout and theming with CSS variables.

You can extend it by adding a real newsletter API, more sections, or switching to a headless CMS for content. The structure and reusable components are designed so you can copy parts into other React/TypeScript projects.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license.

## Happy Coding! 🎉

This is an **open-source project** - feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com](https://www.arnobmahmud.com).

**Enjoy building and learning!** 🚀

Thank you! 😊
