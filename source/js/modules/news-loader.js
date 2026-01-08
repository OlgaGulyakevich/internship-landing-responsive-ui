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
//
// CARD ORDER LOGIC (Swiper Grid fill: 'row'):
// - Mobile (2 rows): Cards fill rows first → [1,2,3] top, [4,5,6] bottom
// - Tablet (2 rows): Cards fill rows first → [1,2,3] top, [4,5,6] bottom
// - Desktop (1 row): Sequential order → [1,2,3,4,5,6]
// =============================================================================

import { BREAKPOINTS } from '../config/slider-constants.js';
import { updateNewsPagination } from '../sliders/news-slider.js';

/**
 * Maps tab button data-tab values to JSON category keys.
 * @type {Object<string, string>}
 */
const TAB_TO_CATEGORY = {
  all: 'general',
  volunteer: 'volunteer',
  internship: 'internship',
  career: 'career',
  travel: 'travel',
};

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
    const response = await fetch('/data/news.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    newsData = await response.json();
    return newsData;
  } catch (error) {
    console.error('Failed to load news data:', error);
    throw error;
  }
}

/**
 * List of image paths in tab-general that have art direction variants
 * (-desktop, -tablet, -mobile suffixes)
 * Only first 4 images have responsive variants for pixel-perfect design.
 * Images 05+ have only @1x/@2x versions.
 * @type {string[]}
 */
const RESPONSIVE_IMAGES = [
  'news/tab-general/01-internship-interview',
  'news/tab-general/02-travel-spring',
  'news/tab-general/03-volunteer-program',
  'news/tab-general/04-career-opportunities',
];

/**
 * List of image paths that have WIDE variants (-desktop-wide, -mobile-wide).
 * These are used for large cards on desktop.
 * Only the first card (01-internship-interview) has wide versions.
 * @type {string[]}
 */
const WIDE_IMAGES = [
  'news/tab-general/01-internship-interview',
];

/**
 * Checks if image path has responsive art direction variants.
 * Only specific images in tab-general have -desktop/-tablet/-mobile suffixes.
 * @param {string} imagePath - Image path from JSON
 * @returns {boolean} True if image has responsive variants
 */
function hasResponsiveVariants(imagePath) {
  return RESPONSIVE_IMAGES.includes(imagePath);
}

/**
 * Generates responsive picture element HTML for a news card.
 * Handles two image formats:
 * 1. tab-general: Has responsive variants (-desktop-wide, -tablet, -mobile-wide, etc.)
 * 2. Other tabs: Single image with @1x/@2x only
 *
 * Structure matches fallback HTML in index.html with WebP + JPEG sources.
 * @param {string} imagePath - Base image path without size suffix (e.g., "news/tab-general/01-internship-interview")
 * @param {string} title - Alt text for the image
 * @param {boolean} isLarge - Whether this is a large card (affects image sizes)
 * @returns {string} HTML string for picture element
 */
