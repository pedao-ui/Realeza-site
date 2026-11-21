import {ArrowRight, MessageCircle} from 'lucide-react';
import {BUSINESS_INFO} from '../data/barbershop';
import {buildDirectWhatsAppUrl} from '../utils/booking';

interface HeroSectionProps {
  onBookClick: () => void;
}

export function HeroSection({onBookClick}: HeroSectionProps) {
  const whatsappUrl = buildDirectWhatsAppUrl(
    BUSINESS_INFO.whatsappDigits,
    'Agendamento na Realeza Visagismo em Salvador',
  );

  return (
    <section
      id="topo"
      className="scroll-mt-16 relative overflow-hidden bg-[#101116] pb-14 pt-0 sm:pt-8 lg:pb-24 lg:pt-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(48,57,95,0.28),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-6xl lg:px-6">
        <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-12 lg:gap-14">
          <div className="order-2 relative z-10 -mt-10 px-4 sm:px-6 lg:order-1 lg:col-span-6 lg:mt-0 lg:px-0">
            <div className="max-w-xl space-y-5 animate-subtle-reveal">
              <h1 className="font-display text-[clamp(2rem,3.8vw,3.35rem)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#F1EAE0] text-balance">
                Seu estilo merece um cuidado à altura.
              </h1>

              <p className="max-w-md text-[15px] leading-relaxed text-[#F1EAE0]/75 sm:text-lg">
                Visagismo, cortes e barba pensados para valorizar sua identidade.
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onBookClick}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-sm bg-[#CDA77F] px-7 py-3 text-sm font-semibold tracking-wide text-[#101116] transition-colors duration-150 hover:bg-[#d8b896] sm:w-auto whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
                >
                  <span>Agendar horário</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm border border-[#30395F] bg-[#101116]/60 px-6 py-3 text-sm font-medium text-[#F1EAE0]/85 transition-colors duration-150 hover:border-[#CDA77F]/65 hover:text-[#F1EAE0] sm:w-auto whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#CDA77F]" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-[#F1EAE0]/10 pt-5 text-xs tracking-wide text-[#F1EAE0]/60 sm:gap-x-3 sm:text-sm">
                <span>Salvador, BA</span>
                <span aria-hidden="true" className="text-[#CDA77F]/70">
                  ·
                </span>
                <span>Hora marcada</span>
                <span aria-hidden="true" className="text-[#CDA77F]/70">
                  ·
                </span>
                <span>Seg a Sáb</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="relative h-[44svh] min-h-[300px] max-h-[390px] w-full overflow-hidden bg-[#161924] sm:h-[460px] sm:max-h-none sm:rounded-sm lg:h-[580px]">
              <img
                src={BUSINESS_INFO.heroImageSrc}
                alt="Cliente da Realeza Visagismo com corte social degradê e barba alinhada"
                width={1080}
                height={1350}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-[50%_18%]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101116] via-[#101116]/25 to-transparent lg:from-[#101116]/80 lg:via-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none hidden lg:block absolute inset-0 ring-1 ring-inset ring-[#F1EAE0]/10"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mx-auto mt-14 hidden max-w-6xl px-4 sm:px-6 lg:mt-24 lg:block"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#30395F]/70 to-transparent" />
      </div>
    </section>
  );
}
