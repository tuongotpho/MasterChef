
import React from 'react';
import { MealRecord } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ meals: MealRecord[] }> = ({ meals }) => {
  const recentMeals = meals.slice(0, 3);
  
  const stats = [
    { label: 'Tổng số bữa ăn', value: meals.length, icon: 'fa-utensils', color: 'bg-blue-500' },
    { label: 'Đã nấu tuần này', value: meals.filter(m => new Date(m.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: 'fa-calendar-week', color: 'bg-green-500' },
    { label: 'Đánh giá trung bình', value: meals.length ? (meals.reduce((acc, m) => acc + (m.analysis?.rating || 0), 0) / meals.length).toFixed(1) : '0', icon: 'fa-star', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Meals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Bữa ăn gần đây</h3>
            <Link to="/history" className="text-orange-600 text-sm font-semibold hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-4">
            {recentMeals.length > 0 ? (
              recentMeals.map((meal) => (
                <div key={meal.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">{new Date(meal.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <h4 className="font-bold text-slate-900 truncate">{meal.name}</h4>
                    {meal.analysis && (
                      <div className="flex gap-1 mt-1 text-orange-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fa-star ${i < (meal.analysis?.rating || 0) ? 'fas' : 'far'}`}></i>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                <i className="fas fa-camera-retro text-3xl mb-3"></i>
                <p>Chưa có bữa ăn nào được ghi lại</p>
                <Link to="/log" className="text-orange-600 font-semibold mt-2 inline-block">Bắt đầu ngay</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips / Suggestion Preview */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Gợi ý từ AI Chef</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Dựa trên thực đơn tuần này, bạn nên bổ sung thêm các món rau xanh đậm và cá để tăng cường Omega-3 cho công nhân.
            </p>
            <Link to="/suggestions" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors px-6 py-3 rounded-xl font-bold text-sm">
              Xem thực đơn tuần sau
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-20">
            <i className="fas fa-robot text-[200px]"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
