export const SYSTEM_INSTRUCTION = `You are AgriAdvisor AI, an expert agricultural agronomist assistant embedded in a
farm-advisory platform used by real farmers to make real planting, treatment, and
financial decisions. Your guidance directly affects crop yield, farmer income, and
food security — treat every response with the rigor of a licensed agronomist.

Rules you must always follow:
1. Ground every recommendation strictly in the farm data, season, soil type, location,
   and any weather or symptom data provided in the user's message. Never invent facts
   about a farm you were not given.
2. Always respond with valid JSON that matches the exact schema provided in the request.
   Never include markdown code fences, prose commentary, or text outside the JSON object.
3. Be conservative and honest about uncertainty. If you are not confident in a diagnosis
   or recommendation, reflect that honestly in the confidence_score field rather than
   guessing with false confidence.
4. Prioritize farmer safety and economic wellbeing: never recommend banned agrochemicals,
   never recommend actions that risk soil degradation without a stated tradeoff, and
   always mention safer/organic alternatives where relevant.
5. Tailor language to be clear and actionable for a non-technical smallholder farmer —
   avoid unnecessary jargon; when a technical term is required, briefly explain it.
6. When information is insufficient to give a safe recommendation, say so explicitly in
   the relevant notes/reasoning field instead of fabricating specifics.
7. Never discuss anything outside agriculture, farming, agronomy, weather-for-farming,
   or agricultural markets. Politely decline unrelated requests within the JSON schema's
   text fields.`;

export function buildCropRecommendationPrompt(farm: any, request: any, weatherSummary: string): string {
  return `Farm Profile:
- Location: ${farm.district}, ${farm.state} (lat: ${farm.latitude || 'N/A'}, lng: ${farm.longitude || 'N/A'})
- Land size: ${farm.land_size_acres} acres
- Soil type: ${farm.soil_type}
- Irrigation source: ${farm.irrigation_source}
- Water availability: ${farm.water_availability}
- Current season: ${farm.current_season}
- Previous crop: ${farm.previous_crop || 'None / Fallow'}

Advisory Request:
- Advisory type: ${request.advisory_type}
- Crop category preference: ${request.crop_category || 'All Categories'}
- Specific crop of interest: ${request.specific_crop || 'None'}
- Budget range: ${request.budget_range || 'Medium'}
- Primary goal: ${request.primary_goal}
- Farmer's additional notes: ${request.additional_notes || 'None'}

Current weather context (if available): ${weatherSummary}

Based on the above, recommend the 3 most suitable crops for this farm this season,
ranked best-first. For each, provide expected yield range, key risks, and a fertilizer
and irrigation schedule outline. Respond ONLY with JSON matching the provided schema.`;
}

export const CROP_RECOMMENDATION_JSON_SCHEMA = {
  type: "object",
  properties: {
    recommended_crops: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          crop_name: { type: "string" },
          rank: { type: "integer" },
          suitability_score: { type: "number" },
          reasoning: { type: "string" },
          expected_yield_range: { type: "string" },
          estimated_duration_days: { type: "integer" },
          risk_factors: { type: "array", items: { type: "string" } }
        },
        required: ["crop_name","rank","suitability_score","reasoning","expected_yield_range","estimated_duration_days","risk_factors"]
      }
    },
    fertilizer_schedule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          crop_name: { type: "string" },
          stage: { type: "string" },
          timing: { type: "string" },
          fertilizer_type: { type: "string" },
          quantity_per_acre: { type: "string" }
        },
        required: ["crop_name","stage","timing","fertilizer_type","quantity_per_acre"]
      }
    },
    irrigation_schedule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          crop_name: { type: "string" },
          growth_stage: { type: "string" },
          frequency: { type: "string" },
          water_amount: { type: "string" }
        },
        required: ["crop_name","growth_stage","frequency","water_amount"]
      }
    },
    overall_confidence_score: { type: "number" },
    advisory_summary: { type: "string" }
  },
  required: ["recommended_crops","fertilizer_schedule","irrigation_schedule","overall_confidence_score","advisory_summary"]
};
