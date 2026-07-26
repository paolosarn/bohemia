/* ============================================================================
   BOHEMIA — PERMANENT TEST FILE (bohemia_tests.js)  7.2.26
   Run: node bohemia_tests.js   (expects bohemia_engine.js beside it)
   Tests ARE canon enforcement. They live on disk like everything else.
   Suites: FrameCache, Persist, CombatBridge, Skinner (bind coherence +
   seam cleanup + garment path). Add every new suite here, never in scratch.
   ============================================================================ */
'use strict';
const E=require('./bohemia_engine.js');
let fails=0,n=0;const ok=(c,m)=>{n++;if(!c){fails++;console.log('FAIL:',m);}};

{ /* ===== module suites ===== */

// ===== FrameCache =====
{const {FrameCache,lookHash}=E.FrameCache;
 let builds=0;
 const fc=new FrameCache({buckets:12,max:5});
 const bf=(d,c,ph)=>{builds++;return {d,c,ph,px:[d,c,Math.round(ph*100)]};};
 const a=fc.get('S','run',0.04,'look1',bf);
 const b=fc.get('S','run',0.07,'look1',bf);       // same bucket
 ok(a===b&&builds===1,'FC same-bucket returns cached, 1 build');
 fc.get('S','run',0.13,'look1',bf);
 ok(builds===2,'FC next bucket builds');
 fc.get('S','run',0.04,'look2',bf);
 ok(builds===3,'FC look change = new frame');
 // bucket centers stable: build phase is center of bucket
 ok(Math.abs(a.ph-(0.5/12))<1e-9,'FC builds at bucket center');
 // LRU: cap 5, insert 8 distinct
 for(let i=0;i<8;i++)fc.get('N','walk',i/12+0.001,'x',bf);
 ok(fc.stats().size<=5,'FC LRU cap holds ('+fc.stats().size+')');
 // quantize wraps negatives and >1
 ok(fc.quantize(1.04)===fc.quantize(0.04)&&fc.quantize(-0.96+1)===fc.quantize(0.04),'FC phase wrap');
 // lookHash stability + sensitivity
 const h1=lookHash({outfit:{a:1},skin:2}),h2=lookHash({outfit:{a:1},skin:2}),h3=lookHash({outfit:{a:1},skin:3});
 ok(h1===h2&&h1!==h3,'FC lookHash stable + sensitive');
}

// ===== Persist =====
{const {Persist,MemoryBackend}=E.Persist;
 const be=new MemoryBackend();
 const p=new Persist({backend:be,version:1,flushMs:100});
 ok(p.saveNow('run1',{gold:5}).ok,'P saveNow ok');
 const l=p.load('run1');
 ok(l.ok&&l.data.gold===5&&l.v===1,'P load roundtrip');
 // dirty + throttle
 p.save('run1',{gold:6});
 const f1=p.flush(1000);
 ok(f1.ok&&f1.flushed===1,'P flush writes dirty');
 p.save('run1',{gold:7});
 const f2=p.flush(1050);
 ok(f2.throttled===true,'P flush throttles inside window');
 const f3=p.flush(1200);
 ok(f3.flushed===1&&p.load('run1').data.gold===7,'P throttled write lands next flush');
 // migration chain v1->v3
 const p3=new Persist({backend:be,version:3});
 p3.register(1,d=>({gold:d.gold,gems:0}));
 p3.register(2,d=>({wallet:{gold:d.gold,gems:d.gems}}));
 const m=p3.load('run1');
 ok(m.ok&&m.v===3&&m.data.wallet.gold===7,'P migration chain v1->v3');
 // missing migration = explicit fail, not corrupt load
 const p9=new Persist({backend:be,version:9});
 ok(p9.load('run1').ok===false,'P missing migration fails loud');
 // corrupt slot
 be.setItem('bohemia:bad','not json{');
 ok(p.load('bad').ok===false,'P corrupt fails loud');
 // slots + export/import
 p.saveNow('run2',{x:1});
 ok(p.slots().sort().join(',').includes('run1')&&p.slots().includes('run2'),'P slots list');
 const blob=p.exportAll();
 const be2=new MemoryBackend();
 const q=new Persist({backend:be2,version:1});
 const imp=q.importAll(blob);
 ok(imp.ok&&q.load('run2').ok&&q.load('run2').data.x===1,'P export/import carries slots');
 // no-overwrite default
 q.saveNow('run2',{x:99});
 q.importAll(blob);
 ok(q.load('run2').data.x===99,'P import respects existing without overwrite');
 q.importAll(blob,{overwrite:true});
 ok(q.load('run2').data.x===1,'P import overwrite flag works');
 // unserializable
 const cyc={};cyc.self=cyc;
 ok(p.saveNow('cyc',cyc).ok===false,'P unserializable fails loud');
}

// ===== CombatBridge =====
{const {CombatBridge,PKG}=E.CombatBridge;
 let cb=null,got=null;
 cb=new CombatBridge({onResolve:(shot,res)=>{got=[shot,res];}});
 const s=cb.beginShot({shooter:'player',target:'raider7',packageId:PKG.HARD,weapon:'revolver'});
 ok(cb.pending().length===1,'CB shot pending');
 const r=cb.resolve(s.shotId,{outcome:'killshot',zone:'center',greedMult:3,patMeta:{pat:'comet'}});
 ok(r.ok&&r.result.outcome==='killshot'&&got&&got[1].greedMult===3,'CB resolve fires sim callback with contract');
 ok(cb.pending().length===0,'CB pending cleared');
 ok(cb.resolve(s.shotId,{outcome:'hit'}).ok===false,'CB double-resolve rejected');
 // bogus outcome coerced to miss
 const s2=cb.beginShot({packageId:99});
 ok(s2.packageId===4,'CB package clamped');
 const r2=cb.resolve(s2.shotId,{outcome:'banana'});
 ok(r2.result.outcome==='miss','CB unknown outcome = miss');
 // dangling shots void on boot
 cb.beginShot({});cb.beginShot({});
 ok(cb.voidPending().length===2&&cb.pending().length===0,'CB dangling shots void');
 // headless: deterministic with seeded rng, odds ordered by package
 function seeded(seed){let s0=seed;return ()=>{s0=(s0*1664525+1013904223)>>>0;return s0/4294967296;};}
 for(const trials of [1]){
   const counts={};
   for(const pkg of [0,4]){
     const cb2=new CombatBridge({rng:seeded(42)});
     let ks=0;
     for(let i=0;i<2000;i++){const sh=cb2.beginShot({packageId:pkg});const rr=cb2.resolveHeadless(sh.shotId);if(rr.result.outcome==='killshot')ks++;}
     counts[pkg]=ks;
   }
   ok(counts[0]>counts[4]*2,'CB headless killshot odds: EASY('+counts[0]+') >> BOHEMIAN('+counts[4]+')');
 }
 // headless determinism
 const mk=()=>{const c=new CombatBridge({rng:seeded(7)});const outs=[];for(let i=0;i<50;i++){const sh=c.beginShot({packageId:1});outs.push(c.resolveHeadless(sh.shotId).result.outcome);}return outs.join(',');};
 ok(mk()===mk(),'CB headless deterministic under seeded RNG');
}

}
{ /* ===== Skinner suite ===== */
const { Skinner, poseWalk } = E.Skinner;
const BAKED = E.RigData.BAKED;
const CANDD = E.RigData.CANDD;
const CW=56, CH=56, NP=12;
const DIRS = Object.keys(BAKED.skeleton);

const exp = { layers: BAKED.layers, skeleton: BAKED.skeleton, CANDD };

// T1: construct all dirs
const sk = {};
for (const d of DIRS) { sk[d] = new Skinner(exp, d); sk[d].orderOverride = null; }
ok(true, 'T1 Skinner constructs for all 8 dirs (cohereBind ran in _rebind)');

// T2: rest pose skin() == painted layers exactly, per part cell ownership
let restDiff=0;
for (const d of DIRS) {
  const out = sk[d].skin(sk[d].restPose());
  // union of layers with draw-order claim: verify every painted cell of every part is out!=0, and out cells subset of union
  const union = new Uint8Array(CW*CH);
  for (let p=1;p<=NP;p++) for (let i=0;i<CW*CH;i++) if (sk[d].layers[p][i]) union[i]=1;
  for (let i=0;i<CW*CH;i++){ if ((out[i]?1:0)!==union[i]) restDiff++; }
}
ok(restDiff===0, 'T2 rest skin() silhouette byte-identical to painted union ('+restDiff+' diffs)');

// T3: posed walk, spurs and holes
function spurs(g){let n=0;for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=y*CW+x;if(!g[i])continue;let nb=0;
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||nx>=CW||ny<0||ny>=CH)continue;if(g[ny*CW+nx])nb++;}
 if(nb<=1)n++;}return n;}
