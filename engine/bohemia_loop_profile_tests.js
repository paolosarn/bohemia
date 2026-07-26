/* bohemia_loop_profile_tests.js — proves THE SOCIAL PROFILE: the phone's top-of-page
   readout (posts / quests touched / quests completed / follower reach) projected over
   the feed. Paolo 7/21 LOCK: reckless/dangerous deeds earn dramatically more followers
   than quiet ones. With NO scoreFn, socialProfile now uses the REAL default
   (Loop.defaultFollowerScore), which reads a completed quest's #clout hashtag
   (#quiet/#notable/#risky/#reckless) off its completing stage — untagged stages score
   NEUTRAL. A custom scoreFn still overrides it. Headless:
   `node engine/bohemia_loop_profile_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }
function pick(v,s){ return (v.options||[]).filter(function(o){return o.text.indexOf(s)>=0;})[0]; }

function mkQuest(id,title,cloutTag){
  return ['@QUEST '+id+'  '+title, '@ACT 1',
    '@STAGE 10', '@STAGE 20 COMPLETE'+(cloutTag?(' #'+cloutTag):''),
    '@TALK hi speaker=x entry=stage>=10', '  @SAY hey.',
    '  @OPT "learn" [gate: none] @DO learn k -> hi2',
    '  @OPT "finish" [gate: knows:k] @DO set_stage 20 -> END', '@END',
    '@TALK hi2 speaker=x', '  @SAY ok.', '@END'].join('\n');
}

var ctx = Loop.boot({ seed:'bohemia' });

/* empty profile before any deeds */
var p0 = Loop.socialProfile(ctx);
ok(p0.posts===0 && p0.questsTouched===0 && p0.questsCompleted===0 && p0.reach===0, 'a fresh profile is all zeros');

/* do one UNTAGGED quest fully (two choices + a COMPLETE) */
var a = ctx.quests.start(mkQuest('q1','First',null));
a.begin('hi'); a.choose(pick(a.view(),'learn').i);
a.begin('hi'); a.choose(pick(a.view(),'finish').i);
/* and start a second quest but only make one choice (touched, not completed) */
var b = ctx.quests.start(mkQuest('q2','Second',null));
b.begin('hi'); b.choose(pick(b.view(),'learn').i);

var p1 = Loop.socialProfile(ctx);
ok(p1.posts===1, 'ONE POST PER COMPLETED QUEST: q1 completed => 1 post (q2 only touched)');
ok(p1.posts===p1.questsCompleted, 'posts == quests done (Paolo 7/20)');
ok(p1.questsTouched===2, 'questsTouched still counts every quest engaged (from the full log)');
ok(p1.questsCompleted===1, 'questsCompleted counts only the quest that reached COMPLETE');

/* DEFAULT reach is now REAL (Paolo 7/21 LOCK), not empty: an untagged completion
   scores CLOUT_NEUTRAL with no scoreFn supplied at all. */
ok(p1.reach === Loop.cloutWeight(null), 'with NO scoreFn, an untagged completion scores CLOUT_NEUTRAL by default');

/* a custom scoreFn still overrides the default entirely */
var score = function (post) { return (post.kind==='outcome' && post.outcome==='COMPLETE') ? 10 : 1; };
var p2 = Loop.socialProfile(ctx, score);
ok(p2.reach === 10, 'a supplied scoreFn overrides the default and sums over the POSTS only');

/* RECKLESS completions score dramatically more than QUIET ones (the actual lock) */
var ctxR = Loop.boot({ seed:'bohemia' });
var quiet = ctxR.quests.start(mkQuest('quietq','Quiet One','quiet'));
quiet.begin('hi'); quiet.choose(pick(quiet.view(),'learn').i);
quiet.begin('hi'); quiet.choose(pick(quiet.view(),'finish').i);
var afterQuiet = Loop.socialProfile(ctxR).reach;

var reckless = ctxR.quests.start(mkQuest('recklessq','Reckless One','reckless'));
reckless.begin('hi'); reckless.choose(pick(reckless.view(),'learn').i);
reckless.begin('hi'); reckless.choose(pick(reckless.view(),'finish').i);
var afterReckless = Loop.socialProfile(ctxR).reach;
var recklessGain = afterReckless - afterQuiet;

ok(recklessGain > afterQuiet, 'a single #reckless completion earns MORE followers than an entire #quiet one (Paolo 7/21 lock)');
ok(Loop.cloutWeight('reckless') > Loop.cloutWeight('risky') &&
   Loop.cloutWeight('risky') > Loop.cloutWeight('notable') &&
   Loop.cloutWeight('notable') > Loop.cloutWeight('quiet'),
   'the full CLOUT ordering holds: reckless > risky > notable > quiet');

/* the profile is a pure projection: same feed -> same profile after reload */
var blob = Loop.captureSave(ctx);
var ctx2 = Loop.boot({ saveText: blob });
var p3 = Loop.socialProfile(ctx2, score);
ok(p3.posts===p2.posts && p3.reach===p2.reach && p3.questsCompleted===p2.questsCompleted,
   'the profile rebuilds identically after reload (projection of the saved feed)');

console.log('LOOP PROFILE TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
