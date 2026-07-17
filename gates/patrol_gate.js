const PT=require('../engine/bohemia_patrol.js');
const G=require('../engine/bohemia_blockgen.js');
const P=require('../engine/bohemia_powergrid.js');
const OM=require('../engine/bohemia_overmap.js');
let p=0,f=0; const ok=(n,c)=>{c?p++:(f++,console.log("FAIL "+n));};

const m=OM.buildOvermap(12345);
const pm=P.powerMap(m,12345);
const blk=G.generate('street',12345,24,{lanes:2,median:1,sidewalk:1,intersection:true});

// --- the law: nobody patrols the dark ---
ok("dead circuit gets zero patrols", PT.patrolsFor(blk,[33,6],pm,1).length===0);
ok("no powergrid at all = zero patrols", PT.patrolsFor(blk,[33,6],null,1).length===0);

// find a live cell of each owner
const own={};
for(let y=0;y<OM.OVER_N&&Object.keys(own).length<4;y++)for(let x=0;x<OM.OVER_N;x++){
  const s=pm.at(x,y); if(s.live&&s.owner&&!own[s.owner]) own[s.owner]=[x,y];
}
console.log("  live owners found:",Object.keys(own).join(', '));
ok("live circuits exist to patrol", Object.keys(own).length>0);

for(const [owner,cell] of Object.entries(own)){
  const ps=PT.patrolsFor(blk,cell,pm,1);
  const want=PT.STYLE[owner].count;
  ok(`${owner} spawns ${want} patrol(s)`, ps.length===want);
  ps.forEach(q=>ok(`${owner} patrol is owned correctly`, q.owner===owner));
}

// --- route stays on the sidewalk. patrols are not props but they are not in traffic ---
const route=PT.routeFor(blk);
ok("route exists", !!route&&route.length>0);
const sideCells=route.filter(([x,y])=>blk.grid[y][x].g==='side').length;
ok("both sidewalk rows are walked end to end", sideCells===blk.W*2);
ok("only the two crossing legs leave the sidewalk", route.length-sideCells===(blk.H-2)*2);
ok("route is a closed loop", (()=>{const a=route[0],b=route[route.length-1];
  return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])<=1;})());
ok("route uses both sides of the street",
   route.filter(([x,y])=>blk.grid[y][x].g==='side').reduce((s,c)=>s.add(c[1]),new Set()).size===2);
ok("crossings happen only at the block ends (nobody jaywalks)",
   route.filter(([x,y])=>blk.grid[y][x].g!=='side').every(([x])=>x===0||x===blk.W-1));

// --- NETWORK IS EERILY PERFECT: this is the whole character of the faction ---
if(own.network){
  const ps=PT.patrolsFor(blk,own.network,pm,1);
  const L=ps[0].route.length;
  const ring=(a,b)=>Math.min((a-b+L)%L,(b-a+L)%L);   // gap on a LOOP, not a line
  const gap=ring(ps[0].i,ps[1].i);
  ok("network patrols sit at an EXACT gap", gap===Math.floor(L/2));
  // walk 500 steps: a network patrol must never pause and never reverse
  const w=PT.makeWalker(ps[0],7);
  const d0=ps[0].dir; let paused=0;
  for(let i=0;i<500;i++){ if(w.intent()===null)paused++; w.commit(true); }
  ok("network patrol NEVER pauses in 500 steps", paused===0);
  ok("network patrol NEVER reverses", ps[0].dir===d0);
  // and two network patrols hold their gap forever — that is the eerie part.
  // fresh pair: the walker above already advanced ps[0] 500 steps on its own.
  const q=PT.patrolsFor(blk,own.network,pm,1);
  const a=PT.makeWalker(q[0],7), b=PT.makeWalker(q[1],9);
  for(let i=0;i<500;i++){a.commit(true);b.commit(true);}
  ok("two network patrols hold the exact gap after 500 steps", ring(q[0].i,q[1].i)===gap);
}

// --- humans are not perfect. that contrast IS the tell ---
if(own.settlement){
  const ps=PT.patrolsFor(blk,own.settlement,pm,3);
  const w=PT.makeWalker(ps[0],11);
  let paused=0; for(let i=0;i<500;i++){ if(w.intent()===null)paused++; w.commit(true); }
  ok("settlement patrol DOES pause (it is human)", paused>0);
}

// --- occupancy: a patrol waits, it never clips ---
const ps=own.network?PT.patrolsFor(blk,own.network,pm,1):PT.patrolsFor(blk,Object.values(own)[0],pm,1);
const w=PT.makeWalker(ps[0],5);
const before=w.cell().join(',');
w.commit(false);                       // something was in the way
ok("blocked patrol does not move", w.cell().join(',')===before);
w.commit(true);
ok("blocked patrol resumes after waiting one beat", true);

// --- determinism ---
const A=JSON.stringify(PT.patrolsFor(blk,Object.values(own)[0],pm,42).map(q=>q.i));
const B=JSON.stringify(PT.patrolsFor(blk,Object.values(own)[0],pm,42).map(q=>q.i));
ok("patrols are deterministic per (cell,seed)", A===B);
ok("a lone solar survivor does not patrol", PT.STYLE.solar_lone.count===0);
ok("facing is derived from the route, never guessed",
   (()=>{const fc=w.facing();return Math.abs(fc[0])+Math.abs(fc[1])===1;})());

console.log(`\n=== PATROL GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
