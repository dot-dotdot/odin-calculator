"use strict";

const MAX_DIGITS = 14;
let currentTerm = "";
let previousTerm = "";
let currentOperator = null;
let finishedEvaluation = false;
let lockedIfError = false;
let lastOperator = null;
let lastTerm = null;

const exprDisplay = document.querySelector(".expr-display");
const resultDisplay = document.querySelector(".result-display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector("#equals");
const decimalButton = document.querySelector("#decimal");
const negationButton = document.querySelector("#negation");
const clearButton = document.querySelector("#clear");
const ceButton = document.querySelector("#clear-entry");
const eraseButton = document.querySelector("#erase");

const keyMap = {
    "Backspace": eraseButton,
    "Delete": ceButton,
    "Enter": equalsButton,
    "*": document.querySelector("#mult"),
    "/": document.querySelector("#divide"),
    "n": negationButton,
};

exprDisplay.value = "";
resultDisplay.value = "0";

numberButtons.forEach(button => {
    button.addEventListener("click", () => handleNumber(button));
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        setOperator(button);
        finishedEvaluation = false;
    });
});

equalsButton.addEventListener("click", handleEquals); 
decimalButton.addEventListener("click", addDecimal);
negationButton.addEventListener("click", negate);
clearButton.addEventListener("click", reset);

ceButton.addEventListener("click", () => {
    if (!finishedEvaluation) {
        currentTerm = "";
        setDisplay(resultDisplay, "0");
    }
});

eraseButton.addEventListener("click", () => {
    if (currentTerm !== "") {
        currentTerm = currentTerm.slice(0, -1);
        setDisplay(resultDisplay, currentTerm);

        if (currentTerm === "") {
            setDisplay(resultDisplay, "0");
        }
    }
});

document.addEventListener("keydown", (event) => {
    let key = event.key;
    const button = keyMap[key] 
        ? keyMap[key]
        : document.querySelector(`button[data-key="${key}"]`);

    if (button) {
        button.click();
        event.preventDefault();
    }
});

function calculate(a, b, operator) {
    if (operator === "+") return add(a, b);        
    if (operator === "-") return substract(a, b);
    if (operator === "×") return multiply(a, b);
    if (operator === "÷") return divide(a, b);
}

function operate(term1, term2, operator) {
    let result = calculate(+term1, +term2, operator);

    if (result === "Error") {
        setDisplay(resultDisplay, "Error: press C");
        setDisplay(exprDisplay, "");
        lockedIfError = true;
        return null;
    }

    return result;
}

function handleNumber(button) {
    if (lockedIfError) return;

    if (currentTerm.replace(".", "").length >= MAX_DIGITS) return;

    if (finishedEvaluation) {
        currentTerm = "";
        previousTerm = "";
        currentOperator = null;
        finishedEvaluation = false;
        setDisplay(exprDisplay, currentTerm);
    }

    currentTerm += button.textContent;
    setDisplay(resultDisplay, currentTerm);
}

function setOperator(button) {
    if (lockedIfError) return;

    const operator = button.textContent;

    if (currentTerm ==="" && previousTerm === "") {
        previousTerm = "0";
    } else if (currentTerm !== "" && previousTerm === "") {
        previousTerm = format(currentTerm);
    } else if (currentTerm !== "" && previousTerm !== "") {
        const result = format(operate(+previousTerm, +currentTerm, currentOperator));
        if (result === null) return;
        previousTerm = result;
    }
    
    currentTerm = "";
    currentOperator = operator;
    setDisplay(exprDisplay, previousTerm, currentOperator); 
    setDisplay(resultDisplay, "0");
}

function handleEquals() {
    if (currentTerm !== "" && previousTerm !== "" && currentOperator) {
        lastOperator = currentOperator;
        lastTerm = currentTerm;
        
        const result = format(operate(+previousTerm, +currentTerm, currentOperator));
        if (result === null) return;

        setDisplay(exprDisplay, previousTerm, currentOperator, currentTerm);
        setDisplay(resultDisplay, result);
        previousTerm = result;

        currentTerm = ""; 
        currentOperator = null;
        finishedEvaluation = true;
    } else if (finishedEvaluation && lastOperator && lastTerm) {
        const result = format(calculate(+previousTerm, +lastTerm, lastOperator));
        setDisplay(exprDisplay, previousTerm, lastOperator, lastTerm);
        setDisplay(resultDisplay, result);
        previousTerm = result;
    }
}

function addDecimal() {
    if (finishedEvaluation) {
        currentTerm = "0.";
        previousTerm = "";
        currentOperator = null;
        finishedEvaluation = false;
        setDisplay(resultDisplay, currentTerm);
        return;
    }

    if (!currentTerm.includes(".")) {
        currentTerm = currentTerm === "" ? "0." : currentTerm + ".";
        setDisplay(resultDisplay, currentTerm);
    }
}

// With this function you cannot flip the sign and then enter a number.
function negate() {
    if (currentTerm === "0") return;

    if (currentTerm) {
        if (currentTerm === "0.") {
            currentTerm = "-0.";
            setDisplay(resultDisplay, currentTerm);
            return;
        } else if (currentTerm === "-0.") {
            currentTerm = "0.";
            setDisplay(resultDisplay, currentTerm);
            return;
        }

        currentTerm = String(parseFloat(currentTerm) * -1);
        setDisplay(resultDisplay, currentTerm);
    } else if (previousTerm) {
        previousTerm = String(parseFloat(previousTerm) * -1);

        if (currentOperator) {
            setDisplay(exprDisplay, previousTerm, currentOperator);
        } else if (!currentOperator) {
            setDisplay(exprDisplay, previousTerm);
            setDisplay(resultDisplay, previousTerm);
        }
    } 
}

function setDisplay(display, term1, operator, term2) {
    if (typeof term2 === "undefined" && typeof operator === "undefined") {
        display.value = `${term1}`;
    } else if (typeof term2 === "undefined") {
        exprDisplay.value = `${term1} ${operator}`;
    } else {
        exprDisplay.value = `${term1} ${operator} ${term2} =`;
    } 
}

function format(number) {
    const maxLength = 10;

    let numString = number.toString();

    if (numString.length > maxLength) {
        if (Math.abs(number) > 1e-6 && Math.abs(number) < 1e12) {
            numString = parseFloat(number.toFixed(maxLength - 2)).toString();
        } else {
            numString = number.toExponential(maxLength - 6);
        }
    }

    return numString;
}

function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) return "Error";
    return a / b;
}

function reset() {
    currentTerm = "";
    previousTerm = "";
    lastTerm = null;
    lastOperator = null;
    currentOperator = null;
    exprDisplay.value = "";
    resultDisplay.value = "0";
    finishedEvaluation = false;
    lockedIfError = false;
}
