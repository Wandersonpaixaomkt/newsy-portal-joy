import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  event_type: string;
  page_path: string;
  post_id?: string;
  element_id?: string;
  metadata?: Record<string, any>;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
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
    
    const eventData = {
      session_id: this.sessionId,
      event_type: event.event_type,
      page_path: event.page_path || window.location.pathname,
      post_id: event.post_id,
      element_id: event.element_id,
      metadata: event.metadata || {},
      user_agent: navigator.userAgent,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      referrer: event.referrer || document.referrer,
      utm_source: event.utm_source || urlParams.get('utm_source'),
      utm_medium: event.utm_medium || urlParams.get('utm_medium'),
      utm_campaign: event.utm_campaign || urlParams.get('utm_campaign')
    };

    try {
      // Use sendBeacon for more reliability if available and simple enough
      // But for simplicity with Supabase client:
      const { error } = await supabase
        .from('analytics_events')
        .insert(eventData);
        
      if (error) throw error;
    } catch (error) {
      console.warn('Event tracking failed:', error);
    }
  }

  trackPageView(postId?: string) {
    this.trackEvent({
      event_type: 'page_view',
      page_path: window.location.pathname,
      post_id: postId
    });
  }

  trackClick(elementId: string, metadata?: Record<string, any>) {
    this.trackEvent({
      event_type: 'click',
      page_path: window.location.pathname,
      element_id: elementId,
      metadata
    });
  }

  trackScroll(depth: number, postId?: string) {
    this.trackEvent({
      event_type: `scroll_${depth}`,
      page_path: window.location.pathname,
      post_id: postId,
      metadata: { depth }
    });
  }
}

export const analytics = new AnalyticsService();
