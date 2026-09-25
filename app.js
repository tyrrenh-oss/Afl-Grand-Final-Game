const PLAYERS=["Jordan Clark", "Alex Pearce", "Judd McVee", "Karl Worner", "Oscar McDonald", "Hayden Chapman", "Matthew Johnson", "Andrew Brayshaw", "Neil Erasmus", "Michael Frederick", "Matthew Reid", "Sam Switkowski", "Josh Amiss", "Jye Treacy", "Patrick Voss", "Luke Jackson", "Caleb Serong", "Shai Bolton", "Isaac Dudley", "Mason Cox", "Heath Young", "Cooper Wagner", "Luke Ryan", "Tom Gallop", "Harris Andrews", "Ryan Lester", "Darcy Wilmot", "Daniel Gardiner", "Dayne Zorko", "Jaspa Berry", "Will Ashcroft", "Zac Bailey", "Charlie Cameron", "Logan Morris", "Oscar Allen", "Eric Hipwood", "Cam Rayner", "Kai Lohmann", "Darcy Fort", "Josh Dunkley", "Lachie Neale", "Sam Draper", "Jarryd Fletcher", "Hugh McCluggage", "Lachie Ashcroft", "Conor McKenna"];
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
 page:0
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
function pick(cat,i,v){if(v && S.picks[cat].some((x,j)=>j!==i&&x===v)){alert("That player has already been selected in this category.");return render()}S.picks[cat][i]=v;save();render()}
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
function nav(){const items=["Home","Norm Smith","Most Goals","Winning Team","Q1","Q2","Q3","Q4","Outcomes","Leaderboard"];return `<nav>${items.map((x,i)=>`<button class="${S.page===i?"active":""}" onclick="go(${i})">${x}</button>`).join("")}</nav>`}
function shell(content,kicker="FROFFIES AT DONDADS"){return `<main>${S.page===0?content:`<header><div><small>${kicker}</small><h1>${["Home","Norm Smith","Most Goals","Winning Team","Quarter 1","Quarter 2","Quarter 3","Quarter 4","Outcomes","Final Leaderboard"][S.page]}</h1></div><button class="homebtn" onclick="go(0)">⌂</button></header>${nav()}${content}${S.page>0?leaderboard():""}`}</main>`}
function home(){return `<section class="hero"><div class="hero-shade"></div><div class="hero-copy"><div class="aflmark">AFL</div><div class="eyebrow">2026 GRAND FINAL GAME</div><h1>FROFFIES<br><span>AT DONDADS</span></h1><p>Six players. One Grand Final. Every pick matters.</p><button class="start" onclick="go(1)">START GAME →</button></div></section>
<div class="card setup"><h2>Enter your six players</h2><p>Do this before starting the draft.</p><div class="names">${S.names.map((n,i)=>`<input placeholder="Player ${i+1}" value="${esc(n)}" oninput="S.names[${i}]=this.value;save()">`).join("")}</div></div>`}
function draftPage(title,key,scoreText,desc){const order=S.orders[key];return `<section class="card"><div class="section-intro"><div><span class="pill">${scoreText}</span><h2>${desc}</h2></div><button class="reroll" onclick="randomise('${key}')">🎲 Randomise order</button></div><div class="draft-list">${order.map((i,pos)=>`<div class="draft-row"><b class="draftnum">${pos+1}</b><strong>${esc(names()[i])}</strong>${select("",S.picks[key][i],`pick('${key}',${i},this.value)`,key==="winner"?TEAMS:key==="margin"?margins:PLAYERS,key==="norm"?S.picks.norm:key==="goals"?S.picks.goals:[])}</div>`).join("")}</div></section>`}
function quarter(q){const o=S.orders.q[q],d=S.picks.q[q];return `<section class="card"><div class="section-intro"><div><span class="pill">1 POINT EACH</span><h2>Three picks for Quarter ${q+1}</h2></div><button class="reroll" onclick="randomiseQ(${q})">🎲 Randomise order</button></div><p class="muted">Draft in the order shown. Each category has its own unique player selections.</p><div class="qtable"><div class="qhead"><span>Draft</span><span>First goal</span><span>Last goal</span><span>Most disposals</span></div>${o.map((i,pos)=>`<div class="qrow"><div class="who"><b>${pos+1}</b>${esc(names()[i])}</div>${select("",d.first[i],`qpick(${q},'first',${i},this.value)`,PLAYERS,d.first)}${select("",d.last[i],`qpick(${q},'last',${i},this.value)`,PLAYERS,d.last)}${select("",d.disposals[i],`qpick(${q},'disposals',${i},this.value)`,PLAYERS,d.disposals)}</div>`).join("")}</div></section>`}
function outcomes(){return `<section class="card"><h2>Enter the actual outcomes</h2><p class="muted">Enter results after the game. The leaderboard will calculate points automatically.</p><div class="out-grid">
<div class="outbox"><h3>Grand Final</h3>${select("Winner",S.actual.winner,`actual(['winner'],this.value)`,TEAMS)}${select("Margin",S.actual.margin,`actual(['margin'],this.value)`,margins)}${select("Norm Smith",S.actual.norm,`actual(['norm'],this.value)`,PLAYERS)}${select("Most goals",S.actual.goals,`actual(['goals'],this.value)`,PLAYERS)}</div>
${S.actual.q.map((x,q)=>`<div class="outbox"><h3>Quarter ${q+1}</h3>${select("First goal",x.first,`actual(['q',${q},'first'],this.value)`,PLAYERS)}${select("Last goal",x.last,`actual(['q',${q},'last'],this.value)`,PLAYERS)}${select("Most disposals",x.disposals,`actual(['q',${q},'disposals'],this.value)`,PLAYERS)}</div>`).join("")}
</div></section>
<section class="card outcomes"><h2>Everyone's selections</h2>${selectionTable()}</section>`}
function selectionTable(){return names().map((n,i)=>`<details><summary>${esc(n)}</summary><div class="selgrid"><div><b>Norm Smith</b><span>${esc(S.picks.norm[i])||"—"}</span></div><div><b>Most goals</b><span>${esc(S.picks.goals[i])||"—"}</span></div><div><b>Winner</b><span>${esc(S.picks.winner[i])||"—"} / ${esc(S.picks.margin[i])||"—"}</span></div>${S.picks.q.map((q,j)=>`<div><b>Q${j+1}</b><span>First: ${esc(q.first[i])||"—"}<br>Last: ${esc(q.last[i])||"—"}<br>Disposals: ${esc(q.disposals[i])||"—"}</span></div>`).join("")}</div></details>`).join("")}
function final(){const r=scores();return `<section class="card final-card"><span class="pill">FINAL RESULTS</span><h2>Froffies at Dondads</h2><div class="final-list">${r.map((x,i)=>`<div class="final-row ${i<3?"podium":""}"><div class="place">${i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div><div><h3>${esc(x.name)}</h3><p>${x.details.length?x.details.join(" · "):"No points yet"}</p></div><strong>${x.pts}</strong></div>`).join("")}</div></section><section class="card"><button class="start dark" onclick="window.print()">PRINT / SAVE PDF</button><button class="reroll" onclick="resetGame()">RESET GAME</button></section>`}
function go(p){S.page=p;ensureOrders();save();render();scrollTo(0,0)}
function resetGame(){if(confirm("Reset the whole game?")){S=blank();save();render()}}
function render(){ensureOrders();let c=S.page===0?home():S.page===1?draftPage("Norm Smith","norm","3 POINTS","Pick the Norm Smith Medal winner"):S.page===2?draftPage("Most Goals","goals","2 POINTS","Pick the player who will kick the most goals"):S.page===3?draftPage("Winning Team","winner","2 POINTS + 1","Pick the winning team, then your margin bracket"):S.page===4?quarter(0):S.page===5?quarter(1):S.page===6?quarter(2):S.page===7?quarter(3):S.page===8?outcomes():final();document.getElementById("app").innerHTML=shell(c);}
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();