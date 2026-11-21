import {Instagram, X} from 'lucide-react';
import {useState} from 'react';
import {BUSINESS_INFO} from '../data/barbershop';
import {buildDirectWhatsAppUrl} from '../utils/booking';
import {BrandEmblem} from './BrandEmblem';

const NAV_LINKS = [
  {label: 'Antes e Depois', href: '#antes-depois'},
  {label: 'Espaço', href: '#espaco'},
  {label: 'Serviços', href: '#servicos'},
  {label: 'Galeria', href: '#galeria'},
  {label: 'Agendar', href: '#agendamento'},
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const whatsappUrl = buildDirectWhatsAppUrl(BUSINESS_INFO.whatsappDigits);

  return (
    <header className="sticky top-0 z-40 border-b border-[#30395F]/35 bg-[#101116]/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:gap-8">
        <a
          href="#topo"
          className="inline-flex min-h-[44px] items-center gap-2.5 font-display text-base font-semibold tracking-wide text-[#F1EAE0] whitespace-nowrap shrink-0 sm:gap-3 sm:text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CDA77F]"
        >
          <BrandEmblem size="sm" />
          <span>Realeza Visagismo</span>
        </a>

        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-[40px] items-center text-sm font-medium text-[#F1EAE0]/75 transition-colors duration-150 hover:text-[#F1EAE0] hover:underline hover:decoration-[#CDA77F] hover:underline-offset-8 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CDA77F]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center justify-center rounded-sm border border-[#30395F] bg-[#30395F]/20 px-4 py-2 text-xs font-semibold tracking-wider text-[#F1EAE0] uppercase transition-colors duration-150 hover:border-[#CDA77F] hover:text-[#CDA77F] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-[#F1EAE0] transition-colors duration-150 hover:text-[#CDA77F] md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
          ) : (
            <span className="flex w-5 flex-col items-end gap-1.5" aria-hidden="true">
              <span className="block h-[1.5px] w-5 bg-current transition-transform" />
              <span className="block h-[1.5px] w-3.5 bg-[#CDA77F] transition-transform" />
            </span>
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Menu mobile"
          className="border-t border-[#30395F]/40 bg-[#101116] px-4 pb-6 pt-2 md:hidden"
        >
          <div className="flex flex-col divide-y divide-[#30395F]/30">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[48px] items-center justify-between px-1 text-base font-medium text-[#F1EAE0]/90 transition-colors hover:text-[#CDA77F]"
              >
                <span>{link.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[48px] w-full items-center justify-center rounded-sm border border-[#30395F] bg-[#30395F]/25 px-4 py-3 text-sm font-semibold tracking-wider text-[#F1EAE0] uppercase transition-colors hover:border-[#CDA77F] hover:text-[#CDA77F]"
            >
              Falar no WhatsApp
            </a>
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-sm border border-[#30395F]/70 bg-transparent px-4 py-2.5 text-sm font-medium text-[#F1EAE0]/85 transition-colors hover:border-[#CDA77F] hover:text-[#CDA77F]"
            >
              <Instagram className="h-4 w-4 shrink-0 text-[#CDA77F]" aria-hidden="true" />
              <span>Instagram ({BUSINESS_INFO.instagramHandle})</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
