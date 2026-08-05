import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const isMockKey = !apiKey || apiKey === "mock_key_for_development" || apiKey.includes("your_gemini_api_key");

export const genAI = !isMockKey ? new GoogleGenAI({ apiKey }) : null;

export const MODEL_TEXT = "gemini-2.5-flash";
export const MODEL_VISION = "gemini-2.5-flash";

export async function generateStructuredAIResponse<T>(
  systemInstruction: string,
  userPrompt: string,
  responseSchema: object,
  validator: (data: unknown) => T,
  mockFallback: () => T,
  imageBuffer?: Buffer,
  imageMimeType?: string
): Promise<{ data: T; rawResponse: any; confidenceScore: number }> {
  if (isMockKey || !genAI) {
    console.log("[Gemini Client] Using intelligent mock fallback response");
    const fallbackData = mockFallback();
    return {
      data: fallbackData,
      rawResponse: fallbackData,
      confidenceScore: (fallbackData as any).overall_confidence_score || (fallbackData as any).confidence_score || 0.88,
    };
  }

  try {
    const contents: any[] = [];
    if (imageBuffer && imageMimeType) {
      contents.push({
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: imageMimeType,
        },
      });
    }
    contents.push({ text: userPrompt });

    const response = await genAI.models.generateContent({
      model: imageBuffer ? MODEL_VISION : MODEL_TEXT,
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty AI response received from Gemini API");
    }

    const parsedJson = JSON.parse(text);
    const validatedData = validator(parsedJson);
    const confidenceScore = (validatedData as any).overall_confidence_score || (validatedData as any).confidence_score || 0.85;

    return {
      data: validatedData,
      rawResponse: parsedJson,
      confidenceScore,
    };
  } catch (error) {
    console.error("[Gemini Client Error]:", error);
    console.log("[Gemini Client] Falling back to intelligent default due to error");
    const fallbackData = mockFallback();
    return {
      data: fallbackData,
      rawResponse: { error: String(error), fallback: fallbackData },
      confidenceScore: 0.70,
    };
  }
}
