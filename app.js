const PLAYERS=["Jordan Clark", "Alex Pearce", "Oscar McDonald", "Karl Worner", "Judd McVee", "Heath Chapman", "Matthew Johnson", "Andrew Brayshaw", "Neil Erasmus", "Michael Frederick", "Murphy Reid", "Sam Switkowski", "Jye Amiss", "Josh Treacy", "Patrick Voss", "Luke Jackson", "Caleb Serong", "Shai Bolton", "Isaiah Dudley", "Mason Cox", "Hayden Young", "Corey Wagner", "Luke Ryan", "Ty Gallop", "Harris Andrews", "Ryan Lester", "Jaspa Fletcher", "Darcy Gardiner", "Dayne Zorko", "Jarrod Berry", "Hugh McCluggage", "Zac Bailey", "Charlie Cameron", "Logan Morris", "Conor McKenna", "Eric Hipwood", "Cameron Rayner", "Kai Lohmann", "Sam Draper", "Josh Dunkley", "Lachie Neale", "Oscar Allen", "Will Ashcroft", "Levi Ashcroft", "Darcy Fort", "Darcy Wilmot"];
const TEAMS=["Brisbane","Fremantle"];
const KEY="froffies-dondads-v1";
const blank=()=>({
 names:["","","","","",""],
 picks:{
  norm:Array(6).fill(""), goals:Array(6).fill(""), winner:Array(6).fill(""), margin:Array(6).fill(""),
  q:[1,2,3,4].map(()=>({first:Array(6).fill(""),last:Array(6).fill(""),disposals:Array(6).fill("")}))
 },
 orders:{
  norm:[],goals:[],winner:[],q:[[],[],[],[]]
 },
 actual:{
  norm:"",goals:"",winner:"",margin:"",
  q:[1,2,3,4].map(()=>({first:"",last:"",disposals:""}))
 },
 page:0,
 ui:{qStep:[0,0,0,0]}
});
let S=JSON.parse(localStorage.getItem(KEY)||"null")||blank();
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const names=()=>S.names.map((x,i)=>x.trim()||`Player ${i+1}`);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const margins=["1-9","10-19","20-29","30-39","40-49","50+"];
function randomise(key){S.orders[key]=shuffle([...Array(6).keys()]);save();render()}
function randomiseQ(q){S.orders.q[q]=shuffle([...Array(6).keys()]);save();render()}
function ensureOrders(){if(!S.orders.norm.length)S.orders.norm=shuffle([...Array(6).keys()]);if(!S.orders.goals.length)S.orders.goals=shuffle([...Array(6).keys()]);if(!S.orders.winner.length)S.orders.winner=shuffle([...Array(6).keys()]);S.orders.q.forEach((o,i)=>{if(!o.length)S.orders.q[i]=shuffle([...Array(6).keys()])});save()}
function opts(list,current,used=[]){return list.filter(x=>!used.includes(x)||x===current)}
function select(label,value,onchange,list,used=[]) {
 const v=String(value??"");
 return `<label class="field">${label?`<span>${label}</span>`:""}<select onchange="${onchange}">
 <option value="">Select…</option>${opts(list,v,used).map(x=>`<option value="${esc(x)}" ${x===v?"selected":""}>${esc(x)}</option>`).join("")}
 </select></label>`;
}
function pick(cat,i,v){
 if((cat==="norm"||cat==="goals")&&v&&S.picks[cat].some((x,j)=>j!==i&&x===v)){
   alert("That player has already been selected in this category.");
   return render();
 }
 S.picks[cat][i]=v;save();render();
}
function qpick(q,cat,i,v){const a=S.picks.q[q][cat];if(v&&a.some((x,j)=>j!==i&&x===v)){alert("That player has already been selected in this category for this quarter.");return render()}a[i]=v;save();render()}
function actual(path,v){let o=S.actual;for(let i=0;i<path.length-1;i++)o=o[path[i]];o[path[path.length-1]]=v;save();render()}
function scores() {
 const p=Array(6).fill(0), details=Array(6).fill(null).map(()=>[]);
 const add=(i,n,t)=>{p[i]+=n;details[i].push(`${t} +${n}`)};
 S.picks.norm.forEach((v,i)=>v&&v===S.actual.norm&&add(i,3,"Norm Smith"));
 S.picks.goals.forEach((v,i)=>v&&v===S.actual.goals&&add(i,2,"Most goals"));
 S.picks.winner.forEach((v,i)=>v&&v===S.actual.winner&&add(i,2,"Winner"));
 S.picks.margin.forEach((v,i)=>v&&v===S.actual.margin&&add(i,1,"Margin"));
 S.picks.q.forEach((q,qi)=>{q.first.forEach((v,i)=>v&&v===S.actual.q[qi].first&&add(i,1,`Q${qi+1} first goal`));q.last.forEach((v,i)=>v&&v===S.actual.q[qi].last&&add(i,1,`Q${qi+1} last goal`));q.disposals.forEach((v,i)=>v&&v===S.actual.q[qi].disposals&&add(i,1,`Q${qi+1} most disposals`))});
 return names().map((n,i)=>({name:n,pts:p[i],details:details[i],i})).sort((a,b)=>b.pts-a.pts||a.i-b.i);
}
function leaderboard(){return `<aside class="running"><div class="running-head"><b>LIVE LEADERBOARD</b><span>Updates automatically</span></div>${scores().map((r,i)=>`<div class="run-row"><em>${i+1}</em><span>${esc(r.name)}</span><strong>${r.pts}</strong></div>`).join("")}</aside>`}
function nav(){
 const items=["Home","Norm Smith","Most Goals","Winning Team","Q1","Q2","Q3","Q4","Outcomes","Leaderboard"];
 return `<nav class="game-nav">${items.map((x,i)=>`<button class="${S.page===i?"active":""}" onclick="go(${i})"><span>${i===0?"⌂":i===1?"🏅":i===2?"⚽":i===3?"🏆":i>=4&&i<=7?"Q"+(i-3):i===8?"✓":"🏆"}</span>${x}</button>`).join("")}</nav>`;
}
function shell(content,kicker="FROFFIES AT DONDADS"){
 return `<main>
 ${S.page===0?content:`<header class="topbar"><div><div class="brand-mini">FROFFIES <span>AT DONDADS</span></div><small>${kicker}</small><h1>${["Home","Norm Smith","Most Goals","Winning Team","Quarter 1","Quarter 2","Quarter 3","Quarter 4","Outcomes","Final Leaderboard"][S.page]}</h1></div><button class="homebtn" onclick="go(0)">⌂</button></header>${nav()}${content}${S.page>0?`<div class="sticky-score" onclick="document.querySelector('.running')?.scrollIntoView({behavior:'smooth'})">🏆 ${esc(scores()[0].name)} <b>${scores()[0].pts}</b> · ${esc(scores()[1].name)} <b>${scores()[1].pts}</b> · ${esc(scores()[2].name)} <b>${scores()[2].pts}</b></div>${leaderboard()}`:""}`}
 </main>`;
}

