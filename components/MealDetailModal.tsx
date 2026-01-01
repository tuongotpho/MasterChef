
import React, { useState } from 'react';
import { MealRecord } from '../types';

interface MealDetailModalProps {
  meal: MealRecord;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, onClose, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] bg-white animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto">
      {/* Custom Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-xs text-center space-y-6 animate-in zoom-in-95 duration-300">
            <i className="fas fa-trash-can text-3xl text-red-500"></i>
            <h4 className="text-xl font-bold">Xóa bữa ăn này?</h4>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { onDelete(meal.id); onClose(); setShowDeleteConfirm(false); }} 
                className="bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-100"
              >
                Xác nhận xóa
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="bg-slate-100 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls - Floating Sticky */}
      <div className="sticky top-0 z-20 flex justify-between items-center px-6 py-6 pointer-events-none">
        <button 
          onClick={onClose} 
          className="w-12 h-12 bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl text-slate-900 shadow-xl pointer-events-auto active:scale-90 transition-transform flex items-center justify-center"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <button 
          onClick={() => setShowDeleteConfirm(true)} 
          className="w-12 h-12 bg-red-500/80 backdrop-blur-xl border border-red-500/20 rounded-2xl text-white shadow-xl pointer-events-auto active:scale-90 transition-transform flex items-center justify-center"
        >
          <i className="fas fa-trash-can"></i>
        </button>
      </div>

      {/* Content Wrapper */}
      <div className="-mt-24">
        {/* Full Image Section */}
        <div className="w-full bg-slate-100 overflow-hidden">
          <img 
            src={meal.image} 
            alt={meal.name} 
            className="w-full h-auto block" 
            style={{ minHeight: '50vh' }}
          />
        </div>

        {/* Details Section */}
        <div className="p-8 pb-20 space-y-8 bg-slate-50 rounded-t-[3rem] -mt-8 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {new Date(meal.date).toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">{meal.name}</h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
             <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Nguyên liệu & Dinh dưỡng</h6>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">{meal.details?.ingredients || 'Chưa cập nhật'}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-green-50 rounded-3xl border border-green-100">
                   <h6 className="text-[9px] font-black text-green-700 uppercase mb-2">Ưu điểm</h6>
                   <p className="text-[11px] text-green-800 font-bold leading-relaxed">{meal.details?.pros || '...'}</p>
                </div>
                <div className="p-5 bg-orange-50 rounded-3xl border border-orange-100">
                   <h6 className="text-[9px] font-black text-orange-700 uppercase mb-2">Hạn chế</h6>
                   <p className="text-[11px] text-orange-800 font-bold leading-relaxed">{meal.details?.cons || '...'}</p>
                </div>
             </div>

             <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ghi chú bếp trưởng</h6>
                <p className="text-slate-600 text-sm italic leading-relaxed">"{meal.description || 'Không có ghi chú.'}"</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailModal;
