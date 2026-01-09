// =============================================================================
// NEWS SLIDER CONFIGURATION
// =============================================================================
// Swiper slider for News section with responsive grid layouts
//
// FEATURES:
// - Mobile: 2 cards per page (1 column × 2 rows)
// - Tablet: 4 cards per page (2 columns × 2 rows)
// - Desktop: 3 cards per page (3 columns × 1 row)
// - Advanced navigation per _SPEC.md (lines 233-237):
//   * Pagination: moves by 1 slide (fine control)
//   * Arrows: moves by 1 page/group (fast browsing)
// - Custom pagination with sliding window (max 4 visible buttons)
// - Not looped, no autoplay
//
// REFERENCES:
// - https://swiperjs.com/swiper-api#grid
// - _SPEC.md lines 197-237 (pagination behavior + advanced task)
// =============================================================================

import Swiper from 'swiper';
import { Navigation, Pagination, Grid, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { BREAKPOINTS, SLIDER_DEFAULTS, NEWS_SLIDER } from '../config/slider-constants.js';
import { updatePaginationWindow, renderCustomPagination } from './news-pagination.js';
import { updateArrowStates, setupArrowNavigation } from './news-navigation.js';

/**
 * Reference to the Swiper instance for external access
 * @type {Swiper|null}
 */
let swiperInstance = null;

/**
 * References to navigation elements (stored for updateNewsPagination)
 */
let prevArrow = null;
let nextArrow = null;

/**
 * Initializes News slider with Swiper.
 *
 * Navigation logic per _SPEC.md (lines 233-237):
 * - Pagination (numbers): moves 1 slide at a time (fine control)
 * - Arrows (prev/next): moves 1 page at a time (fast browsing)
 *
 * Implementation:
 * - slidesPerGroup: 1 (for pagination to move 1 slide)
 * - Custom arrow handlers move by getSwiperSlidesPerPage()
 *
 * @returns {Swiper|null} Swiper instance or null if element not found
 */
export function initNewsSlider() {
  const sliderElement = document.querySelector('.news__slider');

  if (!sliderElement) {
    return null;
  }

  // Store references to navigation elements at module level
  prevArrow = document.querySelector('.news__arrow--prev');
  nextArrow = document.querySelector('.news__arrow--next');
  const paginationEl = document.querySelector('.news__pagination');

  // Swiper configuration
  swiperInstance = new Swiper(sliderElement, {
    modules: [Navigation, Pagination, Grid, Keyboard, A11y],

    // Core settings
    loop: false,
    speed: SLIDER_DEFAULTS.SPEED,
    watchOverflow: true,

    // ===========================================
    // MOBILE DEFAULT (320px - 767px)
    // Grid: 1 column × 2 rows = 2 cards visible
    // slidesPerGroup: 1 = pagination moves 1 column (2 cards)
    // Arrows: custom handler moves 1 page (1 Swiper slide = 2 cards)
    // ===========================================
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: NEWS_SLIDER.SPACING.MOBILE,
    grid: {
      rows: 2,
      fill: 'row',
    },

    // ===========================================
    // RESPONSIVE BREAKPOINTS
    // ===========================================
    breakpoints: {
      // -----------------------------------------
      // TABLET (768px - 1439px)
      // Grid: 2 columns × 2 rows = 4 cards visible
      // slidesPerGroup: 1 = pagination moves 1 column (2 cards)
      // Arrows: custom handler moves 1 page (2 Swiper slides = 4 cards)
      // -----------------------------------------
      [BREAKPOINTS.TABLET]: {
        direction: 'horizontal',
        slidesPerView: 2,
        slidesPerGroup: 1, // Pagination moves 1 column = 2 cards
        spaceBetween: SLIDER_DEFAULTS.SPACING.TABLET,
        grid: {
          rows: 2,
          fill: 'row',
        },
      },

      // -----------------------------------------
      // DESKTOP (1440px+)
      // Single row: variable width cards (1st card is wider)
      // slidesPerView: 'auto' respects CSS widths
      // slidesPerGroup: 1 = pagination moves 1 card
      // Arrows: custom handler moves 1 page (3 cards)
      // -----------------------------------------
      [BREAKPOINTS.DESKTOP]: {
        direction: 'horizontal',
        slidesPerView: 'auto', // Use CSS widths (604px for 1st, 286px for others)
        slidesPerGroup: 1, // Pagination moves 1 card
        spaceBetween: SLIDER_DEFAULTS.SPACING.DESKTOP,
        grid: {
          rows: 1,
          fill: 'row',
        },
      },
    },

    // ===========================================
    // PAGINATION - CUSTOM
    // Using custom renderCustom to manually create numbered bullets
    // Swiper's 'total' parameter accounts for slidesPerView + Grid mode,
    // ensuring only navigable positions get bullets
    // ===========================================
    pagination: {
      el: '.news__pagination',
      clickable: true,
      type: 'custom',
      renderCustom: renderCustomPagination,
    },

    // Disable built-in navigation (we use custom arrows for page-based scrolling)
    navigation: false,

    // ===========================================
    // ACCESSIBILITY
    // ===========================================
    a11y: {
      prevSlideMessage: 'Предыдущий слайд',
      nextSlideMessage: 'Следующий слайд',
      firstSlideMessage: 'Это первый слайд',
      lastSlideMessage: 'Это последний слайд',
      paginationBulletMessage: 'Перейти к слайду {{index}}',
    },

    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // ===========================================
    // EVENT HANDLERS
    // ===========================================
    on: {
      init: function () {
        this.el.setAttribute('tabindex', '0');
        updateArrowStates(this, prevArrow, nextArrow);
        updatePaginationWindow(this);
      },
      slideChange: function () {
        updateArrowStates(this, prevArrow, nextArrow);
        updatePaginationWindow(this);
      },
      resize: function () {
        updateArrowStates(this, prevArrow, nextArrow);
        updatePaginationWindow(this);
      },
    },
  });

  // ===========================================
  // CUSTOM ARROW NAVIGATION (moves by pages)
  // - Arrows move by pages (groups of slides) - fast browsing
  // - Pagination moves by 1 slide - fine control
  // ===========================================
  setupArrowNavigation(swiperInstance, prevArrow, nextArrow);

  // ===========================================
  // CUSTOM PAGINATION CLICK HANDLER
  // With type: 'custom', Swiper doesn't handle clicks automatically
  // All bullets created are guaranteed to be navigable (based on Swiper's total)
  // ===========================================
  if (paginationEl) {
    paginationEl.addEventListener('click', (e) => {
      const bullet = e.target.closest('.swiper-pagination-bullet');
      if (!bullet) {
        return;
      }

      const slideIndex = parseInt(bullet.getAttribute('data-slide-index'), 10);
      if (!isNaN(slideIndex)) {
        swiperInstance.slideTo(slideIndex);
      }
    });
  }

  return swiperInstance;
}

/**
 * Updates news pagination window manually.
 * Call this after updating Swiper content (e.g., when switching tabs).
 * @public
 */
export function updateNewsPagination() {
  if (swiperInstance) {
    updatePaginationWindow(swiperInstance);
    updateArrowStates(swiperInstance, prevArrow, nextArrow);
  }
}
