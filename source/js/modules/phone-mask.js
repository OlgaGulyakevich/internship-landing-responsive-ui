/**
 * Phone Mask Module
 * Applies +7 phone mask to input fields
 *
 * Features:
 * - Shows "+7 " on focus if field is empty
 * - Allows only digits, +, and spaces
 * - Clears field on blur if only "+7" remains
 *
 * @module phoneMask
 */

/**
 * Applies phone mask to a single input element
 * @param {HTMLInputElement} input - Phone input element
 */
export function applyPhoneMask(input) {
  if (!input || input.type !== 'tel') {
    return;
  }

  // Show "+7 " on focus if field is empty
  input.addEventListener('focus', (e) => {
    if (!e.target.value || e.target.value.trim() === '') {
      e.target.value = '+7 ';
      e.target.setSelectionRange(3, 3); // Cursor after "+7 "
    }
  });

  // Filter input - only allow digits, +, and spaces
  input.addEventListener('input', (e) => {
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
  input.addEventListener('blur', (e) => {
    const value = e.target.value.trim();
    if (value === '+7' || value === '+7 ' || value === '') {
      e.target.value = '';
    }
  });
}

/**
 * Applies phone mask to all inputs with data-phone-mask attribute
 */
export function initPhoneMasks() {
  const phoneInputs = document.querySelectorAll('[data-phone-mask="true"]');
  phoneInputs.forEach((input) => applyPhoneMask(input));
}
