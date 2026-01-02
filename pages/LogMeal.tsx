
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealRecord } from '../types';
import { uploadMealImage, saveMealToFirestore } from '../services/firebaseService';

interface LogMealProps {
  userId: string | null;
}

const LogMeal: React.FC<LogMealProps> = ({ userId }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [date, setDate] = useState(() => {
    const now = new Date();
    // Chuyển đổi sang múi giờ địa phương cho input datetime-local
    const pad = (n: number) => n.toString().padStart(2, '0');
    const localDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return localDateTime;
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');

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
    if (!userId) {
      alert("Đang khởi tạo kết nối Cloud, vui lòng đợi...");
      return;
    }
    if (!imageFile || !name) {
      alert("Hãy chọn ảnh và nhập tên món!");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload ảnh lên Storage
      const { url, path } = await uploadMealImage(userId, imageFile);

      // 2. Lưu dữ liệu vào Firestore
      const newMeal = {
        date: new Date(date).toISOString(),
        image: url,
        name,
        description,
        details: { 
          ingredients, 
          nutrition: "Firebase Synced", 
          pros: "Dữ liệu được lưu trữ an toàn", 
          cons: "" 
        }
      };

      await saveMealToFirestore(userId, newMeal, path);
      navigate('/history');
    } catch (error: any) {
      alert("Lỗi Firebase: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 duration-500 pb-10">
      <div className="space-y-6">
        {/* Image Selection Area */}
        <div 
          onClick={() => !imagePreview && !isUploading && fileInputRef.current?.click()}
          className={`relative h-64 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
            imagePreview ? 'border-transparent shadow-xl' : 'border-slate-200 bg-white'
          } ${isUploading ? 'opacity-50' : 'cursor-pointer hover:border-orange-300 bg-slate-50/50'}`}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center active:scale-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </>
          ) : (
            <div className="text-center p-6">
              <i className="fas fa-camera text-4xl text-slate-300 mb-3"></i>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Chụp hoặc Chọn ảnh món ăn</p>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
              <i className="fas fa-circle-notch fa-spin text-3xl mb-2"></i>
              <p className="text-xs font-black uppercase">Đang tải lên Firebase...</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-5">
          {/* Tên món */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <i className="fas fa-tag text-[8px]"></i> Tên món chính
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ví dụ: Cá kho tộ, Sườn xào chua ngọt..." 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" 
            />
          </div>

          {/* Ngày giờ đăng */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <i className="fas fa-clock text-[8px]"></i> Thời gian bữa ăn
            </label>
            <input 
              type="datetime-local" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm appearance-none" 
            />
          </div>

          {/* Nguyên liệu */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <i className="fas fa-leaf text-[8px]"></i> Nguyên liệu & Mô tả
            </label>
            <textarea 
              value={ingredients} 
              onChange={(e) => setIngredients(e.target.value)} 
              placeholder="Các thành phần chính có trong món ăn..." 
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all h-24 resize-none" 
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSave} 
          disabled={isUploading || !name || !imageFile} 
          className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${
            isUploading || !name || !imageFile 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-orange-500 text-white active:scale-95 hover:bg-orange-600 shadow-orange-100'
          }`}
        >
          {isUploading ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              Đang lưu...
            </>
          ) : (
            <>
              <i className="fas fa-cloud-arrow-up"></i>
              Lưu Nhật Ký Firebase
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-slate-400 font-medium px-6">
          Hình ảnh và dữ liệu sẽ được đồng bộ hóa tức thì với tài khoản đầu bếp của bạn trên Cloud.
        </p>
      </div>
    </div>
  );
};

export default LogMeal;
