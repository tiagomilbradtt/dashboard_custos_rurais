/** Gerador de lançamentos fictícios para o modo demonstração. */
import { fd, money, nz } from './utils.js';

export function demoData(){let s=Math.abs(Date.now()^Math.floor(Math.random()*1e9))%2147483646+1;const rnd=()=>(s=(s*16807)%2147483647)/2147483647,ri=n=>Math.floor(rnd()*n);
 const CAT={'Químicos':{sub:['Herbicidas','Fungicidas','Inseticidas','Adjuvantes'],v:[3000,35000],cult:1},
  'Adubos':{sub:['Adubo de base','Adubo de cobertura','Calcário'],v:[5000,45000],cult:1},
  'Combustíveis':{sub:['Diesel','Gasolina','Óleo lubrificante'],v:[1000,20000],cult:1},
  'Investimentos':{sub:['Benfeitorias novas','Equipamentos novos','Ampliação de área'],v:[5000,60000],cult:1},
  'Pró-labores':{sub:['Retirada mensal'],v:[6000,9000],cult:0},
  'Taxas de venda':{sub:['Corretagem','Taxas de bolsa'],v:[500,8000],cult:1},
  'Manutenção de maquinários':{sub:['Peças','Serviço mecânico','Pneus'],v:[1000,25000],cult:1},
  'Manutenção de veículos':{sub:['Peças','Revisão','Pneus'],v:[500,10000],cult:1},
  'Manutenção de benfeitorias':{sub:['Reparo de galpão','Cercas','Silos'],v:[800,15000],cult:0},
  'Sementes':{sub:['Sementes de soja','Sementes de arroz','Tratamento de sementes'],v:[4000,50000],cult:1},
  'Impostos e taxas':{sub:['Funrural','ITR','Taxas municipais'],v:[500,12000],cult:0},
  'Salários':{sub:['Folha de pagamento','Encargos','13º salário'],v:[3000,20000],cult:0},
  'Comissões':{sub:['Comissão de venda'],v:[1000,12000],cult:1},
  'Fretes':{sub:['Frete de insumos','Frete de safra'],v:[800,15000],cult:1},
  'Biológicos':{sub:['Inoculantes','Bioinsumos'],v:[2000,20000],cult:1},
  'Irrigação':{sub:['Energia elétrica','Manutenção de pivô'],v:[1000,18000],cult:1},
  'Outras despesas':{sub:['Diversos'],v:[200,5000],cult:0},
  'Alimentação':{sub:['Cesta básica','Refeições de safra'],v:[300,4000],cult:0},
  'Contabilidade':{sub:['Honorários contábeis'],v:[500,3000],cult:0},
  'Aviação':{sub:['Pulverização aérea'],v:[2000,25000],cult:1},
  'Terceirização de serviços':{sub:['Colheita terceirizada','Plantio terceirizado'],v:[1000,20000],cult:1},
  'Seguros':{sub:['Seguro agrícola','Seguro de máquinas'],v:[1000,15000],cult:1}};
 const CN=Object.keys(CAT),forn=['Cooperativa Central','Agro Insumos Ltda','Transportes Rio Grande','Oficina Mecânica Sul','Maria Contadora','João Silva','Posto Fronteira','Sementes Planalto','Revenda Arrendamento'];
 const rows=[];for(let i=0;i<600;i++){const cn=CN[ri(CN.length)],c=CAT[cn],sub=c.sub[ri(c.sub.length)],[a,b]=c.v,
  valor=Math.round((a+rnd()*(b-a))*(1+i/3200)*100)/100,d=new Date(2024,ri(24),1+ri(28));
  let soja=0,arroz=0;if(c.cult){const p=.35+rnd()*.3;soja=Math.round(valor*p*100)/100;arroz=Math.round((valor-soja)*100)/100}
  rows.push({data:d,valor,soja,arroz,desc:sub+' - '+cn.toLowerCase(),cat:cn,sub,ben:forn[ri(forn.length)],doc:'NF-'+(1000+ri(8999))});}
 rows.forEach(o=>{o.geral=o.valor-o.soja-o.arroz;o.cs=o.cat+' › '+o.sub;o.h=nz([fd(o.data),o.desc,o.cat,o.sub,o.ben,o.doc,o.valor,money(o.valor),o.soja,o.arroz].join(' '))});
 rows.sort((x,y)=>y.data-x.data);return rows}

