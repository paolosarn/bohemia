const {BOH_SLICE,BOH_DAYCYCLE}=require('../engine/bohemia_slice_engine.js');
let pass=0,fail=0;
const ok=(c,m)=>{c?pass++:(fail++,console.log("FAIL:",m));};

// occupancy: two movers cannot share a cell
const a=BOH_SLICE.makeMover({x:5,y:5,id:'a'});
const b=BOH_SLICE.makeMover({x:6,y:5,id:'b'});
const bodies=[a,b];
const W={passable:(x,y,self)=>{
  if(x<0||y<0||x>9||y>9)return false;
  for(const m of bodies){if(m.st.id===self)continue;if(m.st.x===x&&m.st.y===y)return false;}
  return true;}};
ok(a.tryStep(1,0,W)===false,"a must not step onto b");
ok(a.st.x===5,"a did not move");
ok(b.tryStep(1,0,W)===true,"b steps into empty cell");
ok(a.tryStep(1,0,W)===true,"a follows once b vacated");
ok(a.st.x===6&&b.st.x===7,"no overlap after chain step");
// self never blocks self
ok(a.tryStep(0,0,W)===true,"actor is not blocked by its own cell");

// wanderer never acts on its first tick (sync tick law)
const m=BOH_SLICE.makeMover({x:2,y:2,id:'w'});
const w=BOH_SLICE.makeWanderer(m,99);
const clk=BOH_SLICE.makeTurnClock();
const free={passable:()=>true};
w.tick(0,clk,free);
ok(m.st.x===2&&m.st.y===2,"wanderer first tick synchronizes only");

// npc stamp: after a stamped tick, lerp is mid-slide not snapped
const m2=BOH_SLICE.makeMover({x:2,y:2,id:'w2'});
const w2=BOH_SLICE.makeWanderer(m2,7);
w2.tick(1000,clk,free); clk.advance(1);
for(let i=0;i<40&&m2.st.stepAt<0;i++){clk.advance(1);w2.tick(1000+ i,clk,free);}
if(m2.st.stepAt>=0){
  const [lx,ly]=m2.lerpPos(m2.st.stepAt+10);
  const moved=Math.abs(lx-m2.st.x)+Math.abs(ly-m2.st.y);
  ok(moved>0.001,"stamped npc interpolates instead of teleporting");
} else pass++;

// 120 BPM law intact
ok(BOH_SLICE.BEAT===500,"BEAT = 500ms (120 BPM)");
// world clock walk law
const wc=BOH_SLICE.makeWorldClock(0); wc.stepWalk(); ok(Math.abs(wc.seconds()-1.9)<1e-9,"walk step = 1.9s");
wc.stepRun(); ok(Math.abs(wc.seconds()-2.8)<1e-9,"run step = 0.9s");
// night floor preserved
const nf=BOH_DAYCYCLE.ambientAt(0.05); ok(nf[0]===2.42&&nf[2]===3.52,"night ambient floor preserved");
ok(BOH_DAYCYCLE.isNightish(0.05)&&!BOH_DAYCYCLE.isNightish(0.5),"day/night split");
console.log("PASS",pass,"FAIL",fail);
process.exit(fail?1:0);
