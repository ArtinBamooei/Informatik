
(function(){
'use strict';

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const CATS = [
  {id:'data',   name:'Python & Data',       color:'#22d3ee'},
  {id:'db',     name:'Database & ETL',      color:'#3b82f6'},
  {id:'devops', name:'Backend & DevOps',    color:'#f59e0b'},
  {id:'ml',     name:'ML & Business Intel', color:'#ec4899'}
];

const DEFAULT_SKILLS = [
  {id:'numpy',   cat:'data',   name:'NumPy',            icon:'🔢'},
  {id:'pandas',  cat:'data',   name:'Pandas',           icon:'🐼'},
  {id:'mpl',     cat:'data',   name:'Matplotlib',       icon:'📈'},
  {id:'seaborn', cat:'data',   name:'Seaborn',          icon:'🎨'},
  {id:'sql',     cat:'db',     name:'SQL',              icon:'🗄️'},
  {id:'dbase',   cat:'db',     name:'Database',         icon:'💾'},
  {id:'etl',     cat:'db',     name:'ETL',              icon:'🔄'},
  {id:'api',     cat:'devops', name:'API',              icon:'🔌'},
  {id:'docker',  cat:'devops', name:'Docker',           icon:'🐳'},
  {id:'git',     cat:'devops', name:'Git / GitHub',     icon:'🌿'},
  {id:'ml',      cat:'ml',     name:'Machine Learning', icon:'🤖'},
  {id:'powerbi', cat:'ml',     name:'Power BI',         icon:'📊'}
];

const STAT = {
  todo:     {label:'شروع',    value:0,   color:'#717784', n:1},
  learning: {label:'یادگیری', value:40,  color:'#22d3ee', n:2},
  practice: {label:'تمرین',   value:75,  color:'#a78bfa', n:3},
  done:     {label:'تکمیل',   value:100, color:'#34d399', n:4}
};
const STAT_ORDER = ['todo','learning','practice','done'];

const THEMES = {
  violet: {
    name:'بنفش کهکشانی', bg:'#08090d',
    grad:'radial-gradient(800px 500px at 85% -10%,rgba(139,92,246,.22),transparent 60%),radial-gradient(700px 400px at 5% 5%,rgba(34,211,238,.12),transparent 60%)',
    card:'rgba(255,255,255,.045)', accent:'#8b5cf6', accent2:'#22d3ee',
    text:'#f5f7fb', dim:'#9298a8', line:'rgba(255,255,255,.09)'
  },
  ocean: {
    name:'اقیانوس عمیق', bg:'#040d17',
    grad:'radial-gradient(800px 500px at 85% -10%,rgba(6,182,212,.28),transparent 60%),radial-gradient(700px 400px at 5% 5%,rgba(59,130,246,.18),transparent 60%)',
    card:'rgba(56,189,248,.06)', accent:'#06b6d4', accent2:'#3b82f6',
    text:'#e0f2fe', dim:'#7ea3c2', line:'rgba(56,189,248,.18)'
  },
  sunset: {
    name:'غروب آتشین', bg:'#130604',
    grad:'radial-gradient(800px 500px at 85% -10%,rgba(249,115,22,.3),transparent 60%),radial-gradient(700px 400px at 5% 5%,rgba(236,72,153,.22),transparent 60%)',
    card:'rgba(249,115,22,.07)', accent:'#f97316', accent2:'#ec4899',
    text:'#fef3e2', dim:'#c99e7e', line:'rgba(249,115,22,.2)'
  },
  forest: {
    name:'جنگل کوهستانی', bg:'#041008',
    grad:'radial-gradient(800px 500px at 85% -10%,rgba(16,185,129,.28),transparent 60%),radial-gradient(700px 400px at 5% 5%,rgba(132,204,22,.18),transparent 60%)',
    card:'rgba(16,185,129,.06)', accent:'#10b981', accent2:'#84cc16',
    text:'#e7fbec', dim:'#82a895', line:'rgba(16,185,129,.2)'
  }
};

const ICONS = [
  '🔢','🐼','📈','🎨','🗄️','💾','🔄','🔌','🐳','🌿','🤖','📊','🧠','💻',
  '📚','📝','🧪','⚙️','🛠️','🧩','📦','🔬','🖥️','🌐','🚀','🎯','📐','📋',
  '🐍','🔮','⚡','🔥','💡','🎓','🏆','⭐','💎','🎪','🎭','🎬','🎵','🎮',
  '☁️','🌍','🧬','🔐','📷','☕','🍕','🌊'
];

const QUOTES = [
  {t:'پیشرفت کوچک روزانه از جهش‌های گاه‌به‌گاه پایدارتر است.', a:'ناشناس'},
  {t:'ثبات، مزیت رقابتی یادگیری است.', a:'ناشناس'},
  {t:'پروژه، آزمون واقعی فهم است.', a:'ناشناس'},
  {t:'اول درست بفهم؛ بعد سریع اجرا کن.', a:'ناشناس'},
  {t:'یک ساعت عمیق از چند ساعت پراکنده ارزشمندتر است.', a:'کال نیوپورت'},
  {t:'هر مهارت با تکرار از دانستن به توانستن تبدیل می‌شود.', a:'ناشناس'},
  {t:'امروز کاری رو بکن که دیگران نمی‌کنن، فردا کارهایی رو بکن که دیگران نمی‌تونن.', a:'جری رایس'},
  {t:'بهترین زمان برای شروع، همین لحظه‌ست.', a:'ناشناس'},
  {t:'موفقیت، مجموع تلاش‌های کوچیک روزانه‌ست.', a:'رابرت کولیر'},
  {t:'اگه می‌خوای سریع بری، تنها برو. اگه می‌خوای دور بری، با هم برو.', a:'ضرب‌المثل آفریقایی'},
  {t:'تنها راه یادگیری سریع، اشتباه کردن سریعه.', a:'ناشناس'},
  {t:'زنجیر عادت‌ها در روز اول خیلی سبک‌تر از روز آخرشه.', a:'وارن بافت'},
  {t:'آدمی که هرگز اشتباه نکرده، هرگز چیز جدیدی رو امتحان نکرده.', a:'اینشتین'},
  {t:'مغزت مثل عضله‌ست، هر چقدر بیشتر تمرین بدی قوی‌تر می‌شه.', a:'ناشناس'},
  {t:'سرمایه‌گذاری روی خودت، بهترین سرمایه‌گذاریه.', a:'بنجامین فرانکلین'},
  {t:'کسانی که فکر می‌کنن می‌تونن و کسانی که فکر می‌کنن نمی‌تونن، هر دو راست می‌گن.', a:'هنری فورد'},
  {t:'اگه یاد نگیری، تکرار می‌کنی.', a:'ناشناس'},
  {t:'دانش، قدرت است.', a:'فرانسیس بیکن'},
  {t:'وقتی تدریس می‌کنی، دو بار یاد می‌گیری.', a:'ژوزف ژوبرت'},
  {t:'کسی که هر روز کمی جلو بره، سالی ۳۶۵ قدم جلوتره.', a:'ناشناس'},
  {t:'کار سخت، شانس رو شکست می‌ده.', a:'ناشناس'},
  {t:'تنها مانع بین تو و هدفت، خودته.', a:'ناشناس'},
  {t:'یادگیری، سرمایه‌گذاریه که هیچ‌وقت ارزشش رو از دست نمی‌ده.', a:'ناشناس'},
  {t:'چیزی که اندازه‌گیری نشه، بهبود پیدا نمی‌کنه.', a:'پیتر دراکر'},
  {t:'دانستن کافی نیست، باید به کار ببندی.', a:'گوته'},
  {t:'هر روز که بیدار می‌شی، یه فرصت جدید داری.', a:'ناشناس'},
  {t:'سختی امروز، آسونی فرداست.', a:'ناشناس'},
  {t:'شکست، پله‌ی موفقیت است، نه پایان راه.', a:'ناشناس'},
  {t:'بهترین سرمایه‌گذاری، روی خودته.', a:'وارن بافت'},
  {t:'آدم موفق کسیه که از اشتباهاتش درس می‌گیره.', a:'ناشناس'},
  {t:'تغییر، سخته ولی موندن توی جای بد، سخت‌تره.', a:'ناشناس'},
  {t:'اگه کاری رو دوست نداری، حداقل درست انجامش بده.', a:'ناشناس'},
  {t:'موفقیت یه شبه نمیاد، از تلاش‌های پشت‌سرهم میاد.', a:'ناشناس'},
  {t:'زمانی که به یادگیری اختصاص می‌دی، هرگز هدر نمی‌ره.', a:'ناشناس'},
  {t:'خودت رو با دیروزت مقایسه کن، نه با دیگران.', a:'ناشناس'},
  {t:'کارهای بزرگ، از قدم‌های کوچیک شروع می‌شن.', a:'ناشناس'},
  {t:'اگه امروز سخت کار نکنی، فردا سخت‌تر می‌شه.', a:'ناشناس'},
  {t:'عادت‌های کوچیک، نتایج بزرگ می‌سازن.', a:'جیمز کلیر'},
  {t:'بهترین راه یادگیری، انجام دادنه.', a:'ناشناس'},
  {t:'درسی که با سختی یاد بگیری، فراموش نمی‌شه.', a:'ناشناس'},
  {t:'آینده متعلق به کسانی‌ست که امروز یاد می‌گیرن.', a:'ناشناس'},
  {t:'اگه رؤیاش رو داری، پس انجامش بده.', a:'ناشناس'}
];

const ACH = [
  {id:'first',  icon:'🏁', name:'اولین قدم',   desc:'اولین پیشرفتت رو ثبت کردی',    test:()=>Object.keys(s.progress).some(k=>s.progress[k]!=='todo')},
  {id:'three',  icon:'📚', name:'سه قدم',      desc:'۳ مهارت در جریان داری',         test:()=>Object.keys(s.progress).filter(k=>s.progress[k]!=='todo').length>=3},
  {id:'done1',  icon:'✓',  name:'اولین تسلط',  desc:'اولین مهارت کامل شد',           test:()=>Object.keys(s.progress).some(k=>s.progress[k]==='done')},
  {id:'done5',  icon:'🏆', name:'پنج تسلط',    desc:'۵ مهارت کامل شد',               test:()=>Object.keys(s.progress).filter(k=>s.progress[k]==='done').length>=5},
  {id:'streak3',icon:'🔥', name:'۳ روز پیاپی', desc:'سه روز پشت‌سرهم',                test:()=>streak()>=3},
  {id:'streak7',icon:'⚡', name:'هفت روز',     desc:'یه هفته پیوسته',                 test:()=>streak()>=7},
  {id:'streak30',icon:'💎',name:'سی روز',      desc:'یه ماه کامل پیوسته!',            test:()=>streak()>=30},
  {id:'editor', icon:'⚙️', name:'شخصی‌ساز',    desc:'اولین مهارت خودت رو ساختی',     test:()=>s.customCount>0},
  {id:'note',   icon:'📝', name:'یادداشت‌بردار',desc:'اولین یادداشتت رو نوشتی',      test:()=>Object.keys(s.notes).some(k=>(s.notes[k]||'').trim())},
  {id:'subs',   icon:'✓',  name:'زیرموضوع‌ساز', desc:'۱۰ زیرموضوع تیک خورد',         test:()=>{let n=0;Object.keys(s.subs).forEach(k=>n+=s.subs[k].filter(x=>x.done).length);return n>=10;}},
  {id:'time1',  icon:'⏱️', name:'یک ساعت',     desc:'یه ساعت مطالعه کردی',            test:()=>totalTime()>=3600},
  {id:'time10', icon:'🧠', name:'ده ساعت',     desc:'۱۰ ساعت مطالعه کردی',            test:()=>totalTime()>=36000},
  {id:'timer1', icon:'⏲️', name:'اولین تایمر', desc:'اولین بار تایمر رو زدی',         test:()=>s.timerStarted>0},
  {id:'focus1', icon:'🎯', name:'تمرکز عمیق',  desc:'اولین بار حالت Focus رو زدی',   test:()=>s.focusUsed>0}
];

/* ═══════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════ */
const KEY = 'informatik-v9';

function uid(){ return 'sk_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

let syncToken = '';
let s;
try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch(e){ s = null; }

if (!s || typeof s !== 'object') s = {};

// Migrate from v8 if empty
if (!s.skills || !Array.isArray(s.skills) || s.skills.length === 0){
  try {
    const old = JSON.parse(localStorage.getItem('informatik-v8') || localStorage.getItem('informatik-v7') || 'null');
    if (old && typeof old === 'object' && old.skills){
      s = {
        skills: old.skills,
        progress: old.progress || {},
        notes: old.notes || {},
        subs: old.subs || {},
        order: old.order || old.skills.map(x=>x.id),
        dates: old.dates || [],
        theme: old.theme || 'violet',
        unlocked: old.unlocked || [],
        studyTime: old.studyTime || 0,
        skillTime: {},
        customCount: old.customCount || 0,
        reminder: { enabled: false, time: '20:00', lastNotified: null },
        sync: { token: '', gistId: '', lastSync: null },
        timerStarted: 0,
        focusUsed: 0
      };
    } else {
      s = {
        skills: DEFAULT_SKILLS.slice(),
        progress: {}, notes: {}, subs: {},
        order: DEFAULT_SKILLS.map(x=>x.id),
        dates: [], theme: 'violet', unlocked: [],
        studyTime: 0, skillTime: {}, customCount: 0,
        reminder: { enabled: false, time: '20:00', lastNotified: null },
        sync: { token: '', gistId: '', lastSync: null },
        timerStarted: 0, focusUsed: 0
      };
    }
  } catch(e){
    s = {
      skills: DEFAULT_SKILLS.slice(),
      progress: {}, notes: {}, subs: {},
      order: DEFAULT_SKILLS.map(x=>x.id),
      dates: [], theme: 'violet', unlocked: [],
      studyTime: 0, skillTime: {}, customCount: 0,
      reminder: { enabled: false, time: '20:00', lastNotified: null },
      sync: { token: '', gistId: '', lastSync: null },
      timerStarted: 0, focusUsed: 0
    };
  }
}

// Defaults
s.progress = s.progress || {};
s.notes = s.notes || {};
s.subs = s.subs || {};
s.skillTime = s.skillTime || {};
s.order = Array.isArray(s.order) ? s.order : s.skills.map(x=>x.id);
s.dates = Array.isArray(s.dates) ? s.dates : [];
s.theme = s.theme || 'violet';
s.unlocked = Array.isArray(s.unlocked) ? s.unlocked : [];
s.customCount = s.customCount || 0;
s.reminder = s.reminder || { enabled: false, time: '20:00', lastNotified: null };
s.sync = s.sync || { gistId: '', lastSync: null };
delete s.sync.token;
s.timerStarted = s.timerStarted || 0;
s.focusUsed = s.focusUsed || 0;

s.skills.forEach(sk => {
  if (!s.progress[sk.id]) s.progress[sk.id] = 'todo';
  if (!Array.isArray(s.subs[sk.id])) s.subs[sk.id] = [];
  if (!s.skillTime[sk.id]) s.skillTime[sk.id] = 0;
  if (!s.order.includes(sk.id)) s.order.push(sk.id);
});
s.order = s.order.filter(id => s.skills.some(sk => sk.id === id));

function normalizeState(input){
  const base=(input&&typeof input==='object'&&!Array.isArray(input))?input:{};
  const skills=Array.isArray(base.skills)&&base.skills.length?base.skills:DEFAULT_SKILLS.slice();
  const validStatuses=new Set(['todo','learning','practice','done']);
  const out={
    skills:skills.filter(x=>x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.name==='string').map(x=>({...x})),
    progress:base.progress&&typeof base.progress==='object'&&!Array.isArray(base.progress)?{...base.progress}:{},
    notes:base.notes&&typeof base.notes==='object'&&!Array.isArray(base.notes)?{...base.notes}:{},
    subs:base.subs&&typeof base.subs==='object'&&!Array.isArray(base.subs)?{...base.subs}:{},
    skillTime:base.skillTime&&typeof base.skillTime==='object'&&!Array.isArray(base.skillTime)?{...base.skillTime}:{},
    order:Array.isArray(base.order)?[...base.order.filter(x=>typeof x==='string')]:[],
    dates:Array.isArray(base.dates)?[...new Set(base.dates.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)))]:[],
    theme:(base.theme&&Object.prototype.hasOwnProperty.call(THEMES,base.theme))?base.theme:'violet',
    unlocked:Array.isArray(base.unlocked)?[...new Set(base.unlocked.filter(x=>typeof x==='string'))]:[],
    studyTime:Number.isFinite(Number(base.studyTime))?Math.max(0,Number(base.studyTime)):0,
    customCount:Number.isFinite(Number(base.customCount))?Math.max(0,Number(base.customCount)):0,
    timerStarted:Number.isFinite(Number(base.timerStarted))?Math.max(0,Number(base.timerStarted)):0,
    focusUsed:Number.isFinite(Number(base.focusUsed))?Math.max(0,Number(base.focusUsed)):0,
    reminder:base.reminder&&typeof base.reminder==='object'?{
      enabled:!!base.reminder.enabled,
      time:/^([01]\d|2[0-3]):[0-5]\d$/.test(base.reminder.time||'')?base.reminder.time:'20:00',
      lastNotified:typeof base.reminder.lastNotified==='string'?base.reminder.lastNotified:null
    }:{enabled:false,time:'20:00',lastNotified:null},
    sync:base.sync&&typeof base.sync==='object'?{
      gistId:typeof base.sync.gistId==='string'?base.sync.gistId:'',
      lastSync:Number.isFinite(Number(base.sync.lastSync))?Number(base.sync.lastSync):null
    }:{gistId:'',lastSync:null}
  };
  out.skills.forEach(sk=>{
    if(!validStatuses.has(out.progress[sk.id])) out.progress[sk.id]='todo';
    if(!Array.isArray(out.subs[sk.id])) out.subs[sk.id]=[];
    out.subs[sk.id]=out.subs[sk.id].filter(x=>x&&typeof x==='object'&&typeof x.text==='string').map(x=>({...x,done:!!x.done}));
    out.skillTime[sk.id]=Number.isFinite(Number(out.skillTime[sk.id]))?Math.max(0,Number(out.skillTime[sk.id])):0;
  });
  const ids=new Set(out.skills.map(x=>x.id));
  out.order=[...out.order.filter(id=>ids.has(id)),...out.skills.map(x=>x.id).filter(id=>!out.order.includes(id))];
  delete out.sync.token;
  return out;
}

function save(){
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){}
}

