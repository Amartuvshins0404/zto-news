import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Underline from '@tiptap/extension-underline';
import { FontSize, FontWeight, TextStyle } from '../components/EditorExtensions';

interface TiptapViewerProps {
  content: string;
  className?: string;
}

export const TiptapViewer: React.FC<TiptapViewerProps> = ({ content, className = '' }) => {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        // We can disable things we explicitly override if needed, but keeping defaults is mostly fine
        // for viewing unless we need specific node views.
        codeBlock: false, // We use the specific extension
      }),
      TextStyle,
      FontSize,
      FontWeight,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: true }),
      (Table as any).configure({ resizable: false }), // Tables not resizable in view mode
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      CodeBlock,
      Underline,
    ],
    content: content,
  });

  // Update content if prop changes (e.g. loading different article)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
};