let expression = '0';
let buttons = document.querySelectorAll(".button");
let expButtons = document.querySelectorAll(".exp-button");
let screen = document.querySelector(".screen");
let equal = document.querySelector(".equal");
let ACButton = document.querySelector(".AC");
let clickaudio = document.getElementById("click-audio");
let backspace = document.querySelector(".back");

const MAX_INPUT_LENGTH = 15;

screen.innerHTML = expression;

const adjustFontSize = () => {
    const maxWidth = screen.offsetWidth;
    const contentWidth = screen.scrollWidth;
    let fontSize = parseFloat(window.getComputedStyle(screen).fontSize);
    
    while (contentWidth > maxWidth && fontSize > 10) {
        fontSize -= 1;
        screen.style.fontSize = `${fontSize}px`;
    }
    
    if (contentWidth <= maxWidth) {
        screen.style.fontSize = '2rem';
    }
    
    if (contentWidth > maxWidth) {
        screen.style.textOverflow = "ellipsis";
        screen.style.whiteSpace = "nowrap";
        screen.style.overflow = "hidden";
    } else {
        screen.style.textOverflow = "unset";
    }
};

const updateScreen = (value) => {
    screen.innerHTML = value;
    adjustFontSize();
};

expButtons.forEach(item => {
    item.addEventListener("click", () => {
        playButtonClickSound();

        if (expression.length >= MAX_INPUT_LENGTH) {
            alert("Maximum input length reached!");
            return;
        }

        const input = item.getAttribute("data-href");
        
        if (['+', '-', '*', '/'].includes(input)) {
            if (['+', '-', '*', '/'].includes(expression.slice(-1))) {
                expression = expression.slice(0, -1) + input;
            } else {
                expression += input;
            }
        }
        else if (input === '.') {
            const numbers = expression.split(/[-+*/]/);
            const lastNumber = numbers[numbers.length - 1];
            if (!lastNumber.includes('.')) {
                expression += input;
            }
        }
        else {
            if (expression === '0' && input !== '.') {
                expression = input;
            } else {
                expression += input;
            }
        }

        updateScreen(expression);
    });
});

equal.addEventListener("click", () => {
    playButtonClickSound();

    try {
        if (['+', '-', '*', '/'].includes(expression.slice(-1))) {
            expression = expression.slice(0, -1);
        }
        
        let result = eval(expression);
        result = Math.round(result * 100000000) / 100000000;
        expression = String(result);
        updateScreen(expression);
    } catch (error) {
        updateScreen('Error');
        expression = '0';
    }
});

backspace.addEventListener("click", () => {
    playButtonClickSound();

    if (expression.length > 1) {
        expression = expression.slice(0, -1);
    } else {
        expression = '0';
    }
    updateScreen(expression);
});

ACButton.addEventListener("click", () => {
    playButtonClickSound();
    expression = '0';
    updateScreen(expression);
});

const playButtonClickSound = () => {
    if (clickaudio) {
        clickaudio.currentTime = 0;
        clickaudio.play().catch((error) => {
            console.error("Audio playback error:", error);
        });
    }
};

window.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/[\d+\-*/.%]/.test(key)) {
        playButtonClickSound();

        if (expression.length >= MAX_INPUT_LENGTH) {
            alert("Maximum input length reached!");
            return;
        }

        if (expression === '0' && key !== '.') {
            expression = '';
        }
        expression += key;
        updateScreen(expression);
    }

    if (key === 'Enter') {
        playButtonClickSound();
        equal.click();
    }

    if (key === 'Backspace') {
        playButtonClickSound();
        backspace.click();
    }

    if (key === 'Escape') {
        playButtonClickSound();
        ACButton.click();
    }
});