'use client';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Pencil } from 'lucide-react';
import type { Idea } from '@/lib/types';
import { ScoreChart } from '@/components/score-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function IdeaDetail({ idea }: { idea: Idea }) {
  const { user, signedIn } = useUser();

  if (signedIn === false) {
    redirect('/login');
  }

  if (!user) {
    return <div>Đang tải...</div>;
  }
  
  // A simple authorization check
  if (idea.userId !== user.uid) {
      // Or redirect to a 403 page
      redirect('/');
  }

  const totalScore = idea.scores.reduce((acc, s) => acc + s.score, 0) / (idea.scores.length || 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">{idea.name}</h1>
          <p className="text-muted-foreground mt-1">
            Tạo ngày {format(new Date(idea.createdAt), 'dd/MM/yyyy')}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {idea.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/ideas/${idea.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Mô tả</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: idea.description }} />
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline">Lý giải của AI</CardTitle>
                <CardDescription>Cách AI chấm điểm ý tưởng của bạn cho từng tiêu chí.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {idea.scores.map((score, index) => (
                    <div key={score.criterionName}>
                        <div className="flex items-baseline gap-4">
                            <h4 className="font-semibold text-lg">{score.criterionName}</h4>
                            <span className="font-bold font-headline text-xl text-primary">{score.score}<span className="text-sm font-sans text-muted-foreground">/100</span></span>
                        </div>
                        <p className="text-muted-foreground mt-1">{score.justification}</p>
                        {index < idea.scores.length - 1 && <Separator className="mt-6" />}
                    </div>
                ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-2xl shadow-sm text-center bg-card">
              <CardHeader>
                  <CardTitle className='font-headline text-muted-foreground'>Điểm tổng thể</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-7xl font-bold font-headline text-primary">{totalScore.toFixed(0)}</p>
                  <p className="text-muted-foreground">trên 100</p>
              </CardContent>
          </Card>
          <ScoreChart scores={idea.scores} />
        </div>
      </div>
    </div>
  );
}
