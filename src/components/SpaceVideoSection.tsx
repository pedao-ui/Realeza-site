import {MessageCircle, Play} from 'lucide-react';
import {useRef, useState} from 'react';
import {BUSINESS_INFO} from '../data/barbershop';
import {buildDirectWhatsAppUrl} from '../utils/booking';

export function SpaceVideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    setHasStarted(true);
    const el = videoRef.current;
    if (el) {
      el.play().catch(() => {
        // Native controls remain visible if autoplay is blocked
      });
    }
  };

  const whatsappUrl = buildDirectWhatsAppUrl(
    BUSINESS_INFO.whatsappDigits,
    'Visitar a barbearia em Salvador',
  );

  return (
    <section
      id="espaco"
      className="scroll-mt-16 border-t border-[#30395F]/35 bg-[#13151D] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-sm border border-[#30395F]/70 bg-[#101116]">
              <video
                ref={videoRef}
                src={BUSINESS_INFO.videoSrc}
                poster={BUSINESS_INFO.videoPosterSrc}
                controls={hasStarted}
                playsInline
                preload="metadata"
                aria-label="Tour em vídeo pelo espaço da Realeza Visagismo em Salvador"
                className="h-full w-full object-cover"
              />

              {!hasStarted && (
                <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-[#101116]/90 via-[#101116]/30 to-transparent p-6 text-center">
                  <button
                    type="button"
                    onClick={handlePlay}
                    aria-label="Reproduzir tour pelo espaço Realeza Visagismo"
                    className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#CDA77F]/60 bg-[#CDA77F] text-[#101116] transition-transform duration-150 hover:scale-105 hover:bg-[#d8b896] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F1EAE0]"
                  >
                    <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
                  </button>
                  <p className="font-display text-lg font-semibold text-[#F1EAE0]">
                    Tour pelo espaço
                  </p>
                  <p className="mt-1 text-xs text-[#F1EAE0]/70">
                    Toque para assistir por dentro da barbearia
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 space-y-6 lg:order-2 lg:col-span-7">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.18] tracking-tight text-[#F1EAE0] text-balance">
              Conheça nosso espaço em Salvador
            </h2>

            <p className="max-w-2xl text-[15px] leading-relaxed text-[#F1EAE0]/75 sm:text-base">
              Você entra pela rampa de acesso direto no lounge climatizado, toma uma cerveja gelada no balcão enquanto acompanha o movimento e senta na cadeira de visagismo no horário exato que reservou.
            </p>

            <div className="grid grid-cols-1 gap-6 border-t border-[#F1EAE0]/10 pt-6 sm:grid-cols-2 sm:gap-8">
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-[#CDA77F]">
                  01. Lounge e Bar
                </h3>
                <p className="text-sm leading-relaxed text-[#F1EAE0]/75">
                  Balcão próprio com cerveja gelada, sofá Chesterfield, televisão e linha completa de produtos masculinos.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-[#CDA77F]">
                  02. Sala de Visagismo
                </h3>
                <p className="text-sm leading-relaxed text-[#F1EAE0]/75">
                  Iluminação técnica, espelhos amplos e cadeiras ergonômicas preparadas para corte, barba e toalha quente.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm border border-[#30395F] bg-[#30395F]/15 px-6 py-3 text-sm font-medium text-[#F1EAE0]/90 transition-colors hover:border-[#CDA77F]/65 hover:text-[#F1EAE0] sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-[#CDA77F]" aria-hidden="true" />
                <span>Tirar dúvidas de localização no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
