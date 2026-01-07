# Implementation Plan - UI & Audio Polish

Enhance the application with a gradient title, "Time's Up" state, and a pleasant notification melody.

## Proposed Changes

### Styling
#### [MODIFY] [style.css]
- Feature: Gradient Text for "Focus Flow".
- Use `background-image: linear-gradient(...)`, `-webkit-background-clip: text`, and `color: transparent`.
- Gradient colors: Keep it subtle, maybe a lighter varying white/blue/purple mix to stand out against the background.

### Logic & Behavior
#### [MODIFY] [script.js]
- **Time's Up**:
    - When `timeLeft` hits 0, update `timerDisplay.textContent` to "Time's Up".
    - Adjust font size dynamically if needed to fit "Time's Up".
- **Audio**:
    - Replace `playNotificationSound`.
    - Create a sequence of notes (e.g., C5, E5, G5, C6) using multiple oscillators to form a "success" chime.
    - Duration: ~3 seconds.
    - Use a "bell" envelope (fast attack, slow decay).

## Verification Plan

### Manual Verification
- **Visuals**: Header text should look like a gradient.
- **Expiration**: Run short timer (set input to 0.1 or test code). At 0, display should say "Time's Up".
- **Audio**: Should hear a pleasant melody instead of a single beep.