function home(){
 return `<section class="hero">
   <div class="hero-art"></div><div class="hero-overlay"></div>
   <div class="hero-copy">
    <div class="aflmark">AFL</div>
    <div class="eyebrow">2026 GRAND FINAL • GAME DAY</div>
    <h1>FROFFIES<br><span>AT DONDADS</span></h1>
    <p class="hero-tag">Six mates. One Grand Final. Every pick counts.</p>
    <button class="start" onclick="go(1)">START GAME <span>→</span></button>
   </div>
 </section>
 <section class="setup card">
   <div class="setup-title"><div><span class="pill">GAME SETUP</span><h2>Who's playing?</h2><p>Enter the six names before the draft begins.</p></div><div class="players-badge">6 PLAYERS</div></div>
   <div class="names">${S.names.map((n,i)=>`<label class="name-field"><b>${i+1}</b><input placeholder="Player ${i+1}" value="${esc(n)}" oninput="S.names[${i}]=this.value;save()"></label>`).join("")}</div>
 </section>
 <section class="how card"><span class="pill">HOW IT WORKS</span><div class="how-grid"><div><b>01</b><span>Draft</span><small>Random order each stage</small></div><div><b>02</b><span>Pick</span><small>Lock in your predictions</small></div><div><b>03</b><span>Score</span><small>Track it live all game</small></div></div></section>`;
}

