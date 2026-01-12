// =============================================================================
// REVIEWS SLIDER
// =============================================================================
// Swiper slider for Reviews section with custom scrollbar
//
// FEATURES:
// - Mobile: 1 slide visible (auto width)
// - Tablet: auto width (shows partial next slide)
// - Desktop: 2 slides visible
// - Custom scrollbar with dynamic drag width (based on visible slides)
// - Not looped, no autoplay
// - Navigation: arrows on mobile (top-right), scrollbar + arrows on tablet/desktop
// =============================================================================

import Swiper from 'swiper';
import { Navigation, Scrollbar, Keyboard, Mousewheel, A11y } from 'swiper/modules';
import { BREAKPOINTS, SLIDER_DEFAULTS, REVIEWS_SLIDER } from '../config/slider-constants.js';

/**
 * Initializes Reviews Swiper slider.
 * @returns {Swiper|null} Swiper instance or null if container not found
 */
export function initReviewsSlider() {
  const sliderElement = document.querySelector('.reviews__slider');

  if (!sliderElement) {
    // eslint-disable-next-line no-console
    console.warn('Reviews slider container not found');
    return null;
  }

  // ===========================================
  // SCROLLBAR DRAG WIDTH CALCULATION
  // ===========================================
  // Calculate drag width based on visible slides vs total slides
  // Formula: (visible / total) × scrollbar width

  /**
   * Sets scrollbar drag width based on current viewport.
   * Called on init and resize.
   */
  const setDragWidth = () => {
    const dragEl = document.querySelector('.reviews__scrollbar .swiper-scrollbar-drag');
    if (!dragEl) {
      return;
    }

    const width = window.innerWidth;
    let dragWidth;

    if (width >= BREAKPOINTS.DESKTOP) {
      dragWidth = REVIEWS_SLIDER.SCROLLBAR.DESKTOP.DRAG_WIDTH;
    } else if (width >= BREAKPOINTS.TABLET) {
      dragWidth = REVIEWS_SLIDER.SCROLLBAR.TABLET.DRAG_WIDTH;
    } else {
      // Mobile: no scrollbar
      return;
    }

    dragEl.style.width = `${dragWidth}px`;
  };

  /**
   * Updates drag position based on Swiper progress.
   * Called on setTranslate event.
   * @param {Swiper} swiperInstance - Swiper instance
   */
  const updateDragPosition = (swiperInstance) => {
    const dragEl = document.querySelector('.reviews__scrollbar .swiper-scrollbar-drag');
    if (!dragEl) {
      return;
    }

    const width = window.innerWidth;
    let scrollbarWidth;
    let dragWidth;

    if (width >= BREAKPOINTS.DESKTOP) {
      scrollbarWidth = REVIEWS_SLIDER.SCROLLBAR.DESKTOP.WIDTH;
      dragWidth = REVIEWS_SLIDER.SCROLLBAR.DESKTOP.DRAG_WIDTH;
    } else if (width >= BREAKPOINTS.TABLET) {
      scrollbarWidth = REVIEWS_SLIDER.SCROLLBAR.TABLET.WIDTH;
      dragWidth = REVIEWS_SLIDER.SCROLLBAR.TABLET.DRAG_WIDTH;
    } else {
      return;
    }

    // Calculate progress (0 to 1)
    const currentTranslate = Math.abs(swiperInstance.translate);
    const maxTranslate = Math.abs(swiperInstance.maxTranslate());
    const progress = maxTranslate > 0 ? currentTranslate / maxTranslate : 0;

    // Calculate drag position
    const maxDragOffset = scrollbarWidth - dragWidth;
    const translateX = progress * maxDragOffset;

    // Apply transform
    dragEl.style.transform = `translate3d(${translateX}px, 0, 0)`;
  };

  // Swiper configuration
  const swiper = new Swiper(sliderElement, {
    // Modules
    modules: [Navigation, Scrollbar, Keyboard, Mousewheel, A11y],

    // Core settings
    loop: false,
    autoplay: false,
    speed: SLIDER_DEFAULTS.SPEED,
    resistance: true,
    resistanceRatio: 0.85,
    watchOverflow: false, // Keep navigation active even if all slides fit

    // Responsive breakpoints (mobile-first)
    slidesPerView: 'auto',
    spaceBetween: SLIDER_DEFAULTS.SPACING.MOBILE,

    breakpoints: {
      // Tablet (768px+)
      [BREAKPOINTS.TABLET]: {
        slidesPerView: 'auto',
        spaceBetween: SLIDER_DEFAULTS.SPACING.TABLET,
        allowTouchMove: true, // Enable touch/mouse drag
      },
      // Desktop (1440px+)
      [BREAKPOINTS.DESKTOP]: {
        slidesPerView: 2,
        spaceBetween: SLIDER_DEFAULTS.SPACING.DESKTOP,
        centeredSlides: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        allowTouchMove: true,
      },
    },

    // Scrollbar pagination (tablet/desktop only)
    scrollbar: {
      el: '.reviews__scrollbar',
      draggable: true,
      dragClass: 'swiper-scrollbar-drag',
      snapOnRelease: true, // Snap to slide on release
    },

    // Navigation arrows (both mobile and tablet/desktop)
    navigation: {
      prevEl: '.reviews__arrow--prev, .reviews__nav-arrow--prev',
      nextEl: '.reviews__arrow--next, .reviews__nav-arrow--next',
      disabledClass: 'swiper-button-disabled',
    },

    // Accessibility
    a11y: {
      prevSlideMessage: 'Предыдущий отзыв',
      nextSlideMessage: 'Следующий отзыв',
      firstSlideMessage: 'Это первый отзыв',
      lastSlideMessage: 'Это последний отзыв',
    },

    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Mouse wheel control (tablet/desktop)
    mousewheel: {
      forceToAxis: true,
      invert: false,
    },

    // Event handlers
    on: {
      // Initialize drag width and position
      init: function () {
        this.el.setAttribute('tabindex', '0'); // Make slider focusable for keyboard navigation
        setDragWidth();
      },

      // Update drag width and position on window resize (DevTools open/close, responsive mode switch)
      resize: function () {
        setDragWidth();
        updateDragPosition(this);
      },

      // Update drag position on scroll
      setTranslate: function () {
        setDragWidth();
        updateDragPosition(this);
      },
    },
  });

  return swiper;
}
