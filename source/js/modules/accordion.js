// =============================================================================
// ACCORDION MODULE (FAQ)
// =============================================================================
// Manages expandable/collapsible accordion items
//
// BEHAVIOR:
// - Click on .faq__question button toggles item open/close
// - Only one item can be open at a time
// - Updates aria-expanded for accessibility
// - Adds/removes .faq__item--active class for styling
// - Toggles hidden attribute on .faq__answer
//
// INITIALIZATION:
// - 3rd item open by default
// =============================================================================

/**
 * Closes an accordion item
 * @param {HTMLElement} item - The .faq__item element
 */
function closeItem(item) {
  const button = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');

  if (button && answer) {
    item.classList.remove('faq__item--active');
    button.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Opens an accordion item
 * @param {HTMLElement} item - The .faq__item element
 */
function openItem(item) {
  const button = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');

  if (button && answer) {
    item.classList.add('faq__item--active');
    button.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Toggles an accordion item open/closed
 * Multiple items can be open simultaneously
 * @param {HTMLElement} item - The .faq__item element
 */
function toggleItem(item) {
  const isActive = item.classList.contains('faq__item--active');

  // Toggle current item only (do NOT close others)
  if (isActive) {
    closeItem(item);
  } else {
    openItem(item);
  }
}

/**
 * Initializes accordion functionality
 * Sets up click handlers on all .faq__question buttons
 */
function initAccordion() {
  const accordionContainer = document.querySelector('.faq__list');

  if (!accordionContainer) {
    return;
  }

  // Event delegation - listen for clicks on buttons
  accordionContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.faq__question');

    if (!button) {
      return;
    }

    const item = button.closest('.faq__item');

    if (item) {
      toggleItem(item);
    }
  });

  // Keyboard support - Space/Enter on buttons (already handled by native button behavior)
}

// Initialize on DOM load
export default {
  init: initAccordion,
};