function holes(g){let n=0;for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=y*CW+x;if(g[i])continue;let nb=0;
 if(x>0&&g[i-1])nb++;if(x<CW-1&&g[i+1])nb++;if(y>0&&g[i-CW])nb++;if(y<CH-1&&g[i+CW])nb++;
 if(nb>=3)n++;}return n;}
let restThin=0;
for (const d of DIRS) for (let p=1;p<=NP;p++){const L=sk[d].layers[p];
 for(let i=0;i<CW*CH;i++){if(!L[i])continue;const x=i%CW,y=(i/CW)|0;let nb=0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||nx>=CW||ny<0||ny>=CH)continue;if(L[ny*CW+nx])nb++;}
  if(nb<=1)restThin++;}}
let sT=0,hT=0,frames=0;
for (const d of DIRS) {
  const R = sk[d].restPose();
  for (const bf of [0.25, 0.5, 0.75]) {
    const P = poseWalk(R, bf, 0.9); // hard swing
    const out = sk[d].skin(P);
    sT += spurs(out); hT += holes(out); frames++;
  }
}
console.log(frames+' posed frames: total spurs '+sT+' (rest thin art budget '+restThin+'), seam holes '+hT);
ok(sT<=restThin*3, 'T3 spurs within thin-art budget across '+frames+' frames');
let restHoles=0;
for (const d of DIRS) restHoles += holes(sk[d].skin(sk[d].restPose()));
const budget = (restHoles/DIRS.length + 2) * frames;
ok(hT<=budget, 'T4 posed holes within art-gap baseline ('+hT+' <= budget '+budget.toFixed(0)+', rest baseline '+restHoles+'/8 dirs)');

