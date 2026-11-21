import test from 'node:test';
import assert from 'node:assert/strict';
import {SERVICES} from '../data/barbershop';
import {
  buildDirectWhatsAppUrl,
  buildQuickBookingWhatsAppUrl,
  buildWhatsAppBookingMessage,
  buildWhatsAppBookingUrl,
  formatCurrencyBRL,
  getAvailableTimeSlots,
  getNextOpenDateISO,
  validateBookingForm,
} from './booking';

test('getAvailableTimeSlots respects Sunday closed and club Seg-Qui rule', () => {
  const regularCut = SERVICES.find((s) => s.id === 'corte-visagista');
  const clubCut = SERVICES.find((s) => s.id === 'clube-corte-ilimitado');

  // 2026-11-22 is Sunday
  assert.deepEqual(getAvailableTimeSlots('2026-11-22', regularCut), []);

  // 2026-11-21 is Saturday: open for regular cut, closed for Seg-Qui club
  assert.ok(getAvailableTimeSlots('2026-11-21', regularCut).includes('09:00'));
  assert.deepEqual(getAvailableTimeSlots('2026-11-21', clubCut), []);

  // 2026-11-24 is Tuesday: open for Seg-Qui club
  assert.ok(getAvailableTimeSlots('2026-11-24', clubCut).includes('18:30'));
});

test('getNextOpenDateISO skips Friday/Saturday/Sunday for weekdaysOnly plans', () => {
  const clubCut = SERVICES.find((s) => s.id === 'clube-corte-ilimitado')!;
  const nextClubDate = getNextOpenDateISO(new Date(2026, 10, 19), clubCut);
  assert.equal(nextClubDate, '2026-11-23');
});

test('validateBookingForm requires name, date, and time without client phone', () => {
  const regularCut = SERVICES.find((s) => s.id === 'corte-visagista')!;
  const invalid = validateBookingForm(
    {
      serviceId: regularCut.id,
      date: '2026-11-22',
      time: '',
      clientName: 'A',
      notes: '',
    },
    regularCut,
  );

  assert.ok(invalid.date);
  assert.ok(invalid.time);
  assert.ok(invalid.clientName);

  const valid = validateBookingForm(
    {
      serviceId: regularCut.id,
      date: '2026-11-24',
      time: '14:30',
      clientName: 'Rafael Santos',
      notes: 'Degrade baixo',
    },
    regularCut,
  );

  assert.deepEqual(valid, {});
});

test('all WhatsApp link builders target (71) 99652-9436 with clean ready messages', () => {
  const clubBarba = SERVICES.find((s) => s.id === 'clube-barba-ilimitada')!;
  assert.equal(formatCurrencyBRL(clubBarba.price, clubBarba.billingCycle), 'R$\u00a0129/mês');

  const bookingMsg = buildWhatsAppBookingMessage(
    {
      serviceId: clubBarba.id,
      date: '2026-11-24',
      time: '15:30',
      clientName: 'Lucas Andrade',
      notes: 'Barba alinhada',
    },
    clubBarba,
  );
  assert.ok(bookingMsg.includes('Lucas Andrade'));
  assert.ok(bookingMsg.includes('24/11/2026 às 15:30'));
  assert.ok(!bookingMsg.includes('WhatsApp:'));

  const url = buildWhatsAppBookingUrl(
    '5571996529436',
    {
      serviceId: clubBarba.id,
      date: '2026-11-24',
      time: '15:30',
      clientName: 'Lucas Andrade',
      notes: '',
    },
    clubBarba,
  );

  assert.ok(url.startsWith('https://wa.me/5571996529436?text='));
  const decoded = decodeURIComponent(url.split('text=')[1]);
  assert.ok(decoded.includes('Realeza Visagismo'));
  assert.ok(decoded.includes('Clube Barba Ilimitada'));
  assert.ok(decoded.includes('24/11/2026'));
  assert.ok(!decoded.includes('—'));
  assert.ok(!decoded.includes('–'));

  const directDefault = buildDirectWhatsAppUrl('5571996529436');
  const directSubject = buildDirectWhatsAppUrl('5571996529436', 'Atendimento e horários');
  const quickBooking = buildQuickBookingWhatsAppUrl('5571996529436', clubBarba, '2026-11-24', '14:30');

  for (const candidate of [directDefault, directSubject, quickBooking]) {
    assert.ok(candidate.startsWith('https://wa.me/5571996529436?text='));
    const text = decodeURIComponent(candidate.split('text=')[1]);
    assert.ok(text.length > 25);
    assert.ok(!text.includes('—'));
  }
});
