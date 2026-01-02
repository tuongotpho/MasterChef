
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  isSyncing?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isSyncing }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Tổng quan', icon: 'fa-house' },
    { path: '/history', label: 'Lịch sử', icon: 'fa-calendar-days' },
    { path: '/log', label: 'Thêm mới', icon: 'fa-plus-circle', special: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">
            <i className="fas fa-utensils"></i>
          </div>
          <h1 className="font-extrabold text-lg tracking-tight">Chef<span className="text-orange-500">Log</span></h1>
          {isSyncing && (
            <div className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-500 text-[8px] font-black uppercase rounded-full animate-pulse border border-blue-100 flex items-center gap-1">
              <i className="fas fa-sync fa-spin"></i> Cloud Syncing
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/settings" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:bg-slate-200 transition-colors">
             <i className="fas fa-cog text-sm"></i>
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center px-4 safe-bottom z-50 h-20 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all px-4 py-2 rounded-2xl ${
              location.pathname === item.path 
                ? (item.special ? 'text-orange-500' : 'text-orange-500 scale-110') 
                : 'text-slate-400'
            }`}
          >
            <i className={`fas ${item.icon} ${item.special ? 'text-4xl' : 'text-xl'}`}></i>
            {!item.special && <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;