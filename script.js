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

exprDisplay.value = "";
resultDisplay.value = "0";

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (finishedEvaluation) {
            currentTerm = "";
            previousTerm = "";
            currentOperator = null;
            finishedEvaluation = false;
            exprDisplay.value = "";
        }

        currentTerm += button.textContent;
        resultDisplay.value = currentTerm;
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => setOperator(button));
});

equalsButton.addEventListener("click", () => {
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
});

clearButton.addEventListener("click", reset);
decimalButton.addEventListener("click", addDecimal);

function calculate(a, b, operator) {
    if (operator === "+") return add(a, b);        
    if (operator === "-") return substract(a, b);
    if (operator === "*") return multiply(a, b);
    if (operator === "/") return divide(a, b);
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
        previousTerm = "" + calculate(+previousTerm, +currentTerm, currentOperator);
        currentTerm = "";
        currentOperator = operator;
        exprDisplay.value = previousTerm + " " + currentOperator; 
        resultDisplay.value = previousTerm;
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
