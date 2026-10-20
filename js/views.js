/** Renderização de cada aba do painel (KPIs, gráficos e tabelas). */
import { by, view } from './calc.js';
import { mk, opts } from './charts.js';
import { C0, CO, PAL, S } from './state.js';
import { LC, tbl } from './tables.js';
import { $, esc, ha, money, nz, pct, sum } from './utils.js';

export const card=(l,v,s,c)=>`<div class="card"><div class="text-xs text-slate-500 dark:text-slate-400">${l}</div><div class="text-xl font-semibold mt-1 truncate" ${c?`style="color:${c}"`:''} title="${v}">${v}</div><div class="text-xs text-slate-500 mt-0.5 truncate">${s||''}</div></div>`;
export function render(){S.R=view();$('#cnt').textContent=S.tab==='busca'?'':S.R.length.toLocaleString('pt-BR')+' de '+S.rows.length.toLocaleString('pt-BR')+' lançamentos no período e categoria selecionados';
 ['geral','cult','ha','top','busca'].forEach(t=>$('#t-'+t).classList.toggle('hidden',t!==S.tab));$('#haBox').classList.toggle('hidden',S.tab==='busca'||S.tab==='top');
 document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===S.tab));$('#filt').classList.toggle('hidden',S.tab==='busca');
 ({geral:fGeral,cult:fCult,ha:fHa,top:fTop,busca:fBusca})[S.tab]()}

export function gKpis(){const R=S.R,tot=sum(R,'valor'),so=sum(R,'soja'),ar=sum(R,'arroz'),hs=ha(S.ha.soja),hr=ha(S.ha.arroz);
 const ph=(v,h,n,c)=>card('Custo por hectare de '+n,h?money(v/h):'—',h?h.toLocaleString('pt-BR')+' ha informados':'Informe os hectares acima',c);
 $('#kpis').innerHTML=card('Total gasto',money(tot),R.length.toLocaleString('pt-BR')+' lançamentos')+card('Gasto com soja',money(so),pct(so,tot)+' do total',CO.soja)+card('Gasto com arroz',money(ar),pct(ar,tot)+' do total',CO.arroz)+ph(so,hs,'soja',CO.soja)+ph(ar,hr,'arroz',CO.arroz)}
export function fGeral(){const R=S.R,tot=sum(R,'valor'),c=by(R,'cat'),s=by(R,'cs');gKpis();
 mk('cCat',{type:'bar',data:{labels:c.slice(0,12).map(x=>x.k),datasets:[{data:c.slice(0,12).map(x=>x.valor),backgroundColor:C0}]},options:opts(1)});
 mk('cSub',{type:'bar',data:{labels:s.slice(0,12).map(x=>x.k),datasets:[{data:s.slice(0,12).map(x=>x.valor),backgroundColor:PAL[2]}]},options:opts(1)});
 const mxv=c[0]?c[0].valor:1;$('#rank').innerHTML=c.slice(0,10).map((x,i)=>`<li><div class="flex justify-between gap-2"><span class="truncate">${i+1}. ${esc(x.k)}</span><span class="font-medium whitespace-nowrap">${money(x.valor)}</span></div><div class="flex items-center gap-2 mt-1"><div class="h-1.5 rounded bg-slate-200 dark:bg-slate-800 flex-1"><div class="h-1.5 rounded" style="width:${Math.max(2,x.valor/mxv*100)}%;background:${C0}"></div></div><span class="text-xs text-slate-500 w-12 text-right">${pct(x.valor,tot)}</span></div></li>`).join('')||'<li class="text-slate-500">Sem dados.</li>'}

