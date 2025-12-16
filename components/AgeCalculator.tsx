import React, { useState, useEffect } from 'react';
import { differenceInYears, differenceInMonths, differenceInDays, addYears, isValid, format, parse, intervalToDuration } from 'date-fns';
import { Calendar, Cake, Clock, Hourglass } from 'lucide-react';

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);
  const [nextBirthday, setNextBirthday] = useState<{ days: number; dayOfWeek: string } | null>(null);
  const [totalDays, setTotalDays] = useState<number | null>(null);

  useEffect(() => {
    calculateAge();
  }, [birthDate, targetDate]);

  const calculateAge = () => {
    if (!birthDate || !targetDate) return;

    const start = new Date(birthDate);
    const end = new Date(targetDate);

    if (!isValid(start) || !isValid(end)) return;
    if (start > end) {
      setResult(null);
      setNextBirthday(null);
      setTotalDays(null);
      return;
    }

    // Exact Age
    const duration = intervalToDuration({ start, end });
    setResult({
      years: duration.years || 0,
      months: duration.months || 0,
      days: duration.days || 0,
    });

    // Total Days
    setTotalDays(differenceInDays(end, start));

    // Next Birthday
    const currentYear = end.getFullYear();
    let nextBday = new Date(start);
    nextBday.setFullYear(currentYear);
    
    if (nextBday < end) {
      nextBday.setFullYear(currentYear + 1);
    }
    
    const daysUntil = differenceInDays(nextBday, end);
    setNextBirthday({
      days: daysUntil,
      dayOfWeek: format(nextBday, 'EEEE'),
    });
  };

  const Card = ({ title, icon: Icon, children, className = '' }: any) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium uppercase tracking-wider">
        <Icon size={16} />
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in duration-500">
      
      {/* Input Section */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 md:col-span-2 lg:col-span-1">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Calendar size={24} /></span>
            Date Details
        </h2>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg text-slate-800"
                />
            </div>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-slate-400">Calculated To</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Date (Default: Today)</label>
                <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg text-slate-800"
                />
            </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 gap-4">
        {result ? (
            <>
                {/* Main Age Card */}
                <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Hourglass size={120} />
                    </div>
                    <p className="text-indigo-200 font-medium mb-1">Exact Age</p>
                    <div className="flex items-baseline gap-2 flex-wrap relative z-10">
                        <span className="text-6xl font-bold tracking-tighter">{result.years}</span>
                        <span className="text-xl opacity-80 mr-4">years</span>
                        
                        <span className="text-4xl font-bold tracking-tighter">{result.months}</span>
                        <span className="text-lg opacity-80 mr-4">months</span>
                        
                        <span className="text-4xl font-bold tracking-tighter">{result.days}</span>
                        <span className="text-lg opacity-80">days</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <Card title="Next Birthday" icon={Cake} className="bg-pink-50 border-pink-100">
                        {nextBirthday ? (
                             <div>
                                <div className="text-3xl font-bold text-pink-600 mb-1">{nextBirthday.days}</div>
                                <div className="text-sm text-pink-400 font-medium">Days Remaining</div>
                                <div className="text-xs text-pink-400 mt-2">On a {nextBirthday.dayOfWeek}</div>
                             </div>
                        ) : <span className="text-slate-400">-</span>}
                     </Card>
                     
                     <Card title="Total Days Lived" icon={Clock} className="bg-amber-50 border-amber-100">
                         {totalDays !== null ? (
                             <div>
                                <div className="text-3xl font-bold text-amber-600 mb-1">{totalDays.toLocaleString()}</div>
                                <div className="text-sm text-amber-400 font-medium">Days</div>
                             </div>
                         ) : <span className="text-slate-400">-</span>}
                     </Card>
                </div>

                {/* Extra Stats */}
                <Card title="Summary" icon={Calendar}>
                    <div className="space-y-3">
                         <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                            <span className="text-slate-500">Total Months</span>
                            <span className="font-mono font-medium text-slate-700">{(result.years * 12 + result.months).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                            <span className="text-slate-500">Total Weeks</span>
                            <span className="font-mono font-medium text-slate-700">{totalDays ? Math.floor(totalDays / 7).toLocaleString() : '-'}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Total Hours (approx)</span>
                            <span className="font-mono font-medium text-slate-700">{totalDays ? (totalDays * 24).toLocaleString() : '-'}</span>
                         </div>
                    </div>
                </Card>
            </>
        ) : (
            <div className="h-full bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[300px]">
                <Calendar size={48} className="mb-4 opacity-50" />
                <p className="font-medium">Enter a valid Date of Birth</p>
                <p className="text-sm mt-1">To see detailed age statistics</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;