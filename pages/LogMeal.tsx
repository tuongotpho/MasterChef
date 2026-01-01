
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealRecord, MealDetails } from '../types';
import { uploadMealImage } from '../services/blobService';

interface LogMealProps {
  onSave: (meal: MealRecord) => void;
}

const LogMeal: React.FC<LogMealProps> = ({ onSave }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!imageFile || !name) {
      alert("Hãy chọn ảnh và nhập tên món!");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload ảnh lên Vercel Blob
      const imageUrl = await uploadMealImage(imageFile);

      // 2. Tạo record với URL ảnh từ cloud
      const details: MealDetails = { 
        ingredients, 
        nutrition: "Đã phân tích qua ảnh", 
        pros, 
        cons 
      };

      const newMeal: MealRecord = {
        id: Date.now().toString(),
        date: new Date(date).toISOString(),
        image: imageUrl, // Lưu URL thay vì base64
        name,
        description,
        details
      };

      onSave(newMeal);
      navigate('/history');
    } catch (error) {
      alert("Lỗi khi lưu: " + (error instanceof Error ? error.message : "Vui lòng kiểm tra cấu hình Vercel Blob"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 duration-500 pb-10">
      <div className="space-y-6">
        {/* Upload Area */}
        <div 
          onClick={() => !imagePreview && !isUploading && fileInputRef.current?.click()}
          className={`relative h-64 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
            imagePreview ? 'border-transparent shadow-xl' : 'border-slate-200 bg-white'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              {!isUploading && (
                <button onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }} className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full shadow-lg">
                  <i className="fas fa-trash-can"></i>
                </button>
              )}
            </>
          ) : (
            <div className="text-center p-6 pointer-events-none">
              <i className="fas fa-camera text-4xl text-slate-200 mb-3"></i>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Chụp ảnh bữa ăn</p>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
              <i className="fas fa-circle-notch fa-spin text-3xl mb-2"></i>
              <p className="text-xs font-black uppercase tracking-widest">Đang tải ảnh lên Cloud...</p>
            </div>
          )}
          
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        {/* Inputs */}
        <div className={`bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên món chính</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Cơm sườn trứng..." className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thời gian</label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm border-none outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nguyên liệu & Dinh dưỡng</label>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Nguyên liệu chính..." rows={2} className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-green-600 uppercase tracking-widest ml-1">Ưu điểm</label>
              <textarea value={pros} onChange={(e) => setPros(e.target.value)} rows={2} className="w-full p-4 bg-green-50/50 rounded-2xl text-xs border-none outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Hạn chế</label>
              <textarea value={cons} onChange={(e) => setCons(e.target.value)} rows={2} className="w-full p-4 bg-orange-50/50 rounded-2xl text-xs border-none outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú bếp trưởng</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none outline-none" />
          </div>
        </div>

        <button 
          onClick={handleSave} 
          disabled={isUploading}
          className={`w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl transition-all ${isUploading ? 'opacity-50' : 'active:scale-95'}`}
        >
          {isUploading ? 'Đang xử lý...' : 'Lưu Nhật Ký Bữa Ăn'}
        </button>
      </div>
    </div>
  );
};

export default LogMeal;