// T5: garment skinColorLayer, synthetic torso shirt: rest exactness + posed hole-free
{const d='S'; const S=sk[d]; const R=S.restPose();
 // build shirt from torso region pixels
 const restBody = S.skin(R);
 const shirt = new Array(CW*CH).fill(null);
 for (let i=0;i<CW*CH;i++) if (S.layers[4][i]) shirt[i]=[200,40,40];
 const restG = S.skinColorLayer(R, shirt, null, restBody);
 let rd=0; for (let i=0;i<CW*CH;i++){ if ((!!restG.col[i])!==(!!shirt[i])) rd++; }
 ok(rd===0, 'T5 rest garment renders exactly ('+rd+' diffs)');
 const P = poseWalk(R, 0.5, 0.9);
 const g = S.skinColorLayer(P, shirt, null, restBody);
 const gm = new Uint8Array(CW*CH); for(let i=0;i<CW*CH;i++)gm[i]=g.col[i]?1:0;
 ok(holes(gm)===0, 'T6 posed garment has zero seam holes');
 ok(spurs(gm)<=2, 'T7 posed garment flyaways crushed ('+spurs(gm)+')');
 // filled cells must carry a valid bone for handLaw
 let badBone=0; for(let i=0;i<CW*CH;i++) if(g.col[i]&&g.bone[i]<0) badBone++;
 ok(badBone===0, 'T8 all garment cells carry a bone ('+badBone+' bad)');
}

}

