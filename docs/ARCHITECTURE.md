# Project Architecture

Detailed technical documentation for the Internship Landing Page project architecture, code organization, and implementation patterns.

---

## Table of Contents

- [CSS/Sass Architecture](#csssass-architecture)
- [JavaScript Architecture](#javascript-architecture)
- [Component Design Patterns](#component-design-patterns)
- [Build Configuration](#build-configuration)
- [Performance Optimizations](#performance-optimizations)

---

## CSS/Sass Architecture

### Layer System (ITCSS-inspired)

The project follows a strict layering system with explicit import order in `style.scss`:

```scss
// 1. VENDOR LAYER - Third-party styles
@import "vendor/normalize";

// 2. GLOBAL LAYER - Foundation (no selectors except *, html, body, img)
@import "global/variables";  // Design tokens
@import "global/mixins";      // Utilities (breakpoints, overflow prevention)
@import "global/fonts";       // @font-face declarations
@import "global/global";      // Base resets (*, html, body, img only)

// 3. LAYOUT LAYER - Page structure
@import "layout/page";        // .page wrapper, main, overflow-x hidden
@import "layout/container";   // .container, responsive padding

// 4. COMPONENTS LAYER - Reusable UI elements
@import "components/button";
@import "components/modal";
@import "components/news-card";
@import "components/news-pagination";
@import "components/news-tab";
@import "components/notification-modal";
@import "components/program-card";
@import "components/review-card";

// 5. BLOCKS LAYER - Page-specific sections
@import "blocks/header";
@import "blocks/nav-menu";
@import "blocks/hero";
@import "blocks/about";
@import "blocks/programs";
@import "blocks/grant";
@import "blocks/news";
@import "blocks/faq";
@import "blocks/reviews";
@import "blocks/contacts";
@import "blocks/form";
@import "blocks/footer";
```

**Principles:**
- **Lower layers cannot reference upper layers** (e.g., `global/` cannot use `.block` selectors)
- **Each layer has increasing specificity** (from generic to specific)
- **No cross-layer dependencies** except upward (blocks → components → layout → global)

---

### Design Tokens (`global/variables.scss`)

All design values centralized in a single source of truth:

#### Colors
```scss
// Brand Colors
$color-primary-blue: #2c39f2;
$color-accent-light: #f0f4fb;

// Text Colors
$color-text-primary: #2c2e3f;
$color-text-secondary: #999999;
$color-text-disabled: #b7b7b7;

// UI Colors
$color-overlay-menu: rgba(0, 0, 0, 0.3);
$color-overlay-photo: rgba(28, 43, 76, 0.4);
```

#### Spacing System (4px base)
```scss
$spacing-xs: 4px;
$spacing-s: 8px;
$spacing-m: 16px;
$spacing-l: 24px;
$spacing-xl: 32px;
$spacing-xxl: 48px;
```

#### Typography Scale
```scss
// Font Family
$font-family: "Manrope", "Arial", sans-serif;

// Font Weights (7 variants)
$font-weight-extra-light: 200;
$font-weight-light: 300;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semi-bold: 600;
$font-weight-bold: 700;
$font-weight-extra-bold: 800;

// Font Sizes (responsive)
$font-size-h1-mobile: 26px;
$font-size-h1-tablet: 56px;
$font-size-h1-desktop: 77px;
// ... (all variants defined)
```

#### Breakpoints
```scss
$tablet: 768px;
$desktop: 1440px;

// Container Padding
$container-padding-mobile: 15px;
$container-padding-tablet: 45px;
$container-padding-desktop: 120px;
```

---

### BEM Methodology (Strict Implementation)

**Naming Convention:** `.block__element--modifier`

#### Critical Rules:

1. **Flat Selectors Only** - No nesting with `&__element`
    ```scss
    // ✅ CORRECT - Flat structure
    .header {
      background: $color-primary;
    }

    .header__logo {
      width: 142px;
    }

    .header__logo:hover {
      opacity: 0.8;
    }

    // ❌ WRONG - Nesting depth > 1
    .header {
      &__logo {           // Creates nesting
        &:hover { }       // Further nesting
      }
    }
    ```

2. **Max Nesting Depth: 1** - Only pseudo-classes/elements allowed
    ```scss
    .button {
      // Depth 0

      &:hover { }           // ✅ Depth 1 - OK
      &:focus-visible { }   // ✅ Depth 1 - OK
      &::before { }         // ✅ Depth 1 - OK
      &--primary { }        // ✅ Depth 1 - OK (modifier)
    }
    ```

3. **Ampersand Usage** - ONLY for:
    - Pseudo-classes: `:hover`, `:focus`, `:active`, `:disabled`
    - Pseudo-elements: `::before`, `::after`
    - State classes: `.is-active`, `.is-open`
    - Modifiers: `--modifier`

4. **File Organization**
    - One BEM block = one `.scss` file
    - File name = block name (e.g., `header.scss` → `.header`)
    - Components: reusable across pages
    - Blocks: page-specific sections

---

### Responsive Mixins (`global/mixins.scss`)

#### Breakpoint Mixins (Mobile-First)
```scss
@mixin tablet {
  @media (width >= $tablet) {
    @content;
  }
}

@mixin desktop {
  @media (width >= $desktop) {
    @content;
  }
}

// Usage:
.element {
  font-size: 16px;         // Mobile (320px+)

  @include tablet {
    font-size: 18px;       // Tablet (768px+)
  }

  @include desktop {
    font-size: 20px;       // Desktop (1440px+)
  }
}
```

#### Overflow Prevention Mixins
```scss
// For Flex Containers
@mixin flex-no-overflow {
  > * {
    min-width: 0;  // Prevents flex items from overflowing
  }
}

// For Grid Containers
@mixin grid-no-overflow {
  > * {
    min-width: 0;  // Prevents grid items from overflowing
  }
}

// Usage:
.header__wrapper {
  display: flex;
  @include flex-no-overflow;  // All children get min-width: 0
}
```

**Why This Matters:**
- Flex/grid items have implicit `min-width: auto` (content-based)
- Long text or wide content can cause overflow
- Setting `min-width: 0` allows items to shrink below content size
- Required for HTML Academy HTML1-TEST-04 compliance

---

### Global Overflow Protection

```scss
// global/global.scss
html {
  overflow-x: hidden;  // Prevents horizontal scroll on root
}

body {
  overflow-x: hidden;  // Double protection
}

// layout/page.scss
.page main {
  overflow-x: hidden;  // Additional layer (extended backgrounds)
}
```

**Purpose:**
- Prevents `100vw` issues on Windows/Linux (scrollbar included in width)
- Protects against accidental overflow from full-width tricks
- Three-layer defense: `html` → `body` → `main`

---

## JavaScript Architecture

### Module System (ES2015)

**Entry Point:** `source/js/main.js`

```javascript
// Wait for DOM before initializing
document.addEventListener('DOMContentLoaded', () => {
  // 1. Header & Navigation
  initBurgerMenu();
  initNavMenuNavigation(programsSwiper);

  // 2. Sliders
  const heroSwiper = initHeroSlider();
  const programsSwiper = initProgramsSlider();
  const reviewsSwiper = initReviewsSlider();

  // 3. Dynamic Content
  initNewsLoader(newsSwiper).catch(console.error);

  // 4. Interactive Components
  initModal();
  initFormSection();
  initFaq();
});
```

### Folder Structure

```
js/
├── main.js                      # Entry point
├── modules/                     # Feature modules
│   ├── burger-menu.js          # Mobile menu toggle
│   ├── faq.js                  # Accordion logic
│   ├── form-section.js         # Form validation + submission
│   ├── modal.js                # Modal system (open/close)
│   ├── nav-menu-navigation.js  # Deep linking (menu → slider/tabs)
│   ├── news-card-generator.js  # Dynamic HTML generation
│   ├── news-card-reorder.js    # Responsive grid reordering
│   ├── news-loader.js          # JSON fetch + rendering
│   └── news-tabs.js            # Tab switching logic
├── sliders/                    # Swiper configurations
│   ├── hero-slider.js          # Fullscreen hero slider
│   ├── news-navigation.js      # Dual navigation (arrows + numbers)
│   ├── news-pagination.js      # Sliding window algorithm
│   ├── news-slider.js          # Grid-based slider
│   ├── programs-slider.js      # Card slider
│   └── reviews-slider.js       # Testimonials slider
├── config/                     # Constants
│   └── slider-constants.js     # Shared breakpoints, defaults
└── utils/                      # Utilities
    └── scrollbar-width.js      # Detect scrollbar width for modals
```

### Code Patterns

#### 1. Guard Clauses
```javascript
export function initModal() {
  const modal = document.querySelector('.modal');

  if (!modal) {
    return;  // Early exit if element missing
  }

  // Continue with logic...
}
```

#### 2. Error Handling
```javascript
async function fetchNews() {
  try {
    const response = await fetch('/data/news.json');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to load news:', error);
    throw error;  // Re-throw for caller
  }
}
```

#### 3. Event Delegation
```javascript
// Bad - multiple event listeners
links.forEach(link => {
  link.addEventListener('click', handleClick);
});

// Good - single delegated listener
container.addEventListener('click', (event) => {
  const link = event.target.closest('.link');
  if (link) {
    handleClick(event, link);
  }
});
```

#### 4. Async/Await over Promises
```javascript
// Preferred - async/await
async function loadAndRenderNews() {
  const data = await fetchNews();
  renderCards(data);
}

// Avoid - promise chains
function loadAndRenderNews() {
  fetchNews()
    .then(data => renderCards(data))
    .catch(error => console.error(error));
}
```

---

## Component Design Patterns

### 1. SVG Mask Shapes (Hero)

**Problem:** Designer wants unusual shape with inverted rounded corners

**Solution:** Use `mask-image` with responsive SVG masks

```scss
.hero__content {
  background: white;

  // Mobile mask (320px–767px)
  mask-image: url("/img/masks/hero-content-mask-mobile.svg");
  mask-size: 100% 100%;
  mask-repeat: no-repeat;

  @include tablet {
    // Tablet mask (768px–1439px)
    mask-image: url("/img/masks/hero-content-mask-tablet.svg");
  }

  @include desktop {
    // Desktop mask (1440px+)
    mask-image: url("/img/masks/hero-content-mask-desktop.svg");
  }
}
```

**Benefits:**
- Pure CSS solution (no JavaScript)
- Responsive (different masks per breakpoint)
- Smooth edges (vector graphics)
- Works with any background color/image

---

### 2. Sliding Window Pagination (News Slider)

**Problem:** Slider has many slides, but pagination should only show 4 buttons max

**Solution:** Custom algorithm that shifts visible window as user navigates

```javascript
function updatePaginationWindow(swiper) {
  const currentSlide = swiper.realIndex;
  const totalSlides = swiper.slides.length;
  const maxVisible = 4;

  let start, end;

  if (totalSlides <= maxVisible) {
    // Show all buttons
    start = 0;
    end = totalSlides;
  } else if (currentSlide < 2) {
    // Near beginning → show [0, 1, 2, 3]
    start = 0;
    end = maxVisible;
  } else if (currentSlide >= totalSlides - 2) {
    // Near end → show [n-3, n-2, n-1, n]
    start = totalSlides - maxVisible;
    end = totalSlides;
  } else {
    // Middle → center current slide
    start = currentSlide - 1;
    end = currentSlide + 3;
  }

  // Update button visibility
  buttons.forEach((button, index) => {
    button.classList.toggle('is-hidden', index < start || index >= end);
  });
}
```

**Features:**
- Always shows max 4 buttons
- Smooth transitions (no jarring jumps)
- Handles edge cases (beginning/end)
- Updates on slide change and resize

---

### 3. Dual Navigation System (News Slider)

**Problem:** Two navigation types with different behaviors:
- Pagination (numbers) → move 1 slide
- Arrows → move 1 full page

**Solution:** Configure Swiper with `slidesPerGroup: 1` + custom arrow handlers

```javascript
// Swiper config - pagination moves 1 slide
const swiper = new Swiper('.news__slider', {
  slidesPerGroup: 1,  // Pagination moves by 1

  // ... other config
});

// Custom arrow handlers - move by full page
setupArrowNavigation(swiper, prevArrow, nextArrow, () => {
  // Calculate slides per page dynamically
  const viewport = window.innerWidth;

  if (viewport < BREAKPOINTS.tablet) {
    return 2;  // Mobile: 2 cards per page
  } else if (viewport < BREAKPOINTS.desktop) {
    return 4;  // Tablet: 4 cards per page
  } else {
    return 3;  // Desktop: 3 cards per page
  }
});
```

**Benefits:**
- Fine control with pagination (1 slide at a time)
- Fast browsing with arrows (skip full page)
- Responsive (adapts to current grid layout)

---

### 4. Burger Menu Deep Linking

**Problem:** Submenu links should scroll to sections AND switch slider slides/tabs

**Implementation:**

```javascript
export function initNavMenuNavigation(programsSwiper) {
  const sublinks = document.querySelectorAll('.nav-menu__sublink');

  sublinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      // Handle slider navigation (data-slide attribute)
      if (link.hasAttribute('data-slide')) {
        const slideIndex = parseInt(link.getAttribute('data-slide'), 10);
        programsSwiper.slideTo(slideIndex);

        // Scroll to programs section
        document.querySelector('#programs')
          .scrollIntoView({ behavior: 'smooth' });
      }

      // Handle tab navigation (data-tab attribute)
      if (link.hasAttribute('data-tab')) {
        const tabValue = link.getAttribute('data-tab');
        const targetTab = document.querySelector(`.news__tab[data-tab="${tabValue}"]`);
        targetTab.click();  // Trigger tab switch

        // Scroll to news section
        document.querySelector('#news')
          .scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
```

---

## Build Configuration

### Vite 7 Setup (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import svg from '@spiriit/vite-plugin-svg-spritemap';

export default defineConfig({
  root: './source',
  base: '/',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './source/index.html',
    },
  },

  server: {
    port: 3000,
    open: true,
  },

  plugins: [
    // SVG Sprite Generation
    svg({
      pattern: 'img/sprite/*.svg',
      prefix: 'sprite-',
      filename: '__spritemap',
    }),

    // Image Optimization (JPEG, PNG, SVG)
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeDimensions', active: true },
        ],
      },
    }),

    // HTML Minification
    ViteMinifyPlugin(),
  ],
});
```

**Features:**
- **SVG Sprites**: Auto-generates from `source/img/sprite/*.svg`
- **Image Optimization**: Compresses raster images on build
- **HTML Minification**: Reduces file size
- **Dev Server**: Hot reload on port 3000

---

## Performance Optimizations

### 1. Image Optimization

#### WebP Conversion
```bash
npm run convert-rastr
```
Converts all PNG/JPEG in `source/img/` to WebP format (lossless compression ~30% smaller)

#### Retina Support
```html
<img
  srcset="hero@1x.webp 1x, hero@2x.webp 2x"
  width="320"
  height="240"
  alt="..."
>
```

#### Art Direction
```html
<picture>
  <source
    media="(min-width: 1440px)"
    srcset="hero-desktop@1x.webp 1x, hero-desktop@2x.webp 2x">
  <source
    media="(min-width: 768px)"
    srcset="hero-tablet@1x.webp 1x, hero-tablet@2x.webp 2x">
  <img
    srcset="hero-mobile@1x.webp 1x, hero-mobile@2x.webp 2x"
    alt="...">
</picture>
```

### 2. Critical CSS

All styles loaded in single `style.css` (no render-blocking imports)

### 3. Async JavaScript

All scripts use ES modules with deferred loading:
```html
<script type="module" src="js/main.js"></script>
```

### 4. Font Loading Strategy

```scss
@font-face {
  font-family: "Manrope";
  src: url("../fonts/manrope-regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;  // Show fallback font immediately
}
```

### 5. Layout Shift Prevention

```scss
.button {
  // Prevent layout shift on hover/focus
  // HTML Academy HTML1-TEST-08 requirement
  border: 1px solid transparent;

  &:hover {
    border-color: $color-primary;
  }
}
```

---

## Testing Strategy

### Pixel Perfect Testing (BackstopJS)

**Configuration:** `pp.config.cjs`

```javascript
module.exports = {
  viewports: [
    { label: 'mobile', width: 320, height: 768 },
    { label: 'tablet', width: 768, height: 1024 },
    { label: 'desktop', width: 1440, height: 900 },
  ],
  scenarios: [
    { label: 'hero', url: 'http://localhost:3000', selector: '[data-test="hero"]' },
    { label: 'about', url: 'http://localhost:3000', selector: '[data-test="about"]' },
    // ... (10 sections total)
  ],
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
  },
  misMatchThreshold: 0.5,  // 0.5% tolerance
};
```

**Tolerances:**
- Horizontal: ±5px
- Vertical: ±10px
- Total: 30 test scenarios (3 viewports × 10 sections)

### Linting & Validation

**Pre-commit checklist:**
```bash
npm run w3c              # HTML validation (W3C)
npm run linthtml         # HTML linting (htmlacademy)
npm run html-validate    # Advanced HTML checks
npm run lint-bem         # BEM methodology validation
npm run stylelint        # SCSS linting (auto-fix)
npm run lint-js          # JavaScript linting (auto-fix)
npm run ls-lint          # File/folder naming
npm run editorconfig     # EditorConfig compliance
```

---

## Browser Support

### Target Browsers
- **Chrome** 90+ (latest)
- **Firefox** 88+ (latest)
- **Safari** 14+ (iOS 14+)
- **Edge** 90+ (Chromium-based)

### Fallbacks

#### CSS Grid (Autoprefixer)
```scss
// Automatically prefixed in build
display: grid;
// Becomes:
display: -ms-grid;  // IE 11
display: grid;
```

#### WebP Images
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">  <!-- JPEG fallback -->
</picture>
```

---

## Future Improvements

Potential enhancements for scaling the project:

1. **Component Library**: Extract reusable components to Storybook
2. **TypeScript**: Add type safety to JavaScript modules
3. **CSS Modules**: Scope component styles automatically
4. **Unit Tests**: Jest + Testing Library for JS logic
5. **E2E Tests**: Playwright for user flow testing
6. **Lazy Loading**: Defer offscreen images with `loading="lazy"`
7. **Service Worker**: Offline support + caching strategy
8. **Critical CSS Inline**: Inline above-the-fold styles

---

**Last Updated:** 2026-01-16
**Version:** 1.0.0
