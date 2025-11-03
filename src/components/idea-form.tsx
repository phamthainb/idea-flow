'use client';

import { useEffect, useState, useActionState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Criterion, Idea } from '@/lib/types';
import { suggestNameAction, suggestTagsAction, rewriteDescriptionAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Sparkles, Loader2, PenLine } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { RichTextEditor } from './rich-text-editor';
import type { Editor } from '@tiptap/react';

const defaultCriteria: Criterion[] = [
  {
    id: 'Problem Fit',
    name: 'Problem Fit',
    description: 'Có giải quyết vấn đề thật, người dùng có cần và chịu trả tiền không.',
    placeholder: [
      'Vấn đề này có nằm trong top 3 vấn đề cấp bách của người dùng không?',
      'Người dùng có đang chủ động tìm kiếm giải pháp cho vấn đề này không?',
      'Người dùng có sẵn sàng trả tiền để giải quyết vấn đề này ngay lập tức không?',
      'Đã có ai thử giải quyết vấn đề này nhưng thất bại chưa?',
      'Nếu giải quyết được, nó có mang lại giá trị rõ rệt (tiết kiệm thời gian, tiền bạc) cho người dùng không?',
    ]
  },
  {
    id: 'Solution Fit',
    name: 'Solution Fit',
    description: 'Cách giải quyết có khác biệt, khả thi và làm MVP nhanh không.',
    placeholder: [
      'Giải pháp của bạn có dễ sử dụng hơn ít nhất 10 lần so với cách hiện tại không?',
      'Có thể xây dựng một phiên bản MVP trong vòng 1-3 tháng không?',
      'Giải pháp có tạo ra một lợi thế cạnh tranh khó sao chép không?',
      'Người dùng có thể nhận thấy giá trị của giải pháp ngay trong lần sử dụng đầu tiên không?',
      'Giải pháp có khả năng tích hợp hoặc mở rộng với các công cụ khác không?',
    ]
  },
  {
    id: 'Market Fit',
    name: 'Market Fit',
    description: 'Thị trường đủ lớn, có khoảng trống và cạnh tranh chấp nhận được không.',
    placeholder: [
      'Dung lượng thị trường có đủ lớn (ví dụ: trên 1 tỷ USD) không?',
      'Tốc độ tăng trưởng của thị trường có trên 20%/năm không?',
      'Có một phân khúc khách hàng cụ thể nào chưa được phục vụ tốt không?',
      'Đối thủ cạnh tranh chính có đang thống trị thị trường một cách tuyệt đối không?',
      'Có rào cản nào (pháp lý, công nghệ) để gia nhập thị trường này không?',
    ]
  },
  {
    id: 'Business Model',
    name: 'Business Model',
    description: 'Có mô hình kiếm tiền rõ và chi phí duy trì hợp lý không.',
    placeholder: [
      'Mô hình doanh thu có đơn giản và dễ hiểu không (ví dụ: thuê bao, theo giao dịch)?',
      'Chi phí thu hút một khách hàng mới (CAC) có thấp hơn giá trị trọn đời của khách hàng (LTV) ít nhất 3 lần không?',
      'Có khả năng tạo ra nguồn doanh thu định kỳ (recurring revenue) không?',
      'Biên lợi nhuận gộp có trên 70% không?',
      'Có thể đạt điểm hòa vốn trong vòng 2-3 năm không?',
    ]
  },
  {
    id: 'Technical Fit',
    name: 'Technical Fit',
    description: 'Có đủ năng lực, nguồn lực và công nghệ để triển khai không.',
    placeholder: [
      'Đội ngũ có đủ kinh nghiệm và chuyên môn để xây dựng sản phẩm cốt lõi không?',
      'Công nghệ cần thiết để xây dựng sản phẩm có sẵn có và khả thi không?',
      'Có thể xây dựng một nguyên mẫu (prototype) hoạt động được trong vài tuần không?',
      'Sản phẩm có yêu cầu về hạ tầng hoặc chi phí vận hành đặc biệt phức tạp không?',
      'Có cần phải đăng ký bằng sáng chế hay sở hữu trí tuệ đặc biệt nào không?',
    ]
  },
];


