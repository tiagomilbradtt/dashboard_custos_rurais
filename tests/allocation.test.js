import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alocar, ratFor, rateioDeLinhas } from '../js/allocation.js';

const rt = [
  { lb: 'adubos', soja: 0.6, arroz: 0.4 },
  { lb: 'quimicos', soja: 0.7, arroz: 0.3 },
];

test('cultura única recebe 100% do valor', () => {
  const o = { valor: 1000, cat: 'Adubos', soja: 0, arroz: 0 };
  assert.equal(alocar(o, 'Soja', rt), undefined);
  assert.deepEqual([o.soja, o.arroz], [1000, 0]);
  const p = { valor: 500, cat: 'Adubos', soja: 0, arroz: 0 };
  alocar(p, 'arroz', rt);
  assert.deepEqual([p.soja, p.arroz], [0, 500]);
});

test('duas culturas ou vazio usam o rateio da categoria', () => {
  const o = { valor: 1000, cat: 'Adubos', soja: 0, arroz: 0 };
  alocar(o, 'Arroz e Soja', rt);
  assert.equal(o.soja, 600);
  assert.equal(o.arroz, 400);
  const p = { valor: 100, cat: 'Químicos', soja: 0, arroz: 0 };
  alocar(p, '', rt);
  assert.ok(Math.abs(p.soja - 70) < 1e-9 && Math.abs(p.arroz - 30) < 1e-9);
});

test('sem rateio para a categoria, o lançamento fica não alocado', () => {
  const o = { valor: 100, cat: 'Seguros', soja: 5, arroz: 5 };
  assert.equal(alocar(o, '', rt), true);
  assert.deepEqual([o.soja, o.arroz], [0, 0]);
});

test('ratFor aceita correspondência exata e parcial', () => {
  assert.equal(ratFor(rt, 'ADUBOS').lb, 'adubos');
  assert.equal(ratFor([{ lb: 'manutencao de maquinarios', soja: 1, arroz: 0 }], 'Manutenção').lb, 'manutencao de maquinarios');
  assert.equal(ratFor(rt, ''), null);
});

test('rateioDeLinhas lê percentuais e a área total', () => {
  const linhas = [
    ['Categoria', 'Arroz', 'Soja', '', '', '', ''],
    ['Adubos', 0.4, 0.6, '', '', '', ''],
    ['Químicos', '30%', '70%', '', '', '', ''],
    ['', '', '', '', 'ÁREA TOTAL', '', ''],
    ['', '', '', '', 'Arroz', 'Soja', ''],
    ['', '', '', '', 300, 1000, ''],
  ];
  const R = rateioDeLinhas(linhas);
  assert.deepEqual(R.rows, [
    { lb: 'adubos', soja: 0.6, arroz: 0.4 },
    { lb: 'quimicos', soja: 0.7, arroz: 0.3 },
  ]);
  assert.deepEqual(R.ha, { arroz: 300, soja: 1000 });
});
