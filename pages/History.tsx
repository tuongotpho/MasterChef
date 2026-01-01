
import React, { useState } from 'react';
import { MealRecord } from '../types';
import MealDetailModal from '../components/MealDetailModal';

const History: React.FC<{ meals: MealRecord[], onDelete: (id: string) => void }> = ({ meals, onDelete }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedMeal, setSelectedMeal] = useState<MealRecord | null>(null);

  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const getMealsForDay = (day: number) => {
    return meals.filter(m => {
      const d = new Date(m.date);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    const blanks = Array(firstDay).fill(null);
    const dayElements = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <h4 className="font-black text-sm uppercase tracking-widest">Tháng {currentMonth + 1}, {currentYear}</h4>
          <div className="flex gap-2">
            <button onClick={() => {
              if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
              else setCurrentMonth(currentMonth - 1);
            }} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center active:bg-orange-500">
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <button onClick={() => {
              if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
              else setCurrentMonth(currentMonth + 1);
            }} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center active:bg-orange-500">
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
            <div key={d} className="py-3 text-center text-[9px] font-black text-slate-400 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {blanks.map((_, i) => <div key={`blank-${i}`} className="h-14 sm:h-20 border-b border-r border-slate-50 bg-slate-50/20"></div>)}
          {dayElements.map(day => {
            const dayMeals = getMealsForDay(day);
            const firstMeal = dayMeals[0];
            return (
              <div 
                key={day} 
                onClick={() => firstMeal && setSelectedMeal(firstMeal)}
                className={`h-14 sm:h-20 border-b border-r border-slate-50 relative overflow-hidden active:bg-slate-50 ${firstMeal ? 'cursor-pointer' : ''}`}
              >
                {firstMeal && (
                  <div className="absolute inset-0 z-0">
                    <img src={firstMeal.image} alt="" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-orange-500/10"></div>
                  </div>
                )}
                <div className="absolute top-1.5 left-1.5 z-10">
                    <span className={`text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-md ${firstMeal ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-300'}`}>
                    {day}
                    </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const groupedMeals: Record<string, MealRecord[]> = meals.reduce((acc, meal) => {
    const dateStr = new Date(meal.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(meal);
    return acc;
  }, {} as Record<string, MealRecord[]>);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Thực đơn</h3>
        <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
          <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>List</button>
          <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Cal</button>
        </div>
      </div>

      {viewMode === 'calendar' ? renderCalendar() : (
        <div className="space-y-8">
          {Object.entries(groupedMeals).map(([date, dayMeals]) => (
            <div key={date} className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{date}</h4>
              <div className="space-y-3">
                {dayMeals.map((meal) => (
                  <div key={meal.id} onClick={() => setSelectedMeal(meal)} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-transform">
                    <img src={meal.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-900 text-sm uppercase truncate">{meal.name}</h5>
                      <p className="text-[10px] text-slate-400">{new Date(meal.date).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="text-slate-300 font-bold px-2"><i className="fas fa-chevron-right"></i></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMeal && (
        <MealDetailModal 
          meal={selectedMeal} 
          onClose={() => setSelectedMeal(null)} 
          onDelete={onDelete} 
        />
      )}
    </div>
  );
};

export default History;
