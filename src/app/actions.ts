"use server";

import { generateModuleSummary, type ModuleSummaryInput } from "@/ai/flows/generate-module-summary";
import { generateMindMap, type GenerateMindMapInput } from "@/ai/flows/generate-mind-map";
import { generateProcessFlow, type GenerateProcessFlowInput } from "@/ai/flows/generate-process-flow";
import { aiChatAssistant, type AIChatAssistantInput } from "@/ai/flows/ai-chat-assistant";

export async function getModuleSummary(input: ModuleSummaryInput) {
  const result = await generateModuleSummary(input);
  return result.summary;
}

export async function getMindMap(input: GenerateMindMapInput) {
  const result = await generateMindMap(input);
  return result.mindMapData;
}

export async function getProcessFlow(input: GenerateProcessFlowInput) {
  const result = await generateProcessFlow(input);
  return result.diagramDataUri;
}

export async function getChatResponse(input: AIChatAssistantInput) {
  const result = await aiChatAssistant(input);
  return result.answer;
}
