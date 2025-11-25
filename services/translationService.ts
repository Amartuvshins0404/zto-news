import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

type Language = string;

interface TranslationContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (date: string | Date) => string;
  dictionary: Record<string, Record<string, string>>;
  updateTranslation: (lang: string, key: string, value: string) => void;
  addLanguage: (lang: string) => void;
  removeLanguage: (lang: string) => void;
  availableLanguages: string[];
}

const INITIAL_DICTIONARY = {
  mn: {
    nav_home: 'Нүүр',
    nav_voices: 'Voices',
    nav_faces: 'Faces',
    nav_categories: 'Ангилалууд',
    nav_company: 'Компани',
    nav_about: 'Бидний тухай',
    nav_contact: 'Холбоо барих',
    nav_admin: 'Админ',
    search_placeholder: 'Хайх...',
    toggle_theme: 'Горим солих',
    create_content: 'Нийтлэх',
    notifications: 'Мэдэгдэл',
    back: 'Буцах',
    save: 'Хадгалах',
    cancel: 'Болих',
    delete: 'Устгах',
    edit: 'Засах',
    actions: 'Үйлдэл',
    follow: 'Дагах',
    published_on: 'Нийтэлсэн',
    share: 'Хуваалцах',
    bookmark: 'Хадгалах',
    section_latest: 'Сүүлийн үеийн',
    section_trending: 'Эрэлттэй',
    read_more: 'Дэлгэрэнгүй',
    read_story: 'Унших',
    featured_face: 'Онцлох Faces',
    voice: 'Voices',
    face: 'Faces',
    no_data: 'Мэдээлэл олдсонгүй.',
    weather_city: 'Цаг агаар',
    stock_market: 'Хөрөнгийн бирж',
    min_read: 'мин унших',
    published: 'Нийтлэгдсэн',
    related: 'Төстэй нийтлэлүүд',
    article_not_found: 'Нийтлэл олдсонгүй',
    author_label: 'Нийтлэлч',
    admin_user: 'Администратор',
    cat_voices_subtitle: 'Шилдэг подкаст, ярилцлагууд',
    cat_faces_subtitle: 'Нийтлэл, сурвалжлага, тэмдэглэл',
    editor_undo: 'Буцаах',
    editor_redo: 'Дахин хийх',
    editor_size: 'Хэмжээ',
    editor_bold: 'Тод',
    editor_italic: 'Налуу',
    editor_underline: 'Доогуур зураас',
    editor_highlight: 'Тодруулах',
    editor_code: 'Код',
    editor_align_left: 'Зүүн',
    editor_align_center: 'Голлуулах',
    editor_align_right: 'Баруун',
    editor_align_justify: 'Тэгшлэх',
    editor_bullet_list: 'Жагсаалт',
    editor_ordered_list: 'Дугаарласан жагсаалт',
    editor_task_list: 'Хийх ажлын жагсаалт',
    editor_link: 'Холбоос',
    editor_image: 'Зураг',
    editor_table: 'Хүснэгт',
    editor_quote: 'Ишлэл',
    editor_code_block: 'Код блоклох',
    editor_hr: 'Тусгаарлагч',
    editor_link_prompt: 'URL оруулна уу',
    editor_insert_table: 'Хүснэгт оруулах',
    editor_rows: 'Мөр',
    editor_cols: 'Багана',
    editor_insert_btn: 'Оруулах',
    editor_preview: 'Урьдчилан харах',
    editor_edit_mode: 'Засах',
    editor_save_draft: 'Ноорог хадгалах',
    editor_publish: 'Нийтлэх',
    editor_untitled: 'Гарчиггүй',
    editor_content_placeholder: 'Энд бичиж эхэлнэ үү...',
    editor_settings_title: 'Тохиргоо',
    editor_title_label: 'Гарчиг',
    editor_title_placeholder: 'Нийтлэлийн гарчиг...',
    editor_category_label: 'Ангилал',
    editor_cat_faces: 'Faces (Нийтлэл)',
    editor_cat_voices: 'Voices (Видео/Подкаст)',
    editor_cat_society: 'Нийгэм',
    editor_featured_image: 'Онцлох зураг',
    editor_change_image: 'Зураг солих',
    editor_select_library: 'Сангаас сонгох',
    editor_author_role: 'Админ',
    editor_video_url_label: 'YouTube Видео URL',
    editor_video_url_placeholder: 'https://youtube.com/watch?v=...',
    editor_video_helper: 'Бид холбоосоос зургийг нь автоматаар татах болно.',
    media_title: 'Медиа Сан',
    media_tab_library: 'Сан',
    media_tab_upload: 'Хуулах',
    media_drag_drop: 'Файлаа чирж оруулна уу',
    media_browse: 'эсвэл хайх',
    media_browse_btn: 'Файл сонгох',
    media_width_label: 'Өргөн (px):',
    media_selected: 'зураг сонгогдсон',
    media_none_selected: 'Зураг сонгогдоогүй',
    media_insert_btn: 'Зураг оруулах',
    media_demo_alert: 'Энэ бол туршилтын хувилбар.',
    cat_manager_title: 'Ангилалууд',
    cat_manager_subtitle: 'Контентын ангилал удирдах',
    cat_add_btn: 'Ангилал нэмэх',
    cat_col_name: 'Нэр',
    cat_col_slug: 'Slug',
    cat_col_desc: 'Тайлбар',
    cat_col_posts: 'Нийтлэл',
    cat_confirm_delete: 'Та энэ ангилалыг устгахдаа итгэлтэй байна уу?',
    comments_title: 'Сэтгэгдэл',
    comment_placeholder: 'Сэтгэгдэл бичих...',
    comment_name_placeholder: 'Таны нэр',
    comment_submit: 'Илгээх',
    comment_guest: 'Зочин',
    comment_success: 'Сэтгэгдэл амжилттай нэмэгдлээ.',
    newsletter_title: 'Мэдээлэл авах',
    newsletter_desc: 'Шинэ нийтлэлүүдийг цаг алдалгүй аваарай.',
    subscribe: 'Бүртгүүлэх',
    footer_rights: '© 2025 Voices. Бүх эрх хуулиар хамгаалагдсан.',
    footer_motto: 'Шинэ үеийн дуу хоолой, нийгмийн түүчээ.',
    admin_dashboard: 'Админ Самбар',
    admin_overview: 'Тойм',
    admin_posts: 'Нийтлэлүүд',
    admin_comments: 'Сэтгэгдлүүд',
    admin_media: 'Медиа',
    admin_translations: 'Орчуулга',
    admin_analytics_views: 'Үзэлт',
    admin_analytics_engagement: 'Оролцоо',
    admin_reply: 'Хариулах',
    admin_mark_read: 'Уншсан гэж тэмдэглэх',
    admin_no_notifications: 'Мэдэгдэл алга.',
    admin_add_lang: 'Хэл нэмэх',
    admin_lang_code: 'Хэлний код (p.x. fr)',
  },
  en: {
    nav_home: 'Home',
    nav_voices: 'Voices',
    nav_faces: 'Faces',
    nav_categories: 'Categories',
    nav_company: 'Company',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_admin: 'Admin',
    search_placeholder: 'Search...',
    toggle_theme: 'Toggle Theme',
    create_content: 'Create',
    notifications: 'Notifications',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    actions: 'Actions',
    follow: 'Follow',
    published_on: 'Published on',
    share: 'Share',
    bookmark: 'Save',
    section_latest: 'Latest Stories',
    section_trending: 'Trending Now',
    read_more: 'Read More',
    read_story: 'Read Story',
    featured_face: 'Featured Face',
    voice: 'Voice',
    face: 'Face',
    no_data: 'No information found.',
    weather_city: 'Weather',
    stock_market: 'Stock Market',
    min_read: 'min read',
    published: 'Published',
    related: 'Related Stories',
    article_not_found: 'Article not found',
    author_label: 'Author',
    admin_user: 'Administrator',
    cat_voices_subtitle: 'Best podcasts and interviews',
    cat_faces_subtitle: 'Articles, reports, and notes',
    editor_undo: 'Undo',
    editor_redo: 'Redo',
    editor_size: 'Size',
    editor_bold: 'Bold',
    editor_italic: 'Italic',
    editor_underline: 'Underline',
    editor_highlight: 'Highlight',
    editor_code: 'Inline Code',
    editor_align_left: 'Align Left',
    editor_align_center: 'Align Center',
    editor_align_right: 'Align Right',
    editor_align_justify: 'Justify',
    editor_bullet_list: 'Bullet List',
    editor_ordered_list: 'Ordered List',
    editor_task_list: 'Task List',
    editor_link: 'Link',
    editor_image: 'Image',
    editor_table: 'Table',
    editor_quote: 'Blockquote',
    editor_code_block: 'Code Block',
    editor_hr: 'Horizontal Rule',
    editor_link_prompt: 'Enter URL',
    editor_insert_table: 'Insert Table',
    editor_rows: 'Rows',
    editor_cols: 'Cols',
    editor_insert_btn: 'Insert',
    editor_preview: 'Preview',
    editor_edit_mode: 'Edit',
    editor_save_draft: 'Save Draft',
    editor_publish: 'Publish',
    editor_untitled: 'Untitled Post',
    editor_content_placeholder: 'Start writing here...',
    editor_settings_title: 'Post Settings',
    editor_title_label: 'Title',
    editor_title_placeholder: 'Enter post title...',
    editor_category_label: 'Category',
    editor_cat_faces: 'Faces (Articles)',
    editor_cat_voices: 'Voices (Video/Podcast)',
    editor_cat_society: 'Society',
    editor_featured_image: 'Featured Image',
    editor_change_image: 'Change Image',
    editor_select_library: 'Select from Library',
    editor_author_role: 'Admin',
    editor_video_url_label: 'YouTube Video URL',
    editor_video_url_placeholder: 'https://youtube.com/watch?v=...',
    editor_video_helper: 'We will automatically fetch the thumbnail from this URL.',
    media_title: 'Media Library',
    media_tab_library: 'Library',
    media_tab_upload: 'Upload',
    media_drag_drop: 'Drag and drop files here',
    media_browse: 'or click to browse',
    media_browse_btn: 'Browse Files',
    media_width_label: 'Width (px):',
    media_selected: 'image selected',
    media_none_selected: 'No image selected',
    media_insert_btn: 'Insert Image',
    media_demo_alert: 'This is a demo.',
    cat_manager_title: 'Categories',
    cat_manager_subtitle: 'Manage content categories',
    cat_add_btn: 'Add Category',
    cat_col_name: 'Name',
    cat_col_slug: 'Slug',
    cat_col_desc: 'Description',
    cat_col_posts: 'Posts',
    cat_confirm_delete: 'Are you sure you want to delete this category?',
    comments_title: 'Comments',
    comment_placeholder: 'Write a comment...',
    comment_name_placeholder: 'Your Name',
    comment_submit: 'Submit',
    comment_guest: 'Guest',
    comment_success: 'Comment added successfully.',
    newsletter_title: 'Newsletter',
    newsletter_desc: 'Get the latest updates directly in your inbox.',
    subscribe: 'Subscribe',
    footer_rights: '© 2025 Voices. All rights reserved.',
    footer_motto: 'The voice of a new generation.',
    admin_dashboard: 'Admin Dashboard',
    admin_overview: 'Overview',
    admin_posts: 'Posts',
    admin_comments: 'Comments',
    admin_media: 'Media',
    admin_translations: 'Translations',
    admin_analytics_views: 'Views',
    admin_analytics_engagement: 'Engagement',
    admin_reply: 'Reply',
    admin_mark_read: 'Mark as read',
    admin_no_notifications: 'No new notifications.',
    admin_add_lang: 'Add Language',
    admin_lang_code: 'Language Code (e.g. fr)',
  }
};

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('mn');
  const [dictionary, setDictionary] = useState<Record<string, Record<string, string>>>(INITIAL_DICTIONARY);

  // Load translations from DB
  useEffect(() => {
    const loadTranslations = async () => {
      const { data } = await supabase.from('translations').select('*');
      if (data && data.length > 0) {
        const newDict: Record<string, Record<string, string>> = {};
        data.forEach((row: any) => {
          if (!newDict[row.lang_code]) newDict[row.lang_code] = {};
          newDict[row.lang_code][row.key] = row.value;
        });
        setDictionary(prev => ({ ...prev, ...newDict }));
      }
    };
    loadTranslations();
  }, []);

  const t = (key: string) => {
    return dictionary[lang]?.[key] || dictionary['en']?.[key] || key;
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const updateTranslation = async (targetLang: string, key: string, value: string) => {
    // Update local state immediately for UI responsiveness
    setDictionary(prev => ({
      ...prev,
      [targetLang]: {
        ...prev[targetLang],
        [key]: value
      }
    }));

    // Persist to DB
    await supabase.from('translations').upsert({
      lang_code: targetLang,
      key: key,
      value: value
    }, { onConflict: 'lang_code,key' });
  };

  const addLanguage = (newLang: string) => {
    if (!dictionary[newLang]) {
      const newDict = { ...dictionary['en'] }; // Clone EN as base
      setDictionary(prev => ({ ...prev, [newLang]: newDict }));
    }
  };

  const removeLanguage = (targetLang: string) => {
    if (targetLang === 'mn' || targetLang === 'en') return;
    const newDict = { ...dictionary };
    delete newDict[targetLang];
    setDictionary(newDict);
    if (lang === targetLang) setLang('en');
  };

  const availableLanguages = Object.keys(dictionary);

  return React.createElement(
    TranslationContext.Provider,
    {
      value: {
        lang, setLang, t, formatDate,
        dictionary, updateTranslation, addLanguage, removeLanguage, availableLanguages
      }
    },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
