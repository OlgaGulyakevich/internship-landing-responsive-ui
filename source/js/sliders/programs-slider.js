// =============================================================================
// PROGRAMS SLIDER CONFIGURATION
// =============================================================================
// Swiper slider for Programs section with scrollbar pagination
//
// FEATURES:
// - Not looped, no autoplay
// - Mobile: 1 slide, arrows in header
// - Tablet: 2.2 slides visible (partial 3rd slide)
// - Desktop: 3 slides, mouse drag disabled
// - Scrollbar pagination (tablet/desktop)
// - Navigation arrows (all breakpoints, different positions)
//
// REFERENCES:
// - https://swiperjs.com/demos#scrollbar
// - https://codesandbox.io/p/sandbox/2cmgld
// =============================================================================

import Swiper from 'swiper';
import { Navigation, Scrollbar, Keyboard, Mousewheel, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { BREAKPOINTS, SLIDER_DEFAULTS, PROGRAMS_SLIDER } from '../config/slider-constants.js';

/**
 * Initialize Programs slider
 */
export function initProgramsSlider() {
  const sliderElement = document.querySelector('.programs__slider');

  if (!sliderElement) {
    return;
  }

  // Helper: Set fixed drag width (overrides Swiper's dynamic width)
  const setDragWidth = () => {
    const dragEl = document.querySelector('.programs__scrollbar .swiper-scrollbar-drag');
    if (!dragEl) {
      return null;
    }

    const isDesktop = window.innerWidth >= BREAKPOINTS.DESKTOP;
    const isTablet = window.innerWidth >= BREAKPOINTS.TABLET;

    let width = '';
    if (isDesktop) {
      width = `${PROGRAMS_SLIDER.SCROLLBAR.DESKTOP.DRAG_WIDTH}px`;
    } else if (isTablet) {
      width = `${PROGRAMS_SLIDER.SCROLLBAR.TABLET.DRAG_WIDTH}px`;
    }

    if (width) {
      dragEl.style.setProperty('width', width, 'important');
    }

    return dragEl;
  };

  // Helper: Calculate and apply drag position based on slider progress
  const updateDragPosition = (swiperInstance) => {
    const dragEl = document.querySelector('.programs__scrollbar .swiper-scrollbar-drag');
    if (!dragEl) {
      return;
    }

    const isDesktop = window.innerWidth >= BREAKPOINTS.DESKTOP;
    const isTablet = window.innerWidth >= BREAKPOINTS.TABLET;

    // Calculate progress (0 to 1)
    const currentTranslate = Math.abs(swiperInstance.translate);
    const maxTranslate = Math.abs(swiperInstance.maxTranslate());
    const progress = maxTranslate > 0 ? currentTranslate / maxTranslate : 0;

    // Scrollbar and drag widths from design
    let scrollbarWidth = 0;
    let dragWidth = 0;

    if (isDesktop) {
      scrollbarWidth = PROGRAMS_SLIDER.SCROLLBAR.DESKTOP.WIDTH;
      dragWidth = PROGRAMS_SLIDER.SCROLLBAR.DESKTOP.DRAG_WIDTH;
    } else if (isTablet) {
      scrollbarWidth = PROGRAMS_SLIDER.SCROLLBAR.TABLET.WIDTH;
      dragWidth = PROGRAMS_SLIDER.SCROLLBAR.TABLET.DRAG_WIDTH;
    }

    // Calculate drag travel range and position
    const dragMaxTranslate = scrollbarWidth - dragWidth;
    const translateX = Math.min(Math.max(progress * dragMaxTranslate, 0), dragMaxTranslate);

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
    watchOverflow: true, // Disable navigation if all slides fit

    // Responsive breakpoints (mobile-first)
    slidesPerView: 'auto', // Auto width based on CSS
    spaceBetween: SLIDER_DEFAULTS.SPACING.MOBILE,

    breakpoints: {
      // Tablet (768px+)
      [BREAKPOINTS.TABLET]: {
        slidesPerView: 'auto', // Auto width - shows 2.2 slides (2 full + partial 3rd)
        spaceBetween: SLIDER_DEFAULTS.SPACING.TABLET,
        allowTouchMove: true, // Enable touch/mouse drag
      },
      // Desktop (1440px+)
      [BREAKPOINTS.DESKTOP]: {
        slidesPerView: 3, // 3 full slides
        spaceBetween: SLIDER_DEFAULTS.SPACING.DESKTOP,
        centeredSlides: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        allowTouchMove: false,
      },
    },

    // Scrollbar pagination (tablet/desktop only)
    scrollbar: {
      el: '.programs__scrollbar',
      draggable: true,
      dragClass: 'swiper-scrollbar-drag',
      snapOnRelease: true, // Snap to slide on release
    },

    // Navigation arrows (both mobile and tablet/desktop)
    navigation: {
      prevEl: '.programs__arrow--prev, .programs__nav-arrow--prev',
      nextEl: '.programs__arrow--next, .programs__nav-arrow--next',
      disabledClass: 'swiper-button-disabled',
    },

    // Accessibility
    a11y: {
      prevSlideMessage: 'Предыдущий слайд',
      nextSlideMessage: 'Следующий слайд',
      firstSlideMessage: 'Это первый слайд',
      lastSlideMessage: 'Это последний слайд',
    },

    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Mouse wheel control
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
    },

    // Custom scrollbar drag positioning
    on: {
      // Set initial drag width and make slider keyboard-accessible
      init: function() {
        this.el.setAttribute('tabindex', '0'); // Make slider focusable for keyboard navigation
        setDragWidth();
      },

      // Update drag width and position on window resize (DevTools open/close, responsive mode switch)
      resize: function() {
        setDragWidth();
        updateDragPosition(this);
      },

      // Update drag position on scroll
      setTranslate: function() {
        setDragWidth();
        updateDragPosition(this);
      },
    },
  });

  return swiper;
}
