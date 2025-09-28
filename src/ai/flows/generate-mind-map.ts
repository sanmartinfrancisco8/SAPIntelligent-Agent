'use server';

/**
 * @fileOverview Flow to generate interactive mind maps representing the conceptual structure of SAP Business One modules.
 *
 * - generateMindMap - A function that generates the mind map.
 * - GenerateMindMapInput - The input type for the generateMindMap function.
 * - GenerateMindMapOutput - The return type for the generateMindMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMindMapInputSchema = z.object({
  moduleName: z.string().describe('The name of the SAP Business One module to generate a mind map for.'),
});

export type GenerateMindMapInput = z.infer<typeof GenerateMindMapInputSchema>;

const GenerateMindMapOutputSchema = z.object({
  mindMapData: z.string().describe('A string representation of the mind map data, suitable for rendering in a mind map component.'),
});

export type GenerateMindMapOutput = z.infer<typeof GenerateMindMapOutputSchema>;

export async function generateMindMap(input: GenerateMindMapInput): Promise<GenerateMindMapOutput> {
  return generateMindMapFlow(input);
}

const mindMapPrompt = ai.definePrompt({
  name: 'mindMapPrompt',
  input: {schema: GenerateMindMapInputSchema},
  output: {schema: GenerateMindMapOutputSchema},
  prompt: `You are an expert in SAP Business One and mind map creation.

  Generate a mind map representing the conceptual structure of the {{moduleName}} module in SAP Business One. The mind map data should be formatted as a string.

  Ensure the mind map includes key functionalities, sub-modules, and their relationships. The mindmap should be concise and easy to understand.
  `,
});

const generateMindMapFlow = ai.defineFlow(
  {
    name: 'generateMindMapFlow',
    inputSchema: GenerateMindMapInputSchema,
    outputSchema: GenerateMindMapOutputSchema,
  },
  async input => {
    const {output} = await mindMapPrompt(input);
    return output!;
  }
);
