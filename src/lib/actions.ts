'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addIdea, updateIdea } from './data';
import { aiScoreIdea } from '@/ai/flows/ai-score-ideas';
import { aiSuggestName } from '@/ai/flows/ai-suggest-name';
import { aiSuggestTags } from '@/ai/flows/ai-suggest-tags';
import { aiRewriteDescription } from '@/ai/flows/ai-rewrite-description';
import type { Criterion } from './types';
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";


// Helper to strip HTML tags
const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

const IdeaSchema = z.object({
  name: z.string().min(1, 'Tên ý tưởng không được để trống').transform(stripHtml),
  description: z.string().min(1, 'Mô tả không được để trống'), // Keep HTML for description
  tags: z.string().transform(stripHtml).optional(),
  criteria: z.string().min(1, 'Phải có ít nhất một tiêu chí'),
  userId: z.string()
});

type FormState = {
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
    tags?: string[];
    criteria?: string[];
  };
};

async function processIdeaForm(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        tags: formData.get('tags'),
        criteria: formData.get('criteria'),
        userId: formData.get('userId'),
    };
    
    const validatedFields = IdeaSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
        success: false,
        formState: {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Vui lòng điền đầy đủ thông tin.',
        },
        data: null,
        };
    }

    const { name, description, tags, userId } = validatedFields.data;
    let criteria: Criterion[] = [];
    try {
        const parsedCriteria = JSON.parse(validatedFields.data.criteria);
        if (!Array.isArray(parsedCriteria) || parsedCriteria.length === 0) {
          throw new Error('Criteria must be a non-empty array.');
        }
        // Sanitize criteria content
        criteria = parsedCriteria.map(c => ({
          ...c,
          name: stripHtml(c.name || ''),
          description: c.description // Keep HTML for criterion description
        }));

    } catch (e) {
        return { 
        success: false,
        formState: { message: 'Định dạng tiêu chí không hợp lệ.' },
        data: null
        };
    }
    
    const aiResult = await aiScoreIdea({
        ideaName: name,
        ideaDescription: stripHtml(description), // Send stripped HTML to AI
        criteria: criteria.map(c => ({ name: c.name, description: stripHtml(c.description) })),
    });

    const ideaData = {
        name,
        description,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        criteria,
        scores: aiResult.scores,
        userId
    };

    return { success: true, data: ideaData, formState: {} };
}


export async function createIdeaAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const { success, data, formState } = await processIdeaForm(formData);

  if (!success || !data) {
    return formState;
  }

  const { userId, ...ideaPayload } = data;

  const newIdea = addIdea(userId, ideaPayload);

  revalidatePath('/');
  revalidatePath(`/ideas/${newIdea.id}`);
  redirect(`/ideas/${newIdea.id}`);
}


export async function updateIdeaAction(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
    const { success, data, formState } = await processIdeaForm(formData);

    if (!success || !data) {
        return formState;
    }

    const { userId, ...ideaPayload } = data;

    const updated = updateIdea(userId, id, ideaPayload);

    if (!updated) {
        return { message: 'Failed to update idea.' };
    }

    revalidatePath('/');
    revalidatePath(`/ideas/${id}`);
    redirect(`/ideas/${id}`);
}

export async function suggestNameAction(description: string): Promise<{ suggestedName?: string; justification?: string; error?: string; }> {
  if (!description || stripHtml(description).trim().length < 10) {
    return { error: 'Vui lòng nhập mô tả chi tiết hơn (ít nhất 10 ký tự) để AI có thể gợi ý tên.' };
  }

  try {
    const result = await aiSuggestName({ ideaDescription: stripHtml(description) });
    return { suggestedName: result.suggestedName, justification: result.justification };
  } catch (error) {
    console.error('AI name suggestion failed:', error);
    return { error: 'Không thể gợi ý tên vào lúc này. Vui lòng thử lại sau.' };
  }
}

export async function suggestTagsAction(description: string): Promise<{ suggestedTags?: string[]; error?: string; }> {
  if (!description || stripHtml(description).trim().length < 10) {
    return { error: 'Vui lòng nhập mô tả chi tiết hơn (ít nhất 10 ký tự) để AI có thể gợi ý tags.' };
  }

  try {
    const result = await aiSuggestTags({ ideaDescription: stripHtml(description) });
    return { suggestedTags: result.suggestedTags };
  } catch (error) {
    console.error('AI tags suggestion failed:', error);
    return { error: 'Không thể gợi ý tags vào lúc này. Vui lòng thử lại sau.' };
  }
}

export async function rewriteDescriptionAction(description: string): Promise<{ rewrittenDescription?: string; error?: string; }> {
  if (!description || stripHtml(description).trim().length < 10) {
    return { error: 'Vui lòng nhập mô tả chi tiết hơn (ít nhất 10 ký tự) để AI có thể viết lại.' };
  }

  try {
    const result = await aiRewriteDescription({ description });
    return { rewrittenDescription: result.rewrittenDescription };
  } catch (error) {
    console.error('AI description rewrite failed:', error);
    return { error: 'Không thể viết lại mô tả vào lúc này. Vui lòng thử lại sau.' };
  }
}
