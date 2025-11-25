import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PostDetailView } from '../components/PostDetailView';
import { SEO } from '../components/SEO';
import { Spinner } from '../components/UI';
import { getArticleById, getArticles, incrementView } from '../services/api';
import { useTranslation } from '../services/translationService';
import { Article } from '../types';

export const ArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | undefined>(undefined);
    const [related, setRelated] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const viewIncrementedRef = React.useRef<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (id) {
                try {
                    const data = await getArticleById(id);
                    setArticle(data);
                    if (data) {
                        // Fire view increment only once per article
                        if (viewIncrementedRef.current !== data.id) {
                            incrementView(data.id);
                            viewIncrementedRef.current = data.id;
                        }

                        // Fetch related articles (simple logic: same type, excluding current)
                        const all = await getArticles();
                        setRelated(all.filter(a => a.id !== data.id && a.type === data.type).slice(0, 2));
                    }
                } catch (e) {
                    console.error("Error fetching article", e);
                }
            }
            setLoading(false);
            window.scrollTo(0, 0);
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    if (!article) return <div className="text-center py-20">{t('article_not_found')}</div>;

    return (
        <>
            <SEO title={article.title} description={article.excerpt} image={article.imageUrl} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto mb-8">
                    <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('back')}
                    </Link>
                </div>

                <PostDetailView
                    postId={article.id}
                    title={article.title}
                    image={article.imageUrl}
                    content={article.content}
                    publishedAt={article.publishedAt}
                    readTime={article.readTime}
                    tags={article.tags}
                    type={article.type === 'Video' ? 'Video' : 'Article'}
                    videoUrl={article.videoUrl}
                />

                {/* Related Articles */}
                {related.length > 0 && (
                    <div className="max-w-3xl mx-auto border-t border-gray-200 dark:border-gray-800 pt-12">
                        <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-8">{t('related')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {related.map(item => (
                                <Link key={item.id} to={`/article/${item.id}`} className="group block">
                                    <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'} alt={item.title} className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
