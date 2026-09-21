/* ============================================================================
   AN ASK HAS A MOUTH GATE (9/21/26, QUESTS lane) -- row [a person asks],
   THE-FIRST-ASK-IS-A-PERSON-WITH-A-FACE-AT-HIS-DOOR.

   PAOLO 9/20, rule 19: "you can't just be putting things on the screen and
   pretend they're the quest. It has to be people, characters, items to pick up,
   locations to go, text coming from people's voice."

   MEASURED ON THE WALKED CITY BEFORE THIS WAS WRITTEN, at minute one:
     the valley makes three real asks     shelf 47,50 / grid 47,49 / border 50,46
     every one attributed to              P:city:12:12:0, ON THE WAKING BLOCK
     people on that block                 21
     of those, with a name                0
     of those who can speak               0
     first thing on screen                a pop-up card
   The person at his door already exists and already wants something. Nothing
   could say it out loud. This gate holds the mouth.

   WHAT IT REFUSES TO LET ROT:
   1. EVERY CHANGE THE GENERATOR CAN NAME EITHER HAS WORDS OR IS REFUSED BY
      NAME. A friendly fallback for anything is how an unwired system looks
      wired, so the comparison is against the GENERATOR'S OWN list of changes.
   2. A PERSON, A PLACE, A THING, A VISIBLE RESULT. Every spoken ask names where
      to go, and the promise it closes on is the generator's own `visible`
      string, byte for byte, so the screen and the ledger cannot drift.
   3. *** A COORDINATE IS NOT AN ADDRESS. *** A bare cell is refused rather than
      read aloud. This lane shipped that ruling once already, after a card
      printed "HERE, 6205 6269" at him, and the first cut of this very module
      said "It's at 47,49" -- so it is gated, not remembered.
   4. THE PLACE IS SAID ONCE. The first cut said it twice, in two different
      wordings, in two consecutive sentences.
   5. REFUSING IS A REAL ANSWER WITH A REAL LINE, never a greyed-out row.
   6. AND IT RUNS ON THE REAL SURFACE, against the asks the valley is actually
      making, not against a fixture typed here.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const S = require(path.join(ROOT, 'engine/bohemia_ask_spoken.js'));
const A = require(path.join(ROOT, 'engine/bohemia_asks.js'));

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) pass++; else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); } };
const done = () => { console.log('ASK HAS A MOUTH GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const REAL = { changes: 'light_comes_back', who: 'P:city:12:12:0', where: '47,49',
               about: 757, from: 'the grid', visible: 'A light comes back on.', draft: true };
const WHERE = 'one street over, past the storefronts';

/* ---- 1. EVERY CHANGE EITHER HAS WORDS OR IS REFUSED BY NAME -------------- */
{
  const gen = Object.keys(A.CHANGES || {});
  const mouths = S.everyChange();
  ok('the generator still names the changes this gate compares against (' + gen.length + ')', gen.length >= 5);
  const withWords = gen.filter(c => mouths.indexOf(c) >= 0);
  const without = gen.filter(c => mouths.indexOf(c) < 0);
  ok('the changes with a mouth are a SUBSET of the generator\'s own list -- no'
     + ' words exist for a change the game cannot make',
     mouths.every(m => gen.indexOf(m) >= 0), 'extra: ' + mouths.filter(m => gen.indexOf(m) < 0).join(','));
  ok('and at least four of the generator\'s changes can be spoken (' + withWords.length + '/' + gen.length + ')',
     withWords.length >= 4);
  let refusedByName = 0;
  for (const c of without) {
    const why = S.refuse({ changes: c, who: 'x', where: 'somewhere real', visible: 'v' });
    if (why && why.indexOf(c) >= 0) refusedByName++;
  }
  ok('every change WITHOUT words is refused BY NAME rather than given a filler'
     + ' sentence (' + refusedByName + '/' + without.length + ')',
     refusedByName === without.length);
}

/* ---- 2. PERSON, PLACE, THING, VISIBLE RESULT ---------------------------- */
{
  const s = S.spokenFor(REAL, { where: WHERE });
  ok('a real ask comes back spoken', !!s && Array.isArray(s.says) && s.says.length >= 2);
  ok('it names the place out loud', s.says.join(' ').indexOf(WHERE) >= 0);
  ok('*** the promise is the GENERATOR\'S OWN words, byte for byte ***', s.visible === REAL.visible);
  ok('it carries who is speaking', s.who === REAL.who);
  ok('and it does NOT invent a name -- names are PEOPLE\'s', s.name === null);
  ok('every sentence is a draft, nothing here is approved', s.draft === true);
}

