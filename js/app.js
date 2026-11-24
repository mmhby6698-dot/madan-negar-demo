(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const nf=n=>fa(Math.round(n).toLocaleString('en-US').replace(/,/g,'٬'));
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)};

/* ---------- noise ---------- */
function hash(x,y,s){let h=Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s,1442695041)|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967295}
function noise(x,y,s=0){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,y,s=0,o=4){let t=0,a=.5,f=1;for(let i=0;i<o;i++){t+=a*noise(x*f,y*f,s+i*17);f*=2.03;a*=.5}return t/(1-Math.pow(.5,o))}
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const ss=(e0,e1,x)=>{const t=clamp((x-e0)/(e1-e0));return t*t*(3-2*t)};
const vein=(x,y,fx,fy,warp,s,w)=>{const d=Math.abs(Math.sin((x*fx+y*fy+fbm(x*2.2,y*2.2,s,4)*warp)*Math.PI));return 1-ss(0,w,d)};

/* ---------- stones ---------- */
const STONES=[
 {id:'tr',code:'MN-TR-01',name:'تراورتن کرم',fam:'تراورتن',reg:'محلات (دره‌بخاری)',mohs:[3,4],tone:['light','warm'],
  px(x,y){const b=Math.sin(y*26+fbm(x*1.6,y*5,1)*4.2)*.5+.5;let c=mix([196,172,134],[234,221,198],b*.8+fbm(x*6,y*6,2,3)*.25);
   const p=noise(x*22,y*150,3);if(p>.85)c=mix(c,[140,114,82],ss(.85,.93,p)*.75);return c}},
 {id:'rt',code:'MN-RT-02',name:'تراورتن قرمز',fam:'تراورتن',reg:'آذرشهر',mohs:[3,4],tone:['warm'],
  px(x,y){const b=Math.sin(y*20+fbm(x*1.4,y*4,4)*5)*.5+.5;let c=mix([128,46,34],[186,92,64],b*.7+fbm(x*5,y*5,5,3)*.3);
   const p=noise(x*20,y*130,6);if(p>.82)c=mix(c,[70,24,18],ss(.82,.92,p)*.7);return c}},
 {id:'bk',code:'MN-BK-03',name:'مرمریت مشکی رگه‌طلایی',fam:'مرمریت',reg:'نجف‌آباد',mohs:[3,4],tone:['dark'],
  px(x,y){let c=mix([18,17,17],[42,40,38],fbm(x*3,y*3,7,4));c=mix(c,[206,163,92],vein(x,y,1.3,2.1,4.5,8,.05)*.95);
   c=mix(c,[226,200,150],vein(x,y,-2.6,1.2,3,9,.025)*.7);return c}},
 {id:'wm',code:'MN-WM-04',name:'مرمر سفید یخی',fam:'مرمر / چینی',reg:'ازنا و قروه',mohs:[3,4],tone:['light'],
  px(x,y){let c=mix([226,225,222],[246,245,242],fbm(x*2.5,y*2.5,10,4));const k=fbm(x*1.2,y*1.2,11,3);
   c=mix(c,[112,114,120],vein(x,y,2.2,1.1,5,12,.04)*(.35+.6*k));c=mix(c,[150,152,158],vein(x,y,-1,3,2.5,13,.02)*.45);return c}},
 {id:'ox',code:'MN-OX-05',name:'اونیکس عسلی',fam:'اونیکس',reg:'یزد',mohs:[3,3.5],tone:['warm','light'],
  px(x,y){const t=y*6+fbm(x*1.3,y*1.3,14,4)*5+Math.sin(x*3)*.6;const f=t-Math.floor(t);
   const P=[[238,206,132],[208,138,58],[246,229,186],[176,98,38],[238,206,132]];const i=Math.floor(f*4),g=f*4-i;
   let c=mix(P[i],P[i+1],ss(0,1,g));return mix(c,[255,244,214],fbm(x*4,y*4,15,3)*.35)}},
 {id:'gr',code:'MN-GR-06',name:'گرانیت طوسی',fam:'گرانیت',reg:'نطنز و مشهد',mohs:[6,7],tone:['dark'],
  px(x,y){let c=mix([128,127,126],[168,166,163],noise(x*40,y*40,16));const a=noise(x*85,y*85,17),b=noise(x*160,y*160,18),d=noise(x*60,y*60,19);
   if(a>.7)c=mix(c,[40,40,42],ss(.7,.76,a));if(b>.76)c=mix(c,[232,229,224],ss(.76,.8,b));if(d>.8)c=mix(c,[150,120,112],ss(.8,.85,d)*.8);return c}}
];
const FINISH=[
 {id:'pol',name:'صیقلی',g:.48,g2:.28,fx:c=>{const m=(c[0]+c[1]+c[2])/3;return c.map(v=>clamp(m+(v-m)*1.12+(v-128)*.08,0,255))}},
 {id:'hon',name:'مات (ساب)',g:.16,g2:.08,fx:c=>c.map(v=>v*.9+128*.1*.9+6)},
 {id:'bus',name:'تیشه‌ای',g:.05,g2:0,fx:(c,x,y)=>{const m=(c[0]+c[1]+c[2])/3,n=(hash(x*9|0,y*9|0,3)-.5)*40;return c.map(v=>clamp(m+(v-m)*.5+26+n,0,255))}},
 {id:'lea',name:'چرمی',g:.14,g2:.05,fx:(c,u,v)=>{const e=.004,n0=noise(u*16,v*16,21),s=(noise(u*16+e*16,v*16+e*16,21)-n0)*900;return c.map(val=>clamp(val*.95+s+4,0,255))}}
];
const cache=new Map();
function render(stone,finish,w,h,book){
  const key=[stone.id,finish.id,w,h,book].join();if(cache.has(key))return cache.get(key);
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');
  const W=book?Math.ceil(w/2):w,img=c.createImageData(W,h),d=img.data,asp=w/h;
  for(let j=0;j<h;j++)for(let i=0;i<W;i++){const u=i/w*asp,v=j/h;let col=stone.px(u,v);
    col=finish.id==='bus'?finish.fx(col,i,j):finish.id==='lea'?finish.fx(col,u,v):finish.fx(col);
    const k=(j*W+i)*4;d[k]=col[0];d[k+1]=col[1];d[k+2]=col[2];d[k+3]=255}
  c.putImageData(img,0,0);
  if(book){c.save();c.translate(w,0);c.scale(-1,1);c.drawImage(cv,0,0,W,h,0,0,W,h);c.restore();
    c.fillStyle='rgba(0,0,0,.25)';c.fillRect(w/2-.5,0,1,h)}
  cache.set(key,cv);return cv}
