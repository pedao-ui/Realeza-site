import {BEFORE_AFTER_DATA} from '../data/barbershop';

export function BeforeAfterSection() {
  return (
    <section
      id="antes-depois"
      className="scroll-mt-16 border-t border-[#30395F]/35 bg-[#101116] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.18] tracking-tight text-[#F1EAE0] text-balance">
              Antes e depois de quem entende o seu rosto
            </h2>

            <blockquote className="border-y border-[#30395F]/60 py-5 font-display text-lg italic leading-relaxed text-[#CDA77F] sm:text-xl">
              "Não é sobre cortar mais curto. É sobre alinhar cada linha com a estrutura do seu rosto."
            </blockquote>

            <p className="text-[15px] leading-relaxed text-[#F1EAE0]/75 sm:text-base">
              {BEFORE_AFTER_DATA.subheadline}
            </p>

            <ul className="space-y-3 pt-1 text-sm text-[#F1EAE0]/85 sm:text-[15px]">
              {BEFORE_AFTER_DATA.details.map((item, index) => (
                <li key={item} className="flex items-baseline gap-3">
                  <span className="font-display text-sm font-semibold text-[#CDA77F] tabular-nums shrink-0">
                    0{index + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <figure className="overflow-hidden rounded-sm border border-[#F1EAE0]/10 bg-[#141722]">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={BEFORE_AFTER_DATA.beforeSrc}
                    alt={BEFORE_AFTER_DATA.beforeAlt}
                    width={1080}
                    height={1350}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <figcaption className="border-t border-[#F1EAE0]/10 px-3 py-3 text-center text-xs font-medium tracking-widest text-[#F1EAE0]/65 uppercase">
                  Antes
                </figcaption>
              </figure>

              <figure className="overflow-hidden rounded-sm border border-[#CDA77F]/50 bg-[#141722]">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={BEFORE_AFTER_DATA.afterSrc}
                    alt={BEFORE_AFTER_DATA.afterAlt}
                    width={1080}
                    height={1350}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <figcaption className="border-t border-[#CDA77F]/30 px-3 py-3 text-center text-xs font-semibold tracking-widest text-[#CDA77F] uppercase">
                  Depois na Realeza
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
