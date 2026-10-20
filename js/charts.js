/** Criação dos gráficos (Chart.js) com tema claro/escuro. */
import { CH } from './state.js';
import { $, cf, dk, money } from './utils.js';
/* global Chart (carregado via CDN em index.html) */

export function mk(id,cfg){CH[id]&&CH[id].destroy();CH[id]=new Chart($('#'+id),cfg)}
export function opts(h,leg){const gr=dk()?'rgba(148,163,184,.14)':'rgba(15,23,42,.08)';Chart.defaults.color=dk()?'#9FB0C8':'#526071';Chart.defaults.font.family="'IBM Plex Sans',system-ui,sans-serif";
 return{indexAxis:h?'y':'x',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:!!leg,position:'bottom'},tooltip:{callbacks:{label:c=>(c.dataset.label?c.dataset.label+': ':'')+money(h?c.parsed.x:c.parsed.y)}}},
  scales:{[h?'x':'y']:{grid:{color:gr},ticks:{callback:v=>cf.format(v)}},[h?'y':'x']:{grid:{display:false}}}}}