function generatePictureHTML(imagePath, title, isLarge) {
  // Check if this image has responsive variants (only tab-general for now)
  if (hasResponsiveVariants(imagePath)) {
    // Only images in WIDE_IMAGES have -wide suffix variants
    const hasWideVariants = WIDE_IMAGES.includes(imagePath);
    const useWide = isLarge && hasWideVariants;

    // Large cards use different image sizes (but only 01 has -wide suffix files)
    const desktopSize = useWide ? 'desktop-wide' : 'desktop';
    const mobileSize = useWide ? 'mobile-wide' : 'mobile';
    const mobileHeight = isLarge ? 330 : 240;
    const desktopWidth = isLarge ? 604 : 286;

    return `
                <picture>
                  <source
                    width="${desktopWidth}"
                    height="400"
                    type="image/webp"
                    media="(min-width: 1440px)"
                    srcset="img/${imagePath}-${desktopSize}@1x.webp 1x, img/${imagePath}-${desktopSize}@2x.webp 2x">
                  <source
                    width="324"
                    height="350"
                    type="image/webp"
                    media="(min-width: 768px)"
                    srcset="img/${imagePath}-tablet@1x.webp 1x, img/${imagePath}-tablet@2x.webp 2x">
                  <source
                    width="290"
                    height="${mobileHeight}"
                    type="image/webp"
                    srcset="img/${imagePath}-${mobileSize}@1x.webp 1x, img/${imagePath}-${mobileSize}@2x.webp 2x">
                  <source
                    type="image/jpeg"
                    width="${desktopWidth}"
                    height="400"
                    media="(min-width: 1440px)"
                    srcset="img/${imagePath}-${desktopSize}@1x.jpg 1x, img/${imagePath}-${desktopSize}@2x.jpg 2x">
                  <source
                    type="image/jpeg"
                    width="324"
                    height="350"
                    media="(min-width: 768px)"
                    srcset="img/${imagePath}-tablet@1x.jpg 1x, img/${imagePath}-tablet@2x.jpg 2x">
                  <img
                    class="news-card__image"
                    src="img/${imagePath}-${mobileSize}@1x.jpg"
                    srcset="img/${imagePath}-${mobileSize}@2x.jpg 2x"
                    width="290"
                    height="${mobileHeight}"
                    alt="${title}">
                </picture>`;
  }

  // Simple image format for other tabs (no responsive variants)
  // These tabs have only @1x/@2x versions without size suffixes
  const mobileHeight = isLarge ? 330 : 240;

  return `
                <picture>
                  <source
                    type="image/webp"
                    srcset="img/${imagePath}@1x.webp 1x, img/${imagePath}@2x.webp 2x">
                  <img
                    class="news-card__image"
                    src="img/${imagePath}@1x.jpg"
                    srcset="img/${imagePath}@2x.jpg 2x"
                    width="290"
                    height="${mobileHeight}"
                    alt="${title}"
                    loading="lazy">
                </picture>`;
}

/**
 * Generates HTML for a single news card.
 * Structure matches fallback HTML in index.html exactly:
 * - news-card__content wraps time, title, and body
 * - news-card__body wraps description and link
 * - Link has button classes
 *
 * @param {Object} newsItem - News item data from JSON
 * @param {string} newsItem.date - Publication date in DD/MM/YYYY format
 * @param {string} newsItem.title - Card title
 * @param {string} newsItem.description - Card description
 * @param {string} newsItem.image - Base image path
 * @param {string} newsItem.link - Link URL
 * @param {number} index - Card index (0-based) for determining size
 * @param {string} category - Category key for data attribute
 * @param {number} totalCards - Total number of cards for size calculation
 * @returns {string} HTML string for the news card slide
 */
function generateCardHTML(newsItem, index, category, totalCards) {
  const { date, title, description, image, link } = newsItem;

  // Determine if this card should be large based on viewport and position
  const isLarge = isLargeCard(index, totalCards);

  // Add size class for CSS styling (mobile: large = top row, small = bottom row)
  const sizeClass = isLarge ? 'news__item--large' : '';

  // Match exact structure from index.html fallback
  return `
            <li class="news__item swiper-slide ${sizeClass}" data-category="${category}">
              <article class="news-card">
                ${generatePictureHTML(image, title, isLarge)}

                <div class="news-card__content">
                  <time class="news-card__date" datetime="${formatDateISO(date)}">${date}</time>
                  <h3 class="news-card__title">${title}</h3>
                  <div class="news-card__body">
                    <p>
                      ${description}
                    </p>
                    <a class="news-card__link button button--icon-only" href="${link}" aria-label="Читать полностью">
                      <svg width="8" height="8" aria-hidden="true">
                        <use href="/__spritemap#sprite-arrow-up-right"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            </li>`;
}

/**
 * Determines if a card at given index should be rendered as large.
 * Based on current viewport and Swiper Grid fill: 'row' logic.
 *
 * IMPORTANT: This is called AFTER reorderCardsForGrid(), so indices
 * reflect the reordered array position, not original JSON order.
 *
 * @param {number} index - 0-based card index in reordered array
 * @param {number} totalCards - Total number of cards
 * @returns {boolean} True if card should be large
 */
