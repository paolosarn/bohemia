/* ============================================================================
   BOHEMIA WEIGHTS SHAPE (9/22/26, PEOPLE lane).
   VAMILY [weights shape], row WHAT-PEOPLE-REPEAT-ABOUT-YOU. Under the rule 18
   hold, with the RULE 22 cook riding beside it.

   RULED BY THE COORDINATOR 9/5 (correct-after, off the research; Paolo may
   overrule): "people repeat a HANDFUL of things about a stranger and nothing
   else: did you hurt someone, did you steal, did you help someone who needed
   it, did you keep your word, did you pay what you owed. Everything else in the
   82-row deed table weighs near zero. A betrayal is worth about five kindnesses,
   it is remembered longer, and it travels further."

   *** MEASURED FIRST, AND THE TABLE IS NOT THE TABLE THE RULING IS ABOUT. ***
   bohemia_standing ships DEED_WEIGHT empty; bohemia_deeds fills it from his own
   .bq files and the count is 83, not 82 (he kept writing). ALL 83 ROWS ARE
   SHAPED q:<quest>:<stage>@<FACTION>. Not one is a thing a person does on the
   street, and THE SEVEN KINDS THE STREET ACTUALLY PUBLISHES ARE NOT IN IT AT
   ALL. The organ says what that means in its own words: "unruled deed =
   weightless".

   *** AND THE CONTROL COST A TRY, AGAIN. *** The first control called witness()
   with six arguments; its signature takes eight, so `where` was undefined,
   nobody witnessed anything and the opinion read 0 either way. That is not
   evidence, it is a broken instrument reading zero twice. With the right
   signature: no row gives 0 now and 0 after twenty-one days; a row of -2.5
   gives -2.50 now, -1.95 at twenty-one days, and the rung reads COLD.

   WHAT THIS HOLDS:
   A. the shape is his ratio and nothing else was picked
   B. the two things the street cannot see are named, not faked
   C. on the real standing organ: the five bite, the rest do not, and the
      ratio holds to the decimal
   D. how long and how far: one is free off the weight, one is backwards today
   E. the cook is in the VOTE tab
   F. rule 18: nothing on the play surface, and his 83 rows are never overwritten

   node gates/weights_shape_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const MOD = path.join(ROOT, 'tools/bohemia_weights.js');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_WHAT_PEOPLE_REPEAT_ABOUT_YOU_9_22_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_WEIGHTS_SHAPE_9_22_26.txt');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(t, v) { notes.push('  NOTE  ' + t + (v == null ? '' : '   ' + v)); }

const S = require(path.join(ROOT, 'engine/bohemia_standing.js'));
const D = require(path.join(ROOT, 'engine/bohemia_deeds.js'));
const W = require(MOD);
const src = fs.readFileSync(MOD, 'utf8');

/* ========================================================================== */
head('A. THE SHAPE IS HIS RATIO AND NOTHING ELSE WAS PICKED');
/* ========================================================================== */
probe('the module loads and hands back rows', typeof W.rows === 'function');
ok('*** THE ONLY NUMBER IS HIS: a betrayal is worth about five kindnesses. ***'
   + ' Everything else is derived from it rather than typed',
   W.RATIO.betrayalIsWorth === 5
   && Math.abs(Math.abs(W.BETRAYAL) / W.KIND - 5) < 1e-9,
   'one betrayal is ' + (Math.abs(W.BETRAYAL) / W.KIND) + ' kindnesses');
ok('and it is tagged draft:true, because he has ruled on none of it',
   W.RATIO.draft === true);
ok('the betrayal is derived, not written down twice',
   /BETRAYAL = -\(RATIO\.kindness \* RATIO\.betrayalIsWorth\)/.test(src));
ok('*** AND THE UNIT IS ARGUED FROM THE RUNG LADDER, NOT PICKED: *** one kindness '
   + 'must not move you a rung and one betrayal must',
   (function () {
     const r = S.rungFor.bind(S);
     return r(W.KIND) === 'NEUTRAL' && r(W.BETRAYAL) !== 'NEUTRAL';
   })(), 'one kindness reads ' + S.rungFor(W.KIND)
       + ', one betrayal reads ' + S.rungFor(W.BETRAYAL));
ok('the five he named are all there, in his words', W.FIVE.length === 5
   && W.FIVE.map(f => f.say).join('|')
      === ['did you hurt someone', 'did you steal',
           'did you help someone who needed it', 'did you keep your word',
           'did you pay what you owed'].join('|'));
