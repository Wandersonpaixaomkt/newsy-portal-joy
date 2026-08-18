/**
 * Banners de publicidade em localStorage (modo mock).
 * Usado enquanto o Supabase de ads não está estável.
 */

export type LocalAd = {
  id: string;
  name: string;
  image_url: string;
  target_url: string;
  slot: 'topo' | 'lateral' | 'rodape' | 'entre-noticias';
  status: 'active' | 'inactive';
  created_at: string;
};

const STORAGE_KEY = 'norte-em-foco-ads';

export function getLocalAds(): LocalAd[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(ads: LocalAd[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
}

export function saveLocalAd(ad: LocalAd): LocalAd {
  const ads = getLocalAds();
  const idx = ads.findIndex((a) => a.id === ad.id);
  if (idx >= 0) {
    ads[idx] = ad;
  } else {
    ads.unshift(ad);
  }
  saveAll(ads);
  return ad;
}

export function deleteLocalAd(id: string): boolean {
  const ads = getLocalAds();
  const next = ads.filter((a) => a.id !== id);
  if (next.length === ads.length) return false;
  saveAll(next);
  return true;
}

export function generateAdId(): string {
  return `ad-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
