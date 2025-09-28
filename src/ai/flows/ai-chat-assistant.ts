'use server';

/**
 * @fileOverview Implements an AI chat assistant for answering questions about SAP Business One modules and functionalities.
 *
 * - aiChatAssistant - A function that handles the AI chat assistant process.
 * - AIChatAssistantInput - The input type for the aiChatAssistant function.
 * - AIChatAssistantOutput - The return type for the aiChatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatAssistantInputSchema = z.object({
  query: z.string().describe('The user query about SAP Business One.'),
});
export type AIChatAssistantInput = z.infer<typeof AIChatAssistantInputSchema>;

const AIChatAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AIChatAssistantOutput = z.infer<typeof AIChatAssistantOutputSchema>;

export async function aiChatAssistant(input: AIChatAssistantInput): Promise<AIChatAssistantOutput> {
  return aiChatAssistantFlow(input);
}

const getSAPKnowledge = ai.defineTool({
  name: 'getSAPKnowledge',
  description: 'Retrieves information about SAP Business One modules and functionalities from a built-in knowledge base.',
  inputSchema: z.object({
    query: z.string().describe('The query to use when searching the SAP Business One knowledge base.'),
  }),
  outputSchema: z.string().describe('The information retrieved from the SAP Business One knowledge base.'),
},
async (input) => {
  // Placeholder implementation for knowledge retrieval. Replace with actual data source.
  const knowledgeBase: { [key: string]: string } = {
    'sales module': 'The sales module in SAP Business One manages the sales process, from quotations to invoices.',
    'inventory management': 'SAP Business One provides tools for managing inventory levels, tracking stock movements, and performing inventory valuation.',
  };

  const query = input.query.toLowerCase();

  if (knowledgeBase[query]) {
    return knowledgeBase[query];
  } else {
    return 'No specific information found in the knowledge base for this query.';
  }
});

const aiChatAssistantPrompt = ai.definePrompt({
  name: 'aiChatAssistantPrompt',
  tools: [getSAPKnowledge],
  input: {schema: AIChatAssistantInputSchema},
  output: {schema: AIChatAssistantOutputSchema},
  prompt: `You are an AI assistant specialized in answering questions about SAP Business One.

  Use the getSAPKnowledge tool to retrieve information from the SAP Business One knowledge base if the user asks for it.
  Otherwise, rely on your existing knowledge to answer the question.

  User query: {{{query}}}
  Answer:`, // Keep this short and concise.
});

const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistantFlow',
    inputSchema: AIChatAssistantInputSchema,
    outputSchema: AIChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await aiChatAssistantPrompt(input);
    return output!;
  }
);
