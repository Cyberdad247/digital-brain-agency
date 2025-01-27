export interface ContentIdea {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'in-progress' | 'published';
  created: Date;
  agencyId: string;
}

export interface ContentPerformanceProps {
  contentId?: string;
  views?: number;
  engagementRate?: number;
  shares?: number;
  conversions?: number;
  lastUpdated?: Date;
  content: ContentIdea[];
}
