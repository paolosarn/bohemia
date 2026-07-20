/* bohemia_loop_ledger_tests.js — proves THE LEDGER PIPE: a quest played through
   ctx.quests actually feeds the engine's choice-log (Save.recordChoice), so quest
   outcomes move the fold + the Amalgamation's knowledge instead of dying inside
   the runtime. Mechanism only: every event defaults recorded:true; the pipe
   forwards evt.recorded so the secret-choice policy (recorded:false) can be wired
   later WITHOUT touching the pipe. Headless: `node engine/bohemia_loop_ledger_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');
var E    = require('./bohemia_engine.js');

var Q = [
 '@QUEST ledgerq  Ledger Quest',
 '@ACT 1', '@ONCE false',
 '@ROLE k REQ is=demo',
 '@STAGE 10', '  @DO show_objective 10',
 '@STAGE 20 COMPLETE', '  @LOG done',
 '@OBJ 10 "make a choice that the ledger sees"',
 '@TALK start speaker=k entry=stage>=10',
 '  @SAY choose.',
 '  @OPT "learn the key"  [gate: none]       -> learn',
 '  @OPT "finish"         [gate: knows:key]  -> fin',
 '@END',
 '@TALK learn speaker=k', '  @SAY here.', '  @DO learn key', '@END',
 '@TALK fin speaker=k', '  @DO set_stage 20', '@END'
].join('\n');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }
function ids(save){ return (save.choices||[]).map(function(c){return c.id;}); }

/* boot a real context — the ledger sink is bound inside bootQuests */
var ctx = Loop.boot({ seed:'bohemia' });
ok(ctx.ready===true, 'loop boots ready');
ok(Array.isArray(ctx.save.choices) && ctx.save.choices.length===0, 'choice-log starts empty');

/* play a quest THROUGH the context and make a choice */
var rt = ctx.quests.start(Q);
ok(!!rt && rt.state.stage===10, 'quest started via ctx.quests at stage 10');
rt.begin('start');
rt.choose(pick(rt.view(),'learn the key').i);   // the learn choice

ok(ctx.save.choices.length===1, 'the quest choice landed in the engine choice-log (the pipe fired)');
ok(ids(ctx.save).indexOf('quest:ledgerq:start:0')>=0, 'the recorded choice is keyed to quest:node:choice');
ok(ctx.save.choices[0].recorded===true, 'mechanism default: the choice is recorded:true');
ok(ctx.save.choices[0].effect && ctx.save.choices[0].effect.quest==='ledgerq', 'the choice carries its quest effect');

/* drive it to COMPLETE and confirm the OUTCOME is recorded too */
rt.begin('start');
var fin = pick(rt.view(),'finish');
ok(!!fin, 'the gated finish option appears after learning the key');
rt.choose(fin.i);
ok(rt.state.done===true && rt.state.outcome==='COMPLETE', 'the quest reaches COMPLETE');
ok(ids(ctx.save).indexOf('quest:ledgerq:complete')>=0, 'the COMPLETE outcome is recorded to the choice-log');

/* the outcome must fire exactly ONCE, not on every later interaction */
var completeCount = ids(ctx.save).filter(function(x){return x==='quest:ledgerq:complete';}).length;
ok(completeCount===1, 'the outcome is recorded exactly once (no double-fire)');

/* the fold + the Amalgamation actually SEE these recorded choices now */
var am = E.Generations.amalgamationModel(ctx.save);
ok(am.knows === ctx.save.choices.length, 'the Amalgamation knows every recorded quest choice (fold sees the ledger)');
ok(am.blindSpot === 0, 'no secret choices yet, so the Amalgamation has no blind spot');

/* the pipe survives save/reload: a RESTORED quest still feeds the ledger */
var blob = Loop.captureSave(ctx);
var ctx2 = Loop.boot({ saveText: blob });
var before = ctx2.save.choices.length;
var Q2 = [
 '@QUEST ledgerq2  Second Ledger Quest', '@ACT 1', '@ONCE false',
 '@ROLE k REQ is=demo', '@STAGE 10', '@STAGE 20 COMPLETE',
 '@TALK start speaker=k entry=stage>=10', '  @SAY hi.',
 '  @OPT "go"  [gate: none]  -> END', '@END'
].join('\n');
var rt2 = ctx2.quests.start(Q2);
rt2.begin('start'); rt2.choose(pick(rt2.view(),'go').i);
ok(ctx2.save.choices.length === before+1, 'a quest played after reload still records through the rebound pipe');

/* MECHANISM PROOF: the pipe forwards evt.recorded, so a secret-choice policy is a
   one-line hookup at the sink and never a change to the pipe. Prove the sink honors
   recorded:false by calling a manager built with a policy sink directly. */
var seen=[];
var mgr = Loop.makeQuestManager({ record:function(evt){
  // stand-in policy: a 'silence' option is a secret (recorded:false). NOT wired in
  // the real bootQuests — that classification is Paolo's call — but proves the pipe
  // carries the flag faithfully.
  seen.push({ kind:evt.kind, recorded: evt.silence ? false : evt.recorded });
}});
var Q3 = [
 '@QUEST ledgerq3  Silent Choice', '@ACT 1', '@ONCE false',
 '@ROLE k REQ is=demo', '@STAGE 10',
 '@TALK start speaker=k entry=stage>=10', '  @SAY psst.',
 '  @OPT "keep it quiet" SILENCE [gate: none] -> END', '@END'
].join('\n');
var rt3 = mgr.start(Q3); rt3.begin('start'); rt3.choose(rt3.view().options[0].i);
ok(seen.length>=1 && seen[0].recorded===false, 'the pipe faithfully forwards a recorded:false event (policy stays swappable at the sink)');

console.log('LOOP LEDGER TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
