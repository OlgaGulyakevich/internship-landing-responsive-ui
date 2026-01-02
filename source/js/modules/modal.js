/**
 * Modal Module ("Напишите нам")
 * Manages feedback modal window behavior
 *
 * Features:
 * - Open modal via data-modal-target="feedback" buttons
 * - Close on overlay click, ESC key, close button
 * - Form validation (all fields required)
 * - Phone mask (shows +7 on focus, filters non-digits)
 * - Scroll lock when modal open
 * - Form submission via POST
 * - Close modal after successful submit
 *
 * @module modal
 */

const modal = (() => {
  // =========================================================================
  // DOM Elements
  // =========================================================================
  const modalEl = document.querySelector('.modal--feedback');

  if (!modalEl) {
    return { init: () => {} }; // Guard clause - module disabled if no modal
  }

  const overlay = modalEl.querySelector('.modal__overlay');
  const closeBtn = modalEl.querySelector('.modal__close');
  const form = modalEl.querySelector('.modal__form');
  const phoneInput = modalEl.querySelector('input[type="tel"]');
  const triggers = document.querySelectorAll('[data-modal-target="feedback"]');

  // =========================================================================
  // Phone Mask Implementation (Simplified)
  // =========================================================================

  /**
   * Initialize phone mask
   * - On focus: show "+7 " if field is empty
   * - Allow deleting +7 (user can clear field)
   * - Only digits allowed (no letters)
   * - On blur: clear if only "+7" remains
   */
  const initPhoneMask = () => {
    if (!phoneInput) {
      return;
    }

    // Show "+7 " on focus if field is empty
    phoneInput.addEventListener('focus', (e) => {
      if (!e.target.value || e.target.value.trim() === '') {
        e.target.value = '+7 ';
        e.target.setSelectionRange(3, 3); // Cursor after "+7 "
      }
    });

    // Filter input - only allow digits, +, and spaces
    phoneInput.addEventListener('input', (e) => {
      const cursorPos = e.target.selectionStart;
      const oldValue = e.target.value;

      // Remove all characters except digits, +, and spaces
      const filtered = oldValue.replace(/[^\d+\s]/g, '');

      if (filtered !== oldValue) {
        e.target.value = filtered;
        // Restore cursor position
        e.target.setSelectionRange(cursorPos - 1, cursorPos - 1);
      }
    });

    // Clear field on blur if only "+7" remains
    phoneInput.addEventListener('blur', (e) => {
      const value = e.target.value.trim();
      if (value === '+7' || value === '+7 ' || value === '') {
        e.target.value = '';
      }
    });
  };

  // =========================================================================
  // Modal Open/Close
  // =========================================================================

  /**
   * Handles ESC key press to close modal
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  /**
   * Closes the modal window
   */
  function closeModal() {
    // Remove visible class (triggers fade-out animation)
    modalEl.classList.remove('is-open');

    // Wait for animation to complete (300ms transition)
    setTimeout(() => {
      modalEl.setAttribute('hidden', '');
      modalEl.setAttribute('aria-modal', 'false');
    }, 300);

    // Unlock scroll
    document.body.style.overflow = '';

    // Remove event listeners
    overlay.removeEventListener('click', closeModal);
    closeBtn.removeEventListener('click', closeModal);
    document.removeEventListener('keydown', handleEscapeKey);

    // Reset form and clear validation errors
    form.reset();
    clearValidationErrors();
  }

  /**
   * Opens the modal window
   */
  function openModal() {
    // Remove hidden attribute
    modalEl.removeAttribute('hidden');

    // Set ARIA
    modalEl.setAttribute('aria-modal', 'true');

    // Force reflow, then add visible class
    requestAnimationFrame(() => {
      modalEl.classList.add('is-open');
    });

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Focus first input (after animation)
    setTimeout(() => {
      const firstInput = form.querySelector('input:not([type="checkbox"])');
      firstInput?.focus();
    }, 300);

    // Add event listeners
    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleEscapeKey);
  }

  // =========================================================================
  // Form Validation & Submission
  // =========================================================================

  /**
   * Validates form using HTML5 validation
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => form.checkValidity();

  /**
   * Show validation errors visually
   */
  function showValidationErrors() {
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    });
  }

  /**
   * Clear validation errors
   */
  function clearValidationErrors() {
    const invalidElements = form.querySelectorAll('.is-invalid');
    invalidElements.forEach((el) => el.classList.remove('is-invalid'));
  }

  /**
   * Handles form submission
   * @param {Event} e - Submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Show visual validation errors
      showValidationErrors();
      // Show native validation messages
      form.reportValidity();
      return;
    }

    // Clear validation errors if form is valid
    clearValidationErrors();

    // Get form data
    const formData = new FormData(form);

    try {
      // Submit to server (POST method per spec)
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Success: close modal
        closeModal();

        // Reset form after successful submit
        form.reset();
        // TODO: Show success notification if notification modal exists
      } else {
        // TODO: Show error notification (server error)
      }
    } catch (error) {
      // TODO: Show error notification (network error)
    }
  };

  // =========================================================================
  // Initialization
  // =========================================================================

  /**
   * Initialize modal module
   * Sets up all event listeners
   */
  const init = () => {
    // Open modal triggers (buttons with data-modal-target="feedback")
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default button/link behavior
        openModal();
      });
    });

    // Form submit
    form.addEventListener('submit', handleSubmit);

    // Remove validation error on input
    const formInputs = form.querySelectorAll('input, select');
    formInputs.forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
    });

    // Phone mask (simplified - shows +7 on focus)
    initPhoneMask();

    // Set initial hidden state
    modalEl.setAttribute('hidden', '');
    modalEl.setAttribute('aria-modal', 'false');
  };

  // =========================================================================
  // Public API
  // =========================================================================
  return {
    init,
  };
})();

export default modal;
