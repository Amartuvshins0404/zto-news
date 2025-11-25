
import { Bookmark, Eye, MessageCircle, PlayCircle, Share2, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createComment, getComments, getViewCount } from '../services/api';
import { useTranslation } from '../services/translationService';
import { TiptapViewer } from './TiptapViewer';
import { Button, IconButton, Input } from './UI';

interface PostDetailViewProps {
    postId: string;
    title: string;
    image?: string;
    content: string;
    publishedAt?: string | Date;
    readTime?: number;
    tags?: string[];
    type?: 'Article' | 'Video';
    videoUrl?: string;
    className?: string;
}

interface Comment {
    id: string;
    author: string;
    text: string;
    date: Date;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({
    postId,
    title,
    image,
    content,
    publishedAt = new Date(),
    type = 'Article',
    videoUrl,
    className = ''
}) => {
    const { t, formatDate } = useTranslation();

    // Video State
    const [isPlaying, setIsPlaying] = useState(false);

    // View count
    const [viewCount, setViewCount] = useState(0);

    // Comment State
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentName, setNewCommentName] = useState('');
    const [newCommentText, setNewCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Load comments and view count
    useEffect(() => {
        if (postId) {
            // Load comments
            getComments(postId).then(data => {
                setComments(data.map(c => ({
                    id: c.id,
                    author: c.author,
                    text: c.text,
                    date: new Date(c.date)
                })));
            }).catch(err => console.error('Failed to load comments:', err));

            // Load view count
            getViewCount(postId).then(count => {
                setViewCount(count);
            }).catch(err => console.error('Failed to load view count:', err));
        }
    }, [postId]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim() || submitting) return;

        const authorName = newCommentName.trim() || t('comment_guest');

        try {
            setSubmitting(true);
            await createComment(postId, authorName, newCommentText);

            // Add to local state immediately for better UX
            const newComment: Comment = {
                id: Math.random().toString(36).substr(2, 9),
                author: authorName,
                text: newCommentText,
                date: new Date()
            };
            setComments([...comments, newComment]);
            setNewCommentName('');
            setNewCommentText('');
        } catch (error) {
            console.error('Failed to submit comment:', error);
            alert(t('comment_error') || 'Failed to submit comment');
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to get embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        // Simple YouTube ID extraction
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const id = (match && match[2].length === 11) ? match[2] : null;
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
    };

    return (
        <article className={`max-w-7xl mx-auto px-4 ${className}`}>

            {/* Hero Section */}
            <div className="relative w-full h-[500px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl mb-16 group bg-gray-900">

                {isPlaying && videoUrl ? (
                    <div className="absolute inset-0 z-20">
                        <iframe
                            src={getEmbedUrl(videoUrl)}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <button
                            onClick={() => setIsPlaying(false)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <>
                        {image ? (
                            <img
                                src={image}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                        {/* Play Button for Video */}
                        {videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="pointer-events-auto bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/30 hover:scale-110 hover:bg-white/30 transition-all duration-300 group"
                                >
                                    <PlayCircle className="w-20 h-20 text-white fill-white opacity-90 group-hover:opacity-100" />
                                </button>
                            </div>
                        )}

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 flex flex-col justify-end h-full pointer-events-none">
                            <div className="pointer-events-auto">
                                {/* Top Badge */}
                                <div className="flex mb-6">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/10">
                                        {type === 'Video' ? t('voice') : t('face')}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] tracking-tight max-w-5xl text-shadow-sm">
                                    {title || t('editor_untitled')}
                                </h1>

                                {/* Meta & Glass Actions */}
                                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-t border-white/20 pt-6 mt-2">
                                    {/* Date */}
                                    <div className="text-gray-200 font-medium tracking-wide text-sm md:text-base flex items-center gap-2">
                                        <span>{formatDate(publishedAt)}</span>
                                        <span className="w-1 h-1 rounded-full bg-accent"></span>
                                        <span>{t('published_on')} Voices</span>
                                    </div>

                                    {/* Glass Actions Toolbar */}
                                    <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
                                        <IconButton className="text-white hover:bg-white/20 hover:text-white" title={t('views') || 'Views'}>
                                            <div className="flex items-center gap-1.5 px-1">
                                                <Eye className="w-5 h-5" />
                                                <span className="text-xs font-bold">{viewCount > 0 ? viewCount.toLocaleString() : '0'}</span>
                                            </div>
                                        </IconButton>
                                        <IconButton className="text-white hover:bg-white/20 hover:text-white" title="Comment">
                                            <div className="flex items-center gap-1.5 px-1">
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="text-xs font-bold">{comments.length}</span>
                                            </div>
                                        </IconButton>
                                        <div className="w-px h-6 bg-white/20 mx-1"></div>
                                        <IconButton className="text-white hover:bg-white/20 hover:text-white" title={t('share')}><Share2 className="w-5 h-5" /></IconButton>
                                        <IconButton className="text-white hover:bg-white/20 hover:text-white" title={t('bookmark')}><Bookmark className="w-5 h-5" /></IconButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Content Body - Centered & Refined */}
            {content && (
                <div className="max-w-3xl mx-auto mb-20">
                    <TiptapViewer
                        content={content}
                        className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:font-bold prose-p:leading-loose prose-img:rounded-2xl prose-img:shadow-lg text-gray-800 dark:text-gray-100"
                    />
                </div>
            )}

            {/* Comment Section */}
            <div className="max-w-3xl mx-auto border-t border-gray-200 dark:border-gray-800 pt-12 pb-12">
                <h3 className="text-2xl font-serif font-bold text-primary-900 dark:text-white mb-8 flex items-center gap-2">
                    {t('comments_title')}
                    <span className="text-sm font-sans font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{comments.length}</span>
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-12 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <Input
                            placeholder={t('comment_name_placeholder')}
                            value={newCommentName}
                            onChange={(e) => setNewCommentName(e.target.value)}
                            className="bg-white dark:bg-gray-900"
                        />
                        <textarea
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 outline-none transition-shadow min-h-[100px] resize-y"
                            placeholder={t('comment_placeholder')}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="primary" disabled={submitting}>
                            {submitting ? t('comment_submitting') || 'Submitting...' : t('comment_submit')}
                        </Button>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-8">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-primary-900 dark:text-white">{comment.author}</span>
                                    <span className="text-xs text-gray-400">• {formatDate(comment.date)}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </article>
    );
};