function totalTime(){
  let t = 0;
  Object.keys(s.skillTime).forEach(k => t += s.skillTime[k] || 0);
  return t;
}

/* ═══════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════ */
function esc(x){
  return String(x).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function pad(n){ return String(n).padStart(2,'0'); }
function today(d){
  d = d || new Date();
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
}
function yesterday(){
  const d = new Date(); d.setDate(d.getDate() - 1);
  return today(d);
}
function vibrate(ms){ try { navigator.vibrate && navigator.vibrate(ms); } catch(e){} }

function formatTime(sec){
  sec = Math.max(0, Math.round(sec));
  if (sec < 60) return sec + 's';
  if (sec < 3600) return Math.round(sec/60) + 'm';
  const h = Math.floor(sec/3600);
  const m = Math.round((sec%3600)/60);
  return h + 'h' + (m > 0 ? ' ' + m + 'm' : '');
}
function formatTimeLong(sec){
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const ss = sec%60;
  if (h > 0) return h + ' ساعت ' + m + ' دقیقه';
  if (m > 0) return m + ' دقیقه ' + ss + ' ثانیه';
  return ss + ' ثانیه';
}

/* ═══════════════════════════════════════════
   STREAK
   ═══════════════════════════════════════════ */
function markDay(){
  const t = today();
  if (!s.dates.includes(t)){
    s.dates.push(t);
    if (s.dates.length > 400) s.dates = s.dates.slice(-400);
    save();
  }
}

function streak(){
  if (!s.dates.length) return 0;
  const set = new Set(s.dates);
  let d = new Date();
  if (!set.has(today(d))){
    d.setDate(d.getDate() - 1);
    if (!set.has(today(d))) return 0;
  }
  let count = 0;
  while (set.has(today(d))){
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function bestStreak(){
  if (!s.dates.length) return 0;
  const sorted = [...new Set(s.dates)].sort();
  let best = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++){
    const prev = new Date(sorted[i-1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((curr - prev) / 86400000);
    if (diff === 1){ cur++; best = Math.max(best, cur); }
    else { cur = 1; }
  }
  return best;
}

/* ═══════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════ */
function applyTheme(){
  const t = THEMES[s.theme] || THEMES.violet;
  const root = document.documentElement.style;
  root.setProperty('--bg', t.bg);
  root.setProperty('--bg-grad', t.grad);
  root.setProperty('--card-bg', t.card);
  root.setProperty('--accent', t.accent);
  root.setProperty('--accent2', t.accent2);
  root.setProperty('--text', t.text);
  root.setProperty('--dim', t.dim);
  root.setProperty('--line', t.line);
  document.body.style.background = t.bg;
  document.body.style.backgroundImage = t.grad;
  document.body.style.backgroundAttachment = 'fixed';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t.bg);
}

/* ═══════════════════════════════════════════
   TOAST & CONFETTI & RIPPLE
   ═══════════════════════════════════════════ */
let toastTimer;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

function burst(el){
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const colors = ['#34d399','#22d3ee','#a78bfa','#f59e0b','#ec4899','#fff'];
  for (let i = 0; i < 30; i++){
    const p = document.createElement('div');
    p.className = 'conf';
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.background = colors[i % colors.length];
    p.style.boxShadow = '0 0 12px ' + colors[i % colors.length];
    document.body.appendChild(p);
    const angle = (Math.PI * 2 * i) / 30 + Math.random() * .5;
    const dist = 90 + Math.random() * 160;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;
    const rot = Math.random() * 900 - 450;
    p.animate([
      { transform:'translate(0,0) rotate(0)', opacity:1 },
      { transform:`translate(${dx}px,${dy}px) rotate(${rot}deg) scale(.2)`, opacity:0 }
    ], { duration: 900 + Math.random() * 500, easing:'cubic-bezier(.15,.6,.4,1)' })
      .onfinish = () => p.remove();
  }
}

// Ripple effect on buttons
document.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - r.left - size/2) + 'px';
  ripple.style.top = (e.clientY - r.top - size/2) + 'px';
  const cs = getComputedStyle(btn);
  if (cs.position === 'static') btn.style.position = 'relative';
  if (cs.overflow === 'visible') btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

/* ═══════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════ */
let activeFilter = 'all';
const container = document.getElementById('container');
const expanded = new Set();

function skillById(id){ return s.skills.find(x => x.id === id); }
function catById(id){ return CATS.find(x => x.id === id); }

function getSkillValue(id){
  const subs = s.subs[id] || [];
  if (subs.length > 0){
    const done = subs.filter(x => x.done).length;
    return Math.round((done / subs.length) * 100);
  }
  const st = s.progress[id] || 'todo';
  return STAT[st] ? STAT[st].value : 0;
}

function getSkillStatus(id){
  const subs = s.subs[id] || [];
  if (subs.length > 0){
    const pct = (subs.filter(x => x.done).length / subs.length) * 100;
    if (pct >= 100) return 'done';
    if (pct >= 75) return 'practice';
    if (pct >= 40) return 'learning';
    return 'todo';
  }
  return s.progress[id] || 'todo';
}

function renderFilters(){
  const f = document.getElementById('filters');
  f.innerHTML = '<button class="filter' + (activeFilter==='all'?' active':'') + '" data-f="all">همه</button>' +
    CATS.map(c => `<button class="filter${activeFilter===c.id?' active':''}" data-f="${c.id}">${esc(c.name)}</button>`).join('');
}

function render(){
  container.innerHTML = '';
  CATS.forEach(cat => {
    const inCat = s.order
      .map(id => skillById(id))
      .filter(sk => sk && sk.cat === cat.id && (activeFilter === 'all' || activeFilter === cat.id));
    if (inCat.length === 0) return;

    const sec = document.createElement('section');
    sec.className = 'section';
    sec.style.setProperty('--cat', cat.color);
    sec.innerHTML = `<div class="section-head">
      <span class="bar"></span>
      <h2>${esc(cat.name)}</h2>
      <span class="cnt" data-cnt="${cat.id}">0/0</span>
    </div>`;

    const done = inCat.filter(sk => getSkillStatus(sk.id) === 'done').length;
    sec.querySelector('.cnt').textContent = done + '/' + inCat.length;

    inCat.forEach(sk => sec.appendChild(buildCard(sk)));

    const addBtn = document.createElement('button');
    addBtn.className = 'tool primary';
    addBtn.style.cssText = 'width:100%;justify-content:center;margin-top:4px;font-size:11.5px';
    addBtn.innerHTML = '＋ افزودن به این دسته';
    addBtn.addEventListener('click', () => openAddModal(cat.id));
    sec.appendChild(addBtn);

    container.appendChild(sec);
  });

  if (s.skills.length === 0){
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--dim);font-size:13px">' +
      'هنوز مهارتی نداری.<br>با دکمه‌ی «مهارت جدید» شروع کن.</div>';
  }
}

function buildCard(sk){
  const id = sk.id;
  const st = getSkillStatus(id);
  const stData = STAT[st];
  const val = getSkillValue(id);
  const isExpanded = expanded.has(id);
  const subs = s.subs[id] || [];
  const subDone = subs.filter(x => x.done).length;
  const hasNote = (s.notes[id] || '').trim().length > 0;
  const skillSeconds = s.skillTime[id] || 0;
  const isTimed = timer && timer.running && timer.skillId === id;

  const card = document.createElement('article');
  card.className = 'card' + (isExpanded ? ' expanded' : '') + (val >= 100 ? ' done' : '') + (isTimed ? ' timed' : '');
  card.dataset.id = id;
  card.style.setProperty('--status', stData.color);

  const stateExtra = subs.length > 0 ? ` · ${subDone}/${subs.length}` : '';
  const timeBadge = skillSeconds >= 60 ? `<span class="time-badge">⏱ ${formatTime(skillSeconds)}</span>` : '';

  const statusBtns = STAT_ORDER.map(k => {
    const S = STAT[k];
    return `<button class="status${k===st?' active':''}" data-st="${k}" style="--st:${S.color}">
      <span class="n">${S.n}</span>${S.label}
    </button>`;
  }).join('');

  card.innerHTML = `
    <div class="card-summary">
      <div class="icon">${esc(sk.icon)}</div>
      <div class="info">
        <h3>${esc(sk.name)}${timeBadge}</h3>
        <div class="state">${stData.label}${stateExtra}</div>
      </div>
      <div class="mini">
        <svg viewBox="0 0 52 52">
          <circle class="t" cx="26" cy="26" r="23"/>
          <circle class="f" cx="26" cy="26" r="23"/>
        </svg>
        <span class="n">${val}</span>
      </div>
      <span class="expand-arrow">▼</span>
    </div>
    <div class="card-body">
      <div class="card-body-inner">
        <div class="statuses">${statusBtns}</div>
        <div class="tools-row">
          <button class="tool-btn${hasNote?' has-note':''}" data-tool="notes">
            📝${hasNote?'<span class="dot-badge"></span>':''}
          </button>
          <button class="tool-btn" data-tool="subs">
            ✓${subs.length?' '+subs.length:''}
          </button>
          <button class="tool-btn focus-btn" data-tool="focus">🎯 تمرکز</button>
          <button class="tool-btn" data-tool="edit">✎</button>
          <button class="tool-btn" data-tool="del" style="flex:0 0 auto">🗑</button>
        </div>
        <div class="panel-inner" data-panel="notes">
          <textarea class="note-area" placeholder="یادداشت این مهارت...">${esc(s.notes[id]||'')}</textarea>
        </div>
        <div class="panel-inner" data-panel="subs">
          <div class="sub-add">
            <input type="text" placeholder="زیرموضوع جدید..." data-sub-input>
            <button data-sub-add>+</button>
          </div>
          <div data-sub-list>
            ${subs.map((x, i) => `
              <div class="sub-item${x.done?' done':''}">
                <input type="checkbox" ${x.done?'checked':''} data-sub-toggle="${i}">
                <span class="sub-text">${esc(x.text)}</span>
                <button class="sub-rm" data-sub-rm="${i}">✕</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  return card;
}

function renderAll(){
  renderFilters();
  render();
  updateOverall();
  renderTimer();
  renderAchievements();
}

/* ═══════════════════════════════════════════
   OVERALL
   ═══════════════════════════════════════════ */
function updateOverall(){
  let sum = 0, d = 0, l = 0, t = 0;
  s.skills.forEach(sk => {
    const st = getSkillStatus(sk.id);
    const v = getSkillValue(sk.id);
    sum += v;
    if (st === 'done') d++;
    else if (st === 'todo') t++;
    else l++;
  });
  const p = s.skills.length ? Math.round(sum / s.skills.length) : 0;

  document.getElementById('pct').textContent = p + '%';
  document.getElementById('overallRing').style.strokeDashoffset = 283 * (1 - p/100);
  document.getElementById('done').textContent = d;
  document.getElementById('learning').textContent = l;
  document.getElementById('todo').textContent = t;

  const stk = streak();
  document.getElementById('streakNum').textContent = stk;
  document.getElementById('streakBig').textContent = stk;
  document.getElementById('streakBest').textContent = Math.max(stk, bestStreak());
}

/* ═══════════════════════════════════════════
   CARD INTERACTIONS
   ═══════════════════════════════════════════ */
container.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const id = card.dataset.id;

  const statusBtn = e.target.closest('.status');
  if (statusBtn){
    e.stopPropagation();
    const st = statusBtn.dataset.st;
    if (s.progress[id] !== st){
      const old = s.progress[id];
      s.progress[id] = st;
      save();
      markDay();
      rerenderCard(id);
      updateOverall();
      checkAchievements();
      if (st === 'done' && old !== 'done'){
        burst(card);
        vibrate([20, 40, 30]);
      } else {
        vibrate(12);
      }
    }
    return;
  }

  const toolBtn = e.target.closest('.tool-btn');
  if (toolBtn){
    e.stopPropagation();
    const tool = toolBtn.dataset.tool;
    if (tool === 'del'){
      const sk = skillById(id);
      if (!sk) return;
      if (!confirm(`«${sk.name}» حذف بشه؟`)) return;
      s.skills = s.skills.filter(x => x.id !== id);
      s.order = s.order.filter(x => x !== id);
      delete s.progress[id];
      delete s.notes[id];
      delete s.subs[id];
      delete s.skillTime[id];
      expanded.delete(id);
      if (timer && timer.skillId === id){
        timer.running = false; timer.skillId = null;
        stopTimerTick();
      }
      save();
      render();
      updateOverall();
      renderTimer();
      toast('🗑 حذف شد');
      vibrate(15);
      return;
    }
    if (tool === 'edit'){ openAddModal(null, id); return; }
    if (tool === 'focus'){ openFocus(id); return; }
    const panel = card.querySelector(`.panel-inner[data-panel="${tool}"]`);
    if (panel){
      card.querySelectorAll('.panel-inner').forEach(p => { if (p !== panel) p.classList.remove('open'); });
      panel.classList.toggle('open');
      if (tool === 'notes' && panel.classList.contains('open')){
        setTimeout(() => panel.querySelector('textarea').focus(), 100);
      }
    }
    return;
  }

  // Expand
  if (e.target.closest('.card-summary')){
    if (expanded.has(id)){ expanded.delete(id); card.classList.remove('expanded'); }
    else { expanded.add(id); card.classList.add('expanded'); }
    vibrate(8);
  }
});

