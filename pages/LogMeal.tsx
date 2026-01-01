
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMealImage } from '../services/geminiService';
import { MealRecord, MealAnalysis } from '../types';

interface LogMealProps {
  onSave: (meal: MealRecord) => void;
}

const LogMeal: React.FC<LogMealProps> = ({ onSave }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Manual evaluation states
  const [rating, setRating] = useState(5);
  const [ingredients, setIngredients] = useState('');
  const [nutrition, setNutrition] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAIAnalysis = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const result = await analyzeMealImage(image);
      if (result.dishName) setName(result.dishName);
      if (result.rating) setRating(result.rating);
      if (result.ingredients) setIngredients(result.ingredients.join(', '));
      if (result.nutritionSummary) setNutrition(result.nutritionSummary);
      if (result.pros) setPros(result.pros.join('\n'));
      if (result.cons) setCons(result.cons.join('\n'));
    } catch (err) {
      console.error("AI Analysis failed", err);
      alert("AI không thể phân tích ảnh này. Bạn vui lòng tự nhập tay nhé!");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!image || !name) {
      alert("Vui lòng tải ảnh và nhập tên món ăn");
      return;
    }

    const analysis: MealAnalysis = {
      dishName: name,
      rating,
      ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
      nutritionSummary: nutrition,
      pros: pros.split('\n').map(p => p.trim()).filter(p => p),
      cons: cons.split('\n').map(c => c.trim()).filter(c => c),
    };

    const newMeal: MealRecord = {
      id: Date.now().toString(),
      date: new Date(date).toISOString(),
      image,
      name,
      description,
      analysis
    };

    onSave(newMeal);
    navigate('/history');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-20 px-4">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-5/12 lg:sticky lg:top-24 h-fit space-y-6">
            <div 
                onClick={() => !image && fileInputRef.current?.click()}
                className={`relative h-[400px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all overflow-hidden shadow-sm group ${
                image ? 'border-transparent shadow-xl' : 'border-slate-200 hover:border-orange-400 hover:bg-orange-50'
                }`}
            >
                {image ? (
                  <>
                    <img src={image} alt="Meal preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <button onClick={clearImage} className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                            <i className="fas fa-trash-can"></i>
                        </button>
                        <p className="text-white text-xs font-black uppercase tracking-widest">Xóa ảnh</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-10 pointer-events-none">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6 mx-auto group-hover:bg-orange-100 group-hover:text-orange-500 transition-all">
                        <i className="fas fa-camera text-3xl"></i>
                    </div>
                    <p className="text-slate-600 font-black uppercase text-xs tracking-widest">Tải ảnh bữa ăn</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                        <i className="fas fa-robot"></i>
                    </div>
                    <h4 className="font-bold text-sm">Trợ lý AI</h4>
                </div>
                <button 
                    onClick={handleAIAnalysis}
                    disabled={!image || analyzing}
                    className="w-full bg-white text-slate-900 hover:bg-orange-500 hover:text-white disabled:bg-slate-800 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                >
                    {analyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                    Tự động phân tích
                </button>
            </div>
        </div>

        <div className="w-full lg:w-7/12 bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 sm:p-14 space-y-10">
            <div className="space-y-8">
                <div className="border-b border-slate-100 pb-6">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Chi tiết bữa ăn</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</label>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên món</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên món ăn..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đánh giá (1-5 sao)</label>
                    <div className="flex gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} onClick={() => setRating(star)} className={`text-3xl transition-all ${star <= rating ? 'text-orange-400' : 'text-slate-200'}`}>
                                <i className="fas fa-star"></i>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nguyên liệu (cách nhau bằng dấu phẩy)</label>
                        <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={2} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dinh dưỡng</label>
                        <input type="text" value={nutrition} onChange={(e) => setNutrition(e.target.value)} placeholder="Calo, Đạm..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-green-600 uppercase tracking-widest">Ưu điểm</label>
                        <textarea value={pros} onChange={(e) => setPros(e.target.value)} rows={3} className="w-full px-6 py-4 bg-green-50 border border-green-100 rounded-2xl text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Hạn chế</label>
                        <textarea value={cons} onChange={(e) => setCons(e.target.value)} rows={3} className="w-full px-6 py-4 bg-orange-50 border border-orange-100 rounded-2xl text-sm" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghi chú thêm</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm" />
                </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex gap-4">
                <button onClick={() => navigate(-1)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Hủy</button>
                <button onClick={handleSave} className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Lưu Nhật Ký</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LogMeal;
