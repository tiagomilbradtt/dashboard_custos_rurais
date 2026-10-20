import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nz, toNum, toDate, pct } from '../js/utils.js';

test('nz remove acentos, caixa e espaços extras', () => {
  assert.equal(nz('  Informações   Variáveis '), 'informacoes variaveis');
  assert.equal(nz(null), '');
});

test('toNum entende formatos brasileiros e numéricos', () => {
  assert.equal(toNum('R$ 1.234,56'), 1234.56);
  assert.equal(toNum('1234,5'), 1234.5);
  assert.equal(toNum('12.5'), 12.5);
  assert.equal(toNum(42), 42);
  assert.equal(toNum('abc'), null);
  assert.equal(toNum(''), null);
});

test('toDate entende dd/mm/aaaa, aaaa-mm-dd e objetos Date', () => {
  const a = toDate('31/12/2024');
  assert.deepEqual([a.getFullYear(), a.getMonth(), a.getDate()], [2024, 11, 31]);
  const b = toDate('2024-03-05');
  assert.deepEqual([b.getFullYear(), b.getMonth(), b.getDate()], [2024, 2, 5]);
  assert.equal(toDate('texto'), null);
  assert.equal(toDate(new Date('invalid')), null);
});

test('pct formata percentuais e protege divisão por zero', () => {
  assert.equal(pct(1, 4), '25%');
  assert.equal(pct(1, 0), '—');
});
