'use client';
import { createIdeaAction } from '@/lib/actions';
import { IdeaForm } from '@/components/idea-form';
import { useUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function NewIdeaPage() {
  const { user, signedIn } = useUser();

  // if (signedIn === false) {
  //   redirect('/');
  // }

  if (!user) {
    return <div>Đang tải...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <IdeaForm action={createIdeaAction} userId={user.id} />
    </div>
  );
}
