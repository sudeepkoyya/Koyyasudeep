const $ = (id) => document.getElementById(id);
const samples = {aqi:[], noise:[], temp:[]};
const labels = [];
let chart;
const round = (v,n=0) => Number(v.toFixed(n));
function seeded(base,spread,min,max,n=0){return round(Math.min(max,Math.max(min,base+(Math.random()-.5)*spread)),n)}
function getReading(){return {aqi:seeded(42,22,18,95),noise:seeded(48,16,30,75),ph:seeded(6.7,.8,5.3,8.1,1),temp:seeded(29.4,2.4,24,36,1)}}
function addSample(reading){const now=new Date();labels.push(now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}));samples.aqi.push(reading.aqi);samples.noise.push(reading.noise);samples.temp.push(reading.temp);if(labels.length>12){labels.shift();Object.keys(samples).forEach(k=>samples[k].shift())}}
function statusText(id,text,kind=''){const el=$(id);el.textContent=text;el.className='trend '+kind}
function renderReading(r){
  $('aqi').textContent=r.aqi;$('noise').textContent=r.noise;$('ph').textContent=r.ph;$('temp').textContent=r.temp;
  $('aqi-bar').style.width=Math.min(100,r.aqi)+'%';$('noise-bar').style.width=Math.min(100,r.noise)+'%';$('ph-bar').style.width=Math.min(100,r.ph/14*100)+'%';$('temp-bar').style.width=Math.min(100,r.temp/45*100)+'%';
  statusText('aqi-status',r.aqi<50?'● Good conditions':r.aqi<100?'● Moderate conditions':'● Poor conditions',r.aqi<50?'good':'');
  statusText('noise-status',r.noise<55?'Within typical range':r.noise<70?'Elevated noise detected':'High noise level',r.noise<55?'good':'');
  statusText('ph-status',r.ph<6?'Acidic soil':r.ph<=7.5?'Near-neutral soil':'Alkaline soil',r.ph>=6&&r.ph<=7.5?'good':'');
  updateAlerts(r);
}
function updateAlerts(r){
  const alerts=[];
  if(r.aqi>=50)alerts.push({kind:'warn',symbol:'!',title:'Air quality needs attention',body:'The simulated AQI has moved above the preferred demo threshold.',time:'Just now'});
  if(r.noise>=55)alerts.push({kind:'warn',symbol:'≋',title:'Noise level elevated',body:'Noise readings are above the demo comfort threshold.',time:'Just now'});
  if(r.ph<5.8||r.ph>7.8)alerts.push({kind:'info',symbol:'♧',title:'Soil pH outside target band',body:'Review soil conditions in the simulated test garden.',time:'Just now'});
  if(!alerts.length)alerts.push({kind:'info',symbol:'✓',title:'All monitored signals look stable',body:'No simulated readings have crossed the configured thresholds.',time:'Just now'});
  const list=$('alerts-list');list.innerHTML=alerts.map(a=>'<article class="alert-item"><span class="alert-symbol '+(a.kind==='info'?'info':'')+'">'+a.symbol+'</span><div><b>'+a.title+'</b><p>'+a.body+'</p><small>'+a.time+' · DEMO ALERT</small></div></article>').join('');
  $('alert-count').textContent=alerts.length+' ACTIVE';$('nav-alert-count').textContent=alerts.length;
}
function drawChart(){
  const key=$('chart-metric').value;
  if(chart)chart.destroy();
  const ctx=$('trend-chart').getContext('2d');
  chart=new Chart(ctx,{type:'line',data:{labels:[...labels],datasets:[{label:{aqi:'Air Quality Index',noise:'Noise Level',temp:'Temperature'}[key],data:[...samples[key]],borderColor:'#5ee0b5',backgroundColor:'rgba(94,224,181,.10)',borderWidth:2,fill:true,tension:.38,pointRadius:2,pointHoverRadius:5,pointBackgroundColor:'#5ee0b5'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#122432',titleColor:'#eaf3f5',bodyColor:'#b6c8d0',borderColor:'#304653',borderWidth:1,displayColors:false}},scales:{x:{grid:{display:false},ticks:{color:'#728a98',maxTicksLimit:6,font:{size:10}},border:{display:false}},y:{grid:{color:'rgba(130,152,165,.12)'},ticks:{color:'#728a98',font:{size:10}},border:{display:false}}}}});
}
function refresh(){
  const r=getReading();renderReading(r);addSample(r);drawChart();
  $('clock').textContent=new Date().toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  $('last-updated').textContent='Last refreshed '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
$('chart-metric').addEventListener('change',drawChart);
for(let i=0;i<12;i++){const r=getReading();addSample(r)}
refresh();setInterval(refresh,5000);
