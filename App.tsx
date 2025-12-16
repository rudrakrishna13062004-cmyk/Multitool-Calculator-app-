import React, { useState } from 'react';
import { Calculator, Calendar, Sigma, Menu, X } from 'lucide-react';
import ScientificCalculator from './components/ScientificCalculator';
import AgeCalculator from './components/AgeCalculator';
import AlgebraCalculator from './components/AlgebraCalculator';

enum AppMode {
  SCIENTIFIC = 'SCIENTIFIC',
  AGE = 'AGE',
  ALGEBRA = 'ALGEBRA',
}

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.SCIENTIFIC);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavButton = ({ targetMode, icon: Icon, label }: { targetMode: AppMode, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => {
        setMode(targetMode);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        mode === targetMode
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed md:relative z-30 w-72 h-full bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl md:shadow-none flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              Ω
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">OmniCalc</h1>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Tools</div>
          <NavButton targetMode={AppMode.SCIENTIFIC} icon={Calculator} label="Scientific" />
          <NavButton targetMode={AppMode.AGE} icon={Calendar} label="Age Calculator" />
          <NavButton targetMode={AppMode.ALGEBRA} icon={Sigma} label="Algebra Solver" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 text-center">
            <p>v1.0.0 • Offline Capable</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {mode === AppMode.SCIENTIFIC && 'Scientific Calculator'}
              {mode === AppMode.AGE && 'Age Calculator'}
              {mode === AppMode.ALGEBRA && 'Algebra Solver'}
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto h-full">
            {mode === AppMode.SCIENTIFIC && <ScientificCalculator />}
            {mode === AppMode.AGE && <AgeCalculator />}
            {mode === AppMode.ALGEBRA && <AlgebraCalculator />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;