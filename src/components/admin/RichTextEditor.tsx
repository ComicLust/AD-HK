"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Youtube } from "@tiptap/extension-youtube";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#007AFF] underline cursor-pointer",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse w-full my-4 border border-[#D1D1D6]",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video rounded-2xl my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[250px] max-h-[450px] overflow-y-auto px-4 py-3 rounded-b-2xl border-x border-b border-[#D1D1D6] bg-white text-sm text-[#1D1D1F] leading-relaxed [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 [&_th]:border [&_th]:border-[#D1D1D6] [&_th]:p-2 [&_th]:bg-slate-50 dark:[&_th]:bg-[#1C1C1E] [&_td]:border [&_td]:border-[#D1D1D6] [&_td]:p-2",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("URL giriniz:");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("YouTube Video URL'si girin:");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      });
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-[#D1D1D6]">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 items-center bg-[#F2F2F7] dark:bg-[#1C1C1E] border-b border-[#D1D1D6] px-3 py-2 select-none">
        {/* Style formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("bold") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Kalın"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("italic") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="İtalik"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("underline") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Altı Çizili"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Başlık 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Başlık 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("bulletList") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Maddeli Liste"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("orderedList") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Numaralı Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("blockquote") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Alıntı"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1" />

        {/* Alignment controls */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive({ textAlign: "left" }) ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Sola Hizala"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive({ textAlign: "center" }) ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Ortala"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive({ textAlign: "right" }) ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Sağa Hizala"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive({ textAlign: "justify" }) ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="İki Yana Yasla"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1" />

        {/* Links, Videos, Tables */}
        <button
          type="button"
          onClick={addLink}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive("link") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
          }`}
          title="Bağlantı Ekle"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Bağlantıyı Kaldır"
        >
          <Unlink className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addYoutubeVideo}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title="YouTube Video Ekle"
        >
          <YoutubeIcon className="w-4 h-4 text-red-500" />
        </button>

        {/* Dynamic Table Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-0.5 ${
                editor.isActive("table") ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white" : ""
              }`}
              title="Tablo İşlemleri"
            >
              <TableIcon className="w-4 h-4 text-[#007AFF]" />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="rounded-xl p-1 bg-white dark:bg-[#1C1C1E] border border-border shadow-md">
            <DropdownMenuItem onClick={addTable} className="text-xs font-semibold px-2 py-1.5 rounded-lg cursor-pointer">Tablo Ekle (3x3)</DropdownMenuItem>
            {editor.isActive("table") && (
              <>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()} className="text-xs px-2 py-1.5 rounded-lg cursor-pointer">Sola Sütun Ekle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-xs px-2 py-1.5 rounded-lg cursor-pointer">Sağa Sütun Ekle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()} className="text-xs px-2 py-1.5 rounded-lg cursor-pointer text-red-500">Sütun Sil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()} className="text-xs px-2 py-1.5 rounded-lg cursor-pointer">Üste Satır Ekle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()} className="text-xs px-2 py-1.5 rounded-lg cursor-pointer">Alta Satır Ekle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()} className="text-xs px-2 py-1.5 rounded-lg cursor-pointer text-red-500">Satır Sil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} className="text-xs px-2 py-1.5 rounded-lg cursor-pointer text-red-500 font-bold">Tabloyu Sil</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Geri Al"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
          title="İleri Al"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
