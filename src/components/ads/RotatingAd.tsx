import { useEffect, useState } from 'react';
import {
  getRotationPool,
  getRotationIndex,
  ROTATION_INTERVAL_MS,
  type AdSlot,
  type AdFormat,
  type AdPage,
  type LocalAd,
} from '@/lib/local-ads';

type Props = {
  slot: AdSlot;
  format?: AdFormat;
  page?: AdPage;
  className?: string;
  /** Placeholder quando não há ad */
  placeholder?: React.ReactNode;
  /** Aspect ratio CSS, ex: aspect-square, aspect-[3/4] */
  aspectClass?: string;
  maxWidth?: number;
};

/**
 * Exibe um banner com rotação automática entre até 4 anúncios
 * do mesmo slot/formato. Se houver mais de 4, todos se revezam
 * com tempo de tela igual.
 */
export function RotatingAd({
  slot,
  format,
  page = 'home',
  className = '',
  placeholder,
  aspectClass,
  maxWidth,
}: Props) {
  const [pool, setPool] = useState<LocalAd[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const p = getRotationPool(slot, { format, page });
      setPool(p);
      setIndex(getRotationIndex(p.length));
    };
    refresh();
    const t = setInterval(refresh, ROTATION_INTERVAL_MS);
    return () => clearInterval(t);
  }, [slot, format, page]);

  const ad = pool[index];

  if (!ad) {
    return placeholder ? <>{placeholder}</> : null;
  }

  return (
    <a
      href={ad.target_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`block overflow-hidden transition-opacity hover:opacity-95 ${aspectClass || ''} ${className}`}
      style={maxWidth ? { maxWidth } : undefined}
      title={ad.name}
    >
      <img
        src={ad.image_url}
        alt={ad.name || 'Publicidade'}
        className={`w-full h-full ${aspectClass ? 'object-cover' : 'h-auto block object-contain'}`}
      />
      {pool.length > 1 && (
        <div className="flex justify-center gap-1 py-1.5 bg-black/5">
          {pool.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === index ? 'w-4 bg-red-600' : 'w-1.5 bg-neutral-300'
              }`}
            />
          ))}
        </div>
      )}
    </a>
  );
}
