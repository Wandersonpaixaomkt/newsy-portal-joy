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
  private eventBuffer: any[] = [];
  private bufferTimeout: any = null;

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
      this.bufferEvent('navigation_journey', {
        session_id: this.sessionId,
        from_path: this.lastPath,
        to_path: currentPath,
        sequence_order: Date.now()
      });
      this.lastPath = currentPath;
    }
  }

  private bufferEvent(table: string, data: any) {
    this.eventBuffer.push({ table, data });
    
    if (this.eventBuffer.length >= 5) {
      this.flushEvents();
    } else if (!this.bufferTimeout) {
      this.bufferTimeout = setTimeout(() => this.flushEvents(), 5000);
    }
  }

  private async flushEvents() {
    if (this.eventBuffer.length === 0) return;
    
    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];
    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
      this.bufferTimeout = null;
    }

    try {
      // Agrupar por tabela para inserção em lote
      const byTable: Record<string, any[]> = {};
      eventsToFlush.forEach(e => {
        if (!byTable[e.table]) byTable[e.table] = [];
        byTable[e.table].push(e.data);
      });

      for (const [table, data] of Object.entries(byTable)) {
        await supabase.from(table as any).insert(data as any);
      }
    } catch (e) {
      console.warn('Analytics flush error:', e);
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
    this.bufferEvent('analytics_events', {
      session_id: this.sessionId,
      ...event,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
    });
  }

  trackPageView(postId?: string | null) {
    this.trackEvent({
      event_type: 'page_view',
      page_path: window.location.pathname,
      post_id: postId || null
    });
    this.trackNavigation();
  }

  trackScroll(depth: number, postId?: string | null) {
    this.trackEvent({
      event_type: 'scroll_depth',
      page_path: window.location.pathname,
      post_id: postId || null,
      scroll_depth: depth
    });
  }

  trackCopyAttempt(postId?: string | null) {
    this.trackEvent({
      event_type: 'copy_attempt',
      page_path: window.location.pathname,
      post_id: postId || null
    });
  }

  trackClick(elementId: string, metadata?: any) {
    this.trackEvent({ event_type: 'click', page_path: window.location.pathname, element_id: elementId, metadata });
  }

  trackInteraction(type: string, postId: string | null = null, metadata: any = null) {
    this.trackEvent({
      event_type: type as any,
      page_path: window.location.pathname,
      post_id: postId,
      metadata
    });
  }
}

export const analytics = new AnalyticsService();
