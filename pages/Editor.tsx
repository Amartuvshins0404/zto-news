
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare, Code,
  Edit3,
  Eye,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List, ListOrdered,
  Minus,
  Quote,
  Redo,
  Table as TableIcon,
  Type,
  Underline as UnderlineIcon,
  Undo,
  Upload,
  Youtube
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FontSize, FontWeight, TextStyle } from '../components/EditorExtensions';
import { MediaLibrary } from '../components/MediaLibrary';
import { PostDetailView } from '../components/PostDetailView';
import { Button, Input } from '../components/UI';
import { saveArticle } from '../services/api'; // NEW IMPORTS
import { useTranslation } from '../services/translationService';
import { ContentType } from '../types';

const MenuBar = ({ editor, openMediaLibrary }: { editor: any, openMediaLibrary: () => void }) => {
  if (!editor) return null;
  const { t } = useTranslation();

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableDims, setTableDims] = useState({ rows: 3, cols: 3 });

  const ButtonClass = (isActive: boolean) =>
    `p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400'}`;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt(t('editor_link_prompt'), previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: tableDims.rows, cols: tableDims.cols, withHeaderRow: true }).run();
    setIsTableModalOpen(false);
  };

  const FONT_SIZES = [
    '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px', '96px'
  ];

  const FONT_WEIGHTS = [
    { label: 'Thin (100)', value: '100' },
    { label: 'Extra Light (200)', value: '200' },
    { label: 'Light (300)', value: '300' },
    { label: 'Regular (400)', value: '400' },
    { label: 'Medium (500)', value: '500' },
    { label: 'Semi Bold (600)', value: '600' },
    { label: 'Bold (700)', value: '700' },
    { label: 'Extra Bold (800)', value: '800' },
    { label: 'Black (900)', value: '900' },
  ];

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-neutral-dark sticky top-32 z-30 flex flex-wrap gap-1 items-center shadow-sm rounded-t-xl">
        <div className="flex gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
          <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={ButtonClass(false)} title={t('editor_undo')}><Undo className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={ButtonClass(false)} title={t('editor_redo')}><Redo className="w-4 h-4" /></button>
        </div>
        {/* ... Font options ... */}
        <div className="flex gap-1 px-2 border-r border-gray-200 dark:border-gray-700 items-center">
          <div className="flex items-center mr-2">
            <Type className="w-3 h-3 text-gray-400 mr-1" />
            <select
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300 w-20 cursor-pointer"
              onChange={(e) => (editor.chain().focus() as any).setFontSize(e.target.value).run()}
              value={editor.getAttributes('textStyle').fontSize || '16px'}
              aria-label={t('editor_size')}
            >
              <option value="" disabled>{t('editor_size')}</option>
              {FONT_SIZES.map(size => (<option key={size} value={size}>{size}</option>))}
            </select>
          </div>
          <div className="flex items-center">
            <Bold className="w-3 h-3 text-gray-400 mr-1" />
            <select
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300 w-28 cursor-pointer"
              onChange={(e) => (editor.chain().focus() as any).setFontWeight(e.target.value).run()}
              value={editor.getAttributes('textStyle').fontWeight || '400'}
              aria-label={t('editor_bold')}
            >
              {FONT_WEIGHTS.map(weight => (<option key={weight.value} value={weight.value}>{weight.label}</option>))}
            </select>
          </div>
        </div>
        {/* ... Formatting ... */}
        <div className="flex gap-1 px-2 border-r border-gray-200 dark:border-gray-700">
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={ButtonClass(editor.isActive('italic'))} title={t('editor_italic')}><Italic className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={ButtonClass(editor.isActive('underline'))} title={t('editor_underline')}><UnderlineIcon className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={ButtonClass(editor.isActive('highlight'))} title={t('editor_highlight')}><Highlighter className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleCode().run()} className={ButtonClass(editor.isActive('code'))} title={t('editor_code')}><Code className="w-4 h-4" /></button>
        </div>
        {/* ... Alignment ... */}
        <div className="flex gap-1 px-2 border-r border-gray-200 dark:border-gray-700">
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={ButtonClass(editor.isActive({ textAlign: 'left' }))} title={t('editor_align_left')}><AlignLeft className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={ButtonClass(editor.isActive({ textAlign: 'center' }))} title={t('editor_align_center')}><AlignCenter className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={ButtonClass(editor.isActive({ textAlign: 'right' }))} title={t('editor_align_right')}><AlignRight className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={ButtonClass(editor.isActive({ textAlign: 'justify' }))} title={t('editor_align_justify')}><AlignJustify className="w-4 h-4" /></button>
        </div>
        {/* ... Lists ... */}
        <div className="flex gap-1 px-2 border-r border-gray-200 dark:border-gray-700">
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={ButtonClass(editor.isActive('bulletList'))} title={t('editor_bullet_list')}><List className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={ButtonClass(editor.isActive('orderedList'))} title={t('editor_ordered_list')}><ListOrdered className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={ButtonClass(editor.isActive('taskList'))} title={t('editor_task_list')}><CheckSquare className="w-4 h-4" /></button>
        </div>
        {/* ... Insert ... */}
        <div className="flex gap-1 px-2">
          <button onClick={setLink} className={ButtonClass(editor.isActive('link'))} title={t('editor_link')}><LinkIcon className="w-4 h-4" /></button>
          <button onClick={openMediaLibrary} className={ButtonClass(false)} title={t('editor_image')}><ImageIcon className="w-4 h-4" /></button>
          <button onClick={() => setIsTableModalOpen(true)} className={ButtonClass(false)} title={t('editor_table')}><TableIcon className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={ButtonClass(editor.isActive('blockquote'))} title={t('editor_quote')}><Quote className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={ButtonClass(editor.isActive('codeBlock'))} title={t('editor_code_block')}><Code className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={ButtonClass(false)} title={t('editor_hr')}><Minus className="w-4 h-4" /></button>
        </div>
      </div>

      {isTableModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-2xl w-80 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-primary-900 dark:text-white">{t('editor_insert_table')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('editor_rows')}</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={tableDims.rows}
                  onChange={(e) => setTableDims({ ...tableDims, rows: parseInt(e.target.value) || 1 })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('editor_cols')}</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={tableDims.cols}
                  onChange={(e) => setTableDims({ ...tableDims, cols: parseInt(e.target.value) || 1 })}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsTableModalOpen(false)}>{t('cancel')}</Button>
                <Button variant="primary" size="sm" onClick={insertTable}>{t('editor_insert_btn')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const EditorPage: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('faces');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Voices specific state
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Media Library State
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState<'featured' | 'content'>('content');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TextStyle,
      FontSize,
      FontWeight,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: t('editor_content_placeholder') }),
      (Table as any).configure({ resizable: true }),
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
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-8 py-8',
      },
    },
  });

  useEffect(() => {
    if (category === 'voices' && youtubeUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = youtubeUrl.match(regExp);
      if (match && match[2].length === 11) {
        const id = match[2];
        setFeaturedImage(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
      }
    }
  }, [youtubeUrl, category]);

  const handleMediaSelect = (url: string, width?: number) => {
    if (mediaMode === 'featured') {
      setFeaturedImage(url);
    } else if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const openLibraryForContent = () => {
    setMediaMode('content');
    setIsMediaOpen(true);
  };

  const openLibraryForFeatured = () => {
    setMediaMode('featured');
    setIsMediaOpen(true);
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true);
    try {
      await saveArticle({
        title: title,
        imageUrl: featuredImage,
        type: category === 'voices' ? ContentType.Video : ContentType.Article,
        content: category === 'voices' ? '' : (editor?.getHTML() || ''),
        videoUrl: youtubeUrl,
        excerpt: category === 'voices' ? '' : editor?.getText().substring(0, 150) + '...'
      }, status);
      alert(t('comment_success')); // Or specific success message
    } catch (e) {
      console.error(e);
      alert('Error saving post');
    }
    setIsSaving(false);
  };

  const isVoices = category === 'voices';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-dark">
      <MediaLibrary
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={handleMediaSelect}
        requireWidth={mediaMode === 'content'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex justify-between items-center mb-6 sticky top-16 z-40 bg-gray-50 dark:bg-neutral-dark py-4 -mx-4 px-4 shadow-sm">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-white flex items-center gap-2">
            <Edit3 className="w-6 h-6" />
            {t('create_content')}
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${isPreview ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {isPreview ? <><Edit3 className="w-4 h-4 mr-2" /> {t('editor_edit_mode')}</> : <><Eye className="w-4 h-4 mr-2" /> {t('editor_preview')}</>}
            </button>
            <Button variant="secondary" onClick={() => handleSave('draft')} disabled={isSaving}>{t('editor_save_draft')}</Button>
            <Button variant="primary" onClick={() => handleSave('published')} disabled={isSaving}>{t('editor_publish')}</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-3">
            {isPreview ? (
              <div className="bg-white dark:bg-neutral-dark shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl p-0 overflow-hidden min-h-[80vh]">
                <PostDetailView
                  title={title}
                  image={featuredImage}
                  content={isVoices ? '' : (editor?.getHTML() || '')}
                  publishedAt={new Date()}
                  readTime={isVoices ? 10 : 5}
                  type={isVoices ? 'Video' : 'Article'}
                  videoUrl={isVoices ? youtubeUrl : undefined}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-dark shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl min-h-[80vh] flex flex-col">
                {isVoices ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <div className="w-full max-w-lg space-y-6 text-center">
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full inline-block mb-2">
                        <Youtube className="w-12 h-12 text-red-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('editor_cat_voices')}</h2>
                      <div className="w-full text-left">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('editor_video_url_label')}</label>
                        <Input
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          placeholder={t('editor_video_url_placeholder')}
                          className="w-full text-lg py-3"
                        />
                        <p className="text-xs text-gray-500 mt-2">{t('editor_video_helper')}</p>
                      </div>

                      {featuredImage && (
                        <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg">
                          <img src={featuredImage} alt="Thumbnail" className="w-full h-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <MenuBar editor={editor} openMediaLibrary={openLibraryForContent} />
                    <div className="flex-1 bg-white dark:bg-neutral-dark overflow-y-auto">
                      <EditorContent editor={editor} className="h-full" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-40">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">{t('editor_settings_title')}</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('editor_title_label')}</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('editor_title_placeholder')}
                  className="w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('editor_category_label')}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="faces">{t('editor_cat_faces')}</option>
                  <option value="voices">{t('editor_cat_voices')}</option>
                  <option value="society">{t('editor_cat_society')}</option>
                </select>
              </div>

              {!isVoices && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('editor_featured_image')}</label>
                  <div
                    onClick={openLibraryForFeatured}
                    className="relative w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors overflow-hidden"
                  >
                    {featuredImage ? (
                      <>
                        <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white font-medium text-sm">{t('editor_change_image')}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">{t('editor_select_library')}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3">
                <div className="bg-primary-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  AD
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-900 dark:text-white">Administrator</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('editor_author_role')}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
