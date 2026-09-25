const PLAYERS = ["Jordan Clark", "Alex Pearce", "Judd McVee", "Karl Worner", "Oscar McDonald", "Hayden Chapman", "Matthew Johnson", "Andrew Brayshaw", "Neil Erasmus", "Michael Frederick", "Matthew Reid", "Sam Switkowski", "Josh Amiss", "Jye Treacy", "Patrick Voss", "Luke Jackson", "Caleb Serong", "Shai Bolton", "Isaac Dudley", "Mason Cox", "Heath Young", "Cooper Wagner", "Luke Ryan", "Tom Gallop", "Harris Andrews", "Ryan Lester", "Darcy Wilmot", "Daniel Gardiner", "Dayne Zorko", "Jaspa Berry", "Will Ashcroft", "Zac Bailey", "Charlie Cameron", "Logan Morris", "Oscar Allen", "Eric Hipwood", "Cam Rayner", "Kai Lohmann", "Darcy Fort", "Josh Dunkley", "Lachie Neale", "Sam Draper", "Jarryd Fletcher", "Hugh McCluggage", "Lachie Ashcroft", "Conor McKenna"];
const TEAMS = ["Fremantle","Brisbane"];
const KEY="afl-gf-2026-state-v3";
const blankState=()=>({
  names:["","","","","",""],
  draft:[],
  q:[1,2,3,4].map(()=>({first:Array(6).fill(""),last:Array(6).fill(""),disposals:Array(6).fill("")})),
  predictions:{winner:Array(6).fill(""),margin:Array(6).fill(""),norm:Array(6).fill(""),goals:Array(6).fill("")},
  actual:{quarters:[1,2,3,4].map(()=>({freo:"",bris:"",first:"",last:"",most:""})),winner:"",margin:"",norm:"",goals:""},
  page:0
});
let S=JSON.parse(localStorage.getItem(KEY)||"null")||blankState();
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const activeNames=()=>S.names.map((n,i)=>n.trim()||`Player ${i+1}`);
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function draftOrder(){S.draft=shuffle([...Array(6).keys()]);save();render();}
function scoreRows(){
  const names=activeNames(), pts=Array(6).fill(0), detail=Array(6).fill(null).map(()=>[]);
  S.q.forEach((q,qi)=>{
    q.first.forEach((v,i)=>{if(v && v===qFirstActual(qi)) {pts[i]++;detail[i].push(`Q${qi+1} first goal +1`)}});
    q.last.forEach((v,i)=>{if(v && v===qLastActual(qi)) {pts[i]++;detail[i].push(`Q${qi+1} last goal +1`)}});
    q.disposals.forEach((v,i)=>{if(v && v===qMostActual(qi)) {pts[i]++;detail[i].push(`Q${qi+1} most disposals +1`)}});
  });
  S.predictions.winner.forEach((v,i)=>{if(v&&v===S.actual.winner){pts[i]+=2;detail[i].push("GF winner +2")}});
  S.predictions.margin.forEach((v,i)=>{if(v&&v===S.actual.margin){pts[i]+=1;detail[i].push("Margin +1")}});
  S.predictions.norm.forEach((v,i)=>{if(v&&v===S.actual.norm){pts[i]+=3;detail[i].push("Norm Smith +3")}});
  S.predictions.goals.forEach((v,i)=>{if(v&&v===S.actual.goals){pts[i]+=2;detail[i].push("Most goals +2")}});
  return names.map((name,i)=>({name,pts:pts[i],detail:detail[i],idx:i})).sort((a,b)=>b.pts-a.pts||a.idx-b.idx);
}
function qFirstActual(q){return S.actual.quarters[q]?.first||""}
function qLastActual(q){return S.actual.quarters[q]?.last||""}
function qMostActual(q){return S.actual.quarters[q]?.most||""}
function select(label,val,onchange,opts,disabled=false){
  return `<label>${label}<select ${disabled?"disabled":""} onchange="${onchange}"><option value="">Select…</option>${opts.map(o=>`<option ${o===val?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`
}
function leaderboard(){
  const rows=scoreRows();
  return `<section class="leaderboard"><div class="lb-head"><h3>Running leaderboard</h3><span>Live scoring</span></div>
  ${rows.map((r,i)=>`<div class="lb-row"><b class="rank ${i<3?"r"+(i+1):""}">${i+1}</b><span>${esc(r.name)}</span><strong>${r.pts}</strong></div>`).join("")}</section>`;
}
function nav(){
 const labels=["Players","Q1","Q2","Q3","Q4","Predictions","Final"];
 return `<nav>${labels.map((x,i)=>`<button class="${S.page===i?"on":""}" onclick="go(${i})">${i<5?`<small>${i===0?"Setup":`Quarter ${i}`}</small>`:x}</button>`).join("")}</nav>`;
}
function pageHeader(title,kicker){return `<header><div><div class="kicker">${kicker}</div><h1>${title}</h1></div><button class="reset" onclick="resetGame()">Reset</button></header>`}
function render(){
 document.getElementById("app").innerHTML=`<main>${pageHeader(["Players & Draft","Quarter 1","Quarter 2","Quarter 3","Quarter 4","Grand Final Predictions","Final Scoreboard"][S.page],S.page===0?"AFL 2026 GRAND FINAL":"FREMANTLE v BRISBANE")}${nav()}${page(S.page)}${S.page!==6?leaderboard():""}</main>`;
}
function page(p){
 if(p===0)return setup();
 if(p>=1&&p<=4)return quarter(p-1);
 if(p===5)return predictions();
 return finalPage();
}
function setup(){
 return `<div class="card hero"><div class="badge">SATURDAY • 26 SEPTEMBER • 2:30PM AEST</div><h2>Six players. One Grand Final. One winner.</h2><p>Enter the six names, randomise the draft order, then draft unique AFL players for each quarter.</p></div>
 <div class="card"><h2>Players</h2><div class="namegrid">${S.names.map((n,i)=>`<label>Player ${i+1}<input value="${esc(n)}" placeholder="Name" oninput="S.names[${i}]=this.value;save();render()"></label>`).join("")}</div>
 <button class="primary" onclick="draftOrder()">🎲 Randomise draft order</button>
 ${S.draft.length?`<div class="draft"><h3>Draft order</h3><div>${S.draft.map((idx,pos)=>`<span><b>${pos+1}</b>${esc(activeNames()[idx])}</span>`).join("")}</div><p class="muted">A new random order can be generated any time before drafting.</p></div>`:""}</div>
 <div class="card rules"><h2>Scoring</h2><ul><li>First goal scorer each quarter: <b>1 point</b></li><li>Last goal scorer each quarter: <b>1 point</b></li><li>Most disposals each quarter: <b>1 point</b></li><li>Grand Final winner: <b>2 points</b></li><li>Margin bracket: <b>1 point</b></li><li>Norm Smith Medalist: <b>3 points</b></li><li>Most goals in the game: <b>2 points</b></li></ul></div>`;
}
function quarter(q){
 const d=S.q[q], names=activeNames();
 return `<div class="card"><div class="qtop"><div><div class="badge">QUARTER ${q+1}</div><h2>Draft your three categories</h2></div><button class="secondary" onclick="reroll(${q})">🎲 Randomise Q${q+1} order</button></div>
 <p class="muted">Each category is a separate six-pick draft. The same AFL player cannot be selected twice within the same category. The running leaderboard updates automatically.</p>
 <div class="picktable"><div class="pickhead"><span>Draft</span><span>First goal</span><span>Last goal</span><span>Most disposals</span></div>
 ${draftRows(q).join("")}</div></div>
 <div class="card actual"><h2>Q${q+1} actual data</h2><div class="actualgrid">
 ${select("First goal scorer",qFirstActual(q),`S.actual.quarters[${q}].first=this.value;save();render()`,PLAYERS)}
 ${select("Last goal scorer",qLastActual(q),`S.actual.quarters[${q}].last=this.value;save();render()`,PLAYERS)}
 ${select("Most disposals",qMostActual(q),`S.actual.quarters[${q}].most=this.value;save();render()`,PLAYERS)}
 <label>Fremantle score<input type="number" min="0" value="${esc(S.actual.quarters[q].freo)}" oninput="S.actual.quarters[${q}].freo=this.value;save();render()"></label>
 <label>Brisbane score<input type="number" min="0" value="${esc(S.actual.quarters[q].bris)}" oninput="S.actual.quarters[${q}].bris=this.value;save();render()"></label></div></div>`;
}
function draftRows(q){
 const order=S.draft.length?S.draft:[0,1,2,3,4,5];
 return order.map((idx,pos)=>{
  const taken=(arr,val)=>val&&arr.includes(val);
  return `<div class="pickrow"><span class="drafter"><b>${pos+1}</b>${esc(activeNames()[idx])}</span>
  ${select("",S.q[q].first[idx],`pick(${q},'first',${idx},this.value)`,PLAYERS.filter(x=>!taken(S.q[q].first,x)||x===S.q[q].first[idx]))}
  ${select("",S.q[q].last[idx],`pick(${q},'last',${idx},this.value)`,PLAYERS.filter(x=>!taken(S.q[q].last,x)||x===S.q[q].last[idx]))}
  ${select("",S.q[q].disposals[idx],`pick(${q},'disposals',${idx},this.value)`,PLAYERS.filter(x=>!taken(S.q[q].disposals,x)||x===S.q[q].disposals[idx]))}</div>`
 })}
function pick(q,cat,i,v){let arr=S.q[q][cat];if(v&&arr.some((x,j)=>j!==i&&x===v)){alert("That player has already been picked in this category for this quarter.");render();return}arr[i]=v;save();render()}
function reroll(q){S.draft=shuffle([...Array(6).keys()]);save();render();alert(`Draft order randomised for Quarter ${q+1}. This changes the displayed order for the quarter.`)}
function predictions(){
 const p=S.predictions;
 return `<div class="card hero"><div class="badge">PRIVATE PREDICTIONS</div><h2>Everyone makes their own Grand Final calls</h2><p>Winner and margin may be shared. Norm Smith and most-goals picks are unique across the six players.</p></div>
 <div class="predgrid">${activeNames().map((n,i)=>`<div class="predcard"><h3>${esc(n)}</h3>
 ${select("Winner",p.winner[i],`pred('winner',${i},this.value)`,TEAMS)}
 ${select("Margin bracket",p.margin[i],`pred('margin',${i},this.value)`,["1-9","10-19","20-29","30-39","40-49","50-59","60-69","70+"])}
 ${select("Norm Smith Medalist",p.norm[i],`pred('norm',${i},this.value)`,PLAYERS.filter(x=>!p.norm.some((v,j)=>j!==i&&v===x)||x===p.norm[i]))}
 ${select("Most goals",p.goals[i],`pred('goals',${i},this.value)`,PLAYERS.filter(x=>!p.goals.some((v,j)=>j!==i&&v===x)||x===p.goals[i]))}
 </div>`).join("")}</div>
 <div class="card actual"><h2>Grand Final actual data</h2><div class="actualgrid">
 ${select("Winner",S.actual.winner,`S.actual.winner=this.value;save();render()`,TEAMS)}
 ${select("Margin bracket",S.actual.margin,`S.actual.margin=this.value;save();render()`,["1-9","10-19","20-29","30-39","40-49","50-59","60-69","70+"])}
 ${select("Norm Smith Medalist",S.actual.norm,`S.actual.norm=this.value;save();render()`,PLAYERS)}
 ${select("Most goals",S.actual.goals,`S.actual.goals=this.value;save();render()`,PLAYERS)}
 </div></div>`;
}
function pred(cat,i,v){
 if((cat==="norm"||cat==="goals")&&v&&S.predictions[cat].some((x,j)=>j!==i&&x===v)){alert("That player is already selected by another participant. Choose a different player.");render();return}
 S.predictions[cat][i]=v;save();render();
}
function finalPage(){
 const rows=scoreRows();
 return `<div class="card hero finalhero"><div class="badge">FINAL LEADERBOARD</div><h2>Grand Final results</h2><p>Enter the actual Grand Final results above as the game unfolds. Scores are recalculated automatically.</p></div>
 <div class="finalboard">${rows.map((r,i)=>`<div class="finalrow"><div class="medal">${i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1)}</div><div><h2>${esc(r.name)}</h2><p>${r.detail.length?r.detail.join(" • "):"No points yet"}</p></div><strong>${r.pts}</strong></div>`).join("")}</div>
 <div class="card"><h2>Grand Final actual data</h2><div class="summarygrid">${S.actual.quarters.map((q,i)=>`<div><b>Q${i+1}</b><span>FRE ${q.freo||"—"} · BRL ${q.bris||"—"}</span><small>First: ${esc(q.first)||"—"} · Last: ${esc(q.last)||"—"} · Disposals: ${esc(q.most)||"—"}</small></div>`).join("")}</div>
 <p><b>Winner:</b> ${esc(S.actual.winner)||"—"} &nbsp; <b>Margin:</b> ${esc(S.actual.margin)||"—"} &nbsp; <b>Norm Smith:</b> ${esc(S.actual.norm)||"—"} &nbsp; <b>Most goals:</b> ${esc(S.actual.goals)||"—"}</p></div>
 <div class="card"><button class="primary" onclick="window.print()">🖨 Print / Save PDF</button><button class="secondary" onclick="exportData()">Export game data</button></div>`;
}
function go(p){S.page=p;save();render();window.scrollTo({top:0,behavior:"smooth"})}
function resetGame(){if(confirm("Reset the entire game? This deletes all names, picks and scores from this browser.")){S=blankState();save();render()}}
function exportData(){const blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="afl-2026-game-data.json";a.click();URL.revokeObjectURL(a.href)}
if("serviceWorker"in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