/* ---- 3. A COORDINATE IS NOT AN ADDRESS ---------------------------------- */
{
  ok('a bare cell is refused, not read aloud', S.spokenFor(REAL) === null);
  ok('and so is one with spaces', S.spokenFor(REAL, { where: ' 47 , 49 ' }) === null);
  ok('a real phrase is accepted', !!S.spokenFor(REAL, { where: WHERE }));
  ok('the address test is exported so a caller and this gate share ONE idea of it',
     typeof S.isAddress === 'function' && S.isAddress(WHERE) === true && S.isAddress('47,49') === false);
  /* A CHECK THAT CANNOT FAIL IS DECORATION. The first draft of this block ended
     in `|| true`, which made it unfailable, and this lane has killed a
     decoration check before. The real assertion is behavioural and it is above:
     a bare cell returns null. This one proves the REFUSAL is what produces that
     null, rather than some unrelated throw swallowing the call. */
  ok('the null for a bare cell comes from the address rule, not from a throw',
     S.isAddress('47,49') === false && S.refuse(REAL) === null);
}

/* ---- 4. THE PLACE IS SAID ONCE ------------------------------------------ */
{
  let twice = [];
  for (const c of S.everyChange()) {
    const s = S.spokenFor({ changes: c, who: 'P:x', where: '1,1', visible: 'V.' }, { where: WHERE });
    if (!s) { twice.push(c + ': would not speak'); continue; }
    const hits = s.says.filter(l => l.indexOf(WHERE) >= 0).length;
    if (hits !== 1) twice.push(c + ': place said ' + hits + ' times');
    /* AND THE WHOLE-PHRASE TEST ABOVE IS NOT ENOUGH, WHICH I FOUND BY READING
       THE OUTPUT AFTER IT WENT GREEN. The shelf ask read "You going past the
       market, bring back what you can carry. It's at the market, two streets
       down." -- the place phrase appeared once, so the check passed, and the
       line still said MARKET twice. So no meaningful word of the place may
       appear in the line that is not the place clause. */
    const placeWords = WHERE.toLowerCase().match(/[a-z]{4,}/g) || [];
    const askLine = (s.says[s.says.length - 1] || '');
    const before = askLine.slice(0, askLine.indexOf(WHERE));
    for (const w of placeWords)
      if (before.toLowerCase().indexOf(w) >= 0) twice.push(c + ': says "' + w + '" twice');
  }
  ok('every change says the place EXACTLY ONCE' + (twice.length ? ' -- ' + twice.join('; ') : ''),
     twice.length === 0);
}

/* ---- 5. REFUSING IS A REAL ANSWER --------------------------------------- */
{
  let bad = [];
  for (const c of S.everyChange()) {
    const s = S.spokenFor({ changes: c, who: 'P:x', where: '1,1', visible: 'V.' }, { where: WHERE });
    if (!s) { bad.push(c); continue; }
    const no = (s.back || []).filter(b => b.takes === false)[0];
    const yes = (s.back || []).filter(b => b.takes === true)[0];
    if (!no || !no.reply || !no.reply.trim()) bad.push(c + ': no line when you refuse');
    if (!yes || !yes.reply || !yes.reply.trim()) bad.push(c + ': no line when you take it');
  }
  ok('taking it AND refusing it both get a real line' + (bad.length ? ' -- ' + bad.join('; ') : ''),
     bad.length === 0);
}

