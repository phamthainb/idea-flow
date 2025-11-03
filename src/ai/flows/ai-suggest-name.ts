'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a name for an idea.
 *
 * - aiSuggestName - A function that handles the idea name suggestion process.
 * - AiSuggestNameInput - The input type for the aiSuggestName function.
 * - AiSuggestNameOutput - The return type for the aiSuggestName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSuggestNameInputSchema = z.object({
  ideaDescription: z.string().describe('A detailed description of the idea.'),
});
export type AiSuggestNameInput = z.infer<typeof AiSuggestNameInputSchema>;

const AiSuggestNameOutputSchema = z.object({
  suggestedName: z.string().describe('A creative and concise name for the idea.'),
  justification: z.string().describe('A short, one-sentence explanation of why this name is a good fit for the idea.'),
});
export type AiSuggestNameOutput = z.infer<typeof AiSuggestNameOutputSchema>;

export async function aiSuggestName(input: AiSuggestNameInput): Promise<AiSuggestNameOutput> {
  return aiSuggestNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestNamePrompt',
  input: {schema: AiSuggestNameInputSchema},
  output: {schema: AiSuggestNameOutputSchema},
  prompt: `You are an expert at naming products and ideas. Based on the following description, generate a short, creative, and catchy name for the idea. Also, provide a brief, one-sentence justification for why you chose that name.

Idea Description: {{{ideaDescription}}}

Provide the suggested name and the justification in the output.
Rewrite the justification below in the original language.`,
});

const aiSuggestNameFlow = ai.defineFlow(
  {
    name: 'aiSuggestNameFlow',
    inputSchema: AiSuggestNameInputSchema,
    outputSchema: AiSuggestNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
