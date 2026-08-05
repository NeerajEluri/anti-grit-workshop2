export { SYSTEM_INSTRUCTION } from './cropRecommendation';

export function buildDiseaseDiagnosisPrompt(farm: any, request: any): string {
  return `A farmer has uploaded a photo of their ${request.crop_name} plant along with the following details:
- Symptom description: ${request.symptom_description}
- Affected area: ${request.affected_area_percent || 15}%
- Days since symptoms first appeared: ${request.days_since_symptoms || 3}
- Farm location/soil context: ${farm.district}, ${farm.state}, soil: ${farm.soil_type}

Analyze the attached image together with the description. Identify the most likely
disease or pest issue, rate its severity, and provide a step-by-step treatment plan
and prevention tips. If the image is unclear or inconclusive, say so honestly and
reflect that in a low confidence_score. Respond ONLY with JSON matching the schema.`;
}

export const DISEASE_DIAGNOSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    diagnosis_name: { type: "string" },
    is_image_clear: { type: "boolean" },
    severity: { type: "string", enum: ["low","moderate","high","critical"] },
    confidence_score: { type: "number" },
    explanation: { type: "string" },
    treatment_plan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          step_number: { type: "integer" },
          action: { type: "string" },
          product_or_method: { type: "string" },
          timing: { type: "string" },
          is_organic_alternative: { type: "boolean" }
        },
        required: ["step_number","action","product_or_method","timing","is_organic_alternative"]
      }
    },
    prevention_tips: { type: "array", items: { type: "string" } }
  },
  required: ["diagnosis_name","is_image_clear","severity","confidence_score","explanation","treatment_plan","prevention_tips"]
};
