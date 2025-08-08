"use strict";

let firstOperand = 0;
let secondOperand = 0;
let result = 0;
let operandString = "";
let operatorString = "";
let waitingForNextOperand = false;

const exprDisplay = document.querySelector(".expr-display");
const resultDisplay = document.querySelector(".result-display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");

exprDisplay.value = "";
resultDisplay.value = "";

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        operandString += button.textContent;
        resultDisplay.value = operandString;
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (!waitingForNextOperand) {
            waitingForNextOperand = true;
            firstOperand = +operandString;
        } else {
            secondOperand = +operandString;
            result = calculate(firstOperand, secondOperand);
            resultDisplay.value = result;
            firstOperand = result;
        }

        operatorString = button.textContent;
        operandString = "";
    });
});

equalsButton.addEventListener("click", () => {
    waitingForNextOperand = false;
    secondOperand = +operandString;
    result = calculate(firstOperand, secondOperand);
    resultDisplay.value = result;
})

clearButton.addEventListener("click", () => reset());

function calculate(a, b) {
    if (operatorString === "+") return add(a, b);        
    if (operatorString === "-") return substract(a, b);
    if (operatorString === "*") return multiply(a, b);
    if (operatorString === "/") return divide(a, b);
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

function clear() {
    firstOperand = 0;
    secondOperand = 0;
    operandString = "";
    operatorString = "";
}

function reset() {
    clear();
    exprDisplay.value = "";
    resultDisplay.value = "";
    waitingForNextOperand = false;
}