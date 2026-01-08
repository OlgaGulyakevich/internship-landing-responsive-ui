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

  // Custom navigation buttons (arrows)
  const prevArrow = document.querySelector('.news__arrow--prev');
  const nextArrow = document.querySelector('.news__arrow--next');

  // Swiper configuration
  const swiper = new Swiper(sliderElement, {
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
    // PAGINATION (moves 1 slide at a time - fine control)
    // Renders numbered buttons 1, 2, 3...
    // ===========================================
    pagination: {
      el: '.news__pagination',
      clickable: true,
      renderBullet: (index, className) => {
        const pageNumber = index + 1;
        return `<button class="${className}" type="button" aria-label="Перейти к слайду ${pageNumber}">${pageNumber}</button>`;
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
      const targetIndex = Math.max(0, swiper.activeIndex - pageSize);
      swiper.slideTo(targetIndex);
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      const pageSize = getSwiperSlidesPerPage();
      const totalSlides = swiper.slides.length;

      // Allow scrolling to the last slide, even if page is incomplete
      const maxIndex = totalSlides - 1;
      const targetIndex = Math.min(maxIndex, swiper.activeIndex + pageSize);

      swiper.slideTo(targetIndex);
    });
  }

  /**
   * Updates arrow disabled states based on current slider position.
   * @param {Swiper} swiperInstance - Swiper instance
   */
  function updateArrowStates(swiperInstance) {
    if (!prevArrow || !nextArrow) return;

    const isBeginning = swiperInstance.isBeginning;
    const isEnd = swiperInstance.isEnd;

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
   * @param {Swiper} swiperInstance - Swiper instance
   */
  function updatePaginationWindow(swiperInstance) {
    const paginationEl = swiperInstance.pagination.el;
    if (!paginationEl) return;

    const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
    const totalSlides = bullets.length;

    // If no bullets or only 1, nothing to do
    if (totalSlides <= 1) {
      return;
    }

    const currentSlide = swiperInstance.activeIndex;

    // If 4 or fewer slides, show all buttons
    if (totalSlides <= MAX_VISIBLE_PAGINATION) {
      bullets.forEach((bullet) => {
        bullet.style.display = 'flex';
      });
      // Remove wrapper transform if exists
      const wrapper = paginationEl.querySelector('.news__pagination-wrapper');
      if (wrapper) {
        wrapper.style.transform = 'translateX(0)';
      }
      return;
    }

    // Wrap bullets in a sliding container (only once)
    let wrapper = paginationEl.querySelector('.news__pagination-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'news__pagination-wrapper';

      // Move all bullets into wrapper
      bullets.forEach((bullet) => {
        wrapper.appendChild(bullet);
      });

      paginationEl.appendChild(wrapper);
    }

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
    bullets.forEach((bullet) => {
      bullet.style.display = 'flex';
    });
  }

  return swiper;
}
