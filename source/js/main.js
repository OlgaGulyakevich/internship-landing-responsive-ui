// Modules
import burgerMenu from './modules/burger-menu.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import modal from './modules/modal.js';
import notificationModal from './modules/notification-modal.js';
import { initNewsLoader, setSwiperInstance } from './modules/news-loader.js';
import accordion from './modules/accordion.js';
import { initNavMenuNavigation } from './modules/nav-menu-navigation.js';

// Sliders
import heroSlider from './sliders/hero-slider.js';
import { initProgramsSlider } from './sliders/programs-slider.js';
import { initNewsSlider } from './sliders/news-slider.js';
import { initReviewsSlider } from './sliders/reviews-slider.js';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  burgerMenu.init();
  initSmoothScroll();
  heroSlider.init();

  // Initialize Programs slider and save instance for navigation
  const programsSwiper = initProgramsSlider();

  // IMPORTANT: Load news from JSON FIRST (replaces fallback HTML)
  // This must happen BEFORE Swiper initialization to ensure correct card order
  await initNewsLoader();

  // Initialize news slider AFTER data is loaded and DOM is updated
  const newsSwiper = initNewsSlider();
  if (newsSwiper) {
    setSwiperInstance(newsSwiper);
  }

  // Initialize nav menu navigation (Programs slider + News tabs)
  // Must be called AFTER sliders are initialized
  if (programsSwiper) {
    initNavMenuNavigation(programsSwiper);
  }

  // Initialize Reviews slider
  initReviewsSlider();

  accordion.init();
  modal.init();
  notificationModal.init();
});
