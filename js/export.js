/** Exportação do painel para Excel. */
import { by } from './calc.js';
import { S } from './state.js';
import { ha, sum } from './utils.js';
/* global XLSX (carregado via CDN em index.html) */

export function exXlsx(){const wb=XLSX.utils.book_new(),R=S.R,add=(n,d)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(d,{cellDates:true}),n);
 add('Lançamentos',R.map(r=>({Data:r.data,'Descrição':r.desc,Categoria:r.cat,Subcategoria:r.sub,'Beneficiário':r.ben,Documento:r.doc,Valor:r.valor,'Valor Soja':r.soja,'Valor Arroz':r.arroz})));
 add('Por categoria',by(R,'cat').map(o=>({Categoria:o.k,Total:o.valor,Soja:o.soja,Arroz:o.arroz,'Não alocado':o.geral,'Lançamentos':o.n})));
 const hs=ha(S.ha.soja),hr=ha(S.ha.arroz),so=sum(R,'soja'),ar=sum(R,'arroz'),tot=sum(R,'valor'),q=(v,h)=>h>0?v/h:null;
 add('Por hectare',by(R,'cs').map(o=>({'Categoria › Subcategoria':o.k,'Soja R$/ha':q(o.soja,hs),'Arroz R$/ha':q(o.arroz,hr),'Total R$/ha':q(o.valor,hs+hr),'% do custo total':tot?o.valor/tot:null})));
 XLSX.writeFile(wb,'custos-propriedade.xlsx')}

