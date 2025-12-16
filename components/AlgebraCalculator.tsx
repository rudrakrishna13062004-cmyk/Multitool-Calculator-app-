import React, { useState } from 'react';
import { Sigma, FunctionSquare, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import * as math from 'mathjs';

enum AlgebraMode {
  SIMPLIFY = 'SIMPLIFY',
  QUADRATIC = 'QUADRATIC',
  LINEAR = 'LINEAR'
}

const AlgebraCalculator: React.FC = () => {
  const [mode, setMode] = useState<AlgebraMode>(AlgebraMode.SIMPLIFY);
  
  // Simplify State
  const [expression, setExpression] = useState('');
  const [simplifiedResult, setSimplifiedResult] = useState('');
  const [error, setError] = useState('');

  // Quadratic State
  const [quadA, setQuadA] = useState('');
  const [quadB, setQuadB] = useState('');
  const [quadC, setQuadC] = useState('');
  const [quadResult, setQuadResult] = useState<{ x1: string, x2: string } | null>(null);

  const handleSimplify = () => {
    try {
      setError('');
      if (!expression.trim()) return;
      const result = math.simplify(expression).toString();
      setSimplifiedResult(result);
    } catch (err) {
      setError('Invalid expression. Check syntax.');
      setSimplifiedResult('');
    }
  };

  const handleQuadratic = () => {
    try {
        setError('');
        const a = parseFloat(quadA);
        const b = parseFloat(quadB);
        const c = parseFloat(quadC);

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            setError('Please enter valid numbers');
            return;
        }
        if (a === 0) {
            setError("'a' cannot be zero for a quadratic equation");
            return;
        }

        const discriminant = b * b - 4 * a * c;
        if (discriminant > 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            setQuadResult({ x1: x1.toFixed(4), x2: x2.toFixed(4) });
        } else if (discriminant === 0) {
            const x = -b / (2 * a);
            setQuadResult({ x1: x.toFixed(4), x2: x.toFixed(4) });
        } else {
            // Complex numbers
            const realPart = (-b / (2 * a)).toFixed(4);
            const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
            setQuadResult({ 
                x1: `${realPart} + ${imagPart}i`, 
                x2: `${realPart} - ${imagPart}i` 
            });
        }
    } catch (err) {
        setError('Calculation error');
    }
  };

  const TabButton = ({ targetMode, label }: { targetMode: AlgebraMode, label: string }) => (
    <button
        onClick={() => {
            setMode(targetMode);
            setError('');
            setSimplifiedResult('');
            setQuadResult(null);
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === targetMode 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
    >
        {label}
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-2">
                <TabButton targetMode={AlgebraMode.SIMPLIFY} label="Expression Simplifier" />
                <TabButton targetMode={AlgebraMode.QUADRATIC} label="Quadratic Solver" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[400px]">
                {/* Simplify UI */}
                {mode === AlgebraMode.SIMPLIFY && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Simplify Expression</h2>
                            <p className="text-slate-500">Enter a mathematical expression to simplify it.</p>
                        </div>

                        <div className="relative">
                            <input 
                                type="text"
                                value={expression}
                                onChange={(e) => setExpression(e.target.value)}
                                placeholder="e.g. 2x + 3x + 5"
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-mono text-slate-800"
                                onKeyDown={(e) => e.key === 'Enter' && handleSimplify()}
                            />
                            <button 
                                onClick={handleSimplify}
                                className="absolute right-3 top-3 bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-800">
                            <strong>Supported:</strong> Basic arithmetic (+ - * /), variables (x, y), powers (^), parentheses ().
                        </div>
                    </div>
                )}

                {/* Quadratic UI */}
                {mode === AlgebraMode.QUADRATIC && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Quadratic Equation</h2>
                            <p className="text-slate-500">Solves for x in standard form: <strong>ax² + bx + c = 0</strong></p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">a (x² coeff)</label>
                                <input 
                                    type="number"
                                    value={quadA}
                                    onChange={(e) => setQuadA(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleQuadratic()}
                                    placeholder="1"
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">b (x coeff)</label>
                                <input 
                                    type="number"
                                    value={quadB}
                                    onChange={(e) => setQuadB(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleQuadratic()}
                                    placeholder="5"
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">c (constant)</label>
                                <input 
                                    type="number"
                                    value={quadC}
                                    onChange={(e) => setQuadC(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleQuadratic()}
                                    placeholder="6"
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleQuadratic}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            Solve Equation
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}
            </div>
        </div>

        {/* Right Panel: Output */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sigma size={200} />
            </div>
            
            <h3 className="text-slate-400 uppercase tracking-wider text-sm font-semibold mb-6">Result</h3>
            
            <div className="flex-1 flex flex-col justify-center">
                {mode === AlgebraMode.SIMPLIFY && (
                    simplifiedResult ? (
                        <div className="space-y-4 animate-in zoom-in-95 duration-300">
                             <div className="text-slate-400 text-sm font-mono">Input: {expression}</div>
                             <div className="text-4xl font-mono font-bold text-green-400 break-all">{simplifiedResult}</div>
                        </div>
                    ) : (
                        <div className="text-slate-600 text-center italic">Result will appear here...</div>
                    )
                )}

                {mode === AlgebraMode.QUADRATIC && (
                    quadResult ? (
                         <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            <div>
                                <div className="text-slate-400 text-xs uppercase mb-1">Root 1</div>
                                <div className="text-3xl font-mono font-bold text-green-400">x₁ = {quadResult.x1}</div>
                            </div>
                            <div className="w-full h-px bg-slate-800" />
                            <div>
                                <div className="text-slate-400 text-xs uppercase mb-1">Root 2</div>
                                <div className="text-3xl font-mono font-bold text-green-400">x₂ = {quadResult.x2}</div>
                            </div>
                         </div>
                    ) : (
                        <div className="text-slate-600 text-center italic">Roots will appear here...</div>
                    )
                )}
            </div>
        </div>
    </div>
  );
};

export default AlgebraCalculator;