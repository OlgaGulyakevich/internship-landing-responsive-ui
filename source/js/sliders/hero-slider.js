/**
 * Hero Slider Module
 * Manages hero section Swiper slider
 * - Looped slider with fade transition (crossFade)
 * - Fixed hero container height, dynamic content block height
 * - Custom pagination bullets (cloned to each slide)
 * - Keyboard navigation (arrows, Home/End)
 * - Accessibility: ARIA attributes, screen reader announcements
 * - Desktop: touch/drag disabled
 * - Mobile/Tablet: swipe enabled
 * - Transition speed: 300ms
 */

import Swiper from 'swiper';
import { Pagination, Keyboard, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { BREAKPOINTS, SLIDER_DEFAULTS } from '../config/slider-constants.js';

const heroSlider = (() => {
  const swiperContainer = document.querySelector('.hero__swiper');

  if (!swiperContainer) {
    return;
  }

  const initSlider = () => {
    const swiper = new Swiper('.hero__swiper', {
      modules: [Pagination, Keyboard, EffectFade],

      // Loop slider
      loop: true,

      // No gap between slides
      spaceBetween: 0,

      // Disable touch/drag on desktop by default
      allowTouchMove: window.innerWidth < BREAKPOINTS.DESKTOP,

      // Speed
      speed: SLIDER_DEFAULTS.SPEED,

      // Effect: Fade
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },

      // Keyboard navigation
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },

      // Pagination
      pagination: {
        el: '.hero__pagination',
        type: 'bullets',
        clickable: true,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
      },

      // Responsive breakpoints
      breakpoints: {
        // Desktop (1440px and up)
        [BREAKPOINTS.DESKTOP]: {
          allowTouchMove: false, // Disable swipe on desktop
        },
      },
      // Callbacks
      on: {
        init: function() {
          // Use requestAnimationFrame for better performance and synchronization with browser rendering
          requestAnimationFrame(() => {
            // Get original pagination and all slide wrappers (excluding clones)
            const paginationEl = document.querySelector('.hero__pagination');
            const allWrappers = document.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .hero__pagination-wrapper');

            if (!paginationEl || allWrappers.length === 0) {
              return;
            }

            // 1. Move original pagination to first slide
            allWrappers[0].appendChild(paginationEl);

            // 2. Clone pagination for other slides
            for (let i = 1; i < allWrappers.length; i++) {
              const clonedPagination = paginationEl.cloneNode(true);
              clonedPagination.classList.add('hero__pagination--clone');
              allWrappers[i].appendChild(clonedPagination);
            }

            // 3. Add click handlers and accessibility attributes to all bullets (original + clones)
            const allPaginations = document.querySelectorAll('.hero__pagination, .hero__pagination--clone');
            allPaginations.forEach((pagination) => {
              const bullets = pagination.querySelectorAll('.swiper-pagination-bullet');
              bullets.forEach((bullet, index) => {
                // Accessibility attributes
                bullet.setAttribute('role', 'button');
                bullet.setAttribute('tabindex', '0');
                bullet.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);

                // Click handler
                bullet.addEventListener('click', () => {
                  swiper.slideToLoop(index);
                });

                // Keyboard handler (Enter/Space)
                bullet.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    swiper.slideToLoop(index);
                  }
                });
              });
            });
          });
        },

        slideChange: function(swiperInstance) {
          // Synchronize active bullet across all pagination instances
          const realIndex = swiperInstance.realIndex;
          const allPaginations = document.querySelectorAll('.hero__pagination, .hero__pagination--clone');

          allPaginations.forEach((pagination) => {
            const bullets = pagination.querySelectorAll('.swiper-pagination-bullet');
            bullets.forEach((bullet, index) => {
              if (index === realIndex) {
                bullet.classList.add('swiper-pagination-bullet-active');
              } else {
                bullet.classList.remove('swiper-pagination-bullet-active');
              }
            });
          });

          // Update screen reader announcement
          const currentSlideElement = document.querySelector('.hero__current-slide');
          if (currentSlideElement) {
            currentSlideElement.textContent = realIndex + 1;
          }
        },
      },
    });

    // Update allowTouchMove on window resize
    const handleResize = () => {
      if (window.innerWidth >= BREAKPOINTS.DESKTOP) {
        swiper.allowTouchMove = false;
      } else {
        swiper.allowTouchMove = true;
      }
    };

    window.addEventListener('resize', handleResize);

    return swiper;
  };

  return {
    init: initSlider,
  };
})();

export default heroSlider;
