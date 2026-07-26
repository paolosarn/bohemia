/* bohemia_quest_runtime_tests.js — proves the .bq runtime PLAYS a real quest.
   Runs the reference sample (THE TRIBUNAL) to a COMPLETE and a FAIL outcome via
   different branches, and checks gates, entry conditions, objectives, @DO effects,
   and save round-trip. Headless: `node engine/bohemia_quest_runtime_tests.js`. */
'use strict';
var fs=require('fs'), path=require('path');
var BQ=require('./bohemia_bq.js');
var RT=require('./bohemia_quest_runtime.js');

var SAMPLE=path.join(__dirname,'..','quests','BOHEMIA_QUEST_SAMPLE_THE_TRIBUNAL.bq.txt');
var TEXT=fs.readFileSync(SAMPLE,'utf8');

var pass=0, fail=0;
function ok(cond,msg){ if(cond){pass++;} else {fail++; console.log('  FAIL: '+msg);} }
function pick(view,sub){ return (view.options||[]).filter(function(o){return o.text.indexOf(sub)>=0;})[0]; }
function newRun(){ var Q=BQ.parse(TEXT); return new RT.Runtime(Q); }

/* the sample must be a valid quest to begin with */
(function(){
  var Q=BQ.parse(TEXT), v=BQ.validate(Q);
  ok(v.ok, 'sample .bq validates ('+ (v.errors[0]&&v.errors[0].msg) +')');
})();

/* T1 — start sets the first stage, casts roles, opens objective 10 */
(function(){
  var rt=newRun().start();
  ok(rt.state.stage===10,'start -> stage 10 (got '+rt.state.stage+')');
  ok(rt.state.objectives[10] && rt.state.objectives[10].status==='active','objective 10 active at start');
  ok(rt.state.roles.presiding===true,'@DO cast made presiding present');
  var av=rt.available();
  ok(av.indexOf('greeting')>=0,'greeting available at stage 10 (entry stage>=10)');
  ok(av.indexOf('plant_record')<0,'plant_record NOT available at stage 10 (entry stage>=30)');
  ok(av.indexOf('the_mail')<0,'the_mail NOT available (entry gen>=3)');
})();

/* T2 — walking greeting to the silence advances to stage 20, flips objectives */
(function(){
  var rt=newRun().start();
  rt.begin('greeting');
  var o=pick(rt.view(),'let it pass');
  ok(!!o,'greeting offers the (let it pass) silence option');
  rt.choose(o.i);
  ok(rt.state.flags.ate_it===true,'the silence option fired @DO set_flag ate_it');
  ok(rt.state.stage===20,'greeting_pass @DO set_stage 20 advanced the stage (got '+rt.state.stage+')');
  ok(rt.state.objectives[10].status==='done','objective 10 completed at stage 20');
  ok(rt.state.objectives[20] && rt.state.objectives[20].status==='active','objective 20 opened at stage 20');
})();

/* T3 — a node with multiple @DOs runs ALL of them (the parser keeps only the last;
   the runtime re-hydrates node dos). learn agenda_war must stick. */
(function(){
  var rt=newRun().start();
  rt.begin('four_warhawk');
  var o=pick(rt.view(),"I'm an argument");
  rt.choose(o.i);
  ok(rt.state.knows.agenda_war===true,'four_warhawk path taught knows:agenda_war');
})();

/* T4 — an external world trigger (reaching the plant) advances to stage 30 and
   its @DOs fire; new entry conditions open. */
(function(){
  var rt=newRun().start();
  rt.setStage(30);
  ok(rt.state.flags.knows_forebear_did_it===true,'stage 30 @DO set_flag fired');
  var av=rt.available();
  ok(av.indexOf('verdict')>=0,'verdict available at stage 30');
  ok(av.indexOf('plant_after')>=0,'plant_after available (entry flag:knows_forebear_did_it)');
})();

/* T5 — gates filter options: no record -> no "Here"; knows:agenda_war -> the name-it option shows */
(function(){
  var rt=newRun().start(); rt.setStage(30);
  rt.state.knows.agenda_war=true;
  rt.begin('verdict');
  var v=rt.view();
  ok(!pick(v,'Here'),'"Here" hidden without has:record (gate has:record)');
  ok(!!pick(v,'I found nothing'),'"I found nothing" shown (gate none)');
  ok(!!pick(v,"This isn't about her"),'name-it option shown with knows:agenda_war');
  ok(!pick(v,'Ask them'),'"Ask them" hidden (role:witness_a is an absent OPT role)');
})();

/* T6 — COMPLETE branch: with the record, "Here" -> v_file -> set_stage 40 COMPLETE */
(function(){
  var rt=newRun().start(); rt.setStage(30);
  rt.state.has.record=true;
  rt.begin('verdict');
  var o=pick(rt.view(),'Here');
  ok(!!o,'"Here" available once has:record is true');
  rt.choose(o.i);
  ok(rt.state.stage===40,'v_file advanced to stage 40');
  ok(rt.state.done===true && rt.state.outcome==='COMPLETE','stage 40 is COMPLETE -> quest done, outcome COMPLETE');
  ok(rt.state.flags.forebear_struck===true,'all of v_file\'s node @DOs ran (forebear_struck)');
  ok(rt.state.bonds.accused===-40,'v_file @DO bond accused -40 applied');
})();

/* T7 — FAIL branch: "I found nothing" -> v_lie -> set_stage 41 FAIL */
(function(){
  var rt=newRun().start(); rt.setStage(30);
  rt.begin('verdict');
  var o=pick(rt.view(),'I found nothing');
  rt.choose(o.i);
  ok(rt.state.outcome==='FAIL','v_lie -> stage 41 FAIL');
  ok(rt.state.flags.accused_exiled===true,'v_lie node @DO set_flag accused_exiled ran');
})();

/* T8 — name-it (knows-gated sub-options) reaches COMPLETE */
(function(){
  var rt=newRun().start();
  rt.begin('four_warhawk'); rt.choose(pick(rt.view(),"I'm an argument").i);
  rt.setStage(30);
  rt.begin('verdict'); rt.choose(pick(rt.view(),"This isn't about her").i);
  var v=rt.view();
  ok(!!pick(v,'wants a war'),'name-it shows the agenda_war line (knows-gated)');
  ok(!pick(v,'as stock'),'name-it hides the agenda_harvest line (not known)');
  rt.choose(pick(v,'wants a war').i);
  ok(rt.state.outcome==='COMPLETE','name-it -> v_name_it_2 -> stage 40 COMPLETE');
})();

/* T9 — quest-aware save: serialize -> load restores state exactly (the save half) */
(function(){
  var rt=newRun().start(); rt.setStage(30); rt.state.has.record=true;
  rt.begin('verdict'); rt.choose(pick(rt.view(),'Here').i);
  var blob=rt.serialize();
  var Q=BQ.parse(TEXT);
  var restored=RT.Runtime.load(Q, blob);
  ok(restored.state.outcome==='COMPLETE','save/load restores outcome');
  ok(restored.state.bonds.accused===-40,'save/load restores bonds');
  ok(restored.state.stage===40,'save/load restores stage');
})();

console.log('QUEST RUNTIME TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
