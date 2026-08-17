import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, AlignLeft, AlignCenter, 
  AlignRight, Image as ImageIcon, Link as LinkIcon,
  Heading1, Heading2, Quote, Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link:', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-700 bg-neutral-900 rounded-t-lg">
      <Toggle size="sm" pressed={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-700 mx-1 self-center" />
      
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-700 mx-1 self-center" />
      
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-700 mx-1 self-center" />
      
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-700 mx-1 self-center" />
      
      <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-neutral-700' : ''}>
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={addImage}>
        <ImageIcon className="w-4 h-4" />
      </Button>
      
      <div className="flex-grow" />
      
      <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}>
        <Undo className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 mx-auto block',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] p-4 focus:outline-none focus:ring-0 overflow-y-auto',
      },
    },
  });

  // Update editor content when external content changes (e.g. from props or radar)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
