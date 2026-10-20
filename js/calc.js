/** Filtros e agregações sobre os lançamentos. */
import { S } from './state.js';

export function view(){const f=S.f;return S.rows.filter(r=>{if(f.cat&&r.cat!==f.cat)return false;
 if(f.from&&(!r.data||r.data<new Date(f.from+'T00:00')))return false;if(f.to&&(!r.data||r.data>new Date(f.to+'T23:59:59')))return false;return true})}
export function by(R,k){const m=new Map();R.forEach(r=>{const o=m.get(r[k])||m.set(r[k],{k:r[k],valor:0,soja:0,arroz:0,geral:0,n:0}).get(r[k]);o.valor+=r.valor;o.soja+=r.soja;o.arroz+=r.arroz;o.geral+=r.geral;o.n++});return[...m.values()].sort((a,b)=>b.valor-a.valor)}
