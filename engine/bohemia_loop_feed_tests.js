/* bohemia_loop_feed_tests.js — proves THE FEED: the master window over the recorded
   choice-log. Every deed you do (feed quest or in-person quest) becomes a post,
   newest-first, because of TOTAL RECALL. Pure projection over save.choices; it
   authors nothing and computes no follower math. Headless:
   `node engine/bohemia_loop_feed_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }

function mkQuest(id,title){
  return ['@QUEST '+id+'  '+title, '@ACT 1', '@STAGE 10', '@STAGE 20 COMPLETE',
    '@TALK hi speaker=x entry=stage>=10', '  @SAY hey.',
    '  @OPT "learn" [gate: none] @DO learn k -> hi2',
    '  @OPT "finish" [gate: knows:k] @DO set_stage 20 -> END', '@END',
    '@TALK hi2 speaker=x', '  @SAY ok.', '@END'].join('\n');
}

var ctx = Loop.boot({ seed:'bohemia' });
ok(Loop.buildFeed(ctx).length===0, 'the feed starts empty (no deeds yet)');

/* play a feed quest to completion: choice + outcome posts appear */
var rt = ctx.quests.start(mkQuest('feedq','Phone Errand'));
rt.begin('hi'); rt.choose(pick(rt.view(),'learn').i);   // a choice post
rt.begin('hi'); rt.choose(pick(rt.view(),'finish').i);  // a choice post + a COMPLETE outcome post

var feed = Loop.buildFeed(ctx);
/* ONE POST PER COMPLETED QUEST (Paolo 7/20): finishing feedq made exactly ONE post */
ok(feed.length===1, 'one post per completed quest (not one per choice)');
ok(feed[0].kind==='outcome' && feed[0].outcome==='COMPLETE', 'the post IS the completion');
ok(feed[0].questId==='feedq' && feed[0].title==='Phone Errand', 'the post is the quest, titled');

/* the granular per-choice record still exists for the fold when asked via {all} */
ok(Loop.buildFeed(ctx,{all:true}).length===3, 'the choice-level record is still there ({all}: 2 choices + 1 outcome)');

/* an in-person completed quest is also one post */
var before = Loop.buildFeed(ctx).length;
ctx.quests.place(mkQuest('homelessq','Tunnel Favor'), { x:5,y:5, speaker:'kinghobo', channel:'inperson' });
var hq = ctx.quests.get('homelessq');
hq.begin('hi'); hq.choose(pick(hq.view(),'learn').i);
hq.begin('hi'); hq.choose(pick(hq.view(),'finish').i);
var feed2 = Loop.buildFeed(ctx);
ok(feed2.length === before+1, 'the in-person completion adds exactly one post');
ok(feed2.some(function(p){return p.questId==='homelessq' && p.kind==='outcome';}), 'the in-person quest completion is on the feed');
ok(feed2.length===2, 'two completed quests => two posts (posts == quests done)');

/* limit option for a HUD peek at the latest N */
ok(Loop.buildFeed(ctx,{limit:1}).length===1, 'buildFeed honors a limit (latest N for a HUD peek)');

/* the feed survives save/reload (it is a projection of the persisted choice-log) */
var blob = Loop.captureSave(ctx);
var ctx2 = Loop.boot({ saveText: blob });
ok(Loop.buildFeed(ctx2).length === feed2.length, 'the feed rebuilds identically after reload (projection of the saved log)');

console.log('LOOP FEED TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
