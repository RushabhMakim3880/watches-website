/* ============================================
   AR TRY-ON FUNCTIONALITY
   ============================================ */

(function () {
    'use strict';

    let stream = null;
    let selectedWatch = null;

    document.addEventListener('DOMContentLoaded', function () {

        // Create AR Try-On interface
        const arHTML = `
      <div class="ar-tryon" id="arTryon">
        <div class="ar-container">
          <div class="ar-header">
            <div class="ar-title">
              <i class="fas fa-camera"></i>
              AR Try-On
            </div>
            <button class="ar-close" id="arClose">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="ar-video-container">
            <video class="ar-video" id="arVideo" autoplay playsinline></video>
            <canvas class="ar-overlay-canvas" id="arCanvas"></canvas>
            <div class="ar-flash" id="arFlash"></div>
          </div>

          <div class="ar-watch-selector" id="arWatchSelector">
            <!-- Watch options will be added dynamically -->
          </div>

          <div class="ar-controls">
            <button class="ar-control-btn" id="arSwitchCamera" title="Switch Camera">
              <i class="fas fa-sync-alt"></i>
              <span>Switch</span>
            </button>
            <button class="ar-control-btn ar-capture-btn" id="arCapture" title="Capture Photo">
              <i class="fas fa-camera"></i>
            </button>
            <button class="ar-control-btn" id="arShare" title="Share">
              <i class="fas fa-share-alt"></i>
              <span>Share</span>
            </button>
          </div>

          <div class="ar-instructions" id="arInstructions">
            <h3>📸 AR Try-On</h3>
            <p>Position your wrist in front of the camera to see how the watch looks on you!</p>
            <button id="startAR">Start AR Experience</button>
          </div>
        </div>
      </div>
    `;
        document.body.insertAdjacentHTML('beforeend', arHTML);

        // Get elements
        const arTryon = document.getElementById('arTryon');
        const arVideo = document.getElementById('arVideo');
        const arCanvas = document.getElementById('arCanvas');
        const arClose = document.getElementById('arClose');
        const arCapture = document.getElementById('arCapture');
        const arShare = document.getElementById('arShare');
        const arInstructions = document.getElementById('arInstructions');
        const startARBtn = document.getElementById('startAR');
        const arFlash = document.getElementById('arFlash');
        const arWatchSelector = document.getElementById('arWatchSelector');

        // Add AR Try-On buttons to product cards
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const btn = document.createElement('button');
            btn.className = 'ar-tryon-btn';
            btn.innerHTML = '<i class="fas fa-camera"></i> Try AR';
            btn.onclick = function (e) {
                e.stopPropagation();
                openARTryon(card);
            };
            card.querySelector('.product-image-container').appendChild(btn);
        });

        // Open AR Try-On
        function openARTryon(productCard) {
            const img = productCard.querySelector('.product-image');
            selectedWatch = {
                image: img.src,
                name: productCard.querySelector('.product-name')?.textContent || 'Watch'
            };

            // Populate watch selector with all watches
            arWatchSelector.innerHTML = '';
            productCards.forEach((card, index) => {
                const watchImg = card.querySelector('.product-image');
                const option = document.createElement('div');
                option.className = 'ar-watch-option' + (watchImg.src === selectedWatch.image ? ' selected' : '');
                option.innerHTML = `<img src="?{watchImg.src}" alt="Watch ?{index + 1}">`;
                option.onclick = function () {
                    document.querySelectorAll('.ar-watch-option').forEach(o => o.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedWatch.image = watchImg.src;
                    selectedWatch.name = card.querySelector('.product-name')?.textContent || 'Watch';
                };
                arWatchSelector.appendChild(option);
            });

            arTryon.classList.add('active');
            arInstructions.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        // Start AR camera
        startARBtn.addEventListener('click', async function () {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 1280, height: 720 },
                    audio: false
                });

                arVideo.srcObject = stream;
                arInstructions.classList.add('hidden');

                // Setup canvas
                arCanvas.width = arVideo.videoWidth || 1280;
                arCanvas.height = arVideo.videoHeight || 720;

                // Start drawing watch overlay
                drawWatchOverlay();

            } catch (error) {
                console.error('Camera access error:', error);
                showARNotification('❌ Camera access denied. Please enable camera permissions.', 'error');
                closeARTryon();
            }
        });

        // Draw watch overlay on canvas
        function drawWatchOverlay() {
            const ctx = arCanvas.getContext('2d');

            function draw() {
                if (!arTryon.classList.contains('active')) return;

                ctx.clearRect(0, 0, arCanvas.width, arCanvas.height);

                // Simple overlay - position watch image on wrist area
                // In a real implementation, you'd use hand tracking libraries like MediaPipe
                const watchImg = new Image();
                watchImg.src = selectedWatch.image;

                const watchWidth = 200;
                const watchHeight = 200;
                const x = (arCanvas.width / 2) - (watchWidth / 2);
                const y = (arCanvas.height * 0.6) - (watchHeight / 2);

                // Draw watch with some transparency
                ctx.globalAlpha = 0.9;
                ctx.drawImage(watchImg, x, y, watchWidth, watchHeight);
                ctx.globalAlpha = 1.0;

                // Draw guide text
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = 'bold 16px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Position your wrist here', arCanvas.width / 2, y - 30);

                requestAnimationFrame(draw);
            }

            draw();
        }

        // Capture photo
        arCapture.addEventListener('click', function () {
            // Flash effect
            arFlash.classList.add('active');
            setTimeout(() => arFlash.classList.remove('active'), 100);

            // Capture frame
            const canvas = document.createElement('canvas');
            canvas.width = arVideo.videoWidth;
            canvas.height = arVideo.videoHeight;
            const ctx = canvas.getContext('2d');

            // Draw video frame (mirrored)
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(arVideo, 0, 0);

            // Draw watch overlay
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const watchImg = new Image();
            watchImg.src = selectedWatch.image;
            watchImg.onload = function () {
                const watchWidth = 200;
                const watchHeight = 200;
                const x = (canvas.width / 2) - (watchWidth / 2);
                const y = (canvas.height * 0.6) - (watchHeight / 2);
                ctx.globalAlpha = 0.9;
                ctx.drawImage(watchImg, x, y, watchWidth, watchHeight);

                // Download image
                canvas.toBlob(function (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `watch-tryon-?{Date.now()}.png`;
                    a.click();
                    URL.revokeObjectURL(url);

                    showARNotification('📸 Photo saved!', 'success');
                });
            };
        });

        // Share functionality
        arShare.addEventListener('click', async function () {
            showARNotification('📤 Share feature coming soon!', 'info');
            // In real implementation, use Web Share API
        });

        // Close AR Try-On
        function closeARTryon() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
            arTryon.classList.remove('active');
            arInstructions.classList.remove('hidden');
            document.body.style.overflow = '';
        }

        arClose.addEventListener('click', closeARTryon);

        // AR Notification helper
        function showARNotification(message, type) {
            const colors = {
                success: 'linear-gradient(135deg, #39FF14, #2EE610)',
                error: 'linear-gradient(135deg, #FF006E, #D6005C)',
                info: 'linear-gradient(135deg, #00D4FF, #00FFF5)'
            };

            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ?{colors[type] || colors.info};
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10002;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-xl);
      `;
            document.body.appendChild(notification);

            setTimeout(() => notification.style.opacity = '1', 10);
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            if (!arTryon.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeARTryon();
            } else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                arCapture.click();
            }
        });

    });

})();
