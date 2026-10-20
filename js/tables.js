/** Renderização de tabelas. */
import { $, esc, fd, money } from './utils.js';

export const LC=[['Data',r=>fd(r.data)],['Descrição',r=>esc(r.desc)],['Categoria',r=>esc(r.cat)],['Subcategoria',r=>esc(r.sub)],['Beneficiário',r=>esc(r.ben)],['Documento',r=>esc(r.doc)],['Valor',r=>`<b>${money(r.valor)}</b>`,1],['Soja',r=>r.soja?money(r.soja):'',1],['Arroz',r=>r.arroz?money(r.arroz):'',1]];
export function tbl(id,C,rows){$('#'+id).innerHTML=`<thead class="bg-slate-50 dark:bg-slate-900/60"><tr>${C.map(c=>`<th class="px-3 py-2 font-medium whitespace-nowrap ${c[2]?'text-right':'text-left'}">${c[0]}</th>`).join('')}</tr></thead><tbody>`+
 (rows.map(r=>`<tr class="border-t border-slate-100 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/40">${C.map(c=>`<td class="px-3 py-2 ${c[2]?'text-right tabular-nums whitespace-nowrap':'min-w-[7rem]'}">${c[1](r)}</td>`).join('')}</tr>`).join('')||`<tr><td class="p-6 text-center text-slate-500" colspan="${C.length}">Nenhum lançamento encontrado.</td></tr>`)+'</tbody>'}

