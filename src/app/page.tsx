'use server';
import { IdeaList } from "@/components/idea-list";

export default async function Home() {
  return <IdeaList initialIdeas={[]} />;
}
