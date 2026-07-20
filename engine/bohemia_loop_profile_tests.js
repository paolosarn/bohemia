/* bohemia_loop_profile_tests.js — proves THE SOCIAL PROFILE: the phone's top-of-page
   readout (posts / quests touched / quests completed / follower reach) projected over
   the feed. The MECHANISM is here; the SCORING ("what counts as cool shit," how many
   followers a deed is worth) is an EMPTY content hook — with no scoreFn, reach is 0
   (the weight table stays empty until Paolo rules). Supplying a scoreFn proves the
   tally works. Headless: `node engine/bohemia_loop_profile_tests.js`. */
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

/* empty profile before any deeds */
var p0 = Loop.socialProfile(ctx);
ok(p0.posts===0 && p0.questsTouched===0 && p0.questsCompleted===0 && p0.reach===0, 'a fresh profile is all zeros');

/* do one quest fully (two choices + a COMPLETE) */
var a = ctx.quests.start(mkQuest('q1','First'));
a.begin('hi'); a.choose(pick(a.view(),'learn').i);
a.begin('hi'); a.choose(pick(a.view(),'finish').i);
/* and start a second quest but only make one choice (touched, not completed) */
var b = ctx.quests.start(mkQuest('q2','Second'));
b.begin('hi'); b.choose(pick(b.view(),'learn').i);

var p1 = Loop.socialProfile(ctx);
ok(p1.posts===4, 'posts counts every feed entry (3 from q1 + 1 from q2)');
ok(p1.questsTouched===2, 'questsTouched counts distinct quests appearing on the feed');
ok(p1.questsCompleted===1, 'questsCompleted counts only the quest that reached COMPLETE');

/* DEFAULT reach is 0: the weight table is EMPTY until Paolo rules on it */
ok(p1.reach===0, 'with no scoreFn, follower reach is 0 (empty content hook, MECHANISM-MINE/CONTENTS-PAOLO)');

/* supplying a scoreFn proves the tally: e.g. a placeholder where a COMPLETE is worth
   10 and any other post 1. This is a STAND-IN, not canon — Paolo owns the real rule. */
var score = function (post) { return (post.kind==='outcome' && post.outcome==='COMPLETE') ? 10 : 1; };
var p2 = Loop.socialProfile(ctx, score);
ok(p2.reach === (3*1 - 1 + 10) + 1, 'follower reach sums the supplied scoreFn over the feed');
// q1: learn(1)+finish-choice(1)+COMPLETE(10)=12 ; q2: learn(1)=1 ; total 13
ok(p2.reach === 13, 'reach math checks out (12 from the completed quest + 1 from the touched one)');

/* the profile is a pure projection: same feed -> same profile after reload */
var blob = Loop.captureSave(ctx);
var ctx2 = Loop.boot({ saveText: blob });
var p3 = Loop.socialProfile(ctx2, score);
ok(p3.posts===p2.posts && p3.reach===p2.reach && p3.questsCompleted===p2.questsCompleted,
   'the profile rebuilds identically after reload (projection of the saved feed)');

console.log('LOOP PROFILE TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
