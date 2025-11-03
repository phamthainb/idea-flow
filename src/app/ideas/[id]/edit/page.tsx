'use server';
import { notFound } from 'next/navigation';
import { getIdeaById } from '@/lib/data';
import { updateIdeaAction } from '@/lib/actions';
import { IdeaForm } from '@/components/idea-form';

// This is a placeholder for user management.
// In a real app, you'd get the user from the session.
const user = { uid: 'test-user' }; // Placeholder

export default async function EditIdeaPage({ params }: { params: { id: string } }) {
  const idea = getIdeaById(user.uid, params.id);

  if (!idea) {
    notFound();
  }

  const updateIdeaWithId = updateIdeaAction.bind(null, idea.id);

  return (
    <div className="max-w-4xl mx-auto">
      <IdeaForm idea={idea} action={updateIdeaWithId} userId={user.uid} />
    </div>
  );
}
