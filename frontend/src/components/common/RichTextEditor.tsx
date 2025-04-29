'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: value || '',
        immediatelyRender: false,
            onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) return null;

    const btn = (active: boolean) => `p-2 rounded-md hover:bg-gray-200 ${active ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}`;

    return (
        <div className="mt-1 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-1 border-b bg-gray-50 p-2">
                <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold size={16} />
                </button>
                <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic size={16} />
                </button>
                <button type="button" className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <UnderlineIcon size={16} />
                </button>
                <div className="mx-2 h-5 w-px bg-gray-300" />
                <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List size={16} />
                </button>
                <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered size={16} />
                </button>
            </div>

            <EditorContent
                editor={editor}
                className="p-3 text-sm min-h-[80px] focus:outline-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
            />
        </div>
    );
}
