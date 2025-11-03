'use server';
import { getIdeas } from "@/lib/data";
import { IdeaList } from "@/components/idea-list";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sessionCookie = ''; // TODO: Get from cookies()
  if (!sessionCookie) {
    // This is a simplified check. In a real app, you'd verify the cookie.
    // redirect('/login');
  }
  // This is a placeholder. In a real app, you'd get the user from the session.
  const user = { uid: 'test-user' }; // Placeholder
  
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : null;
  const ideas = getIdeas(user.uid, sort);

  return <IdeaList initialIdeas={ideas} />;
}