type IdeaFormProps = {
  idea?: Idea;
  action: (prevState: any, formData: FormData) => Promise<any>;
  userId: string;
};

// Helper to strip HTML tags
const stripHtml = (html: string) => {
  if (typeof document !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  return html.replace(/<[^>]*>?/gm, '');
};

export function IdeaForm({ idea, action, userId }: IdeaFormProps) {
  const [state, formAction] = useActionState(action, { message: '' });
  const { toast } = useToast();
  const [isSuggestingName, startNameSuggestionTransition] = useTransition();
  const [isSuggestingTags, startTagsSuggestionTransition] = useTransition();
  const [isRewriting, startRewriteTransition] = useTransition();
  const [nameJustification, setNameJustification] = useState<string | null>(null);


  const [criteria, setCriteria] = useState<Criterion[]>(
    idea?.criteria || defaultCriteria.map(c => ({ ...c, id: crypto.randomUUID() }))
  );

  // States to hold rich text content
  const [description, setDescription] = useState(idea?.description || '');
  const [descriptionEditor, setDescriptionEditor] = useState<Editor | null>(null);
  const [name, setName] = useState(idea?.name || '');
  const [nameEditor, setNameEditor] = useState<Editor | null>(null);
  const [tags, setTags] = useState(idea?.tags?.join(', ') || '');
  const [tagsEditor, setTagsEditor] = useState<Editor | null>(null);
  
  const [criteriaContent, setCriteriaContent] = useState<Record<string, { name: string, description: string }>>(
    criteria.reduce((acc, c) => {
      acc[c.id] = { 
        name: c.name, 
        description: idea ? c.description : '' // Use existing description or empty for new
      };
      return acc;
    }, {} as Record<string, { name: string, description: string }>)
  );


  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        variant: state.errors ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  const handleSuggestName = () => {
    startNameSuggestionTransition(async () => {
      setNameJustification(null);
      const result = await suggestNameAction(description);
      if (result.error) {
        toast({
          title: 'Lỗi',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.suggestedName && nameEditor) {
        // Use the editor instance to update content
        nameEditor.commands.setContent(result.suggestedName);
        setName(result.suggestedName);
        if (result.justification) {
          setNameJustification(result.justification);
        }
        toast({
          title: 'Đã gợi ý tên!',
          description: `AI đã đề xuất tên: "${result.suggestedName}"`,
        });
      }
    });
  };

  const handleSuggestTags = () => {
    startTagsSuggestionTransition(async () => {
      const result = await suggestTagsAction(description);
      if (result.error) {
        toast({
          title: 'Lỗi',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.suggestedTags && tagsEditor) {
        const tagsString = result.suggestedTags.join(', ');
        tagsEditor.commands.setContent(tagsString);
        setTags(tagsString);
        toast({
          title: 'Đã gợi ý tags!',
          description: `AI đã đề xuất: "${tagsString}"`,
        });
      }
    });
  };

  const handleRewriteDescription = () => {
    startRewriteTransition(async () => {
      const result = await rewriteDescriptionAction(description);
      if (result.error) {
        toast({
          title: 'Lỗi',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.rewrittenDescription && descriptionEditor) {
        descriptionEditor.commands.setContent(result.rewrittenDescription);
        setDescription(result.rewrittenDescription);
        toast({
          title: 'Đã viết lại mô tả!',
          description: 'AI đã cải thiện mô tả của bạn.',
        });
      }
    });
  };

  const handleAddCriterion = () => {
    const newId = crypto.randomUUID();
    setCriteria([...criteria, { id: newId, name: 'Tên tiêu chí, ví dụ: Market Fit', description: '', placeholder: [
      'Câu hỏi 1?',
      'Câu hỏi 2?',
      'Câu hỏi 3?',
      'Câu hỏi 4?',
      'Câu hỏi 5?',
    ] }]);
    setCriteriaContent(prev => ({ ...prev, [newId]: { name: '', description: '' } }));
  };

  const handleRemoveCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    setCriteriaContent(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleCriterionChange = (id: string, field: 'name' | 'description', value: string) => {
    setCriteriaContent(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const customAction = (formData: FormData) => {
    formData.set('description', description);
    formData.set('name', name);
    formData.set('tags', tags);
    formData.set('userId', userId);

    const updatedCriteria = criteria.map(c => ({
      ...c,
      name: criteriaContent[c.id]?.name || c.name,
      description: criteriaContent[c.id]?.description || c.description
    }));
    formData.set('criteria', JSON.stringify(updatedCriteria));

    formAction(formData);
  }

  return (
    <form action={customAction} className="space-y-8">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{idea ? 'Chỉnh sửa ý tưởng' : 'Tạo ý tưởng mới'}</CardTitle>
          <CardDescription>Điền thông tin bên dưới để ghi lại điều tuyệt vời tiếp theo của bạn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Tên ý tưởng</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSuggestName}
                disabled={isSuggestingName}
                className="gap-2"
              >
                {isSuggestingName ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                )}
                AI
              </Button>
            </div>
            <RichTextEditor
              name="name"
              defaultValue={name}
              onUpdate={({ editor }) => setName(editor.getHTML())}
              getEditor={setNameEditor}
              placeholder="Ví dụ: Đầu bếp cá nhân được hỗ trợ bởi AI"
              editorClassName="min-h-[40px]"
            />
            {nameJustification && (
              <p className="text-sm text-muted-foreground italic px-1">
                {nameJustification}
              </p>
            )}
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRewriteDescription}
                disabled={isRewriting}
                className="gap-2"
              >
                {isRewriting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PenLine className="h-4 w-4 text-blue-400" />
                )}
                AI
              </Button>
            </div>
            <RichTextEditor
              name="description"
              defaultValue={description}
              onUpdate={({ editor }) => setDescription(editor.getHTML())}
              getEditor={setDescriptionEditor}
              placeholder="Mô tả vấn đề, giải pháp và đối tượng mục tiêu..."
            />
            {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tags">Tags / Danh mục</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSuggestTags}
                disabled={isSuggestingTags}
                className="gap-2"
              >
                {isSuggestingTags ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                )}
                AI
              </Button>
            </div>
            <RichTextEditor
              name="tags"
              defaultValue={tags}
              onUpdate={({ editor }) => setTags(editor.getHTML())}
              getEditor={setTagsEditor}
              placeholder="Ví dụ: SaaS, Sức khỏe, AI (phân cách bằng dấu phẩy)"
              editorClassName="min-h-[40px]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Các tiêu chí đánh giá</h3>
            <div className="space-y-4">
              {criteria.map((criterion) => {
                 const defaultCrit = defaultCriteria.find(c => c.name === stripHtml(criterion.name));
                 const placeholder = criterion.placeholder?.join('\n') || defaultCrit?.placeholder?.join('\n');
                return (
                  <div key={criterion.id} className="relative space-y-2 rounded-lg border bg-muted/50 p-4">
                    <div className="absolute top-[-2px] right-[-2px]">
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCriterion(criterion.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <RichTextEditor
                        name={`criterion-name-${criterion.id}`}
                        defaultValue={criterion.name}
                        onUpdate={({ editor }) => handleCriterionChange(criterion.id, 'name', editor.getHTML())}
                        placeholder="Tên tiêu chí"
                        showEditButton={false}
                        editorClassName="min-h-[40px] bg-transparent font-medium border-0 text-base"
                      />
                    </div>
                     <p className="text-xs text-muted-foreground px-3.5 -mt-2">
                      {defaultCrit?.description}
                    </p>
                    <div>
                      <RichTextEditor
                        name={`criterion-desc-${criterion.id}`}
                        defaultValue={criteriaContent[criterion.id]?.description}
                        onUpdate={({ editor }) => handleCriterionChange(criterion.id, 'description', editor.getHTML())}
                        placeholder={placeholder}
                        editorClassName="min-h-[120px]"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {state.errors?.criteria && <p className="text-sm font-medium text-destructive">{state.errors.criteria[0]}</p>}
            <Button type="button" variant="outline" onClick={handleAddCriterion}>
              <Plus className="mr-2 h-4 w-4" /> Thêm tiêu chí
            </Button>
          </div>

          <div className="flex justify-end">
            <SubmitButton size="lg">{idea ? 'Cập nhật ý tưởng' : 'Tạo & Chấm điểm'}</SubmitButton>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
