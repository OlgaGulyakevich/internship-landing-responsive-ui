// =============================================================================
// NEWS CARD GENERATOR MODULE
// =============================================================================
// Generates HTML for news cards with responsive images
//
// FEATURES:
// - Responsive <picture> elements with WebP + JPEG fallback
// - Art direction variants for tab-general images
// - Simple @1x/@2x for other tabs
// - Large/small card variants based on viewport
// =============================================================================

import { BREAKPOINTS, NEWS_SLIDER } from '../config/slider-constants.js';

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
export function isLargeCard(index, totalCards) {
  const width = window.innerWidth;

  if (width >= BREAKPOINTS.DESKTOP) {
    // Desktop: every 3n+1 (1st, 4th, 7th...) → indices 0, 3, 6...
    return index % NEWS_SLIDER.CARDS_PER_PAGE.DESKTOP === 0;
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
export function generatePictureHTML(imagePath, title, isLarge) {
  const { IMAGE_SIZES } = NEWS_SLIDER;

  // Check if this image has responsive variants (only tab-general for now)
  if (hasResponsiveVariants(imagePath)) {
    // Only images in WIDE_IMAGES have -wide suffix variants
    const hasWideVariants = WIDE_IMAGES.includes(imagePath);
    const useWide = isLarge && hasWideVariants;

    // Large cards use different image sizes (but only 01 has -wide suffix files)
    const desktopSize = useWide ? 'desktop-wide' : 'desktop';
    const mobileSize = useWide ? 'mobile-wide' : 'mobile';
    const mobileHeight = isLarge ? IMAGE_SIZES.MOBILE.HEIGHT_LARGE : IMAGE_SIZES.MOBILE.HEIGHT_SMALL;
    const desktopWidth = isLarge ? IMAGE_SIZES.DESKTOP.WIDTH_LARGE : IMAGE_SIZES.DESKTOP.WIDTH_SMALL;

    return `
                <picture>
                  <source
                    width="${desktopWidth}"
                    height="${IMAGE_SIZES.DESKTOP.HEIGHT}"
                    type="image/webp"
                    media="(min-width: 1440px)"
                    srcset="img/${imagePath}-${desktopSize}@1x.webp 1x, img/${imagePath}-${desktopSize}@2x.webp 2x">
                  <source
                    width="${IMAGE_SIZES.TABLET.WIDTH}"
                    height="${IMAGE_SIZES.TABLET.HEIGHT}"
                    type="image/webp"
                    media="(min-width: 768px)"
                    srcset="img/${imagePath}-tablet@1x.webp 1x, img/${imagePath}-tablet@2x.webp 2x">
                  <source
                    width="${IMAGE_SIZES.MOBILE.WIDTH}"
                    height="${mobileHeight}"
                    type="image/webp"
                    srcset="img/${imagePath}-${mobileSize}@1x.webp 1x, img/${imagePath}-${mobileSize}@2x.webp 2x">
                  <source
                    type="image/jpeg"
                    width="${desktopWidth}"
                    height="${IMAGE_SIZES.DESKTOP.HEIGHT}"
                    media="(min-width: 1440px)"
                    srcset="img/${imagePath}-${desktopSize}@1x.jpg 1x, img/${imagePath}-${desktopSize}@2x.jpg 2x">
                  <source
                    type="image/jpeg"
                    width="${IMAGE_SIZES.TABLET.WIDTH}"
                    height="${IMAGE_SIZES.TABLET.HEIGHT}"
                    media="(min-width: 768px)"
                    srcset="img/${imagePath}-tablet@1x.jpg 1x, img/${imagePath}-tablet@2x.jpg 2x">
                  <img
                    class="news-card__image"
                    src="img/${imagePath}-${mobileSize}@1x.jpg"
                    srcset="img/${imagePath}-${mobileSize}@2x.jpg 2x"
                    width="${IMAGE_SIZES.MOBILE.WIDTH}"
                    height="${mobileHeight}"
                    alt="${title}">
                </picture>`;
  }

  // Simple image format for other tabs (no responsive variants)
  // These tabs have only @1x/@2x versions without size suffixes
  const simpleMobileHeight = isLarge ? IMAGE_SIZES.MOBILE.HEIGHT_LARGE : IMAGE_SIZES.MOBILE.HEIGHT_SMALL;

  return `
                <picture>
                  <source
                    type="image/webp"
                    srcset="img/${imagePath}@1x.webp 1x, img/${imagePath}@2x.webp 2x">
                  <img
                    class="news-card__image"
                    src="img/${imagePath}@1x.jpg"
                    srcset="img/${imagePath}@2x.jpg 2x"
                    width="${IMAGE_SIZES.MOBILE.WIDTH}"
                    height="${simpleMobileHeight}"
                    alt="${title}">
                </picture>`;
}

/**
 * Converts date string from DD/MM/YYYY to ISO format YYYY-MM-DD.
 * @param {string} dateStr - Date in DD/MM/YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
export function formatDateISO(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
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
export function generateCardHTML(newsItem, index, category, totalCards) {
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
