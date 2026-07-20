/* bohemia_loop_channel_tests.js — proves the QUEST ACQUISITION CHANNEL (Paolo 7/20):
   a 'feed' quest can be picked up over the phone (it shows in feedOffers regardless
   of distance); an 'inperson' quest (the phoneless, like the homeless) is NOT on the
   phone at all and can only be gotten by PULLING UP on them (talkablesNear when
   adjacent). Total recall still holds: finishing an in-person quest still records to
   the feed. Headless: `node engine/bohemia_loop_channel_tests.js`. */
'use strict';
var Loop  = require('./bohemia_loop.js');
var Sched = require('./bohemia_scheduler.js');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function has(list,id){ return list.some(function(x){return x.questId===id;}); }

function mkQuest(id, title){
  return ['@QUEST '+id+'  '+title, '@ACT 1', '@STAGE 10', '@STAGE 20 COMPLETE',
    '@TALK hi speaker=x entry=stage>=10', '  @SAY hey.',
    '  @OPT "do it" [gate: none] @DO set_stage 20 -> END', '@END'].join('\n');
}

var ctx = Loop.boot({ seed:'bohemia' });

/* a FEED quest and an IN-PERSON quest, both bound far from the player */
ctx.quests.place(mkQuest('feedq','Phone Errand'),    { x:200, y:200, speaker:'trader',  channel:'feed' });
ctx.quests.place(mkQuest('homelessq','Tunnel Favor'),{ x:210, y:210, speaker:'kinghobo', channel:'inperson' });
ok(ctx.quests.placements().length===2, 'both quests placed');

/* default channel is 'feed' when unspecified (most quests come over the phone, GDD v2 sec18) */
ctx.quests.place(mkQuest('defq','Default'), { x:5, y:5, speaker:'n' });
ok(ctx.quests.placements().filter(function(p){return p.questId==='defq';})[0].channel==='feed', 'channel defaults to feed');

/* THE FEED OFFERS: over the phone you see the feed quest, NEVER the in-person one */
var offers = ctx.quests.feedOffers();
ok(has(offers,'feedq'), 'the feed quest shows in the feed offers (pick it up over the phone, any distance)');
ok(!has(offers,'homelessq'), 'the in-person (phoneless) quest is NOT in the feed offers (cannot get it over the phone)');

/* the homeless quest is only reachable by PULLING UP on them in person */
ok(Loop.talkablesNear(ctx, 200, 200, 1).length>=0, 'talkablesNear is callable'); // sanity
var player = Sched.makeActor({ id:'player', tile:{x:210,y:211}, isPlayer:true, layer:'player' });
Sched.addActor(ctx.scheduler, player);
var near = Loop.talkablesNear(ctx, 210, 211, 1);   // standing right next to the king hobo
ok(has(near,'homelessq'), 'pulling up on the phoneless NPC in person offers their quest (the talk-trigger)');

/* and a feed NPC can ALSO be talked to in person if you happen to be next to them */
var near2 = Loop.talkablesNear(ctx, 201, 200, 1);
ok(has(near2,'feedq'), 'a feed NPC is still talkable in person too (feed = also on the phone, not instead)');

/* TOTAL RECALL: finishing the in-person homeless quest still lands on the feed */
var before = ctx.save.choices.length;
var rt = ctx.quests.get('homelessq');
rt.begin('hi'); rt.choose(0);
ok(rt.state.done===true, 'the in-person quest completes');
ok(ctx.save.choices.length > before, 'the in-person deed is still remembered on the feed (total recall; you posted about it)');

/* once done, it drops out of any offer surface */
ok(!has(ctx.quests.feedOffers(),'homelessq'), 'a completed quest is not re-offered');
ok(ctx.quests.journal().filter(function(j){return j.id==='homelessq';})[0].channel==='inperson', 'the journal records the acquisition channel');

console.log('LOOP CHANNEL TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
