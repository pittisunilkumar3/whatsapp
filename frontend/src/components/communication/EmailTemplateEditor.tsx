import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '../ui/Button';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface EmailTemplateEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
	content,
	onChange,
	placeholder = 'Write your email content here...'
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({ placeholder })
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		}
	});

	if (!editor) return null;

	return (
		<div className="border rounded-lg overflow-hidden">
			<div className="border-b bg-gray-50 p-2 sm:p-3 flex flex-wrap gap-2">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`p-2.5 touch-manipulation ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
				>
					<Bold className="w-5 h-5" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`p-2.5 touch-manipulation ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
				>
					<Italic className="w-5 h-5" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`p-2.5 touch-manipulation ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
				>
					<List className="w-5 h-5" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`p-2.5 touch-manipulation ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
				>
					<ListOrdered className="w-5 h-5" />
				</Button>
			</div>
			<EditorContent 
				editor={editor} 
				className="p-3 sm:p-4 min-h-[200px] prose max-w-none text-base"
			/>
		</div>
	);
};