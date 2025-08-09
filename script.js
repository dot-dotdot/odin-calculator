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
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const decimalButton = document.querySelector("#decimal");
const negationButton = document.querySelector("#negation");

exprDisplay.value = "";
resultDisplay.value = "0";

numberButtons.forEach(button => {
    button.addEventListener("click", () => handleNumber(button));
});
operatorButtons.forEach(button => {
    button.addEventListener("click", () => setOperator(button));
});
equalsButton.addEventListener("click", handleEquals); 
clearButton.addEventListener("click", reset);
decimalButton.addEventListener("click", addDecimal);
negationButton.addEventListener("click", negate);

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

    if (currentTerm === "" && previousTerm === "") return;

    if (finishedEvaluation) {
        currentOperator = operator;
        exprDisplay.value = previousTerm + " " + currentOperator;
        finishedEvaluation = false;
        return;
    }

    if (currentTerm === "" && previousTerm !== "") {
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
