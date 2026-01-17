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
 * - Show notification on success/error
 * - Visual validation errors (.is-invalid class)
 *
 * @module modal
 */

import notificationModal from './notification-modal.js';
import { applyPhoneMask } from './phone-mask.js';

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

    // Unlock scroll (iOS Safari compatible)
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);

    // Remove event listeners
    overlay.removeEventListener('click', closeModal);
    closeBtn.removeEventListener('click', closeModal);
    document.removeEventListener('keydown', handleEscapeKey);

    // Reset form and clear validation errors
    form.reset();
    const invalidElements = form.querySelectorAll('.is-invalid');
    invalidElements.forEach((el) => el.classList.remove('is-invalid'));
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

    // Lock scroll (iOS Safari compatible)
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

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
  // Form Submission
  // =========================================================================

  /**
   * Handles form submission
   * @param {Event} e - Submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

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

        // Show success notification
        notificationModal.showSuccess('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
      } else {
        // Show error notification (server error)
        notificationModal.showError('Ошибка сервера. Пожалуйста, попробуйте отправить форму позже.');
      }
    } catch (error) {
      // Show error notification (network error)
      notificationModal.showError('Ошибка соединения. Проверьте подключение к интернету и попробуйте снова.');
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

    // Get all form inputs
    const formInputs = form.querySelectorAll('input, select');

    // Add invalid event listener to show red border when browser validates
    formInputs.forEach((input) => {
      // When browser finds invalid field, add visual error
      input.addEventListener('invalid', () => {
        input.classList.add('is-invalid');
      });

      // Remove validation error on input
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
    });

    // Apply phone mask
    if (phoneInput) {
      applyPhoneMask(phoneInput);
    }

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
