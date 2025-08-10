"use strict";

let currentTerm = "";
let previousTerm = "";
let currentOperator = null;
let finishedEvaluation = false;
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
    currentTerm = "";
    setDisplay(resultDisplay, "0");
});

eraseButton.addEventListener("click", () => {
    if (currentTerm !== "") {
        currentTerm = currentTerm.slice(0, -1);
        setDisplay(resultDisplay, currentTerm);

        if (currentTerm === "") {
            setDisplay(resultDisplay, "0");
        }
    }
})

function calculate(a, b, operator) {
    if (operator === "+") return add(a, b);        
    if (operator === "-") return substract(a, b);
    if (operator === "*") return multiply(a, b);
    if (operator === "/") return divide(a, b);
}

function handleNumber(button) {
    if (finishedEvaluation) {
        currentTerm = "";
        previousTerm = "";
        currentOperator = null;
        finishedEvaluation = false;
        setDisplay(exprDisplay, "");
    }

    currentTerm += button.textContent;
    setDisplay(resultDisplay, currentTerm);
}

function setOperator(button) {
    const operator = button.textContent;

    if (currentTerm ==="" && previousTerm === "") {
        previousTerm = "0";
    } else if (currentTerm !== "" && previousTerm === "") {
        previousTerm = currentTerm;
        currentTerm = "";
    } else if (currentTerm !== "" && previousTerm !== "") {
        previousTerm = String(calculate(+previousTerm, +currentTerm, currentOperator));
        currentTerm = "";
        setDisplay(resultDisplay, previousTerm);
    }

    currentOperator = operator;
    setDisplay(exprDisplay ,previousTerm, currentOperator); 
}

function handleEquals() {
    if (currentTerm !== "" && previousTerm !== "" && currentOperator) {
        lastOperator = currentOperator;
        lastTerm = currentTerm;
        
        const result = calculate(+previousTerm, +currentTerm, currentOperator);
        setDisplay(exprDisplay, previousTerm, currentOperator, currentTerm);
        setDisplay(resultDisplay, result);
        previousTerm = String(result);

        currentTerm = "";
        currentOperator = null;
        finishedEvaluation = true;
    } else if (finishedEvaluation && lastOperator && lastTerm) {
        const result = calculate(+previousTerm, +lastTerm, lastOperator);
        setDisplay(exprDisplay, previousTerm, lastOperator, lastTerm);
        setDisplay(resultDisplay, result);
        previousTerm = String(result);
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

// This is the most basic negation function. Only works with user input form numpad.
function negate() {
    if (currentTerm) {
        currentTerm = String(parseFloat(currentTerm) * -1);
        setDisplay(resultDisplay, currentTerm);
    } 
}

function setDisplay(display, term1, operator, term2) {
    if (typeof term2 === "undefined" && typeof operator === "undefined") {
        display.value = term1;
    } else if (typeof term2 === "undefined") {
        exprDisplay.value = `${term1} ${operator}`;
    } else {
        exprDisplay.value = `${term1} ${operator} ${term2} =`;
    } 
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
    if (b !== 0) {
        return a / b;
    }
}

function reset() {
    currentTerm = "";
    previousTerm = "";
    lastTerm = null;
    lastOperator = null;
    currentOperator = null;
    exprDisplay.value = "";
    resultDisplay.value = "0";
}
