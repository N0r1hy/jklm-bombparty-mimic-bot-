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
