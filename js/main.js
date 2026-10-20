/** Ponto de entrada: liga os eventos da interface e carrega os dados de exemplo. */
import { exXlsx } from './export.js';
import { loadDemo, readFile } from './loader.js';
import { S } from './state.js';
import { $, dk, on } from './utils.js';
import { render } from './views.js';

const upd=()=>{S.page=1;render()};
on('#file','change',e=>{readFile(e.target.files[0]);e.target.value=''});on('#file2','change',e=>{readFile(e.target.files[0]);e.target.value=''});
on('#bX','click',exXlsx);on('#bP','click',()=>window.print());
on('#bT','click',()=>{document.documentElement.classList.toggle('dark');$('#bT').textContent=dk()?'Modo claro':'Modo escuro';try{localStorage.setItem('tema',dk()?'d':'l')}catch(e){}if(S.rows.length)render()});
on('#nav','click',e=>{const b=e.target.closest('.tab');if(b){S.tab=b.dataset.t;render()}});
on('#fFrom','input',e=>{S.f.from=e.target.value;upd()});on('#fTo','input',e=>{S.f.to=e.target.value;upd()});on('#fCat','change',e=>{S.f.cat=e.target.value;upd()});
on('#bR','click',()=>{S.f={from:'',to:'',cat:''};['#fFrom','#fTo'].forEach(s=>$(s).value='');$('#fCat').value='';upd()});
try{Object.assign(S.ha,JSON.parse(localStorage.getItem('ha')||'{}'));$('#haS').value=S.ha.soja;$('#haA').value=S.ha.arroz}catch(e){}
const saveHa=()=>{try{localStorage.setItem('ha',JSON.stringify(S.ha))}catch(e){}if(S.rows.length)render()};
on('#haS','input',e=>{S.ha.soja=e.target.value;saveHa()});on('#haA','input',e=>{S.ha.arroz=e.target.value;saveHa()});
on('#topN','change',render);on('#haLv','change',render);on('#q','input',e=>{S.q=e.target.value;upd()});
on('#pp','click',()=>{S.page--;render()});on('#pn','click',()=>{S.page++;render()});
['dragover','drop'].forEach(ev=>document.addEventListener(ev,e=>{e.preventDefault();if(ev==='drop')readFile(e.dataTransfer.files[0])}));
on('#bA','click',loadDemo);
try{if(localStorage.getItem('tema')==='d'||(!localStorage.getItem('tema')&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');$('#bT').textContent='Modo claro'}}catch(e){}
loadDemo();
