/* BOHEMIA CITY DEEDS GATE (8/20/26, PEOPLE lane)
 *
 * WHY THIS EXISTS. engine/bohemia_deeds.js names the flaw in its own opening
 * paragraph, written 8/6: "The faction standing got applied godlike: the number
 * moved, valley-wide, instantly, and NOBODY HAD SEEN ANYTHING." The city was
 * committing exactly that. You answer a claim to somebody's face, BohemiaBelonging
 * moves a valley-wide number, and not one person in Las Vegas observed a thing.
 * engine/bohemia_standing.js was built for this input on 8/2 -- witness, gossip,
 * hearsay decay, 35 green claims in standing_gate -- and had no caller anywhere.
 *
 * standing_gate keeps proving the LEDGER is right. This proves it is FED, from a
 * real player choice, on the tab he taps, and that what it holds travels between
 * people instead of teleporting.
 *
 * WHAT IT PROVES
 *   1) the ledger is inlined BYTE-IDENTICAL, exactly once
 *   2) answering a claim CALLS ctDeed, and only when the claim really resolved
 *   3) the FACTIONS lane's numbers are untouched: adjust() still runs, unchanged
 *   4) a deed is witnessed by people who are actually near, and by nobody else
 *      (measured by placing somebody far away, not by hoping the world does)
 *   5) it TRAVELS: two people together long enough swap it, at one hop
 *   6) and not before the window, and never to the actor's own face
 *   7) SAW and HEARD read differently on the card
 *   8) DEED_WEIGHT is STILL EMPTY and opinion is still zero -- the judgement is
 *      Paolo's and nothing here invented a row
 *
 * Run: node gates/city_deeds_gate.js
 */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
process.chdir(ROOT);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY = 'slices/BOHEMIA_CITY_WORLD.html';

let pass = 0; const fail = [];
/* THE CONDITION SLOT MAY NEVER HOLD A STRING (8/20). Four assertions in
   coldopen_gate.js passed unconditionally the same day because this lane's gates
   do not agree on argument order and a reversed call is truthy either way. */
const ok = (n, c) => {
  if (typeof c === 'string') throw new Error('GATE BUG: ok() got a STRING as its '
    + 'condition. This file is ok(message, condition). Reversed call: '
    + JSON.stringify(String(n).slice(0, 90)));
  if (typeof n !== 'string') throw new Error('GATE BUG: ok() got a ' + typeof n
    + ' as its message. Arguments are reversed: this file is ok(message, condition).');
  c ? pass++ : (fail.push(n), console.log('  FAIL: ' + n));
};

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* ---- 1. ONE CANONICAL BODY ------------------------------------------------ */
const city = fs.readFileSync(CITY, 'utf8');
const ledger = fs.readFileSync('engine/bohemia_standing.js', 'utf8');
ok('A1 engine/bohemia_standing.js is inlined BYTE-IDENTICAL '
  + '(re-run: python3 tools/bohemia_city_deeds_patch.py)', city.indexOf(ledger) >= 0);
const copies = city.split('root.BohemiaStanding=API').length - 1;
ok('A2 and EXACTLY ONCE (found ' + copies + ')', copies === 1);

/* ---- 2. THE CLAIM IS THE DEED, AND THE OTHER LANE IS UNTOUCHED ------------- */
/* A DEFINITION IS NOT A CALLER, and this lane has now found twelve of those. */
ok('A3 answering a claim CALLS ctDeed, it is not merely defined',
  /ctDeed\(kD, CT_DEED_CLOUT\[kD\]\)/.test(city));
/* ONLY A CLAIM THAT RESOLVED. A demand you did not actually answer is not a
   thing anybody watched you do. Asserted as the RULE: the call sits behind
   r.answered, on the same line. */
