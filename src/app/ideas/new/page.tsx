"use client";
import { IdeaForm } from "@/components/idea-form";
import { createIdeaAction } from "@/lib/actions";
import { useUser } from "@/lib/auth";

export default function NewIdeaPage() {
  const { user, signedIn } = useUser();

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <IdeaForm action={createIdeaAction} userId={user.id} />
    </div>
  );
}
