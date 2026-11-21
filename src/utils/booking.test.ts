import test from 'node:test';
import assert from 'node:assert/strict';
import {SERVICES} from '../data/barbershop';
import {
  buildDirectWhatsAppUrl,
  buildQuickBookingWhatsAppUrl,
  buildWhatsAppBookingMessage,
  buildWhatsAppBookingUrl,
  formatCurrencyBRL,
  formatPhoneInput,
  getAvailableTimeSlots,
  getNextOpenDateISO,
  isValidBrazilPhone,
  validateBookingForm,
} from './booking';

test('formatPhoneInput formats 11-digit Salvador mobile numbers', () => {
  assert.equal(formatPhoneInput('71998765432'), '(71) 99876-5432');
  assert.equal(formatPhoneInput('7133445566'), '(71) 3344-5566');
  assert.equal(isValidBrazilPhone('(71) 99876-5432'), true);
  assert.equal(isValidBrazilPhone('(71) 998'), false);
});

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
  // Thursday 2026-11-19 -> Friday 20, Saturday 21, Sunday 22 skipped -> Monday 2026-11-23
  const nextClubDate = getNextOpenDateISO(new Date(2026, 10, 19), clubCut);
  assert.equal(nextClubDate, '2026-11-23');
});

test('validateBookingForm catches missing fields and passes valid submission', () => {
  const regularCut = SERVICES.find((s) => s.id === 'corte-visagista')!;
  const invalid = validateBookingForm(
    {
      serviceId: regularCut.id,
      date: '2026-11-22',
      time: '',
      clientName: 'A',
      clientPhone: '7199',
      notes: '',
    },
    regularCut,
  );

  assert.ok(invalid.date);
  assert.ok(invalid.time);
  assert.ok(invalid.clientName);
  assert.ok(invalid.clientPhone);

  const valid = validateBookingForm(
    {
      serviceId: regularCut.id,
      date: '2026-11-24',
      time: '14:30',
      clientName: 'Rafael Santos',
      clientPhone: '(71) 99876-5432',
      notes: 'Degrade baixo',
    },
    regularCut,
  );

  assert.deepEqual(valid, {});
});

test('all WhatsApp link builders include clean pre-filled ready messages', () => {
  const clubBarba = SERVICES.find((s) => s.id === 'clube-barba-ilimitada')!;
  assert.equal(formatCurrencyBRL(clubBarba.price, clubBarba.billingCycle), 'R$\u00a0129/mês');

  const bookingMsg = buildWhatsAppBookingMessage(
    {
      serviceId: clubBarba.id,
      date: '2026-11-24',
      time: '15:30',
      clientName: 'Lucas Andrade',
      clientPhone: '(71) 99123-4567',
      notes: 'Barba alinhada',
    },
    clubBarba,
  );
  assert.ok(bookingMsg.includes('Lucas Andrade'));
  assert.ok(bookingMsg.includes('24/11/2026 às 15:30'));

  const url = buildWhatsAppBookingUrl(
    '5571999990000',
    {
      serviceId: clubBarba.id,
      date: '2026-11-24',
      time: '15:30',
      clientName: 'Lucas Andrade',
      clientPhone: '(71) 99123-4567',
      notes: '',
    },
    clubBarba,
  );

  assert.ok(url.startsWith('https://wa.me/5571999990000?text='));
  const decoded = decodeURIComponent(url.split('text=')[1]);
  assert.ok(decoded.includes('Realeza Visagismo'));
  assert.ok(decoded.includes('Clube Barba Ilimitada'));
  assert.ok(decoded.includes('24/11/2026'));
  assert.ok(!decoded.includes('—'));
  assert.ok(!decoded.includes('–'));

  const directDefault = buildDirectWhatsAppUrl('5571999990000');
  const directSubject = buildDirectWhatsAppUrl('5571999990000', 'Atendimento e horários');
  const quickBooking = buildQuickBookingWhatsAppUrl('5571999990000', clubBarba, '2026-11-24', '14:30');

  for (const candidate of [directDefault, directSubject, quickBooking]) {
    assert.ok(candidate.startsWith('https://wa.me/5571999990000?text='));
    const text = decodeURIComponent(candidate.split('text=')[1]);
    assert.ok(text.length > 25);
    assert.ok(!text.includes('—'));
  }
});
