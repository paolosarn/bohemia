/* bohemia_loop_quests_tests.js — proves the .bq quest runtime is a first-class
   citizen of the GameContext: any part of the game can pull a quest off ctx.quests
   at any time, play it, and an in-flight quest rides the save and resumes on reboot.
   Headless: `node engine/bohemia_loop_quests_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');

var Q = [
 '@QUEST loopq  Loop Quest',
 '@ACT 1', '@ONCE false',
 '@ROLE k REQ is=demo',
 '@STAGE 10', '  @DO show_objective 10',
 '@STAGE 20 COMPLETE', '  @LOG done',
 '@OBJ 10 "finish the loop quest"',
 '@TALK start speaker=k entry=stage>=10',
 '  @SAY pull me off the context.',
 '  @OPT "learn the key"   [gate: none]        -> learn',
 '  @OPT "finish"          [gate: knows:key]   -> fin',
 '@END',
 '@TALK learn speaker=k', '  @SAY here is the key.', '  @DO learn key', '@END',
 '@TALK fin speaker=k', '  @DO set_stage 20', '@END'
].join('\n');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }

/* the quest system is pullable from the booted context */
var ctx = Loop.boot({ seed:'bohemia' });
ok(ctx.ready===true, 'loop boots ready');
ok(!!ctx.quests, 'ctx.quests exists (quest system is a context citizen)');
ok(typeof ctx.quests.start==='function', 'ctx.quests.start is callable');

/* start a quest THROUGH the context and play it partway */
var rt = ctx.quests.start(Q);
ok(!!rt && rt.state.stage===10, 'started a quest via ctx.quests, at stage 10');
ok(ctx.quests.get('loopq')===rt, 'the same runtime is pullable again via ctx.quests.get (any time)');
rt.begin('start');
ok(!!pick(rt.view(),'learn the key'), 'the learn option is offered');
ok(!pick(rt.view(),'finish'), 'the finish option is gated off (knows:key not yet true)');

/* SAVE mid-quest through the loop, reboot, and RESUME */
var blob = Loop.captureSave(ctx);
ok(typeof blob==='string' && blob.length>0, 'captureSave produced a save blob');
var ctx2 = Loop.boot({ saveText: blob });
var rt2 = ctx2.quests.get('loopq');
ok(!!rt2, 'the in-flight quest was restored from the save on reboot');
ok(rt2 && rt2.state.stage===10 && !rt2.state.knows.key, 'resumed mid-quest with exact state (stage 10, key not learned)');

/* finish it on the resumed runtime, from the context */
rt2.begin('start'); rt2.choose(pick(rt2.view(),'learn the key').i);   // learn key
rt2.begin('start');
var fin = pick(rt2.view(),'finish');
ok(!!fin, 'after learning, the gated finish option appears on resume');
rt2.choose(fin.i);
ok(rt2.state.done===true && rt2.state.outcome==='COMPLETE', 'the resumed quest reaches COMPLETE');

/* ONCE LAW: a completed one-time quest (@ONCE defaults true) never restarts;
   re-calling start hands back the finished runtime. A @ONCE false quest is
   repeatable and starts fresh. */
var ctx3 = Loop.boot({ seed:'bohemia' });
var ONCEQ = ['@QUEST onceq Once Quest','@ACT 1','@STAGE 10','@STAGE 20 COMPLETE',
  '@TALK s speaker=x entry=stage>=10','  @OPT "end" [gate: none] @DO set_stage 20 -> END','@END'].join('\n');
var oq = ctx3.quests.start(ONCEQ);
oq.begin('s'); oq.choose(0);
ok(oq.state.done===true, 'once quest completed');
var oq2 = ctx3.quests.start(ONCEQ);
ok(oq2===oq && oq2.state.done===true, 'restarting a completed @ONCE quest returns the finished runtime (no reset)');

var REPEATQ = ['@QUEST repeatq Repeat Quest','@ACT 1','@ONCE false','@STAGE 10','@STAGE 20 COMPLETE',
  '@TALK s speaker=x entry=stage>=10','  @OPT "end" [gate: none] @DO set_stage 20 -> END','@END'].join('\n');
var rq = ctx3.quests.start(REPEATQ);
rq.begin('s'); rq.choose(0);
ok(rq.state.done===true, 'repeatable quest completed once');
var rq2 = ctx3.quests.start(REPEATQ);
ok(rq2!==rq && rq2.state.done===false && rq2.state.stage===10, 'restarting a @ONCE false quest gives a fresh run');

console.log('LOOP QUESTS TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
