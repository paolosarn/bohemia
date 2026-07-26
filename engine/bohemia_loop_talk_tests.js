/* bohemia_loop_talk_tests.js — proves THE TALK-TRIGGER: the join between the
   walkable world and the quest system. A quest bound to an NPC's tile is only
   offer-able when the player is step-adjacent AND the quest's own entry condition
   holds; beginning it through the trigger plays the runtime and feeds the ledger;
   the NPC binding rides the save. Headless: `node engine/bohemia_loop_talk_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');

var Q = [
 '@QUEST talkq  Talk Quest',
 '@ACT 1', '@ONCE false',
 '@ROLE k REQ is=demo',
 '@STAGE 10',
 '@STAGE 20 COMPLETE',
 '@TALK hello speaker=k entry=stage>=10',
 '  @SAY step up and talk.',
 '  @OPT "hear him out"  [gate: none]  -> END',
 '  @OPT "finish"        [gate: knows:key]  @DO set_stage 20 -> END',
 '@END'
].join('\n');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }

var ctx = Loop.boot({ seed:'bohemia' });
ok(ctx.ready===true, 'loop boots ready');

/* place a quest on an NPC at (100,100) */
var placed = ctx.quests.place(Q, { x:100, y:100, layer:'npc', speaker:'k' });
ok(!!placed && placed.questId==='talkq', 'a quest can be bound to an NPC tile via ctx.quests.place');
ok(!!ctx.quests.get('talkq'), 'placing starts the quest so it is live and pullable');

/* far away: nothing to talk to */
var far = Loop.talkablesNear(ctx, 0, 0, 1);
ok(far.length===0, 'no talkable when the player is far from the NPC');

/* adjacent: the talk node is offered */
var near = Loop.talkablesNear(ctx, 101, 100, 1);
ok(near.length===1 && near[0].node==='hello', 'step-adjacent, the NPC offers its talk node');
ok(near[0].speaker==='k' && near[0].dist===1, 'the talkable carries its speaker and chebyshev distance');

/* standing ON the tile also counts (dist 0) */
ok(Loop.talkablesNear(ctx, 100, 100, 1).length===1, 'standing on the NPC tile also offers the talk');

/* begin THROUGH the trigger and confirm we get the runtime view */
var view = Loop.talkTo(ctx, 'talkq', 'hello');
ok(!!view && view.speaker==='k' && view.options.length>=1, 'talkTo begins the node and returns the speaker view');
ok(!pick(view,'finish'), 'the finish option is gated off (knows:key not yet true)');

/* choosing through the trigger feeds the ledger (the pipe from the prior brick) */
var beforeLog = ctx.save.choices.length;
ctx.quests.get('talkq').choose(pick(view,'hear him out').i);
ok(ctx.save.choices.length===beforeLog+1, 'a choice made after a talk-trigger still records to the choice-log');

/* the NPC binding survives save/reload: reload, and the placement is still there */
var blob = Loop.captureSave(ctx);
var ctx2 = Loop.boot({ saveText: blob });
ok(ctx2.quests.placements().length===1, 'the NPC binding rode the save (placement restored)');
var near2 = Loop.talkablesNear(ctx2, 100, 100, 1);
ok(near2.length===1 && near2[0].node==='hello', 'after reload the restored NPC still offers its talk node');

/* a FINISHED quest offers nothing (the trigger goes quiet when done) */
var rt2 = ctx2.quests.get('talkq');
rt2.setStage(20);   // drive to COMPLETE
ok(rt2.state.done===true, 'quest driven to COMPLETE on the reloaded runtime');
ok(Loop.talkablesNear(ctx2, 100, 100, 1).length===0, 'a completed quest is no longer talkable (trigger falls silent)');

console.log('LOOP TALK TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
