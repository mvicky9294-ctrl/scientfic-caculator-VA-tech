let expressionDisplay = document.getElementById('expression-display');
let livePreview = document.getElementById('live-preview');
let currentInput = '';

function press(val) {
    currentInput += val;
    updateDisplay();
    runLivePreview();
}

function clearDisplay() {
    currentInput = '';
    expressionDisplay.textContent = '';
    livePreview.textContent = '0';
}

function updateDisplay() {
    // Make backend syntax readable for the frontend user layout
    let cleanView = currentInput
        .replace(/Math\.PI/g, 'π')
        .replace(/Math\.sqrt\(/g, '√(')
        .replace(/Math\.log10\(/g, 'log(')
        .replace(/\*\*2/g, '²')
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');
        
    expressionDisplay.textContent = cleanView;
}

function runLivePreview() {
    if (currentInput === '') {
        livePreview.textContent = '0';
        return;
    }
    
    try {
        let tempInput = currentInput;

        // Auto-close open brackets for backend calculation parsing
        let openBrackets = (tempInput.match(/\(/g) || []).length;
        let closeBrackets = (tempInput.match(/\)/g) || []).length;
        while (openBrackets > closeBrackets) {
            tempInput += ')';
            closeBrackets++;
        }

        // Support standard trig calculations cleanly inside evaluations
        let evalString = tempInput
            .replace(/sin\(/g, 'Math.sin((Math.PI/180)*')
            .replace(/cos\(/g, 'Math.cos((Math.PI/180)*')
            .replace(/tan\(/g, 'Math.tan((Math.PI/180)*');

        let result = eval(evalString);

        if (result !== undefined && !isNaN(result)) {
            if (result % 1 !== 0) {
                result = parseFloat(result.toFixed(6));
            }
            livePreview.textContent = "= " + result;
        }
    } catch (e) {
        // Leave previous clean preview untouched while formula is mid-typing
    }
}

function calculate() {
    if (currentInput === '') return;
    runLivePreview();
    
    // Set the final answer as the starting base for future equations
    if (livePreview.textContent.startsWith("= ")) {
        let finalAns = livePreview.textContent.replace("= ", "");
        currentInput = finalAns;
        expressionDisplay.textContent = finalAns;
        livePreview.textContent = finalAns;
    } else {
        livePreview.textContent = "Error";
    }
}