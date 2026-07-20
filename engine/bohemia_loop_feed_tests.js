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
ok(feed.length===3, 'three posts on the feed (two choices + one outcome)');
ok(feed.every(function(p){return p.questId==='feedq';}), 'every post is attributed to the quest');
ok(feed.some(function(p){return p.kind==='outcome' && p.outcome==='COMPLETE';}), 'the completion is a post');
ok(feed.some(function(p){return p.kind==='choice';}), 'the choices are posts');
ok(feed[0].title==='Phone Errand', 'posts are enriched with the live quest title');

/* newest-first ordering: the outcome (last, highest beat/seq) is at or near the top */
var seqs = feed.map(function(p){return p.seq;});
ok(seqs[0] >= seqs[seqs.length-1], 'the feed is newest-first (descending order)');

/* an in-person deed lands on the feed too (total recall) */
var before = Loop.buildFeed(ctx).length;
ctx.quests.place(mkQuest('homelessq','Tunnel Favor'), { x:5,y:5, speaker:'kinghobo', channel:'inperson' });
var hq = ctx.quests.get('homelessq');
hq.begin('hi'); hq.choose(pick(hq.view(),'learn').i);
hq.begin('hi'); hq.choose(pick(hq.view(),'finish').i);
var feed2 = Loop.buildFeed(ctx);
ok(feed2.length > before, 'the in-person deed also posts to the feed (total recall)');
ok(feed2.some(function(p){return p.questId==='homelessq' && p.kind==='outcome';}), 'the in-person quest completion is on the feed');

/* limit option for a HUD peek at the latest N */
ok(Loop.buildFeed(ctx,{limit:2}).length===2, 'buildFeed honors a limit (latest N for a HUD peek)');

/* the feed survives save/reload (it is a projection of the persisted choice-log) */
var blob = Loop.captureSave(ctx);
var ctx2 = Loop.boot({ saveText: blob });
ok(Loop.buildFeed(ctx2).length === feed2.length, 'the feed rebuilds identically after reload (projection of the saved log)');

console.log('LOOP FEED TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