function thumb(stone,w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(render(stone,FINISH[0],w,h,false),0,0);cv.setAttribute('aria-hidden','true');return cv}

/* ---------- studio ---------- */
const st={stone:STONES[0],finish:FINISH[0],book:false,grid:false,room:'slab'};
const slabCv=$('#slabCv'),sctx=slabCv.getContext('2d');
const SW=720,SH=405;slabCv.width=SW;slabCv.height=SH;
let dataURL='';
function drawSlab(){
  const src=render(st.stone,st.finish,SW,SH,st.book);sctx.drawImage(src,0,0);
  if(st.grid){sctx.strokeStyle='rgba(20,20,20,.55)';sctx.lineWidth=1.2;const step=SW*60/300;
    for(let x=step;x<SW;x+=step){sctx.beginPath();sctx.moveTo(x,0);sctx.lineTo(x,SH);sctx.stroke()}
    for(let y=step;y<SH;y+=step){sctx.beginPath();sctx.moveTo(0,y);sctx.lineTo(SW,y);sctx.stroke()}}
  const s=$('#slab');s.style.setProperty('--g',st.finish.g);s.style.setProperty('--g2',st.finish.g2);
  $('#slabCode').textContent=st.stone.code+(st.book?'·BM':'');
  slabCv.setAttribute('aria-label',`اسلب ${st.stone.name} با پرداخت ${st.finish.name}${st.book?'، بوک‌مچ':''}`);
  dataURL=src.toDataURL("image/jpeg",.82);paintRooms();spec();if($("#qStone").options.length)draft()}
function spec(){const s=st.stone,m=(s.mohs[0]+s.mohs[1])/2;
  $('#spec').innerHTML=`<dt>نام</dt><dd>${s.name}</dd><dt>خانواده</dt><dd>${s.fam}</dd><dt>منطقه‌ی شناخته‌شده</dt><dd>${s.reg}</dd>
  <dt>سختی موس (تقریبی)</dt><dd><span class="bar" style="width:${m*12}px"></span>${fa(s.mohs[0])}${s.mohs[1]!==s.mohs[0]?' تا '+fa(s.mohs[1]):''}</dd>
  <dt>ابعاد نمایش</dt><dd>اسلب حدود ${fa(300)}×${fa(170)} سانتی‌متر</dd><dt>پرداخت</dt><dd>${st.finish.name}</dd>`}
