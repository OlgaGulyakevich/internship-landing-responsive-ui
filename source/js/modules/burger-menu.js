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
      }
    });

    // Wait for animations to complete before hiding (longest animation: 400ms)
    setTimeout(() => {
      menu.setAttribute('hidden', '');
      menu.style.height = ''; // Reset height
    }, 400);

    // Remove event listeners
    overlay.removeEventListener('click', closeMenu);
    document.removeEventListener('keydown', handleEscKey);
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

    // Add event listeners
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', handleEscKey);
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

    // Toggle hidden attribute
    if (isExpanded) {
      submenu.setAttribute('hidden', '');
    } else {
      submenu.removeAttribute('hidden');
    }
  }

  // Initialize
  const init = () => {
    // Burger button click
    burger.addEventListener('click', toggleMenu);

    // Submenu toggle buttons
    toggleButtons.forEach((button) => {
      button.addEventListener('click', () => toggleSubmenu(button));
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
