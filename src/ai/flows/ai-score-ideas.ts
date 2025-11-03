'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically scoring ideas based on predefined criteria using AI.
 *
 * - aiScoreIdea - A function that handles the idea scoring process.
 * - AiScoreIdeaInput - The input type for the aiScoreIdea function.
 * - AiScoreIdeaOutput - The return type for the aiScoreIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiScoreIdeaInputSchema = z.object({
  ideaName: z.string().describe('The name of the idea.'),
  ideaDescription: z.string().describe('A detailed description of the idea.'),
  criteria: z.array(
    z.object({
      name: z.string().describe('The name of the criterion.'),
      description: z.string().describe('A description of the criterion.'),
    })
  ).describe('A list of criteria to score the idea against.'),
});
export type AiScoreIdeaInput = z.infer<typeof AiScoreIdeaInputSchema>;

const AiScoreIdeaOutputSchema = z.object({
  scores: z.array(
    z.object({
      criterionName: z.string().describe('The name of the criterion.'),
      score: z.number().describe('The AI score for the criterion (0-100).'),
      justification: z.string().describe('The AI justification for the score.'),
    })
  ).describe('A list of scores for each criterion.'),
});
export type AiScoreIdeaOutput = z.infer<typeof AiScoreIdeaOutputSchema>;

export async function aiScoreIdea(input: AiScoreIdeaInput): Promise<AiScoreIdeaOutput> {
  return aiScoreIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiScoreIdeaPrompt',
  input: {schema: AiScoreIdeaInputSchema},
  output: {schema: AiScoreIdeaOutputSchema},
  prompt: `You are an AI expert in evaluating ideas based on provided criteria. For each criterion, provide a score between 0 and 100, and a justification for the score.

Idea Name: {{{ideaName}}}
Idea Description: {{{ideaDescription}}}

Criteria:
{{#each criteria}}
- Name: {{{name}}}
  Description: {{{description}}}
{{/each}}

Scores (as a JSON array of criterionName, score, and justification):
`,
});

const aiScoreIdeaFlow = ai.defineFlow(
  {
    name: 'aiScoreIdeaFlow',
    inputSchema: AiScoreIdeaInputSchema,
    outputSchema: AiScoreIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
