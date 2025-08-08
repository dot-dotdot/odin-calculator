"use strict";

let currentTerm = "";
let previousTerm = "";
let result = "";
let currentOperator = null;
let previousOperator = null;

const exprDisplay = document.querySelector(".expr-display");
const resultDisplay = document.querySelector(".result-display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");

exprDisplay.value = "";
resultDisplay.value = "0";

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentTerm += button.textContent;
        resultDisplay.value = currentTerm;
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentTerm === "" && previousTerm === "") return;

        previousOperator = currentOperator;
        currentOperator = button.textContent;
        
        if (currentTerm !== "" && previousTerm === "") {
            previousTerm = currentTerm;
            exprDisplay.value = previousTerm + " " + currentOperator;
        } else if (currentTerm !== "" && previousTerm !== "") {
            previousTerm = "" + calculate(+previousTerm, +currentTerm, previousOperator);
            exprDisplay.value = previousTerm + " " + currentOperator; 
            resultDisplay.value = previousTerm;
        }

        currentTerm = "";
    });
});

equalsButton.addEventListener("click", () => {
    if (currentTerm !== "" && previousTerm !== "" && currentOperator) {
        result = "" + calculate(+previousTerm, +currentTerm, currentOperator);
        exprDisplay.value = previousTerm + " " + currentOperator + " " + currentTerm + " =";
        resultDisplay.value = result;
        previousTerm = result;
        currentTerm = "";
    }
})

clearButton.addEventListener("click", () => reset());

function calculate(a, b, operator) {
    if (operator === "+") return add(a, b);        
    if (operator === "-") return substract(a, b);
    if (operator === "*") return multiply(a, b);
    if (operator === "/") return divide(a, b);
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
    currentOperator = null;
    previousOperator = null;
    exprDisplay.value = "";
    resultDisplay.value = "0";
}