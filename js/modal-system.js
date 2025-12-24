// ============================================
// CHRONOLUX - Modal System
// Reusable modal component for overlays
// ============================================

class ModalSystem {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        // Add modal container to body if it doesn't exist
        if (!document.getElementById('modal-root')) {
            const modalRoot = document.createElement('div');
            modalRoot.id = 'modal-root';
            document.body.appendChild(modalRoot);
        }
    }

    /**
     * Create and show a modal
     * @param {Object} options - Modal configuration
     * @param {string} options.id - Unique modal ID
     * @param {string} options.title - Modal title
     * @param {string} options.content - Modal HTML content
     * @param {string} options.size - Modal size: 'small', 'medium', 'large', 'fullscreen'
     * @param {boolean} options.closeOnBackdrop - Close modal when clicking backdrop
     * @param {Function} options.onClose - Callback when modal closes
     */
    show(options) {
        const {
            id = 'modal-' + Date.now(),
            title = '',
            content = '',
            size = 'medium',
            closeOnBackdrop = true,
            onClose = null
        } = options;

        // Close existing modal
        if (this.activeModal) {
            this.close();
        }

        // Create modal HTML
        const modalHTML = `
      <div class="modal-backdrop" id="${id}-backdrop">
        <div class="modal-container modal-${size}" id="${id}-container">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" id="${id}-close" aria-label="Close modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body" id="${id}-body">
            ${content}
          </div>
        </div>
      </div>
    `;

        // Insert modal into DOM
        const modalRoot = document.getElementById('modal-root');
        modalRoot.innerHTML = modalHTML;

        // Store active modal info
        this.activeModal = {
            id,
            onClose
        };

        // Add event listeners
        const closeBtn = document.getElementById(`${id}-close`);
        const backdrop = document.getElementById(`${id}-backdrop`);

        closeBtn.addEventListener('click', () => this.close());

        if (closeOnBackdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.close();
                }
            });
        }

        // ESC key to close
        document.addEventListener('keydown', this.handleEscKey);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Trigger animation
        setTimeout(() => {
            backdrop.classList.add('modal-active');
        }, 10);
    }

    /**
     * Close the active modal
     */
    close() {
        if (!this.activeModal) return;

        const backdrop = document.getElementById(`${this.activeModal.id}-backdrop`);

        if (backdrop) {
            backdrop.classList.remove('modal-active');

            setTimeout(() => {
                const modalRoot = document.getElementById('modal-root');
                if (modalRoot) {
                    modalRoot.innerHTML = '';
                }

                // Restore body scroll
                document.body.style.overflow = '';

                // Call onClose callback
                if (this.activeModal.onClose) {
                    this.activeModal.onClose();
                }

                this.activeModal = null;
            }, 300); // Match CSS transition duration
        }

        // Remove ESC key listener
        document.removeEventListener('keydown', this.handleEscKey);
    }

    /**
     * Handle ESC key press
     */
    handleEscKey = (e) => {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    /**
     * Update modal content
     * @param {string} content - New HTML content
     */
    updateContent(content) {
        if (!this.activeModal) return;

        const modalBody = document.getElementById(`${this.activeModal.id}-body`);
        if (modalBody) {
            modalBody.innerHTML = content;
        }
    }

    /**
     * Check if a modal is currently active
     * @returns {boolean}
     */
    isActive() {
        return this.activeModal !== null;
    }
}

// Create global modal instance
const modalSystem = new ModalSystem();
