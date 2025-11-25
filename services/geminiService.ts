import { GoogleGenAI } from "@google/genai";

// Helper to check if API key is effectively present
const hasApiKey = (): boolean => {
  return !!(import.meta.env.VITE_GOOGLE_GENAI_API_KEY || import.meta.env.NEXT_PUBLIC_API_KEY);
};

export const summarizeArticle = async (text: string): Promise<string> => {
  if (!hasApiKey()) {
    return "API Key not configured. Unable to generate summary.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY || import.meta.env.NEXT_PUBLIC_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following article in 3 concise bullet points. Make it engaging:\n\n${text}`,
      config: {
        systemInstruction: "You are a professional news editor assistant. Provide objective, clear summaries.",
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple summary
      }
    });

    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate summary due to a service error.";
  }
};

export const getRelatedTopics = async (text: string): Promise<string[]> => {
  if (!hasApiKey()) return ['News', 'General', 'Global'];

  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY || import.meta.env.NEXT_PUBLIC_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract 5 relevant topic keywords from this text. Return them as a comma-separated list:\n\n${text}`,
    });
    const raw = response.text || "";
    return raw.split(',').map(s => s.trim());
  } catch (e) {
    return ['Trending', 'Latest'];
  }
}
