// =============================================================================
// NEWS LOADER MODULE
// =============================================================================
// Loads news data from JSON and renders cards dynamically.
// Handles tab filtering and responsive card ordering for Swiper Grid.
//
// FEATURES:
// - Fetches news from /data/news.json
// - Renders cards with responsive images (WebP + JPEG fallback)
// - Reorders cards based on viewport for Swiper Grid fill: 'row' compatibility
// - Integrates with Swiper slider for dynamic updates
// - Re-renders cards on breakpoint change (fixes DevTools viewport switching)
//
// CARD ORDER LOGIC (Swiper Grid fill: 'row'):
// - Mobile (2 rows): Cards fill rows first → [1,2,3] top, [4,5,6] bottom
// - Tablet (2 rows): Cards fill rows first → [1,2,3] top, [4,5,6] bottom
// - Desktop (1 row): Sequential order → [1,2,3,4,5,6]
//
// RESIZE HANDLING:
// - Detects breakpoint changes (mobile ↔ tablet ↔ desktop)
// - Re-renders cards with correct reordering for new viewport
// - Debounced to 150ms to avoid excessive re-renders
// =============================================================================

import { updateNewsPagination } from '../sliders/news-slider.js';
import { generateCardHTML } from './news-card-generator.js';
import { reorderCardsForGrid } from './news-card-reorder.js';
import { initTabs, getDefaultCategory } from './news-tabs.js';
import { BREAKPOINTS } from '../config/slider-constants.js';

/**
 * Cached news data from JSON.
 * @type {Object|null}
 */
let newsData = null;

/**
 * Reference to the Swiper instance for updates after rendering.
 * @type {Object|null}
 */
let swiperInstance = null;

/**
 * Current active category for re-rendering on breakpoint change.
 * @type {string|null}
 */
let currentCategory = null;

/**
 * Previous breakpoint for detecting changes.
 * @type {string|null}
 */
let previousBreakpoint = null;

/**
 * Gets current breakpoint based on window width.
 * @returns {string} 'mobile', 'tablet', or 'desktop'
 */
function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.DESKTOP) {
    return 'desktop';
  }
  if (width >= BREAKPOINTS.TABLET) {
    return 'tablet';
  }
  return 'mobile';
}

/**
 * Fetches news data from JSON file.
 * Caches the result for subsequent calls.
 * @returns {Promise<Object>} News data object with category arrays
 * @throws {Error} If fetch fails
 */
async function fetchNewsData() {
  if (newsData) {
    return newsData;
  }

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/news.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    newsData = await response.json();
    return newsData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load news data:', error);
    throw error;
  }
}


/**
 * Renders news cards into the slider container.
 * Reorders cards based on viewport for Swiper Grid fill:'row' compatibility.
 *
 * @param {Array<Object>} items - Array of news items to render (original order)
 * @param {string} category - Category key for data attributes
 */
function renderCards(items, category) {
  const container = document.querySelector('.news__list');
  if (!container) {
    // eslint-disable-next-line no-console
    console.error('News list container not found');
    return;
  }

  // Reorder cards for current viewport and Swiper Grid fill:'row'
  const reorderedItems = reorderCardsForGrid(items, items.length);
  const totalCards = reorderedItems.length;

  // Generate HTML for all cards
  const cardsHTML = reorderedItems
    .map((item, index) => generateCardHTML(item, index, category, totalCards))
    .join('');

  // Replace container content
  container.innerHTML = cardsHTML;

  // Update Swiper if initialized
  if (swiperInstance) {
    // Update Swiper to recognize new slides
    swiperInstance.update();

    // Reset to first slide without animation (after update knows about new slides)
    swiperInstance.slideTo(0, 0);

    // Force Swiper to recalculate progress and slide classes
    // This ensures isEnd/isBeginning flags are correct for arrows
    swiperInstance.updateProgress();
    swiperInstance.updateSlidesClasses();

    // Update pagination window after Swiper fully updates
    // Use requestAnimationFrame to ensure activeIndex is stable
    requestAnimationFrame(() => {
      updateNewsPagination();
    });
  }
}

/**
 * Loads and renders news for the selected category.
 * Called by tabs module when tab is clicked.
 * @param {string} category - Category key from JSON (e.g., 'general', 'volunteer')
 */
async function loadNewsForCategory(category) {
  try {
    const data = await fetchNewsData();
    const items = data[category];

    if (!items || items.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('No news items for category:', category);
      return;
    }

    // Save current category for resize handler
    currentCategory = category;

    renderCards(items, category);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load news for category:', category, error);
  }
}

/**
 * Sets the Swiper instance reference for updates after rendering.
 * @param {Object} swiper - Swiper instance
 */
export function setSwiperInstance(swiper) {
  swiperInstance = swiper;
}

/**
 * Sets up resize handler to re-render cards when breakpoint changes.
 * Uses debouncing to avoid excessive re-renders during resize.
 */
function setupResizeHandler() {
  let resizeTimer = null;

  const handleResize = () => {
    const currentBreakpoint = getCurrentBreakpoint();

    // Only re-render if breakpoint actually changed
    if (currentBreakpoint !== previousBreakpoint) {
      previousBreakpoint = currentBreakpoint;

      // Re-render current category with new reordering
      if (currentCategory) {
        loadNewsForCategory(currentCategory);
      }
    }
  };

  window.addEventListener('resize', () => {
    // Debounce: wait 150ms after last resize event
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 150);
  });
}

/**
 * Initializes the news loader module.
 * Loads news from JSON immediately on page load (replaces fallback HTML).
 * Sets up tab navigation with tabs module.
 *
 * @returns {Promise<void>}
 */
export async function initNewsLoader() {
  // Initialize tabs with callback for category changes
  initTabs((category) => {
    loadNewsForCategory(category);
  });

  // Load and render initial news data from JSON immediately
  // This replaces the fallback HTML with dynamic content
  const defaultCategory = getDefaultCategory();
  await loadNewsForCategory(defaultCategory);

  // Set initial breakpoint
  previousBreakpoint = getCurrentBreakpoint();

  // Setup resize handler to re-render on breakpoint change
  setupResizeHandler();
}
