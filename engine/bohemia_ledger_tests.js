/* bohemia_ledger_tests.js — proves the two-ledger engine: the world sees everything,
   the Amalgamation sees only the recorded half, the blind spot is enforced by a
   boolean, and the finale-style win runs on coordination the machine never compiled.
   Headless: `node engine/bohemia_ledger_tests.js`. */
'use strict';
var L=require('./bohemia_ledger.js');
var SAVE=require('./bohemia_save.js');
var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }

/* default is recorded (the feed is mandatory; unrecorded is the exception) */
(function(){
  var g=new L.Ledger();
  g.record('allied_with_mob');                       // public, defaults recorded:true
  g.record('tunnel_pact', true, {recorded:false});   // off-ledger, done in the dark
  ok(g.sees('allied_with_mob'),'a default choice is recorded (machine sees it)');
  ok(!g.sees('tunnel_pact'),'an explicit recorded:false choice is NOT seen by the machine');
  ok(g.has('tunnel_pact'),'the world still knows the off-ledger choice happened');
  ok(g.hidden('tunnel_pact'),'the off-ledger choice is in the blind spot');
})();

/* the two views diverge exactly by the boolean */
(function(){
  var g=new L.Ledger();
  g.record('built_granary');                         // recorded
  g.record('cleared_block');                         // recorded
  g.record('family_promise', 'kept', {recorded:false});
  g.record('face_to_face_loyalty', 'del', {recorded:false});
  var world=g.worldView(), amalg=g.amalgamationView();
  ok(Object.keys(world).length===4,'world view holds ALL four choices');
  ok(Object.keys(amalg).length===2,'amalgamation view holds ONLY the two recorded');
  ok(amalg.built_granary===true && amalg.family_promise===undefined,'machine sees the public build, not the family promise');
  ok(g.unrecorded().length===2 && g.recorded().length===2,'recorded/unrecorded partition is clean');
})();

/* THE THESIS AS A TEST: a whisper-network win is built off-ledger; the machine never saw it */
(function(){
  var g=new L.Ledger();
  ['homeless','volunteers','elder'].forEach(function(who){
    g.record('whisper_pact_'+who, true, {recorded:false, tags:['tunnel']});
  });
  g.record('public_mayor_win');                      // loud, recorded
  ok(!g.sees('whisper_pact_homeless'),'the machine cannot see the whisper coordination');
  ok(g.hidden('whisper_pact_elder'),'the coordination sits entirely in the blind spot');
  ok(g.sees('public_mayor_win'),'the loud public win IS visible (power is loud and safe)');
  var amalg=g.amalgamationView();
  var whispered=Object.keys(amalg).some(function(k){ return k.indexOf('whisper_pact')===0; });
  ok(!whispered,'nothing whispered appears in the antagonist model — the win it never saw coming');
})();

/* accidental exposure hook: recording a previously-hidden key flips it into view */
(function(){
  var g=new L.Ledger();
  g.record('betrayal', true, {recorded:false});
  ok(g.hidden('betrayal'),'the betrayal starts off-ledger');
  g.record('betrayal', true, {recorded:true});       // a leak / a drone that should not have been there
  ok(g.sees('betrayal') && !g.hidden('betrayal'),'once compiled, the machine knows it (exposure escalation)');
})();

/* determinism + save integration: serialize -> load -> views identical, and it rides in a save blob */
(function(){
  var g=new L.Ledger();
  g.record('a'); g.record('b',1,{recorded:false}); g.record('c','x');
  var g2=L.Ledger.load(g.serialize());
  ok(JSON.stringify(g2.amalgamationView())===JSON.stringify(g.amalgamationView()),'ledger round-trips deterministically');

  // the ledger is part of the save: pack it into world state, unpack, rebuild.
  var mem={}; var store=SAVE.makeStore({get:function(k){return k in mem?mem[k]:null;},set:function(k,v){mem[k]=v;}});
  store.save('slot1', { ledger: g.serialize(), hx:1 }, {});
  var loaded=store.load('slot1');
  var g3=L.Ledger.load(loaded.world.ledger);
  ok(g3.hidden('b') && g3.sees('a'),'the ledger survives the save file intact');
})();

console.log('LEDGER TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
