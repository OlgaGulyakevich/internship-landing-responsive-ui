// https://swiperjs.com/get-started#installation
// import Swiper from "swiper";
// import {Navigation, Pagination} from "swiper/modules";
// import 'swiper/css';

// Modules
import burgerMenu from './modules/burger-menu.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import modal from './modules/modal.js';

// Sliders
import heroSlider from './sliders/hero-slider.js';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  burgerMenu.init();
  initSmoothScroll();
  heroSlider.init();
  modal.init();
});
