'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting tags for an idea.
 *
 * - aiSuggestTags - A function that handles the idea tags suggestion process.
 * - AiSuggestTagsInput - The input type for the aiSuggestTags function.
 * - AiSuggestTagsOutput - The return type for the aiSuggestTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSuggestTagsInputSchema = z.object({
  ideaDescription: z.string().describe('A detailed description of the idea.'),
});
export type AiSuggestTagsInput = z.infer<typeof AiSuggestTagsInputSchema>;

const AiSuggestTagsOutputSchema = z.object({
  suggestedTags: z.array(z.string()).describe('A list of creative and concise tags for the idea.'),
});
export type AiSuggestTagsOutput = z.infer<typeof AiSuggestTagsOutputSchema>;

export async function aiSuggestTags(input: AiSuggestTagsInput): Promise<AiSuggestTagsOutput> {
  return aiSuggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestTagsPrompt',
  input: {schema: AiSuggestTagsInputSchema},
  output: {schema: AiSuggestTagsOutputSchema},
  prompt: `You are an expert at categorizing products and ideas. Based on the following description, generate a list of 3-5 short, relevant tags or categories for the idea.

Idea Description: {{{ideaDescription}}}

Provide the suggested tags in the output.
Rewrite the tags in the original language.`,
});

const aiSuggestTagsFlow = ai.defineFlow(
  {
    name: 'aiSuggestTagsFlow',
    inputSchema: AiSuggestTagsInputSchema,
    outputSchema: AiSuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