container.addEventListener('input', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  if (e.target.classList.contains('note-area')){
    s.notes[card.dataset.id] = e.target.value;
    save();
    const chip = card.querySelector('[data-tool="notes"]');
    const val = e.target.value.trim();
    chip.classList.toggle('has-note', val.length > 0);
    const dot = chip.querySelector('.dot-badge');
    if (val.length > 0 && !dot) chip.insertAdjacentHTML('beforeend', '<span class="dot-badge"></span>');
    if (val.length === 0 && dot) dot.remove();
    checkAchievements();
  }
});

container.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const id = card.dataset.id;

  if (e.target.matches('[data-sub-add]')){
    e.stopPropagation();
    const input = card.querySelector('[data-sub-input]');
    const txt = input.value.trim();
    if (!txt) return;
    if (!s.subs[id]) s.subs[id] = [];
    s.subs[id].push({ text: txt, done: false });
    save();
    input.value = '';
    const wasExpanded = expanded.has(id);
    const wrapper = card.parentNode;
    const newCard = buildCard(skillById(id));
    if (wasExpanded) newCard.classList.add('expanded');
    wrapper.replaceChild(newCard, card);
    newCard.querySelectorAll('.panel-inner').forEach(p => p.classList.add('open'));
    vibrate(10);
    updateOverall();
    return;
  }

  const rmBtn = e.target.closest('[data-sub-rm]');
  if (rmBtn){
    e.stopPropagation();
    const i = +rmBtn.dataset.subRm;
    s.subs[id].splice(i, 1);
    save();
    const wasExpanded = expanded.has(id);
    const wrapper = card.parentNode;
    const newCard = buildCard(skillById(id));
    if (wasExpanded) newCard.classList.add('expanded');
    wrapper.replaceChild(newCard, card);
    newCard.querySelectorAll('.panel-inner').forEach(p => p.classList.add('open'));
    vibrate(10);
    updateOverall();
    return;
  }
});

