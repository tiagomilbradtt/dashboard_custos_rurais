/** Leitura das abas extras (Investimentos, Comissões, Pró-labores) e da aba de rateio. */
import { alocar, rateioDeLinhas } from './allocation.js';
import { fd, money, nz, str, toDate, toNum } from './utils.js';
/* global XLSX (carregado via CDN em index.html) */

export function tab(wb,re){const sn=wb.SheetNames.find(n=>re.test(nz(n)));if(!sn)return null;
 const a=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null}),h=a.findIndex((r,i)=>i<40&&r.some(c=>nz(c)==='data')&&r.some(c=>nz(c)==='valor'));
 if(h<0)return null;const ix={};a[h].forEach((c,i)=>{const k=nz(c);if(k&&!(k in ix))ix[k]=i});return{a,h,ix}}
export function rateio(wb){const sn=wb.SheetNames.find(n=>/variave/.test(nz(n)));if(!sn)return{rows:[],ha:{}};
 return rateioDeLinhas(XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null}))}
export function extras(wb,RT){const rows=[],info=[];let semRat=0;
 const fin=o=>{o.geral=o.valor-o.soja-o.arroz;o.cs=o.cat+' › '+o.sub;o.h=nz([fd(o.data),o.desc,o.cat,o.sub,o.ben,o.doc,o.valor,money(o.valor),o.soja,o.arroz].join(' '));return o};
 [[/investimento/,'Investimentos',{ben:'beneficiario',doc:'documento',cultura:null}],
  [/comiss/,'Comissões',{ben:'recebedor',doc:null,cultura:'cultura'}],
  [/pro.?labore/,'Pró-labores',{ben:null,doc:null,cultura:null}]].forEach(([re,cat,cf])=>{const t=tab(wb,re);if(!t)return;let n=0;const g=(r,k)=>k?r[t.ix[k]]:null;
  t.a.slice(t.h+1).forEach(r=>{const v=toNum(g(r,'valor')),d=toDate(g(r,'data'));if(v==null||!d)return;
   const o={data:d,valor:v,soja:0,arroz:0,desc:str(g(r,'descricao'))||cat,cat,sub:'(sem subcategoria)',ben:str(g(r,cf.ben)),doc:str(g(r,cf.doc))};
   if(alocar(o,cf.cultura?g(r,cf.cultura):'',RT.rows))semRat++;
   rows.push(fin(o));n++});info.push(cat+' ('+n+')')});
 const txt=info.length?' · + '+info.join(', ')+(semRat?' · sem rateio para '+semRat+' lançamentos extras (ficam como não alocados)':''):'';
 return{rows,info:txt}}

