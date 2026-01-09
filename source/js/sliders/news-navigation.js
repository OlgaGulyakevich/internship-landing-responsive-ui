// =============================================================================
// NEWS SLIDER - NAVIGATION MODULE
// =============================================================================
// Handles arrow navigation and states for News slider
//
// NAVIGATION BEHAVIOR:
// - Pagination (numbers): moves 1 slide at a time (fine control)
// - Arrows (prev/next): moves 1 page at a time (fast browsing)
//
// PAGE SIZES:
// - Mobile: 1 Swiper slide = 2 visual cards (1 col × 2 rows)
// - Tablet: 2 Swiper slides = 4 visual cards (2 cols × 2 rows)
// - Desktop: 3 Swiper slides = 3 visual cards (3 cols × 1 row)
// =============================================================================

import { BREAKPOINTS, NEWS_SLIDER } from '../config/slider-constants.js';

/**
 * Calculates number of Swiper slides to move for one page.
 * Accounts for Grid mode where 1 Swiper "slide" contains multiple visual cards.
 *
 * @returns {number} Number of Swiper slides per page
 */
export function getSwiperSlidesPerPage() {
  const width = window.innerWidth;

  if (width >= BREAKPOINTS.DESKTOP) {
    return NEWS_SLIDER.SLIDES_PER_PAGE.DESKTOP;
  }

  if (width >= BREAKPOINTS.TABLET) {
    return NEWS_SLIDER.SLIDES_PER_PAGE.TABLET;
  }

  return NEWS_SLIDER.SLIDES_PER_PAGE.MOBILE;
}

/**
 * Updates arrow disabled states based on current slider position.
 *
 * @param {Swiper} swiper - Swiper instance
 * @param {HTMLElement} prevArrow - Previous arrow button
 * @param {HTMLElement} nextArrow - Next arrow button
 */
export function updateArrowStates(swiper, prevArrow, nextArrow) {
  if (!prevArrow || !nextArrow) {
    return;
  }

  const isBeginning = swiper.isBeginning;
  const isEnd = swiper.isEnd;

  prevArrow.classList.toggle('swiper-button-disabled', isBeginning);
  prevArrow.disabled = isBeginning;

  nextArrow.classList.toggle('swiper-button-disabled', isEnd);
  nextArrow.disabled = isEnd;
}

/**
 * Sets up custom arrow navigation handlers.
 * Arrows move by pages (groups of slides) for fast browsing.
 *
 * @param {Swiper} swiper - Swiper instance
 * @param {HTMLElement} prevArrow - Previous arrow button
 * @param {HTMLElement} nextArrow - Next arrow button
 */
export function setupArrowNavigation(swiper, prevArrow, nextArrow) {
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
}
