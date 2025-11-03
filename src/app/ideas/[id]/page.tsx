'use server';
import { notFound } from 'next/navigation';
import { getIdeaById } from '@/lib/data';
import { IdeaDetail } from '@/components/idea-detail';

// This is a placeholder for user management.
// In a real app, you'd get the user from the session.
const user = { id: 'demo-user' }; // Placeholder

export default async function IdeaDetailPage({ params }: { params: { id: string } }) {
  
  const idea = getIdeaById(user.id, params.id);

  if (!idea) {
    notFound();
  }

  return <IdeaDetail idea={idea} />;
}
