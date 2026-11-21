import {BUSINESS_INFO, SERVICES} from '../data/barbershop';
import {buildDirectWhatsAppUrl, formatCurrencyBRL} from '../utils/booking';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export function ServicesSection({onSelectService}: ServicesSectionProps) {
  const individualServices = SERVICES.filter((s) => s.category !== 'clube');
  const clubPlans = SERVICES.filter((s) => s.category === 'clube');

  return (
    <section
      id="servicos"
      className="scroll-mt-16 border-t border-[#30395F]/35 bg-[#101116] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl space-y-3">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.18] tracking-tight text-[#F1EAE0] text-balance">
            Serviços e Clube Realeza
          </h2>
          <p className="text-[15px] leading-relaxed text-[#F1EAE0]/75 sm:text-base">
            Escolha um atendimento avulso ou entre para a assinatura mensal de segunda a quinta com valor fixo.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="divide-y divide-[#F1EAE0]/10 border-y border-[#F1EAE0]/10 lg:col-span-7">
            {individualServices.map((service, index) => (
              <div
                key={service.id}
                className="flex flex-col justify-between gap-4 py-6 sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5 pr-2">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="font-display text-sm font-semibold text-[#CDA77F] tabular-nums">
                      0{index + 1}.
                    </span>
                    <h3 className="font-display text-xl font-semibold text-[#F1EAE0]">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#F1EAE0]/75">{service.summary}</p>
                  <p className="text-xs tracking-wide text-[#F1EAE0]/55">
                    {service.durationMinutes} min · {service.highlights.join(' · ')}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1 sm:flex-col sm:items-end sm:pt-0 shrink-0">
                  <span className="font-display text-2xl font-semibold text-[#CDA77F] tabular-nums">
                    {formatCurrencyBRL(service.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.id)}
                    className="min-h-[44px] rounded-sm border border-[#30395F] bg-transparent px-5 py-2 text-xs font-semibold tracking-wider text-[#F1EAE0] uppercase transition-colors hover:border-[#CDA77F] hover:text-[#CDA77F] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5">
            {clubPlans.map((plan) => {
              const whatsappUrl = buildDirectWhatsAppUrl(
                BUSINESS_INFO.whatsappDigits,
                `${plan.name} (${formatCurrencyBRL(plan.price, plan.billingCycle)})`,
              );

              return (
                <article
                  key={plan.id}
                  className="flex flex-col justify-between gap-5 rounded-sm border border-[#30395F]/75 bg-[#161924] p-6"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-[#F1EAE0]/10 pb-4">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-semibold text-[#F1EAE0]">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-[#F1EAE0]/60">
                        Válido de segunda a quinta
                      </p>
                    </div>
                    <p className="font-display text-2xl font-semibold text-[#CDA77F] tabular-nums shrink-0 sm:text-3xl">
                      {formatCurrencyBRL(plan.price, plan.billingCycle)}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-[#F1EAE0]/80">{plan.summary}</p>

                  <ul className="space-y-2 text-sm text-[#F1EAE0]/90">
                    {plan.highlights.map((item) => (
                      <li key={item} className="flex items-baseline gap-2.5">
                        <span className="text-[#CDA77F]" aria-hidden="true">
                          ·
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => onSelectService(plan.id)}
                      className="min-h-[44px] flex-1 rounded-sm bg-[#CDA77F] px-4 py-2.5 text-sm font-semibold text-[#101116] transition-colors hover:bg-[#d8b896] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
                    >
                      Agendar com plano
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-sm border border-[#30395F] bg-[#101116]/50 px-4 py-2.5 text-sm font-medium text-[#F1EAE0]/90 transition-colors hover:border-[#CDA77F]/65 hover:text-[#F1EAE0] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
                    >
                      Assinar no WhatsApp
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
