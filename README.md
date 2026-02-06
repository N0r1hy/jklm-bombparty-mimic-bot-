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

1.  Copy the code from `script.js` or below.
2.  Go to [jklm.fun](https://jklm.fun) and join a **Bomb Party** room.
3.  Open your browser's Developer Tools (<kbd>F12</kbd> or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>).
4.  Look for a dropdown menu (usually says `top`).
5.  Change it to `bombparty/`.
6.  Paste the script into the **Console** and press `Enter`.(If you're unable to paste into the console, you might have to type `allow pasting` and hit enter).
7.  Wait for the `[JKLM Mimic Bot] Ready! Looking for game...` message in the console.

<details>
	<summary># Click to expand code</summary>

```js
(function() {
    let dictionary = [];
    let isReady = false;
    let lastSyllable = "";
    let lastTriedWord = "";
    let isProcessing = false;
    let lastSubmitTime = 0;
    let currentTypingId = 0;

    const MISTAKE_CHANCE = 0.10; 
    const KEY_NEIGHBORS = { 'a':'sqz', 's':'adwz', 'd':'sfere', 'f':'gdrvc', 'g':'hftvb', 'h':'jgynb', 'j':'khumn', 'k':'liom', 'l':'kop', 'o':'ipk', 'p':'ol', 'r':'tfed', 't':'ygfr', 'y':'uhgt', 'u':'ijhy', 'i':'uoj' };

    
    const getGameDocument = () => {
        const iframe = document.querySelector('iframe.game') || document.querySelector('iframe');
        if (iframe && iframe.contentDocument) return iframe.contentDocument;
        return document;
    };

    fetch('https://raw.githubusercontent.com/DO-Ui/bombparty-bot/master/wordlist.txt')
        .then(res => res.text())
        .then(data => {
            dictionary = data.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(w => w.length > 2);
            isReady = true;
            console.log("%c[JKLM Mimic Bot] Ready! Looking for game...", "color: #00ffcc; font-weight: bold;");
        });

    const forceSubmit = (inputField) => {
        const ev = new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', keyCode: 13 });
        inputField.dispatchEvent(ev);
        const form = inputField.closest('form');
        if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
        lastSubmitTime = Date.now();
    };

    const humanType = (inputField, text, typingId) => {
        return new Promise((resolve, reject) => {
            inputField.focus();
            inputField.value = "";
            let i = 0;
            const isShortWord = text.length <= 4;
            const minDelay = isShortWord ? 40 : 75;
            const maxDelay = isShortWord ? 85 : 125;

            const typeChar = async () => {
                if (typingId !== currentTypingId) { reject("Aborted."); return; }
                if (i < text.length) {
                    let charToType = text.charAt(i);
                    if (Math.random() < MISTAKE_CHANCE && i > 1) {
                        const neighbor = KEY_NEIGHBORS[charToType] ? KEY_NEIGHBORS[charToType][Math.floor(Math.random() * KEY_NEIGHBORS[charToType].length)] : 'q';
                        inputField.value += neighbor;
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, 150 + Math.random() * 200));
                        inputField.value = inputField.value.slice(0, -1);
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, 100));
                    }
                    inputField.value += charToType;
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    i++;
                    setTimeout(typeChar, minDelay + Math.random() * (maxDelay - minDelay));
                } else {
                    inputField.dispatchEvent(new Event('change', { bubbles: true }));
                    resolve();
                }
            };
            typeChar();
        });
    };

    const botAction = () => {
        if (!isReady) return;

        const gameDoc = getGameDocument();
        const myTurnDiv = gameDoc.querySelector('.selfTurn:not([style*="display: none"]):not(.hidden)');
        const syllableEl = gameDoc.querySelector('.syllable');

        if (myTurnDiv && syllableEl) {
            const currentSyl = syllableEl.textContent.toLowerCase().trim();
            const inputField = myTurnDiv.querySelector('input.styled') || myTurnDiv.querySelector('input');
            
            if (!inputField || currentSyl === "") return;

            const isNewSyllable = currentSyl !== lastSyllable;
            const isStuck = (currentSyl === lastSyllable) && (Date.now() - lastSubmitTime > 1600) && !isProcessing;

            if (isNewSyllable || isStuck) {
                currentTypingId++;
                isProcessing = true;
                lastSyllable = currentSyl;

                const matches = dictionary.filter(w => w.includes(currentSyl) && w !== lastTriedWord);
                if (matches.length > 0) {
                    const word = matches[Math.floor(Math.random() * matches.length)];
                    lastTriedWord = word;
                    const typingIdAtStart = currentTypingId;
                    const reactionTime = isStuck ? 350 : Math.floor(Math.random() * (1290 - 900 + 1) + 900);

                    setTimeout(() => {
                        if (typingIdAtStart !== currentTypingId) return;
                        humanType(inputField, word, typingIdAtStart).then(() => {
                            if (typingIdAtStart === currentTypingId) {
                                setTimeout(() => {
                                    forceSubmit(inputField);
                                    setTimeout(() => { isProcessing = false; }, 500);
                                }, 100 + Math.random() * 200);
                            }
                        }).catch(() => { isProcessing = false; });
                    }, reactionTime);
                } else { isProcessing = false; }
            }
        } else {
            if (isProcessing) { isProcessing = false; currentTypingId++; }
        }
    };

    setInterval(botAction, 200);
})();
```
</details>

## Customization

You can easily adjust the behavior in the code:
* `MISTAKE_CHANCE`: Change the frequency of typos.
* `reactionTime`: Adjust the 900ms-1290ms range for faster or slower starts.

## FAQ

**Q: Can I get banned for using this?**

A: There is always a risk, if your customized settings are settet to hight it will be visible.


**Q: Ctrl + Shift + I takes a screenshot**

A: Disable the keybind in your AMD Radeon app.


**Q: I get an error/Its not doing anything**

A: Make sure you're copy/pasting the script correctly and that you've have done all the steps.


## License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.

