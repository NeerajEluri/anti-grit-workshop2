export { SYSTEM_INSTRUCTION } from './cropRecommendation';

export function buildSellingInsightPrompt(cropName: string, state: string, recentPrices: any[]): string {
  return `Crop: ${cropName}
Region: ${state}
Recent Mandi Price History:
${JSON.stringify(recentPrices, null, 2)}

Provide an agricultural market selling time recommendation for ${cropName} in ${state}.
Specify whether the farmer should sell now, wait, or monitor, along with clear economic reasoning.
Respond ONLY with JSON matching the schema.`;
}

export const SELLING_INSIGHT_JSON_SCHEMA = {
  type: "object",
  properties: {
    crop_name: { type: "string" },
    recommendation: { type: "string", enum: ["sell_now","wait","monitor"] },
    reasoning: { type: "string" },
    confidence_score: { type: "number" }
  },
  required: ["crop_name","recommendation","reasoning","confidence_score"]
};
