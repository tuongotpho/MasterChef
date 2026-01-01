
import React, { useState } from 'react';
import { MealRecord } from '../types';

interface SettingsProps {
  meals: MealRecord[];
  onImport: (meals: MealRecord[]) => void;
  onSyncRequest: () => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ meals, onImport, onSyncRequest }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await onSyncRequest();
    setIsSyncing(false);
    alert("Đã hoàn tất đồng bộ từ Cloud!");
  };

  const exportData = () => {
    const dataStr = JSON.stringify(meals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `cheflog-backup-${new Date().toISOString().slice(0,10)}.json`);
    linkElement.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Cài đặt</h2>
        <p className="text-slate-400 text-sm font-medium">Dữ liệu được tự động lưu lên Cloud khi có Token.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <i className={`fas fa-sync ${isSyncing ? 'fa-spin' : ''}`}></i>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-sm">Đồng bộ Cloud</h4>
            <p className="text-[10px] text-slate-400 font-medium">Tải lại dữ liệu từ Vercel Blob.</p>
          </div>
          <button onClick={handleManualSync} disabled={isSyncing} className="px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase rounded-xl">Đồng bộ ngay</button>
        </div>

        <div className="h-px bg-slate-50"></div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <i className="fas fa-file-export"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-sm">Sao lưu file rời</h4>
            <p className="text-[10px] text-slate-400 font-medium">Xuất ra file JSON dự phòng.</p>
          </div>
          <button onClick={exportData} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl">Tải về</button>
        </div>
      </div>
      
      <div className="p-6 bg-slate-100 rounded-3xl">
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          <i className="fas fa-shield-halved mr-1"></i>
          Ứng dụng sử dụng cơ chế ghi đè thông minh. Khi bạn thay đổi Token, hãy nhấn "Đồng bộ ngay" để hợp nhất dữ liệu từ vùng lưu trữ mới.
        </p>
      </div>
    </div>
  );
};

export default Settings;
