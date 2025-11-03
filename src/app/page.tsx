"use server";
import { IdeaList } from "@/components/idea-list";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IdeaList initialIdeas={[]} />;
    </Suspense>
  );
}
