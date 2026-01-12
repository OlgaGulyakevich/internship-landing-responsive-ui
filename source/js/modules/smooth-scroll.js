/**
 * Smooth Scroll Module
 * Smooth scrolling for anchor links
 */

export const initSmoothScroll = () => {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');

      if (href === '#') {
        return;
      }

      // Skip modal triggers - they have their own handlers
      if (anchor.hasAttribute('data-modal-trigger')) {
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
};