function draftPage(title,key,scoreText,desc){
 const order=S.orders[key];
 if(!S.ui.catStep)S.ui.catStep={norm:0,goals:0,winner:0};
 const step=Math.max(0,Math.min(5,S.ui.catStep[key]||0)), i=order[step], val=S.picks[key][i];
 const completed=order.filter(x=>S.picks[key][x]).length;
 const progress=order.map((idx,n)=>`<button class="${n===step?'qp-on ':''}${S.picks[key][idx]?'qp-done':''}" onclick="catstep('${key}',${n})"><b>${n+1}</b><span>${esc(names()[idx])}</span></button>`).join("");
 let picker=key==="winner"?select("WINNING TEAM",val,`pick('${key}',${i},this.value)`,TEAMS):key==="margin"?select("MARGIN BRACKET",val,`pick('${key}',${i},this.value)`,margins):playerPicker(key==="norm"?"NORM SMITH MEDALIST":"MOST GOALS",val,`pick('${key}',${i},this.value)`,S.picks[key]);
 let extra=key==="winner"?select("MARGIN BRACKET",S.picks.margin[i],`pick('margin',${i},this.value)`,margins):"";
 return `<section class="stage">
  <div class="stage-head"><div><span class="pill">${scoreText}</span><h2>${esc(desc)}</h2><p>${completed} of 6 players locked in</p></div><button class="reroll" onclick="randomise('${key}')">🎲 New Order</button></div>
  <div class="q-progress">${progress}</div>
  <div class="now-picking"><span>NOW PICKING</span><strong>${esc(names()[i])}</strong><em>${step+1} / 6</em></div>
  <div class="draft-card premium-card">
    <div class="pick-status">${val?'✓ PICK SAVED':'MAKE YOUR SELECTION'}</div>
    ${picker}${extra}
    <button class="lock-btn" onclick="catstep('${key}',${Math.min(5,step+1)})">${val?(step===5?'✓ ALL PICKS COMPLETE':'LOCK IN & NEXT →'):'SELECT A PICK ABOVE'}</button>
    <div class="q-nav"><button class="q-prev" ${step===0?'disabled':''} onclick="catstep('${key}',${step-1})">← Previous</button><button class="q-next" ${step===5?'disabled':''} onclick="catstep('${key}',${step+1})">Skip to Next →</button></div>
  </div>
 </section>`;
}
function quarter(q){
 const order=S.orders.q[q], d=S.picks.q[q];
 if(!S.ui)S.ui={qStep:[0,0,0,0]};
 const step=Math.max(0,Math.min(5,S.ui.qStep[q]||0));
 const i=order[step];
 const usedFirst=d.first, usedLast=d.last, usedDisp=d.disposals;
 const done=d.first[i]&&d.last[i]&&d.disposals[i];
 const progress=order.map((idx,n)=>`<button class="${n===step?'qp-on ':''}${d.first[idx]&&d.last[idx]&&d.disposals[idx]?'qp-done':''}" onclick="qstep(${q},${n})"><b>${n+1}</b><span>${esc(names()[idx])}</span></button>`).join("");
 return `<section class="card quarter-mobile">
   <div class="section-intro">
     <div><span class="pill">QUARTER ${q+1}</span><h2>Quarter ${q+1} Draft</h2></div>
     <button class="reroll" onclick="randomiseQ(${q})">🎲 Randomise</button>
   </div>
   <div class="q-progress">${progress}</div>
   <div class="draft-card">
     <div class="draft-card-top"><span>Pick ${step+1} of 6</span><strong>${esc(names()[i])}</strong></div>
     <div class="pick-status">${done?'✓ ALL THREE PICKS SAVED':'MAKE ALL THREE SELECTIONS'}</div>
     ${select("🥅 FIRST GOAL SCORER",d.first[i],`qpick(${q},'first',${i},this.value)`,PLAYERS,usedFirst)}
     ${select("🥅 LAST GOAL SCORER",d.last[i],`qpick(${q},'last',${i},this.value)`,PLAYERS,usedLast)}
     ${select("📊 MOST DISPOSALS",d.disposals[i],`qpick(${q},'disposals',${i},this.value)`,PLAYERS,usedDisp)}
     <div class="q-nav">
       <button class="q-prev" ${step===0?'disabled':''} onclick="qstep(${q},${step-1})">← Previous</button>
       <button class="q-next" ${step===5?'disabled':''} onclick="qstep(${q},${step+1})">Next Participant →</button>
     </div>
   </div>
   <p class="mobile-hint">Your picks save automatically. Tap a participant above to jump straight to them.</p>
 </section>`;
}
function qstep(q,n){if(!S.ui)S.ui={qStep:[0,0,0,0]};S.ui.qStep[q]=Math.max(0,Math.min(5,n));save();render();}

