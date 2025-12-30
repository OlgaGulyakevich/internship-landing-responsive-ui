// =============================================================================
// SCROLL LOCK
// Centralized scroll lock management with counter to prevent conflicts
// =============================================================================

/**
 * @fileoverview Centralized scroll lock management module
 *
 * Provides a counter-based scroll lock system that prevents conflicts when
 * multiple components (modals, burger menu, etc.) need to lock page scroll.
 * Only removes scroll lock when all requesting components have released it.
 *
 * Features:
 * - Counter-based lock/unlock to handle multiple concurrent lock requests
 * - Simple overflow: hidden approach (modern browsers handle layout well)
 * - Used by modal.js and burger-menu.js
 *
 * @author Olga Gulakevic
 * @version 2.0.0
 */

let lockCount = 0;

/**
 * Locks page scroll by adding scroll-lock class to body
 *
 * Increments internal counter to allow multiple components to request lock
 * simultaneously. Only adds scroll-lock class on first call.
 *
 * @example
 * // Lock scroll when opening modal
 * lockScroll(); // lockCount becomes 1
 *
 * @example
 * // Multiple components can lock simultaneously
 * lockScroll(); // lockCount = 1 (burger menu)
 * lockScroll(); // lockCount = 2 (modal opened while burger is open)
 * unlockScroll(); // lockCount = 1 (modal closed, scroll still locked)
 * unlockScroll(); // lockCount = 0 (burger closed, scroll unlocked)
 */
export const lockScroll = () => {
  if (lockCount === 0) {
    document.body.classList.add('scroll-lock');
  }
  lockCount++;
};

/**
 * Unlocks page scroll by removing scroll-lock class from body
 *
 * Decrements internal counter and only removes scroll lock when counter
 * reaches zero (all components have released their lock request).
 *
 * @example
 * // Unlock scroll when closing modal
 * unlockScroll(); // lockCount decrements
 *
 * @example
 * // Safe handling of multiple unlocks
 * lockScroll(); // lockCount = 1
 * lockScroll(); // lockCount = 2
 * unlockScroll(); // lockCount = 1 (still locked)
 * unlockScroll(); // lockCount = 0 (scroll unlocked)
 * unlockScroll(); // lockCount stays 0 (Math.max prevents negative)
 */
export const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.classList.remove('scroll-lock');
  }
};
