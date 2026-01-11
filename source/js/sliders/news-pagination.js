// =============================================================================
// NEWS SLIDER - PAGINATION MODULE
// =============================================================================
// Custom pagination with sliding window (max 4 visible)
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

  // Force container styles via inline (overrides Swiper CSS)
  const containerWidth = window.innerWidth >= BREAKPOINTS.TABLET
    ? NEWS_SLIDER.PAGINATION.CONTAINER_WIDTH.TABLET
    : NEWS_SLIDER.PAGINATION.CONTAINER_WIDTH.MOBILE;

  paginationEl.style.position = 'relative';
  paginationEl.style.width = `${containerWidth}px`;
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

  if (totalSlides <= 1) {
    return;
  }

  const currentSlide = swiper.activeIndex;
  let wrapper = paginationEl.querySelector('.news__pagination-wrapper');

  // Case 1: ≤4 slides - show all, centered
  if (totalSlides <= NEWS_SLIDER.PAGINATION.MAX_VISIBLE) {
    if (wrapper) {
      while (wrapper.firstChild) {
        paginationEl.appendChild(wrapper.firstChild);
      }
      wrapper.remove();
    }

    bullets.forEach((bullet) => {
      bullet.style.display = 'flex';
    });

    paginationEl.style.justifyContent = 'center';
    return;
  }

  // Case 2: >4 slides - sliding window
  paginationEl.style.justifyContent = 'flex-start';

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'news__pagination-wrapper';
    paginationEl.appendChild(wrapper);
  }

  const bulletsArray = Array.from(bullets);
  bulletsArray.forEach((bullet) => {
    if (bullet.parentElement !== wrapper) {
      wrapper.appendChild(bullet);
    }
  });

  // Calculate visible window start index
  let startIndex;

  if (currentSlide <= 2) {
    startIndex = 0;
  } else if (currentSlide >= totalSlides - 2) {
    startIndex = totalSlides - NEWS_SLIDER.PAGINATION.MAX_VISIBLE;
  } else {
    startIndex = currentSlide - 2;
  }

  startIndex = Math.max(0, Math.min(startIndex, totalSlides - NEWS_SLIDER.PAGINATION.MAX_VISIBLE));
  const width = window.innerWidth;
  const buttonWidth = width >= BREAKPOINTS.TABLET
    ? NEWS_SLIDER.PAGINATION.BUTTON_SIZE.TABLET
    : NEWS_SLIDER.PAGINATION.BUTTON_SIZE.MOBILE;
  const offset = startIndex * buttonWidth;

  // Move wrapper instantly (no animation for smooth per-button effect)
  wrapper.style.transition = 'none';
  wrapper.style.transform = `translateX(-${offset}px)`;

  // eslint-disable-next-line no-unused-expressions
  wrapper.offsetHeight; // Force reflow

  const allBullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
  allBullets.forEach((bullet) => {
    bullet.style.display = 'flex';
  });
}

/**
 * Renders custom pagination bullets with numbers.
 *
 * @param {Swiper} _swiper - Swiper instance (unused, required by API)
 * @param {number} current - Current slide index (1-based)
 * @param {number} total - Total number of navigable positions
 * @returns {string} HTML string with numbered bullets
 */
export function renderCustomPagination(_swiper, current, total) {
  let bullets = '';
  for (let i = 1; i <= total; i++) {
    const isActive = i === current ? 'swiper-pagination-bullet-active' : '';
    bullets += `<button class="swiper-pagination-bullet ${isActive}" type="button" aria-label="Перейти к слайду ${i}" data-slide-index="${i - 1}">${i}</button>`;
  }
  return bullets;
}
