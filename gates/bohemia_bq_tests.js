/* bohemia_bq_tests.js — regression gate for the .bq format. Runs in node. */
var BQ = require('../engine/bohemia_bq.js'), fs = require('fs');
var pass=0, fail=0;
function T(name, cond){ if(cond){pass++; console.log('  ok   '+name);} else {fail++; console.log('  FAIL '+name);} }
function v(src, world){ return BQ.validate(BQ.parse(src), world||{canCast:function(){return true;}}); }
function hasErr(r,c){ return r.errors.some(function(e){return e.code===c;}); }
function hasWarn(r,c){ return r.warnings.some(function(e){return e.code===c;}); }

console.log('\n== BQ FORMAT GATE ==');

/* 1. THE BIG ONE. No stat gates. The format cannot express them. */
T('BANNED_GATE fires on charm',
  hasErr(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY hi\n@OPT "x" [gate: charm>=50] -> END\n@END'),'BANNED_GATE'));
['paragon','renegade','karma','speech','morality','intimidate','persuasion'].forEach(function(g){
  T('BANNED_GATE fires on '+g,
    hasErr(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY hi\n@OPT "x" [gate: '+g+'>=1] -> END\n@END'),'BANNED_GATE'));
});
T('legal knowledge gate passes',
  !hasErr(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY hi\n@OPT "x" [gate: knows:agenda] -> END\n@END'),'BANNED_GATE'));

/* 2. Bethesda alias-fill gate. An unfillable REQ role fails the BUILD, not the playthrough. */
T('ALIAS_FILL fires when a REQ role cannot cast',
  hasErr(v('@QUEST q t\n@ROLE ghost REQ faction=NOPE\n@STAGE 10', {canCast:function(){return false;}}),'ALIAS_FILL'));
T('OPT role never fails the build',
  !hasErr(v('@QUEST q t\n@ROLE a REQ ok\n@ROLE maybe OPT spared=true\n@STAGE 10',
    {canCast:function(r){return r.name==='a';}}),'ALIAS_FILL'));

/* 3. Structure */
T('DEAD_LINK fires', hasErr(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY h\n@OPT "x" [gate: none] -> nowhere\n@END'),'DEAD_LINK'));
T('NODE_NO_ROLE fires', hasErr(v('@QUEST q t\n@STAGE 10\n@TALK n speaker=ghost entry=stage>=10\n@SAY h\n@END'),'NODE_NO_ROLE'));
T('DUP_NODE fires', hasErr(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY h\n@END\n@TALK n speaker=a\n@SAY h\n@END'),'DUP_NODE'));
T('ORPHAN_NODE fires (theme-in-optional, the ~18x flaw)',
  hasWarn(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n1 speaker=a entry=stage>=10\n@SAY h\n@END\n@TALK lost speaker=a\n@SAY nobody hears this\n@END'),'ORPHAN_NODE'));
T('GATE_NO_ROLE fires', hasErr(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY h\n@OPT "x" [gate: role:nobody] -> END\n@END'),'GATE_NO_ROLE'));

/* 4. NAMED-BODY LAW (Q125 F6) */
T('NAMED_BODY fires on loot in a room with a known corpse',
  hasErr(v('@QUEST q t\n@STAGE 30 #namedbody\n@LOG found them\n@DO give resources 300'),'NAMED_BODY'));
T('NAMED_BODY silent when the stage grants nothing',
  !hasErr(v('@QUEST q t\n@STAGE 30 #namedbody\n@LOG found them\n@DO play record'),'NAMED_BODY'));

/* 5. Cross-generation flags need a test (FLAW LAW 3, Q116 bugged 25 years) */
T('GEN_FLAG_TEST fires on a gen>=3 read',
  hasWarn(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY h\n@OPT "x" [gate: gen>=3] -> END\n@END'),'GEN_FLAG_TEST'));

/* 6. The removed verb (Q118/Q122/Q123/Q125) */
T('NO_NOVERB warns when nothing was left unsayable',
  hasWarn(v('@QUEST q t\n@ROLE a REQ x\n@STAGE 10\n@TALK n speaker=a entry=stage>=10\n@SAY h\n@END'),'NO_NOVERB'));

/* 7. VOICE-TO-TEXT LAW. Garbage must never crash the parser or eat the file. */
var junk = '@QUEST q t\n@ROLE a REQ x\nthis line is total nonsense from a bad transcription\n@STAGE 10\n@@@@ !!! ????\n@TALK n speaker=a entry=stage>=10\n@SAY h\n@END';
var ok=true; try{ v(junk); }catch(e){ ok=false; }
T('garbled lines never throw', ok);
T('garbled lines are preserved byte-for-byte', BQ.roundTrip(junk));
T('garbled lines are reported, not dropped', v(junk).warnings.some(function(w){return w.code==='PARSE';}));

/* 8. ROUND-TRIP on the real reference quest. Paolo's words never get eaten by the tool. */
var ref = fs.readFileSync(__dirname+'/../quests/BOHEMIA_QUEST_SAMPLE_THE_TRIBUNAL.bq.txt','utf8');
T('reference quest round-trips lossless', BQ.roundTrip(ref));
var rv = v(ref);
T('reference quest validates clean', rv.ok && rv.errors.length===0 && rv.warnings.length===0);
T('reference quest counts its branches (Q117)', rv.stats.endings===2);
T('reference quest casts against roles, zero hardcoded names', !hasWarn(rv,'HARDCODED_NAME'));
T('reference quest has silences', rv.stats.silences>0);
T('reference quest has removed verbs', rv.stats.noverbs>0);

console.log('\n  '+pass+' passed, '+fail+' failed\n');
process.exit(fail?1:0);