function isLargeCard(index, totalCards) {
  const width = window.innerWidth;

  if (width >= BREAKPOINTS.DESKTOP) {
    // Desktop: every 3n+1 (1st, 4th, 7th...) → indices 0, 3, 6...
    return index % 3 === 0;
  }

  if (width >= BREAKPOINTS.TABLET) {
    // Tablet: all cards same size — always return false (handled by CSS)
    return false;
  }

  // Mobile: with fill:'row' and 2 rows
  // First half of array = top row (large), second half = bottom row (small)
  const halfCount = Math.ceil(totalCards / 2);
  return index < halfCount;
}

/**
 * Converts date string from DD/MM/YYYY to ISO format YYYY-MM-DD.
 * @param {string} dateStr - Date in DD/MM/YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
function formatDateISO(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

// =============================================================================
// CARD REORDERING FOR SWIPER GRID fill: 'row'
// =============================================================================
// With fill: 'row', Swiper distributes cards across rows first:
// - 16 cards with 2 rows: positions 1-8 go to top row, 9-16 to bottom row
//
// For sequential visual order (1,2 / 3,4 / 5,6...), we need to interleave:
// - Mobile (1 col × 2 rows): [1,3,5,7...] top, [2,4,6,8...] bottom
// - Tablet (2 cols × 2 rows): [1,2,5,6,9,10...] top, [3,4,7,8,11,12...] bottom
// - Desktop (no grid): sequential order
// =============================================================================

/**
 * Default card indices for first page of each breakpoint (1-based).
 * These are the cards that should appear on page 1 for pixel-perfect.
 * @type {Object}
 */
const FIRST_PAGE_CARDS = {
  mobile: [1, 2],      // Card 1 top, Card 2 bottom
  tablet: [1, 2, 3, 4], // Top: 1,2 | Bottom: 3,4
  desktop: [1, 2, 3],   // Left to right: 1, 2, 3
};

/**
 * Reorders cards array for Swiper Grid fill: 'row' to achieve sequential visual order.
 *
 * @param {Array<Object>} items - Original ordered array of news items
 * @param {number} totalCards - Total number of cards
 * @returns {Array<Object>} Reordered array for current viewport
 *
 * @example
 * // Mobile with 16 cards: input [1,2,3...16], output for fill:'row':
 * // Top row positions: 1,3,5,7,9,11,13,15
 * // Bottom row positions: 2,4,6,8,10,12,14,16
 */
function reorderCardsForGrid(items, totalCards) {
  const width = window.innerWidth;

  // Desktop: no grid, sequential order
  if (width >= BREAKPOINTS.DESKTOP) {
    return items;
  }

  // Tablet: 2 columns × 2 rows per page
  // With fill:'row', positions 1-8 are top row, 9-16 are bottom row
  // To show [1,2][3,4] on page 1, we need: [1,2,5,6,9,10,13,14] top, [3,4,7,8,11,12,15,16] bottom
  if (width >= BREAKPOINTS.TABLET) {
    return reorderForTabletGrid(items, totalCards);
  }

  // Mobile: 1 column × 2 rows per page
  // With fill:'row', positions 1-8 are top row, 9-16 are bottom row
  // To show [1][2] on page 1, we need: [1,3,5,7,9,11,13,15] top, [2,4,6,8,10,12,14,16] bottom
  return reorderForMobileGrid(items, totalCards);
}

/**
 * Reorders cards for mobile grid (1 col × 2 rows).
 * Result: visual order 1,2 per page with fill:'row'.
 *
 * @param {Array<Object>} items - Original ordered items
 * @param {number} totalCards - Total cards count
 * @returns {Array<Object>} Reordered for mobile
 */
