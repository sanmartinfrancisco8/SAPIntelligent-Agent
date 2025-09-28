'use server';

/**
 * @fileOverview A process flow diagram generator AI agent.
 *
 * - generateProcessFlow - A function that handles the process flow diagram generation process.
 * - GenerateProcessFlowInput - The input type for the generateProcessFlow function.
 * - GenerateProcessFlowOutput - The return type for the generateProcessFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProcessFlowInputSchema = z.object({
  functionality: z
    .string()
    .describe('The selected functionality for which to generate the process flow diagram.'),
});
export type GenerateProcessFlowInput = z.infer<typeof GenerateProcessFlowInputSchema>;

const GenerateProcessFlowOutputSchema = z.object({
  diagramDataUri: z
    .string()
    .describe(
      'A data URI containing the visual diagram illustrating the process flow and document traceability. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Changed to data URI format
    ),
});
export type GenerateProcessFlowOutput = z.infer<typeof GenerateProcessFlowOutputSchema>;

export async function generateProcessFlow(
  input: GenerateProcessFlowInput
): Promise<GenerateProcessFlowOutput> {
  return generateProcessFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProcessFlowPrompt',
  input: {schema: GenerateProcessFlowInputSchema},
  output: {schema: GenerateProcessFlowOutputSchema},
  prompt: `You are an expert in creating visual diagrams for process flows and document traceability.

  Based on the selected functionality, generate a visual diagram that illustrates the process flow and document traceability.

  Functionality: {{{functionality}}}

  Return the diagram as a data URI.
  `,
});

const generateProcessFlowFlow = ai.defineFlow(
  {
    name: 'generateProcessFlowFlow',
    inputSchema: GenerateProcessFlowInputSchema,
    outputSchema: GenerateProcessFlowOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `Create a visual diagram illustrating the process flow and document traceability for the following functionality: ${input.functionality}. Return the diagram as a data URI.`, // Changed to data URI format
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {diagramDataUri: media!.url!};
  }
);
