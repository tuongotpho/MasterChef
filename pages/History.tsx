
import React, { useState } from 'react';
import { MealRecord } from '../types';

const History: React.FC<{ meals: MealRecord[], onDelete: (id: string) => void }> = ({ meals, onDelete }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedMeal, setSelectedMeal] = useState<MealRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calendar logic
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
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-calendar-check text-xl"></i>
            </div>
            <h4 className="font-black text-2xl tracking-tight uppercase">Tháng {currentMonth + 1}, {currentYear}</h4>
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
              else setCurrentMonth(currentMonth - 1);
            }} className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all shadow-lg active:scale-90">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button onClick={() => {
              if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
              else setCurrentMonth(currentMonth + 1);
            }} className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all shadow-lg active:scale-90">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
            <div key={d} className="py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {blanks.map((_, i) => <div key={`blank-${i}`} className="h-32 sm:h-52 border-b border-r border-slate-100 bg-slate-50/30"></div>)}
          {dayElements.map(day => {
            const dayMeals = getMealsForDay(day);
            const firstMeal = dayMeals[0];
            return (
              <div 
                key={day} 
                onClick={() => firstMeal && setSelectedMeal(firstMeal)}
                className={`h-32 sm:h-52 border-b border-r border-slate-100 relative group transition-all overflow-hidden ${firstMeal ? 'cursor-pointer hover:shadow-inner' : ''}`}
              >
                {firstMeal && (
                  <div className="absolute inset-0 z-0">
                    <img src={firstMeal.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                )}
                <div className="absolute top-3 left-3 z-10">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-xl shadow-md ${firstMeal ? 'bg-orange-500 text-white' : 'text-slate-300 bg-slate-50 border border-slate-100'}`}>
                    {day}
                    </span>
                </div>
                {firstMeal && (
                  <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                    <p className="text-[10px] font-black text-white truncate leading-tight uppercase drop-shadow-lg">
                      {firstMeal.name}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleDelete = () => {
    if (selectedMeal) {
      onDelete(selectedMeal.id);
      setSelectedMeal(null);
      setShowDeleteConfirm(false);
    }
  };

  const groupedMeals: Record<string, MealRecord[]> = meals.reduce((acc, meal) => {
    const dateStr = new Date(meal.date).toLocaleDateString('vi-VN', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(meal);
    return acc;
  }, {} as Record<string, MealRecord[]>);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">Thực đơn đã nấu</h3>
          <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Lịch sử suất ăn</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('list')} 
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Danh sách
          </button>
          <button 
            onClick={() => setViewMode('calendar')} 
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Tháng
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? renderCalendar() : (
        Object.keys(groupedMeals).length > 0 ? (
          <div className="space-y-16">
            {Object.entries(groupedMeals).map(([date, dayMeals]) => (
              <div key={date} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">{date}</h4>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {dayMeals.map((meal) => (
                    <div 
                      key={meal.id} 
                      onClick={() => setSelectedMeal(meal)}
                      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="h-64 relative overflow-hidden">
                        <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-slate-900 shadow-xl border border-white">
                          {new Date(meal.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="p-8">
                        <h5 className="font-black text-slate-900 text-xl leading-tight truncate uppercase tracking-tight">{meal.name}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
             <i className="fas fa-utensils text-5xl text-slate-200 mb-6 block"></i>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Chưa có dữ liệu</p>
          </div>
        )
      )}

      {/* Detail Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-12 duration-500 relative">
            
            {/* Custom Confirmation Overlay */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 z-[70] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-8">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Xác nhận xóa?</h4>
                  <div className="flex flex-col gap-3">
                    <button onClick={handleDelete} className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-lg">Xóa ngay</button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-4 rounded-2xl uppercase text-xs tracking-widest">Hủy bỏ</button>
                  </div>
                </div>
              </div>
            )}

            {/* HD Image Area - CLEAN */}
            <div className="relative h-[48vh] min-h-[380px] w-full bg-black flex-shrink-0 group">
              <img src={selectedMeal.image} alt={selectedMeal.name} className="w-full h-full object-contain" />
              <div className="absolute top-10 right-10 flex gap-4">
                <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-14 h-14 bg-red-500/20 hover:bg-red-500 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-white transition-all shadow-xl"
                >
                    <i className="fas fa-trash-can text-xl"></i>
                </button>
                <button onClick={() => setSelectedMeal(null)} className="w-14 h-14 bg-white/20 hover:bg-white/100 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-white hover:text-slate-900 transition-all shadow-xl">
                    <i className="fas fa-times text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 sm:p-16 space-y-12 bg-white">
              <div className="border-b border-slate-100 pb-12 space-y-5">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                    {new Date(selectedMeal.date).toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                  {selectedMeal.name}
                </h2>
              </div>

              {selectedMeal.analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div className="space-y-4">
                        <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Xếp hạng</h6>
                        <div className="flex items-center gap-4 text-3xl text-orange-400">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-star ${i < (selectedMeal.analysis?.rating || 0) ? 'fas' : 'far'}`}></i>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                      <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Nguyên liệu & Dinh dưỡng</h6>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedMeal.analysis.ingredients.map((ing, i) => (
                          <span key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-600 border border-slate-100">{ing}</span>
                        ))}
                      </div>
                      <p className="text-slate-700 font-bold">{selectedMeal.analysis.nutritionSummary}</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="p-8 bg-green-50 rounded-[2.5rem] border border-green-100">
                      <h6 className="text-[11px] font-black text-green-700 uppercase tracking-[0.3em] mb-4">Ưu điểm</h6>
                      <ul className="space-y-3">
                        {selectedMeal.analysis.pros.map((p, i) => (
                          <li key={i} className="text-sm font-bold flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5"></div>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100">
                      <h6 className="text-[11px] font-black text-orange-700 uppercase tracking-[0.3em] mb-4">Cần cải thiện</h6>
                      <ul className="space-y-3">
                        {selectedMeal.analysis.cons.map((c, i) => (
                          <li key={i} className="text-sm font-bold flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5"></div>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 font-medium italic">Không có dữ liệu phân tích AI.</p>
              )}
              
              <div className="pt-8 border-t border-slate-100">
                <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Ghi chú bếp trưởng</h6>
                <p className="text-slate-600 italic">"{selectedMeal.description || 'Không có ghi chú.'}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
