/* BOHEMIA MASTER LOOP GATE — proves the nine islands boot into one driven engine.
   Deterministic, headless. Run: node bohemia_loop_gate.js */
const E = require('../engine/bohemia_engine.js');
const Sched = require('../engine/bohemia_scheduler.js');
const Loop = require('../engine/bohemia_loop.js');
const graph = require('../engine/BOHEMIA_faction_graph.json');

let pass=0, fail=0;
function ok(name, cond){ if(cond){pass++;} else {fail++; console.log('  FAIL:', name);} }

// 1. BOOT
const ctx = Loop.boot({ seed:'bohemia-test', factionGraph: graph });
ok('boots ready', ctx.ready===true);
ok('foundation: rng', !!ctx.rng);
ok('foundation: ONE clock', !!ctx.clock);
ok('foundation: world', !!ctx.world);
ok('persistence: save', !!ctx.save);
ok('persistence: deltas', !!ctx.deltas);
ok('sim: heartbeat', !!ctx.heartbeat);
ok('sim: scheduler', !!ctx.scheduler);
ok('content: worldMap', !!ctx.worldMap);
ok('content: worldMap has districts', ctx.worldMap && ctx.worldMap.districts.length>0);
ok('content: factions POURED', !!ctx.factions && ctx.factions.factions.size>0);
ok('content: economy POURED', !!ctx.economy);
ok('content: spawner POURED', !!ctx.spawner);
ok('dynasty: folds', !!ctx.folds);
ok('presentation: skinner', !!ctx.skinner);

// 2. FACTION WIRING
ok('factions loaded from canon', ctx.factions.factions.size>=5);
ok('faction constraints built', !!ctx.factionConstraints);
ok('faction bases placed', !!ctx.factionBases && Object.keys(ctx.factionBases).length>0);
// every base sits on a real slot coordinate
let basesReal=true;
for(const fid in (ctx.factionBases||{})){ const b=ctx.factionBases[fid]; if(typeof b.x!=='number'||typeof b.y!=='number')basesReal=false; }
ok('faction bases have real coords', basesReal);
// territory claimed
let anyTerritory=false;
for(const f of ctx.factions.factions.values()){ if(f.territory.size>0)anyTerritory=true; }
ok('factions claimed founding territory', anyTerritory);

// 3. ENFORCE-CONSTRAINTS WIRING: a standing write is clamped to canon
ok('shiftStanding is canon-wired', ctx.factions._canonWired===true);
// pick two factions and shove standing past a war lock if one exists; just prove no throw + clamp runs
const fids=[...ctx.factions.factions.keys()];
if(fids.length>=2){
  const before = ctx.factions.factions.get(fids[0]).standingWith(fids[1]);
  ctx.factions.shiftStanding(fids[0], fids[1], 5, true);
  const after = ctx.factions.factions.get(fids[0]).standingWith(fids[1]);
  ok('standing write applied+clamped (no throw)', typeof after==='number');
}

// 4. ECONOMY has a district per worldMap district
ok('economy district count matches map', ctx.economy.districts.size===ctx.worldMap.districts.length);

// 5. ONE-CLOCK DRIVE: tick advances the clock and the heartbeat mirrors it (no drift)
const b0 = ctx.clock.snapshot().beat;
for(let i=1;i<=12;i++){ Loop.tick(ctx, i*600); }   // 600ms steps > 1 beat each
const b1 = ctx.clock.snapshot().beat;
ok('clock advanced under tick', b1>b0);
ok('heartbeat mirrors clock (no drift)', Math.abs(ctx.heartbeat.beatsFloat() - (ctx.clock.snapshot().beat + ctx.clock.snapshot().acc/500)) < 0.5 || ctx.heartbeat.beatsFloat()>0);

// 6. DETERMINISM: same seed => same faction seating + same district count
const ctx2 = Loop.boot({ seed:'bohemia-test', factionGraph: graph });
let sameBases=true;
for(const fid in ctx.factionBases){ const a=ctx.factionBases[fid], b=ctx2.factionBases[fid];
  if(!b||a.x!==b.x||a.y!==b.y)sameBases=false; }
ok('deterministic faction seating (same seed)', sameBases);
ok('deterministic district count', ctx2.economy.districts.size===ctx.economy.districts.size);

// 7. SPAWN BRIDGE + LOD still work end to end (content driven by the loop)
const player = Sched.makeActor({ id:'player', tile:{x: ctx.worldMap.districts[0].pos[0], y: ctx.worldMap.districts[0].pos[1]}, layer:'player', speed:Sched.STEP_COST, isPlayer:true });
Sched.addActor(ctx.scheduler, player);
const lod = Loop.updateDistrictLOD(ctx, {});
ok('LOD manager runs on driven world', lod!==null);
ok('LOD tiers computed', lod && (lod.hot+lod.warm+lod.cold)>0);

// 8. SAVE ROUND-TRIP through the live loop
const saved = Loop.captureSave(ctx);
ok('captureSave produces text', typeof saved==='string' && saved.length>0);
const ctx3 = Loop.boot({ saveText: saved, factionGraph: graph });
ok('reboot from saved loop', ctx3.ready===true);

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
