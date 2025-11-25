
import { AnalyticsDashboardData, Article, Category, Comment, ContentType, MediaItem, Notification } from '../types';
import { supabase } from './supabaseClient';

// --- Mappers ---
const mapPostToArticle = (post: any): Article => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content || '',
    type: post.type as ContentType,
    publishedAt: post.published_at,
    imageUrl: post.featured_image || '',
    videoUrl: post.video_url || undefined,
    readTime: post.read_time || 0,
    tags: post.tags || [],
    author: {
        id: post.author?.id || 'admin',
        name: post.author?.full_name || 'Administrator',
        avatar: post.author?.avatar_url || '',
        role: post.author?.role || 'Admin'
    }
});

const mapComment = (c: any): Comment => ({
    id: c.id,
    articleId: c.post_id,
    author: c.author_name,
    text: c.content,
    date: c.created_at
});

// --- Posts ---
export const getArticles = async (): Promise<Article[]> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*, author:profiles(id, full_name, avatar_url, role)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapPostToArticle);
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*, author:profiles(id, full_name, avatar_url, role)')
        .eq('id', id)
        .single();

    if (error) return undefined;
    return mapPostToArticle(data);
};

// View tracking with localStorage to prevent duplicate counts
const VIEWED_POSTS_KEY = 'viewed_posts';
const VIEW_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ViewedPost {
    postId: string;
    timestamp: number;
}

const getViewedPosts = (): ViewedPost[] => {
    try {
        const stored = localStorage.getItem(VIEWED_POSTS_KEY);
        if (!stored) return [];
        const posts: ViewedPost[] = JSON.parse(stored);
        // Clean up old entries (older than 24 hours)
        const now = Date.now();
        const valid = posts.filter(p => now - p.timestamp < VIEW_DURATION_MS);
        if (valid.length !== posts.length) {
            localStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify(valid));
        }
        return valid;
    } catch (e) {
        console.error('Error reading viewed posts:', e);
        return [];
    }
};

const hasViewedRecently = (postId: string): boolean => {
    const viewedPosts = getViewedPosts();
    const now = Date.now();
    return viewedPosts.some(p => p.postId === postId && now - p.timestamp < VIEW_DURATION_MS);
};

const markAsViewed = (postId: string): void => {
    try {
        const viewedPosts = getViewedPosts();
        viewedPosts.push({ postId, timestamp: Date.now() });
        localStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify(viewedPosts));
    } catch (e) {
        console.error('Error marking post as viewed:', e);
    }
};

export const incrementView = async (postId: string) => {
    // Check if already viewed recently
    if (hasViewedRecently(postId)) {
        console.log('Post already viewed recently, skipping increment');
        return;
    }

    // Fire and forget analytics
    const deviceType = /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    const trafficSource = document.referrer || 'direct';

    await supabase.rpc('increment_view', {
        p_post_id: postId,
        device_type: deviceType,
        traffic_source: trafficSource
    });

    // Mark as viewed
    markAsViewed(postId);
};

export const getViewCount = async (postId: string): Promise<number> => {
    const { count, error } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('event_type', 'view');

    if (error) {
        console.error('Error fetching view count:', error);
        return 0;
    }

    return count || 0;
};

export const deleteArticle = async (id: string): Promise<void> => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
};

// Generate URL-friendly slug from title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single
        .substring(0, 100);         // Limit length
};

export const saveArticle = async (article: Partial<Article>, status: 'draft' | 'published'): Promise<string> => {
    const slug = article.id ? undefined : generateSlug(article.title || 'untitled');

    const payload: any = {
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        type: article.type,
        featured_image: article.imageUrl,
        video_url: article.videoUrl,
        status: status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        // category_id needs to be mapped from UI state if implemented
    };

    // Only add slug for new posts
    if (slug) {
        payload.slug = slug;
    }

    if (article.id) {
        const { error } = await supabase.from('posts').update(payload).eq('id', article.id);
        if (error) throw error;
        return article.id;
    } else {
        const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
        if (error) throw error;
        return data.id;
    }
};

