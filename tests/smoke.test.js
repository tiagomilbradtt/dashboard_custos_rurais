/**
 * Teste de integração (smoke): executa o painel inteiro em Node com um DOM falso,
 * Chart.js e SheetJS simulados. Garante que todas as abas renderizam com os dados
 * de exemplo e que o fluxo de leitura de planilha aplica o rateio corretamente.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

const els = new Map();
const fakeEl = () => ({
  innerHTML: '', textContent: '', value: '', disabled: false, dataset: {}, handlers: {},
  classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  addEventListener(ev, f) { this.handlers[ev] = f; },
});
const $ = (s) => { if (!els.has(s)) els.set(s, fakeEl()); return els.get(s); };

globalThis.document = {
  querySelector: $, querySelectorAll: () => [], addEventListener() {},
  documentElement: { classList: { add() {}, toggle() {}, contains: () => false } },
};
globalThis.window = { print() {} };
globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.matchMedia = () => ({ matches: false });
globalThis.alert = (m) => { throw new Error('alert: ' + m); };

const charts = [];
globalThis.Chart = class { constructor(_c, cfg) { charts.push(cfg); } destroy() {} };
Chart.defaults = { font: {} };

let planilha = null;
const saved = [];
globalThis.XLSX = {
  read: () => planilha,
  utils: {
    sheet_to_json: (sheet) => sheet,
    book_new: () => ({ sheets: [] }),
    json_to_sheet: (d) => d,
    book_append_sheet: (wb, s, n) => wb.sheets.push(n),
  },
  writeFile: (wb, nome) => saved.push({ nome, abas: wb.sheets }),
};

const { S } = await import('../js/state.js');
await import('../js/main.js');
const { processBuf } = await import('../js/loader.js');
const clique = (sel, ev = 'click', e = {}) => $(sel).handlers[ev](e);
const irParaAba = (t) => clique('#nav', 'click', { target: { closest: () => ({ dataset: { t } }) } });

test('dados de exemplo carregam e a Visão geral renderiza', () => {
  assert.ok(S.rows.length >= 600);
  assert.match($('#kpis').innerHTML, /Total gasto/);
  assert.ok(charts.length >= 2);
});

test('todas as abas renderizam sem erro', () => {
  for (const t of ['cult', 'ha', 'top', 'busca', 'geral']) irParaAba(t);
  assert.match($('#tCult').innerHTML, /Total/);
  assert.match($('#tHa').innerHTML, /% do custo total/);
  assert.match($('#tTop').innerHTML, /<tbody>/);
  assert.match($('#tBusca').innerHTML, /<tbody>/);
});

test('busca filtra os lançamentos', () => {
  irParaAba('busca');
  clique('#q', 'input', { target: { value: 'zzz-inexistente' } });
  assert.match($('#tBusca').innerHTML, /Nenhum lançamento encontrado/);
  clique('#q', 'input', { target: { value: '' } });
  irParaAba('geral');
});

test('exportação para Excel gera as três abas', () => {
  clique('#bX');
  assert.equal(saved.at(-1).nome, 'custos-propriedade.xlsx');
  assert.deepEqual(saved.at(-1).abas, ['Lançamentos', 'Por categoria', 'Por hectare']);
});

test('leitura de planilha aplica cultura, rateio e abas extras', () => {
  const d = (m, dia) => new Date(2024, m, dia);
  planilha = {
    SheetNames: ['Entrada de Dados', 'Investimentos', 'Informações Variáveis'],
    Sheets: {
      'Entrada de Dados': [
        ['Data', 'Valor', 'Descrição', 'Cultura', 'Categoria', 'Subcategoria', 'Beneficiário', 'Documento'],
        [d(0, 10), 1000, 'Adubo', 'Soja', 'Adubos', 'Base', 'Cooperativa', 'NF1'],
        [d(0, 12), 500, 'Defensivo', '', 'Químicos', 'Herbicidas', 'Revenda', 'NF2'],
      ],
      Investimentos: [
        ['Data', 'Valor', 'Descrição', 'Beneficiário', 'Documento'],
        [d(1, 1), 2000, 'Galpão', 'Construtora', 'NF3'],
      ],
      'Informações Variáveis': [
        ['Categoria', 'Arroz', 'Soja', '', '', '', ''],
        ['Químicos', 0.3, 0.7, '', '', '', ''],
        ['Investimentos', 0.5, 0.5, '', '', '', ''],
        ['', '', '', '', 'ÁREA TOTAL', '', ''],
        ['', '', '', '', 'Arroz', 'Soja', ''],
        ['', '', '', '', 300, 1000, ''],
      ],
    },
  };
  assert.equal(processBuf(new ArrayBuffer(1), 'teste.xlsx', false), true);
  assert.equal(S.rows.length, 3);
  const soma = (k) => S.rows.reduce((t, r) => t + r[k], 0);
  assert.equal(soma('valor'), 3500);
  assert.ok(Math.abs(soma('soja') - 2350) < 1e-9);
  assert.ok(Math.abs(soma('arroz') - 1150) < 1e-9);
  assert.ok(S.ha.soja && S.ha.arroz);
});