container.addEventListener('change', e => {
  if (!e.target.matches('[data-sub-toggle]')) return;
  const card = e.target.closest('.card');
  const id = card.dataset.id;
  const i = +e.target.dataset.subToggle;
  if (!s.subs[id] || !s.subs[id][i]) return;
  s.subs[id][i].done = e.target.checked;
  save();
  rerenderCard(id);
  updateOverall();
  checkAchievements();
  vibrate(8);
});

function rerenderCard(id){
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (!card) return;
  const sk = skillById(id);
  if (!sk) return;
  const wasExpanded = card.classList.contains('expanded');
  const wrapper = card.parentNode;
  const newCard = buildCard(sk);
  if (wasExpanded) newCard.classList.add('expanded');
  wrapper.replaceChild(newCard, card);
  updateSectionCounts();
}

function updateSectionCounts(){
  CATS.forEach(cat => {
    const cnt = document.querySelector(`.section .cnt[data-cnt="${cat.id}"]`);
    if (!cnt) return;
    const inCat = s.order.map(id => skillById(id)).filter(sk => sk && sk.cat === cat.id);
    const done = inCat.filter(sk => getSkillStatus(sk.id) === 'done').length;
    cnt.textContent = done + '/' + inCat.length;
  });
}

/* ═══════════════════════════════════════════
   FILTERS
   ═══════════════════════════════════════════ */
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  activeFilter = btn.dataset.f;
  renderFilters();
  render();
  vibrate(8);
});

