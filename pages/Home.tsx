
import { ChevronRight, Clock, PlayCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroVideo } from '../components/HeroVideo';
import { SEO } from '../components/SEO';
import { Badge, Card, Spinner } from '../components/UI';
import { getArticles } from '../services/api';
import { useTranslation } from '../services/translationService';
import { Article, ContentType } from '../types';

const HeroArticle: React.FC<{ article: Article }> = ({ article }) => {
  const { t, formatDate } = useTranslation();
  return (
    <div className="relative group overflow-hidden rounded-2xl h-[500px] md:h-[600px] w-full">
      <img
        src={article.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80'}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3">
        <Badge variant="accent" className="mb-4 uppercase tracking-wider">{t('featured_face')}</Badge>
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
          <Link to={`/article/${article.id}`} className="hover:text-gray-200 transition-colors outline-none">
            {article.title}
          </Link>
        </h2>
        <p className="text-gray-200 mb-6 text-lg hidden md:block font-light leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center text-gray-300 text-sm space-x-4">
          <span>{formatDate(article.publishedAt)}</span>
          <span>•</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {article.readTime} {t('min_read')}</span>
        </div>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { t, formatDate } = useTranslation();
  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-none">
      <div className="relative h-56 overflow-hidden">
        <img src={article.imageUrl || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=800&q=80'} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/90 shadow-sm uppercase tracking-wide text-[10px]">{article.type === ContentType.Video ? t('voice') : t('face')}</Badge>
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

export const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const articlesData = await getArticles();
        setArticles(articlesData);
      } catch (e) {
        console.error("Failed to load articles:", e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

  const faces = articles.filter(a => a.type === ContentType.Article);
  const voices = articles.filter(a => a.type === ContentType.Video);
  const heroArticle = faces[0];

  return (
    <>
      <SEO title={t('nav_home')} description={t('footer_motto')} />

      {/* Hero Section - Full Screen */}
      <section>
        <HeroVideo />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

        {/* Voices Section (Horizontal Scroll) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary-900 dark:text-white flex items-center">
              Voices <span className="ml-2 w-1.5 h-1.5 rounded-full bg-accent"></span>
            </h2>
            <Link to="/voices" className="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center transition-colors">
              {t('read_more')} <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {voices.slice(0, 2).map(video => (
              <a key={video.id} href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl h-72 block shadow-sm hover:shadow-xl transition-all">
                <img src={video.imageUrl || 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80'} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <PlayCircle className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-xl mb-1">{video.title}</h3>
                  <p className="text-gray-200 text-sm line-clamp-1 opacity-90">{video.excerpt}</p>
                </div>
              </a>
            ))}
            {voices.length === 0 && <p className="text-gray-500 col-span-2 text-center">{t('no_data')}</p>}
          </div>
        </section>

        {/* Faces Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary-900 dark:text-white">{t('section_latest')}</h2>
            <Link to="/faces" className="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center transition-colors">
              {t('read_more')} <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faces.length > 1 ? faces.slice(1).map(article => (
              <ArticleCard key={article.id} article={article} />
            )) : <p className="col-span-3 text-center text-gray-500 py-10">{t('no_data')}</p>}
          </div>
        </section>
      </div>
    </>
  );
};
