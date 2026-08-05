export { SYSTEM_INSTRUCTION } from './cropRecommendation';

export function buildChatAssistantPrompt(farmContext: any, history: any[], latestMessage: string): string {
  return `Farm context for this conversation:
${JSON.stringify(farmContext || {}, null, 2)}

Conversation so far (most recent ${history.length} messages):
${history.map(m => `${m.sender.toUpperCase()}: ${m.content}`).join('\n')}

Latest user message: ${latestMessage}

Respond to the farmer's latest message as AgriAdvisor AI. Keep responses concise
(under 150 words unless a longer explanation is explicitly requested), practical, and
grounded in the farm context above. Respond ONLY with JSON matching the schema.`;
}

export const CHAT_ASSISTANT_JSON_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    suggested_follow_up_questions: { type: "array", items: { type: "string" } },
    referenced_topics: { type: "array", items: { type: "string" } }
  },
  required: ["reply","suggested_follow_up_questions","referenced_topics"]
};
