// ============================================
// LIVE WATCH DISPLAY - Real-time Clock
// ============================================

class LiveWatch {
    constructor(watchElement) {
        this.watch = watchElement;
        this.hourHand = watchElement.querySelector('.hour-hand');
        this.minuteHand = watchElement.querySelector('.minute-hand');
        this.secondHand = watchElement.querySelector('.second-hand');
        this.digitalDisplay = watchElement.querySelector('.digital-time');

        this.init();
    }

    init() {
        // Set initial time
        this.updateTime();

        // Update every second
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate smooth rotation angles
        // Second hand: moves smoothly with milliseconds
        const secondAngle = (seconds + milliseconds / 1000) * 6; // 360deg / 60sec = 6deg per second

        // Minute hand: moves smoothly with seconds
        const minuteAngle = (minutes + seconds / 60) * 6; // 360deg / 60min = 6deg per minute

        // Hour hand: moves smoothly with minutes
        const hourAngle = ((hours % 12) + minutes / 60) * 30; // 360deg / 12hr = 30deg per hour

        // Apply rotations
        if (this.secondHand) {
            this.secondHand.style.transform = `rotate(${secondAngle}deg)`;
        }

        if (this.minuteHand) {
            this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        }

        if (this.hourHand) {
            this.hourHand.style.transform = `rotate(${hourAngle}deg)`;
        }

        // Update digital display if present (for sport watch)
        if (this.digitalDisplay) {
            const formattedTime = this.formatTime(hours, minutes, seconds);
            this.digitalDisplay.textContent = formattedTime;
        }
    }

    formatTime(hours, minutes, seconds) {
        // Format as HH:MM:SS
        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
}

// Initialize all live watches when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const watches = document.querySelectorAll('.live-watch');
    watches.forEach(watch => {
        new LiveWatch(watch);
    });
});

// Also initialize when new watches are added dynamically
function initializeLiveWatches() {
    const watches = document.querySelectorAll('.live-watch');
    watches.forEach(watch => {
        if (!watch.classList.contains('initialized')) {
            new LiveWatch(watch);
            watch.classList.add('initialized');
        }
    });
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.LiveWatch = LiveWatch;
    window.initializeLiveWatches = initializeLiveWatches;
}
