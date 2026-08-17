import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  event_type: string;
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

  async initSession() {
    if (this.isInitialized || typeof window === 'undefined') return;

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
            screenSize: `${window.innerWidth}x${window.innerHeight}`
          }
        })
        .select()
        .single();

      if (session) {
        this.isInitialized = true;
        
        window.addEventListener('beforeunload', () => {
          this.endSession();
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

  async trackInteraction(elementId: string, type: string) {
    if (typeof window === 'undefined') return;
    
    try {
      await supabase
        .from('interaction_logs')
        .insert({
          session_id: this.sessionId,
          element_id: elementId,
          element_type: type,
          page_path: window.location.pathname
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
  }

  trackClick(elementId: string, metadata?: Record<string, any> | null) {
    this.trackInteraction(elementId, 'click');
    this.trackEvent({
      event_type: 'click',
      page_path: window.location.pathname,
      element_id: elementId,
      metadata: metadata || null
    });
  }

  trackScroll(depth: number, postId?: string | null) {
    this.trackEvent({
      event_type: 'scroll',
      page_path: window.location.pathname,
      post_id: postId || null,
      scroll_depth: depth,
      metadata: { depth }
    });
  }
}

export const analytics = new AnalyticsService();
