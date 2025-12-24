// ============================================
// CHRONOLUX - Form Validation Module
// ============================================

/**
 * Reusable form validation utilities
 */
const validator = {
    /**
     * Validate email format
     * @param {string} value - Email to validate
     * @returns {boolean} Validation result
     */
    email(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    },

    /**
     * Check if field is required
     * @param {string} value - Value to check
     * @returns {boolean} Validation result
     */
    required(value) {
        return value !== null && value !== undefined && value.trim() !== '';
    },

    /**
     * Validate minimum length
     * @param {string} value - Value to validate
     * @param {number} min - Minimum length
     * @returns {boolean} Validation result
     */
    minLength(value, min) {
        return value.length >= min;
    },

    /**
     * Validate maximum length
     * @param {string} value - Value to validate
     * @param {number} max - Maximum length
     * @returns {boolean} Validation result
     */
    maxLength(value, max) {
        return value.length <= max;
    },

    /**
     * Validate credit card number using Luhn algorithm
     * @param {string} value - Card number to validate
     * @returns {boolean} Validation result
     */
    creditCard(value) {
        // Remove spaces and dashes
        const cardNumber = value.replace(/[\s-]/g, '');

        // Check if it's all digits
        if (!/^\d+$/.test(cardNumber)) {
            return false;
        }

        // Luhn algorithm
        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return (sum % 10) === 0;
    },

    /**
     * Validate CVV code
     * @param {string} value - CVV to validate
     * @returns {boolean} Validation result
     */
    cvv(value) {
        return /^\d{3,4}$/.test(value);
    },

    /**
     * Validate phone number
     * @param {string} value - Phone number to validate
     * @returns {boolean} Validation result
     */
    phone(value) {
        // Accepts various formats: +1-234-567-8900, (234) 567-8900, 234.567.8900, etc.
        const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return regex.test(value);
    },

    /**
     * Validate ZIP/postal code
     * @param {string} value - ZIP code to validate
     * @returns {boolean} Validation result
     */
    zipCode(value) {
        // US ZIP code (5 digits or 5+4 format)
        return /^\d{5}(-\d{4})?$/.test(value);
    },

    /**
     * Validate password strength
     * @param {string} value - Password to validate
     * @returns {Object} Validation result with strength level
     */
    password(value) {
        const result = {
            valid: false,
            strength: 'weak',
            message: ''
        };

        if (value.length < 8) {
            result.message = 'Password must be at least 8 characters';
            return result;
        }

        let strength = 0;

        // Check for lowercase
        if (/[a-z]/.test(value)) strength++;

        // Check for uppercase
        if (/[A-Z]/.test(value)) strength++;

        // Check for numbers
        if (/\d/.test(value)) strength++;

        // Check for special characters
        if (/[^a-zA-Z\d]/.test(value)) strength++;

        if (strength >= 3) {
            result.valid = true;
            result.strength = strength === 4 ? 'strong' : 'medium';
            result.message = `Password strength: ${result.strength}`;
        } else {
            result.message = 'Password must contain uppercase, lowercase, and numbers';
        }

        return result;
    },

    /**
     * Validate URL format
     * @param {string} value - URL to validate
     * @returns {boolean} Validation result
     */
    url(value) {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Validate number range
     * @param {number} value - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} Validation result
     */
    range(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    /**
     * Validate date format (YYYY-MM-DD)
     * @param {string} value - Date to validate
     * @returns {boolean} Validation result
     */
    date(value) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(value)) return false;

        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    }
};

/**
 * Form validation class
 */
class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.errors = {};
        this.rules = {};
    }

    /**
     * Add validation rule for a field
     * @param {string} fieldName - Name of the field
     * @param {Array} rules - Array of validation rules
     */
    addRule(fieldName, rules) {
        this.rules[fieldName] = rules;
    }

    /**
     * Validate a single field
     * @param {string} fieldName - Name of the field
     * @param {string} value - Value to validate
     * @returns {boolean} Validation result
     */
    validateField(fieldName, value) {
        const fieldRules = this.rules[fieldName];
        if (!fieldRules) return true;

        for (const rule of fieldRules) {
            const { type, message, ...params } = rule;

            let isValid = false;

            switch (type) {
                case 'required':
                    isValid = validator.required(value);
                    break;
                case 'email':
                    isValid = validator.email(value);
                    break;
                case 'minLength':
                    isValid = validator.minLength(value, params.min);
                    break;
                case 'maxLength':
                    isValid = validator.maxLength(value, params.max);
                    break;
                case 'creditCard':
                    isValid = validator.creditCard(value);
                    break;
                case 'cvv':
                    isValid = validator.cvv(value);
                    break;
                case 'phone':
                    isValid = validator.phone(value);
                    break;
                case 'zipCode':
                    isValid = validator.zipCode(value);
                    break;
                case 'password':
                    const result = validator.password(value);
                    isValid = result.valid;
                    break;
                case 'custom':
                    isValid = params.validator(value);
                    break;
                default:
                    isValid = true;
            }

            if (!isValid) {
                this.errors[fieldName] = message || `Invalid ${fieldName}`;
                this.showError(fieldName, this.errors[fieldName]);
                return false;
            }
        }

        this.clearError(fieldName);
        delete this.errors[fieldName];
        return true;
    }

    /**
     * Validate entire form
     * @returns {boolean} Validation result
     */
    validate() {
        this.errors = {};
        let isValid = true;

        for (const fieldName in this.rules) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const fieldValid = this.validateField(fieldName, field.value);
                if (!fieldValid) {
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    /**
     * Show error message for a field
     * @param {string} fieldName - Name of the field
     * @param {string} message - Error message
     */
    showError(fieldName, message) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        // Add error class to field
        field.classList.add('error');

        // Find or create error message element
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = 'color: var(--error-red); font-size: var(--text-sm); margin-top: var(--space-xs);';
            field.parentElement.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    /**
     * Clear error message for a field
     * @param {string} fieldName - Name of the field
     */
    clearError(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.classList.remove('error');

        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Clear all errors
     */
    clearAllErrors() {
        this.errors = {};
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());

        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    /**
     * Setup real-time validation
     */
    setupRealTimeValidation() {
        for (const fieldName in this.rules) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(fieldName, field.value);
                });

                field.addEventListener('input', () => {
                    // Clear error on input
                    if (this.errors[fieldName]) {
                        this.clearError(fieldName);
                    }
                });
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validator, FormValidator };
}
