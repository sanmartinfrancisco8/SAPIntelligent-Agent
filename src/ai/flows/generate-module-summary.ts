'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating concise summaries of SAP Business One modules and functionalities.
 *
 * @remarks
 * The `generateModuleSummary` function is the entry point for this flow.
 * It takes a `ModuleSummaryInput` object as input and returns a `ModuleSummaryOutput` object containing the generated summary.
 *
 * @exports generateModuleSummary - The main function to generate a module summary.
 * @exports ModuleSummaryInput - The input type for the `generateModuleSummary` function.
 * @exports ModuleSummaryOutput - The output type for the `generateModuleSummary` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @interface ModuleSummaryInput
 * @description Defines the input schema for the module summary generation.
 * @param {string} moduleName - The name of the SAP Business One module.
 * @param {string} functionalityDescription - A description of the functionality within the module.
 */
const ModuleSummaryInputSchema = z.object({
  moduleName: z.string().describe('The name of the SAP Business One module.'),
  functionalityDescription: z
    .string()
    .describe('A description of the functionality within the module.'),
});
export type ModuleSummaryInput = z.infer<typeof ModuleSummaryInputSchema>;

/**
 * @interface ModuleSummaryOutput
 * @description Defines the output schema for the module summary generation.
 * @param {string} summary - A concise summary of the module and its functionality.
 */
const ModuleSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the module and its functionality.'),
});
export type ModuleSummaryOutput = z.infer<typeof ModuleSummaryOutputSchema>;

/**
 * @async
 * @function generateModuleSummary
 * @description Generates a concise summary of a given SAP Business One module and functionality.
 * @param {ModuleSummaryInput} input - The input containing the module name and functionality description.
 * @returns {Promise<ModuleSummaryOutput>} A promise that resolves to the generated module summary.
 */
export async function generateModuleSummary(input: ModuleSummaryInput): Promise<ModuleSummaryOutput> {
  return generateModuleSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moduleSummaryPrompt',
  input: {
    schema: ModuleSummaryInputSchema,
  },
  output: {
    schema: ModuleSummaryOutputSchema,
  },
  prompt: `You are an expert in SAP Business One. Please provide a concise summary of the following module and functionality:

Module Name: {{{moduleName}}}
Functionality Description: {{{functionalityDescription}}}

Summary:`,
});

const generateModuleSummaryFlow = ai.defineFlow(
  {
    name: 'generateModuleSummaryFlow',
    inputSchema: ModuleSummaryInputSchema,
    outputSchema: ModuleSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
