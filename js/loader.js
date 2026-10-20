/** Carrega planilhas (Excel/CSV) ou dados de exemplo e atualiza a interface. */
import { alocar } from './allocation.js';
import { demoData } from './demo-data.js';
import { extras, rateio } from './parser.js';
import { S } from './state.js';
import { $, esc, fd, money, nz, str, toDate, toNum } from './utils.js';
import { render } from './views.js';
/* global XLSX (carregado via CDN em index.html) */

export function processBuf(buf,name,silent){try{
  const wb=XLSX.read(new Uint8Array(buf),{type:'array',cellDates:true});
  const sn=wb.SheetNames.find(n=>nz(n)==='entrada de dados')||wb.SheetNames.find(n=>nz(n).includes('entrada'));
  if(!sn){if(!silent)alert('A aba "Entrada de Dados" não foi encontrada. Abas do arquivo: '+wb.SheetNames.join(', '));return false}
  const a=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null});
  const h=a.findIndex((r,i)=>i<40&&r.some(c=>nz(c)==='data')&&r.some(c=>nz(c)==='valor'));
  if(h<0){if(!silent)alert('Não encontrei a linha de cabeçalho com as colunas "Data" e "Valor" na aba '+sn+'.');return false}
  const ix={};a[h].forEach((c,i)=>{const k=nz(c);if(k&&!(k in ix))ix[k]=i});
  const g=(r,k)=>r[ix[k]],RT=rateio(wb);let semRat=0;
  S.rows=a.slice(h+1).map(r=>{const o={data:toDate(g(r,'data')),valor:toNum(g(r,'valor')),soja:0,arroz:0,
    desc:str(g(r,'descricao')),cat:str(g(r,'categoria'))||'(sem categoria)',sub:str(g(r,'subcategoria'))||'(sem subcategoria)',ben:str(g(r,'beneficiario')),doc:str(g(r,'documento'))};
    if(o.valor==null)return o;
    if((ix['valor soja']!=null||ix['valor arroz']!=null)&&((toNum(g(r,'valor soja'))||0)||(toNum(g(r,'valor arroz'))||0))){o.soja=toNum(g(r,'valor soja'))||0;o.arroz=toNum(g(r,'valor arroz'))||0}
    else if(alocar(o,g(r,'cultura'),RT.rows))semRat++;
    o.geral=(o.valor||0)-o.soja-o.arroz;o.cs=o.cat+' › '+o.sub;
    o.h=nz([fd(o.data),o.desc,o.cat,o.sub,o.ben,o.doc,o.valor,money(o.valor),o.soja,o.arroz].join(' '));return o})
   .filter(o=>o.valor!=null&&(o.data||o.desc)).sort((x,y)=>(y.data||0)-(x.data||0));
  if(!S.rows.length){if(!silent)alert('Nenhum lançamento válido encontrado abaixo do cabeçalho.');return false}
  const ex=extras(wb,RT);if(semRat)ex.info+=(ex.info?' · ':' · ')+semRat+' lançamentos da Entrada de Dados sem cultura e sem rateio (ficam não alocados)';
  if(ex.rows.length)S.rows=S.rows.concat(ex.rows).sort((x,y)=>(y.data||0)-(x.data||0));
  if(RT.ha.soja||RT.ha.arroz){const fh=n=>n?n.toLocaleString('pt-BR',{maximumFractionDigits:2}):'';S.ha={soja:fh(RT.ha.soja),arroz:fh(RT.ha.arroz)};$('#haS').value=S.ha.soja;$('#haA').value=S.ha.arroz;try{localStorage.setItem('ha',JSON.stringify(S.ha))}catch(e){}}
  S.f={from:'',to:'',cat:''};S.q='';S.page=1;S.tab='geral';$('#q').value='';['#fFrom','#fTo'].forEach(s=>$(s).value='');
  $('#fCat').innerHTML='<option value="">Todas</option>'+[...new Set(S.rows.map(r=>r.cat))].sort((x,y)=>x.localeCompare(y,'pt-BR')).map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
  const miss=['data','valor','descricao','cultura','categoria','subcategoria','beneficiario','documento'].filter(k=>!(k in ix));
  $('#fname').textContent=name+' · aba "'+sn+'" · '+S.rows.length.toLocaleString('pt-BR')+' lançamentos'+ex.info+(miss.length?' · colunas ausentes: '+miss.join(', '):'');
  $('#drop').classList.add('hidden');$('#app').classList.remove('hidden');document.querySelectorAll('.ex').forEach(b=>b.classList.remove('hidden'));render();return true
 }catch(err){if(!silent)alert('Não foi possível ler o arquivo: '+err.message);return false}}

export function readFile(f){if(!f)return;const r=new FileReader();r.onload=e=>processBuf(e.target.result,f.name,false);r.readAsArrayBuffer(f)}
export function loadDemo(){S.rows=demoData();
 S.ha={soja:'1000',arroz:'300'};$('#haS').value=S.ha.soja;$('#haA').value=S.ha.arroz;try{localStorage.setItem('ha',JSON.stringify(S.ha))}catch(e){}
 S.f={from:'',to:'',cat:''};S.q='';S.page=1;S.tab='geral';$('#q').value='';['#fFrom','#fTo'].forEach(s=>$(s).value='');
 $('#fCat').innerHTML='<option value="">Todas</option>'+[...new Set(S.rows.map(r=>r.cat))].sort((x,y)=>x.localeCompare(y,'pt-BR')).map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
 $('#fname').textContent='Dados de exemplo (fictícios) · '+S.rows.length.toLocaleString('pt-BR')+' lançamentos · gerados apenas para demonstração';
 $('#drop').classList.add('hidden');$('#app').classList.remove('hidden');document.querySelectorAll('.ex').forEach(b=>b.classList.remove('hidden'));render()}
