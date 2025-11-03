import Link from 'next/link';
import type { Idea } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export function IdeaCard({ idea }: { idea: Idea }) {
    const totalScore = idea.scores.reduce((acc, s) => acc + s.score, 0) / (idea.scores.length || 1);

    return (
        <Link href={`/ideas/${idea.id}`} className="block group">
            <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-xl tracking-tight">{idea.name}</CardTitle>
                    <CardDescription className="line-clamp-2 pt-1">{idea.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                     <div className="flex items-baseline gap-2">
                         <span className="font-bold font-headline text-3xl text-primary">{totalScore.toFixed(0)}</span>
                         <span className="text-muted-foreground">/ 100</span>
                     </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-1">
                        {idea.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Chi tiết</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
