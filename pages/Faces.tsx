import { ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Badge, Card, Spinner } from '../components/UI';
import { getArticles } from '../services/api';
import { useTranslation } from '../services/translationService';
import { Article, ContentType } from '../types';

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { t, formatDate } = useTranslation();
  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-none">
      <div className="relative h-56 overflow-hidden">
        <img src={article.imageUrl || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=800&q=80'} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/90 shadow-sm uppercase tracking-wide text-[10px]">{t('face')}</Badge>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-serif font-bold text-primary-900 dark:text-white mb-3 leading-snug group-hover:text-primary-600 transition-colors">
          <Link to={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center font-medium text-primary-600 cursor-pointer group-hover:translate-x-1 transition-transform">
            {t('read_story')} <ChevronRight className="w-3 h-3 ml-1" />
          </span>
        </div>
      </div>
    </Card>
  );
};

export const FacesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const articlesData = await getArticles();
        setArticles(articlesData.filter(a => a.type === ContentType.Article));
      } catch (e) {
        console.error("Failed to load articles:", e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <>
      <SEO title={t('nav_faces')} description={t('cat_faces_subtitle')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 dark:text-white mb-4">
            {t('nav_faces')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('cat_faces_subtitle')}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          )) : (
            <div className="col-span-3 text-center py-20">
              <p className="text-gray-500 text-lg">{t('no_data')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
