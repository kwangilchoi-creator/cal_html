import React, { useState, useEffect, useCallback } from 'react';
import CalculatorButton from './CalculatorButton';

const Calculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);

  // Helper to format numbers for display (add commas, prevent overflow)
  const formatDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return "Error";
    
    // Check if it fits
    if (value.length > 9) {
      return num.toExponential(4);
    }

    // Split for decimal formatting
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const calculate = useCallback((a: string, b: string, op: string): string => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    let result = 0;
    switch (op) {
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      case '×': result = numA * numB; break;
      case '÷': 
        if (numB === 0) return 'Error';
        result = numA / numB; 
        break;
      default: return b;
    }

    // Handle floating point precision issues roughly
    return String(Math.round(result * 100000000) / 100000000);
  }, []);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplayValue(num);
      setWaitingForNewValue(false);
    } else {
      setDisplayValue(displayValue === '0' ? num : displayValue + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplayValue('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = displayValue;

    if (operator && waitingForNewValue) {
      setOperator(nextOperator);
      return;
    }

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplayValue(result);
      setPreviousValue(result);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const handleEqual = () => {
    if (!operator || previousValue === null) return;

    const result = calculate(previousValue, displayValue, operator);
    setDisplayValue(result);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleSign = () => {
    setDisplayValue(String(parseFloat(displayValue) * -1));
  };

  const handlePercent = () => {
    setDisplayValue(String(parseFloat(displayValue) / 100));
  };

  const onButtonClick = (label: string) => {
    if (displayValue === 'Error' && label !== 'AC') return;

    switch (label) {
      case 'AC': handleClear(); break;
      case '+/-': handleSign(); break;
      case '%': handlePercent(); break;
      case '÷':
      case '×':
      case '-':
      case '+': handleOperator(label); break;
      case '=': handleEqual(); break;
      case '.': handleDecimal(); break;
      default: handleNumber(label); break;
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (/\d/.test(key)) onButtonClick(key);
      if (key === '.') onButtonClick('.');
      if (key === 'Enter' || key === '=') onButtonClick('=');
      if (key === 'Escape') onButtonClick('AC');
      if (key === '+') onButtonClick('+');
      if (key === '-') onButtonClick('-');
      if (key === '*') onButtonClick('×');
      if (key === '/') onButtonClick('÷');
      if (key === 'Backspace') {
          if(displayValue.length > 1) {
              setDisplayValue(displayValue.slice(0, -1));
          } else {
              setDisplayValue('0');
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayValue, operator, previousValue, waitingForNewValue]);

  return (
    <div 
      className="bg-black rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-6 relative select-none ring-8 ring-gray-900"
      style={{ width: '400px', height: '600px' }}
    >
      {/* Display Area */}
      <div className="flex-1 flex items-end justify-end mb-4 px-2">
        <div 
            className="text-white font-light truncate tracking-tight transition-all"
            style={{ fontSize: displayValue.length > 7 ? '3.5rem' : '5rem', lineHeight: '1.1' }}
        >
          {formatDisplay(displayValue)}
        </div>
      </div>

      {/* Keypad Area */}
      <div className="grid grid-cols-4 gap-4">
        {/* Row 1 */}
        <CalculatorButton label="AC" onClick={onButtonClick} variant="function" />
        <CalculatorButton label="+/-" onClick={onButtonClick} variant="function" />
        <CalculatorButton label="%" onClick={onButtonClick} variant="function" />
        <CalculatorButton label="÷" onClick={onButtonClick} variant="operator" active={operator === '÷'} />

        {/* Row 2 */}
        <CalculatorButton label="7" onClick={onButtonClick} />
        <CalculatorButton label="8" onClick={onButtonClick} />
        <CalculatorButton label="9" onClick={onButtonClick} />
        <CalculatorButton label="×" onClick={onButtonClick} variant="operator" active={operator === '×'} />

        {/* Row 3 */}
        <CalculatorButton label="4" onClick={onButtonClick} />
        <CalculatorButton label="5" onClick={onButtonClick} />
        <CalculatorButton label="6" onClick={onButtonClick} />
        <CalculatorButton label="-" onClick={onButtonClick} variant="operator" active={operator === '-'} />

        {/* Row 4 */}
        <CalculatorButton label="1" onClick={onButtonClick} />
        <CalculatorButton label="2" onClick={onButtonClick} />
        <CalculatorButton label="3" onClick={onButtonClick} />
        <CalculatorButton label="+" onClick={onButtonClick} variant="operator" active={operator === '+'} />

        {/* Row 5 */}
        <CalculatorButton label="0" onClick={onButtonClick} variant="zero" />
        <CalculatorButton label="." onClick={onButtonClick} />
        <CalculatorButton label="=" onClick={onButtonClick} variant="operator" />
      </div>
      
      {/* Aesthetic decorative bar at bottom like iPhone X+ */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
    </div>
  );
};

export default Calculator;