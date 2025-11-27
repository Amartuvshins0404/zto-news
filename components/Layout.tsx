
import { Edit3, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { useTranslation } from '../services/translationService';
import { NotificationDropdown } from './NotificationDropdown';
import { Button, ThemeToggle } from './UI';

// --- Header ---
export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, lang, setLang, availableLanguages } = useTranslation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 transform ${isScrolled || location.pathname !== '/'
        ? 'translate-y-0 bg-white/95 dark:bg-neutral-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800'
        : '-translate-y-full bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-primary-600 dark:text-white tracking-tight">
              VOICES<span className="text-accent">.</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav className="flex space-x-6">
              <Link to="/" className={`text-sm font-medium ${isActive('/') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}>
                {t('nav_home')}
              </Link>
              <Link to="/voices" className={`text-sm font-medium ${isActive('/voices') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}>
                {t('nav_voices')}
              </Link>
              <Link to="/faces" className={`text-sm font-medium ${isActive('/faces') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}>
                {t('nav_faces')}
              </Link>
            </nav>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 uppercase cursor-pointer hover:border-primary-600 dark:hover:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
            >
              {availableLanguages.map(langCode => (
                <option key={langCode} value={langCode} className="bg-white dark:bg-gray-800">
                  {langCode.toUpperCase()}
                </option>
              ))}
            </select>

            <ThemeToggle />

            {user ? (
              <>
                <Link to="/editor" className="flex items-center justify-center p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white transition-colors" title={t('create_content')}>
                  <Edit3 className="w-5 h-5" />
                </Link>

                <Link to="/admin" className="flex items-center justify-center p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white transition-colors" title={t('nav_admin')}>
                  <LayoutDashboard className="w-5 h-5" />
                </Link>

                <NotificationDropdown />

                <Button variant="ghost" size="sm" onClick={logout} className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" className="ml-2">
                  <LogIn className="w-4 h-4 mr-2" /> Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-dark border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>{t('nav_home')}</Link>
            <Link to="/voices" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>{t('nav_voices')}</Link>
            <Link to="/faces" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>{t('nav_faces')}</Link>

            {user ? (
              <>
                <Link to="/editor" className="block px-3 py-2 rounded-md text-base font-medium text-accent dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>{t('create_content')}</Link>
                <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>{t('nav_admin')}</Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// --- Footer ---
export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    setStatus('idle');
    try {
      const { supabase } = await import('../services/supabaseClient');
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { email, type: 'newsletter' }
      });

      if (error) throw error;
      setStatus('success');
      setEmail('');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <footer className="bg-white dark:bg-neutral-dark border-t border-gray-200 dark:border-gray-800 mt-12 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-serif font-bold text-primary-600 dark:text-white">
              VOICES<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t('footer_motto')}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-900 dark:text-white uppercase tracking-wider mb-4">{t('nav_categories')}</h3>
            <ul className="space-y-2">
              <li><Link to="/voices" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">{t('nav_voices')}</Link></li>
              <li><Link to="/faces" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">{t('nav_faces')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-900 dark:text-white uppercase tracking-wider mb-4">{t('nav_company')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">{t('nav_about')}</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">{t('nav_contact')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-900 dark:text-white uppercase tracking-wider mb-4">{t('newsletter_title')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('newsletter_desc')}</p>
            <div className="flex flex-col gap-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-neutral-light dark:bg-gray-900 border-0 rounded-l-md focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? '...' : t('subscribe')}
                </button>
              </div>
              {status === 'success' && <p className="text-xs text-green-600">Subscribed successfully!</p>}
              {status === 'error' && <p className="text-xs text-red-600">Failed to subscribe.</p>}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">{t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className={`flex-grow bg-white dark:bg-neutral-dark transition-colors ${!isHome ? 'pt-16' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