function outcomes(){return `<section class="card"><h2>Enter the actual outcomes</h2><p class="muted">Enter results after the game. The leaderboard will calculate points automatically.</p><div class="out-grid">
<div class="outbox"><h3>Grand Final</h3>${select("Winner",S.actual.winner,`actual(['winner'],this.value)`,TEAMS)}${select("Margin",S.actual.margin,`actual(['margin'],this.value)`,margins)}${select("Norm Smith",S.actual.norm,`actual(['norm'],this.value)`,PLAYERS)}${select("Most goals",S.actual.goals,`actual(['goals'],this.value)`,PLAYERS)}</div>
${S.actual.q.map((x,q)=>`<div class="outbox"><h3>Quarter ${q+1}</h3>${select("First goal",x.first,`actual(['q',${q},'first'],this.value)`,PLAYERS)}${select("Last goal",x.last,`actual(['q',${q},'last'],this.value)`,PLAYERS)}${select("Most disposals",x.disposals,`actual(['q',${q},'disposals'],this.value)`,PLAYERS)}</div>`).join("")}
</div></section>
<section class="card outcomes"><h2>Everyone's selections</h2>${selectionTable()}</section>`}
function selectionTable(){return names().map((n,i)=>`<details><summary>${esc(n)}</summary><div class="selgrid"><div><b>Norm Smith</b><span>${esc(S.picks.norm[i])||"—"}</span></div><div><b>Most goals</b><span>${esc(S.picks.goals[i])||"—"}</span></div><div><b>Winner</b><span>${esc(S.picks.winner[i])||"—"} / ${esc(S.picks.margin[i])||"—"}</span></div>${S.picks.q.map((q,j)=>`<div><b>Q${j+1}</b><span>First: ${esc(q.first[i])||"—"}<br>Last: ${esc(q.last[i])||"—"}<br>Disposals: ${esc(q.disposals[i])||"—"}</span></div>`).join("")}</div></details>`).join("")}
function final(){
 const r=scores();
 return `<section class="final-hero"><span class="pill">FULL TIME</span><h2>🏆 FROFFIES AT DONDADS</h2><p>Grand Final leaderboard</p></section>
 <section class="podium-card">${r.slice(0,3).map((x,i)=>`<div class="podium-item p${i+1}"><div class="podium-medal">${i===0?'🥇':i===1?'🥈':'🥉'}</div><div class="podium-name">${esc(x.name)}</div><strong>${x.pts}</strong><span>POINTS</span></div>`).join("")}</section>
 <section class="card final-rest">${r.slice(3).map((x,i)=>`<div class="final-row"><div class="place">${i+4}</div><div><h3>${esc(x.name)}</h3><p>${x.details.length?x.details.join(" · "):"No points"}</p></div><strong>${x.pts}</strong></div>`).join("")}</section>
 <section class="card"><h2>Score Breakdown</h2>${r.map(x=>`<details><summary>${esc(x.name)} — ${x.pts} points</summary><p>${x.details.length?x.details.map(esc).join(" · "):"No scoring outcomes yet."}</p></details>`).join("")}</section>
 <section class="card final-actions"><button class="start dark" onclick="window.print()">PRINT / SAVE RESULTS</button><button class="reroll" onclick="resetGame()">RESET GAME</button></section>`;
}
function go(p){S.page=p;ensureOrders();save();render();scrollTo(0,0)}
function resetGame(){if(confirm("Reset the whole game?")){S=blank();save();render()}}
function render(){ensureOrders();let c=S.page===0?home():S.page===1?draftPage("Norm Smith","norm","3 POINTS","Pick the Norm Smith Medal winner"):S.page===2?draftPage("Most Goals","goals","2 POINTS","Pick the player who will kick the most goals"):S.page===3?draftPage("Winning Team","winner","2 POINTS + 1","Pick the winning team, then your margin bracket"):S.page===4?quarter(0):S.page===5?quarter(1):S.page===6?quarter(2):S.page===7?quarter(3):S.page===8?outcomes():final();document.getElementById("app").innerHTML=shell(c);}
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();