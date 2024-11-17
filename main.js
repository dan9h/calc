const firstOperand = { value: '' };
const secondOperand = { value: '' };
let operator = null;
let result = null;
let targetOperand = firstOperand;

function evaluate(_firstOperand, _operator, _secondOperand) {
  let _result;
  switch (_operator) {
    case '+':
      _result = add(_firstOperand, _secondOperand);
      break;
    case '-':
      _result = subtract(_firstOperand, _secondOperand);
      break;
    case '*':
      _result = multiply(_firstOperand, _secondOperand);
      break;
    case '/':
    case '÷':
      _result = divide(_firstOperand, _secondOperand);
      break;
  }
  return _result;
}

function operate() {
  if (isOperatorNull()) return;

  const _result = evaluate(
    Number(firstOperand.value),
    operator,
    Number(secondOperand.value || firstOperand.value)
  );

  resetDisplay();
  setResult(_result);
  setTargetOperandValue(_result);
}

document.querySelectorAll('.button').forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

function handleButtonClick(event) {
  const button = event.target;
  const { type, value } = button.dataset;

  switch (type) {
    case 'digit':
      handleDigitClick(value);
      break;
    case 'operator':
      handleOperatorClick(value);
      break;
    case 'action':
      handleActionClick(value);
      break;
  }

  updateDisplay();
  logState();
}

function handleActionClick(action) {
  switch (action) {
    case 'cls':
      resetDisplay();
      break;
    case 'ce':
      clearTargetOperandValue();
      break;
    case 'del':
      deleteLastEntry();
      break;
    case 'negate':
      negateTargetOperandValue();
      break;
    case 'eq':
      operate();
      break;
  }
}

function handleDigitClick(digit) {
  if (result) {
    clearResult();
    clearTargetOperandValue();
  }

  const currentValue = targetOperand.value;
  let newValue = currentValue + digit;

  // prevent leading zeroes "000 or 012"
  if (currentValue === '0') {
    if (digit === '0') return;
    if (digit !== '.') {
      newValue = digit;
    }
  }

  if (digit === '.') {
    // only allow one decimal point per operand
    if (currentValue.includes('.')) return;

    // prepend a '0' if the target operand is empty
    if (currentValue === '') {
      newValue = '0' + newValue;
    }
  }

  setTargetOperandValue(newValue);
}

function handleOperatorClick(_operator) {
  if (isResultError()) return;

  if (!isOperandEmpty(secondOperand)) {
    operate();
  }

  if (targetOperand === firstOperand && isTargetOperandEmpty()) {
    setTargetOperandValue('0');
  }

  setOperator(_operator);
  setTargetOperand(secondOperand);
}

function resetDisplay() {
  clearOperand(firstOperand);
  clearOperand(secondOperand);
  clearOperator();
  clearResult();
  setTargetOperand(firstOperand);
}

function updateDisplay() {
  const display = document.getElementById('display');
  let html = '';

  if (!isOperandEmpty(firstOperand)) {
    html += `<span>${firstOperand.value}</span>`;
  }

  if (!isOperatorNull()) {
    html += `<span class="operator">${operator}</span>`;
  }

  if (!isOperandEmpty(secondOperand)) {
    html += `<span>${secondOperand.value}</span>`;
  }

  display.innerHTML = html === '' ? '0' : html;
}

function clearOperand(operand) {
  operand.value = '';
}

function setOperator(_operator) {
  operator = _operator;
}

function clearOperator() {
  operator = null;
}

function setResult(newResult) {
  result = String(newResult);
}

function clearResult() {
  result = null;
}

function setTargetOperand(operand) {
  targetOperand = operand;
}

function setTargetOperandValue(newValue) {
  targetOperand.value = String(newValue);
}

function clearTargetOperandValue() {
  targetOperand.value = '';
}

function deleteLastEntry() {
  if (isResultError()) {
    resetDisplay();
  }

  if (!isTargetOperandEmpty()) {
    const currentValue = targetOperand.value;
    const newValue = currentValue.slice(0, currentValue.length - 1);
    setTargetOperandValue(newValue);
  } else {
    if (!isOperatorNull()) {
      clearOperator();
      setTargetOperand(firstOperand);
    }
  }
}

function negateTargetOperandValue() {
  setTargetOperandValue(-Number(targetOperand.value));
}

function isOperandEmpty(operand) {
  return operand.value === '';
}

function isTargetOperandEmpty() {
  return isOperandEmpty(targetOperand);
}

function isOperatorNull() {
  return operator === null;
}

function isResultError() {
  return result === 'error';
}

function add(addendA, addendB) {
  return addendA + addendB;
}

function subtract(minuend, subtrahend) {
  return minuend - subtrahend;
}

function multiply(multiplicand, multiplier) {
  return multiplicand * multiplier;
}

function divide(dividend, divisor) {
  if (divisor === 0) return 'error';
  return dividend / divisor;
}

function logState() {
  const state = {
    firstOperand: firstOperand.value,
    operator,
    secondOperand: secondOperand.value,
    result,
  };

  console.table(state);
}
