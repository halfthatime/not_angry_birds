
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStickmanCommentary = async (success: boolean, levelName: string) => {
  try {
    const prompt = success 
      ? `A stickman just successfully destroyed a structure in the level "${levelName}". Give a short, funny 1-sentence victory cheer in a sketchy stickman persona.`
      : `A stickman failed to destroy the structure in the level "${levelName}". Give a short, funny 1-sentence sarcastic remark in a sketchy stickman persona.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Stickman power!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return success ? "Boom! Structure down!" : "Missed it by a line...";
  }
};
