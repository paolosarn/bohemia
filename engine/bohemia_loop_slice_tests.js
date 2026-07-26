/* bohemia_loop_slice_tests.js — THE GOAL-SLICE LOOP, PROVEN HEADLESS.
   Composes every quest-spine brick into the one loop Paolo's playtest needs, with
   NO render: boot the context, spawn the player as a scheduler actor, WALK him
   across real map tiles (occupancy + collision) to an NPC that a quest is bound to,
   confirm the talk only offers on ARRIVAL, play the quest through a branch to
   COMPLETE, read the journal/objective HUD, then SAVE -> reload -> and prove the
   dynasty actually moved (the choice-log carries the quest, the quest is done on
   the reloaded runtime). This is the "prove the loop" gate: when the render session
   comes, it only has to DRAW what this test already runs. Headless:
   `node engine/bohemia_loop_slice_tests.js`. */
'use strict';
var Loop  = require('./bohemia_loop.js');
var Sched = require('./bohemia_scheduler.js');
var E     = require('./bohemia_engine.js');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }

/* the neighbor-style first errand, shaped like a real quest: an objective, a warm
   line, and ONE branch that gates on knowledge learned in the same conversation. */
var Q = [
 '@QUEST firsterrand  The First Errand',
 '@ACT 1', '@ONCE false',
 '@ROLE neighbor REQ is=demo',
 '@STAGE 10', '  @DO show_objective 10',
 '@STAGE 20 COMPLETE', '  @LOG the wall between us comes down',
 '@OBJ 10 "hear the neighbor out"',
 '@TALK hello speaker=neighbor entry=stage>=10',
 '  @SAY alone we are dead. together the wall between our yards is our first gate.',
 '  @OPT "why me?"       [gate: none]        -> because',
 '  @OPT "let us build"  [gate: knows:plan]  @DO complete_objective 10 @DO set_stage 20 -> END',
 '@END',
 '@TALK because speaker=neighbor', '  @SAY you fought last night. that is enough.', '  @DO learn plan', '@END'
].join('\n');

var ctx = Loop.boot({ seed:'bohemia' });
ok(ctx.ready===true, 'the loop boots ready');

/* find a straight passable corridor so the walk is real, not phasing through walls */
var passable = ctx.scheduler.passable;
var anchor = ctx.worldMap.districts[0].pos;
var DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
var RUN = 5;   // player start ... 4 steps ... NPC tile
function corridorFrom(ax, ay){
  for (var r=0; r<40; r++){
    for (var s=0; s<DIRS.length; s++){
      var d=DIRS[s], ok2=true, sx=ax+ (r*DIRS[(s+1)%4][0]), sy=ay + (r*DIRS[(s+1)%4][1]);
      for (var k=0;k<RUN;k++){ if(!passable(sx+d[0]*k, sy+d[1]*k)){ ok2=false; break; } }
      if(ok2) return { x:sx, y:sy, dir:d };
    }
  }
  return null;
}
var corr = corridorFrom(anchor[0], anchor[1]);
ok(!!corr, 'found a passable corridor to walk (real map geography, no phasing)');

/* spawn the PLAYER as scheduler actor #0 at the corridor start */
var start = { x:corr.x, y:corr.y };
var npcTile = { x:corr.x + corr.dir[0]*(RUN-1), y:corr.y + corr.dir[1]*(RUN-1) };
var player = Sched.makeActor({ id:'player', tile:{x:start.x,y:start.y}, isPlayer:true, layer:'player' });
Sched.addActor(ctx.scheduler, player);
ok(ctx.scheduler.actors.some(function(a){return a.isPlayer;}), 'the player is a scheduler actor (occupancy law applies)');

/* bind the first-errand quest to the NPC's tile */
ctx.quests.place(Q, { x:npcTile.x, y:npcTile.y, layer:'npc', speaker:'neighbor' });
ok(!!ctx.quests.get('firsterrand'), 'the first-errand quest is live and bound to the neighbor tile');

/* BEFORE walking: not adjacent, so nothing is talkable */
ok(Loop.talkablesNear(ctx, player.tile.x, player.tile.y, 1).length===0, 'standing at the door, the neighbor is out of talk range');

/* WALK: commit one grid move per turn toward the NPC, snapping the slide headlessly,
   until step-adjacent. I-move-you-move: each commit advances the world one turn. */
var guard=0, arrived=false;
while (guard++ < 20){
  var near = Loop.talkablesNear(ctx, player.tile.x, player.tile.y, 1);
  if (near.length){ arrived=true; break; }
  Loop.commit(ctx, { kind:'move', dx:corr.dir[0], dy:corr.dir[1] });
  Sched.finishSlides(ctx.scheduler);   // headless: snap the render slide to committed
}
ok(arrived, 'the player walked the neighborhood and reached talk range of the NPC');
ok(ctx.scheduler.turn>0, 'walking advanced the world-turn clock (I-move-you-move)');

/* TALK on arrival */
var talkables = Loop.talkablesNear(ctx, player.tile.x, player.tile.y, 1);
ok(talkables.length===1 && talkables[0].node==='hello', 'on arrival the neighbor offers his talk node');
var view = Loop.talkTo(ctx, talkables[0].questId, talkables[0].node);
ok(!!view && view.speaker==='neighbor', 'talkTo opens the conversation');
ok(!pick(view,'let us build'), 'the build option is gated until the plan is learned');

/* the objective HUD already shows the active objective */
var hud = ctx.quests.activeObjectives();
ok(hud.length===1 && hud[0].n===10, 'the objective HUD shows the active objective across all quests');

/* play the branch: learn the plan, then the gated option appears and completes it */
var rt = ctx.quests.get('firsterrand');
rt.choose(pick(view,'why me?').i);          // -> because, learns plan, returns to... (node ends)
Loop.talkTo(ctx, 'firsterrand', 'hello');   // re-open the hub now that plan is known
var v2 = rt.view();
var build = pick(v2,'let us build');
ok(!!build, 'after learning the plan, the build option unlocks');
var logBefore = ctx.save.choices.length;
rt.choose(build.i);
ok(rt.state.done===true && rt.state.outcome==='COMPLETE', 'the first errand reaches COMPLETE through the branch');

/* journal + ledger reflect it */
var j = ctx.quests.journal()[0];
ok(j.done===true && j.objectives[0].status==='done', 'the journal shows the quest done and its objective completed');
ok(ctx.quests.activeObjectives().length===0, 'the objective HUD clears when the quest is done');
ok(ctx.save.choices.length > logBefore, 'the quest choices/outcome reached the choice-log (dynasty moved)');
var am = E.Generations.amalgamationModel(ctx.save);
ok(am.knows === ctx.save.choices.length, 'the Amalgamation sees the recorded quest choices');

/* SAVE -> reload -> the whole thing persists */
var blob = Loop.captureSave(ctx);
var ctx2 = Loop.boot({ saveText: blob });
var rt2 = ctx2.quests.get('firsterrand');
ok(!!rt2 && rt2.state.done===true, 'after reload the first errand is still COMPLETE');
ok(ctx2.save.choices.length === ctx.save.choices.length, 'the choice-log survived the reload intact');
ok(ctx2.quests.placements().length===1, 'the NPC binding survived the reload');

console.log('LOOP SLICE TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