ok('*** AND THE OTHER HALF OF THE RULING IS THERE TOO: everything else weighs '
   + 'nothing ***, with a reason written on each one so the next lane through '
   + 'does not read a zero as an oversight and "fix" it',
   W.ZERO.length >= 3 && W.ZERO.every(z => z.kind && z.why && z.why.length > 20));
ok('this file names no faction and no person', !/@[A-Z]{3,}|Marisela|Rosa/.test(src));

/* ========================================================================== */
head('B. WHAT THE STREET CANNOT SEE IS NAMED, NOT FAKED');
/* ========================================================================== */
ok('*** TWO OF HIS FIVE HAVE NO DEED KIND AT ALL, and they are named rather than '
   + 'given an invented one ***, because making up a kind so a table looks full '
   + 'is how a system starts lying',
   W.MISSING.length === 2
   && W.MISSING.some(m => /steal/i.test(m.say))
   && W.MISSING.some(m => /help/i.test(m.say)));
ok('and the missing ones really are missing from the rows',
   !Object.keys(W.rows()).some(k => /steal|help/i.test(k)));
ok('every row the module hands back is a kind the walked city really publishes',
   (function () {
     const city = fs.readFileSync(CITY, 'utf8');
     return Object.keys(W.rows()).every(k => city.indexOf("'" + k + "'") > 0);
   })(), Object.keys(W.rows()).join(', '));

/* ========================================================================== */
head('C. ON THE REAL STANDING ORGAN');
/* ========================================================================== */
const srcs = fs.readdirSync(path.join(ROOT, 'quests/bq'))
  .filter(f => f.endsWith('.bq'))
  .map(f => ({ id: f.replace(/\.bq$/, ''),
               src: fs.readFileSync(path.join(ROOT, 'quests/bq', f), 'utf8') }));
const corpus = D.loadCorpus(srcs);
const questRows = Object.keys(S.DEED_WEIGHT).length;
note('his authored table', questRows + ' rows from ' + srcs.length + ' quest files');
probe('his quest corpus really loaded, so nothing below is an empty pass',
      questRows > 50 && corpus.count === questRows);
ok('*** EVERY ONE OF HIS ROWS IS A QUEST STEP TAGGED FOR A FACTION, *** which is '
   + 'why the ruling could not be applied to it: it is not a table of deeds',
   Object.keys(S.DEED_WEIGHT).every(k => /^q:.+:\d+@/.test(k)));
const CITY_KINDS = ['claim:met', 'claim:refused', 'commit', 'favour',
                    'loan:short', 'spared', 'downed'];
ok('*** AND NOT ONE OF THE SEVEN KINDS THE STREET PUBLISHES IS IN IT. *** The '
   + 'organ calls that weightless in its own words, so the whole machine is '
   + 'built, working, and grading nothing',
   CITY_KINDS.every(k => !(k in S.DEED_WEIGHT)));

/* THE CONTROL, WITH THE RIGHT SIGNATURE. witness(minds, turn, actorId, kind,
   x, y, where, opts) takes EIGHT arguments; the first cut of this passed six,
   so `where` was undefined, nobody witnessed and it read zero either way. */
const where = () => ({ x: 0, y: 0 });
function feel(kind, w, at) {
  if (w === null) delete S.DEED_WEIGHT[kind]; else S.DEED_WEIGHT[kind] = w;
  const minds = [{ owner: 'm1', deeds: [] }, { owner: 'm2', deeds: [] }];
  const saw = S.witness(minds, 100, '@', kind, 0, 0, where, {});
  return { saw: saw, val: S.opinionOf(minds[0], '@', 100 + (at || 0)) };
}
const noRow = feel('downed', null, 0);
const noRowLater = feel('downed', null, 30240);
probe('people really witnessed it, so a zero below is about the weight and not '
      + 'about an empty room', noRow.saw === 2 && noRowLater.saw === 2);
ok('*** THE CONTROL: WITH NO ROW, TWO PEOPLE WATCH YOU PUT SOMEBODY DOWN AND IT '
   + 'MOVES NOTHING, NOW OR IN THREE WEEKS ***',
   noRow.val === 0 && noRowLater.val === 0);

const applied = W.apply(S.DEED_WEIGHT);
note('the shape applied', applied.added + ' rows added, ' + applied.keptTheirs
     + ' of his overwritten');
