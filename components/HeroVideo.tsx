import { ChevronRight, PlayCircle } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../services/translationService';
import { Button } from './UI';

export const HeroVideo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Enhanced Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* Content Container - Better centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-10">

            {/* Badge - Enhanced */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl text-white text-sm font-medium tracking-wide shadow-lg animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]"></span>
              {t('featured_voice')}
            </div>

            {/* Main Title - Enhanced Typography */}
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight tracking-tight animate-fade-in-up animation-delay-100">
              {t('hero_title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(147,51,234,0.5)] animate-gradient-x">
                {t('hero_title_highlight')}
              </span>
            </h1>

            {/* Description - Better spacing and readability */}
            <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-2xl animate-fade-in-up animation-delay-200 backdrop-blur-sm">
              {t('hero_description')}
            </p>

            {/* Action Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-fade-in-up animation-delay-300">
              <Link to="/voices">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white !text-gray-900 !dark:text-gray-100 !hover:bg-gray-100 dark:hover:bg-gray-300 border-none shadow-[0_10px_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_50px_rgba(255,255,255,0.3)] font-bold px-8 py-6 text-lg"
                >
                  <PlayCircle className="w-6 h-6 mr-2" />
                  {t('watch_now')}
                </Button>
              </Link>

              <Link to="/faces">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:border-white/60 px-8 py-6 text-lg font-semibold"
                >
                  {t('read_more')}
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats / Info - Enhanced */}
            <div className="pt-12 flex items-center gap-12 text-white/90 border-t border-white/10 mt-12 animate-fade-in-up animation-delay-400">
              <div className="group cursor-default">
                <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">4K</p>
                <p className="text-xs uppercase tracking-wider opacity-70 mt-1">Resolution</p>
              </div>
              <div className="group cursor-default">
                <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">60</p>
                <p className="text-xs uppercase tracking-wider opacity-70 mt-1">FPS</p>
              </div>
              <div className="group cursor-default">
                <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">∞</p>
                <p className="text-xs uppercase tracking-wider opacity-70 mt-1">Possibilities</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <p className="text-sm font-medium tracking-wide">Scroll to explore</p>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};
