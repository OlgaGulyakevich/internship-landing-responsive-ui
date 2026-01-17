# Internship - International Exchange Programs Landing

> Production-ready landing page showcasing advanced CSS techniques, responsive Swiper.js implementations, and clean architecture. Built with BEM methodology, mobile-first Sass, and Vanilla JavaScript ES2015 modules.

**⏱️ Completed in 4 weeks** | **🎓 HTML Academy Accelerator** graduation project

[![Pixel Perfect](https://img.shields.io/badge/Pixel%20Perfect-BackstopJS-green)](https://github.com/garris/BackstopJS)
[![BEM Methodology](https://img.shields.io/badge/Methodology-BEM-blue)](https://en.bem.info/)
[![Build Tool](https://img.shields.io/badge/Build-Vite%207-purple)](https://vitejs.dev/)

---

<div align="center">

<picture>
  <source media="(min-width: 1440px)" srcset="./source/public/previews/hero-desktop.png">
  <source media="(min-width: 768px)" srcset="./source/public/previews/hero-tablet.png">
  <img src="./source/public/previews/hero-mobile.png" alt="Internship Landing - Hero Section with SVG Mask Shape" width="100%">
</picture>

</div>

---

## 🚀 Live Demo

**[View Live Project →](https://olgagulyakevich.github.io/internship-landing-responsive-ui/)**

---

## ✨ Key Features & Technical Highlights

### 🎨 Advanced CSS Techniques
- **SVG Mask Shapes**: Custom decorative masks with inverted rounded corners for content blocks (3 responsive variants: mobile/tablet/desktop)
- **Layout Shift Prevention**: Transparent borders on interactive elements to prevent CLS during hover states (HTML Academy HTML1-TEST-08 compliance)
- **Defensive CSS Patterns**: Comprehensive overflow prevention using custom mixins (`flex-no-overflow`, `grid-no-overflow`) + global `overflow-x: hidden` protection
- **Full-Width Overlay Trick**: Classic CSS pattern (`left: 50%; margin-left: -50vw; width: 100vw`) for breaking out of container constraints

### 🎯 Swiper.js Integration (4 Custom Implementations)
1. **Hero Slider**: Loop-enabled fullscreen slider with custom pagination bullets
2. **Programs Slider**: Card-based slider with navigation arrows, linked to burger menu submenu
3. **News Slider**: Advanced grid-based slider with dual navigation:
   - **Pagination (numbers)**: Fine control - moves by 1 slide
   - **Arrows**: Fast browsing - moves by 1 full page/group
   - **Custom Pagination**: Sliding window (max 4 visible buttons)
   - **Responsive Grid**: 2 cards (mobile) → 4 cards (tablet) → 3 cards (desktop)
4. **Reviews Slider**: Testimonial cards with navigation arrows and custom scrollbar integration

### 📱 Responsive Architecture
- **Mobile-First Approach**: Base styles at 320px, progressive enhancement via mixins
- **Breakpoints**: 320px–767px (mobile) | 768px–1439px (tablet) | 1440px+ (desktop)
- **Art Direction**: Different hero images per viewport using `<picture>` + `<source media>`
- **Retina Support**: `srcset="@1x.webp 1x, @2x.webp 2x"` for all raster images

### 🎭 Interactive Components
- **Burger Menu with Deep Linking**: Fullscreen overlay navigation with expandable submenus that scroll to sections and control sliders/tabs
- **Dynamic Tabs System**: JSON-based content loading (`/data/news.json`) with seamless category switching and responsive grid reordering
- **Modal System**: Form modal + notification modal with backdrop click handling and scroll lock
- **Accordion (FAQ)**: Multiple items can be expanded simultaneously with smooth transitions
- **Form Validation & Submission**: Phone mask (+7), consent checkbox, async POST to `https://echo.htmlacademy.ru` with error handling
- **Custom Scrollbar**: Styled scrollbar for Reviews slider with hover effects and smooth scrolling integration

### 🏗️ Architecture & Code Quality
- **BEM Methodology**: Strict flat selectors (max nesting depth: 1), no `&__element` nesting
- **Sass Layers**: `vendor → global → layout → components → blocks` (clean separation of concerns)
- **Design Tokens**: All values centralized in `variables.scss` (colors, spacing, typography, breakpoints)
- **ES2015 Modules**: Clean modular JavaScript with async/await, error handling
- **Accessibility**: 77 ARIA attributes, keyboard navigation, focus-visible states, screen reader support

---

## 🛠️ Tech Stack

### Core Technologies
- **HTML5** - Semantic markup, `<picture>` art direction, accessibility-first
- **Sass (SCSS)** - BEM methodology, mobile-first mixins, design tokens architecture
- **Vite 7** - Lightning-fast dev server, optimized production builds
- **Vanilla JavaScript (ES2015)** - Modular architecture, no framework dependencies

### Libraries & Tools
- **[Swiper.js 12](https://swiperjs.com/)** - Advanced slider implementations (Grid, Navigation, Pagination, A11y modules)
- **[BackstopJS](https://github.com/garris/BackstopJS)** - Pixel-perfect visual regression testing (±5px horizontal, ±10px vertical tolerance)

### Build & Quality Tools
- **ESLint** (htmlacademy config) - JavaScript linting with auto-fix
- **Stylelint** (htmlacademy config) - SCSS linting with BEM validation
- **HTML Validators** (W3C, linthtml, html-validate) - Markup quality checks
- **BEM Tree Linter** - Methodology compliance verification
- **ls-lint** - File/folder naming conventions (kebab-case enforcement)

---

## 📦 Installation & Usage

### Prerequisites
- **Node.js**: `^18.18.0 || ^20.9.0` (recommended: 20.19.0 via Volta)

### Setup
```bash
# 1. Clone repository
git clone https://github.com/OlgaGulyakevich/internship-landing-responsive-ui.git

# 2. Install dependencies
npm install

# 3. Start development server (opens at localhost:3000)
npm run dev
```

### Available Scripts

#### Development
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Production build → dist/
npm run preview          # Preview production build
npm run convert-rastr    # Generate WebP from PNG/JPEG in source/img/
```

#### Quality Checks (Run before commits)
```bash
npm run w3c              # W3C HTML validation
npm run linthtml         # HTML linting (htmlacademy rules)
npm run html-validate    # Advanced HTML validation
npm run lint-bem         # BEM methodology check
npm run stylelint        # SCSS linting (auto-fix enabled)
npm run lint-js          # JavaScript linting (auto-fix enabled)
npm run ls-lint          # File/folder naming validation
npm run editorconfig     # EditorConfig compliance
```

#### Testing
```bash
npm run test             # Pixel Perfect tests (BackstopJS)
                         # ⚠️ Requires dev server running in separate terminal

npm run test:local       # Local BackstopJS config
npm run test-content     # Content validation (Vitest UI)
```

---

## 📐 Project Structure

```
source/
├── sass/
│   ├── style.scss           # Main entry (imports all layers)
│   ├── vendor/              # Third-party (normalize.scss)
│   ├── global/              # Variables, mixins, fonts, base resets
│   │   ├── variables.scss   # Design tokens (colors, spacing, typography)
│   │   └── mixins.scss      # Responsive breakpoints, overflow prevention
│   ├── layout/              # Page structure (container, grid)
│   ├── components/          # Reusable UI (button, modal, cards, pagination)
│   └── blocks/              # Page-specific sections (header, hero, footer)
├── js/
│   ├── main.js              # Entry point (module initialization)
│   ├── modules/             # Feature modules (burger-menu, modal, tabs, form)
│   ├── sliders/             # Swiper configurations (hero, programs, news, reviews)
│   └── config/              # Constants (breakpoints, slider defaults)
├── img/
│   ├── sprite/              # SVG icons → auto-generated spritemap
│   ├── masks/               # SVG masks for decorative shapes
│   └── ...                  # Raster images (WebP + JPEG fallbacks)
└── index.html               # Single-page layout (semantic sections)
```

**📘 See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed documentation**

---

## 🎨 Component Showcase

### SVG Mask Shapes (Hero Content Block)
Three responsive variants with inverted rounded corners:
- **Mobile** (320px–767px): Compact mask for vertical layout
- **Tablet** (768px–1439px): Medium mask (659px width)
- **Desktop** (1440px+): Wide mask (968px width)

Implementation: `mask-image: url("/img/masks/hero-content-mask-*.svg")`

### Custom Swiper Pagination (News Slider)
**Sliding Window Algorithm**:
- Always shows max 4 buttons visible at once
- Dynamically shifts window as user navigates
- Handles edge cases (beginning/end of slides)
- Updates on resize/breakpoint changes

**Dual Navigation System**:
- Click number → jump to specific slide
- Click arrow → move full page forward/backward

### Burger Menu Navigation
- **Fullscreen overlay** with dark background (`rgba(0, 0, 0, 0.3)`)
- **Floating content block** appears 4px below burger button
- **Expandable submenus** with rotating arrow icons (180deg)
- **Deep linking**: Submenu items scroll to sections and switch slider slides/tabs

---

## 📸 Screenshots

### News Section - Complex Interactive Component
The most technically advanced section featuring tabs, grid slider, dual navigation, and custom pagination.

<div align="center">

**Desktop (1440px)** - 3 cards per page, horizontal pagination
![News Desktop](./source/public/previews/news-section-desktop.png)

**Tablet (768px)** - 4 cards per page (2×2 grid)
![News Tablet](./source/public/previews/news-section-tablet.png)

**Mobile (320px)** - 2 cards per page (1×2 grid)
![News Mobile](./source/public/previews/news-section-mobile.png)

</div>

**Technologies shown:**
- Dynamic tab switching with JSON content loading
- Swiper.js Grid module with responsive breakpoints
- Custom pagination (sliding window - max 4 visible buttons)
- Dual navigation (pagination moves by 1 slide, arrows move by 1 page)
- Responsive card reordering for different grid layouts

---

## 🌟 HTML Academy Requirements

### ✅ Pixel Perfect Compliance
- **Tolerance**: ±5px horizontal, ±10px vertical
- **Test Coverage**: 30 scenarios (3 viewports × 10 sections)
- **BackstopJS**: Visual regression testing framework

### ✅ Code Quality Standards
- **HTML**: Semantic tags, single `<h1>`, sequential headings, WCAG AA contrast (≥4.5:1)
- **BEM**: Flat selectors (no `&__element`), max nesting depth 1
- **Accessibility**: 77 ARIA attributes, keyboard navigation, 44×44px touch targets
- **Forms**: POST method, phone mask (+7), empty first `<option>`, data consent checkbox

### ✅ Browser Support
- **Chrome** (latest)
- **Firefox** (latest)
- **Mobile Safari** (iOS 14+)

---

## 📄 License

This project is developed as part of HTML Academy Accelerator program.

---

## 🤝 Author

**Olga Gulyakevich**
Frontend Developer

**Portfolio:** [GitHub Profile](https://github.com/OlgaGulyakevich)
**Program:** HTML Academy Accelerator 2025

---

## 🙏 Acknowledgments

- **[HTML Academy](https://htmlacademy.ru/)** - Educational platform and project requirements
- **[Swiper.js](https://swiperjs.com/)** - Powerful slider library
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling

---

<div align="center">

**Built with 💙 using Vanilla JavaScript**

[🌐 Live Demo](https://olgagulyakevich.github.io/internship-landing-responsive-ui/) •
[📦 GitHub](https://github.com/OlgaGulyakevich) •
[💼 LinkedIn](https://www.linkedin.com/in/olga-gulyakevich-ab166674/) •
[📧 Contact](mailto:olga.gulyakevich@gmail.com)

</div>
