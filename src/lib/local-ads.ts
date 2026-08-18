/**
 * Banners de publicidade em localStorage (modo mock).
 * Suporta: edição, status, agendamento, formato, páginas e rotação.
 */

export type AdSlot = 'topo' | 'lateral' | 'rodape' | 'entre-noticias';
export type AdFormat = '1:1' | '3:4' | 'full';
export type AdPage = 'home' | 'noticia' | 'categoria' | 'todas';

export type LocalAd = {
  id: string;
  name: string;
  image_url: string;
  target_url: string;
  slot: AdSlot;
  /** Formato visual — relevante principalmente para lateral */
  format: AdFormat;
  /** Páginas onde o banner pode aparecer */
  pages: AdPage[];
  status: 'active' | 'inactive';
  start_date: string | null;
  end_date: string | null;
  /** Se true, participa da rotação no mesmo slot+format */
  rotate: boolean;
  created_at: string;
  updated_at: string;
};

const STORAGE_KEY = 'norte-em-foco-ads-v2';
const LEGACY_KEY = 'norte-em-foco-ads';

const MAX_ROTATION = 4;
/** Tempo de cada banner na rotação (ms) */
export const ROTATION_INTERVAL_MS = 6000;

function migrateLegacy(): LocalAd[] {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((a: any) => ({
      id: a.id,
      name: a.name || 'Banner',
      image_url: a.image_url || '',
      target_url: a.target_url || '',
      slot: a.slot || 'topo',
      format: a.format || (a.slot === 'lateral' ? '1:1' : 'full'),
      pages: a.pages || (['todas'] as AdPage[]),
      status: a.status || 'active',
      start_date: a.start_date || null,
      end_date: a.end_date || null,
      rotate: a.rotate !== false,
      created_at: a.created_at || new Date().toISOString(),
      updated_at: a.updated_at || a.created_at || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export function getLocalAds(): LocalAd[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    // migra versão antiga uma vez
    const legacy = migrateLegacy();
    if (legacy.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    }
    return legacy;
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
  const toSave = { ...ad, updated_at: new Date().toISOString() };
  if (idx >= 0) {
    ads[idx] = toSave;
  } else {
    ads.unshift(toSave);
  }
  saveAll(ads);
  return toSave;
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

/** Verifica se o anúncio está dentro do período agendado */
export function isWithinSchedule(ad: LocalAd, now = new Date()): boolean {
  if (ad.start_date) {
    const start = new Date(ad.start_date);
    if (now < start) return false;
  }
  if (ad.end_date) {
    // end_date no input date é meia-noite; considera o dia inteiro
    const end = new Date(ad.end_date);
    end.setHours(23, 59, 59, 999);
    if (now > end) return false;
  }
  return true;
}

export function isAdVisibleOnPage(ad: LocalAd, page: AdPage): boolean {
  if (!ad.pages || ad.pages.length === 0) return true;
  if (ad.pages.includes('todas')) return true;
  return ad.pages.includes(page);
}

/**
 * Retorna anúncios ativos, no prazo e para a página,
 * filtrados por slot (e opcionalmente formato).
 * Ordenados por created_at (mais antigos primeiro) para rotação justa.
 */
export function getActiveAdsForSlot(
  slot: AdSlot,
  options?: {
    format?: AdFormat;
    page?: AdPage;
    now?: Date;
  },
): LocalAd[] {
  const page = options?.page || 'home';
  const now = options?.now || new Date();

  return getLocalAds()
    .filter((ad) => {
      if (ad.slot !== slot) return false;
      if (ad.status !== 'active') return false;
      if (!isWithinSchedule(ad, now)) return false;
      if (!isAdVisibleOnPage(ad, page)) return false;
      if (options?.format && ad.format !== options.format) return false;
      return !!ad.image_url;
    })
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
}

/**
 * Para rotação: pega os candidatos do slot/formato.
 * Se > MAX_ROTATION, usa janela deslizante baseada no tempo
 * para que todos tenham o mesmo tempo de tela ao longo do dia.
 */
export function getRotationPool(
  slot: AdSlot,
  options?: { format?: AdFormat; page?: AdPage },
): LocalAd[] {
  const all = getActiveAdsForSlot(slot, options).filter((a) => a.rotate !== false);
  // anúncios com rotate=false não entram no pool (exibidos sozinhos se forem o único)
  const exclusive = getActiveAdsForSlot(slot, options).filter((a) => a.rotate === false);

  if (exclusive.length > 0 && all.length === 0) {
    return exclusive.slice(0, 1);
  }

  if (all.length <= MAX_ROTATION) return all;

  // Janela de 4 anúncios que avança a cada ciclo completo
  // ciclo = MAX_ROTATION * intervalo → todos têm tempo igual
  const cycleMs = MAX_ROTATION * ROTATION_INTERVAL_MS;
  const fullCycles = Math.floor(Date.now() / cycleMs);
  const offset = (fullCycles * MAX_ROTATION) % all.length;

  const pool: LocalAd[] = [];
  for (let i = 0; i < MAX_ROTATION; i++) {
    pool.push(all[(offset + i) % all.length]);
  }
  return pool;
}

/** Índice atual da rotação com base no tempo */
export function getRotationIndex(poolSize: number, intervalMs = ROTATION_INTERVAL_MS): number {
  if (poolSize <= 1) return 0;
  return Math.floor(Date.now() / intervalMs) % poolSize;
}
