/**
 * Notification Modal Module
 * Displays success/error messages after form submission
 *
 * Features:
 * - Show success or error notification
 * - Auto-close after 5 seconds
 * - Manual close via overlay click, ESC key, or close button
 * - Dynamic title and message updates
 *
 * @module notificationModal
 */

const notificationModal = (() => {
  // =========================================================================
  // DOM Elements
  // =========================================================================
  const modalEl = document.getElementById('notification-modal');

  if (!modalEl) {
    return { init: () => {} }; // Guard clause - module disabled if no modal
  }

  const overlay = modalEl.querySelector('.notification-modal__overlay');
  const closeBtn = modalEl.querySelector('.notification-modal__close');
  const icon = modalEl.querySelector('.notification-modal__icon');
  const title = modalEl.querySelector('.notification-modal__title');
  const message = modalEl.querySelector('.notification-modal__message');

  let autoCloseTimer = null;

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
   * Closes the notification modal
   */
  function closeModal() {
    // Clear auto-close timer if exists
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }

    // Add hidden class (triggers fade-out animation)
    modalEl.classList.add('notification-modal--hidden');

    // Remove event listeners
    overlay.removeEventListener('click', closeModal);
    closeBtn.removeEventListener('click', closeModal);
    document.removeEventListener('keydown', handleEscapeKey);
  }

  /**
   * Opens the notification modal
   * @param {string} type - 'success' or 'error'
   * @param {string} titleText - Title text
   * @param {string} messageText - Message text
   */
  function openModal(type, titleText, messageText) {
    // Update content
    title.textContent = titleText;
    message.textContent = messageText;

    // Update icon state
    if (type === 'success') {
      icon.classList.remove('notification-modal__icon--error');
      icon.classList.add('notification-modal__icon--success');
    } else {
      icon.classList.remove('notification-modal__icon--success');
      icon.classList.add('notification-modal__icon--error');
    }

    // Show modal
    modalEl.classList.remove('notification-modal--hidden');

    // Add event listeners
    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleEscapeKey);

    // Auto-close after 5 seconds
    autoCloseTimer = setTimeout(() => {
      closeModal();
    }, 5000);
  }

  // =========================================================================
  // Public API
  // =========================================================================

  /**
   * Show success notification
   * @param {string} messageText - Success message
   */
  const showSuccess = (messageText = 'Ваша заявка успешно отправлена!') => {
    openModal('success', 'Успешно!', messageText);
  };

  /**
   * Show error notification
   * @param {string} messageText - Error message
   */
  const showError = (messageText = 'Произошла ошибка при отправке. Попробуйте позже.') => {
    openModal('error', 'Ошибка', messageText);
  };

  /**
   * Initialize notification modal module
   * Sets up initial state
   */
  const init = () => {
    // Ensure modal is hidden on init
    modalEl.classList.add('notification-modal--hidden');
  };

  return {
    init,
    showSuccess,
    showError,
    close: closeModal,
  };
})();

export default notificationModal;