/* ---- 7. ARGUING IT, IN HIS MOUTH, AND IT RE-TYPES NOTHING --------------- */
{
  const H = require(path.join(ROOT, 'engine/bohemia_haggle.js'));
  const sp = S.spokenFor(REAL, { where: WHERE });
  let t = H.open({ id: 'q1', pays: 'battery' });
  const c = S.talkFor(sp, H, t);
  ok('an ask can be argued in speech', !!c && Array.isArray(c.back) && c.back.length >= 3);
  ok('taking it is a WORD TO A PERSON, not a button under a card',
     c.back.some(r => r.kind === 'take' && r.takes === true && r.text));
  ok('and walking away is still a real answer with a real line',
     c.back.some(r => r.kind === 'leave' && r.reply && r.reply.trim()));

  /* *** THE CLAIM THAT MATTERS: NOT ONE WORD IS RE-TYPED. *** A second copy of
     a deal's sentences is two versions of one deal, and the card and the mouth
     would drift the first time anybody edited either. So every line the
     conversation emits must be findable in the haggle's source or in this
     module's own MOUTH table -- checked against the FILES, not against a list
     typed in this gate. */
  /* THE CHECK IS EXACT, NOT A SUBSTRING SWEEP. The first cut looked every line
     up in the two source files and flagged "I'll go." and "Not right now." as
     invented -- and it was RIGHT to flag them under its own rule and WRONG about
     the rule: those two are this module's own take-and-leave lines, not the
     haggle's. Widening the sweep to "anywhere in either file" would have made it
     pass and made it worthless, because a re-typed COPY of a haggle line sitting
     in this module would also be "in a file". So each line is matched against
     the exact thing that owns it. */
  let tt = H.open({ id: 'q1', pays: 'battery' });
  const drift = [];
  let checked = 0;
  for (let step = 0; step < 4; step++) {
    const turn = S.talkFor(sp, H, tt);
    if (!turn) break;
    const rows = H.asks(tt) || [];
    for (const r of turn.back.filter(x => x.argues)) {
      checked++;
      const owner = rows.filter(o => o.id === r.id)[0];
      if (!owner || owner.say !== r.text) drift.push('argue row ' + r.id + ' is not the haggle\'s own text');
    }
    const take = turn.back.filter(x => x.kind === 'take')[0];
    const leave = turn.back.filter(x => x.kind === 'leave')[0];
    checked += 2;
    if (!take || take.text !== sp.back[0].text) drift.push('the take line is not this module\'s own');
    if (!leave || leave.text !== sp.back[1].text) drift.push('the leave line is not this module\'s own');
    if (turn.warns) { checked++; if (turn.warns !== H.warning(tt)) drift.push('the warning was re-worded'); }
    if (turn.answered) { checked++; if (turn.answered !== tt.said) drift.push('their answer was re-worded'); }
    const arg = turn.back.filter(r => r.argues)[0];
    tt = H.ask(tt, arg ? arg.id : 'nothing');
  }
  ok('*** every line of the argument is the EXACT text of whoever owns it --'
     + ' the haggle\'s rows, its warning, its answer, and this module\'s own take'
     + ' and leave (' + checked + ' lines) ***'
     + (drift.length ? ' -- ' + drift.join('; ') : ''),
     checked >= 8 && drift.length === 0);

  /* THE WARNING IS SAID OUT LOUD BEFORE THE ASK THAT COSTS HIM, and the third
     ask really does end it -- in the conversation, not only in the module. */
  /* DRIVEN ON A QUEST THAT REALLY PAYS. The first cut of this block opened the
     haggle on a stub with no COMPLETE ending, so pays.kind was 'unknown', no
     currency rows existed, and the warning could never be reached. The gate was
     wrong, not the code -- so it drives the real S01 through the real parser. */
  const BQm = require(path.join(ROOT, 'engine/bohemia_bq.js'));
  const S01 = BQm.parse(fs.readFileSync(path.join(ROOT, 'quests/bq/S01_THE_METER_READER.bq'), 'utf8'));
  let w = H.open(S01);
  ok('the quest this is driven on really pays, or the warning is unreachable',
     w.pays && w.pays.kind === 'one' && !!w.currency);
  const firstArg = (H.asks(w) || [])[0];
  w = H.ask(w, firstArg.id);
  const secondArg = (H.asks(w) || [])[0];
  w = H.ask(w, secondArg.id);
  const warned = S.talkFor(sp, H, w);
  ok('he is WARNED in the conversation before the ask that costs him',
     !!warned && !!warned.warns && warned.warns === H.warning(w));
  const ended = S.talkFor(sp, H, H.ask(w, (H.asks(w) || [{}])[0].id || 'x'));
  ok('and the ask after the warning really takes the job away, in the mouth',
     !!ended && ended.gone === true && !!ended.answered);
}

/* ---- 6. THE REAL SURFACE ------------------------------------------------ */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available to speak a real ask', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), { waitUntil: 'load' });
  await SETTLE(pg, 3000);

  const live = await pg.evaluate(() => {
    const asks = (typeof ctFirstAsks === 'function') ? ctFirstAsks() : [];
    const here = ctBlockOf(hx, hy);
    return { asks: asks, here: here,
             onMyBlock: (ctPeopleAt(here[0], here[1]) || []).length };
  });
  ok('the city boots with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  ok('the valley is really making asks at minute one (' + live.asks.length + ')', live.asks.length >= 3);
  ok('and somebody is standing on the waking block to make them (' + live.onMyBlock + ')',
     live.onMyBlock > 0);

  /* EVERY LIVE ASK THE VALLEY MAKES RIGHT NOW MUST BE SPEAKABLE. */
  const mute = [];
  for (const a of live.asks) {
    const s = S.spokenFor(a, { where: 'past the storefronts' });
    if (!s) mute.push(a.changes + ' (' + S.refuse(a) + ')');
    else if (s.visible !== a.visible) mute.push(a.changes + ': promise drifted');
  }
  ok('*** EVERY ASK THE VALLEY IS MAKING RIGHT NOW CAN BE SAID OUT LOUD ***'
     + (mute.length ? ' -- mute: ' + mute.join(', ') : ''), mute.length === 0);

  /* AND THE ASKER IS AT HIS DOOR, which is the row's whole point. */
  const atDoor = live.asks.filter(a => String(a.who).indexOf(':' + live.here[0] + ':' + live.here[1] + ':') >= 0);
  ok('the person asking is standing on the block he wakes on (' + atDoor.length + '/'
     + live.asks.length + ')', atDoor.length === live.asks.length);

  await b.close();
  done();
})();