ok('*** AND HIS 83 ROWS ARE NEVER OVERWRITTEN ***, because they are his authored '
   + 'faction deltas and this row is about a different table',
   applied.keptTheirs === 0
   && Object.keys(S.DEED_WEIGHT).length === questRows + applied.added);

function after(kind, mins) {
  const minds = [{ owner: 'm1', deeds: [] }];
  S.witness(minds, 100, '@', kind, 0, 0, where, {});
  return S.opinionOf(minds[0], '@', 100 + mins);
}
const hurt = after('downed', 0), kept = after('claim:met', 0);
note('one bad thing', hurt.toFixed(2) + ' -> ' + S.rungFor(hurt));
note('one good thing', kept.toFixed(2) + ' -> ' + S.rungFor(kept));
ok('*** ONE BAD THING AND THE STREET GOES COLD ON YOU ***',
   hurt === W.BETRAYAL && S.rungFor(hurt) === 'COLD');
ok('and one good thing barely registers, which is the finding and not a bug',
   kept === W.KIND && S.rungFor(kept) === 'NEUTRAL');
ok('breaking a debt costs exactly what hurting somebody costs, because it is the '
   + 'same broken promise', after('loan:short', 0) === W.BETRAYAL);
ok('*** AND FIVE GOOD THINGS CANCEL ONE BAD ONE, TO THE DECIMAL ***',
   Math.abs(5 * W.KIND + W.BETRAYAL) < 1e-9);
ok('while the things that say nothing about you really do move nothing',
   after('commit', 0) === 0 && after('favour', 0) === 0
   && after('claim:refused', 0) === 0);

/* ========================================================================== */
head('D. HOW LONG, AND HOW FAR');
/* ========================================================================== */
const hlBad = S.deedHalflife(W.BETRAYAL) / 1440, hlGood = S.deedHalflife(W.KIND) / 1440;
note('half forgotten after', 'bad ' + hlBad.toFixed(0) + ' days, good '
     + hlGood.toFixed(0) + ' days');
/* THE FIRST CUT OF THIS CLAIM ASKED WHETHER THE WORD "halflife" APPEARS IN THE
   MODULE, WHICH IS A TEST ABOUT A COMMENT AND NOT ABOUT THE CODE. The file names
   deedHalflife in prose, to say it did NOT build one, and the claim went red for
   saying so. Repointed at substance: the module computes no fade, exports no
   halflife and holds no number of days. */
