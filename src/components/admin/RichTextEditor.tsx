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
  Heading1, Heading2, Heading3, Quote, Undo, Redo,
  Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ENV } from '@/lib/env';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  /** Insere imagem por URL (sempre funciona) */
  const addImageByUrl = () => {
    const url = window.prompt('Cole o link da imagem (https://...):');
    if (!url) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
    toast.success('Imagem inserida no texto');
  };

  /** Upload de arquivo → base64 no modo local, ou Supabase se mock desligado */
  const addImageByUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Modo local: converte para base64 (não depende do Supabase)
      if (ENV.USE_LOCAL_ADMIN_MOCK) {
        if (file.size > 1.5 * 1024 * 1024) {
          toast.error('Imagem muito grande. Use até 1,5 MB ou cole um link.');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          editor.chain().focus().setImage({ src: dataUrl }).run();
          toast.success('Imagem inserida no texto (modo local)');
        };
        reader.onerror = () => toast.error('Erro ao ler a imagem');
        reader.readAsDataURL(file);
        return;
      }

      // Supabase Storage (quando mock estiver desligado)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `post-content/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('news-media-private')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('news-media-private')
          .getPublicUrl(filePath);

        editor.chain().focus().setImage({ src: data.publicUrl }).run();
        toast.success('Imagem inserida no texto');
      } catch (error: any) {
        toast.error('Erro ao subir imagem: ' + error.message);
      }
    };
    input.click();
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
    <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-200 bg-white rounded-t-lg">
      <Toggle size="sm" pressed={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-200 mx-1 self-center" />
      
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-200 mx-1 self-center" />
      
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-200 mx-1 self-center" />
      
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className="w-4 h-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className="w-4 h-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-neutral-200 mx-1 self-center" />
      
      <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-neutral-100' : ''} title="Inserir link">
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={addImageByUrl} title="Inserir imagem por link">
        <Link2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={addImageByUpload} title="Upload de imagem">
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
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
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
        class: 'prose max-w-none min-h-[400px] p-4 focus:outline-none focus:ring-0 overflow-y-auto text-neutral-800',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full border border-neutral-200 rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
