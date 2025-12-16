import React, { useState, useEffect, useRef } from 'react';
import { Delete, History, RotateCcw } from 'lucide-react';
import * as math from 'mathjs';

interface ScientificButtonProps {
  label: string;
  func: string;
  className?: string;
  onClick: (func: string) => void;
}

const ScientificButton: React.FC<ScientificButtonProps> = ({ label, func, className = '', onClick }) => (
  <button
    onClick={() => onClick(func)}
    className={`h-12 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-transform ${className}`}
  >
    {label}
  </button>
);

const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [isNewCalculation, setIsNewCalculation] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  
  // Ref for the display to auto-scroll if needed, though simple text usually fits
  const displayRef = useRef<HTMLDivElement>(null);

  const handleInput = (val: string) => {
    if (display === 'Error') {
      setDisplay(val);
      setIsNewCalculation(false);
      return;
    }

    if (isNewCalculation) {
      setDisplay(val);
      setIsNewCalculation(false);
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setIsNewCalculation(false);
    // Prevent double operators
    const lastChar = display.slice(-1);
    if (['+', '-', '*', '/', '^', '%', '.'].includes(lastChar)) {
       setDisplay(display.slice(0, -1) + op);
    } else {
       setDisplay(display + op);
    }
  };

  const handleScientificInput = (func: string) => {
    setIsNewCalculation(false);
    if (display === '0' && func !== '.') {
        setDisplay(func);
    } else if (display === 'Error') {
        setDisplay(func);
    } else {
        setDisplay(display + func);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setIsNewCalculation(true);
  };

  const handleDelete = () => {
    if (display === 'Error') {
      handleClear();
      return;
    }
    if (display.length === 1) {
      setDisplay('0');
      setIsNewCalculation(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      // Replace graphical symbols with mathjs compatible ones if needed
      // e.g., '×' to '*', '÷' to '/' if used in UI
      // Here we use standard symbols for simplicity in logic, maybe UI mapping in button
      
      let expression = display;
      
      // Auto-close parentheses
      const openParens = (expression.match(/\(/g) || []).length;
      const closeParens = (expression.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        expression += ')'.repeat(openParens - closeParens);
      }

      const result = math.evaluate(expression);
      
      // Format result to avoid crazy long decimals
      const formattedResult = math.format(result, { precision: 10 });
      
      // Add to history
      const newHistoryItem = `${expression} = ${formattedResult}`;
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10
      
      setDisplay(String(formattedResult));
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewCalculation(true);
    }
  };

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default interaction if a button is explicitly focused (e.g. History items)
      if (document.activeElement instanceof HTMLButtonElement && e.key === 'Enter') {
          return;
      }

      const key = e.key;

      if (/[0-9]/.test(key) && key.length === 1) {
        handleInput(key);
      } else if (key === '.') {
        handleInput(key);
      } else if (['+', '-', '*', '/', '%', '^'].includes(key)) {
        e.preventDefault();
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === '(' || key === ')') {
        handleScientificInput(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, isNewCalculation, history]); // Dependencies ensure closure captures latest state

  const scientificFunctions = [
    { label: 'sin', func: 'sin(' },
    { label: 'cos', func: 'cos(' },
    { label: 'tan', func: 'tan(' },
    { label: 'log', func: 'log10(' },
    { label: 'ln', func: 'log(' },
    { label: '√', func: 'sqrt(' },
    { label: '(', func: '(' },
    { label: ')', func: ')' },
    { label: '^', func: '^' },
    { label: 'π', func: 'pi' },
    { label: 'e', func: 'e' },
    { label: '!', func: '!' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Display */}
        <div className="bg-slate-900 p-6 sm:p-8 flex flex-col justify-end items-end min-h-[160px] relative">
            <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`absolute top-4 left-4 p-2 rounded-full transition-colors ${showHistory ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                title="History"
            >
                <History size={20} />
            </button>
            <div className="text-slate-400 text-sm mb-2 h-6 font-mono tracking-wider overflow-hidden w-full text-right whitespace-nowrap opacity-70">
                {history.length > 0 && !isNewCalculation ? 'Ans = ' + history[0].split('=')[1].trim() : ''}
            </div>
            <div 
                ref={displayRef}
                className="text-4xl sm:text-6xl font-light text-white tracking-tight break-all text-right w-full font-mono"
            >
                {display}
            </div>
        </div>

        {/* Keypad */}
        <div className="flex-1 p-4 bg-white flex flex-col gap-4">
            {/* Scientific Rows */}
            <div className="grid grid-cols-6 gap-2">
                {scientificFunctions.map((btn) => (
                    <ScientificButton 
                        key={btn.label} 
                        label={btn.label} 
                        func={btn.func} 
                        onClick={handleScientificInput}
                    />
                ))}
            </div>

            <hr className="border-slate-100" />

            {/* Standard Grid */}
            <div className="grid grid-cols-4 gap-3 flex-1">
                <button onClick={handleClear} className="col-span-1 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">AC</button>
                <button onClick={handleDelete} className="col-span-1 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center">
                    <Delete size={20} />
                </button>
                <button onClick={() => handleOperator('%')} className="bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">%</button>
                <button onClick={() => handleOperator('/')} className="bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors text-xl">÷</button>

                {[7, 8, 9].map(num => (
                    <button key={num} onClick={() => handleInput(num.toString())} className="bg-slate-50 text-slate-900 font-semibold text-xl rounded-xl hover:bg-slate-100 transition-colors py-4">{num}</button>
                ))}
                <button onClick={() => handleOperator('*')} className="bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors text-xl">×</button>

                {[4, 5, 6].map(num => (
                    <button key={num} onClick={() => handleInput(num.toString())} className="bg-slate-50 text-slate-900 font-semibold text-xl rounded-xl hover:bg-slate-100 transition-colors py-4">{num}</button>
                ))}
                <button onClick={() => handleOperator('-')} className="bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors text-xl">-</button>

                {[1, 2, 3].map(num => (
                    <button key={num} onClick={() => handleInput(num.toString())} className="bg-slate-50 text-slate-900 font-semibold text-xl rounded-xl hover:bg-slate-100 transition-colors py-4">{num}</button>
                ))}
                <button onClick={() => handleOperator('+')} className="bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors text-xl">+</button>

                <button onClick={() => handleInput('0')} className="col-span-2 bg-slate-50 text-slate-900 font-semibold text-xl rounded-xl hover:bg-slate-100 transition-colors">0</button>
                <button onClick={() => handleInput('.')} className="bg-slate-50 text-slate-900 font-semibold text-xl rounded-xl hover:bg-slate-100 transition-colors">.</button>
                <button onClick={calculate} className="bg-indigo-600 text-white font-bold text-xl rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-transform active:scale-95">=</button>
            </div>
        </div>
      </div>

      {/* History Sidebar (Desktop only or conditional) */}
      {showHistory && (
          <div className="w-full md:w-80 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      <History size={18} /> Calculation History
                  </h3>
                  <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50">
                      Clear All
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {history.length === 0 ? (
                      <div className="text-center text-slate-400 py-10 text-sm">No history yet</div>
                  ) : (
                      history.map((item, idx) => {
                          const [expr, res] = item.split('=');
                          return (
                              <button 
                                key={idx} 
                                onClick={() => {
                                    setDisplay(res.trim());
                                    setIsNewCalculation(true);
                                }}
                                className="w-full text-right group p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                              >
                                  <div className="text-xs text-slate-500 mb-1 group-hover:text-indigo-500 font-mono">{expr} =</div>
                                  <div className="text-lg font-semibold text-slate-800 font-mono">{res}</div>
                              </button>
                          );
                      })
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default ScientificCalculator;