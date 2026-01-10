// =============================================================================
// SLIDER CONFIGURATION CONSTANTS
// =============================================================================
// Shared configuration for all sliders: programs, news, reviews, hero
// Matches CSS breakpoints and design specifications

// Breakpoints (matches CSS media queries)
export const BREAKPOINTS = {
  TABLET: 768,
  DESKTOP: 1440,
};

// Common slider settings (reusable across programs, news, reviews)
export const SLIDER_DEFAULTS = {
  SPACING: {
    MOBILE: 15,
    TABLET: 30,
    DESKTOP: 32,
  },
  SPEED: 600,
};

// Programs slider specific configuration
export const PROGRAMS_SLIDER = {
  SCROLLBAR: {
    TABLET: { WIDTH: 562, DRAG_WIDTH: 326 },
    DESKTOP: { WIDTH: 1136, DRAG_WIDTH: 392 },
  },
};

// Hero slider specific configuration
export const HERO_SLIDER = {
  INIT_DELAY: 100,
};

// News slider specific configuration
export const NEWS_SLIDER = {
  SPACING: {
    MOBILE: 20, // News mobile spacing differs from other sliders (15px)
  },
  PAGINATION: {
    MAX_VISIBLE: 4, // Maximum pagination bullets visible in sliding window
    BUTTON_SIZE: {
      MOBILE: 42, // 26px button + 16px gap
      TABLET: 52, // 32px button + 20px gap (also used on desktop)
    },
  },
  SLIDES_PER_PAGE: {
    MOBILE: 1, // 1 Swiper slide = 2 visual cards (1 col × 2 rows)
    TABLET: 2, // 2 Swiper slides = 4 visual cards (2 cols × 2 rows)
    DESKTOP: 3, // 3 Swiper slides = 3 visual cards (3 cols × 1 row)
  },
  CARDS_PER_PAGE: {
    MOBILE: 2, // 2 visual cards per page (1 col × 2 rows)
    TABLET: 4, // 4 visual cards per page (2 cols × 2 rows)
    DESKTOP: 3, // 3 visual cards per page (3 cols × 1 row)
  },
  // Image sizes for responsive <picture> elements (critical for Grid mode + pixel perfect)
  IMAGE_SIZES: {
    MOBILE: {
      WIDTH: 290,
      HEIGHT_LARGE: 330, // Top row cards on mobile
      HEIGHT_SMALL: 240, // Bottom row cards on mobile
    },
    TABLET: {
      WIDTH: 324,
      HEIGHT: 350,
    },
    DESKTOP: {
      WIDTH_LARGE: 604, // First card in each row (wide variant)
      WIDTH_SMALL: 286, // Other cards
      HEIGHT: 400,
    },
  },
};

// Reviews slider specific configuration (will be added later)
export const REVIEWS_SLIDER = {
  SCROLLBAR: {
    TABLET: { WIDTH: 562, DRAG_WIDTH: 326 },
    DESKTOP: { WIDTH: 1136, DRAG_WIDTH: 394 },
  },
};
