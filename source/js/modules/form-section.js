/**
 * Form Section Module
 * Manages form in the "Напишите нам" section
 *
 * Features:
 * - Form validation (all fields required)
 * - Phone mask (shows +7 on focus)
 * - Form submission via POST
 * - Show notification on success/error
 * - Visual validation errors (.is-invalid class)
 *
 * @module formSection
 */

import notificationModal from './notification-modal.js';
import { applyPhoneMask } from './phone-mask.js';

const formSection = (() => {
  // DOM Elements
  const form = document.querySelector('.form__form');

  if (!form) {
    return { init: () => {} }; // Guard clause
  }

  const phoneInput = form.querySelector('input[type="tel"]');

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
   * Initialize form section module
   */
  const init = () => {
    // Form submit
    form.addEventListener('submit', handleSubmit);

    // Get all form inputs
    const formInputs = form.querySelectorAll('input, select, textarea');

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

    // Reset validation errors when form leaves viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // When form leaves viewport, clear all validation errors
        if (!entry.isIntersecting) {
          const invalidElements = form.querySelectorAll('.is-invalid');
          invalidElements.forEach((el) => el.classList.remove('is-invalid'));
        }
      });
    }, {
      threshold: 0, // Trigger when any part of form leaves viewport
    });

    observer.observe(form);
  };

  return {
    init,
  };
})();

export default formSection;
