import {MessageCircle} from 'lucide-react';
import {BUSINESS_INFO} from '../data/barbershop';
import {buildDirectWhatsAppUrl} from '../utils/booking';
import {BrandEmblem} from './BrandEmblem';

export function Footer() {
  const whatsappUrl = buildDirectWhatsAppUrl(
    BUSINESS_INFO.whatsappDigits,
    'Agendamento e informações sobre a Realeza Visagismo',
  );
  const telHref = `tel:+${BUSINESS_INFO.whatsappDigits}`;

  return (
    <footer className="border-t border-[#30395F]/40 bg-[#0B0C10] py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-[#F1EAE0]/10 pb-10 md:grid-cols-12">
          <div className="flex items-start gap-4 md:col-span-5">
            <BrandEmblem size="lg" />
            <div className="space-y-2">
              <p className="font-display text-lg font-semibold text-[#CDA77F]">
                Realeza Visagismo
              </p>
              <p className="text-sm leading-relaxed text-[#F1EAE0]/70">
                Barbearia e visagismo masculino em Salvador. Corte pensado para o seu rosto, barba na toalha quente e ambiente climatizado.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm md:col-span-4">
            <p className="font-display text-base font-semibold text-[#F1EAE0]">
              Endereço e Horários
            </p>
            <p className="text-[#F1EAE0]/80">{BUSINESS_INFO.address}</p>
            <p className="text-[#F1EAE0]/65">{BUSINESS_INFO.hoursSummary}</p>
            <p className="text-[#F1EAE0]/85 tabular-nums">
              Telefone:{' '}
              <a
                href={telHref}
                className="underline decoration-[#30395F] underline-offset-4 hover:text-[#CDA77F] hover:decoration-[#CDA77F]"
              >
                {BUSINESS_INFO.phoneDisplay}
              </a>
            </p>
          </div>

          <div className="space-y-3 md:col-span-3">
            <p className="font-display text-base font-semibold text-[#F1EAE0]">
              Atendimento rápido
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-[#30395F] bg-[#30395F]/20 px-4 py-2.5 text-sm font-medium text-[#F1EAE0] transition-colors hover:border-[#CDA77F] hover:text-[#CDA77F]"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[#CDA77F]" aria-hidden="true" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 pt-6 text-xs text-[#F1EAE0]/55 sm:flex-row sm:items-center">
          <p>Realeza Visagismo. Salvador, Bahia.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href="#antes-depois" className="inline-flex min-h-[44px] items-center hover:text-[#CDA77F]">
              Antes e Depois
            </a>
            <a href="#espaco" className="inline-flex min-h-[44px] items-center hover:text-[#CDA77F]">
              Espaço
            </a>
            <a href="#servicos" className="inline-flex min-h-[44px] items-center hover:text-[#CDA77F]">
              Serviços
            </a>
            <a href="#galeria" className="inline-flex min-h-[44px] items-center hover:text-[#CDA77F]">
              Galeria
            </a>
            <a href="#agendamento" className="inline-flex min-h-[44px] items-center hover:text-[#CDA77F]">
              Agendamento
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
