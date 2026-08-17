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
  private activeStartTime: number = Date.now();

  constructor() {
    this.sessionId = this.getOrCreateId('nfe_session_id', true);
    this.visitorId = this.getOrCreateId('nfe_visitor_id', false);
  }

  private getOrCreateId(key: string, isSession: boolean): string {
    if (typeof window === 'undefined') return '';
    
    const storage = isSession ? sessionStorage : localStorage;
    let id = storage.getItem(key);
    
    if (!id) {
      id = crypto.randomUUID();
      storage.setItem(key, id);
    }
    
    return id;
  }

  private getBrowserInfo() {
    if (typeof window === 'undefined') return { name: 'unknown', version: 'unknown' };
    const ua = navigator.userAgent;
    let name = "Other";
    if (ua.includes("Firefox")) name = "Firefox";
    else if (ua.includes("SamsungBrowser")) name = "Samsung Browser";
    else if (ua.includes("Opera") || ua.includes("OPR")) name = "Opera";
    else if (ua.includes("Trident")) name = "Internet Explorer";
    else if (ua.includes("Edge")) name = "Edge";
    else if (ua.includes("Chrome")) name = "Chrome";
    else if (ua.includes("Safari")) name = "Safari";
    return { name };
  }

  private getRegionInfo() {
    if (typeof window === 'undefined') return 'unknown';
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return 'unknown';
    }
  }

  async initSession() {
    if (this.isInitialized || typeof window === 'undefined') return;

    const browser = this.getBrowserInfo();
    const region = this.getRegionInfo();

    try {
      const { data: session } = await supabase
        .from('analytics_sessions')
        .insert({
          id: this.sessionId,
          visitor_id: this.visitorId,
          entry_page: window.location.pathname,
          device_info: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            browser: browser.name,
            region: region
          }
        })
        .select()
        .single();

      if (session) {
        this.isInitialized = true;
        
        window.addEventListener('beforeunload', () => {
          this.endSession();
        });

        // Track active time
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            const duration = Math.round((Date.now() - this.activeStartTime) / 1000);
            this.trackEvent({
              event_type: 'engagement_heartbeat',
              page_path: window.location.pathname,
              engagement_time: duration
            });
          } else {
            this.activeStartTime = Date.now();
          }
        });
      }
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }

  async endSession() {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      await supabase
        .from('analytics_sessions')
        .update({
          ended_at: new Date().toISOString(),
          exit_page: window.location.pathname
        })
        .eq('id', this.sessionId);
    } catch (error) {
      // Silently fail as the page is unloading
    }
  }

  async trackEvent(event: AnalyticsEvent) {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    
    const eventData: any = {
      session_id: this.sessionId,
      event_type: event.event_type,
      page_path: event.page_path || window.location.pathname,
      post_id: event.post_id || null,
      element_id: event.element_id || null,
      metadata: event.metadata || {},
      user_agent: navigator.userAgent,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      referrer: event.referrer || document.referrer || null,
      utm_source: event.utm_source || urlParams.get('utm_source') || null,
      utm_medium: event.utm_medium || urlParams.get('utm_medium') || null,
      utm_campaign: event.utm_campaign || urlParams.get('utm_campaign') || null,
      engagement_time: event.engagement_time || 0,
      scroll_depth: event.scroll_depth || 0
    };

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([eventData]);
        
      if (error) throw error;
    } catch (error) {
      console.warn('Event tracking failed:', error);
    }
  }

  async trackInteraction(elementId: string, type: DetailedEventType | string, metadata?: any) {
    if (typeof window === 'undefined') return;
    
    try {
      // Log to both tables for redundancy and historical reasons if needed
      await supabase
        .from('interaction_logs')
        .insert({
          session_id: this.sessionId,
          element_id: elementId,
          element_type: type,
          page_path: window.location.pathname
        });

      await this.trackEvent({
        event_type: type,
        page_path: window.location.pathname,
        element_id: elementId,
        metadata: metadata
      });
    } catch (e) {
      console.error('Interaction logging failed', e);
    }
  }

  trackPageView(postId?: string | null) {
    this.trackEvent({
      event_type: 'page_view',
      page_path: window.location.pathname,
      post_id: postId || null
    });
    if (postId) {
      this.trackEvent({
        event_type: 'article_view',
        page_path: window.location.pathname,
        post_id: postId
      });
    }
  }

  trackClick(elementId: string, metadata?: Record<string, any> | null) {
    this.trackInteraction(elementId, 'click', metadata);
  }

  trackScroll(depth: number, postId?: string | null) {
    let eventType: DetailedEventType = 'scroll_depth';
    if (depth >= 25) eventType = 'article_read_25';
    if (depth >= 50) eventType = 'article_read_50';
    if (depth >= 75) eventType = 'article_read_75';
    if (depth >= 100) eventType = 'article_read_complete';

    this.trackEvent({
      event_type: eventType,
      page_path: window.location.pathname,
      post_id: postId || null,
      scroll_depth: depth,
      metadata: { depth }
    });
  }

  trackSearch(query: string) {
    this.trackEvent({
      event_type: 'search',
      page_path: window.location.pathname,
      metadata: { query }
    });
  }

  trackCopyAttempt(postId?: string | null) {
    this.trackEvent({
      event_type: 'copy_attempt',
      page_path: window.location.pathname,
      post_id: postId || null
    });
  }

  trackShare(platform: string, postId?: string | null) {
    this.trackEvent({
      event_type: 'share_click',
      page_path: window.location.pathname,
      post_id: postId || null,
      metadata: { platform }
    });
  }
}

export const analytics = new AnalyticsService();
