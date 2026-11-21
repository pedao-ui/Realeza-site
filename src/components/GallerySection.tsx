import {X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {GALLERY_CATEGORIES, GALLERY_PHOTOS, type GalleryPhoto} from '../data/barbershop';

interface GallerySectionProps {
  onBookStyle: (styleTitle: string) => void;
}

export function GallerySection({onBookStyle}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof GALLERY_CATEGORIES)[number]>('Todos');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos =
    activeCategory === 'Todos'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((photo) => photo.category === activeCategory);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section
      id="galeria"
      className="scroll-mt-16 border-t border-[#30395F]/35 bg-[#13151D] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl space-y-3">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.18] tracking-tight text-[#F1EAE0] text-balance">
              Galeria de cortes reais
            </h2>
            <p className="text-[15px] leading-relaxed text-[#F1EAE0]/75 sm:text-base">
              Resultados fotografados direto na cadeira da Realeza Visagismo em Salvador.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filtrar galeria de cortes"
            className="flex flex-wrap gap-1.5 border-b border-[#30395F]/50 pb-2 sm:gap-2"
          >
            {GALLERY_CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`min-h-[44px] rounded-sm px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors sm:text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F] ${
                    active
                      ? 'bg-[#CDA77F] text-[#101116]'
                      : 'text-[#F1EAE0]/70 hover:bg-[#30395F]/25 hover:text-[#F1EAE0]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filteredPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`Ampliar foto: ${photo.title}`}
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-[#F1EAE0]/10 bg-[#101116] text-left transition-colors hover:border-[#CDA77F]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101116]/90 via-[#101116]/20 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 sm:p-3.5">
                <span className="text-xs font-semibold leading-snug text-[#F1EAE0] sm:text-sm">
                  {photo.title}
                </span>
                <span className="text-[12px] text-[#CDA77F]">{photo.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090C]/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-sm border border-[#30395F] bg-[#161924]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#30395F]/60 px-4 py-3">
              <div className="min-w-0">
                <h3 id="lightbox-title" className="truncate font-display text-lg font-semibold text-[#F1EAE0]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-[#CDA77F]">{selectedPhoto.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Fechar visualização da foto"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#30395F] bg-[#101116] text-[#F1EAE0] hover:border-[#CDA77F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="aspect-[4/5] w-full bg-[#101116]">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                width={800}
                height={1000}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="border-t border-[#30395F]/60 p-4">
              <button
                type="button"
                onClick={() => {
                  const title = selectedPhoto.title;
                  setSelectedPhoto(null);
                  onBookStyle(title);
                }}
                className="min-h-[48px] w-full rounded-sm bg-[#CDA77F] px-4 py-3 text-sm font-semibold text-[#101116] transition-colors hover:bg-[#d8b896] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
              >
                Agendar esse estilo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
