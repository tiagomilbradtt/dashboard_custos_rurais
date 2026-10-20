/** Utilitários puros: normalização de texto, conversão de números/datas e formatação em pt-BR. */

export const $=s=>document.querySelector(s),on=(s,e,f)=>$(s).addEventListener(e,f);
export const nz=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const BRL=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}),cf=new Intl.NumberFormat('pt-BR',{notation:'compact',maximumFractionDigits:1});
export const money=v=>v==null?'':BRL.format(v),fd=d=>d?d.toLocaleDateString('pt-BR'):'',dk=()=>document.documentElement.classList.contains('dark');
export const sum=(a,k)=>a.reduce((t,r)=>t+(r[k]||0),0),str=v=>v==null?'':String(v).trim();

export function toNum(v){if(typeof v==='number')return isFinite(v)?v:null;if(typeof v!=='string')return null;let s=v.replace(/R\$|\s/g,'');if(!s)return null;
 if(/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s))s=s.replace(/\./g,'').replace(',','.');else if(/^-?\d+,\d+$/.test(s))s=s.replace(',','.');else if(!/^-?\d+(\.\d+)?$/.test(s))return null;return +s}
export function toDate(v){if(v instanceof Date){if(isNaN(v))return null;if(v.getHours()===23&&v.getMinutes()>=59)v=new Date(v.getTime()+120000);return v}
 if(typeof v!=='string')return null;let m=v.trim().match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
 if(m){let y=+m[3];if(y<100)y+=2000;return new Date(y,m[2]-1,m[1])}m=v.match(/^(\d{4})-(\d{2})-(\d{2})/);return m?new Date(+m[1],m[2]-1,+m[3]):null}


export const pct=(a,b)=>b?(a/b*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%':'—';
export const ha=s=>{const n=toNum(String(s??'').trim());return n>0?n:0};
