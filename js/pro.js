/* Informatik Pro Layer
   Isolated enhancement module: reads the existing v10 state without owning core state.
   No dependency on private variables/functions from app.js.
*/
(function(){
'use strict';

const STATE_KEY='informatik-v10';
const PRO_KEY='informatik-pro-v1';
const GH_USER='ArtinBamooei';
const LEVELS={beginner:'مقدماتی',intermediate:'متوسط',advanced:'حرفه‌ای'};
const STATUS={todo:'شروع',learning:'یادگیری',practice:'تمرین',done:'تکمیل'};

let ui=null;
let deferredInstall=null;
let searchQuery='';
let sortMode='default';
let ghCache=null;

function readState(){
  try{
    const raw=JSON.parse(localStorage.getItem(STATE_KEY)||'null');
    if(!raw||typeof raw!=='object'||!Array.isArray(raw.skills)) return null;
    return raw;
  }catch(e){return null}
}
function readPro(){
  try{
    const x=JSON.parse(localStorage.getItem(PRO_KEY)||'null');
    return x&&typeof x==='object'?x:{weekly:{hours:5,sessions:3,subs:10},theme:'violet'};
  }catch(e){return {weekly:{hours:5,sessions:3,subs:10}}}
}
function writePro(x){try{localStorage.setItem(PRO_KEY,JSON.stringify(x))}catch(e){}}
function esc(x){return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmt(sec){
  sec=Math.max(0,Math.round(Number(sec)||0));
  if(sec<60)return sec+'s';
  if(sec<3600)return Math.floor(sec/60)+'m';
  return Math.floor(sec/3600)+'h '+Math.floor((sec%3600)/60)+'m';
}
function today(){
  const d=new Date();
  return d.toISOString().slice(0,10);
}
function daysActive(dates){
  return new Set(Array.isArray(dates)?dates:[]).size;
}
function streak(dates){
  const set=new Set(Array.isArray(dates)?dates:[]);
  let d=new Date(), n=0;
  const iso=()=>d.toISOString().slice(0,10);
  if(!set.has(iso())) d.setDate(d.getDate()-1);
  while(set.has(iso())){n++;d.setDate(d.getDate()-1)}
  return n;
}
function calc(s){
  const skills=s.skills||[];
  const progress=s.progress||{};
  const skillProgress=s.skillProgress||{};
  const subs=s.subs||{};
  const times=s.skillTime||{};
  const total=skills.length||1;
  const stepOf=x=>Number.isFinite(Number(skillProgress[x.id]))?Math.max(0,Math.min(10,Math.round(Number(skillProgress[x.id])))):({todo:0,learning:4,practice:7,done:10}[progress[x.id]]||0);
  const done=skills.filter(x=>stepOf(x)>=10).length;
  const learning=skills.filter(x=>stepOf(x)>0&&stepOf(x)<10).length;
  const overall=Math.round(skills.reduce((a,x)=>a+stepOf(x)*10,0)/total);
  const totalTime=Object.values(times).reduce((a,v)=>a+(Number(v)||0),0);
  const subTotal=Object.values(subs).reduce((a,v)=>a+(Array.isArray(v)?v.length:0),0);
  const subDone=Object.values(subs).reduce((a,v)=>a+(Array.isArray(v)?v.filter(z=>z&&z.done).length:0),0);
  const sessions=Math.max(0,Number(s.focusUsed)||0);
  return {skills,progress,subs,times,done,learning,total:skills.length,overall,totalTime,subTotal,subDone,sessions};
}
function injectButton(){
  const toolbar=document.querySelector('.toolbar');
  if(!toolbar||document.getElementById('proCenterBtn'))return;
  const b=document.createElement('button');
  b.className='tool pro-center-btn';
  b.id='proCenterBtn';
  b.type='button';
  b.textContent='⌘ مرکز مدیریت';
  b.setAttribute('aria-label','مرکز مدیریت و آمار پیشرفته');
  toolbar.appendChild(b);
  b.addEventListener('click',open);
}
function buildUI(){
  if(ui)return;
  const mb=document.createElement('div');
  mb.className='mb pro-modal-wrap';
  mb.id='proModal';
  mb.innerHTML=
    '<div class="modal pro-modal" role="dialog" aria-modal="true" aria-labelledby="proTitle">'+
      '<div class="modal-head pro-head"><div><h3 id="proTitle">مرکز مدیریت Informatik</h3><div class="pro-sub">Analytics · Roadmap · پروژه‌ها · زمینه‌های پژوهشی · GitHub</div></div><button class="modal-close" data-pro-close aria-label="بستن">✕</button></div>'+
      '<div class="pro-tabs" role="tablist">'+
        '<button class="pro-tab active" data-tab="overview">نمای کلی</button>'+
        '<button class="pro-tab" data-tab="activity">فعالیت</button>'+
        '<button class="pro-tab" data-tab="roadmap">مسیر یادگیری</button>'+
        '<button class="pro-tab" data-tab="portfolio">پروژه‌ها</button>'+
        '<button class="pro-tab" data-tab="system">سیستم</button>'+
      '</div>'+
      '<div class="pro-content" id="proContent"></div>'+
    '</div>';
  document.body.appendChild(mb);
  ui=mb;
  mb.addEventListener('click',e=>{
    if(e.target===mb||e.target.closest('[data-pro-close]'))close();
    const tab=e.target.closest('[data-tab]');
    if(tab){document.querySelectorAll('.pro-tab').forEach(x=>x.classList.toggle('active',x===tab));renderTab(tab.dataset.tab)}
    const act=e.target.closest('[data-pro-action]');
    if(act)handleAction(act.dataset.proAction,act);
  });
  mb.addEventListener('input',e=>{
    if(e.target.id==='proجستجو'){searchQuery=e.target.value.trim().toLowerCase();applyجستجو()}
    if(e.target.matches('[data-weekly]'))updateWeekly(e.target.dataset.weekly,e.target.value);
  });
  mb.addEventListener('change',e=>{
    if(e.target.matches('[data-sort]')){sortMode=e.target.value;applyجستجو()}
  });
}
function open(){
  buildUI();ui.classList.add('open');document.body.classList.add('pro-open');renderTab('overview');
}
function close(){if(ui){ui.classList.remove('open');document.body.classList.remove('pro-open')}}
function card(title,value,label,cls=''){
  return '<div class="pro-stat '+cls+'"><b>'+esc(value)+'</b><span>'+esc(title)+'</span><small>'+esc(label||'')+'</small></div>';
}
function renderTab(tab){
  const s=readState();if(!s)return;
  const c=calc(s);
  const el=document.getElementById('proContent');if(!el)return;
  if(tab==='overview')el.innerHTML=overviewHTML(s,c);
  if(tab==='activity')el.innerHTML=activityHTML(s,c);
  if(tab==='roadmap')el.innerHTML=roadmapHTML(s,c);
  if(tab==='portfolio')el.innerHTML=portfolioHTML(s,c);
  if(tab==='system')el.innerHTML=systemHTML(s,c);
  if(tab==='overview')bindWeekly();
  if(tab==='activity')drawHeatmap(s);
  if(tab==='roadmap')drawGraph(s);
}
function overviewHTML(s,c){
  const best=(s.skills||[]).slice().sort((a,b)=>(c.times[b.id]||0)-(c.times[a.id]||0)).slice(0,5);
  const bestHTML=best.map(x=>'<div class="pro-row"><span>'+esc(x.icon||'•')+' '+esc(x.name)+'</span><b>'+fmt(c.times[x.id]||0)+'</b></div>').join('')||'<div class="pro-empty">هنوز زمان مطالعه‌ای ثبت نشده.</div>';
  const p=readPro(),w=p.weekly||{hours:5,sessions:3,subs:10};
  return '<div class="pro-grid four">'+
    card('پیشرفت کل',c.overall+'%','بر اساس وضعیت و زیرموضوع‌ها','accent')+
    card('مهارت تکمیل‌شده',c.done+'/'+c.total,'از کل مهارت‌ها','green')+
    card('زمان مطالعه',fmt(c.totalTime),'ثبت‌شده برای مهارت‌ها','blue')+
    card('جلسه تمرکز',c.sessions,'تعداد استفاده از تمرکز','purple')+
  '</div>'+
  '<div class="pro-section"><div class="pro-section-head"><h4>هدف هفتگی</h4><span>هدف عملی، مستقل از Level مهارت</span></div>'+
    '<div class="weekly-grid">'+
      weeklyInput('hours','ساعت مطالعه',w.hours,Math.round(c.totalTime/3600*10)/10)+
      weeklyInput('sessions','جلسه تمرکز',w.sessions,c.sessions)+
      weeklyInput('subs','زیرموضوع تکمیل‌شده',w.subs,c.subDone)+
    '</div>'+
  '</div>'+
  '<div class="pro-two"><div class="pro-section"><div class="pro-section-head"><h4>بیشترین زمان مطالعه</h4></div>'+bestHTML+'</div>'+
  '<div class="pro-section"><div class="pro-section-head"><h4>وضعیت مهارت‌ها</h4></div>'+
    '<div class="pro-bars">'+
      statusBar('تکمیل',c.done,c.total,'done')+
      statusBar('در جریان',c.learning,c.total,'learning')+
      statusBar('شروع نشده',c.total-c.done-c.learning,c.total,'todo')+
    '</div></div></div>'+
  '<div class="pro-actions"><button class="btn btn-secondary" data-pro-action="focus">تمرکز روی مهارت بعدی</button><button class="btn btn-secondary" data-pro-action="csv">خروجی CSV</button><button class="btn btn-secondary" data-pro-action="json">خروجی JSON</button></div>';
}
function weeklyInput(key,label,target,current){
  const pct=target>0?Math.min(100,current/target*100):0;
  return '<label class="weekly-item"><span>'+esc(label)+'</span><b>'+esc(String(current))+' / '+esc(String(target))+'</b><input type="number" min="0" step="0.5" data-weekly="'+key+'" value="'+esc(target)+'"><i><em style="width:'+pct+'%"></em></i></label>';
}
function statusBar(label,n,total,kind){
  const pct=total?Math.round(n/total*100):0;
  return '<div class="pro-bar-row"><span>'+esc(label)+'</span><div><i class="'+kind+'" style="width:'+pct+'%"></i></div><b>'+n+'</b></div>';
}
function activityHTML(s,c){
  const dates=Array.isArray(s.dates)?s.dates.slice().sort().reverse():[];
  const list=dates.slice(0,30).map(d=>'<div class="activity-row"><span class="activity-dot"></span><b>'+esc(d)+'</b><span>روز فعال</span></div>').join('')||'<div class="pro-empty">هنوز فعالیتی ثبت نشده.</div>';
  return '<div class="pro-section"><div class="pro-section-head"><h4>فعالیت ۱۲ هفته اخیر</h4><span>فعالیت ثبت‌شده در ۱۲ هفته اخیر</span></div><div id="proHeatmap" class="heatmap"></div></div>'+
    '<div class="pro-section"><div class="pro-section-head"><h4>تاریخچه فعالیت</h4><span>'+dates.length+' روز ثبت‌شده</span></div><div class="activity-list">'+list+'</div></div>'+
    '<div class="pro-grid three">'+card('Streak فعلی',streak(s.dates),'روز پیاپی','amber')+card('روزهای فعال',daysActive(s.dates),'کل تاریخچه','blue')+card('زیرموضوع‌ها',c.subDone+'/'+c.subTotal,'تکمیل‌شده','green')+'</div>';
}
function drawHeatmap(s){
  const el=document.getElementById('proHeatmap');if(!el)return;
  const set=new Set(s.dates||[]);
  const now=new Date();now.setHours(0,0,0,0);now.setDate(now.getDate()-83);
  let html='';
  for(let i=0;i<84;i++){
    const d=new Date(now);d.setDate(now.getDate()+i);
    const key=d.toISOString().slice(0,10);
    html+='<i class="'+(set.has(key)?'on':'')+'" title="'+key+'"></i>';
  }
  el.innerHTML=html;
}
function roadmapHTML(s,c){
  const cats=[
    ['Python & Data',['NumPy','Pandas','Matplotlib','Seaborn']],
    ['Database & ETL',['SQL','Database','ETL']],
    ['Backend & DevOps',['API','Docker','Git / GitHub']],
    ['ML & Business Intel',['Machine Learning','Power BI']]
  ];
  const steps=cats.map((g,i)=>{
    const names=g[1],found=names.map(n=>s.skills.find(x=>x.name===n)).filter(Boolean);
    const stepOf=x=>Number.isFinite(Number(s.skillProgress?.[x.id]))?Math.max(0,Math.min(10,Math.round(Number(s.skillProgress[x.id])))):({todo:0,learning:4,practice:7,done:10}[s.progress?.[x.id]]||0);
    const avg=found.length?Math.round(found.reduce((a,x)=>a+stepOf(x)*10,0)/found.length):0;
    return '<div class="road-node"><span>'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(g[0])+'</b><small>'+esc(names.join(' → '))+'</small><i><em style="width:'+avg+'%"></em></i></div><strong>'+avg+'%</strong></div>';
  }).join('');
  return '<div class="pro-section"><div class="pro-section-head"><h4>مسیر یادگیری</h4><span>مسیر پیشنهادی بر اساس ساختار فعلی</span></div><div class="roadmap">'+steps+'</div></div>'+
    '<div class="pro-section"><div class="pro-section-head"><h4>ارتباط مهارت‌ها</h4><span>وابستگی منطقی مهارت‌ها</span></div><div class="dep-graph" id="proGraph"></div></div>'+
    '<div class="pro-section"><div class="pro-section-head"><h4>سطح هدف</h4><span>فقط سه سطح</span></div><div class="level-legend"><b class="l-b">مقدماتی</b><b class="l-i">متوسط</b><b class="l-a">حرفه‌ای</b></div></div>';
}
function drawGraph(s){
  const el=document.getElementById('proGraph');if(!el)return;
  const nodes=[
    ['Python','Python & Data'],['Data','NumPy / Pandas'],['SQL','SQL / Database'],['ETL','ETL / API'],['DevOps','Docker / Git'],['ML','Machine Learning'],['BI','Power BI']
  ];
  const pos=[[20,50],[36,30],[36,70],[54,50],[68,30],[68,70],[84,50]];
  const lines=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[5,6],[4,6]];
  let svg='<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="نمودار وابستگی مهارت‌ها">';
  lines.forEach(([a,b])=>svg+='<line x1="'+pos[a][0]+'" y1="'+pos[a][1]+'" x2="'+pos[b][0]+'" y2="'+pos[b][1]+'"></line>');
  nodes.forEach((n,i)=>svg+='<g style="--x:'+pos[i][0]+'%;--y:'+pos[i][1]+'%"><circle cx="'+pos[i][0]+'" cy="'+pos[i][1]+'" r="3"></circle><text x="'+pos[i][0]+'" y="'+(pos[i][1]-5)+'">'+esc(n[0])+'</text></g>');
  svg+='</svg>';
  el.innerHTML=svg;
}
function portfolioHTML(s,c){
  return '<div class="pro-section"><div class="pro-section-head"><h4>پروژه‌ها</h4><span>داده زنده از GitHub</span></div>'+
    '<div class="github-toolbar"><button class="btn btn-secondary" data-pro-action="github">به‌روزرسانی GitHub</button><span id="ghState">هنوز دریافت نشده</span></div>'+
    '<div id="ghRepos" class="repo-grid"><div class="pro-empty">برای دریافت Repositoryها دکمه بالا را بزن.</div></div></div>'+
    '<div class="pro-two"><div class="pro-section"><div class="pro-section-head"><h4>زمینه‌های پژوهشی</h4><span>ساختار آماده برای توسعه</span></div>'+
      '<div class="research-list"><b>Data Engineering</b><b>Data Science</b><b>Machine Learning</b><b>Bioinformatics</b><small>Publications و زمینه‌های پژوهشی Projects در نسخه بعدی قابل اتصال هستند.</small></div></div>'+
    '<div class="pro-section"><div class="pro-section-head"><h4>جستجو و مرتب‌سازی</h4><span>روی کارت‌های اصلی اعمال می‌شود</span></div>'+
      '<input id="proجستجو" class="input" placeholder="جستجوی مهارت...">'+
      '<select class="input select" data-sort><option value="default">ترتیب اصلی</option><option value="name">نام</option><option value="time">زمان مطالعه</option><option value="progress">پیشرفت</option></select>'+
      '<button class="btn btn-secondary" data-pro-action="clearsearch">پاک‌کردن فیلتر</button></div></div>';
}
function systemHTML(s,c){
  return '<div class="pro-grid three">'+
    card('برنامه','فعال','قابل نصب + Service Worker','green')+
    card('ذخیره‌سازی','محلی','localStorage v10','blue')+
    card('امنیت','سمت کاربر','توکن داخل state ذخیره نمی‌شود','purple')+
  '</div>'+
  '<div class="pro-two"><div class="pro-section"><div class="pro-section-head"><h4>میانبرها</h4><span>سریع‌تر کار کن</span></div><div class="shortcuts">'+
    shortcut('/', 'جستجو')+shortcut('F','تمرکز')+shortcut('Space','تایمر')+shortcut('Esc','بستن')+shortcut('N','یادداشت')+
  '</div></div><div class="pro-section"><div class="pro-section-head"><h4>PWA</h4></div><div id="pwaBox" class="pwa-box">در حال بررسی...</div><button class="btn btn-secondary" data-pro-action="install">نصب برنامه</button></div></div>'+
  '<div class="pro-section"><div class="pro-section-head"><h4>ابزار داده</h4></div><div class="pro-actions">'+
    '<button class="btn btn-secondary" data-pro-action="json">خروجی JSON</button><button class="btn btn-secondary" data-pro-action="csv">خروجی CSV</button><button class="btn btn-secondary" data-pro-action="import">ورود JSON</button><button class="btn btn-secondary" data-pro-action="refresh">بازخوانی داده</button></div></div>';
}
function shortcut(k,v){return '<div><kbd>'+esc(k)+'</kbd><span>'+esc(v)+'</span></div>'}
function bindWeekly(){
  const p=readPro();p.weekly=p.weekly||{hours:5,sessions:3,subs:10};
  document.querySelectorAll('[data-weekly]').forEach(x=>x.value=p.weekly[x.dataset.weekly]??0);
}
function updateWeekly(k,v){
  const p=readPro();p.weekly=p.weekly||{hours:5,sessions:3,subs:10};
  const n=Math.max(0,Math.min(9999,Number(v)||0));p.weekly[k]=n;writePro(p);
}
function download(name,type,text){
  const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportJSON(){
  const s=readState();if(!s)return;
  const copy=JSON.parse(JSON.stringify(s));if(copy.sync)delete copy.sync.token;
  download('informatik-backup.json','application/json;charset=utf-8',JSON.stringify(copy,null,2));
}
function exportCSV(){
  const s=readState();if(!s)return;
  const rows=[['id','name','category','progress_step','progress_percent','status','target_level','study_seconds','subtopics','subtopics_done']];
  (s.skills||[]).forEach(x=>{
    const subs=Array.isArray(s.subs?.[x.id])?s.subs[x.id]:[];
    const step=Number.isFinite(Number(s.skillProgress?.[x.id]))?Math.max(0,Math.min(10,Math.round(Number(s.skillProgress[x.id])))):({todo:0,learning:4,practice:7,done:10}[s.progress?.[x.id]]||0);
    rows.push([x.id,x.name,x.cat,step,step*10,STATUS[s.progress?.[x.id]]||'شروع',LEVELS[s.targetLevels?.[x.id]]||'متوسط',Math.round(s.skillTime?.[x.id]||0),subs.length,subs.filter(z=>z.done).length]);
  });
  const csv='﻿'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\\n');
  download('informatik-skills.csv','text/csv;charset=utf-8',csv);
}

function backupPayload(){
  const s=readState();if(!s)throw new Error('داده‌ای وجود ندارد');
  const copy=JSON.parse(JSON.stringify(s));
  if(copy.sync)delete copy.sync.token;
  return JSON.stringify(copy);
}
function passwordBytes(password){return new TextEncoder().encode(password)}
async function deriveKey(password,salt){
  const base=await crypto.subtle.importKey('raw',passwordBytes(password),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
function b64(bytes){let s='';const a=new Uint8Array(bytes);for(let i=0;i<a.length;i+=0x8000)s+=String.fromCharCode(...a.subarray(i,i+0x8000));return btoa(s)}
function unb64(value){const s=atob(value);const out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out}
async function exportEncrypted(){
  if(!crypto?.subtle){alert('Web Crypto در این مرورگر در دسترس نیست.');return}
  const password=prompt('برای پشتیبان رمزنگاری‌شده یک رمز عبور قوی وارد کن:');
  if(!password||password.length<10){alert('رمز عبور باید حداقل ۱۰ کاراکتر باشد.');return}
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await deriveKey(password,salt);
  const data=new TextEncoder().encode(backupPayload());
  const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,data);
  const packet={format:'informatik-encrypted-backup',version:1,kdf:'PBKDF2-SHA256',iterations:250000,cipher:'AES-256-GCM',salt:b64(salt),iv:b64(iv),data:b64(encrypted)};
  download('informatik-backup.encrypted.json','application/json;charset=utf-8',JSON.stringify(packet,null,2));
}
function importEncrypted(){
  const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
  input.onchange=async()=>{
    const file=input.files?.[0];if(!file)return;
    try{
      if(file.size>2*1024*1024)throw new Error('فایل بزرگ است');
      const packet=JSON.parse(await file.text());
      if(!packet||packet.format!=='informatik-encrypted-backup'||packet.version!==1||packet.kdf!=='PBKDF2-SHA256'||packet.cipher!=='AES-256-GCM'||packet.iterations!==250000)throw new Error('فرمت رمزنگاری نامعتبر است');
      const password=prompt('رمز عبور پشتیبان را وارد کن:');if(!password)throw new Error('رمز عبور وارد نشد');
      const key=await deriveKey(password,unb64(packet.salt));
      const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(packet.iv)},key,unb64(packet.data));
      const parsed=JSON.parse(new TextDecoder().decode(plain));
      if(!parsed||typeof parsed!=='object'||!Array.isArray(parsed.skills)||parsed.skills.length>200)throw new Error('داده نامعتبر است');
      if(!confirm('داده‌های فعلی جایگزین شوند؟'))return;
      localStorage.setItem(STATE_KEY,JSON.stringify(parsed));
      location.reload();
    }catch(e){alert('بازیابی ناموفق: '+(e.message||'رمز عبور یا فایل نادرست است'))}
  };
  input.click();
}
function importJSON(){
  const input=document.createElement('input');input.type='file';input.accept='application/json,.json';
  input.onchange=async()=>{
    const file=input.files?.[0];if(!file)return;
    try{
      if(file.size>2*1024*1024)throw new Error('فایل بزرگ است');
      const parsed=JSON.parse(await file.text());
      if(!parsed||typeof parsed!=='object'||!Array.isArray(parsed.skills))throw new Error('ساختار نامعتبر');
      if(!confirm('داده‌های فعلی جایگزین شوند؟'))return;
      localStorage.setItem(STATE_KEY,JSON.stringify(parsed));
      location.reload();
    }catch(e){alert('Import نامعتبر: '+e.message)}
  };
  input.click();
}
function applyجستجو(){
  const container=document.getElementById('container');if(!container)return;
  if(searchQuery===''&&sortMode==='default'){return;}
  if(typeof observer!=='undefined')observer.disconnect();
  const cards=[...container.querySelectorAll('.card')];
  const s=readState();if(!s)return;
  const map=new Map((s.skills||[]).map(x=>[x.id,x]));
  const q=searchQuery;
  cards.forEach(card=>{
    const sk=map.get(card.dataset.id);
    const hit=!q||((sk?.name||'').toLowerCase().includes(q)||(sk?.cat||'').toLowerCase().includes(q));
    card.style.display=hit?'':'none';
  });
  if(sortMode!=='default'){
    const groups=[...container.querySelectorAll('.section')];
    groups.forEach(section=>{
      const list=section.querySelector('.cards');
      if(!list)return;
      const arr=[...list.querySelectorAll('.card')];
      arr.sort((a,b)=>{
        const x=map.get(a.dataset.id)||{},y=map.get(b.dataset.id)||{};
        if(sortMode==='name')return x.name.localeCompare(y.name,'fa');
        if(sortMode==='time')return (s.skillTime?.[y.id]||0)-(s.skillTime?.[x.id]||0);
        const stepOf=x=>Number.isFinite(Number(s.skillProgress?.[x.id]))?Math.max(0,Math.min(10,Math.round(Number(s.skillProgress[x.id])))):({todo:0,learning:4,practice:7,done:10}[s.progress?.[x.id]]||0);
        return stepOf(y)-stepOf(x);
      }).forEach(x=>list.appendChild(x));
    });
  }
  if(typeof observer!=='undefined')observer.observe(container,{childList:true,subtree:true});
}
function focusNext(){
  const s=readState();if(!s||!s.skills?.length)return;
  const stepOf=x=>Number.isFinite(Number(s.skillProgress?.[x.id]))?Math.max(0,Math.min(10,Math.round(Number(s.skillProgress[x.id])))):({todo:0,learning:4,practice:7,done:10}[s.progress?.[x.id]]||0);
  const x=s.skills.slice().sort((a,b)=>stepOf(a)-stepOf(b))[0];
  if(x)document.querySelector('.card[data-id="'+CSS.escape(x.id)+'"] .tool-btn[data-tool="focus"]')?.click();
}
async function loadGitHub(){
  const state=document.getElementById('ghState'),box=document.getElementById('ghRepos');if(!state||!box)return;
  state.textContent='در حال خواندن GitHub...';
  try{
    if(!ghCache){
      const res=await fetch('https://api.github.com/users/'+encodeURIComponent(GH_USER)+'/repos?per_page=100&sort=updated',{headers:{Accept:'application/vnd.github+json'}});
      if(!res.ok)throw new Error('HTTP '+res.status);
      const data=await res.json();
      if(!Array.isArray(data))throw new Error('GitHub response invalid');
      ghCache=data.filter(x=>x&&typeof x==='object'&&typeof x.name==='string'&&typeof x.html_url==='string'&&/^https:\/\/github\.com\//.test(x.html_url));
    }
    const repos=ghCache.filter(x=>!x.fork).slice(0,8);
    state.textContent=repos.length+' مخزن';
    box.innerHTML=repos.map(r=>'<a class="repo-card" href="'+esc(r.html_url)+'" target="_blank" rel="noopener noreferrer"><b>'+esc(r.name)+'</b><span>'+esc(r.language||'—')+'</span><small>'+esc(r.description||'بدون توضیح')+'</small><em>★ '+Number(r.stargazers_count||0)+'</em></a>').join('')||'<div class="pro-empty">مخزن عمومی پیدا نشد.</div>';
  }catch(e){state.textContent='GitHub در دسترس نیست';box.innerHTML='<div class="pro-empty">دریافت اطلاعات GitHub ناموفق بود. برنامه بدون این بخش هم کامل کار می‌کند.</div>'}
}
function setupInstall(){
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e});
}
async function install(){
  if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice.catch(()=>{});deferredInstall=null;return}
  alert('مرورگر در حال حاضر Install Prompt را ارائه نکرده است. از منوی مرورگر گزینه Install app / Add to Home screen را استفاده کن.');
}
function pwaInfo(){
  const el=document.getElementById('pwaBox');if(!el)return;
  const standalone=matchMedia('(display-mode:standalone)').matches||navigator.standalone;
  el.textContent=standalone?'برنامه در حالت نصب‌شده اجرا می‌شود.':'برنامه آماده نصب است؛ وضعیت Install Prompt به مرورگر وابسته است.';
}
function handleAction(a){
  if(a==='json')exportJSON();
  if(a==='csv')exportCSV();
  if(a==='enc-export')exportEncrypted();
  if(a==='enc-import')importEncrypted();
  if(a==='import')importJSON();
  if(a==='refresh'){searchQuery='';sortMode='default';renderTab('overview')}
  if(a==='clearsearch'){searchQuery='';const i=document.getElementById('proجستجو');if(i)i.value='';applyجستجو()}
  if(a==='github')loadGitHub();
  if(a==='install')install();
  if(a==='focus')focusNext();
}
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
  if(e.key==='/'){e.preventDefault();open();setTimeout(()=>{document.getElementById('proجستجو')?.focus()},50)}
  else if(e.key.toLowerCase()==='f'){e.preventDefault();focusNext()}
  else if(e.code==='Space'){e.preventDefault();document.getElementById('timerToggle')?.click()}
  else if(e.key.toLowerCase()==='n'){e.preventDefault();document.getElementById('addBtn')?.click()}
});
const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(applyجستجو,100)});
function start(){
  injectButton();buildUI();setupInstall();
  const c=document.getElementById('container');if(c)observer.observe(c,{childList:true,subtree:true});
  pwaInfo();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();