'use server';

import { generateModuleSummary, type ModuleSummaryInput } from "@/ai/flows/generate-module-summary";
import { generateMindMap, type GenerateMindMapInput } from "@/ai/flows/generate-mind-map";
import { generateProcessFlow, type GenerateProcessFlowInput } from "@/ai/flows/generate-process-flow";
import { aiChatAssistant, type AIChatAssistantInput } from "@/ai/flows/ai-chat-assistant";
import { adminAuth } from "@/firebase/admin";

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

async function createAdminUser(email: string, password_hash: string) {
    const userRecord = await adminAuth.createUser({
        email,
        password: password_hash,
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

    return {
        uid: userRecord.uid,
        email: userRecord.email,
    }
}

export async function setupInitialAdmin() {
    const email = "sanmartinfrancisco8@gmail.com";
    const password = "123456";

    try {
        const user = await adminAuth.getUserByEmail(email).catch(() => null);
        if (user) {
            if (!user.customClaims?.admin) {
                 await adminAuth.setCustomUserClaims(user.uid, { admin: true });
            }
            return { message: "Admin user already exists." };
        }

        const newUser = await createAdminUser(email, password);
        return { message: "Admin user created successfully.", user: newUser };
    } catch (error: any) {
        return { error: `Failed to set up admin user: ${error.message}` };
    }
}
