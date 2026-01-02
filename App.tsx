
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogMeal from './pages/LogMeal';
import History from './pages/History';
import Settings from './pages/Settings';
import { MealRecord } from './types';
import { initAuth, subscribeToMeals, deleteMealFromCloud } from './services/firebaseService';

const App: React.FC = () => {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Khởi tạo Auth
    initAuth().then(user => {
      setUserId(user.uid);
      
      // 2. Lắng nghe dữ liệu thời gian thực từ Firestore
      const unsubscribe = subscribeToMeals(user.uid, (cloudMeals) => {
        setMeals(cloudMeals);
        setIsSyncing(false);
        localStorage.setItem('cheflog_meals', JSON.stringify(cloudMeals));
      });

      return () => unsubscribe();
    }).catch(err => {
      console.error("Firebase Auth Error:", err);
      setIsSyncing(false);
    });
  }, []);

  const deleteMeal = async (id: string) => {
    const mealToDelete = meals.find(m => m.id === id);
    if (mealToDelete) {
      try {
        await deleteMealFromCloud(mealToDelete);
      } catch (e) {
        alert("Lỗi khi xóa món ăn khỏi Cloud");
      }
    }
  };

  return (
    <HashRouter>
      <Layout isSyncing={isSyncing}>
        <Routes>
          <Route path="/" element={<Dashboard meals={meals} onDelete={deleteMeal} />} />
          <Route path="/log" element={<LogMeal userId={userId} />} />
          <Route path="/history" element={<History meals={meals} onDelete={deleteMeal} />} />
          <Route path="/settings" element={<Settings meals={meals} userId={userId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
