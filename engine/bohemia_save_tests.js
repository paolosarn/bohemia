/* bohemia_save_tests.js — proves the save file bundles world + quest state,
   round-trips through storage, tolerates garbage, and (the real feature) lets you
   SAVE MID-QUEST and RESUME to a finish. Headless: `node engine/bohemia_save_tests.js`. */
'use strict';
var fs=require('fs'), path=require('path');
var BQ=require('./bohemia_bq.js');
var RT=require('./bohemia_quest_runtime.js');
var SAVE=require('./bohemia_save.js');

var TEXT=fs.readFileSync(path.join(__dirname,'..','quests','BOHEMIA_QUEST_SAMPLE_THE_TRIBUNAL.bq.txt'),'utf8');
var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }

/* pack/unpack world round-trip */
(function(){
  var blob=SAVE.pack({seed:42,hx:5,hy:9,min:600}, {}, {gen:1});
  var g=SAVE.unpack(blob);
  ok(g && g.world.seed===42 && g.world.hx===5,'world state round-trips through pack/unpack');
  ok(g.v===SAVE.VERSION,'version stamped');
})();

/* tolerance: never throw on junk */
(function(){
  ok(SAVE.unpack(null)===null,'unpack(null) -> null, no throw');
  ok(SAVE.unpack('{not json')===null,'unpack(garbage) -> null, no throw');
  var g=SAVE.unpack('{"v":0}');
  ok(g && typeof g.world==='object' && typeof g.quests==='object','older/partial blob returns safe empty shape');
})();

/* storage adapter round-trip via an injected in-memory mock */
(function(){
  var mem={}; var store=SAVE.makeStore({ get:function(k){return k in mem?mem[k]:null;}, set:function(k,v){mem[k]=v;} });
  ok(!store.has('slot1'),'empty slot reports has=false');
  store.save('slot1', {seed:7}, {});
  ok(store.has('slot1'),'slot present after save');
  ok(store.load('slot1').world.seed===7,'store load returns saved world');
})();

/* THE FEATURE: save mid-quest, reload, resume to COMPLETE */
(function(){
  var mem={}; var store=SAVE.makeStore({ get:function(k){return k in mem?mem[k]:null;}, set:function(k,v){mem[k]=v;} });

  // play partway: learn agenda_war, reach the plant (stage 30), pick up the record, but STOP before the verdict.
  var Q=BQ.parse(TEXT);
  var rt=new RT.Runtime(Q).start();
  rt.begin('four_warhawk'); rt.choose(pick(rt.view(),"I'm an argument").i);
  rt.setStage(30);
  rt.state.has.record=true;
  ok(rt.state.done===false,'quest is mid-flight before saving');

  // SAVE: world + this quest's state, keyed by quest id.
  var quests={}; quests[Q.id]=rt.state;
  store.save('slot1', {seed:7,hx:2,hy:3}, quests, {gen:1});

  // ...player quits. New load. Rebuild from the blob.
  var loaded=store.load('slot1');
  ok(loaded.world.hx===2,'world position restored from save');
  var Q2=BQ.parse(TEXT);
  var rt2=SAVE.restoreQuest(RT, Q2, loaded.quests[Q2.id]);
  ok(rt2.state.knows.agenda_war===true,'mid-quest knowledge (agenda_war) survived save/load');
  ok(rt2.state.stage===30,'mid-quest stage survived save/load');
  ok(rt2.state.has.record===true,'mid-quest inventory (record) survived save/load');

  // RESUME: finish the quest from the restored runtime.
  rt2.begin('verdict');
  var o=pick(rt2.view(),'Here');            // gated on has:record — must be available post-load
  ok(!!o,'the record-gated option is available after resume (gate state restored)');
  rt2.choose(o.i);
  ok(rt2.state.done===true && rt2.state.outcome==='COMPLETE','resumed quest reaches COMPLETE');
})();

/* fresh-start helper when no save exists */
(function(){
  var Q=BQ.parse(TEXT);
  var rt=SAVE.restoreQuest(RT, Q, null);
  ok(rt.state.stage===10,'restoreQuest(null) begins a fresh quest at stage 10');
})();

console.log('SAVE TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
