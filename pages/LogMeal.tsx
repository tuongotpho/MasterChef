
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealRecord, MealDetails } from '../types';
import { uploadMealImage } from '../services/blobService';

interface LogMealProps {
  onSave: (meal: MealRecord) => void;
  onTokenSet: () => void;
}

const LogMeal: React.FC<LogMealProps> = ({ onSave, onTokenSet }) => {
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
      onTokenSet(); // Kích hoạt tải dữ liệu cũ ngay lập tức
      alert("Cấu hình thành công! Dữ liệu cũ đang được tải về.");
    } else {
      alert("Token không hợp lệ.");
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

      const newMeal: MealRecord = {
        id: Date.now().toString(),
        date: new Date(date).toISOString(),
        image: imageUrl,
        name,
        description,
        details: { ingredients, nutrition: "Cloud synced", pros: "", cons: "" }
      };

      onSave(newMeal);
      navigate('/history');
    } catch (error: any) {
      if (error.message === "MISSING_TOKEN") setShowTokenInput(true);
      else alert("Lỗi: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 duration-500 pb-10">
      {showTokenInput && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <i className="fas fa-key text-3xl text-orange-500"></i>
              <h4 className="text-xl font-black uppercase">Kết nối Cloud</h4>
              <p className="text-xs text-slate-500 font-medium">Dán Token để tải lại toàn bộ nhật ký cũ.</p>
            </div>
            <input 
              type="password" value={tempToken} onChange={(e) => setTempToken(e.target.value)}
              placeholder="vercel_blob_rw_..." 
              className="w-full p-4 bg-slate-100 rounded-2xl text-xs font-mono outline-none border-2 border-transparent focus:border-orange-500"
            />
            <button onClick={saveToken} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Kết nối & Tải dữ liệu</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div 
          onClick={() => !imagePreview && !isUploading && fileInputRef.current?.click()}
          className={`relative h-64 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
            imagePreview ? 'border-transparent shadow-xl' : 'border-slate-200 bg-white'
          } ${isUploading ? 'opacity-50' : 'cursor-pointer'}`}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6"><i className="fas fa-camera text-4xl text-slate-200 mb-3"></i><p className="text-slate-400 text-xs font-bold uppercase">Chụp ảnh bữa ăn</p></div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
              <i className="fas fa-circle-notch fa-spin text-3xl mb-2"></i>
              <p className="text-xs font-black uppercase">Đang tải...</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên món chính</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên món..." className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nguyên liệu</label>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Mô tả món..." className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none outline-none" />
          </div>
        </div>

        <button onClick={handleSave} disabled={isUploading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
          {isUploading ? 'Đang lưu Cloud...' : 'Lưu Nhật Ký'}
        </button>
      </div>
    </div>
  );
};

export default LogMeal;
