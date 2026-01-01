
export interface MealDetails {
  ingredients: string;
  nutrition: string;
  pros: string;
  cons: string;
}

export interface MealRecord {
  id: string;
  date: string;
  image: string;
  name: string;
  description: string;
  details?: MealDetails;
}
