'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

type ToolbarProps = {
  editor: Editor | null;
  isVisible: boolean;
};

const Toolbar = ({ editor, isVisible }: ToolbarProps) => {
  if (!editor || !isVisible) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 border-b p-2">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  onUpdate?: ({ editor }: { editor: Editor }) => void;
  getEditor?: (editor: Editor) => void;
  editorClassName?: string;
  showEditButton?: boolean;
};

export function RichTextEditor({ name, defaultValue, placeholder, onUpdate, getEditor, editorClassName, showEditButton = true }: RichTextEditorProps) {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // No heading for a cleaner experience
        heading: false,
        bulletList: {
            HTMLAttributes: {
                class: 'list-disc pl-4',
            },
        },
        orderedList: {
            HTMLAttributes: {
                class: 'list-decimal pl-4',
            },
        }
      }),
    ],
    content: defaultValue || '',
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate({ editor });
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert',
          'min-h-[120px] w-full max-w-full rounded-b-md p-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0',
          editorClassName
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && getEditor) {
      getEditor(editor);
    }
  }, [editor, getEditor]);
  
  useEffect(() => {
    if (editor && defaultValue !== editor.getHTML()) {
      editor.commands.setContent(defaultValue || '', false);
    }
  }, [defaultValue, editor]);


  return (
    <div className={cn(
        "relative rounded-md border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        editorClassName?.includes('border-0') && 'border-0 focus-within:ring-0'
    )}>
      <input type="hidden" name={name} value={editor?.getHTML() || ''} />
      <Toolbar editor={editor} isVisible={isToolbarVisible} />
      <EditorContent editor={editor} placeholder={placeholder} />
      {showEditButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1 h-7 w-7 text-muted-foreground"
          onClick={() => setIsToolbarVisible(!isToolbarVisible)}
        > 
        <Edit className="h-4 w-4" />
      </Button>)}
    </div>
  );
}
