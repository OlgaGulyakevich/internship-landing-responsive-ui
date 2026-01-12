// =============================================================================
// NEWS CARD REORDERING MODULE
// =============================================================================
// Handles card reordering for Swiper Grid fill: 'row' mode
//
// PROBLEM:
// With fill: 'row', Swiper distributes cards across rows first:
// - 16 cards with 2 rows: positions 1-8 go to top row, 9-16 to bottom row
//
// SOLUTION:
// For sequential visual order (1,2 / 3,4 / 5,6...), we need to interleave:
// - Mobile (1 col × 2 rows): [1,3,5,7...] top, [2,4,6,8...] bottom
// - Tablet (2 cols × 2 rows): [1,2,5,6,9,10...] top, [3,4,7,8,11,12...] bottom
// - Desktop (no grid): sequential order
// =============================================================================

import { BREAKPOINTS, NEWS_SLIDER } from '../config/slider-constants.js';

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
  const topRow = []; // Odd positions: 1,3,5,7...
  const bottomRow = []; // Even positions: 2,4,6,8...

  for (let i = 0; i < totalCards; i++) {
    if (i % 2 === 0) {
      topRow.push(items[i]); // 0,2,4,6... → cards 1,3,5,7...
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
  const cardsPerPage = NEWS_SLIDER.CARDS_PER_PAGE.TABLET;
  for (let pageStart = 0; pageStart < totalCards; pageStart += cardsPerPage) {
    // Cards for this page
    const card1 = items[pageStart]; // Top-left
    const card2 = items[pageStart + 1]; // Top-right
    const card3 = items[pageStart + 2]; // Bottom-left
    const card4 = items[pageStart + 3]; // Bottom-right

    if (card1) {
      topRow.push(card1);
    }
    if (card2) {
      topRow.push(card2);
    }
    if (card3) {
      bottomRow.push(card3);
    }
    if (card4) {
      bottomRow.push(card4);
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
export function reorderCardsForGrid(items, totalCards) {
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
