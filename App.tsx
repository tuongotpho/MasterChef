
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogMeal from './pages/LogMeal';
import History from './pages/History';
import Suggestions from './pages/Suggestions';
import { MealRecord } from './types';

const App: React.FC = () => {
  const [meals, setMeals] = useState<MealRecord[]>([]);

  useEffect(() => {
    // Tải dữ liệu từ local storage khi khởi động
    const saved = localStorage.getItem('cheflog_meals');
    if (saved) {
      try {
        setMeals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse meals", e);
      }
    }
  }, []);

  const saveMeals = (newMeals: MealRecord[]) => {
    setMeals(newMeals);
    localStorage.setItem('cheflog_meals', JSON.stringify(newMeals));
  };

  const addMeal = (meal: MealRecord) => {
    const updated = [meal, ...meals];
    saveMeals(updated);
  };

  const deleteMeal = (id: string) => {
    const updated = meals.filter(m => m.id !== id);
    saveMeals(updated);
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard meals={meals} />} />
          <Route path="/log" element={<LogMeal onSave={addMeal} />} />
          <Route path="/history" element={<History meals={meals} onDelete={deleteMeal} />} />
          <Route path="/suggestions" element={<Suggestions meals={meals} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