/* ═══════════════════════════════════════════
   ADD / EDIT MODAL
   ═══════════════════════════════════════════ */
let editingId = null;
let selectedIcon = '🎯';

function openAddModal(presetCat, id){
  editingId = id || null;
  const sel = document.getElementById('skillCat');
  sel.innerHTML = '';
  CATS.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.name;
    sel.appendChild(o);
  });

  if (id){
    const sk = skillById(id);
    if (!sk) return;
    document.getElementById('addModalTitle').textContent = 'ویرایش مهارت';
    document.getElementById('skillName').value = sk.name;
    sel.value = sk.cat;
    selectedIcon = sk.icon;
  } else {
    document.getElementById('addModalTitle').textContent = 'مهارت جدید';
    document.getElementById('skillName').value = '';
    if (typeof presetCat === 'string') sel.value = presetCat;
    else sel.value = CATS[0].id;
    selectedIcon = '🎯';
  }
  buildIconGrid();
  updateSkillPreview();
  document.getElementById('addModal').classList.add('open');
  setTimeout(() => document.getElementById('skillName').focus(), 200);
}

function buildIconGrid(){
  const grid = document.getElementById('iconGrid');
  grid.innerHTML = ICONS.map(ic =>
    `<button class="icon-opt${ic===selectedIcon?' selected':''}" data-icon="${esc(ic)}" type="button">${ic}</button>`
  ).join('');
  grid.onclick = e => {
    const btn = e.target.closest('[data-icon]');
    if (!btn) return;
    selectedIcon = btn.dataset.icon;
    buildIconGrid();
    updateSkillPreview();
  };
}

function updateSkillPreview(){
  const name = document.getElementById('skillName').value.trim() || 'نام مهارت';
  const catId = document.getElementById('skillCat').value;
  const cat = catById(catId);
  document.getElementById('pvIcon').textContent = selectedIcon;
  document.getElementById('pvName').textContent = name;
  document.getElementById('pvCat').textContent = cat ? cat.name : '';
}

document.getElementById('skillName').addEventListener('input', updateSkillPreview);
document.getElementById('skillCat').addEventListener('change', updateSkillPreview);

document.getElementById('skillSave').addEventListener('click', () => {
  const name = document.getElementById('skillName').value.trim();
  const catId = document.getElementById('skillCat').value;
  if (!name){
    const inp = document.getElementById('skillName');
    inp.focus();
    inp.style.borderColor = '#f87171';
    setTimeout(() => inp.style.borderColor = '', 1200);
    return;
  }
  if (editingId){
    const sk = skillById(editingId);
    if (sk){ sk.name = name; sk.cat = catId; sk.icon = selectedIcon; }
    toast('✓ ویرایش شد');
  } else {
    const id = uid();
    s.skills.push({ id, name, cat: catId, icon: selectedIcon });
    s.order.push(id);
    s.progress[id] = 'todo';
    s.subs[id] = [];
    s.skillTime[id] = 0;
    s.customCount = (s.customCount || 0) + 1;
    toast('✓ اضافه شد');
  }
  save();
  document.getElementById('addModal').classList.remove('open');
  render();
  updateOverall();
  checkAchievements();
  vibrate(15);
});

/* ═══════════════════════════════════════════
   THEME PICKER
   ═══════════════════════════════════════════ */