function paintRooms(){const u=`url(${dataURL})`;$('#interior .wall').style.backgroundImage=u;$('#interior .floor').style.backgroundImage=u;$('#interior .island i').style.backgroundImage=u;
  const f=$('#facade');if(!f.hidden)facade()}
function facade(){const f=$('#facade');
  let win='';for(let r=0;r<4;r++)for(let c=0;c<5;c++)win+=`<rect x="${150+c*62}" y="${70+r*62}" width="34" height="44" fill="#26313a"/><rect x="${150+c*62}" y="${70+r*62}" width="34" height="6" fill="#4a5a66"/>`;
  f.innerHTML=`<defs><pattern id="sp" patternUnits="userSpaceOnUse" width="180" height="101"><image href="${dataURL}" width="180" height="101" preserveAspectRatio="none"/></pattern>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc0cf"/><stop offset="1" stop-color="#dfe6e3"/></linearGradient></defs>
  <rect width="600" height="380" fill="url(#sky)"/><rect x="0" y="330" width="600" height="50" fill="#7c776d"/>
  <rect x="120" y="40" width="360" height="290" fill="url(#sp)"/><rect x="120" y="40" width="360" height="290" fill="none" stroke="rgba(0,0,0,.25)"/>
  ${win}<rect x="270" y="270" width="60" height="60" fill="#1c2329"/><rect x="110" y="32" width="380" height="10" fill="#3a3631"/>
  <g fill="#3f5f50"><circle cx="70" cy="300" r="34"/><circle cx="535" cy="298" r="38"/></g><g fill="#3a3631"><rect x="67" y="300" width="6" height="32"/><rect x="532" y="300" width="6" height="32"/></g>`}
