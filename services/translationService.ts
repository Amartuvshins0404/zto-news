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
  saveAllTranslations: () => Promise<void>;
  refreshTranslations: () => Promise<void>;
  clearCache: () => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

// Cache configuration
const CACHE_KEY = 'translations_cache';
const CACHE_VERSION_KEY = 'translations_cache_version';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheData {
  version: number;
  timestamp: number;
  data: Record<string, Record<string, string>>;
  languages: string[];
}

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return localStorage.getItem('selectedLanguage') || 'mn';
  });
  const [dictionary, setDictionary] = useState<Record<string, Record<string, string>>>({});
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en', 'mn']); // Start with defaults
  const [isLoading, setIsLoading] = useState(true);

  // Check if cache is valid
  const isCacheValid = (cacheData: CacheData): boolean => {
    const now = Date.now();
    const age = now - cacheData.timestamp;
    return age < CACHE_TTL && cacheData.version === getCacheVersion();
  };

  // Get current cache version
  const getCacheVersion = (): number => {
    const version = localStorage.getItem(CACHE_VERSION_KEY);
    return version ? parseInt(version) : 1;
  };

  // Invalidate cache by incrementing version
  const invalidateCache = () => {
    const newVersion = getCacheVersion() + 1;
    localStorage.setItem(CACHE_VERSION_KEY, newVersion.toString());
    localStorage.removeItem(CACHE_KEY);
  };

  // Load from cache
  const loadFromCache = (): CacheData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);
      if (isCacheValid(cacheData)) {
        return cacheData;
      }
      return null;
    } catch (error) {
      console.error('Failed to load cache:', error);
      return null;
    }
  };

  // Save to cache
  const saveToCache = (data: Record<string, Record<string, string>>, languages: string[]) => {
    try {
      const cacheData: CacheData = {
        version: getCacheVersion(),
        timestamp: Date.now(),
        data,
        languages
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  };

  // Load translations from database
  const loadFromDatabase = async (): Promise<{ data: Record<string, Record<string, string>>; languages: string[] }> => {
    try {
      const { data: rows, error } = await supabase
        .from('translations')
        .select('*')
        .order('lang_code');

      if (error) throw error;

      const loadedDict: Record<string, Record<string, string>> = {};
      const langs = new Set<string>();

      rows?.forEach((row: any) => {
        if (!loadedDict[row.lang_code]) {
          loadedDict[row.lang_code] = {};
        }
        loadedDict[row.lang_code][row.key] = row.value;
        langs.add(row.lang_code);
      });

      const languages = Array.from(langs);
      return { data: loadedDict, languages };
    } catch (error) {
      console.error('Failed to load translations from database:', error);
      return { data: {}, languages: [] };
    }
  };

  // Initial load with caching strategy
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);

      // Try to load from cache first
      const cached = loadFromCache();
      if (cached) {
        console.log('✅ Loaded translations from cache');
        setDictionary(cached.data);
        setAvailableLanguages(cached.languages);
        setIsLoading(false);
        return;
      }

      // Cache miss - load from database
      console.log('⚠️ Cache miss - loading from database');
      const { data, languages } = await loadFromDatabase();

      setDictionary(data);
      setAvailableLanguages(languages);
      saveToCache(data, languages);
      setIsLoading(false);
    };

    loadTranslations();
  }, []);

  // Save selected language to localStorage
  useEffect(() => {
    localStorage.setItem('selectedLanguage', lang);
  }, [lang]);

  const t = (key: string) => {
    if (isLoading) return key;
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

  const updateTranslation = (targetLang: string, key: string, value: string) => {
    // Update React state immediately for instant UI feedback
    setDictionary(prev => ({
      ...prev,
      [targetLang]: {
        ...prev[targetLang],
        [key]: value
      }
    }));
  };

  const saveAllTranslations = async () => {
    try {
      // Prepare all translations for batch upsert
      const allTranslations: any[] = [];

      for (const langCode of Object.keys(dictionary)) {
        for (const key of Object.keys(dictionary[langCode])) {
          allTranslations.push({
            lang_code: langCode,
            key: key,
            value: dictionary[langCode][key]
          });
        }
      }

      // Batch upsert to database
      const { error } = await supabase
        .from('translations')
        .upsert(allTranslations, { onConflict: 'lang_code,key' });

      if (error) throw error;

      // Invalidate cache so it will be refreshed on next load
      invalidateCache();

      // Update cache with current data
      saveToCache(dictionary, availableLanguages);

      console.log('✅ Translations saved to database');
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to save translations:', error);
      return Promise.reject(error);
    }
  };

  const addLanguage = (newLang: string) => {
    if (!dictionary[newLang]) {
      // Clone English as base
      const newDict = { ...dictionary['en'] };
      setDictionary(prev => ({ ...prev, [newLang]: newDict }));
      setAvailableLanguages(prev => [...prev, newLang]);
    }
  };

  const removeLanguage = async (targetLang: string) => {
    if (targetLang === 'mn' || targetLang === 'en') return;

    try {
      // Remove from database
      await supabase
        .from('translations')
        .delete()
        .eq('lang_code', targetLang);

      // Remove from state
      const newDict = { ...dictionary };
      delete newDict[targetLang];
      setDictionary(newDict);
      setAvailableLanguages(prev => prev.filter(l => l !== targetLang));

      // Invalidate cache
      invalidateCache();

      if (lang === targetLang) setLang('en');
    } catch (error) {
      console.error('Failed to remove language:', error);
    }
  };

  const refreshTranslations = async () => {
    console.log('🔄 Refreshing translations from database...');
    const { data, languages } = await loadFromDatabase();
    setDictionary(data);
    setAvailableLanguages(languages);
    saveToCache(data, languages);
  };

  const clearCache = () => {
    console.log('🗑️ Clearing translation cache');
    invalidateCache();
  };

  return React.createElement(
    TranslationContext.Provider,
    {
      value: {
        lang, setLang, t, formatDate,
        dictionary, updateTranslation, addLanguage, removeLanguage,
        availableLanguages, saveAllTranslations, refreshTranslations, clearCache
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