function reorderForMobileGrid(items, totalCards) {
  const halfCount = Math.ceil(totalCards / 2);
  const topRow = [];    // Odd positions: 1,3,5,7...
  const bottomRow = []; // Even positions: 2,4,6,8...

  for (let i = 0; i < totalCards; i++) {
    if (i % 2 === 0) {
      topRow.push(items[i]);    // 0,2,4,6... → cards 1,3,5,7...
    } else {
      bottomRow.push(items[i]); // 1,3,5,7... → cards 2,4,6,8...
    }
  }

  // Pad arrays to equal length
  while (topRow.length < halfCount) {
    topRow.push(null);
  }
  while (bottomRow.length < halfCount) {
    bottomRow.push(null);
  }

  // Concatenate: top row first, then bottom row
  return [...topRow, ...bottomRow].filter(Boolean);
}

/**
 * Reorders cards for tablet grid (2 cols × 2 rows).
 * Result: visual order [1,2][3,4] per page with fill:'row'.
 *
 * @param {Array<Object>} items - Original ordered items
 * @param {number} totalCards - Total cards count
 * @returns {Array<Object>} Reordered for tablet
 */
function reorderForTabletGrid(items, totalCards) {
  // Page layout: [top-left, top-right] [bottom-left, bottom-right]
  // With fill:'row', we need groups of 4 split as [1,2,5,6,9,10...] top, [3,4,7,8,11,12...] bottom
  const halfCount = Math.ceil(totalCards / 2);
  const topRow = [];
  const bottomRow = [];

  // Process in groups of 4 (1 visual page)
  for (let pageStart = 0; pageStart < totalCards; pageStart += 4) {
    // Cards for this page
    const card1 = items[pageStart];        // Top-left
    const card2 = items[pageStart + 1];    // Top-right
    const card3 = items[pageStart + 2];    // Bottom-left
    const card4 = items[pageStart + 3];    // Bottom-right

    if (card1) topRow.push(card1);
    if (card2) topRow.push(card2);
    if (card3) bottomRow.push(card3);
    if (card4) bottomRow.push(card4);
  }

  // Pad arrays to equal length
  while (topRow.length < halfCount) {
    topRow.push(null);
  }
  while (bottomRow.length < halfCount) {
    bottomRow.push(null);
  }

  // Concatenate: top row first, then bottom row
  return [...topRow, ...bottomRow].filter(Boolean);
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
 * Handles tab click event.
 * Loads and renders news for the selected category.
 * Updates active tab styling with 'news__tab--active' class.
 * @param {Event} event - Click event
 */
async function handleTabClick(event) {
  const tab = event.target.closest('.news__tab');
  if (!tab) return;

  const tabValue = tab.dataset.tab;
  const category = TAB_TO_CATEGORY[tabValue];

  if (!category) {
    console.error('Unknown tab:', tabValue);
    return;
  }

  // Update active tab state
  // Remove 'news__tab--active' from all tabs
  const allTabs = document.querySelectorAll('.news__tab');
  allTabs.forEach((t) => t.classList.remove('news__tab--active'));

  // Add 'news__tab--active' to clicked tab
  tab.classList.add('news__tab--active');

  // Load and render news for category
  try {
    const data = await fetchNewsData();
    const items = data[category];

    if (!items || items.length === 0) {
      console.warn('No news items for category:', category);
      return;
    }

    renderCards(items, category);
  } catch (error) {
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
 * Initializes the news loader module.
 * Loads news from JSON immediately on page load (replaces fallback HTML).
 * Sets up tab click handlers on '.news__tabs' container.
 *
 * Tab Logic:
 * - Click on tab triggers handleTabClick()
 * - Active tab gets class 'news__tab--active'
 * - News cards are loaded from JSON and rendered dynamically
 *
 * @returns {Promise<void>}
 */
export async function initNewsLoader() {
  // Set up tab click handlers via event delegation
  const tabsContainer = document.querySelector('.news__tabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('click', handleTabClick);
  }

  // Load and render initial news data from JSON immediately
  // This replaces the fallback HTML with dynamic content
  try {
    const data = await fetchNewsData();
    const items = data.general;

    if (items && items.length > 0) {
      renderCards(items, 'general');
    }
  } catch (error) {
    console.error('Failed to load initial news data:', error);
    // Fallback HTML remains visible if JSON fails to load
  }
}
