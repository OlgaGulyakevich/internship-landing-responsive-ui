// https://swiperjs.com/get-started#installation
// import Swiper from "swiper";
// import {Navigation, Pagination} from "swiper/modules";
// import 'swiper/css';

// Modules
import burgerMenu from './modules/burger-menu.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import modal from './modules/modal.js';
import notificationModal from './modules/notification-modal.js';
import { initNewsLoader, setSwiperInstance } from './modules/news-loader.js';

// Sliders
import heroSlider from './sliders/hero-slider.js';
import { initProgramsSlider } from './sliders/programs-slider.js';
import { initNewsSlider } from './sliders/news-slider.js';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  burgerMenu.init();
  initSmoothScroll();
  heroSlider.init();
  initProgramsSlider();

  // IMPORTANT: Load news from JSON FIRST (replaces fallback HTML)
  // This must happen BEFORE Swiper initialization to ensure correct card order
  await initNewsLoader();

  // Initialize news slider AFTER data is loaded and DOM is updated
  const newsSwiper = initNewsSlider();
  if (newsSwiper) {
    setSwiperInstance(newsSwiper);
  }

  modal.init();
  notificationModal.init();
});
