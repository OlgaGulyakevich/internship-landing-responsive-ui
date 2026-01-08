// =============================================================================
// SLIDER CONFIGURATION CONSTANTS
// =============================================================================
// Shared configuration for all sliders: programs, news, reviews, hero
// Matches CSS breakpoints and design specifications

import { Pagination } from "swiper/modules";

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

// News slider specific configuration (will be added later)
export const NEWS_SLIDER = {
  PAGINATION: {
    MAX_VISIBLE_PAGINATION: 4,
  },
};

// Reviews slider specific configuration (will be added later)
export const REVIEWS_SLIDER = {
  // Future configuration
};
