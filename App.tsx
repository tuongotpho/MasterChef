
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogMeal from './pages/LogMeal';
import History from './pages/History';
import Settings from './pages/Settings';
import { MealRecord } from './types';
import { fetchDatabaseFromCloud, syncDatabaseToCloud } from './services/blobService';

const App: React.FC = () => {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Khởi tạo: Lấy từ máy trước, sau đó thử lấy từ Cloud
  useEffect(() => {
    const localData = localStorage.getItem('cheflog_meals');
    if (localData) {
      setMeals(JSON.parse(localData));
    }
    
    // Thử đồng bộ từ Cloud nếu có Token
    if (localStorage.getItem('cheflog_blob_token')) {
      handleCloudSync();
    }
  }, []);

  const handleCloudSync = async () => {
    setIsSyncing(true);
    const cloudMeals = await fetchDatabaseFromCloud();
    if (cloudMeals && Array.isArray(cloudMeals)) {
      // Hợp nhất dữ liệu (ưu tiên cái mới hơn dựa trên ID hoặc timestamp)
      // Ở đây dùng cách đơn giản: nếu Cloud có thì ghi đè Local để đồng bộ hoàn toàn
      setMeals(cloudMeals);
      localStorage.setItem('cheflog_meals', JSON.stringify(cloudMeals));
    }
    setIsSyncing(false);
  };

  const saveMeals = async (newMeals: MealRecord[]) => {
    setMeals(newMeals);
    localStorage.setItem('cheflog_meals', JSON.stringify(newMeals));
    // Tự động đẩy lên Cloud
    await syncDatabaseToCloud(newMeals);
  };

  const addMeal = (meal: MealRecord) => {
    saveMeals([meal, ...meals]);
  };

  const deleteMeal = (id: string) => {
    if(confirm("Xóa món ăn này khỏi cả máy và Cloud?")) {
      saveMeals(meals.filter(m => m.id !== id));
    }
  };

  const importMeals = (importedMeals: MealRecord[]) => {
    saveMeals(importedMeals);
  };

  return (
    <HashRouter>
      <Layout isSyncing={isSyncing}>
        <Routes>
          <Route path="/" element={<Dashboard meals={meals} onDelete={deleteMeal} />} />
          <Route path="/log" element={<LogMeal onSave={addMeal} onTokenSet={handleCloudSync} />} />
          <Route path="/history" element={<History meals={meals} onDelete={deleteMeal} />} />
          <Route path="/settings" element={<Settings meals={meals} onImport={importMeals} onSyncRequest={handleCloudSync} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
