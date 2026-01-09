// =============================================================================
// NEWS SLIDER - PAGINATION MODULE
// =============================================================================
// Handles custom pagination with sliding window for News slider
//
// BEHAVIOR:
// - If ≤4 slides: show all buttons (centered)
// - If >4 slides: show 4 buttons with sliding window (left-aligned)
//
// SLIDING WINDOW LOGIC:
// - Slides 1-3: show buttons 1,2,3,4
// - Slide 4: show buttons 2,3,4,5
// - Slide N (middle): show N-2, N-1, N, N+1
// - Last slides: show last 4 buttons
// =============================================================================

import { BREAKPOINTS, NEWS_SLIDER } from '../config/slider-constants.js';

/**
 * Updates pagination with sliding window behavior.
 *
 * @param {Swiper} swiper - Swiper instance
 */
export function updatePaginationWindow(swiper) {
  const paginationEl = swiper.pagination.el;
  if (!paginationEl) {
    return;
  }

  // Force pagination container styles via inline (overrides Swiper CSS)
  paginationEl.style.position = 'relative';
  paginationEl.style.width = window.innerWidth >= BREAKPOINTS.TABLET ? '188px' : '152px';
  paginationEl.style.overflow = 'hidden';
  paginationEl.style.display = 'flex';
  paginationEl.style.flexDirection = 'row';
  paginationEl.style.alignItems = 'center';
  paginationEl.style.top = '0';
  paginationEl.style.bottom = 'auto';
  paginationEl.style.left = 'auto';
  paginationEl.style.right = 'auto';

  const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
  const totalSlides = bullets.length;

  // If no bullets or only 1, nothing to do
  if (totalSlides <= 1) {
    return;
  }

  const currentSlide = swiper.activeIndex;
  let wrapper = paginationEl.querySelector('.news__pagination-wrapper');

  // ===========================================
  // CASE 1: ≤4 slides - show all, centered
  // ===========================================
  if (totalSlides <= NEWS_SLIDER.PAGINATION.MAX_VISIBLE) {
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

  // ===========================================
  // CASE 2: >4 slides - sliding window
  // ===========================================
  paginationEl.style.justifyContent = 'flex-start';

  // Create wrapper if it doesn't exist
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
    startIndex = totalSlides - NEWS_SLIDER.PAGINATION.MAX_VISIBLE;
  } else {
    // Middle slides: current - 2
    startIndex = currentSlide - 2;
  }

  // Ensure startIndex is valid
  startIndex = Math.max(0, Math.min(startIndex, totalSlides - NEWS_SLIDER.PAGINATION.MAX_VISIBLE));

  // Calculate transform offset based on breakpoint
  const width = window.innerWidth;
  const buttonWidth = width >= BREAKPOINTS.TABLET
    ? NEWS_SLIDER.PAGINATION.BUTTON_SIZE.TABLET
    : NEWS_SLIDER.PAGINATION.BUTTON_SIZE.MOBILE;
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
 * Renders custom pagination bullets with numbers.
 * Used as Swiper's pagination.renderCustom callback.
 *
 * @param {Swiper} swiper - Swiper instance
 * @param {number} current - Current slide index (1-based)
 * @param {number} total - Total number of navigable positions
 * @returns {string} HTML string with numbered bullets
 */
export function renderCustomPagination(swiper, current, total) {
  let bullets = '';
  for (let i = 1; i <= total; i++) {
    const isActive = i === current ? 'swiper-pagination-bullet-active' : '';
    bullets += `<button class="swiper-pagination-bullet ${isActive}" type="button" aria-label="Перейти к слайду ${i}" data-slide-index="${i - 1}">${i}</button>`;
  }
  return bullets;
}
