const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const customInput = document.getElementById('customMinutes');
const progressCircle = document.querySelector('.progress-ring__circle');
const radius = progressCircle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = 0; // Start full

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

let defaultDuration = 25 * 60;
let timeLeft = defaultDuration;
let timerId = null;
let isRunning = false;

// Audio Context for the beep sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    if (timeLeft <= 0) {
        timerDisplay.textContent = "Time's Up";
        timerDisplay.style.fontSize = "3.5rem"; // Adjust for longer text
        document.title = "Time's Up! - Focus Flow";
    } else {
        timerDisplay.textContent = formatTime(timeLeft);
        timerDisplay.style.fontSize = ""; // Reset to default CSS
        document.title = `${formatTime(timeLeft)} - Focus Flow`;
    }

    // Update Ring
    const percent = Math.max(0, (timeLeft / defaultDuration) * 100);
    setProgress(percent);
}

function getCustomTime() {
    const val = parseInt(customInput.value);
    if (val && val > 0) {
        return val * 60;
    }
    return 25 * 60; // Default fallback
}

customInput.addEventListener('input', () => {
    if (!isRunning) {
        defaultDuration = getCustomTime();
        timeLeft = defaultDuration;
        updateDisplay();
        // Force full ring immediately for visual feedback
        setProgress(100);
    }
});

function playNotificationSound() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Create a playful, major arpeggio melody: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, index) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine'; // Sine is smooth and pleasant
        oscillator.frequency.value = freq;

        // Timing
        const startTime = now + (index * 0.2); // Stagger notes
        const duration = 0.5;

        // Envelope (Bell-like)
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    });

    // Add a final longer chord note for resolution
    const finalOsc = audioCtx.createOscillator();
    const finalGain = audioCtx.createGain();
    finalOsc.type = 'triangle'; // Slightly richer tone
    finalOsc.frequency.value = 523.25; // C5

    finalGain.gain.setValueAtTime(0, now + 0.8);
    finalGain.gain.linearRampToValueAtTime(0.2, now + 1.0);
    finalGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0); // Long decay

    finalOsc.connect(finalGain);
    finalGain.connect(audioCtx.destination);
    finalOsc.start(now + 0.8);
    finalOsc.stop(now + 3.0);
}

function startTimer() {
    if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        startBtn.textContent = 'Start';
        customInput.disabled = false;
        return;
    }

    if (timeLeft <= 0) { // Check <= 0 to handle Time's Up state redo
        timeLeft = getCustomTime();
    }

    isRunning = true;
    startBtn.textContent = 'Pause';
    customInput.disabled = true;

    // Ensure audio context is ready (user interaction required)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerId);
            isRunning = false;
            startBtn.textContent = 'Start';
            customInput.disabled = false;
            timeLeft = 0;
            updateDisplay();
            playNotificationSound();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    defaultDuration = getCustomTime();
    timeLeft = defaultDuration;
    startBtn.textContent = 'Start';
    customInput.disabled = false;
    updateDisplay();
    document.title = 'Modern Pomodoro';
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
