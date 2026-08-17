import { supabase } from "@/integrations/supabase/client";

export type DetailedEventType = 
  | 'page_view' 
  | 'article_view' 
  | 'article_read_start' 
  | 'article_read_25' 
  | 'article_read_50' 
  | 'article_read_75' 
  | 'article_read_complete'
  | 'scroll_depth' 
  | 'search' 
  | 'category_click' 
  | 'city_click'
  | 'article_card_click'
  | 'related_article_click'
  | 'share_click' 
  | 'source_link_click'
  | 'ad_impression'
  | 'ad_click' 
  | 'newsletter_submit'
  | 'pauta_click'
  | 'navigation_click'
  | 'copy_attempt';

export interface AnalyticsEvent {
  event_type: DetailedEventType | string;
  page_path: string;
  post_id?: string | null;
  element_id?: string | null;
  metadata?: Record<string, any> | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  engagement_time?: number;
  scroll_depth?: number;
}

class AnalyticsService {
  private sessionId: string;
  private visitorId: string;
  private isInitialized = false;
  private lastPath: string = '';

  constructor() {
    this.sessionId = this.getOrCreateId('nfe_session_id', true);
    this.visitorId = this.getOrCreateId('nfe_visitor_id', false);
    this.lastPath = typeof window !== 'undefined' ? window.location.pathname : '';
  }

  private getOrCreateId(key: string, isSession: boolean): string {
    if (typeof window === 'undefined') return '';
    const storage = isSession ? sessionStorage : localStorage;
    let id = storage.getItem(key);
    if (!id) { id = crypto.randomUUID(); storage.setItem(key, id); }
    return id;
  }

  async trackNavigation() {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname;
    if (currentPath !== this.lastPath) {
      await supabase.from('navigation_journeys').insert({
        session_id: this.sessionId,
        from_path: this.lastPath,
        to_path: currentPath,
        sequence_order: Date.now()
      });
      this.lastPath = currentPath;
    }
  }

  async initSession() {
    if (this.isInitialized || typeof window === 'undefined') return;
    try {
      await supabase.from('analytics_sessions').insert({
        id: this.sessionId,
        visitor_id: this.visitorId,
        entry_page: window.location.pathname
      });
      this.isInitialized = true;
      await this.trackNavigation();
    } catch (e) { console.warn(e); }
  }

  async trackEvent(event: AnalyticsEvent) {
    if (typeof window === 'undefined') return;
    try {
      await supabase.from('analytics_events').insert([{
        session_id: this.sessionId,
        ...event,
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
      }]);
    } catch (e) { console.warn(e); }
  }

  trackClick(elementId: string, metadata?: any) {
    this.trackEvent({ event_type: 'click', page_path: window.location.pathname, element_id: elementId, metadata });
  }
}

export const analytics = new AnalyticsService();
