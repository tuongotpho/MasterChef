
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Tổng quan', icon: 'fa-chart-pie' },
    { path: '/log', label: 'Ghi nhật ký', icon: 'fa-camera' },
    { path: '/history', label: 'Lịch sử', icon: 'fa-calendar-days' },
    { path: '/suggestions', label: 'Gợi ý AI', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
            <i className="fas fa-utensils"></i>
          </div>
          <h1 className="font-bold text-xl tracking-tight">ChefLog <span className="text-orange-500">AI</span></h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-orange-50 text-orange-600 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-slate-900 rounded-2xl text-white">
          <p className="text-xs text-slate-400 mb-1">Phiên bản chuyên gia</p>
          <p className="text-sm font-medium">Bếp Trưởng AI</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {navItems.find(i => i.path === location.pathname)?.label || 'Bảng điều khiển'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <i className="fas fa-bell"></i>
            </button>
            <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/seed/chef/100/100" alt="Avatar" />
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === item.path ? 'text-orange-500' : 'text-slate-400'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
