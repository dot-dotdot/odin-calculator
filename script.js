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
    resultDisplay.value = "0";
});

eraseButton.addEventListener("click", () => {
    if (currentTerm !== "") {
        currentTerm = currentTerm.slice(0, -1);
        resultDisplay.value = currentTerm;

        if (currentTerm === "") {
            resultDisplay.value = "0";
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
        exprDisplay.value = "";
    }

    currentTerm += button.textContent;
    resultDisplay.value = currentTerm;
}

function setOperator(button) {
    const operator = button.textContent;

    if (currentTerm ==="" && previousTerm === "") {
        previousTerm = "0";
        currentOperator = operator;
        exprDisplay.value = `${previousTerm} ${currentOperator}`;
    } else if (currentTerm === "" && previousTerm !== "") {
        currentOperator = operator;
        exprDisplay.value = previousTerm + " " + currentOperator; 
    } else if (currentTerm !== "" && previousTerm === "") {
        previousTerm = currentTerm;
        currentTerm = "";
        currentOperator = operator;
        exprDisplay.value = previousTerm + " " + currentOperator;
    } else if (currentTerm !== "" && previousTerm !== "") {
        previousTerm = String(calculate(+previousTerm, +currentTerm, currentOperator));
        currentTerm = "";
        currentOperator = operator;
        exprDisplay.value = previousTerm + " " + currentOperator; 
        resultDisplay.value = previousTerm;
    }
}

function handleEquals() {
    if (currentTerm !== "" && previousTerm !== "" && currentOperator) {
        lastOperator = currentOperator;
        lastTerm = currentTerm;
        const result = calculate(+previousTerm, +currentTerm, currentOperator);
        exprDisplay.value = `${previousTerm} ${currentOperator} ${currentTerm} =`;
        resultDisplay.value = result;
        previousTerm = String(result);
        currentTerm = "";
        currentOperator = null;
        finishedEvaluation = true;
    } else if (finishedEvaluation && lastOperator && lastTerm) {
        const result = calculate(+previousTerm, +lastTerm, lastOperator);
        exprDisplay.value = `${previousTerm} ${lastOperator} ${lastTerm} =`;
        resultDisplay.value = result;
        previousTerm = String(result);
    }
}

function addDecimal() {
    if (finishedEvaluation) {
        currentTerm = "0.";
        previousTerm = "";
        currentOperator = null;
        finishedEvaluation = false;
        resultDisplay.value = currentTerm;
        return;
    }

    if (!currentTerm.includes(".")) {
        currentTerm = currentTerm === "" ? "0." : currentTerm + ".";
        resultDisplay.value = currentTerm;
    }
}

function negate() {
    if (currentTerm) {
        currentTerm = String(parseFloat(currentTerm) * -1);
        resultDisplay.value = currentTerm;
    } else if (previousTerm && !currentTerm) {
        previousTerm = String(parseFloat(previousTerm) * -1);
        exprDisplay.value = previousTerm;
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
