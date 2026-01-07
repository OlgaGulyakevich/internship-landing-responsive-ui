// =============================================================================
// NEWS SLIDER CONFIGURATION
// =============================================================================
// Swiper slider for News section with vertical layout on mobile
//
// FEATURES:
// - Mobile: 2 cards vertical (direction: vertical, slidesPerView: 2)
// - Tablet: 2×2 grid (4 cards per page) using Swiper Grid
// - Desktop: 3 cards horizontal (1 row)
// - Advanced navigation: Arrows scroll pages, pagination scrolls slides
// - Custom pagination (4 numbered buttons with sliding window)
// - Not looped, no autoplay
//
// REFERENCES:
// - https://swiperjs.com/swiper-api#grid
// - _SPEC.md lines 233-237 (advanced task)
// =============================================================================

import Swiper from 'swiper';
import { Navigation, Pagination, Grid, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { BREAKPOINTS, SLIDER_DEFAULTS } from '../config/slider-constants.js';

/**
 * Calculates slides per group (page size) based on current viewport width.
 * Used for custom arrow navigation: arrows move by pages, not single slides.
 *
 * @returns {number} Number of Swiper slides to move per arrow click
 */
function getSlidesPerGroup() {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.DESKTOP) {
    return 3; // Desktop: 3 slides per page (3×1)
  }
  if (width >= BREAKPOINTS.TABLET) {
    return 1; // Tablet: Grid mode handles grouping, move 1 "slide" = 4 cards
  }
  return 1; // Mobile: Grid mode with rows: 2, move 1 "column" = 2 cards (1 page)
}

/**
 * Initializes News slider with Swiper.
 * Implements advanced navigation per _SPEC.md (lines 233-237):
 * - Arrows scroll by pages (groups of slides)
 * - Pagination scrolls by single slides
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

  // Swiper configuration with vertical layout for mobile
  const swiper = new Swiper(sliderElement, {
    modules: [Navigation, Pagination, Grid, Keyboard, A11y],

    // Core settings
    loop: false,
    speed: 600,
    watchOverflow: true,

    // ===========================================
    // MOBILE DEFAULT (320px - 767px)
    // Grid mode: 1 column × 2 rows = 2 cards per page vertically
    // With fill: 'column', cards fill columns first: [1,2] | [3,4] | [5,6]
    // Container height: 590px = 330px (large card) + 240px (small card) + 20px gap
    // ===========================================
    slidesPerView: 1, // 1 column visible
    slidesPerGroup: 1, // Move 1 "column" = 2 cards (1 page)
    spaceBetween: 20,
    grid: {
      rows: 2, // 2 rows stacked vertically
      fill: 'row', // Fill rows first - we fix order with CSS
    },

    // ===========================================
    // RESPONSIVE BREAKPOINTS
    // ===========================================
    breakpoints: {
      // Tablet (768px - 1439px)
      // Grid: 2 columns × 2 rows = 4 cards per page
      // With fill: 'row', Swiper fills: Row1=[1,2,3], Row2=[4,5,6]
      // Then columns: [1,4], [2,5], [3,6] - we fix order with CSS
      [BREAKPOINTS.TABLET]: {
        direction: 'horizontal',
        slidesPerView: 2,
        slidesPerGroup: 1, // Move 1 "page" = 4 cards (2×2)
        spaceBetween: SLIDER_DEFAULTS.SPACING.TABLET,
        grid: {
          rows: 2,
          fill: 'row', // Same as mobile for consistency
        },
      },
      // Desktop (1440px+)
      // Horizontal slider with variable width cards (first card is wider)
      // slidesPerView: 'auto' respects each slide's CSS width
      [BREAKPOINTS.DESKTOP]: {
        direction: 'horizontal',
        slidesPerView: 'auto', // Use CSS widths (604px for first, 286px for others)
        slidesPerGroup: 3, // Move 3 cards per arrow click
        spaceBetween: SLIDER_DEFAULTS.SPACING.DESKTOP,
        // Explicitly disable grid for desktop - single horizontal row
        grid: {
          rows: 1,
          fill: 'row',
        },
      },
    },

    // ===========================================
    // PAGINATION (moves 1 slide at a time)
    // ===========================================
    pagination: {
      el: '.news__pagination',
      clickable: true,
      renderBullet: (index, className) => {
        const pageNumber = index + 1;
        return `<button class="${className}" type="button" aria-label="Перейти к слайду ${pageNumber}">${pageNumber}</button>`;
      },
    },

    // Disable built-in navigation (we handle arrows manually for page-based scrolling)
    navigation: false,

    // ===========================================
    // ACCESSIBILITY
    // ===========================================
    a11y: {
      prevSlideMessage: 'Предыдущая страница',
      nextSlideMessage: 'Следующая страница',
      firstSlideMessage: 'Это первая страница',
      lastSlideMessage: 'Это последняя страница',
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
        updatePaginationVisibility(this);
      },
      slideChange: function () {
        updateArrowStates(this);
        updatePaginationVisibility(this);
      },
      resize: function () {
        updateArrowStates(this);
      },
    },
  });

  // ===========================================
  // CUSTOM ARROW NAVIGATION (pages, not slides)
  // Per _SPEC.md: Arrows move by slidesPerGroup (page)
  // ===========================================
  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      const groupSize = getSlidesPerGroup();
      const targetIndex = Math.max(0, swiper.activeIndex - groupSize);
      swiper.slideTo(targetIndex);
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      const groupSize = getSlidesPerGroup();
      const totalSlides = swiper.slides.length;
      const targetIndex = Math.min(totalSlides - 1, swiper.activeIndex + groupSize);
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
   * Updates pagination with sliding window animation.
   * Shows 4 buttons at a time, slides container when navigating beyond visible range.
   * @param {Swiper} swiperInstance - Swiper instance
   */
  function updatePaginationVisibility(swiperInstance) {
    const paginationEl = swiperInstance.pagination.el;
    if (!paginationEl) return;

    const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
    const totalSlides = bullets.length;
    const currentIndex = swiperInstance.activeIndex;
    const maxVisible = 4;

    // If 4 or fewer slides, no need to slide pagination
    if (totalSlides <= maxVisible) {
      bullets.forEach((bullet) => {
        bullet.style.display = 'flex';
      });
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

    // Calculate which button should be at the start of visible window
    let startIndex;

    if (currentIndex <= 2) {
      startIndex = 0;
    } else if (currentIndex >= totalSlides - 2) {
      startIndex = totalSlides - maxVisible;
    } else {
      startIndex = currentIndex - 2;
    }

    // Calculate transform offset
    const buttonWidth = 48;
    const gap = 10;
    const offset = startIndex * (buttonWidth + gap);

    wrapper.style.transform = `translateX(-${offset}px)`;

    bullets.forEach((bullet) => {
      bullet.style.display = 'flex';
    });
  }

  return swiper;
}
