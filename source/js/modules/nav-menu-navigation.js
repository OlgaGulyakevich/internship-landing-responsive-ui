// =============================================================================
// NAV MENU NAVIGATION MODULE
// =============================================================================
// Handles submenu links navigation for Programs slider and News tabs
//
// BEHAVIOR:
// - Programs submenu: data-slide → switches to specific Programs slider slide
// - News submenu: data-tab → switches to specific News tab
// =============================================================================

/**
 * Initializes navigation for submenu links.
 * Handles slide switching for Programs and tab switching for News.
 *
 * @param {Swiper} programsSwiper - Programs Swiper instance
 */
export function initNavMenuNavigation(programsSwiper) {
  // Get all submenu links
  const sublinks = document.querySelectorAll('.nav-menu__sublink');

  if (sublinks.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('No nav-menu submenu links found');
    return;
  }

  // Add click handler to each link
  sublinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default anchor behavior

      // Check for data-slide (Programs slider)
      if (link.hasAttribute('data-slide')) {
        const slideIndex = parseInt(link.getAttribute('data-slide'), 10);

        if (!programsSwiper) {
          // eslint-disable-next-line no-console
          console.error('Programs Swiper instance not available');
          return;
        }

        if (isNaN(slideIndex) || slideIndex < 0) {
          // eslint-disable-next-line no-console
          console.error('Invalid slide index:', link.getAttribute('data-slide'));
          return;
        }

        // Switch to slide
        programsSwiper.slideTo(slideIndex);

        // Scroll to programs section
        const programsSection = document.querySelector('#programs');
        if (programsSection) {
          programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // Check for data-tab (News tabs)
      if (link.hasAttribute('data-tab')) {
        const tabValue = link.getAttribute('data-tab');

        // Find corresponding news tab button
        const targetTab = document.querySelector(`.news__tab[data-tab="${tabValue}"]`);

        if (!targetTab) {
          // eslint-disable-next-line no-console
          console.error('News tab not found:', tabValue);
          return;
        }

        // Programmatically click the tab (triggers tab switching logic)
        targetTab.click();

        // Scroll to news section
        const newsSection = document.querySelector('#news');
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
