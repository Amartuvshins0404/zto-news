import { PlayCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { Spinner } from '../components/UI';
import { getArticles } from '../services/api';
import { useTranslation } from '../services/translationService';
import { Article, ContentType } from '../types';

const VideoCard: React.FC<{ video: Article }> = ({ video }) => {
  const { formatDate } = useTranslation();
  return (
    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl h-80 block shadow-sm hover:shadow-xl transition-all">
      <img src={video.imageUrl || 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80'} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
          <PlayCircle className="w-12 h-12 text-white fill-white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <h3 className="text-white font-bold text-xl mb-2">{video.title}</h3>
        <p className="text-gray-200 text-sm line-clamp-2 opacity-90 mb-2">{video.excerpt}</p>
        <p className="text-gray-300 text-xs">{formatDate(video.publishedAt)}</p>
      </div>
    </a>
  );
};

export const VoicesPage: React.FC = () => {
  const [videos, setVideos] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const articlesData = await getArticles();
        setVideos(articlesData.filter(a => a.type === ContentType.Video));
      } catch (e) {
        console.error("Failed to load videos:", e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <>
      <SEO title={t('nav_voices')} description={t('cat_voices_subtitle')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 dark:text-white mb-4">
            {t('nav_voices')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('cat_voices_subtitle')}
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.length > 0 ? videos.map(video => (
            <VideoCard key={video.id} video={video} />
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
