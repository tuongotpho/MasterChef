
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
            <h4 className="font-black text-2xl tracking-tight">Tháng {currentMonth + 1}, {currentYear}</h4>
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
                    {dayMeals.length > 1 && (
                      <p className="text-[8px] text-orange-200 font-black uppercase mt-0.5 tracking-tighter drop-shadow-sm">
                        +{dayMeals.length - 1} món khác
                      </p>
                    )}
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
          <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Lịch sử bếp ăn công nghiệp</p>
        </div>
        
        <div className="flex items-center gap-4">
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
              Lịch tháng
            </button>
          </div>
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
                      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500"
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
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200 shadow-inner">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                <i className="fas fa-utensils text-5xl"></i>
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Chưa có nhật ký nào...</p>
          </div>
        )
      )}

      {/* Detail Modal - Clean HD Image Viewer with Custom Delete Confirmation */}
      {selectedMeal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-12 duration-500 relative">
            
            {/* Custom Confirmation Overlay */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 z-[70] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900">Xóa nhật ký này?</h4>
                    <p className="text-slate-500 font-medium">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa bữa ăn này khỏi lịch sử?</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleDelete}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-red-100"
                    >
                      Xác nhận xóa ngay
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* HD Image Area */}
            <div className="relative h-[48vh] min-h-[380px] w-full bg-black flex-shrink-0 group">
              <img src={selectedMeal.image} alt={selectedMeal.name} className="w-full h-full object-contain" />
              <div className="absolute top-10 right-10 flex gap-4">
                <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-14 h-14 bg-red-500/20 hover:bg-red-500 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-90"
                    title="Xóa bữa ăn"
                >
                    <i className="fas fa-trash-can text-xl"></i>
                </button>
                <button 
                    onClick={() => setSelectedMeal(null)}
                    className="w-14 h-14 bg-white/20 hover:bg-white/100 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-white hover:text-slate-900 shadow-2xl transition-all hover:scale-110 active:scale-90"
                >
                    <i className="fas fa-times text-2xl"></i>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-12 sm:p-16 space-y-12 bg-white">
              <div className="border-b border-slate-100 pb-12 space-y-5">
                <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-xl text-[11px] font-black uppercase tracking-[0.2em]">
                        Chi tiết nhật ký
                    </span>
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                        {new Date(selectedMeal.date).toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                  {selectedMeal.name}
                </h2>
              </div>

              {selectedMeal.analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div className="space-y-4">
                        <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <i className="fas fa-star text-orange-400"></i> Xếp hạng bữa ăn
                        </h6>
                        <div className="flex items-center gap-6">
                            <div className="flex gap-1.5 text-3xl text-orange-400">
                                {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-star ${i < (selectedMeal.analysis?.rating || 0) ? 'fas' : 'far'}`}></i>
                                ))}
                            </div>
                            <span className="text-xl font-black text-slate-800 tracking-tighter">{selectedMeal.analysis.rating}/5</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                      <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Nguyên liệu tiêu biểu</h6>
                      <div className="flex flex-wrap gap-3">
                        {selectedMeal.analysis.ingredients.map((ing, i) => (
                          <span key={i} className="px-5 py-2.5 bg-slate-50 rounded-2xl text-xs font-black text-slate-600 border border-slate-100 shadow-sm">{ing}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                        <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Phân tích dinh dưỡng</h6>
                        <p className="text-slate-700 text-lg font-bold leading-snug">
                           {selectedMeal.analysis.nutritionSummary}
                        </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="p-10 bg-green-50 rounded-[3rem] border border-green-100 relative overflow-hidden group">
                      <h6 className="text-[11px] font-black text-green-700 uppercase tracking-[0.3em] mb-6">Ưu điểm nổi bật</h6>
                      <ul className="space-y-4">
                        {selectedMeal.analysis.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-green-800 font-bold flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                      <i className="fas fa-check-circle absolute -bottom-6 -right-6 text-green-100 text-9xl -rotate-12 opacity-50"></i>
                    </div>
                    <div className="p-10 bg-orange-50 rounded-[3rem] border border-orange-100 relative overflow-hidden group">
                      <h6 className="text-[11px] font-black text-orange-700 uppercase tracking-[0.3em] mb-6">Cần điều chỉnh</h6>
                      <ul className="space-y-4">
                        {selectedMeal.analysis.cons.map((con, i) => (
                          <li key={i} className="text-sm text-orange-800 font-bold flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                      <i className="fas fa-exclamation-triangle absolute -bottom-6 -right-6 text-orange-100 text-9xl -rotate-12 opacity-50"></i>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
                  Dữ liệu phân tích đang trống
                </div>
              )}

              <div className="pt-12 border-t border-slate-100">
                <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Ghi chú từ Bếp trưởng</h6>
                <p className="text-slate-500 text-lg leading-relaxed italic font-medium">
                  "{selectedMeal.description || 'Không có ghi chú thêm cho bữa ăn này.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
