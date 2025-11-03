'use server';

/**
 * @fileOverview This file defines a Genkit flow for rewriting an idea description.
 *
 * - aiRewriteDescription - A function that handles rewriting the description.
 * - AiRewriteDescriptionInput - The input type for the aiRewriteDescription function.
 * - AiRewriteDescriptionOutput - The return type for the aiRewriteDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRewriteDescriptionInputSchema = z.object({
  description: z.string().describe('The original description of the idea.'),
});
export type AiRewriteDescriptionInput = z.infer<typeof AiRewriteDescriptionInputSchema>;

const AiRewriteDescriptionOutputSchema = z.object({
  rewrittenDescription: z.string().describe('The rewritten, improved description of the idea.'),
});
export type AiRewriteDescriptionOutput = z.infer<typeof AiRewriteDescriptionOutputSchema>;

export async function aiRewriteDescription(input: AiRewriteDescriptionInput): Promise<AiRewriteDescriptionOutput> {
  return aiRewriteDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRewriteDescriptionPrompt',
  input: {schema: AiRewriteDescriptionInputSchema},
  output: {schema: AiRewriteDescriptionOutputSchema},
  prompt: `You are an expert copywriter and business analyst. Your task is to rewrite the following idea description to make it clearer, more professional, and more compelling.

First, detect the language of the 'Original Description'. Then, rewrite the description in that same language.

Focus on clarifying the problem, solution, and value proposition. Structure the output as clean HTML.

Original Description:
{{{description}}}

Rewrite the description below in the original language.`,
});

const aiRewriteDescriptionFlow = ai.defineFlow(
  {
    name: 'aiRewriteDescriptionFlow',
    inputSchema: AiRewriteDescriptionInputSchema,
    outputSchema: AiRewriteDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