ok('A4 and ONLY when the claim really resolved (guarded by r.answered)',
  /if\(r\.answered\) try\{ var kD=\(said===/.test(city));
/* THE BOUNDARY, ASSERTED. The FACTIONS lane owns what a claim costs. If this
   patch ever starts moving their number, that is a lane violation and it should
   fail here rather than be discovered in a merge. */
ok('A5 the FACTIONS lane\'s belonging adjust is still the only thing moving '
  + 'their number, unchanged',
  /if\(r\.answered && r\.delta\) BohemiaBelonging\.adjust\(sv, ctFid, r\.delta\);/.test(city));
ok('A6 committing to an outfit is a deed too, inside the moved branch',
  /ctDeed\('commit', CT_DEED_CLOUT\['commit'\]\)/.test(city));
ok('A7 the gossip pass runs beside the witness pass on the same tick',
  /ctGossipPass\(\); \}catch\(_e\)\{\}    \/\* __CITY_DEEDS__ \*\//.test(city));

/* ---- 3. HOW LOUD, AND ONE COPY OF THE TABLE ------------------------------
   bohemia_deeds throws a deliberate error saying "there is no second copy of
   that table on purpose". Measured 8/21: there were FOUR -- bohemia_loop plus
   three slices that retyped the row, because reaching the original meant
   dragging in 75 KB and six modules. The table now lives alone in
   bohemia_clout.js with no dependencies and bohemia_loop READS it. */
const clout = fs.readFileSync('engine/bohemia_clout.js', 'utf8');
const loop = fs.readFileSync('engine/bohemia_loop.js', 'utf8');
ok('A8 engine/bohemia_clout.js is inlined in the city BYTE-IDENTICAL',
  city.indexOf(clout) >= 0);
const deedsSrc = fs.readFileSync('engine/bohemia_deeds.js', 'utf8');
ok('A9 and so is engine/bohemia_deeds.js, which is what makes loudness reachable '
  + 'for 13 KB instead of the whole engine', city.indexOf(deedsSrc) >= 0);
/* THE TABLE HAS ONE DECLARATION IN THE ENGINE. Asserted as the RULE -- the
   literal appears once across engine/ -- so it fails if anybody reintroduces a
   copy, rather than pinning today's file list. */
const decls = ['engine/bohemia_clout.js', 'engine/bohemia_loop.js', 'engine/bohemia_deeds.js']
  .filter(f => /CLOUT_WEIGHTS\s*=\s*\{/.test(fs.readFileSync(f, 'utf8')));
ok('A10 the CLOUT table is DECLARED exactly once in the engine (found in: '
  + decls.join(', ') + '), the 7/21 ruling says the numbers stay tunable, so a '
  + 'second copy is a silent drift waiting for the day he retunes them',
  decls.length === 1 && decls[0] === 'engine/bohemia_clout.js');
ok('A11 bohemia_loop READS that table rather than declaring its own, and still '
  + 'exports CLOUT_TAGS/CLOUT_WEIGHTS/cloutWeight unchanged for every caller',
  /require\('\.\/bohemia_clout\.js'\)/.test(loop)
  && /CLOUT_TAGS,\s*CLOUT_WEIGHTS,\s*cloutWeight,\s*cloutTagFrom/.test(loop));
ok('A12a taking a favour is a deed too, guarded by r.took the same way the '
  + 'claim is guarded by r.answered', /if\(r\.took\) try\{ ctDeed\('favour'/.test(city));
ok('A12 each act carries one of HIS four words, read off the corpus rule',
  /CT_DEED_CLOUT\s*=\s*\{/.test(city) && /ctDeed\(kD, CT_DEED_CLOUT\[kD\]\)/.test(city));

(async () => {
  console.log('CITY DEEDS GATE, what you did is a thing people saw, and it travels');
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => errs.push(e.message.slice(0, 140)));
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForSelector('#front', { timeout: 40000 });
    await page.click('#front');
    await SETTLE(page, 1200);
    await page.click('.tab[data-p="run"]');
    await SETTLE(page, 20000);
    const fr = await (await page.$('#cityFrame')).contentFrame();
    ok('B1 the RUN tab shows the city frame', !!fr);
    if (!fr) return;

    const m = await fr.evaluate(() => {
      const out = {};
      out.ledger = typeof BohemiaStanding;
      render();

      /* *** THE GATE BUILDS THE CASE IT CLAIMS TO TEST. *** Only one body is
         drawn at spawn, so "nobody far away learns anything" and "news travels
         between two people" are both unreachable from the world as it boots.
         Placing the bodies is the only way these assertions can ever bite --
         learned the hard way one gate earlier the same day, where a range check
         could be deleted entirely without going red. */
      const NEAR = { p: { id: '__GD_NEAR__' }, at: [hx + 1, hy] };
      const FAR  = { p: { id: '__GD_FAR__'  }, at: [hx + 60, hy] };
      BARK_DREW.length = 0; BARK_DREW.push(NEAR, FAR);

      out.witnessed = ctDeed('claim:refused');
      out.nearHasIt = ((CT_MINDS['__GD_NEAR__'] || {}).deeds || []).length;
      out.farHasIt  = ((CT_MINDS['__GD_FAR__']  || {}).deeds || []).length;
      out.nearHops  = (((CT_MINDS['__GD_NEAR__'] || {}).deeds || [])[0] || {}).hops || 0;

      /* IT TRAVELS. Put the two together and let the module's own window pass. */
      BARK_DREW.length = 0;
      BARK_DREW.push(NEAR, { p: { id: '__GD_FAR__' }, at: [hx + 2, hy] });
      const W = BohemiaStanding.GOSSIP_WINDOW;
      out.window = W;

      /* NOT BEFORE THE WINDOW. Run it well short first: a system that gossips
         instantly is the teleporting-reputation failure with extra steps. */
      CT_TOGETHER = {}; CT_GOSSIP_MIN = ctMinuteNow();
      let t = ctMinuteNow() + Math.max(1, Math.floor(W / 5));
      T.day = Math.floor(t / 1440); T.min = t % 1440;
      out.movedEarly = ctGossipPass();

      CT_TOGETHER = {}; CT_GOSSIP_MIN = ctMinuteNow();
      t = ctMinuteNow() + W + 1;
      T.day = Math.floor(t / 1440); T.min = t % 1440;
      out.moved = ctGossipPass();
      const fd = (CT_MINDS['__GD_FAR__'] || {}).deeds || [];
      out.farLearned = fd.length;
      out.farHops = (fd[0] || {}).hops || 0;

      /* SAW AND HEARD READ DIFFERENTLY. That distinction is the whole visible
         payoff of modelling a route the news could take. */
      const sawRow = ctKnownDeeds('__GD_NEAR__', 2)[0] || null;
      const heardRow = ctKnownDeeds('__GD_FAR__', 2)[0] || null;
      out.saw = sawRow ? { heard: sawRow.heard, say: sawRow.say } : null;
      out.heard = heardRow ? { heard: heardRow.heard, say: heardRow.say } : null;

      /* NOBODY GOSSIPS TO YOUR FACE: the actor is '@' and must never appear as a
         recipient. Read straight off every ledger. */
      out.toldTheActor = Object.keys(CT_MINDS).some(k => k === '@');

      /* CONTENTS-PAOLO'S, STILL EMPTY. The moment this stops being 0 without him
         ruling, some lane invented a number he did not give. */
      out.weights = Object.keys(BohemiaStanding.DEED_WEIGHT).length;
      out.opinion = BohemiaStanding.opinionOf(CT_MINDS['__GD_NEAR__'], '@', ctMinuteNow());

      /* A PERSON WHO KNOWS NOTHING GETS NO ROW. A blank labelled row reads as a
         broken feature; silence is the honest answer. */
      out.strangerRows = ctKnownDeeds('__GD_NOBODY__', 2).length;

      delete CT_MINDS['__GD_NEAR__']; delete CT_MINDS['__GD_FAR__'];

      /* *** HOW LOUD IT WAS DECIDES HOW FAR IT GOES. ***
         The other half of the deeds header's complaint: "a back-yard handshake
         and a public humiliation in front of a whole block are worth the same."
         Two people on the SAME STREET at fixed distances, and the only thing
         that changes between the two runs is which of his four words the act
         carries. Read as a RULE (loud reaches strictly more than quiet), never
         as pinned tile counts, so retuning his weights cannot fail this. */
      out.curve = [null, 'quiet', 'notable', 'risky', 'reckless'].map(t => ({
        tag: String(t), reach: BohemiaDeeds.reachOf(t), hops: BohemiaDeeds.hopsFor(t) }));
      out.identity = BohemiaDeeds.reachOf(null) === BohemiaStanding.SEE_RANGE
                  && BohemiaDeeds.hopsFor(null) === BohemiaStanding.MAX_HOPS;
      const r = out.curve.slice(1).map(c => c.reach);
      out.ordered = r[0] < r[1] && r[1] < r[2] && r[2] < r[3];

      const A = { p: { id: '__LD_A__' }, at: [hx + 6,  hy] };
      const B = { p: { id: '__LD_B__' }, at: [hx + 14, hy] };
      BARK_DREW.length = 0; BARK_DREW.push(A, B);
      out.quietReached = ctDeed('claim:met', 'quiet');
      out.quietBudget = (((CT_MINDS['__LD_A__'] || {}).deeds || [])[0] || {}).maxHops;
      delete CT_MINDS['__LD_A__']; delete CT_MINDS['__LD_B__'];
      out.loudReached = ctDeed('commit', 'risky');
      out.loudBudget = (((CT_MINDS['__LD_A__'] || {}).deeds || [])[0] || {}).maxHops;
      delete CT_MINDS['__LD_A__']; delete CT_MINDS['__LD_B__'];
      /* AND AN UNTAGGED DEED IS STILL BIT-FOR-BIT THE OLD BEHAVIOUR. */
      BARK_DREW.length = 0; BARK_DREW.push(A, B);
      ctDeed('claim:met');
      out.untaggedBudget = (((CT_MINDS['__LD_A__'] || {}).deeds || [])[0] || {}).maxHops;
      delete CT_MINDS['__LD_A__']; delete CT_MINDS['__LD_B__'];

      BARK_DREW.length = 0;
      return out;
    });

    ok('B2 the deed ledger is live in the city frame', m.ledger === 'object');
    ok('B3 A CLAIM ANSWERED IS A THING PEOPLE SAW (' + m.witnessed
      + ' witness(es)), for a month the number moved and nobody had seen anything',
      m.witnessed >= 1 && m.nearHasIt === 1);
    ok('B4 and somebody sixty cells away learned NOTHING, measured by putting '
      + 'one there, not by hoping the world provides one', m.farHasIt === 0);
    ok('B5 an eyewitness holds it at ZERO hops', m.nearHops === 0);
    ok('B6 IT TRAVELS: two people together for the module\'s own window ('
      + m.window + ' min) swap it (' + m.moved + ' moved)', m.moved >= 1
      && m.farLearned === 1);
    ok('B7 and the retelling costs a hop, so hearsay is not eyewitness',
      m.farHops === 1);
    ok('B8 NOT BEFORE THE WINDOW (' + m.movedEarly + ' moved early), news that '
      + 'travels instantly is the teleporting reputation this replaces',
      m.movedEarly === 0);
    ok('B9 SAW reads differently from HEARD ("' + (m.saw || {}).say + '" vs "'
      + (m.heard || {}).say + '")',
      !!m.saw && !!m.heard && m.saw.heard === false && m.heard.heard === true
      && m.saw.say !== m.heard.say);
    ok('B10 nobody gossips to your face', m.toldTheActor === false);
    ok('B11 CONTENTS-PAOLO\'S: DEED_WEIGHT is STILL EMPTY (' + m.weights
      + ' rows) and opinion is still ' + m.opinion + ', the mechanism records '
      + 'what happened, the judgement is his', m.weights === 0 && m.opinion === 0);
    ok('B12 a person who knows nothing about you gets NO row rather than a blank one',
      m.strangerRows === 0);
    /* the loudness half of the same header complaint */
    ok('C1 an UNTAGGED deed is bit-for-bit the old behaviour (reach === SEE_RANGE, '
      + 'hops === MAX_HOPS) so a tag can only move you OFF the default, never '
      + 'silently redefine it', m.identity === true && m.untaggedBudget == null);
    ok('C2 HIS LOCKED ORDERING holds on the live table: reckless > risky > '
      + 'notable > quiet (' + m.curve.slice(1).map(c => c.tag + ':' + c.reach).join(' < ')
      + ')', m.ordered === true);
    ok('C3 A BACK-YARD HANDSHAKE AND A PUBLIC ONE ARE NO LONGER WORTH THE SAME: '
      + 'same street, same two people, the quiet act reached ' + m.quietReached
      + ' and the loud one reached ' + m.loudReached,
      m.loudReached > m.quietReached);
    ok('C4 and the hop budget travels ON the deed, so a quiet thing dies with the '
      + 'people who watched it (' + m.quietBudget + ' retelling) while a loud one '
      + 'outlives them (' + m.loudBudget + ')',
      m.quietBudget > 0 && m.loudBudget > m.quietBudget);
    /* ---- REACTIVITY: THEY SAY IT OUT LOUD (backlog 0r, the Hades math) ---- */
    const rx = await fr.evaluate(() => {
      const out = {};
      render();
      const W = { p: { id: '__RX__', key: 'P:city:__RX__' }, at: [hx + 2, hy] };
      BARK_DREW.length = 0; BARK_DREW.push(W);
      /* NOBODY HAS SEEN ANYTHING: the street must sound exactly as it did. */
      BARK.p = null; BARK.text = null;
      out.silentBefore = ctDeedBark(1000);
      ctDeed('claim:refused', 'notable');
      out.fired = ctDeedBark(2000);
      out.saidSaw = BARK.text;
      /* AND A WITNESS IS NOT A BROKEN RECORD. */
      BARK.p = null; BARK.text = null;
      out.repeats = ctDeedBark(3000);
      /* HEARD SAYS SOMETHING ELSE, which is the whole payoff of a route. */
      CT_MINDS['__RX__'].deeds[0].hops = 1;
      CT_REACT_SAID = {}; BARK.p = null; BARK.text = null;
      ctDeedBark(4000);
      out.saidHeard = BARK.text;
      /* HADES' RULE: never repeat until the pool is spent. */
      CT_REACT_USED = {};
      const cyc = [];
      for (let i = 0; i < 4; i++) cyc.push(ctReactLine('claim:refused', false));
      out.cycle = cyc;
      out.poolSize = CT_REACT['claim:refused'].saw.length;
      /* AND THE WORDS NEVER GUESS WHO HE IS. */
      const all = [];
      Object.keys(CT_REACT).forEach(k => {
        all.push.apply(all, CT_REACT[k].saw); all.push.apply(all, CT_REACT[k].heard); });
      out.lines = all.length;
      out.gendered = all.filter(t => /\b(he|him|his|she|her|hers)\b/i.test(t));
      out.unpunctuated = all.filter(t => !/[.!?]$/.test(t));
      delete CT_MINDS['__RX__']; BARK_DREW.length = 0;
      return out;
    });
    ok('D1 with nobody having seen anything the street is UNCHANGED (additive, '
      + 'never a regression)', rx.silentBefore === false);
    ok('D2 A WITNESS SAYS IT OUT LOUD, so a deed is not something you only find '
      + 'by opening a card ("' + rx.saidSaw + '")', rx.fired === true && !!rx.saidSaw);
    ok('D3 and does not repeat the same sighting at you', rx.repeats === false);
    ok('D4 SAW and HEARD say different things ("' + rx.saidSaw + '" vs "'
      + rx.saidHeard + '")', !!rx.saidHeard && rx.saidHeard !== rx.saidSaw);
    ok('D5 HADES\' RULE: no line repeats until the pool is spent ('
      + rx.cycle.join(' | ') + ')',
      new Set(rx.cycle.slice(0, rx.poolSize)).size === rx.poolSize);
    ok('D6 the drafted lines NEVER GUESS WHO HE IS (' + rx.lines + ' lines, '
      + rx.gendered.length + ' gendered' + (rx.gendered.length ? ': "'
      + rx.gendered[0] + '"' : '') + ') - who the player is is his',
      rx.gendered.length === 0 && rx.unpunctuated.length === 0);

    ok('B13 the city frame threw no errors' + (errs.length ? ': ' + errs[0] : ''),
      errs.length === 0);
  } finally {
    await browser.close();
  }
  console.log('CITY DEEDS GATE: ' + pass + ' passed, ' + fail.length + ' failed');
  process.exit(fail.length ? 1 : 0);
})();