// --- Comments ---
export const getComments = async (postId?: string): Promise<Comment[]> => {
    let query = supabase.from('comments').select('*').order('created_at', { ascending: false });
    if (postId) {
        query = query.eq('post_id', postId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapComment);
};

export const createComment = async (postId: string, author: string, content: string): Promise<void> => {
    const { error } = await supabase.from('comments').insert({
        post_id: postId,
        author_name: author,
        content: content
    });
    if (error) throw error;
};

export const deleteComment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
};

export const replyToComment = async (id: string, replyText: string): Promise<void> => {
    // Fetch original comment to get post_id
    const { data: original } = await supabase.from('comments').select('post_id').eq('id', id).single();
    if (!original) return;

    await supabase.from('comments').insert({
        post_id: original.post_id,
        parent_id: id,
        author_name: 'Administrator',
        content: replyText,
        is_admin: true
    });
};

// --- Media ---
export const getMedia = async (): Promise<MediaItem[]> => {
    const { data, error } = await supabase.from('media_library').select('*').order('uploaded_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(m => ({
        id: m.id,
        url: m.public_url,
        name: m.filename,
        date: m.uploaded_at
    }));
};

export const deleteMedia = async (id: string): Promise<void> => {
    const { error } = await supabase.from('media_library').delete().eq('id', id);
    if (error) throw error;
};

export const uploadMedia = async (file: File): Promise<MediaItem> => {
    const fileName = `${Date.now()}-${file.name}`;

    // Get bucket name from environment (defaults to 'assets' if not set)
    const bucketName = import.meta.env.VITE_BUCKET_NAME || 'assets';

    // Upload to Supabase Storage bucket
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
    });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    // Save metadata to database
    const { data: mediaRecord, error: dbError } = await supabase.from('media_library').insert({
        filename: file.name,
        public_url: publicUrl,
        size_bytes: file.size,
        mime_type: file.type
    }).select().single();

    if (dbError) throw dbError;

    return {
        id: mediaRecord.id,
        url: mediaRecord.public_url,
        name: mediaRecord.filename,
        date: mediaRecord.uploaded_at
    };
};

// --- Categories ---
export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return (data || []).map(c => ({
        id: c.id,
        name: c.name_key, // This will be translated in UI by looking up key
        slug: c.slug,
        description: c.description_key,
        count: 0
    }));
};

export const saveCategory = async (category: Partial<Category>): Promise<void> => {
    const payload = {
        slug: category.slug,
        name_key: category.name,
        description_key: category.description
    };

    if (category.id) {
        await supabase.from('categories').update(payload).eq('id', category.id);
    } else {
        await supabase.from('categories').insert(payload);
    }
};

export const deleteCategory = async (id: string): Promise<void> => {
    await supabase.from('categories').delete().eq('id', id);
};

// --- Notifications ---
export const getNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) throw error;
    return (data || []).map(n => ({
        id: n.id,
        message: n.message,
        read: n.is_read,
        date: n.created_at,
        type: n.type as any
    }));
};

export const markNotificationRead = async (id: string): Promise<void> => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
};

export const subscribeToNotifications = (callback: (n: Notification) => void) => {
    return supabase
        .channel('admin-notifications')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications' },
            (payload) => {
                const n = payload.new;
                callback({
                    id: n.id,
                    message: n.message,
                    read: n.is_read,
                    date: n.created_at,
                    type: n.type
                });
            }
        )
        .subscribe();
};

// --- Analytics ---
export const getAnalytics = async (): Promise<AnalyticsDashboardData> => {
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
    if (error) {
        console.error("Error fetching analytics:", error);
        // Fallback empty structure to avoid UI crashes if RPC fails or is missing
        return {
            kpis: [],
            trends: [],
            devices: [],
            traffic: [],
            topContent: []
        };
    }
    return data as AnalyticsDashboardData;
};
