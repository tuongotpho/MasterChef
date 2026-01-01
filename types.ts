
export interface MealAnalysis {
  dishName: string;
  ingredients: string[];
  nutritionSummary: string;
  rating: number; // 1-5
  pros: string[];
  cons: string[];
}

export interface MealRecord {
  id: string;
  date: string; // ISO string
  image: string; // Base64
  name: string;
  description: string;
  analysis?: MealAnalysis;
}

export interface Suggestion {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  reasoning: string;
}
