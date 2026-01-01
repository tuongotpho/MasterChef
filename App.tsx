
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogMeal from './pages/LogMeal';
import History from './pages/History';
import { MealRecord } from './types';

const App: React.FC = () => {
  const [meals, setMeals] = useState<MealRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cheflog_meals');
    if (saved) {
      try {
        setMeals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse", e);
      }
    }
  }, []);

  const saveMeals = (newMeals: MealRecord[]) => {
    setMeals(newMeals);
    localStorage.setItem('cheflog_meals', JSON.stringify(newMeals));
  };

  const addMeal = (meal: MealRecord) => {
    saveMeals([meal, ...meals]);
  };

  const deleteMeal = (id: string) => {
    saveMeals(meals.filter(m => m.id !== id));
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard meals={meals} onDelete={deleteMeal} />} />
          <Route path="/log" element={<LogMeal onSave={addMeal} />} />
          <Route path="/history" element={<History meals={meals} onDelete={deleteMeal} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
