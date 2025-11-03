"use client";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";
import type { Idea } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "Mới nhất", value: "date_desc" },
  { label: "Cũ nhất", value: "date_asc" },
  { label: "Điểm cao nhất", value: "score_desc" },
  { label: "Điểm thấp nhất", value: "score_asc" },
];

export function IdeaList({ initialIdeas }: { initialIdeas: Idea[] }) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");

  const ideas = initialIdeas;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
            Ý tưởng của bạn
          </h1>
          <p className="text-muted-foreground">
            Đây là tất cả những ý tưởng tuyệt vời mà bạn đã ghi lại.
          </p>
        </div>

        <div className="flex items-center gap-2 border p-1 rounded-lg bg-card">
          {sortOptions.map((opt) => (
            <Button
              key={opt.value}
              asChild
              variant={
                (!sort && opt.value === "date_desc") || sort === opt.value
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
            >
              <Link href={`/?sort=${opt.value}`}>{opt.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {ideas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl">
          <h2 className="text-2xl font-bold font-headline mb-2">
            Chưa có ý tưởng nào!
          </h2>
          <p className="text-muted-foreground mb-4">
            Nhấn vào nút bên dưới để thêm ý tưởng đầu tiên của bạn.
          </p>
          <Button asChild>
            <Link href="/ideas/new">+ Ý tưởng mới</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