function renderThemePicker(){
  const list = document.getElementById('themeList');
  list.innerHTML = Object.entries(THEMES).map(([key, t]) => {
    const active = s.theme === key;
    const bgStyle = `background:${t.bg};background-image:${t.grad};color:${t.text}`;
    return `
      <div class="theme-option${active?' active':''}" data-theme="${key}" style="${bgStyle}">
        <span class="th-check">✓</span>
        <div class="th-name">${esc(t.name)}</div>
        <div class="th-swatch">
          <div class="th-dot" style="background:${t.accent}"></div>
          <div class="th-dot" style="background:${t.accent2}"></div>
          <div class="th-dot" style="background:${t.card};border-color:${t.line}"></div>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('themeList').addEventListener('click', e => {
  const opt = e.target.closest('[data-theme]');
  if (!opt) return;
  s.theme = opt.dataset.theme;
  save();
  applyTheme();
  renderThemePicker();
  vibrate(15);
});

document.getElementById('themeBtn').addEventListener('click', () => {
  renderThemePicker();
  document.getElementById('themeModal').classList.add('open');
});

/* ═══════════════════════════════════════════
   MODAL CLOSE
   ═══════════════════════════════════════════ */
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.close).classList.remove('open');
  });
});
document.querySelectorAll('.mb').forEach(mb => {
  mb.addEventListener('click', e => { if (e.target === mb) mb.classList.remove('open'); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){
    document.querySelectorAll('.mb.open').forEach(m => m.classList.remove('open'));
    if (focusId) closeFocus();
  }
});

/* ═══════════════════════════════════════════
   TIMER (per-skill)
   ═══════════════════════════════════════════ */
const TIMER_KEY = 'informatik-timer-v9';
let timer = {
  duration: 1500,
  remaining: 1500,
  running: false,
  endTime: null,
  skillId: null,
  sessionStart: null
};

function loadTimer(){
  try {
    const t = JSON.parse(localStorage.getItem(TIMER_KEY) || 'null');
    if (t && typeof t === 'object'){
      timer.duration = t.duration || 1500;
      timer.remaining = typeof t.remaining === 'number' ? t.remaining : timer.duration;
      timer.skillId = t.skillId || null;
      if (t.running && t.endTime){
        const left = (t.endTime - Date.now()) / 1000;
        if (left > 0){
          timer.running = true;
          timer.endTime = t.endTime;
          timer.sessionStart = Date.now();
          timer.remaining = left;
        } else {
          timer.running = false;
          timer.remaining = timer.duration;
        }
      }
    }
  } catch(e){}
}

function saveTimer(){
  try {
    localStorage.setItem(TIMER_KEY, JSON.stringify({
      duration: timer.duration,
      remaining: timer.running ? Math.max(0, (timer.endTime - Date.now()) / 1000) : timer.remaining,
      running: timer.running,
      endTime: timer.endTime,
      skillId: timer.skillId
    }));
  } catch(e){}
}

// Add session time to current skill
function commitSessionTime(){
  if (!timer.skillId || !timer.sessionStart) return;
  const elapsed = (Date.now() - timer.sessionStart) / 1000;
  if (elapsed > 1){
    s.skillTime[timer.skillId] = (s.skillTime[timer.skillId] || 0) + elapsed;
    save();
  }
  timer.sessionStart = null;
}

const PRESETS = [
  { label:'۵ د',  sec:300 },
  { label:'۱۵ د', sec:900 },
  { label:'۲۵ د', sec:1500 },
  { label:'۴۵ د', sec:2700 },
  { label:'۱ س',  sec:3600 }
];

function renderPresets(){
  const el = document.getElementById('timerPresets');
  el.innerHTML = PRESETS.map(p =>
    `<button class="${timer.duration===p.sec?'active':''}" data-preset="${p.sec}">${p.label}</button>`
  ).join('');
}
document.getElementById('timerPresets').addEventListener('click', e => {
  const btn = e.target.closest('[data-preset]');
  if (!btn) return;
  if (timer.running) return;
  timer.duration = +btn.dataset.preset;
  timer.remaining = timer.duration;
  saveTimer();
  renderPresets();
  renderTimer();
  vibrate(10);
});

function renderTimer(){
  const el = document.getElementById('timerDisplay');
  const remaining = timer.running
    ? Math.max(0, (timer.endTime - Date.now()) / 1000)
    : timer.remaining;
  const min = Math.floor(remaining / 60);
  const sec = Math.floor(remaining % 60);
  const cs = Math.floor((remaining % 1) * 100);
  el.innerHTML = `${pad(min)}:${pad(sec)}<span class="cs">.${pad(cs)}</span>`;
  el.classList.toggle('running', timer.running);
  const pct = timer.duration > 0 ? (remaining / timer.duration) * 100 : 100;
  document.getElementById('timerBar').style.width = pct + '%';

  const skillBtn = document.getElementById('timerSkillBtn');
  const skillName = document.getElementById('timerSkillName');
  if (timer.skillId && skillById(timer.skillId)){
    const sk = skillById(timer.skillId);
    skillBtn.classList.remove('empty');
    skillName.textContent = sk.icon + ' ' + sk.name;
  } else {
    skillBtn.classList.add('empty');
    skillName.textContent = 'انتخاب مهارت...';
  }

  document.getElementById('timerToggle').textContent =
    timer.running ? 'توقف' :
    (timer.remaining < timer.duration && timer.remaining > 0 ? 'ادامه' : 'شروع');

  // focus timer sync
  if (focusId === timer.skillId){
    const ft = document.getElementById('focusTimer');
    if (ft) ft.innerHTML = `${pad(min)}:${pad(sec)}<span class="cs">.${pad(cs)}</span>`;
  }
}

let timerInterval = null;

function startTimerTick(){
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!timer.running) return;
    const remaining = (timer.endTime - Date.now()) / 1000;
    if (remaining <= 0){
      timer.running = false;
      timer.remaining = timer.duration;
      clearInterval(timerInterval);
      timerInterval = null;
      commitSessionTime();
      saveTimer();
      renderTimer();
      render();
      updateOverall();
      checkAchievements();
      burst(document.getElementById('timerDisplay'));
      toast('🎉 تایمر تموم شد!');
      vibrate([40, 60, 40]);
      return;
    }
    renderTimer();
  }, 33);
}

document.getElementById('timerToggle').addEventListener('click', () => {
  if (timer.running){
    timer.remaining = Math.max(0, (timer.endTime - Date.now()) / 1000);
    timer.running = false;
    commitSessionTime();
    clearInterval(timerInterval);
    timerInterval = null;
    saveTimer();
    renderTimer();
    vibrate(10);
  } else {
    if (!timer.skillId){
      toast('اول یه مهارت انتخاب کن');
      openSkillPicker();
      return;
    }
    if (timer.remaining <= 0) timer.remaining = timer.duration;
    timer.endTime = Date.now() + timer.remaining * 1000;
    timer.running = true;
    timer.sessionStart = Date.now();
    s.timerStarted = (s.timerStarted || 0) + 1;
    save();
    saveTimer();
    startTimerTick();
    renderTimer();
    markDay();
    checkAchievements();
    vibrate(12);
    // re-render cards to show timed badge
    render();
  }
});

document.getElementById('timerResetBtn').addEventListener('click', () => {
  if (timer.running) commitSessionTime();
  timer.running = false;
  timer.remaining = timer.duration;
  timer.endTime = null;
  clearInterval(timerInterval);
  timerInterval = null;
  saveTimer();
  renderTimer();
  render();
  vibrate(10);
});

// Skill picker for timer
document.getElementById('timerSkillBtn').addEventListener('click', openSkillPicker);

function openSkillPicker(){
  if (s.skills.length === 0){ toast('اول یه مهارت اضافه کن'); return; }
  const options = s.skills.map(sk => `${sk.icon} ${sk.name}`).join('\n');
  const names = s.skills.map(sk => sk.name);
  // Use a select-like prompt (simple approach)
  const pick = prompt('کدوم مهارت؟ (شماره رو وارد کن)\n\n' + s.skills.map((sk, i) => (i+1) + '. ' + sk.icon + ' ' + sk.name).join('\n'));
  if (!pick) return;
  const i = parseInt(pick, 10) - 1;
  if (isNaN(i) || i < 0 || i >= s.skills.length){ toast('شماره نامعتبر'); return; }
  // if timer was running with another skill, commit time first
  if (timer.running && timer.skillId !== s.skills[i].id){
    commitSessionTime();
  }
  timer.skillId = s.skills[i].id;
  saveTimer();
  renderTimer();
  render();
  vibrate(10);
  toast('✓ ' + s.skills[i].name);
}

/* ═══════════════════════════════════════════
   FOCUS MODE
   ═══════════════════════════════════════════ */
let focusId = null;

function openFocus(id){
  const sk = skillById(id);
  if (!sk) return;
  focusId = id;
  s.focusUsed = (s.focusUsed || 0) + 1;
  save();
  document.body.classList.add('focus-mode');
  document.getElementById('focusOverlay').classList.add('open');
  document.getElementById('focusIcon').textContent = sk.icon;
  document.getElementById('focusName').textContent = sk.name;
  updateFocus();
  renderTimer();
  checkAchievements();
  vibrate(12);
}

function closeFocus(){
  focusId = null;
  document.body.classList.remove('focus-mode');
  document.getElementById('focusOverlay').classList.remove('open');
  render();
  vibrate(10);
}

function updateFocus(){
  if (!focusId) return;
  const sk = skillById(focusId);
  if (!sk){ closeFocus(); return; }
  const st = getSkillStatus(focusId);
  const stData = STAT[st];
  const val = getSkillValue(focusId);
  document.getElementById('focusStatus').textContent = stData.label;
  document.getElementById('focusStatus').style.setProperty('--status', stData.color);
  const ring = document.getElementById('focusRingFill');
  ring.style.stroke = stData.color;
  const circ = 2 * Math.PI * 90;
  ring.style.strokeDashoffset = circ * (1 - val/100);
  document.getElementById('focusPct').textContent = val + '%';
  document.getElementById('focusPct').style.color = stData.color;
  document.getElementById('focusTotalTime').textContent = formatTime(s.skillTime[focusId] || 0);
  document.getElementById('focusTimerBtn').textContent =
    (timer.running && timer.skillId === focusId) ? '⏸ توقف تایمر' : '▶ شروع تایمر';
}

document.getElementById('focusClose').addEventListener('click', closeFocus);

document.getElementById('focusTimerBtn').addEventListener('click', () => {
  if (!focusId) return;
  if (timer.running && timer.skillId === focusId){
    // stop
    timer.remaining = Math.max(0, (timer.endTime - Date.now()) / 1000);
    timer.running = false;
    commitSessionTime();
    clearInterval(timerInterval);
    timerInterval = null;
    saveTimer();
    renderTimer();
    updateFocus();
  } else {
    // if timer running for another skill, commit
    if (timer.running) commitSessionTime();
    timer.skillId = focusId;
    if (timer.remaining <= 0) timer.remaining = timer.duration;
    timer.endTime = Date.now() + timer.remaining * 1000;
    timer.running = true;
    timer.sessionStart = Date.now();
    s.timerStarted = (s.timerStarted || 0) + 1;
    save();
    saveTimer();
    startTimerTick();
    renderTimer();
    updateFocus();
    markDay();
    checkAchievements();
    vibrate(12);
  }
});

document.getElementById('focusStatusBtn').addEventListener('click', () => {
  if (!focusId) return;
  const order = STAT_ORDER;
  const cur = getSkillStatus(focusId);
  const idx = order.indexOf(cur);
  const next = order[(idx + 1) % order.length];
  // only allow manual if no subtasks
  if (s.subs[focusId] && s.subs[focusId].length > 0){
    toast('این مهارت زیرموضوع داره');
    return;
  }
  s.progress[focusId] = next;
  save();
  markDay();
  updateFocus();
  updateOverall();
  checkAchievements();
  if (next === 'done'){
    burst(document.getElementById('focusRingFill'));
    vibrate([20, 40, 30]);
  }
});

document.getElementById('focusNotesBtn').addEventListener('click', () => {
  if (!focusId) return;
  const sk = skillById(focusId);
  closeFocus();
  setTimeout(() => {
    const card = document.querySelector(`.card[data-id="${focusId}"]`);
    if (card){
      expanded.add(focusId);
      card.classList.add('expanded');
      const panel = card.querySelector('.panel-inner[data-panel="notes"]');
      if (panel){
        panel.classList.add('open');
        setTimeout(() => panel.querySelector('textarea').focus(), 150);
      }
    }
  }, 200);
});

document.getElementById('focusSubsBtn').addEventListener('click', () => {
  if (!focusId) return;
  closeFocus();
  setTimeout(() => {
    const card = document.querySelector(`.card[data-id="${focusId}"]`);
    if (card){
      expanded.add(focusId);
      card.classList.add('expanded');
      const panel = card.querySelector('.panel-inner[data-panel="subs"]');
      if (panel) panel.classList.add('open');
    }
  }, 200);
});

/* ═══════════════════════════════════════════
   ACHIEVEMENTS
   ═══════════════════════════════════════════ */
function renderAchievements(){
  const el = document.getElementById('achGrid');
  el.innerHTML = ACH.map(a => {
    const unlocked = s.unlocked.includes(a.id);
    return `<div class="ach${unlocked?' unlocked':''}">
      <span class="ach-icon">${a.icon}</span>
      <b>${esc(a.name)}</b>
      <small>${esc(a.desc)}</small>
    </div>`;
  }).join('');
}

function checkAchievements(){
  const newOnes = [];
  ACH.forEach(a => {
    if (!s.unlocked.includes(a.id) && a.test()){
      s.unlocked.push(a.id);
      newOnes.push(a);
    }
  });
  if (newOnes.length){
    save();
    renderAchievements();
    newOnes.forEach((a, i) => {
      setTimeout(() => {
        toast('🏆 ' + a.name);
        const el = document.querySelector(`.ach-grid .ach:not(.unlocked)`);
      }, i * 500);
    });
    vibrate([30, 50, 30]);
  }
}

/* ═══════════════════════════════════════════
   STATS MODAL
   ═══════════════════════════════════════════ */
function renderStats(){
  const el = document.getElementById('statsContent');
  const tt = totalTime();

  // Time per skill
  const skillTimes = s.skills.map(sk => ({
    name: sk.name,
    icon: sk.icon,
    time: s.skillTime[sk.id] || 0
  })).filter(x => x.time > 0).sort((a,b) => b.time - a.time);

  const maxTime = skillTimes.length ? skillTimes[0].time : 1;

  // Last 28 days
  const days = [];
  for (let i = 27; i >= 0; i--){
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d,
      str: today(d),
      active: s.dates.includes(today(d)),
      isToday: i === 0
    });
  }

  // Chart HTML
  const chartHTML = skillTimes.length === 0
    ? '<div style="text-align:center;padding:22px;color:var(--dim);font-size:12px">هنوز وقتی ثبت نشده. تایمر رو شروع کن.</div>'
    : skillTimes.slice(0, 8).map(x => `
        <div class="chart-row">
          <span class="label">${x.icon} ${esc(x.name)}</span>
          <div class="bar-bg"><div class="bar-fill" style="width:${(x.time/maxTime*100).toFixed(1)}%"></div></div>
          <span class="val">${formatTime(x.time)}</span>
        </div>
      `).join('');

  // Days grid
  const daysHTML = days.map(d => `
    <div class="day-cell${d.active?' active':''}${d.isToday?' today':''}" title="${d.str}">
      ${d.active ? '●' : ''}
    </div>
  `).join('');

  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile">
        <b>${formatTime(tt)}</b>
        <span>کل زمان مطالعه</span>
      </div>
      <div class="stat-tile">
        <b>${s.unlocked.length}/${ACH.length}</b>
        <span>دستاورد</span>
      </div>
      <div class="stat-tile">
        <b>${bestStreak()}</b>
        <span>بهترین Streak</span>
      </div>
      <div class="stat-tile">
        <b>${s.dates.length}</b>
        <span>روزهای فعال</span>
      </div>
    </div>
    <div style="margin-bottom:18px">
      <div class="chart-title">⏱ زمان هر مهارت</div>
      ${chartHTML}
    </div>
    <div>
      <div class="chart-title">📅 ۲۸ روز اخیر</div>
      <div class="days-grid">${daysHTML}</div>
    </div>
  `;
}

document.getElementById('statsBtn').addEventListener('click', () => {
  renderStats();
  document.getElementById('statsModal').classList.add('open');
});

/* ═══════════════════════════════════════════
   REMINDER
   ═══════════════════════════════════════════ */
function updateReminderUI(){
  document.getElementById('reminderTime').value = s.reminder.time;
  const on = s.reminder.enabled;
  const onBtn = document.getElementById('reminderOn');
  const offBtn = document.getElementById('reminderOff');
  onBtn.style.background = on ? 'color-mix(in srgb,var(--accent) 20%,transparent)' : 'rgba(0,0,0,.2)';
  onBtn.style.borderColor = on ? 'var(--accent)' : 'var(--line)';
  offBtn.style.background = !on ? 'color-mix(in srgb,var(--dim) 20%,transparent)' : 'rgba(0,0,0,.2)';
}

document.getElementById('reminderBtn').addEventListener('click', () => {
  updateReminderUI();
  document.getElementById('reminderModal').classList.add('open');
});

document.getElementById('reminderOn').addEventListener('click', async () => {
  if ('Notification' in window){
    const perm = await Notification.requestPermission();
    if (perm !== 'granted'){
      toast('اجازه‌ی نوتیفیکیشن داده نشد');
      return;
    }
  } else {
    toast('مرورگر از نوتیفیکیشن پشتیبانی نمی‌کنه');
    return;
  }
  s.reminder.enabled = true;
  save();
  updateReminderUI();
  toast('✓ یادآوری فعال شد');
});

document.getElementById('reminderOff').addEventListener('click', () => {
  s.reminder.enabled = false;
  save();
  updateReminderUI();
  toast('یادآوری خاموش شد');
});

document.getElementById('reminderSave').addEventListener('click', () => {
  s.reminder.time = document.getElementById('reminderTime').value || '20:00';
  save();
  document.getElementById('reminderModal').classList.remove('open');
  toast('✓ ذخیره شد');
});

function checkReminder(){
  if (!s.reminder.enabled) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const t = today();
  if (s.reminder.lastNotified === t) return;
  const now = new Date();
  const [h, m] = (s.reminder.time || '20:00').split(':').map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (now < target) return;
  try {
    new Notification('مسیر یادگیری 📚', {
      body: 'یادت نره امروز یه قدم جلو بری 🔥',
      tag: 'informatik-reminder'
    });
    s.reminder.lastNotified = t;
    save();
  } catch(e){}
}

/* ═══════════════════════════════════════════
   SYNC (GitHub Gist)
   ═══════════════════════════════════════════ */
document.getElementById('syncBtn').addEventListener('click', () => {
  document.getElementById('syncToken').value = syncToken || '';
  document.getElementById('syncGist').value = s.sync.gistId || '';
  document.getElementById('syncModal').classList.add('open');
});

document.getElementById('syncSave').addEventListener('click', () => {
  syncToken = document.getElementById('syncToken').value.trim();
  s.sync.gistId = document.getElementById('syncGist').value.trim();
  save();
  document.getElementById('syncModal').classList.remove('open');
  toast('✓ ذخیره شد');
});

document.getElementById('syncPush').addEventListener('click', async () => {
  const token = document.getElementById('syncToken').value.trim();
  let gistId = document.getElementById('syncGist').value.trim();
  if (!token){ toast('توکن رو وارد کن'); return; }

  const payload = {
    description: 'Learning Path — synced data',
    public: false,
    files: {
      'learning-path.json': {
        content: JSON.stringify(s)
      }
    }
  };

  try {
    let url = 'https://api.github.com/gists';
    let method = 'POST';
    if (gistId){
      url = `https://api.github.com/gists/${gistId}`;
      method = 'PATCH';
    }
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': 'token ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok){
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || ('HTTP ' + res.status));
    }
    const data = await res.json();
    syncToken = token;
    s.sync.gistId = data.id;
    s.sync.lastSync = Date.now();
    save();
    document.getElementById('syncGist').value = data.id;
    toast('☁️ ارسال شد');
    vibrate(20);
  } catch(e){
    toast('خطا: ' + (e.message || 'ناموفق'));
  }
});

