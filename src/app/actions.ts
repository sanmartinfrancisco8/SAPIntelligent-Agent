'use server';

import { generateModuleSummary, type ModuleSummaryInput } from "@/ai/flows/generate-module-summary";
import { generateMindMap, type GenerateMindMapInput } from "@/ai/flows/generate-mind-map";
import { generateProcessFlow, type GenerateProcessFlowInput } from "@/ai/flows/generate-process-flow";
import { aiChatAssistant, type AIChatAssistantInput } from "@/ai/flows/ai-chat-assistant";
import { adminAuth, adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

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

async function createAdminUser(email: string, password: string, displayName: string) {
  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName,
  });

  await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

  await adminDb
    .collection('users')
    .doc(userRecord.uid)
    .set({
      uid: userRecord.uid,
      displayName,
      email: userRecord.email ?? email,
      role: 'admin',
      approved: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

  return {
    uid: userRecord.uid,
    email: userRecord.email ?? email,
  };
}

export async function setupInitialAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL ?? 'sanmartinfrancisco8@gmail.com';
  const password = process.env.INITIAL_ADMIN_PASSWORD ?? '123456';
  const displayName = process.env.INITIAL_ADMIN_NAME ?? 'Administrador';

  try {
    const user = await adminAuth.getUserByEmail(email).catch(() => null);
    if (user) {
      if (!user.customClaims?.admin) {
        await adminAuth.setCustomUserClaims(user.uid, { admin: true });
      }

      const userDocRef = adminDb.collection('users').doc(user.uid);
      const userDoc = await userDocRef.get();
      if (!userDoc.exists) {
        await userDocRef.set({
          uid: user.uid,
          displayName: user.displayName ?? displayName,
          email: user.email ?? email,
          role: 'admin',
          approved: true,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        const data = userDoc.data() ?? {};
        if (data.role !== 'admin' || data.approved !== true) {
          await userDocRef.update({
            role: 'admin',
            approved: true,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }

      return { message: 'Admin user already exists.' };
    }

    const newUser = await createAdminUser(email, password, displayName);
    return { message: 'Admin user created successfully.', user: newUser };
  } catch (error: any) {
    return { error: `Failed to set up admin user: ${error.message}` };
  }
}
