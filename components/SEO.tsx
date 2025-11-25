
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
    title, 
    description = "Voices - A modern bilingual news platform for Mongolia.", 
    image = "/og-default.jpg",
    type = "article"
}) => {
  useEffect(() => {
    document.title = `${title} | Voices`;
    
    // Update meta tags
    const setMeta = (name: string, content: string) => {
        let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:image', image);
    setMeta('og:type', type);
    
  }, [title, description, image, type]);

  return null;
};