function buildStudio(){
  const box=$('#stones');STONES.forEach(s=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',s===st.stone);
    b.append(thumb(s,120,80));b.append(s.name);b.onclick=()=>select(s);box.append(b);s.btn=b});
  const fin=$('#finishes');FINISH.forEach(f=>{const b=document.createElement('button');b.type='button';b.textContent=f.name;b.setAttribute('aria-pressed',f===st.finish);
    b.onclick=()=>{st.finish=f;$$('button',fin).forEach(x=>x.setAttribute('aria-pressed',x===b));drawSlab();syncInq()};fin.append(b);f.btn=b});
  $('#book').onchange=e=>{st.book=e.target.checked;drawSlab()};$('#grid').onchange=e=>{st.grid=e.target.checked;drawSlab()};
  $$('.rooms button').forEach(b=>b.onclick=()=>{st.room=b.dataset.room;$$('.rooms button').forEach(x=>x.setAttribute('aria-selected',x===b));
    const r=$('#room');r.hidden=st.room==='slab';$('#interior').hidden=st.room!=='interior';$('#facade').hidden=st.room!=='facade';if(st.room==='facade')facade();
    if(st.room!=='slab')r.scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'})});
  const slab=$('#slab');
  const mv=e=>{const r=slab.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;slab.style.setProperty('--x',x*100+'%');slab.style.setProperty('--y',y*100+'%');slab.style.setProperty('--sx',(x*120-30)+'%')};
  slab.addEventListener('pointermove',mv);
  if(!reduce){let t0=performance.now();const idle=t=>{if(!slab.matches(':hover')){const k=((t-t0)/4200)%1;slab.style.setProperty('--sx',(k*140-30)+'%')}requestAnimationFrame(idle)};requestAnimationFrame(idle)}
  drawSlab()}
function select(s,scroll){st.stone=s;STONES.forEach(x=>x.btn.setAttribute('aria-pressed',x===s));drawSlab();syncInq();
  if(scroll){$('#studio').scrollIntoView({behavior:reduce?'auto':'smooth'});toast(`${s.name} در استودیو باز شد`)}}

/* ---------- finder ---------- */
const USES=[{id:'facade',n:'نمای بیرونی'},{id:'floor',n:'کف پرتردد'},{id:'counter',n:'کانتر آشپزخانه'},{id:'wall',n:'دیوار و لابی'},{id:'bath',n:'سرویس و حمام'}];
const TONES=[{id:'light',n:'روشن و آرام'},{id:'dark',n:'تیره و لوکس'},{id:'warm',n:'گرم و طبیعی'}];
const FIT={tr:{facade:[3,'رایج‌ترین سنگ نمای ایران؛ با پرداخت مات یا تیشه‌ای.'],floor:[2,'با رزین و پرداخت مات؛ حفره‌ها باید پر شوند.'],counter:[1,'به اسید (لیمو، سرکه) حساس است.'],wall:[3,'بافت گرم و یکنواخت برای دیوار بزرگ.'],bath:[2,'مات و آب‌بندی‌شده مناسب است.']},
 rt:{facade:[3,'رنگ گرم و خاص برای نمای متمایز.'],floor:[2,'برای فضاهای کم‌تردد بهتر است.'],counter:[1,'به اسید حساس است.'],wall:[3,'دیوار شاخص (اکسنت) در لابی.'],bath:[2,'با آب‌بندی مناسب.']},
 bk:{facade:[1,'در آفتاب تند و یخبندان کدر می‌شود.'],floor:[2,'صیقلی لغزنده است؛ مات پیشنهاد می‌شود.'],counter:[1,'لکه‌ی اسید روی سطح تیره دیده می‌شود.'],wall:[3,'رگه‌ی طلایی با بوک‌مچ، دیوار شاخص می‌سازد.'],bath:[3,'سرویس لوکس و تیره.']},
 wm:{facade:[1,'برای نمای داخلی حیاط بهتر است.'],floor:[2,'زیباست ولی خط و لک را زودتر نشان می‌دهد.'],counter:[1,'به اسید و لکه حساس است.'],wall:[3,'فضای روشن و بزرگ‌نما.'],bath:[3,'کلاسیک‌ترین انتخاب برای حمام.']},
 ox:{facade:[0,'نرم و نیمه‌شفاف است؛ برای بیرون مناسب نیست.'],floor:[0,'نرم است و خط می‌افتد.'],counter:[0,'بسیار حساس به ضربه و اسید.'],wall:[3,'با نور پشت، دیوار درخشان می‌سازد.'],bath:[1,'فقط دیواره‌ی دور از آب.']},
 gr:{facade:[3,'مقاوم در برابر یخبندان و آفتاب.'],floor:[3,'سخت‌ترین گزینه برای تردد زیاد.'],counter:[3,'مقاوم در برابر حرارت و خط.'],wall:[2,'بافت دانه‌ای؛ کمتر رگه‌دار.'],bath:[2,'مقاوم و کم‌جذب.']}};
const FL=['توصیه نمی‌شود','با احتیاط','با شرایط','مناسب'],FC=['no','mid','mid',''];
const fs={use:'floor',tone:'warm'};
function chips(el,list,key){list.forEach(o=>{const b=document.createElement('button');b.type='button';b.textContent=o.n;b.setAttribute('aria-pressed',fs[key]===o.id);
  b.onclick=()=>{fs[key]=o.id;$$('button',el).forEach(x=>x.setAttribute('aria-pressed',x===b));finder()};el.append(b)})}
function finder(){const r=STONES.map(s=>{const[f,why]=FIT[s.id][fs.use];return{s,f,why,sc:f*2+(s.tone.includes(fs.tone)?1.5:0)}}).sort((a,b)=>b.sc-a.sc).slice(0,3);
  const ol=$('#fRes');ol.innerHTML='';r.forEach(o=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';
   b.append(thumb(o.s,88,88));const d=document.createElement('div');d.innerHTML=`<span class="fit ${FC[o.f]}">${FL[o.f]}</span><b>${o.s.name}</b><small>${o.why}</small>`;b.append(d);
   b.setAttribute('aria-label',`${o.s.name}، ${FL[o.f]}: ${o.why} باز کردن در استودیو`);b.onclick=()=>select(o.s,true);li.append(b);ol.append(li)})}

