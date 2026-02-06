# jklm-bombparty-mimic-bot-
A JavaScript-based automation tool for jklm.fun. Features a sophisticated typing engine that mimics human behavior through variable WPM, keyboard-neighbor typo simulation, and dynamic syllable detection.

# JKLM Mimic Bot

An advanced, human-like automation script for **Bomb Party (jklm.fun)**. This bot is designed to bypass basic detection by mimicking natural human typing patterns, including reaction delays and intentional mistakes.

## Features

* **Natural Reaction Engine:** Implements a realistic delay of **0.9s – 1.29s** before responding to a new syllable, simulating human processing time.
* **Adaptive Typing Speed:** * Short words (≤4 chars) are typed with high speed (**40-85ms** per char).
    * Longer words use a more rhythmic, human pace (**75-125ms** per char).
* **Realistic Typos:** Includes a **10% chance** to hit a neighboring key, followed by a "shock" pause, a backspace, and a correction.
* **Instant Syllable Sync:** If the syllable changes while the bot is typing, it instantly aborts the current word and switches to a new one.
* **Smart Retry Logic:** If a word isn't accepted (already used or invalid), the bot waits for a realistic interval before trying a different word.

## Installation & Usage

1.  Copy the code from `script.js`.
2.  Go to [jklm.fun](https://jklm.fun) and join a **Bomb Party** room.
3.  Open your browser's Developer Tools (<kbd>F12</kbd> or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>).
4.  Look for a dropdown menu (usually says `top`)
5.  Change it to `bombparty/`.
6.  Paste the script into the **Console** and press `Enter`.
7.  Wait for the `[System] Twoja lista słów załadowana!` message in the console.

## Customization

You can easily adjust the behavior in the code:
* `MISTAKE_CHANCE`: Change the frequency of typos.
* `reactionTime`: Adjust the 900ms-1290ms range for faster or slower starts.

## License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.

