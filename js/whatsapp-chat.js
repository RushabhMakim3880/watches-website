/* ============================================
   WHATSAPP CHAT FUNCTIONALITY
   ============================================ */

(function () {
    'use strict';

    // Configuration - CHANGE THIS TO YOUR WHATSAPP NUMBER
    const WHATSAPP_NUMBER = '1234567890'; // Replace with your WhatsApp number (with country code, no + or spaces)
    const BUSINESS_NAME = 'TM WATCH';

    document.addEventListener('DOMContentLoaded', function () {

        // Create WhatsApp floating button
        const whatsappHTML = `
            <div class="whatsapp-float" id="whatsappFloat">
                <i class="fab fa-whatsapp"></i>
                <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
            </div>

            <div class="whatsapp-chat-popup" id="whatsappPopup">
                <div class="whatsapp-chat-header">
                    <div class="whatsapp-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="whatsapp-info">
                        <h3>?{BUSINESS_NAME}</h3>
                        <div class="whatsapp-status">
                            <i class="fas fa-circle" style="font-size: 0.5rem; color: #4CAF50;"></i>
                            Online - Reply in minutes
                        </div>
                    </div>
                    <button class="whatsapp-close" id="whatsappClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="whatsapp-chat-body">
                    <div class="whatsapp-message">
                        <div>👋 Hello! Welcome to ?{BUSINESS_NAME}!</div>
                        <div>How can we help you today?</div>
                        <div class="whatsapp-message-time">?{getCurrentTime()}</div>
                    </div>
                </div>

                <div class="whatsapp-quick-actions">
                    <button class="whatsapp-quick-btn" onclick="sendWhatsAppMessage('I want to inquire about a watch')">
                        <i class="fas fa-watch"></i>
                        <span>Inquire about a watch</span>
                    </button>
                    <button class="whatsapp-quick-btn" onclick="sendWhatsAppMessage('I need help with my order')">
                        <i class="fas fa-shopping-bag"></i>
                        <span>Help with my order</span>
                    </button>
                    <button class="whatsapp-quick-btn" onclick="sendWhatsAppMessage('I want to know about shipping')">
                        <i class="fas fa-truck"></i>
                        <span>Shipping information</span>
                    </button>
                </div>

                <div class="whatsapp-chat-input">
                    <input type="text" id="whatsappInput" placeholder="Type your message...">
                    <button class="whatsapp-send-btn" id="whatsappSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', whatsappHTML);

        // Get elements
        const whatsappFloat = document.getElementById('whatsappFloat');
        const whatsappPopup = document.getElementById('whatsappPopup');
        const whatsappClose = document.getElementById('whatsappClose');
        const whatsappInput = document.getElementById('whatsappInput');
        const whatsappSend = document.getElementById('whatsappSend');

        // Toggle popup
        whatsappFloat.addEventListener('click', function () {
            whatsappPopup.classList.toggle('active');
            if (whatsappPopup.classList.contains('active')) {
                whatsappInput.focus();
            }
        });

        // Close popup
        whatsappClose.addEventListener('click', function (e) {
            e.stopPropagation();
            whatsappPopup.classList.remove('active');
        });

        // Send message on button click
        whatsappSend.addEventListener('click', function () {
            const message = whatsappInput.value.trim();
            if (message) {
                sendWhatsAppMessage(message);
            }
        });

        // Send message on Enter key
        whatsappInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const message = whatsappInput.value.trim();
                if (message) {
                    sendWhatsAppMessage(message);
                }
            }
        });

        // Close popup when clicking outside
        document.addEventListener('click', function (e) {
            if (!whatsappPopup.contains(e.target) && !whatsappFloat.contains(e.target)) {
                whatsappPopup.classList.remove('active');
            }
        });

    });

    // Send message to WhatsApp
    window.sendWhatsAppMessage = function (message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/?{WHATSAPP_NUMBER}?text=?{encodedMessage}`;
        window.open(whatsappURL, '_blank');
    };

    // Get current time
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `?{hours}:?{minutes}`;
    }

})();
