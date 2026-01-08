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
import { BREAKPOINTS, SLIDER_DEFAULTS } from '../config/slider-constants.js';

/**
 * Maximum number of pagination buttons visible at once.
 * Per _SPEC.md: "Если больше 4 слайдов, отображаются первые 4 кнопки пагинации"
 * @type {number}
 */
const MAX_VISIBLE_PAGINATION = 4;

/**
 * Calculates number of Swiper slides to move for one page.
 * Accounts for Grid mode where 1 Swiper "slide" contains multiple visual cards.
 *
 * @returns {number} Number of Swiper slides per page
 */
function getSwiperSlidesPerPage() {
  const width = window.innerWidth;

  if (width >= BREAKPOINTS.DESKTOP) {
    // Desktop: no grid, 1 slide = 1 card, page = 3 cards
    return 3;
  }

  if (width >= BREAKPOINTS.TABLET) {
    // Tablet: grid rows:2, slidesPerView:2
    // 1 Swiper "slide" = 1 column = 2 cards
    // 1 page = 4 cards = 2 Swiper slides
    return 2;
  }

  // Mobile: grid rows:2, slidesPerView:1
  // 1 Swiper "slide" = 1 column = 2 cards
  // 1 page = 2 cards = 1 Swiper slide
  return 1;
}

/**
 * Reference to the Swiper instance for external access
 * @type {Swiper|null}
 */
let swiperInstance = null;

/**
 * References to navigation elements
 */
let prevArrow = null;
let nextArrow = null;

/**
 * Updates arrow disabled states based on current slider position.
 * @param {Swiper} swiper - Swiper instance
 */
function updateArrowStates(swiper) {
  if (!prevArrow || !nextArrow) return;

  const isBeginning = swiper.isBeginning;
  const isEnd = swiper.isEnd;

  prevArrow.classList.toggle('swiper-button-disabled', isBeginning);
  prevArrow.disabled = isBeginning;

  nextArrow.classList.toggle('swiper-button-disabled', isEnd);
  nextArrow.disabled = isEnd;
}

/**
 * Updates pagination with sliding window
 *
 * Behavior:
 * - If ≤4 slides: show all buttons
 * - If >4 slides: show 4 buttons with sliding window
 *
 * Sliding window logic:
 * - Slides 1-3: show buttons 1,2,3,4
 * - Slide 4: show buttons 2,3,4,5
 * - Slide N (middle): show N-2, N-1, N, N+1
 * - Last slides: show last 4 buttons
 *
 * @param {Swiper} swiper - Swiper instance
 */
function updatePaginationWindow(swiper) {
  const paginationEl = swiper.pagination.el;
  if (!paginationEl) return;

  const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
  const totalSlides = bullets.length;

  // If no bullets or only 1, nothing to do
  if (totalSlides <= 1) {
    return;
  }

  const currentSlide = swiper.activeIndex;
  let wrapper = paginationEl.querySelector('.news__pagination-wrapper');

  // If 4 or fewer slides, show all buttons and center them
  if (totalSlides <= MAX_VISIBLE_PAGINATION) {
    // Remove wrapper if it exists (unwrap bullets back to paginationEl)
    if (wrapper) {
      // Move bullets back to pagination container
      while (wrapper.firstChild) {
        paginationEl.appendChild(wrapper.firstChild);
      }
      wrapper.remove();
    }

    // Show all bullets
    bullets.forEach((bullet) => {
      bullet.style.display = 'flex';
    });

    // Center pagination when bullets are few
    paginationEl.style.justifyContent = 'center';
    return;
  }

  // More than 4 slides: use sliding window (left-aligned)
  paginationEl.style.justifyContent = 'flex-start';

  // Wrap bullets in a sliding container
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'news__pagination-wrapper';
    paginationEl.appendChild(wrapper);
  }

  // Ensure all bullets are inside wrapper
  const bulletsArray = Array.from(bullets);
  bulletsArray.forEach((bullet) => {
    if (bullet.parentElement !== wrapper) {
      wrapper.appendChild(bullet);
    }
  });

  // Calculate start index for visible window
  let startIndex;

  if (currentSlide <= 2) {
    // Slides 1-3: show buttons 1,2,3,4
    startIndex = 0;
  } else if (currentSlide >= totalSlides - 2) {
    // Last 2 slides: show last 4 buttons
    startIndex = totalSlides - MAX_VISIBLE_PAGINATION;
  } else {
    // Middle slides: current - 2
    startIndex = currentSlide - 2;
  }

  // Ensure startIndex is valid
  startIndex = Math.max(0, Math.min(startIndex, totalSlides - MAX_VISIBLE_PAGINATION));

  // Calculate transform offset based on breakpoint
  // Mobile: button 26px + gap 16px = 42px
  // Tablet/Desktop: button 32px + gap 20px = 52px
  const width = window.innerWidth;
  const buttonWidth = width >= BREAKPOINTS.TABLET ? 52 : 42;
  const offset = startIndex * buttonWidth;

  wrapper.style.transform = `translateX(-${offset}px)`;

  // Show all bullets (visibility handled by parent overflow)
  // Re-query bullets in case they were moved to wrapper
  const allBullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
  allBullets.forEach((bullet) => {
    bullet.style.display = 'flex';
  });
}

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
    speed: 600,
    watchOverflow: true,

    // ===========================================
    // MOBILE DEFAULT (320px - 767px)
    // Grid: 1 column × 2 rows = 2 cards visible
    // slidesPerGroup: 1 = pagination moves 1 column (2 cards)
    // Arrows: custom handler moves 1 page (1 Swiper slide = 2 cards)
    // ===========================================
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,
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
      renderCustom: function (swiper, current, total) {
        // Generate numbered bullets for all navigable positions
        let bullets = '';
        for (let i = 1; i <= total; i++) {
          const isActive = i === current ? 'swiper-pagination-bullet-active' : '';
          bullets += `<button class="swiper-pagination-bullet ${isActive}" type="button" aria-label="Перейти к слайду ${i}" data-slide-index="${i - 1}">${i}</button>`;
        }
        return bullets;
      },
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
        updateArrowStates(this);
        updatePaginationWindow(this);
      },
      slideChange: function () {
        updateArrowStates(this);
        updatePaginationWindow(this);
      },
      resize: function () {
        updateArrowStates(this);
        updatePaginationWindow(this);
      },
    },
  });

  // ===========================================
  // CUSTOM ARROW NAVIGATION (moves by pages)
  // - Arrows move by pages (groups of slides) - fast browsing
  // - Pagination moves by 1 slide - fine control
  // ===========================================
  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      const pageSize = getSwiperSlidesPerPage();
      const targetIndex = Math.max(0, swiperInstance.activeIndex - pageSize);
      swiperInstance.slideTo(targetIndex);
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      const pageSize = getSwiperSlidesPerPage();
      const totalSlides = swiperInstance.slides.length;

      // Allow scrolling to the last slide, even if page is incomplete
      const maxIndex = totalSlides - 1;
      const targetIndex = Math.min(maxIndex, swiperInstance.activeIndex + pageSize);

      swiperInstance.slideTo(targetIndex);
    });
  }

  // ===========================================
  // CUSTOM PAGINATION CLICK HANDLER
  // With type: 'custom', Swiper doesn't handle clicks automatically
  // All bullets created are guaranteed to be navigable (based on Swiper's total)
  // ===========================================
  if (paginationEl) {
    paginationEl.addEventListener('click', (e) => {
      const bullet = e.target.closest('.swiper-pagination-bullet');
      if (!bullet) return;

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
    updateArrowStates(swiperInstance);
  }
}