{ /* ===== 7/2 audit probe suite: determinism + invariants ===== */
// Core RNG determinism
{const a=new E.Core.RNG('sx'),b=new E.Core.RNG('sx'),c=new E.Core.RNG('sy');
 const sa=[...Array(50)].map(()=>a.next()),sb=[...Array(50)].map(()=>b.next()),sc=[...Array(50)].map(()=>c.next());
 ok(JSON.stringify(sa)===JSON.stringify(sb),'AUD Core.RNG deterministic per seed');
 ok(JSON.stringify(sa)!==JSON.stringify(sc),'AUD seeds diverge');}
// WorldGen determinism
{const w1=JSON.stringify(E.WorldGen.generateWorld('vegas-1')),w2=JSON.stringify(E.WorldGen.generateWorld('vegas-1'));
 ok(w1===w2,'AUD generateWorld deterministic');}
// Save round trip
{const s=E.Save.newSave('dyn-seed');const txt=E.Save.serialize(s);
 ok(E.Save.serialize(E.Save.deserialize(txt))===txt,'AUD save round-trip byte-stable');
 const f1=JSON.stringify(E.Generations.foldFromSave(E.Save.deserialize(txt)));
 const f2=JSON.stringify(E.Generations.foldFromSave(E.Save.deserialize(txt)));
 ok(f1===f2,'AUD foldFromSave deterministic');}
// Heartbeat anti-drift (first tick is baseline, contributes 0)
{const MSB=E.Heartbeat.MS_PER_BEAT,MAXF=E.Heartbeat.MAX_FRAME_MS;
 const frames=[16,16,240,16,3,500,16,16,90,16];
 const hb2=new E.Heartbeat.Heartbeat();let t2=0,acc2=0;
 hb2.tick(t2);
 for(const dt of frames){t2+=dt;hb2.tick(t2);acc2+=Math.min(dt,MAXF);}
 const total=hb2.beat*MSB+hb2.acc;
 ok(Math.abs(total-acc2)<1e-6,'AUD Heartbeat anti-drift: beat*MSB+acc equals clamped elapsed exactly ('+total+' vs '+acc2+')');}
// Combat determinism for fixed args
{const args={attacker:{accuracy:0.7},defender:{},weapon:{dmg:10},zone:'vital'};
 ok(JSON.stringify(E.Combat.resolveShot(args))===JSON.stringify(E.Combat.resolveShot(args)),'AUD resolveShot no hidden RNG');}
// Inventory weight law
{const inv=E.Inventory.fresh();E.Inventory.addItem(inv,'lead',1e9,1);
 ok(E.Inventory.currentWeight(inv)<=E.Inventory.DEFAULT_MAX_WEIGHT,'AUD addItem cannot break weight cap');}
// FactionCanon guard: partial constraints clamp, never throw
{let threw=false,v;try{v=E.FactionCanon.enforceConstraints({},'a','b',-999);}catch(e){threw=true;}
 ok(!threw&&v===-999,'AUD enforceConstraints survives empty constraints (guard)');
 let v2=E.FactionCanon.enforceConstraints({floor:{b:-50}},'a','b',-999);
 ok(v2===-50,'AUD partial constraints still enforce the floor');}
}


