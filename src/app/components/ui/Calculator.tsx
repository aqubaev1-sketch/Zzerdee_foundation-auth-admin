'use client';

import { useState, useEffect, useCallback } from 'react';

interface CalculatorProps {
  className?: string;
}

export default function Calculator({ className = '' }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === '0' ? digit : display + digit);
      }
    },
    [display, waitingForOperand]
  );

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const deleteLastDigit = useCallback(() => {
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback(
    (nextOperation: string) => {
      const inputValue = parseFloat(display);

      if (prevValue === null) {
        setPrevValue(inputValue);
      } else if (operation) {
        const currentValue = prevValue || 0;
        let newValue = currentValue;

        switch (operation) {
          case '+':
            newValue = currentValue + inputValue;
            break;
          case '−':
            newValue = currentValue - inputValue;
            break;
          case '×':
            newValue = currentValue * inputValue;
            break;
          case '÷':
            newValue = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
        }

        setPrevValue(newValue);
        setDisplay(String(newValue));
      }

      setWaitingForOperand(true);
      setOperation(nextOperation);
    },
    [display, operation, prevValue]
  );

  const handleEquals = useCallback(() => {
    if (!operation || prevValue === null) return;
    performOperation(operation);
    setOperation(null);
    setPrevValue(null);
  }, [operation, performOperation, prevValue]);

  // --- ОБРАБОТЧИК КЛАВИАТУРЫ ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Игнорируем нажатия, если пользователь печатает в каком-то input или textarea на странице
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        inputDigit(key);
      } else if (key === '.' || key === ',') {
        event.preventDefault();
        inputDot();
      } else if (key === '+') {
        event.preventDefault();
        performOperation('+');
      } else if (key === '-') {
        event.preventDefault();
        performOperation('−');
      } else if (key === '*') {
        event.preventDefault();
        performOperation('×');
      } else if (key === '/') {
        event.preventDefault();
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLastDigit();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        event.preventDefault();
        clear();
      } else if (key === '%') {
        event.preventDefault();
        inputPercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    inputDigit,
    inputDot,
    performOperation,
    handleEquals,
    deleteLastDigit,
    clear,
    inputPercent,
  ]);

  return (
    <div className={`w-full bg-white select-none ${className}`}>
      {/* Дисплей */}
      <div className="bg-gray-50 rounded-xl p-3 mb-3 text-right border border-gray-100 overflow-hidden">
        <div className="text-xs text-gray-400 h-4 font-mono">
          {prevValue !== null ? `${prevValue} ${operation || ''}` : ''}
        </div>
        <div className="text-2xl font-semibold text-gray-800 truncate font-mono">
          {display}
        </div>
      </div>

      {/* Сетка кнопок */}
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={clear}
          className="w-full aspect-square rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold flex items-center justify-center transition-colors active:scale-95"
        >
          AC
        </button>
        <button
          type="button"
          onClick={toggleSign}
          className="w-full aspect-square rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold flex items-center justify-center transition-colors active:scale-95"
        >
          ±
        </button>
        <button
          type="button"
          onClick={inputPercent}
          className="w-full aspect-square rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold flex items-center justify-center transition-colors active:scale-95"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => performOperation('÷')}
          className={`w-full aspect-square rounded-full text-white text-sm font-semibold flex items-center justify-center transition-colors active:scale-95 ${
            operation === '÷' ? 'bg-amber-600' : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          ÷
        </button>

        <button
          type="button"
          onClick={() => inputDigit('7')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => inputDigit('8')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => inputDigit('9')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => performOperation('×')}
          className={`w-full aspect-square rounded-full text-white text-sm font-semibold flex items-center justify-center transition-colors active:scale-95 ${
            operation === '×' ? 'bg-amber-600' : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          ×
        </button>

        <button
          type="button"
          onClick={() => inputDigit('4')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => inputDigit('5')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => inputDigit('6')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => performOperation('−')}
          className={`w-full aspect-square rounded-full text-white text-sm font-semibold flex items-center justify-center transition-colors active:scale-95 ${
            operation === '−' ? 'bg-amber-600' : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          −
        </button>

        <button
          type="button"
          onClick={() => inputDigit('1')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => inputDigit('2')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => inputDigit('3')}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => performOperation('+')}
          className={`w-full aspect-square rounded-full text-white text-sm font-semibold flex items-center justify-center transition-colors active:scale-95 ${
            operation === '+' ? 'bg-amber-600' : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          +
        </button>

        <button
          type="button"
          onClick={() => inputDigit('0')}
          className="col-span-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-start pl-5 transition-colors active:scale-95"
        >
          0
        </button>
        <button
          type="button"
          onClick={inputDot}
          className="w-full aspect-square rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center transition-colors active:scale-95"
        >
          .
        </button>
        <button
          type="button"
          onClick={handleEquals}
          className="w-full aspect-square rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold flex items-center justify-center transition-colors active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  );
}