/* ---------- map ---------- */
const IRAN=[[39.7,44.8],[39.0,46.2],[39.1,47.4],[38.9,48.0],[38.4,48.9],[37.6,49.1],[37.4,49.6],[36.9,50.6],[36.7,52.0],[36.9,53.9],[37.3,54.1],[37.4,55.4],[37.9,56.9],[37.6,57.6],[37.3,59.2],[36.6,61.1],[35.6,61.2],[34.4,60.6],[33.6,60.9],[31.5,61.8],[31.0,61.5],[29.8,60.9],[28.6,61.8],[27.2,63.3],[25.4,61.6],[25.6,59.0],[25.7,57.8],[27.0,56.9],[27.2,56.3],[26.7,55.3],[27.0,54.0],[27.8,52.0],[28.9,50.8],[29.9,50.1],[30.0,49.0],[30.0,48.5],[30.5,48.0],[31.0,47.7],[32.4,47.4],[33.6,45.9],[34.5,45.5],[35.1,46.1],[35.9,45.4],[36.6,45.0],[37.4,44.6],[38.3,44.3],[39.4,44.4]];
const K=28.4,P=(lat,lon)=>[20+(lon-44)*K,22+(39.9-lat)*K];
const SITES=[{n:'محلات',pos:'t',lat:33.91,lon:50.45,s:'tr',t:'تراورتن کرم و گردویی',d:'قطب شناخته‌شده‌ی تراورتن ایران؛ دره‌بخاری و نیم‌ور.'},
 {n:'آذرشهر',pos:'r',lat:37.76,lon:45.98,s:'rt',t:'تراورتن قرمز و زرد',d:'تراورتن‌های رنگی آذربایجان شرقی.'},
 {n:'ازنا',pos:'l',lat:33.45,lon:49.45,s:'wm',t:'سنگ سفید و مرمریت',d:'سنگ‌های روشن برای کف و نمای مدرن.'},
 {n:'قروه',pos:'l',lat:35.17,lon:47.8,s:'wm',t:'چینی کریستال',d:'سنگ سفید کریستالی کردستان.'},
 {n:'نجف‌آباد',pos:'b',lat:32.63,lon:51.36,s:'bk',t:'مرمریت مشکی',d:'مرمریت‌های تیره‌ی استان اصفهان.'},
 {n:'نطنز',pos:'r',lat:33.51,lon:51.92,s:'gr',t:'گرانیت طوسی',d:'گرانیت دانه‌ریز برای کف پرتردد و پله.'},
 {n:'یزد',pos:'r',lat:31.9,lon:54.36,s:'ox',t:'اونیکس و مرمر',d:'اونیکس‌های عسلی و سبز برای دکوراسیون.'},
 {n:'مشهد',pos:'l',lat:36.3,lon:59.6,s:'gr',t:'گرانیت',d:'گرانیت‌های خراسان برای نما و کف.'}];
function inPoly(x,y,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
function buildMap(){const svg=$('#iran'),poly=IRAN.map(([a,o])=>P(a,o)),ns='http://www.w3.org/2000/svg';let dots='';
  for(let y=6;y<520;y+=10)for(let x=6;x<600;x+=10)if(inPoly(x,y,poly))dots+=`<circle class="dot" cx="${x}" cy="${y}" r="2.2"/>`;
  svg.innerHTML=`<g aria-hidden="true">${dots}</g>`;
  SITES.forEach((s,i)=>{const[x,y]=P(s.lat,s.lon);const g=document.createElementNS(ns,'g');g.setAttribute('class','site');g.setAttribute('tabindex','0');g.setAttribute('role','button');
   g.setAttribute('aria-pressed','false');g.setAttribute('aria-label',`${s.n}: ${s.t}`);
   const L={r:[x+11,y+5,'end'],l:[x-11,y+5,'start'],t:[x,y-12,'middle'],b:[x,y+22,'middle']}[s.pos];g.innerHTML=`<circle class="h" cx="${x}" cy="${y}" r="6"/><circle class="c" cx="${x}" cy="${y}" r="6"/><text x="${L[0]}" y="${L[1]}" text-anchor="${L[2]}">${s.n}</text>`;
   const act=()=>site(i);g.addEventListener('click',act);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}});svg.append(g);s.g=g});site(0)}
function site(i){const s=SITES[i],stone=STONES.find(x=>x.id===s.s);SITES.forEach((x,j)=>x.g.setAttribute('aria-pressed',i===j));
  const c=$('#siteCard');c.innerHTML=`<small>منطقه‌ی ${fa(i+1)} از ${fa(SITES.length)}</small><h3>${s.n}</h3><p><b>${s.t}</b> — ${s.d}</p>`;
  const sw=document.createElement('canvas');sw.width=480;sw.height=90;sw.className='sw8';sw.setAttribute('aria-hidden','true');sw.getContext('2d').drawImage(render(stone,FINISH[0],480,90,false),0,0);c.append(sw);
  const b=document.createElement('button');b.className='btn';b.type='button';b.textContent=`دیدن ${stone.name} در استودیو`;b.onclick=()=>select(stone,true);c.append(b);
  const n=document.createElement('small');n.textContent='موقعیت‌ها تقریبی‌اند و برای نمایش آمده‌اند.';c.append(n)}

