// =============================================================================
// NEWS TABS MODULE
// =============================================================================
// Manages tab navigation and active state for News section
//
// BEHAVIOR:
// - Click on tab triggers callback with category
// - Active tab gets class 'news__tab--active'
// - Uses event delegation for performance
// =============================================================================

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
 * Handles tab click event.
 * Updates active tab styling and triggers callback with selected category.
 * @param {Event} event - Click event
 * @param {Function} onTabChange - Callback function(category)
 */
function handleTabClick(event, onTabChange) {
  const tab = event.target.closest('.news__tab');
  if (!tab) {
    return;
  }

  const tabValue = tab.dataset.tab;
  const category = TAB_TO_CATEGORY[tabValue];

  if (!category) {
    // eslint-disable-next-line no-console
    console.error('Unknown tab:', tabValue);
    return;
  }

  // Update active tab state
  // Remove 'news__tab--active' from all tabs
  const allTabs = document.querySelectorAll('.news__tab');
  allTabs.forEach((t) => t.classList.remove('news__tab--active'));

  // Add 'news__tab--active' to clicked tab
  tab.classList.add('news__tab--active');

  // Trigger callback with category
  onTabChange(category);
}

/**
 * Initializes tabs navigation.
 * Sets up click handlers via event delegation on '.news__tabs' container.
 *
 * @param {Function} onTabChange - Callback function(category) called when tab is clicked
 * @returns {boolean} True if tabs initialized successfully
 *
 * @example
 * initTabs((category) => {
 *   console.log('Load news for:', category);
 *   loadNewsForCategory(category);
 * });
 */
export function initTabs(onTabChange) {
  const tabsContainer = document.querySelector('.news__tabs');

  if (!tabsContainer) {
    // eslint-disable-next-line no-console
    console.warn('News tabs container not found');
    return false;
  }

  // Use event delegation for performance
  tabsContainer.addEventListener('click', (event) => {
    handleTabClick(event, onTabChange);
  });

  return true;
}

/**
 * Gets category key for default tab (used for initial load).
 * @returns {string} Category key for 'all' tab
 */
export function getDefaultCategory() {
  return TAB_TO_CATEGORY.all; // 'general'
}