export function fCult(){const R=S.R,tot=sum(R,'valor'),so=sum(R,'soja'),ar=sum(R,'arroz'),c=by(R,'cat');
 $('#ckpis').innerHTML=card('Soja',money(so),pct(so,tot)+' do total',CO.soja)+card('Arroz',money(ar),pct(ar,tot)+' do total',CO.arroz);
 mk('cCult',{type:'doughnut',data:{labels:['Soja','Arroz'],datasets:[{data:[so,ar],backgroundColor:[CO.soja,CO.arroz],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom'},tooltip:{callbacks:{label:x=>x.label+': '+money(x.parsed)}}}}});
 const t=[...c].sort((x,y)=>(y.soja+y.arroz)-(x.soja+x.arroz)).slice(0,10);
 mk('cCC',{type:'bar',data:{labels:t.map(x=>x.k),datasets:[{label:'Soja',data:t.map(x=>x.soja),backgroundColor:CO.soja},{label:'Arroz',data:t.map(x=>x.arroz),backgroundColor:CO.arroz}]},options:opts(1,1)});
 const b=(r,x)=>r.t?`<b>${x}</b>`:x;
 tbl('tCult',[['Categoria',r=>b(r,esc(r.k))],['Soja',r=>b(r,money(r.soja)),1],['Arroz',r=>b(r,money(r.arroz)),1],['Total',r=>b(r,money(r.valor)),1]],[...c,{k:'Total',soja:so,arroz:ar,valor:tot,t:1}])}

export function fHa(){const R=S.R,tot=sum(R,'valor'),so=sum(R,'soja'),ar=sum(R,'arroz'),hs=ha(S.ha.soja),hr=ha(S.ha.arroz),ht=hs+hr,q=(v,h)=>h>0?v/h:null,mh=v=>v==null?'—':money(v),c=by(R,'cat'),hx=h=>h?h.toLocaleString('pt-BR')+' ha':'sem hectares';
 $('#hmsg').textContent=ht?'':'Informe os hectares acima para ver os valores por hectare. Os percentuais já estão calculados.';
 $('#hkpis').innerHTML=card('Custo por hectare (total)',mh(q(tot,ht)),hx(ht)+' somados')+card('Soja por hectare',mh(q(so,hs)),hx(hs),CO.soja)+card('Arroz por hectare',mh(q(ar,hr)),hx(hr),CO.arroz);
 const t=c.slice(0,10);
 mk('cHa1',{type:'bar',data:{labels:t.map(x=>x.k),datasets:[{label:'Soja',data:t.map(x=>q(x.soja,hs)||0),backgroundColor:CO.soja},{label:'Arroz',data:t.map(x=>q(x.arroz,hr)||0),backgroundColor:CO.arroz}]},options:opts(1,1)});
 const d=c.slice(0,8),rest=tot-sum(d,'valor');
 mk('cHa2',{type:'doughnut',data:{labels:[...d.map(x=>x.k),...(rest>0?['Outras']:[])],datasets:[{data:[...d.map(x=>x.valor),...(rest>0?[rest]:[])],backgroundColor:[...PAL,'#94A3B8'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'bottom',labels:{boxWidth:10}},tooltip:{callbacks:{label:x=>x.label+': '+pct(x.parsed,tot)+' ('+money(x.parsed)+')'}}}}});
 const s=by(R,'cs').slice(0,12);
 mk('cHa3',{type:'bar',data:{labels:s.map(x=>x.k),datasets:[{label:'Total',data:s.map(x=>q(x.valor,ht)||0),backgroundColor:PAL[2]}]},options:opts(1)});
 const w=(r,x)=>r.g?`<b>${x}</b>`:x,rows=[];
 c.forEach(x=>{rows.push({...x,g:1});if($('#haLv').value==='sub')by(R.filter(r=>r.cat===x.k),'sub').forEach(y=>rows.push({...y,g:0}))});rows.push({k:'Total',valor:tot,soja:so,arroz:ar,g:1});
 tbl('tHa',[['Categoria',r=>r.g?`<b>${esc(r.k)}</b>`:`<span class="pl-4">${esc(r.k)}</span>`],['Soja R$/ha',r=>w(r,mh(q(r.soja,hs))),1],['% do custo soja',r=>w(r,pct(r.soja,so)),1],['Arroz R$/ha',r=>w(r,mh(q(r.arroz,hr))),1],['% do custo arroz',r=>w(r,pct(r.arroz,ar)),1],['Total R$/ha',r=>w(r,mh(q(r.valor,ht))),1],['% do custo total',r=>w(r,pct(r.valor,tot)),1]],rows)}

export function fTop(){tbl('tTop',LC,[...S.R].sort((a,b)=>b.valor-a.valor).slice(0,+$('#topN').value))}

export function fBusca(){const t=nz(S.q).split(' ').filter(Boolean),res=t.length?S.rows.filter(r=>t.every(w=>r.h.includes(w))):S.rows,size=15,pages=Math.max(1,Math.ceil(res.length/size));
 S.page=Math.min(S.page,pages);
 $('#qinfo').innerHTML=t.length?`<b>${res.length.toLocaleString('pt-BR')}</b> lançamentos encontrados, somando <b>${money(sum(res,'valor'))}</b>`:`Todos os ${S.rows.length.toLocaleString('pt-BR')} lançamentos. Digite para filtrar; com várias palavras, todas precisam aparecer.`;
 tbl('tBusca',LC,res.slice((S.page-1)*size,S.page*size));$('#pinfo').textContent=`Página ${S.page} de ${pages}`;$('#pp').disabled=S.page<=1;$('#pn').disabled=S.page>=pages}