document.getElementById('syncPull').addEventListener('click', async () => {
  const token = document.getElementById('syncToken').value.trim();
  const gistId = document.getElementById('syncGist').value.trim();
  if (!token || !gistId){ toast('توکن و Gist ID لازمه'); return; }

  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': 'token ' + token,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const file = data.files && data.files['learning-path.json'];
    if (!file) throw new Error('فایل پیدا نشد');
    const content = file.content || '';
    const parsed = JSON.parse(content);
    if (typeof parsed !== 'object' || !parsed.skills) throw new Error('داده نامعتبر');

    if (!confirm('داده‌های فعلی جایگزین بشن؟')) return;

    s = normalizeState(parsed);
    // ensure defaults
    s.progress = s.progress || {};
    s.notes = s.notes || {};
    s.subs = s.subs || {};
    s.skillTime = s.skillTime || {};
    s.order = Array.isArray(s.order) ? s.order : (s.skills||[]).map(x=>x.id);
    s.dates = Array.isArray(s.dates) ? s.dates : [];
    s.theme = s.theme || 'violet';
    s.unlocked = Array.isArray(s.unlocked) ? s.unlocked : [];
    s.reminder = s.reminder || { enabled: false, time: '20:00', lastNotified: null };
    s.sync = s.sync || { token: '', gistId: '', lastSync: null };
    s.sync.token = token;
    s.sync.gistId = gistId;
    s.sync.lastSync = Date.now();
    s.skills.forEach(sk => {
      if (!s.progress[sk.id]) s.progress[sk.id] = 'todo';
      if (!Array.isArray(s.subs[sk.id])) s.subs[sk.id] = [];
      if (!s.skillTime[sk.id]) s.skillTime[sk.id] = 0;
      if (!s.order.includes(sk.id)) s.order.push(sk.id);
    });
    save();
    applyTheme();
    renderAll();
    document.getElementById('syncModal').classList.remove('open');
    toast('☁️ دریافت شد');
    vibrate(20);
  } catch(e){
    toast('خطا: ' + (e.message || 'ناموفق'));
  }
});

