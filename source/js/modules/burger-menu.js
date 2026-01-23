/**
 * Burger Menu Module
 * Manages mobile navigation menu behavior
 * - Toggle menu open/close via burger button
 * - Close on overlay click, ESC key, click outside
 * - Allows page scrolling (better UX for dropdown menus)
 * - Expandable submenu items (accordion)
 */

const burgerMenu = (() => {
  const burger = document.querySelector('.header__burger');
  const menu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.nav-menu__overlay');
  const header = document.querySelector('.header');
  const toggleButtons = document.querySelectorAll('.nav-menu__toggle');
  const menuLinks = document.querySelectorAll('.nav-menu__link, .nav-menu__sublink');

  if (!burger || !menu || !header) {
    return;
  }

  // Handle ESC key
  function handleEscKey(evt) {
    if (evt.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  }

  // Handle arrow keys for menu navigation
  function handleArrowKeys(evt) {
    if (!menu.classList.contains('is-open')) {
      return;
    }

    // Only handle arrow up/down
    if (evt.key !== 'ArrowDown' && evt.key !== 'ArrowUp') {
      return;
    }

    evt.preventDefault(); // Prevent page scroll

    // Get all focusable elements in menu (excluding those with tabindex="-1")
    const focusableElements = Array.from(
      menu.querySelectorAll('a:not([tabindex="-1"]), button')
    );

    if (focusableElements.length === 0) {
      return;
    }

    // Find current focused element index
    const currentIndex = focusableElements.indexOf(document.activeElement);

    let nextIndex;
    if (evt.key === 'ArrowDown') {
      // Move to next element (circular)
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusableElements.length) {
        nextIndex = 0; // Wrap to first
      }
    } else {
      // ArrowUp - move to previous element (circular)
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = focusableElements.length - 1; // Wrap to last
      }
    }

    // Focus next/previous element
    focusableElements[nextIndex].focus();
  }

  // Handle click outside menu
  function handleOutsideClick(evt) {
    // Close if clicked outside menu and burger button
    if (!menu.contains(evt.target) && !burger.contains(evt.target)) {
      closeMenu();
    }
  }

  // Close menu
  function closeMenu() {
    burger.classList.remove('is-active');
    menu.classList.remove('is-open');

    // Reset all submenus to closed state
    toggleButtons.forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
      const submenu = button.nextElementSibling;
      if (submenu && submenu.classList.contains('nav-menu__submenu')) {
        submenu.setAttribute('hidden', '');
        // Remove submenu links from tab order
        const submenuLinks = submenu.querySelectorAll('a');
        submenuLinks.forEach((link) => link.setAttribute('tabindex', '-1'));
      }
    });

    // Wait for animations to complete before hiding (longest animation: 400ms)
    setTimeout(() => {
      menu.setAttribute('hidden', '');
      menu.style.height = ''; // Reset height
    }, 400);

    // Return focus to burger button (for keyboard navigation)
    // Use preventScroll to avoid jumping back when closing menu after anchor link click
    burger.focus({ preventScroll: true });

    // Remove event listeners
    overlay.removeEventListener('click', closeMenu);
    document.removeEventListener('keydown', handleEscKey);
    document.removeEventListener('keydown', handleArrowKeys);
    document.removeEventListener('click', handleOutsideClick);
  }

  // Open menu
  function openMenu() {
    // Step 1: Set menu height to cover full page (including scrollable area)
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    menu.style.height = `${pageHeight}px`;

    // Step 2: Remove hidden attribute (makes element visible in DOM)
    menu.removeAttribute('hidden');

    // Step 3: Force browser to paint initial state before adding .is-open
    // This ensures transitions work properly
    requestAnimationFrame(() => {
      burger.classList.add('is-active');
      menu.classList.add('is-open');
    });

    // No scroll lock - allows page scrolling for better UX

    // Step 4: Move focus to first interactive element in menu (after animation)
    setTimeout(() => {
      // Find first focusable element in menu list (excluding hidden submenu items)
      const firstFocusableElement = menu.querySelector('.nav-menu__list > .nav-menu__item > a, .nav-menu__list > .nav-menu__item > button');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }, 300); // Wait for menu animation to complete

    // Add event listeners
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('keydown', handleArrowKeys);
    document.addEventListener('click', handleOutsideClick);
  }

  // Toggle menu open/close
  function toggleMenu() {
    const isOpen = menu.classList.contains('is-open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Toggle submenu (accordion)
  function toggleSubmenu(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const submenu = button.nextElementSibling;

    if (!submenu || !submenu.classList.contains('nav-menu__submenu')) {
      return;
    }

    // Toggle aria-expanded
    button.setAttribute('aria-expanded', !isExpanded);

    // Toggle hidden attribute and tabindex for submenu links
    const submenuLinks = submenu.querySelectorAll('a');
    if (isExpanded) {
      // Closing submenu
      submenu.setAttribute('hidden', '');
      // Remove submenu links from tab order
      submenuLinks.forEach((link) => link.setAttribute('tabindex', '-1'));
    } else {
      // Opening submenu
      submenu.removeAttribute('hidden');
      // Add submenu links to tab order
      submenuLinks.forEach((link) => link.removeAttribute('tabindex'));
    }
  }

  // Initialize
  const init = () => {
    // Burger button click
    burger.addEventListener('click', toggleMenu);

    // Initialize submenu links with tabindex="-1" (submenus closed by default)
    const allSubmenus = document.querySelectorAll('.nav-menu__submenu');
    allSubmenus.forEach((submenu) => {
      const submenuLinks = submenu.querySelectorAll('a');
      submenuLinks.forEach((link) => link.setAttribute('tabindex', '-1'));
    });

    // Submenu toggle buttons
    toggleButtons.forEach((button) => {
      // Click handler
      button.addEventListener('click', () => toggleSubmenu(button));

      // Keyboard handler (Enter/Space)
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent page scroll on Space
          toggleSubmenu(button);
        }
      });
    });

    // Close menu when clicking on links (anchor navigation)
    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        // Close menu after delay to allow smooth scroll to start (300ms)
        setTimeout(() => {
          closeMenu();
        }, 300);
      });
    });
  };

  return {
    init,
  };
})();

export default burgerMenu;
