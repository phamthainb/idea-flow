'use server';
import { getIdeas } from "@/lib/data";
import { IdeaList } from "@/components/idea-list";

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
  const user = { id: 'demo-user' }; // Placeholder
  
  const sort = typeof searchParams?.sort === 'string' ? searchParams?.sort : null;
  const ideas = getIdeas(user.id, sort);

  return <IdeaList initialIdeas={ideas} />;
}