/* ═══════════════════════════════════════════
   BACKUP / RESTORE / RESET
   ═══════════════════════════════════════════ */
document.getElementById('backupBtn').addEventListener('click', async () => {
  const backupState=JSON.parse(JSON.stringify(s));
  if(backupState.sync) delete backupState.sync.token;
  const data=JSON.stringify(backupState);
  try {
    await navigator.clipboard.writeText(data);
    toast('✓ پشتیبان کپی شد (' + Math.round(data.length/1024) + 'KB)');
  } catch(e){
    prompt('متن پشتیبان:', data);
  }
  vibrate(15);
});

document.getElementById('restoreBtn').addEventListener('click', () => {
  const x = prompt('متن پشتیبان رو پیست کن:');
  if (!x) return;
  try {
    const parsed = JSON.parse(x);
    if (typeof parsed !== 'object' || parsed === null) throw 0;
    if (!parsed.skills) throw 0;
    if (!confirm('داده‌های فعلی جایگزین بشن؟')) return;
    s = normalizeState(parsed);
    s.progress = s.progress || {};
    s.notes = s.notes || {};
    s.subs = s.subs || {};
    s.skillTime = s.skillTime || {};
    s.order = Array.isArray(s.order) ? s.order : (s.skills||[]).map(x=>x.id);
    s.dates = Array.isArray(s.dates) ? s.dates : [];
    s.theme = s.theme || 'violet';
    s.unlocked = Array.isArray(s.unlocked) ? s.unlocked : [];
    s.reminder = s.reminder || { enabled: false, time: '20:00', lastNotified: null };
    s.sync = s.sync || { token: '', gistId: '', lastSync: null };
    if (!Array.isArray(s.skills) || s.skills.length === 0) s.skills = DEFAULT_SKILLS.slice();
    s.skills.forEach(sk => {
      if (!s.progress[sk.id]) s.progress[sk.id] = 'todo';
      if (!Array.isArray(s.subs[sk.id])) s.subs[sk.id] = [];
      if (!s.skillTime[sk.id]) s.skillTime[sk.id] = 0;
      if (!s.order.includes(sk.id)) s.order.push(sk.id);
    });
    save();
    applyTheme();
    renderAll();
    toast('✓ بازیابی شد');
    vibrate(15);
  } catch(e){
    toast('✗ پشتیبان نامعتبر');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('همه‌ی پیشرفت صفر می‌شه (مهارت‌های شخصی حذف می‌شن). مطمئنی؟')) return;
  const keepDates = s.dates;
  const keepTheme = s.theme;
  const keepSync = s.sync;
  const keepReminder = s.reminder;
  s = {
    skills: DEFAULT_SKILLS.slice(),
    progress: {}, notes: {}, subs: {}, skillTime: {},
    order: DEFAULT_SKILLS.map(x=>x.id),
    dates: keepDates, theme: keepTheme, unlocked: [],
    customCount: 0, timerStarted: 0, focusUsed: 0,
    reminder: keepReminder, sync: { gistId: keepSync?.gistId || '', lastSync: keepSync?.lastSync || null }
  };
  s.skills.forEach(sk => {
    s.progress[sk.id] = 'todo';
    s.subs[sk.id] = [];
    s.skillTime[sk.id] = 0;
  });
  save();
  expanded.clear();
  applyTheme();
  renderAll();
  toast('↻ ریست شد');
  vibrate(20);
});

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
function init(){
  markDay();
  loadTimer();
  applyTheme();
  renderAll();
  renderPresets();
  updateReminderUI();
  if (timer.running) startTimerTick();
  renderTimer();

  // Daily quote
  const d = new Date();
  const dayIdx = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const q = QUOTES[dayIdx % QUOTES.length];
  document.getElementById('quote').textContent = q.t;
  document.getElementById('quoteAuthor').textContent = '— ' + q.a;

  // Check reminder every 60s
  checkReminder();
  setInterval(checkReminder, 60000);

  // Service worker
  if ('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    });
  }

  // Save timer on hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden){
      if (timer.running) commitSessionTime();
      saveTimer();
    } else {
      if (timer.running){
        const left = (timer.endTime - Date.now()) / 1000;
        if (left <= 0){
          timer.running = false;
          timer.remaining = timer.duration;
          clearInterval(timerInterval);
          timerInterval = null;
          saveTimer();
        } else {
          timer.sessionStart = Date.now();
        }
      }
      renderTimer();
      updateFocus();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (timer.running) commitSessionTime();
    saveTimer();
  });
  window.addEventListener('pagehide', () => {
    if (timer.running) commitSessionTime();
    saveTimer();
  });
}


function initAccessibility(){
  const labels={focusClose:'بستن حالت تمرکز',syncBtn:'همگام‌سازی با GitHub',backupBtn:'ایجاد پشتیبان',restoreBtn:'بازیابی پشتیبان',resetBtn:'بازنشانی داده‌ها',statsBtn:'نمایش آمار',reminderBtn:'تنظیم یادآور'};
  Object.entries(labels).forEach(([id,label])=>{const el=document.getElementById(id);if(el)el.setAttribute('aria-label',label);});
}
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  const open=document.querySelector('.mb.open');
  if(open){open.classList.remove('open');return;}
  if(document.getElementById('focusOverlay')?.classList.contains('open'))closeFocus();
});

initAccessibility();
init();

})();