ok('*** "REMEMBERED LONGER" COMES FREE OFF THE WEIGHT ***, because the organ '
   + 'already derives the fade from it. Nothing was built for this leg',
   hlBad > hlGood * 1.5
   && W.deedHalflife === undefined && W.HALFLIFE === undefined
   && !/function\s+\w*[Hh]alflife|Math\.pow\(0\.5|DEED_HALFLIFE\s*[*=]/.test(src),
   'bad ' + hlBad.toFixed(0) + ' days against good ' + hlGood.toFixed(0)
   + ', and the module computes no fade of its own');
ok('and after three months a good deed is basically gone while a bad one is '
   + 'still on you',
   Math.abs(after('claim:met', 30240 * 4.3)) < 0.15
   && Math.abs(after('downed', 30240 * 4.3)) > 0.5,
   'good ' + after('claim:met', 30240 * 4.3).toFixed(2)
   + ', bad ' + after('downed', 30240 * 4.3).toFixed(2));

const cityRaw = fs.readFileSync(CITY, 'utf8');
const cloutBlock = cityRaw.slice(cityRaw.indexOf('var CT_DEED_CLOUT'),
                                 cityRaw.indexOf('var CT_DEED_CLOUT') + 700);
ok('*** AND "TRAVELS FURTHER" IS FALSE TODAY, BACKWARDS: *** the worst thing a '
   + 'person can do is not in the loudness table at all, so it runs at the '
   + 'default, while throwing in with an outfit is the loudest thing on the street',
   !/'downed'/.test(cloutBlock) && /'commit':\s*'risky'/.test(cloutBlock),
   'downed is ' + (/'downed'/.test(cloutBlock) ? 'in' : 'NOT in')
   + ' the loudness table');
ok('the module carries a proposal for it and nothing applies it, because that '
   + 'table is on the play surface',
   W.LOUDNESS && W.LOUDNESS.draft === true
   && W.LOUDNESS.want['downed'] === 'reckless'
   && !/CT_DEED_CLOUT\s*\[/.test(src));
ok('and the proposal really is further for the bad one than the good one, '
   + 'measured through the game\'s own reach',
   D.reachOf(W.LOUDNESS.want['downed']) > D.reachOf(W.LOUDNESS.want['claim:met']),
   D.reachOf(W.LOUDNESS.want['downed']) + ' cells against '
   + D.reachOf(W.LOUDNESS.want['claim:met']));

/* ========================================================================== */
head('E. THE COOK IS IN THE VOTE TAB');
/* ========================================================================== */
let page = '';
try { page = fs.readFileSync(PAGE, 'utf8'); } catch (e) {}
probe('the page exists', page.length > 1500);
ok('*** IT LEADS WITH THE FIVE THINGS, NOT WITH THE FINDING ***, which is rule 22(c)',
   page.indexOf('THE FIVE, AND WHAT EACH ONE COSTS') > 0
   && page.indexOf('THE FIVE, AND WHAT EACH ONE COSTS') < page.indexOf('WHAT IT IS LIKE NOW'));
ok('the numbers on it are the module\'s numbers, not numbers typed on a page',
   page.indexOf(String(W.BETRAYAL)) > 0 && page.indexOf('+' + W.KIND) > 0);
ok('it carries the half of the ruling people forget, that everything else is '
   + 'worth nothing', /EVERYTHING ELSE COUNTS FOR NOTHING/.test(page));
ok('and the measurement, in his words', /it moves nothing/i.test(page)
   && /83 rows/.test(page));
ok('and it says which part is backwards rather than only showing the good news',
   /backwards/i.test(page));
ok('three ways to go, and one of them is softer than what I built',
   /A &middot;/.test(page) && /B &middot;/.test(page) && /C &middot;/.test(page)
   && /TWO TO ONE/.test(page));
ok('and it says plainly that none of it is in the game he plays',
   /Nothing here is in the game you play/.test(page));
ok('it reads in daylight', /prefers-color-scheme:light/.test(page));

let item = null;
try {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  item = (reg.items || []).find(i => i.id === 'people-what-people-repeat-about-you-9-22');
} catch (e) {}
ok('this lane cooked something and it is in the tab, which is rule 22', !!item);
ok('it is this lane\'s and it points at the page',
   !!item && item.lane === 'people' && item.show.src === path.basename(PAGE));
ok('and the reason he is given carries the measurement, not an adjective',
   !!item && /83 rows/.test(item.why) && /moves nothing/i.test(item.why));

/* ========================================================================== */
head('F. RULE 18: NOTHING IS ON THE PLAY SURFACE');
/* ========================================================================== */
const alpha = fs.readFileSync(ALPHA, 'utf8');
ok('*** NOTHING IN THE GAME CALLS THE SHAPE. *** The hold is on the play surface, '
   + 'so the walked city and the alpha do not know this file exists',
   !/bohemia_weights|weightsShape|WEIGHTS_SHAPE/.test(cityRaw + alpha));
ok('and the loudness table in the city is untouched, still five kinds and still '
   + 'draft', /'claim:met':\s*'quiet',\s*\/\* draft \*\//.test(cloutBlock));
ok('and the standing module still ships its own table EMPTY, which its own gate '
   + 'asserts and this round must not break',
   /DEED_WEIGHT\s*=\s*\{\s*\}/.test(fs.readFileSync(
     path.join(ROOT, 'engine/bohemia_standing.js'), 'utf8')));
ok('the shape lives in tools, not in engine, so no derived slice has to be '
   + 'rebuilt and no lane\'s demo cut is touched',
   fs.existsSync(MOD) && !fs.existsSync(path.join(ROOT, 'engine/bohemia_weights.js')));

/* ========================================================================== */
head('G. THE RECORD SAYS WHAT WAS MEASURED');
/* ========================================================================== */
let rec = '';
try { rec = fs.readFileSync(REC, 'utf8'); } catch (e) {}
ok('the record exists and carries the count', /83/.test(rec));
ok('and says the seven street kinds are not in the table',
   /weightless/i.test(rec) && /seven/i.test(rec));
ok('and the control, including the try it cost',
   /eight/i.test(rec) && /signature/i.test(rec));
ok('and which leg of the ruling is backwards', /backwards/i.test(rec));
ok('and that nothing was put on the play surface', /rule 18/i.test(rec));

console.log('');
notes.forEach(n => console.log(n));
console.log('\n=== WEIGHTS SHAPE: ' + pass + ' pass / ' + fail.length + ' fail ===');
fail.forEach(f => console.log('   - ' + f));
process.exit(fail.length ? 1 : 0);
