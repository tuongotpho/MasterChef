
import React from 'react';
import { MealRecord } from '../types';

interface SettingsProps {
  meals: MealRecord[];
  userId: string | null;
}

const Settings: React.FC<SettingsProps> = ({ meals, userId }) => {
  const exportData = () => {
    const dataStr = JSON.stringify(meals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `cheflog-firebase-backup-${new Date().toISOString().slice(0,10)}.json`);
    linkElement.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-2 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-500 mx-auto mb-4">
          <i className="fas fa-fire text-3xl"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase">Firebase Cloud</h2>
        <p className="text-slate-400 text-sm font-medium">Dữ liệu của bạn được bảo mật và đồng bộ</p>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</span>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded-md">{userId?.slice(0, 10)}...</span>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-[8px] font-black uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Đã kết nối
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button onClick={exportData} className="w-full bg-slate-900 text-white p-5 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
          <i className="fas fa-file-export"></i>
          <span className="text-xs font-black uppercase tracking-widest">Xuất dữ liệu dự phòng</span>
        </button>
      </div>

      <div className="bg-orange-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-100 relative overflow-hidden">
        <i className="fas fa-cloud absolute -right-4 -bottom-4 text-8xl opacity-10"></i>
        <h4 className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Thông tin lưu trữ</h4>
        <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black">{meals.length}</span>
            <span className="text-sm font-bold uppercase opacity-80">Món ăn trên Cloud</span>
        </div>
      </div>

      <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic text-center">
            Mọi thay đổi sẽ được cập nhật tức thì lên hệ thống Firebase của bạn. 
            Hình ảnh được lưu trữ an toàn tại Cloud Storage.
        </p>
      </div>
    </div>
  );
};

export default Settings;
