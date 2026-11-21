import {Check, Copy, MessageCircle} from 'lucide-react';
import {useEffect, useMemo, useRef, useState, type FormEvent} from 'react';
import {BUSINESS_INFO, SERVICES} from '../data/barbershop';
import {
  buildQuickBookingWhatsAppUrl,
  buildWhatsAppBookingMessage,
  buildWhatsAppBookingUrl,
  formatCurrencyBRL,
  formatDateBR,
  formatPhoneInput,
  getAvailableTimeSlots,
  getNextOpenDateISO,
  validateBookingForm,
  type BookingFormInput,
  type BookingValidationErrors,
} from '../utils/booking';

interface BookingSectionProps {
  selectedServiceId: string;
  prefilledNote: string;
  onChangeServiceId: (id: string) => void;
}

export function BookingSection({
  selectedServiceId,
  prefilledNote,
  onChangeServiceId,
}: BookingSectionProps) {
  const defaultDate = useMemo(() => getNextOpenDateISO(), []);
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('10:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingFormInput | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const confirmPanelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefilledNote) {
      setNotes(`Referência: ${prefilledNote}`);
      setConfirmedBooking(null);
    }
  }, [prefilledNote]);

  const activeService = SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0];
  const availableSlots = useMemo(
    () => getAvailableTimeSlots(date, activeService),
    [date, activeService],
  );

  // When switching to a weekdaysOnly plan while a Friday/Saturday date is selected,
  // automatically snap to the next valid open weekday for that plan.
  useEffect(() => {
    if (activeService.weekdaysOnly && availableSlots.length === 0) {
      const nextValidWeekday = getNextOpenDateISO(new Date(), activeService);
      if (nextValidWeekday !== date) {
        setDate(nextValidWeekday);
      }
    }
  }, [activeService, availableSlots.length, date]);

  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(time)) {
      setTime(availableSlots[0]);
    } else if (availableSlots.length === 0) {
      setTime('');
    }
  }, [availableSlots, time]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: BookingFormInput = {
      serviceId: activeService.id,
      date,
      time,
      clientName,
      clientPhone,
      notes,
    };

    const nextErrors = validateBookingForm(payload, activeService);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setConfirmedBooking(payload);
      setCopiedMessage(false);
      requestAnimationFrame(() => {
        confirmPanelRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
      });
    }
  };

  const whatsappConfirmUrl = confirmedBooking
    ? buildWhatsAppBookingUrl(BUSINESS_INFO.whatsappDigits, confirmedBooking, activeService)
    : '';

  const readyMessagePreview = confirmedBooking
    ? buildWhatsAppBookingMessage(confirmedBooking, activeService)
    : '';

  const quickWhatsAppUrl = buildQuickBookingWhatsAppUrl(
    BUSINESS_INFO.whatsappDigits,
    activeService,
    date,
    time || undefined,
  );

  const handleCopyMessage = async () => {
    if (!readyMessagePreview || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(readyMessagePreview);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <section
      id="agendamento"
      className="scroll-mt-16 border-t border-[#30395F]/35 bg-[#101116] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl space-y-3">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.18] tracking-tight text-[#F1EAE0] text-balance">
            Agendamento online direto no WhatsApp
          </h2>
          <p className="text-[15px] leading-relaxed text-[#F1EAE0]/75 sm:text-base">
            Escolha o serviço, selecione dia e horário livre e confirme sua cadeira em segundos.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 rounded-sm border border-[#30395F]/65 bg-[#141722] p-5 sm:p-8 lg:col-span-7"
          >
            <div>
              <label htmlFor="booking-service" className="block text-sm font-medium text-[#F1EAE0]/85">
                Serviço ou plano
              </label>
              <select
                id="booking-service"
                value={activeService.id}
                onChange={(e) => {
                  onChangeServiceId(e.target.value);
                  setConfirmedBooking(null);
                  setErrors({});
                }}
                className="mt-2 min-h-[48px] w-full rounded-sm border border-[#30395F]/80 bg-[#101116] px-3.5 py-2.5 text-base text-[#F1EAE0] focus:border-[#CDA77F] focus:outline-none"
              >
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({formatCurrencyBRL(service.price, service.billingCycle)})
                  </option>
                ))}
              </select>
              {activeService.weekdaysOnly && (
                <p className="mt-1.5 text-xs text-[#F1EAE0]/65">
                  Este plano atende de segunda a quinta-feira.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-date" className="block text-sm font-medium text-[#F1EAE0]/85">
                  Data desejada
                </label>
                <input
                  id="booking-date"
                  type="date"
                  min={defaultDate}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setConfirmedBooking(null);
                  }}
                  className="mt-2 min-h-[48px] w-full rounded-sm border border-[#30395F]/80 bg-[#101116] px-3.5 py-2.5 text-base text-[#F1EAE0] tabular-nums focus:border-[#CDA77F] focus:outline-none"
                />
                {errors.date && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-[#fca5a5]">
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="booking-phone" className="block text-sm font-medium text-[#F1EAE0]/85">
                  Seu WhatsApp
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="(71) 99999-0000"
                  value={clientPhone}
                  onChange={(e) => {
                    setClientPhone(formatPhoneInput(e.target.value));
                    setConfirmedBooking(null);
                  }}
                  className="mt-2 min-h-[48px] w-full rounded-sm border border-[#30395F]/80 bg-[#101116] px-3.5 py-2.5 text-base text-[#F1EAE0] tabular-nums placeholder:text-[#F1EAE0]/40 focus:border-[#CDA77F] focus:outline-none"
                />
                {errors.clientPhone && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-[#fca5a5]">
                    {errors.clientPhone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-[#F1EAE0]/85">Horários disponíveis</span>
              {availableSlots.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {availableSlots.map((slot) => {
                    const selected = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setTime(slot);
                          setConfirmedBooking(null);
                        }}
                        aria-pressed={selected}
                        className={`min-h-[44px] rounded-sm border px-2 py-2 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F] ${
                          selected
                            ? 'border-[#CDA77F] bg-[#CDA77F] text-[#101116]'
                            : 'border-[#30395F]/75 bg-[#101116] text-[#F1EAE0]/80 hover:border-[#CDA77F]/60 hover:text-[#F1EAE0]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 space-y-2 rounded-sm border border-[#30395F]/75 bg-[#101116] p-3 text-sm text-[#F1EAE0]/75">
                  <p>Sem horários disponíveis para esta data. Selecione outro dia útil.</p>
                  <button
                    type="button"
                    onClick={() => setDate(getNextOpenDateISO(new Date(), activeService))}
                    className="min-h-[40px] text-xs font-semibold text-[#CDA77F] underline underline-offset-4 hover:text-[#F1EAE0]"
                  >
                    Selecionar próximo dia disponível
                  </button>
                </div>
              )}
              {errors.time && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-[#fca5a5]">
                  {errors.time}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="booking-name" className="block text-sm font-medium text-[#F1EAE0]/85">
                Seu nome
              </label>
              <input
                id="booking-name"
                type="text"
                autoComplete="name"
                placeholder="Como você prefere ser chamado"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setConfirmedBooking(null);
                }}
                className="mt-2 min-h-[48px] w-full rounded-sm border border-[#30395F]/80 bg-[#101116] px-3.5 py-2.5 text-base text-[#F1EAE0] placeholder:text-[#F1EAE0]/40 focus:border-[#CDA77F] focus:outline-none"
              />
              {errors.clientName && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-[#fca5a5]">
                  {errors.clientName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="booking-notes" className="block text-sm font-medium text-[#F1EAE0]/85">
                Observação de corte ou barba (opcional)
              </label>
              <input
                id="booking-notes"
                type="text"
                placeholder="Exemplo: Degradê baixo, barba na navalha"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setConfirmedBooking(null);
                }}
                className="mt-2 min-h-[48px] w-full rounded-sm border border-[#30395F]/80 bg-[#101116] px-3.5 py-2.5 text-base text-[#F1EAE0] placeholder:text-[#F1EAE0]/40 focus:border-[#CDA77F] focus:outline-none"
              />
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="submit"
                className="min-h-[50px] w-full rounded-sm bg-[#CDA77F] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#101116] transition-colors hover:bg-[#d8b896] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
              >
                Gerar reserva e enviar para o WhatsApp
              </button>

              <a
                href={quickWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-[#30395F]/75 bg-transparent px-4 py-2.5 text-xs font-medium text-[#F1EAE0]/80 transition-colors hover:border-[#CDA77F]/65 hover:text-[#F1EAE0]"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#CDA77F]" aria-hidden="true" />
                <span>Ou chamar direto no WhatsApp com o serviço selecionado</span>
              </a>
            </div>
          </form>

          <aside
            ref={confirmPanelRef}
            className="flex flex-col justify-between gap-6 rounded-sm border border-[#30395F]/65 bg-[#161924] p-6 sm:p-8 lg:col-span-5"
          >
            {!confirmedBooking ? (
              <div className="space-y-6">
                <div className="space-y-2 border-b border-[#F1EAE0]/10 pb-5">
                  <h3 className="font-display text-2xl font-semibold text-[#F1EAE0]">
                    Resumo da reserva
                  </h3>
                  <p className="text-sm text-[#F1EAE0]/70">
                    Confira os dados selecionados antes de enviar para nossa equipe em Salvador.
                  </p>
                </div>

                <dl className="space-y-4 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">Serviço</dt>
                    <dd className="text-right font-semibold text-[#F1EAE0]">{activeService.name}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">Duração estimada</dt>
                    <dd className="font-semibold text-[#F1EAE0] tabular-nums">
                      {activeService.durationMinutes} min
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">Data</dt>
                    <dd className="font-semibold text-[#F1EAE0] tabular-nums">{formatDateBR(date)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">Horário</dt>
                    <dd className="font-semibold text-[#F1EAE0] tabular-nums">
                      {time || 'Selecione uma data útil'}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-[#F1EAE0]/10 pt-4">
                    <dt className="text-base font-medium text-[#F1EAE0]/80">Valor</dt>
                    <dd className="font-display text-3xl font-semibold text-[#CDA77F] tabular-nums">
                      {formatCurrencyBRL(activeService.price, activeService.billingCycle)}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-[#F1EAE0]/10 pt-5 text-sm text-[#F1EAE0]/75">
                  <p className="font-semibold text-[#CDA77F]">Local de atendimento</p>
                  <p className="mt-1.5">{BUSINESS_INFO.address}</p>
                  <p className="mt-1 text-xs text-[#F1EAE0]/60">{BUSINESS_INFO.hoursSummary}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5" aria-live="polite">
                <div className="flex items-start gap-3 border-b border-[#F1EAE0]/10 pb-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#CDA77F] text-[#101116]">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#F1EAE0]">
                      Agendamento pronto
                    </h3>
                    <p className="mt-1 text-sm text-[#F1EAE0]/75">
                      Sua mensagem já está montada. Toque abaixo para abrir o WhatsApp e enviar.
                    </p>
                  </div>
                </div>

                <dl className="space-y-2.5 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">Cliente</dt>
                    <dd className="font-semibold text-[#F1EAE0]">{confirmedBooking.clientName}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">WhatsApp</dt>
                    <dd className="font-semibold text-[#F1EAE0] tabular-nums">
                      {confirmedBooking.clientPhone}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">Serviço</dt>
                    <dd className="text-right font-semibold text-[#F1EAE0]">{activeService.name}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#F1EAE0]/65">Data e hora</dt>
                    <dd className="font-semibold text-[#F1EAE0] tabular-nums">
                      {formatDateBR(confirmedBooking.date)} às {confirmedBooking.time}
                    </dd>
                  </div>
                </dl>

                <div className="rounded-sm border border-[#30395F]/75 bg-[#101116] p-3.5 text-xs leading-relaxed text-[#F1EAE0]/75">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#CDA77F]">Mensagem pronta</span>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex min-h-[32px] items-center gap-1.5 text-xs font-medium text-[#F1EAE0]/80 hover:text-[#CDA77F]"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copiedMessage ? 'Copiada' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="whitespace-pre-line">{readyMessagePreview}</p>
                </div>

                <div className="space-y-3 pt-1">
                  <a
                    href={whatsappConfirmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-sm bg-[#CDA77F] px-6 py-3.5 text-sm font-semibold text-[#101116] transition-colors hover:bg-[#d8b896] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDA77F]"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Confirmar no WhatsApp agora</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setConfirmedBooking(null)}
                    className="min-h-[44px] w-full rounded-sm border border-[#30395F] bg-[#101116] px-4 py-2.5 text-sm font-medium text-[#F1EAE0]/85 hover:border-[#CDA77F]"
                  >
                    Alterar horário ou serviço
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