{ /* ===== GOLDEN FRAME SUITE (7/2/26): every locked motion/render law enforced at the PIXEL level.
     Any change that moves one pixel of any pose in any direction FAILS here until the goldens
     are intentionally re-blessed. Re-bless: regenerate hashes with the golden script, review the
     visual diff, update GOLDENS below, note it in the session addendum. ===== */
const GOLDENS={"S|rest": "1l0awn0", "S|walk25": "1x9mki0", "S|walk75": "1x9mki0", "SE|rest": "1rv6475", "SE|walk25": "128qcxx", "SE|walk75": "128qcxx", "E|rest": "uyrudb", "E|walk25": "ccutj5", "E|walk75": "ccutj5", "NE|rest": "1mj5pkl", "NE|walk25": "1wivk9o", "NE|walk75": "1wivk9o", "N|rest": "eqnect", "N|walk25": "neybzl", "N|walk75": "neybzl", "NW|rest": "1ogxj69", "NW|walk25": "1ad3ypz", "NW|walk75": "1ad3ypz", "W|rest": "1b0jj05", "W|walk25": "je72zf", "W|walk75": "je72zf", "SW|rest": "13h8ql4", "SW|walk25": "1ftuev5", "SW|walk75": "1ftuev5", "S|garment25": "dbk3zx"};
const {Skinner,poseWalk}=E.Skinner;
const BAKED=E.RigData.BAKED;
const gexp={layers:BAKED.layers,skeleton:BAKED.skeleton,CANDD:E.RigData.CANDD};
const gfnv=(buf)=>{let h=2166136261>>>0;for(let i=0;i<buf.length;i++){h^=buf[i];h=Math.imul(h,16777619)>>>0;}return h.toString(36);};
for(const d of Object.keys(BAKED.skeleton)){
  const S=new Skinner(gexp,d);const R=S.restPose();
  ok(gfnv(S.skin(R))===GOLDENS[d+'|rest'],'GOLD '+d+' rest grid matches golden');
  ok(gfnv(S.skin(poseWalk(R,0.25,0.5)))===GOLDENS[d+'|walk25'],'GOLD '+d+' walk.25 matches golden');
  ok(gfnv(S.skin(poseWalk(R,0.75,0.5)))===GOLDENS[d+'|walk75'],'GOLD '+d+' walk.75 matches golden');
}
{const S=new Skinner(gexp,'S');const R=S.restPose();const restBody=S.skin(R);
 const shirt=new Array(56*56).fill(null);for(let i=0;i<56*56;i++)if(S.layers[4][i])shirt[i]=[200,40,40];
 const g=S.skinColorLayer(poseWalk(R,0.25,0.5),shirt,null,restBody);
 const bytes=new Uint8Array(56*56*3);for(let i=0;i<56*56;i++){const c=g.col[i];if(c){bytes[i*3]=c[0];bytes[i*3+1]=c[1];bytes[i*3+2]=c[2];}}
 ok(gfnv(bytes)===GOLDENS['S|garment25'],'GOLD S garment walk.25 matches golden');}
}
{ /* ===== NPCFactory suite ===== */
const {NPCFactory}=E.NPCFactory;
const cats={body:['body/m1'],facial:['facial/f1'],pants:['pants/p1','pants/p2'],shoes:['shoes/s1'],shirt:['shirt/a','shirt/b','shirt/c'],hair:['hair/h1','hair/h2'],jacket:['jacket/j1'],hat:['hat/x1'],glasses:['glasses/g1']};
const F=new NPCFactory({slots:cats,RNG:E.Core.RNG});
const a=F.npcFrom('citizen-7'),b=F.npcFrom('citizen-7'),c=F.npcFrom('citizen-8');
ok(JSON.stringify(a)===JSON.stringify(b),'NPC same seed = identical citizen forever');
ok(JSON.stringify(a)!==JSON.stringify(c),'NPC seeds diverge');
let allValid=true;const seenShirts=new Set(),seenTones=new Set();let jackets=0;
for(let i=0;i<400;i++){const p=F.npcFrom('crowd-'+i);
  for(const s in p.equipped){const k=p.equipped[s];if(k&&cats[s].indexOf(k)<0)allValid=false;}
  for(const s of ['body','facial','pants','shoes','shirt','hair'])if(!p.equipped[s])allValid=false;
  seenShirts.add(p.equipped.shirt);seenTones.add(p.skinToneName);if(p.equipped.jacket)jackets++;}
ok(allValid,'NPC only ever picks from the painted catalogs, core slots always dressed');
ok(seenShirts.size===3,'NPC all catalog shirts reachable ('+seenShirts.size+'/3)');
ok(seenTones.size>=8,'NPC skin tone spread ('+seenTones.size+'/9)');
ok(jackets>120&&jackets<320,'NPC optional-slot odds in sane band (jackets '+jackets+'/400)');
ok(F.lookKey(a)===F.lookKey(b)&&F.lookKey(a)!==F.lookKey(c),'NPC lookKey stable + distinct for FrameCache');
const real=new NPCFactory({});
const r=real.npcFrom('demo-1');
ok(r.equipped.body==='body/male-mid','NPC real wardrobe catalog wired (body from PD_DATA)');
}

console.log((n-fails)+"/"+n+" engine tests pass"+(fails?" - "+fails+" FAILURES":""));process.exit(fails?1:0);
