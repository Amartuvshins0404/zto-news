
export enum ContentType {
  Article = 'Article', // "Faces"
  Video = 'Video'      // "Voices"
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  type: ContentType;
  author: Author; 
  publishedAt: string; // ISO Date string
  imageUrl: string;
  videoUrl?: string; // For Voices
  readTime: number; // in minutes
  tags: string[];
  trending?: boolean;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number; 
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Snow';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface Comment {
  id: string;
  articleId?: string;
  author: string;
  text: string;
  date: string; 
  replies?: Comment[];
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  date: string;
  type: 'comment' | 'system' | 'alert';
}

// --- Analytics Types ---
export interface KPIData {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface TrendData {
  date: string;
  views: number;
  visitors: number;
}

export interface DeviceData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

export interface TrafficSource {
  source: string;
  count: number;
}

export interface TopContent {
  id: string;
  title: string;
  views: number;
  shares: number;
}

export interface AnalyticsDashboardData {
  kpis: KPIData[];
  trends: TrendData[];
  devices: DeviceData[];
  traffic: TrafficSource[];
  topContent: TopContent[];
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  date: string;
}