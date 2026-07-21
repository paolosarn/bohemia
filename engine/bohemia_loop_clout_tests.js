/* bohemia_loop_clout_tests.js — proves THE CLOUT MECHANISM end to end: a quest
   declares how reckless its own completion was via a #hashtag on the completing
   @STAGE line (#quiet/#notable/#risky/#reckless); that tag rides from the runtime
   (state.doneTags) -> the ledger pipe (event.tags) -> the save's choice-log
   (effect.tags) -> the feed (post.clout) -> the follower math (defaultFollowerScore).
   Paolo 7/21 LOCK: "reckless/dangerous shit gets more followers than quiet good
   deeds, yes." Headless: `node engine/bohemia_loop_clout_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }

function mkQuest(id,title,cloutTag,outcomeFlag){
  outcomeFlag = outcomeFlag || 'COMPLETE';
  return ['@QUEST '+id+'  '+title, '@ACT 1',
    '@STAGE 10', '@STAGE 20 '+outcomeFlag+(cloutTag?(' #'+cloutTag):''),
    '@TALK hi speaker=x entry=stage>=10', '  @SAY hey.',
    '  @OPT "go" [gate: none] @DO set_stage 20 -> END', '@END'].join('\n');
}

var ctx = Loop.boot({ seed:'bohemia' });

/* the runtime captures the completing stage's tags verbatim (UI-agnostic; it
   knows nothing about followers) */
var rt = ctx.quests.start(mkQuest('reckq','Reckless Job','reckless'));
rt.begin('hi'); rt.choose(0);
ok(rt.state.done===true, 'quest completes');
ok((rt.state.doneTags||[]).indexOf('reckless')>=0, 'the runtime captured the #reckless tag on the completing stage');

/* the tag rides the choice-log effect */
var last = ctx.save.choices[ctx.save.choices.length-1];
ok(last.effect && Array.isArray(last.effect.tags) && last.effect.tags.indexOf('reckless')>=0,
   'the recorded choice-log effect carries the tag');

/* buildFeed surfaces it as post.clout */
var post = Loop.buildFeed(ctx)[0];
ok(post.clout==='reckless', 'the feed post is classified #reckless');

/* Loop.cloutTagFrom picks the right tag out of an arbitrary hashtag list, and
   ignores unrelated tags like #namedbody */
ok(Loop.cloutTagFrom(['namedbody','risky'])==='risky', 'cloutTagFrom finds the clout tag among unrelated hashtags');
ok(Loop.cloutTagFrom(['namedbody'])===null, 'cloutTagFrom returns null when no clout tag is present');

/* THE LOCK: reckless completions score dramatically higher than quiet ones */
var wQuiet = Loop.cloutWeight('quiet'), wNotable = Loop.cloutWeight('notable'),
    wRisky = Loop.cloutWeight('risky'), wReckless = Loop.cloutWeight('reckless'),
    wNeutral = Loop.cloutWeight(null), wUnknown = Loop.cloutWeight('made_up_tag');
ok(wReckless > wRisky && wRisky > wNotable && wNotable > wQuiet,
   'the CLOUT ordering holds: reckless > risky > notable > quiet');
ok(wReckless >= wQuiet * 3, 'reckless is not just "a bit more" than quiet — it is dramatically more (Paolo: "gets more followers")');
ok(wUnknown === wNeutral, 'an unrecognized tag falls back to the same NEUTRAL weight as no tag at all');

/* defaultFollowerScore: only OUTCOME posts earn followers; choices/events score 0 */
ok(Loop.defaultFollowerScore({kind:'outcome', clout:'reckless'}) === wReckless, 'defaultFollowerScore reads the CLOUT weight for an outcome post');
ok(Loop.defaultFollowerScore({kind:'choice'}) === 0, 'a bare choice post (not an outcome) earns 0 followers by default');
ok(Loop.defaultFollowerScore(null) === 0, 'defaultFollowerScore is safe on null/undefined');

/* socialProfile with NO scoreFn now uses the real default end to end */
var reach = Loop.socialProfile(ctx).reach;
ok(reach === wReckless, 'socialProfile with no scoreFn applies the real CLOUT weight (no more empty placeholder)');

/* a FAILED quest still posts (total recall) and still scores by its tag */
var ctx2 = Loop.boot({ seed:'bohemia' });
var failq = ctx2.quests.start(mkQuest('failq','Failed Risky Job','risky','FAIL'));
failq.begin('hi'); failq.choose(0);
ok(failq.state.outcome==='FAIL', 'the quest FAILs');
var failPost = Loop.buildFeed(ctx2)[0];
ok(failPost && failPost.outcome==='FAIL' && failPost.clout==='risky', 'a FAILed quest still posts to the feed, tagged, per total recall');
ok(Loop.socialProfile(ctx2).reach === wRisky, 'a failed-but-risky quest still earns its CLOUT weight in followers');

/* an UNTAGGED quest scores the neutral default, not zero and not a top tier */
var ctx3 = Loop.boot({ seed:'bohemia' });
var plainq = ctx3.quests.start(mkQuest('plainq','Plain Job',null));
plainq.begin('hi'); plainq.choose(0);
ok(Loop.socialProfile(ctx3).reach === wNeutral, 'an untagged quest completion scores CLOUT_NEUTRAL, not 0 and not reckless');

/* survives save/reload: the clout classification is a projection, not stored state */
var blob = Loop.captureSave(ctx);
var ctxLoaded = Loop.boot({ saveText: blob });
ok(Loop.buildFeed(ctxLoaded)[0].clout==='reckless', 'the clout tag survives save/reload (re-derived from the persisted choice-log)');

console.log('LOOP CLOUT TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
