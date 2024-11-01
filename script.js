const countdownElement = document.getElementById("countdown");
let countdownTime = 30 * 60 * 1000; // Default countdown time in milliseconds (30 minutes)
const audio = new Audio('alarm.mp3'); // Replace with your alarm sound file
let isFlashing = false;
let intervalId;
let startTime = Date.now(); // Store the start time

function updateCountdownDisplay(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((milliseconds % 1000) / 10);
    countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(millis).padStart(2, '0')}`;
}

function startFlashing() {
    isFlashing = true;
    countdownElement.classList.add("red-background");
    audio.play();
    setTimeout(() => {
        countdownElement.classList.remove("red-background");
        isFlashing = false;
    }, 3000);
}

async function syncCountdown() {
    try {
        const response = await fetch('https://aa1e0d9c-5efb-4c61-b04b-37e795156356-00-3enzho20f54vc.spock.replit.dev/api/get-time');
        const data = await response.json();
        countdownTime = data.time; // Get the time from the server
        updateCountdownDisplay(countdownTime);
    } catch (error) {
        console.error("Error syncing countdown:", error);
    }
}

function calculateRemainingTime() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime; // Time elapsed since the start
    const remainingTime = countdownTime - elapsedTime; // Remaining time in milliseconds
    return Math.max(remainingTime, 0); // Ensure it's not negative
}

function startCountdown() {
    intervalId = setInterval(() => {
        const remainingTime = calculateRemainingTime();
        updateCountdownDisplay(remainingTime);

        if (remainingTime <= 10000 && !isFlashing) {
            startFlashing();
        }

        if (remainingTime <= 0) {
            clearInterval(intervalId);
        }

        // Sync the updated time with the backend every second
        if (Math.floor(remainingTime / 1000) % 1 === 0) {
            fetch('https://aa1e0d9c-5efb-4c61-b04b-37e795156356-00-3enzho20f54vc.spock.replit.dev/api/update-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ time: Math.floor(remainingTime / 1000) })
            });
        }
    }, 10); // Update every 10 milliseconds
}

// Initialize the countdown sync and start
syncCountdown().then(startCountdown);
