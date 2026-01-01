
import { GoogleGenAI, Type } from "@google/genai";
import { MealAnalysis, MealRecord, Suggestion } from "../types";

export const analyzeMealImage = async (base64Image: string): Promise<MealAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Sử dụng mô hình Flash cho tốc độ xử lý nhanh và phù hợp với gói miễn phí
  const model = "gemini-3-flash-preview";
  
  const prompt = `Bạn là một chuyên gia dinh dưỡng và đầu bếp chuyên nghiệp cho bếp ăn công nghiệp. 
  Hãy phân tích hình ảnh bữa ăn này và trả về kết quả dưới định dạng JSON.
  Bao gồm: tên món ăn, danh sách nguyên liệu ước tính, tóm tắt dinh dưỡng (calo, protein, xơ), đánh giá từ 1-5 sao, ưu điểm và nhược điểm về mặt cân bằng dinh dưỡng cho công nhân lao động.`;

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(',')[1] || base64Image
    }
  };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          nutritionSummary: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["dishName", "ingredients", "nutritionSummary", "rating", "pros", "cons"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as MealAnalysis;
};

export const getMenuSuggestions = async (history: MealRecord[]): Promise<Suggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Chuyển sang Flash để tối ưu hóa việc sử dụng API miễn phí
  const model = "gemini-3-flash-preview";
  
  const historyText = history.slice(-7).map(m => `${m.date}: ${m.name}`).join('\n');
  
  const prompt = `Dựa trên lịch sử các món ăn đã nấu gần đây:
  ${historyText}
  
  Hãy gợi ý thực đơn cho 3 ngày tiếp theo để đảm bảo tính đa dạng (không trùng món), đầy đủ dinh dưỡng cho công nhân (nhiều năng lượng, protein) và tối ưu chi phí.
  Trả về danh sách 3 gợi ý dưới định dạng JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      // Giảm thinkingBudget cho mô hình Flash để tiết kiệm tài nguyên và giảm độ trễ
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            breakfast: { type: Type.STRING },
            lunch: { type: Type.STRING },
            dinner: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["day", "breakfast", "lunch", "dinner", "reasoning"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]") as Suggestion[];
};