/* ---------- hero strata ---------- */
function buildStrata(){const svg=$('#strata');const C=['#5b4a38','#7a6249','#a38a66','#cdbd9f','#8c7a63','#4d463d','#a0522d','#3a342e','#6e6457','#2a2622','#1d1b19'];
  const n=C.length,base=[];for(let i=0;i<=n;i++)base.push(70+i*(780/n));
  const edge=(i)=>{let d='';for(let x=-200;x<=1400;x+=40){const y=base[i]+Math.sin(x/170+i*1.7)*14+Math.sin(x/61+i)*5;d+=(x===-200?'M':'L')+x+' '+y.toFixed(1)}return d};
  let h='';for(let i=0;i<n;i++){const top=edge(i),bot=edge(i+1).replace(/^M/,'L').split('L').filter(Boolean).reverse().map(s=>'L'+s).join('');
   h+=`<path class="ly" data-i="${i}" fill="${C[i]}" d="${top}${bot}Z"/>`}
  h+=`<path d="M-200 600 C 200 560, 500 650, 800 590 S 1300 620, 1400 600" stroke="#e39058" stroke-width="3" fill="none" opacity=".75"/>`;
  svg.innerHTML=h;const ly=$$('.ly',svg),hero=$('.hero'),core=$('#coreFill'),dep=$('#depth');
  if(reduce){core.style.height='100%';dep.textContent=fa(48);return}
  let tick=false;const upd=()=>{tick=false;const r=hero.getBoundingClientRect(),p=clamp(-r.top/Math.max(1,r.height-innerHeight));
   ly.forEach((l,i)=>{const dir=i%2?1:-1;l.style.transform=`translate(${dir*p*(60+i*26)}px,${p*(i-5)*6}px)`});core.style.height=p*100+'%';dep.textContent=fa(Math.round(p*48))};
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd()}

/* ---------- inquiry ---------- */
function buildInq(){const qs=$('#qStone'),qf=$('#qFinish');STONES.forEach(s=>qs.add(new Option(`${s.name} (${s.code})`,s.id)));FINISH.forEach(f=>qf.add(new Option(f.name,f.id)));
  $('#tNo').textContent='REQ-'+(1000+Math.floor(Math.random()*8999));
  qs.onchange=()=>select(STONES.find(s=>s.id===qs.value));qf.onchange=()=>{const f=FINISH.find(x=>x.id===qf.value);f.btn.click()};
  $$('#inq input,#inq select').forEach(e=>e.addEventListener('input',draft));
  $('#copy').onclick=async()=>{const t=$('#draft').textContent;try{await navigator.clipboard.writeText(t);toast('متن استعلام کپی شد')}catch{const r=document.createRange();r.selectNodeContents($('#draft'));getSelection().removeAllRanges();getSelection().addRange(r);toast('متن انتخاب شد؛ کپی کن')}};
  syncInq()}
function syncInq(){const qs=$('#qStone');if(!qs)return;qs.value=st.stone.id;$('#qFinish').value=st.finish.id;draft()}
function draft(){const s=STONES.find(x=>x.id===$('#qStone').value)||st.stone,f=FINISH.find(x=>x.id===$('#qFinish').value)||st.finish;
  const a=parseInt(($('#qArea').value||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\D/g,''))||0;
  $('#draft').textContent=`سلام، برای این پروژه استعلام قیمت دارم:

• سنگ: ${s.name} — کد ${s.code}
• پرداخت: ${f.name}
• فرم: ${$('#qForm').value} · ضخامت: ${$('#qThick').value}
• متراژ خالص: ${nf(a)} مترمربع (با ۱۰٪ دورریز: ${nf(a*1.1)})
• محل پروژه: ${$('#qCity').value||'—'}

لطفاً قیمت، موجودی از یک بچ رنگی و زمان تحویل را اعلام کنید.${st.book?'\n• اسلب‌ها به‌صورت بوک‌مچ شماره‌گذاری شوند.':''}`}

buildStrata();buildStudio();chips($('#fUse'),USES,'use');chips($('#fTone'),TONES,'tone');finder();buildMap();buildInq();
})();
