import type {ServiceItem} from '../data/barbershop';

export interface BookingFormInput {
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  notes: string;
}

export interface BookingValidationErrors {
  serviceId?: string;
  date?: string;
  time?: string;
  clientName?: string;
  clientPhone?: string;
}

const WEEKDAY_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:30',
  '14:30',
  '15:30',
  '16:30',
  '17:30',
  '18:30',
  '19:15',
];

const SATURDAY_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export function formatCurrencyBRL(value: number, billingCycle?: 'mensal'): string {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return billingCycle === 'mensal' ? `${formatted}/mês` : formatted;
}

export function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidBrazilPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

export function getDayOfWeekFromISODate(isoDate: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date.getUTCDay();
}

export function getAvailableTimeSlots(isoDate: string, service?: ServiceItem): string[] {
  const dayOfWeek = getDayOfWeekFromISODate(isoDate);
  if (dayOfWeek === null || dayOfWeek === 0) {
    return [];
  }
  if (service?.weekdaysOnly && (dayOfWeek === 5 || dayOfWeek === 6)) {
    return [];
  }
  if (dayOfWeek === 6) {
    return SATURDAY_SLOTS;
  }
  return WEEKDAY_SLOTS;
}

function toISODateLocal(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getNextOpenDateISO(
  referenceDate: Date = new Date(),
  service?: ServiceItem,
): string {
  const candidate = new Date(referenceDate);
  candidate.setDate(candidate.getDate() + 1);
  for (let i = 0; i < 14; i += 1) {
    const iso = toISODateLocal(candidate);
    if (getAvailableTimeSlots(iso, service).length > 0) {
      return iso;
    }
    candidate.setDate(candidate.getDate() + 1);
  }
  return toISODateLocal(candidate);
}

export function formatDateBR(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function validateBookingForm(
  input: BookingFormInput,
  service?: ServiceItem,
): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!service) {
    errors.serviceId = 'Escolha um serviço ou plano.';
  }

  const dayOfWeek = getDayOfWeekFromISODate(input.date);
  if (dayOfWeek === null) {
    errors.date = 'Informe uma data válida.';
  } else if (dayOfWeek === 0) {
    errors.date = 'Aos domingos a barbearia está fechada. Escolha de segunda a sábado.';
  } else if (service?.weekdaysOnly && (dayOfWeek === 5 || dayOfWeek === 6)) {
    errors.date = 'Os planos ilimitados atendem de segunda a quinta.';
  }

  const availableSlots = getAvailableTimeSlots(input.date, service);
  if (!input.time || (availableSlots.length > 0 && !availableSlots.includes(input.time))) {
    errors.time = 'Selecione um horário disponível.';
  }

  if (input.clientName.trim().length < 2) {
    errors.clientName = 'Digite seu nome para reservar.';
  }

  if (!isValidBrazilPhone(input.clientPhone)) {
    errors.clientPhone = 'Digite um WhatsApp válido com DDD (10 ou 11 dígitos).';
  }

  return errors;
}

export function buildWhatsAppBookingMessage(
  input: BookingFormInput,
  service: ServiceItem,
): string {
  const priceLabel = formatCurrencyBRL(service.price, service.billingCycle);
  const lines = [
    'Olá, equipe Realeza Visagismo em Salvador.',
    `Quero agendar: ${service.name} (${priceLabel}).`,
    `Data: ${formatDateBR(input.date)} às ${input.time}.`,
    `Nome: ${input.clientName.trim()}.`,
    `WhatsApp: ${input.clientPhone.trim()}.`,
  ];

  if (input.notes.trim()) {
    lines.push(`Observação: ${input.notes.trim()}.`);
  }

  return lines.join('\n');
}

export function buildWhatsAppBookingUrl(
  whatsappDigits: string,
  input: BookingFormInput,
  service: ServiceItem,
): string {
  const cleanDigits = whatsappDigits.replace(/\D/g, '');
  const text = encodeURIComponent(buildWhatsAppBookingMessage(input, service));
  return `https://wa.me/${cleanDigits}?text=${text}`;
}

export function buildQuickBookingWhatsAppUrl(
  whatsappDigits: string,
  service: ServiceItem,
  dateISO?: string,
  time?: string,
): string {
  const cleanDigits = whatsappDigits.replace(/\D/g, '');
  const priceLabel = formatCurrencyBRL(service.price, service.billingCycle);
  const parts = [
    'Olá, equipe Realeza Visagismo em Salvador.',
    `Gostaria de agendar: ${service.name} (${priceLabel}).`,
  ];
  if (dateISO && time) {
    parts.push(`Preferência: ${formatDateBR(dateISO)} às ${time}.`);
  }
  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(parts.join(' '))}`;
}

export function buildDirectWhatsAppUrl(whatsappDigits: string, subject?: string): string {
  const cleanDigits = whatsappDigits.replace(/\D/g, '');
  const message = subject
    ? `Olá, equipe Realeza Visagismo em Salvador! Gostaria de falar sobre: ${subject}.`
    : 'Olá, equipe Realeza Visagismo em Salvador! Gostaria de agendar um horário e tirar uma dúvida.';
  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
}
