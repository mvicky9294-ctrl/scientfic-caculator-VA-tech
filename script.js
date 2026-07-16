let currentInput = "";
let memoryValue = 0;
let is2ndMode = false;

let tvmState = { N: null, IY: null, PV: null, PMT: null, FV: null };
let cashFlows = [];

const expressionDisplay = document.getElementById("expression-display");
const livePreview = document.getElementById("live-preview");
const indicatorDisplay = document.getElementById("indicator-display");

function updateIndicators(statusText = "") {
    if (statusText) {
        indicatorDisplay.innerText = statusText;
        indicatorDisplay.style.color = "#1f618d";
    } else if (is2ndMode) {
        indicatorDisplay.innerText = "2nd DEG";
        indicatorDisplay.style.color = "#a83232";
    } else {
        indicatorDisplay.innerText = "DEG";
        indicatorDisplay.style.color = "rgba(0,0,0,0.4)";
    }
}

function pressNum(num) {
    if (currentInput === "0" && num !== ".") {
        currentInput = num;
    } else {
        currentInput += num;
    }
    livePreview.innerText = currentInput;
}

function pressOp(op) {
    if (currentInput === "" && op === "-") {
        currentInput = "-";
        livePreview.innerText = currentInput;
        return;
    }
    currentInput += " " + op + " ";
    expressionDisplay.innerText = currentInput;
}

function press2nd() {
    is2ndMode = !is2ndMode;
    updateIndicators();
}

function compute() {
    updateIndicators("COMPUTE");
}

function pressKey(action) {
    if (action === 'ENTER') {
        updateIndicators("ENTERED");
    }
}

function clearAll() {
    currentInput = "";
    expressionDisplay.innerText = "";
    livePreview.innerText = "0";
    is2ndMode = false;
    updateIndicators();
}

function backspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.trimEnd();
        currentInput = currentInput.substring(0, currentInput.length - 1);
        livePreview.innerText = currentInput === "" || currentInput === "-" ? "0" : currentInput;
    }
}

function toggleSign() {
    if (currentInput !== "" && currentInput !== "0") {
        if (currentInput.startsWith("-")) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = "-" + currentInput;
        }
        livePreview.innerText = currentInput;
    }
}

function pressMath(type) {
    let val = parseFloat(livePreview.innerText);
    if (isNaN(val)) return;

    let result = 0;
    switch (type) {
        case 'sqrt': result = Math.sqrt(val); break;
        case 'sq':   result = Math.pow(val, 2); break;
        case 'inv':  result = 1 / val; break;
        case 'ln':   result = Math.log(val); break;
        case 'y_to_x': 
            currentInput += " ^ "; 
            expressionDisplay.innerText = currentInput; 
            return;
    }
    currentInput = result.toString();
    livePreview.innerText = currentInput;
}

function evaluateExpression(expr) {
    let cleanExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
    try {
        if (/^[0-9.+\-*/%()\s]*$/.test(cleanExpr.replace(/[^0-9.+\-*/%()\s]/g, ''))) {
            return Function(`"use strict"; return (${cleanExpr})`)();
        }
        return "Error";
    } catch (err) {
        return "Error";
    }
}

function calculateResult() {
    if (currentInput === "") return;
    let result = evaluateExpression(currentInput);
    if (result === "Error" || isNaN(result)) {
        livePreview.innerText = "Error";
    } else {
        livePreview.innerText = Number(result.toFixed(6));
        currentInput = result.toString();
    }
    expressionDisplay.innerText = "";
}

function storeMemory() {
    memoryValue = parseFloat(livePreview.innerText) || 0;
    clearAll();
    updateIndicators("STORED");
}

function recallMemory() {
    currentInput += memoryValue.toString();
    livePreview.innerText = currentInput;
}

function setTVM(key) {
    let val = parseFloat(livePreview.innerText) || 0;
    tvmState[key] = val;
    expressionDisplay.innerText = `${key} set to:`;
    livePreview.innerText = val;
    currentInput = "";
}

function setCashFlow() {
    let val = parseFloat(livePreview.innerText) || 0;
    cashFlows.push(val);
    expressionDisplay.innerText = `CF Entries: ${cashFlows.length}`;
    currentInput = "";
}

function calculateNPV() {
    expressionDisplay.innerText = "NPV Result";
    livePreview.innerText = "0.00"; 
}

function calculateIRR() {
    expressionDisplay.innerText = "IRR Result";
    livePreview.innerText = "0.00%";
}
