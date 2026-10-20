/** Rateio de custos entre soja e arroz e leitura da tabela "Informações Variáveis". */
import { nz, toNum } from './utils.js';

export function rateioDeLinhas(a){const R={rows:[],ha:{}};let hr=-1,cs=-1,ca=-1;

 for(let i=0;i<a.length&&hr<0;i++){const s=a[i].findIndex(c=>nz(c).startsWith('soja')),r=a[i].findIndex(c=>nz(c).startsWith('arroz'));if(s>=0&&r>=0){hr=i;cs=s;ca=r}}
 const p=v=>{if(typeof v==='string'&&v.includes('%')){const n=toNum(v.replace('%',''));return n==null?null:n/100}const n=toNum(v);return n==null?null:(n>1?n/100:n)};
 if(hr>=0)a.slice(hr+1).forEach(r=>{const lb=nz(r[0]),vs=p(r[cs]),va=p(r[ca]);if(!lb||(vs==null&&va==null))return;R.rows.push({lb,soja:vs||0,arroz:va||0})});
 /* área total: procura o rótulo "área total" e as colunas "Arroz"/"Soja" à direita dele, com os valores na linha seguinte */
 outer: for(let i=0;i<a.length;i++)for(let j=0;j<a[i].length;j++){if(nz(a[i][j])!=='area total')continue;
  for(let k=i;k<=i+2&&k<a.length;k++){let cA=-1,cS=-1;for(let c=j;c<a[k].length;c++){const t=nz(a[k][c]);if(t==='arroz')cA=c;else if(t==='soja')cS=c}
   if(cA>=0&&cS>=0){const vr=a[k+1]||[];R.ha={arroz:toNum(vr[cA])||0,soja:toNum(vr[cS])||0};break outer}}}
 if(!R.ha.soja&&!R.ha.arroz&&hr>=0)a.forEach((r,i)=>{if(i<=hr)return;const lb=nz(r.find(c=>typeof c==='string'&&nz(c)));
  if(lb&&/hect|(^|\W)ha(\W|$)|area/.test(lb)){const vs=toNum(r[cs]),va=toNum(r[ca]);if(vs||va)R.ha={soja:vs||0,arroz:va||0}}});
 return R}
export function ratFor(rt,cat){const k=nz(cat);if(!k)return null;return rt.find(x=>x.lb===k)||(k.length>3?rt.find(x=>x.lb.length>3&&(x.lb.includes(k)||k.includes(x.lb))):null)||null}
/* decide soja/arroz de um lançamento: usa a coluna Cultura quando dá para saber 100% de uma cultura; senão aplica o rateio da categoria */
export function alocar(o,cu,rt){cu=nz(cu);const temS=cu.includes('soja'),temA=cu.includes('arroz');
 if(temS&&!temA){o.soja=o.valor;o.arroz=0;return}if(temA&&!temS){o.arroz=o.valor;o.soja=0;return}
 const x=ratFor(rt,o.cat);if(x){o.soja=o.valor*x.soja;o.arroz=o.valor*x.arroz}else{o.soja=0;o.arroz=0;return true}}
