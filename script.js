const countdownElement = document.getElementById("countdown");
const backendUrl = 'https://countdown-backend.yourusername.repl.co/api/get-time'; // Replace with your actual backend URL
const audio = new Audio('alarm.mp3'); // Path to your alarm sound file
let isFlashing = false;

// Function to format and display the countdown time
function updateCountdownDisplay(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((milliseconds % 1000) / 10);
    countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(millis).padStart(2, '0')}`;
}

// Function to start the flashing effect and play sound when time is low
function startFlashingAndSound() {
    if (!isFlashing) {
        isFlashing = true;
        countdownElement.classList.add("red-background");
        audio.play();
        
        // Stop flashing after 3 seconds
        setTimeout(() => {
            countdownElement.classList.remove("red-background");
            isFlashing = false;
        }, 3000);
    }
}

// Function to fetch the current countdown time from the server
async function fetchCountdownTime() {
    try {
        const response = await fetch(backendUrl);
        const data = await response.json();
        
        // Update the display with the time from the server
        updateCountdownDisplay(data.time);
        
        // Trigger flashing and sound if time is below 10 seconds
        if (data.time <= 10000) {
            startFlashingAndSound();
        }
    } catch (error) {
        console.error("Error fetching countdown time:", error);
    }
}

// Start fetching the countdown time every 100 milliseconds
setInterval(fetchCountdownTime, 100);
