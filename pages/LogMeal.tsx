
import React, { useState, useRef, useEffect } from 'react';
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
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tempToken, setTempToken] = useState('');
  
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

  const saveToken = () => {
    if (tempToken.startsWith('vercel_blob_rw_')) {
      localStorage.setItem('cheflog_blob_token', tempToken);
      setShowTokenInput(false);
      alert("Cấu hình thành công! Hãy thử lưu lại.");
    } else {
      alert("Token không hợp lệ. Phải bắt đầu bằng 'vercel_blob_rw_'");
    }
  };

  const handleSave = async () => {
    if (!imageFile || !name) {
      alert("Hãy chọn ảnh và nhập tên món!");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadMealImage(imageFile);

      const details: MealDetails = { 
        ingredients, 
        nutrition: "Đã lưu trữ", 
        pros, 
        cons 
      };

      const newMeal: MealRecord = {
        id: Date.now().toString(),
        date: new Date(date).toISOString(),
        image: imageUrl,
        name,
        description,
        details
      };

      onSave(newMeal);
      navigate('/history');
    } catch (error: any) {
      if (error.message === "MISSING_TOKEN") {
        setShowTokenInput(true);
      } else {
        alert("Lỗi khi lưu: " + (error instanceof Error ? error.message : "Vui lòng kiểm tra kết nối"));
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 duration-500 pb-10">
      {/* Token Setup Modal */}
      {showTokenInput && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <i className="fas fa-key text-3xl text-orange-500"></i>
              <h4 className="text-xl font-black uppercase">Cấu hình lưu trữ</h4>
              <p className="text-xs text-slate-500 font-medium">Bạn cần dán Vercel Blob Token để tải ảnh lên Cloud.</p>
            </div>
            <input 
              type="password" 
              value={tempToken} 
              onChange={(e) => setTempToken(e.target.value)}
              placeholder="vercel_blob_rw_..." 
              className="w-full p-4 bg-slate-100 rounded-2xl text-xs font-mono outline-none border-2 border-transparent focus:border-orange-500"
            />
            <div className="flex flex-col gap-3">
              <button onClick={saveToken} className="bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Lưu cấu hình</button>
              <button onClick={() => setShowTokenInput(false)} className="text-slate-400 font-bold text-xs uppercase">Bỏ qua</button>
            </div>
          </div>
        </div>
      )}

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
              <p className="text-xs font-black uppercase tracking-widest text-center px-6">Đang tải ảnh lên Cloud...</p>
            </div>
          )}
          
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        {/* Form Inputs */}
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nguyên liệu</label>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Nguyên liệu chính..." rows={2} className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none outline-none" />
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
