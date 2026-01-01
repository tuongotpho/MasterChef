
import React, { useState } from 'react';
import { MealRecord } from '../types';
import { Link } from 'react-router-dom';
import MealDetailModal from '../components/MealDetailModal';

interface DashboardProps {
  meals: MealRecord[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ meals, onDelete }) => {
  const [selectedMeal, setSelectedMeal] = useState<MealRecord | null>(null);
  const recentMeals = meals.slice(0, 5);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Chào đầu bếp!</h2>
          <p className="text-slate-400 text-sm font-medium">Bạn đã lưu {meals.length} bữa ăn</p>
        </div>
        <Link to="/log" className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-90 transition-transform">
          <i className="fas fa-plus"></i>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Tuần này</p>
           <p className="text-2xl font-black text-slate-900">
             {meals.filter(m => new Date(m.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
           </p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Tổng cộng</p>
           <p className="text-2xl font-black text-slate-900">
             {meals.length} <span className="text-sm font-bold text-slate-400">món</span>
           </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800">Mới nhất</h3>
          <Link to="/history" className="text-orange-500 text-xs font-bold uppercase tracking-widest">Xem tất cả</Link>
        </div>
        
        {recentMeals.length > 0 ? (
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div 
                key={meal.id} 
                onClick={() => setSelectedMeal(meal)}
                className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={meal.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate uppercase">{meal.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(meal.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-slate-300 font-bold px-3">
                   <i className="fas fa-chevron-right text-xs"></i>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center text-slate-400">
            <p className="text-sm font-bold">Bắt đầu lưu bữa ăn đầu tiên</p>
          </div>
        )}
      </div>

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

export default Dashboard;
