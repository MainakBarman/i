export interface Post {
  id: number;
  title: string;
  content: string;
  type: 'travel' | 'journal';
  image_url: string;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export interface AnalyticsData {
  date: string;
  views: number;
}
