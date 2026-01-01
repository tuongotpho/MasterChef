
import React, { useState, useEffect } from 'react';
import { getMenuSuggestions } from '../services/geminiService';
import { MealRecord, Suggestion } from '../types';

const Suggestions: React.FC<{ meals: MealRecord[] }> = ({ meals }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const result = await getMenuSuggestions(meals);
      setSuggestions(result);
    } catch (err) {
      console.error("Suggestions failed", err);
      alert("Không thể tải gợi ý thực đơn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meals.length > 0 && suggestions.length === 0) {
      fetchSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Gợi ý Thực đơn AI</h3>
          <p className="text-slate-500">Dựa trên lịch sử nấu nướng để tránh trùng món và cân bằng dinh dưỡng.</p>
        </div>
        <button 
          onClick={fetchSuggestions}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-orange-200 active:scale-95"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-wand-magic-sparkles"></i>
          )}
          Tạo gợi ý mới
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse space-y-6">
              <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-20 bg-slate-100 rounded-2xl"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestions.map((s, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="bg-slate-900 p-6 text-white">
                <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-1">Gợi ý ngày {idx + 1}</p>
                <h4 className="text-xl font-bold">{s.day}</h4>
              </div>
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                      <i className="fas fa-sun"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Bữa sáng</p>
                      <p className="font-semibold text-slate-800">{s.breakfast}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0">
                      <i className="fas fa-utensils"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Bữa trưa</p>
                      <p className="font-semibold text-slate-800">{s.lunch}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 flex-shrink-0">
                      <i className="fas fa-moon"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Bữa tối</p>
                      <p className="font-semibold text-slate-800">{s.dinner}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-2 flex items-center gap-2">
                    <i className="fas fa-brain text-orange-500"></i> Lý do lựa chọn
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{s.reasoning}"
                  </p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full py-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
                  Chọn thực đơn này
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
            <i className="fas fa-lightbulb text-3xl"></i>
          </div>
          <h4 className="text-lg font-bold text-slate-800">Cần thêm dữ liệu</h4>
          <p className="text-slate-500 mt-2">Ghi nhật ký ít nhất 1 bữa ăn để AI có cơ sở đưa ra gợi ý tốt nhất cho bạn.</p>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
