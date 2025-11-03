'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import type { Score } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function ScoreChart({ scores }: { scores: Score[] }) {
    if (!scores || scores.length === 0) {
        return (
             <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="font-headline">Phân tích điểm AI</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground'>Chưa có điểm nào. Tạo hoặc chỉnh sửa ý tưởng để AI chấm điểm.</p>
                </CardContent>
            </Card>
        )
    }

    const chartData = scores.map(s => ({
        subject: s.criterionName,
        score: s.score,
        fullMark: 100,
    }));

    const chartConfig = {
        score: {
            label: 'Điểm',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline">Phân tích điểm AI</CardTitle>
                <CardDescription>Đánh giá tự động dựa trên các tiêu chí của bạn.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
                    <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
