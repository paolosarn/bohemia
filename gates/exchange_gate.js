/* ============================================================================
   STREET EXCHANGE GATE (8/17/26, PEOPLE lane)

   Q043.W4 AMBIENT BANTER AS CHARACTERIZATION, which the 8/12 bark factory cites
   in its own header, asks for OVERHEARD RELATIONSHIPS. That factory then shipped
   244 lines in which every single person is talking to NOBODY. A person alone
   saying a thing is not a relationship; the corpus asked for the relationship
   and got a monologue.

   IT WAS NOT NEGLECT, IT WAS IMPOSSIBLE. Measured 8/16 at every hour of a full
   day on the real surface: ONE body was drawn at 07, 09, 11, 13, 15, 17, 19 and
   21 hundred hours, and never once a pair. You cannot write a conversation for a
   valley that cannot put two people on one screen. The population dial landed
   8/16 and a settlement now draws 88. THIS IS THE HALF THAT WAS WAITING.

   WHAT THIS REFUSES TO LET HAPPEN, and each is a real failure mode this lane has
   already paid for once:

   1. A TABLE NOBODY CAN HEAR. The worst reach failure this lane has found was
      exactly this: linesFor() was called ZERO TIMES in BOHEMIA_CITY_WORLD.html,
      the frame the player looks at, while 244 correct barks sat inlined in that
      same file. So this asserts the conversation IN THE FRAME, through the one
      link, never in a require().

   2. A BUBBLE THAT NEVER DRAWS. `var g = ctx` in a frame whose context is `g`
      threw on the first line of every bark, inside a try/catch that ate it.
      Everything upstream measured perfect and nothing reached the screen. A
      CAUGHT EXCEPTION IN A DRAW PATH IS A FEATURE THAT SILENTLY DOES NOTHING.
      So the claim here is PIXELS: the same frame with a line and without one
      must DIFFER, and by more than a couple of stray pixels.

   3. HEARING THE OPENING LINE. The one craft rule every source agrees on is
      that an overheard line works because it is an EXCERPT. Every exchange is
      authored as a full four-turn conversation and `join` is never 0, so the
      first thing the player ever hears is mid-stream. The opening line is
      written and deliberately never spoken.

   4. TWO STRANGERS INSTEAD OF A CONVERSATION. The ambient bark cooldown is 1.5s
      of breath plus 4s before anybody else speaks. Inside an exchange that is
      wrong, so a turn hands to the next speaker after ONE BEAT. This asserts
      that consecutive turns of one exchange come from TWO DIFFERENT PEOPLE.

   5. ROTE (Q030.X3 REPETITION). A pair must spend its whole pool before
      anything repeats.

   6. A STUB (Q043.X4 CONTENT FRONT-LOADED / UNEVEN). Every kind carries real
      weight, not one token entry.

   7. KILLING THE SOLO BARK. The dial ships at 1 where a pair is rare, so if the
      exchange path ever swallowed the fallback, the street would go silent for
      almost every player. Exchanges are additive or they are a regression.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const fs = require('fs');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  /* ---- A. THE TABLE, headless: cheap and it fails fast ------------------ */
  global.window = global;
  const X = require(path.join(ROOT, 'engine/bohemia_exchanges.js'));
  const idx = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'records/BOHEMIA_QUESTBOOK_LAW_INDEX.json'), 'utf8'));
  const laws = idx.laws;
  const EX = X.EXCHANGES;

  ok('A1 there are real conversations, not a token table (' + EX.length + ')', EX.length >= 24);

  /* A2: FOUR TURNS, STRICTLY ALTERNATING. A conversation where the same person
     says two things in a row is one person thinking out loud. */
  const shape = EX.filter(x => x.turns.length !== 4);
  ok('A2 every exchange is four turns (' + shape.length + ' malformed)', shape.length === 0,
    shape.map(x => x.id).join(' '));

  /* A3: YOU NEVER HEAR THE OPENING LINE. */
  const opener = EX.filter(x => !(x.join >= 1 && x.join <= 2));
  ok('A3 nobody ever hears turn 0 -- you walk in on the middle (' + opener.length + ' bad)',
    opener.length === 0, opener.map(x => x.id + '@' + x.join).join(' '));

  /* A4: and what is HEARD alternates speakers, which is what makes it read as
     two people rather than one person with two voices. */
  let badAlt = [];
  for (const x of EX) {
    const h = X.heard(x);
    for (let i = 1; i < h.length; i++) if (h[i].speaker === h[i - 1].speaker) badAlt.push(x.id);
  }
  ok('A4 heard turns alternate speakers (' + badAlt.length + ' do not)', badAlt.length === 0,
    badAlt.join(' '));

  /* A5: EVERY LINE CITES THE CORPUS, the id resolves, the title is VERBATIM.
     DIALOGUE ALWAYS REFERS TO THE CATALOGUE (8/11): a citation is a claim the
     machine can check, never a name-drop. */
  const badCite = [];
  for (const x of EX) {
    if (!x.study || x.study.length < 2) { badCite.push(x.id + ' (<2 studies)'); continue; }
    for (const s of x.study) {
      const e = laws[s.id];
      if (!e) badCite.push(x.id + ' -> ' + s.id + ' does not resolve');
      else if (String(e.title).trim() !== String(s.title).trim())
        badCite.push(x.id + ' -> ' + s.id + ' title is not verbatim');
      else if (!s.applied || s.applied.length < 40)
        badCite.push(x.id + ' -> ' + s.id + ' has no applied: sentence');
    }
  }
  ok('A5 every exchange cites >=2 corpus findings, verbatim, with an applied line ('
    + badCite.length + ' bad)', badCite.length === 0, badCite.slice(0, 3).join(' | '));

  /* A6: >= 2 MASTERS across the table, the catalogue law's own span rule. */
  const masters = new Set();
  for (const x of EX) for (const s of x.study) if (laws[s.id]) masters.add(laws[s.id].kind);
  ok('A6 the table spans >=2 masters (' + [...masters].join(',') + ')', masters.size >= 2);

  /* A7: Q043.X4 CONTENT FRONT-LOADED / UNEVEN -- no kind is a stub. */
  const kinds = {};
  for (const x of EX) kinds[x.kind] = (kinds[x.kind] || 0) + 1;
  const stubs = Object.entries(kinds).filter(([, n]) => n < 4);
  ok('A7 no kind is a stub (' + JSON.stringify(kinds) + ')', stubs.length === 0,
    stubs.map(s => s[0]).join(' '));

  /* A8: Q030.X3 REPETITION -- a pair spends its pool before anything repeats. */
  /* COUNT AGAINST WHAT nextFor REALLY DRAWS FROM. forPair is the whole table for
     a pair; nextFor draws from the ELIGIBLE subset, and with no context the
     about-the-player exchanges are correctly excluded. Using the bigger number
     made this demand more unique draws than the pool can hold, which is the gate
     being wrong rather than the code. */
  const pool = X.eligible(X.forPair('worker', 'watch'), null);
  const spent = {}, drawn = [];
  for (let i = 0; i < pool.length; i++) {
    const x = X.nextFor('a|b', 'worker', 'watch', spent, i);
    if (!x) break;
    drawn.push(x.id); spent[x.id] = 1;
  }
  ok('A8 a pair spends its whole pool before repeating (' + drawn.length + ' draws, '
    + new Set(drawn).size + ' unique)', drawn.length > 4 && new Set(drawn).size === drawn.length);

  /* A9: NO EM DASHES ANYWHERE (Paolo, standing, and it covers prose). */
  const dashes = EX.filter(x => x.turns.some(t => t.includes('—') || t.includes('–')));
  ok('A9 not one line uses an em or en dash (' + dashes.length + ')', dashes.length === 0);

  /* A10: some of them REWARD THE LISTENER (Q001.P8) -- a fact said nowhere else. */
  const leaks = EX.filter(x => x.leaks).length;
  ok('A10 some exchanges reward the listener with a real thread (' + leaks + ')', leaks >= 6);

  /* ---- A11..A16: AND THEY TALK ABOUT YOU, BUT ONLY WHEN IT IS TRUE ------
     Q062.P6 "the witness makes it real": an exchange about the player splits on
     whether either speaker has ACTUALLY MET HIM. Q007.W10 CROSS-SYSTEM
     CONSEQUENCE: going round asking questions is a deed and the street starts
     saying so. AN EXCHANGE ABOUT YOU THAT FIRES WHEN IT IS NOT TRUE IS THE
     WORLD LYING ABOUT ITSELF, which is worse than saying nothing. */
  const about = EX.filter(x => x.about);
  ok('A11 the world can talk about the player (' + about.length + ' exchanges)',
    about.length >= 4);

  const unconditioned = about.filter(x => !x.needs || !x.witness);
  ok('A12 every one names a condition AND a witness state (' + unconditioned.length
    + ' do not)', unconditioned.length === 0, unconditioned.map(x => x.id).join(' '));

  /* A13: WITH NO CONTEXT AT ALL, NOT ONE OF THEM IS ELIGIBLE. A fresh player who
     has done nothing must never overhear the street discussing him. */
  const anyPool = X.forPair('any', 'any');
  ok('A13 a player who has done nothing is never talked about',
    X.eligible(anyPool, null).every(x => !x.about)
    && X.eligible(anyPool, { world: { asked: 0, known: 0, names: 0 }, witness: 'heard' })
      .every(x => !x.about));

  /* A14: cross the threshold and it becomes true. */
  const asked3 = X.eligible(anyPool, { world: { asked: 3, known: 0, names: 0 }, witness: 'heard' })
    .filter(x => x.about);
  ok('A14 going round asking makes it true (' + asked3.map(x => x.id).join(', ') + ')',
    asked3.length >= 1 && asked3.every(x => x.witness === 'heard'));

  /* A15: THE WITNESS SPLIT IS REAL. The same world, the same counters, and a
     different pair: one of whom has met him. Different lines, every time. */
  const seenSide = X.eligible(anyPool, { world: { asked: 3, known: 5, names: 3 }, witness: 'seen' })
    .filter(x => x.about);
  ok('A15 a witness and a second-hand teller do not say the same thing ('
    + seenSide.length + ' seen vs ' + asked3.length + ' heard)',
    seenSide.length >= 1 && seenSide.every(x => x.witness === 'seen')
    && seenSide.every(x => asked3.indexOf(x) < 0));

  /* A16: and the world talks about HIM before it talks about the water, while
     it is still news -- otherwise the moment never surfaces at all. */
  const pref = X.nextFor('p|q', 'any', 'any', {}, 1,
    { world: { asked: 3, known: 0, names: 0 }, witness: 'heard' });
  ok('A16 while it is news, it comes up before the water does (' + (pref && pref.id) + ')',
    !!pref && !!pref.about);

  /* ---- B. THE STREET, through the one link ------------------------------ */
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 16000);

    /* ASK A FRAME WHAT IT CAN DO, NEVER MATCH ITS URL. */
    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof LANDED !== 'undefined' && typeof barkTick === 'function')) { city = f; break; } }
      catch (_e) {}
    }
    ok('B1 the world loads through the one link', !!city);
    if (!city) throw new Error('no city frame');

    ok('B2 the exchanges reached the frame the player actually looks at',
      await city.evaluate(() => typeof BohemiaExchanges !== 'undefined'
        && BohemiaExchanges.count >= 24));

    await city.evaluate(() => { if (MODE !== 'human') { swapMode(); HC = HZOOM; } render(); });
    await SETTLE(page, 2400);

    /* B3: STAND WHERE PEOPLE ACTUALLY ARE. His 7/29 zone ruling makes a spread
       neighbourhood one household per subdivision by design, so a pair lives in
       a settlement. The gate goes where the claim is testable. */
    const found = await city.evaluate(() => {
      BohemiaPopulation.setDial(20);
      const NB = BohemiaPopulation.NB;
      for (let ny = 0; ny < 24; ny++) for (let nx = 0; nx < 24; nx++) {
        if (BohemiaPopulation.zoneAt(om, POWER, nx * NB, ny * NB, seed) !== 'cluster') continue;
        const ppl = pplPeople(nx, ny);
        if (ppl.length < 5) continue;
        hx = ppl[0].home[0] + 1; hy = ppl[0].home[1] + 1;
        city.x = (nx * NB) | 0; city.y = (ny * NB) | 0;
        render();
        return { nb: [nx, ny], n: ppl.length };
      }
      return null;
    });
    ok('B3 there is a settlement with people in it to overhear', !!found);
    await SETTLE(page, 2400);
    await city.evaluate(() => render());
    await SETTLE(page, 1200);

    const drew = await city.evaluate(() => BARK_DREW.length);
    ok('B4 the street really has a crowd on it (' + drew + ' bodies blitted)', drew >= 4);

    const pair = await city.evaluate(() => {
      const p = xchPick();
      return p ? { a: p.A.p.key || p.A.p.id, b: p.B.p.key || p.B.p.id } : null;
    });
    ok('B5 two people are standing close enough to be talking', !!pair && pair.a !== pair.b);

    /* B6: DRIVE THE CLOCK AND WRITE DOWN WHO SAID WHAT. This is the whole gate:
       not "the function returns lines" but "the surface put two people's words
       up, one after the other". */
    const said = [];
    for (let i = 0; i < 26; i++) {
      await city.evaluate(() => render());
      const s = await city.evaluate(() => ({
        who: BARK.p ? (BARK.p.key || BARK.p.id) : null,
        txt: BARK.text || '', id: XCH.id, on: XCH.on
      }));
      if (s.who && (!said.length || said[said.length - 1].txt !== s.txt)) said.push(s);
      await SETTLE(page, 700);
    }
    ok('B6 the street spoke at all (' + said.length + ' lines)', said.length >= 3,
      JSON.stringify(said.slice(0, 2)));

    const speakers = new Set(said.map(s => s.who));
    ok('B7 MORE THAN ONE PERSON SPOKE -- it is a conversation, not a monologue ('
      + speakers.size + ' speakers)', speakers.size >= 2);

    /* B8: consecutive turns of ONE exchange must come from DIFFERENT people. */
    let sameTwice = 0;
    for (let i = 1; i < said.length; i++) {
      if (said[i].id && said[i].id === said[i - 1].id && said[i].who === said[i - 1].who) sameTwice++;
    }
    ok('B8 nobody answers themselves inside one exchange (' + sameTwice + ')', sameTwice === 0);

    /* B9: THE FIRST LINE HEARD OF ANY EXCHANGE IS NEVER ITS OPENING LINE. */
    const firstOf = {};
    for (const s of said) if (s.id && !(s.id in firstOf)) firstOf[s.id] = s.txt;
    const heardOpeners = Object.entries(firstOf).filter(([id, txt]) => {
      const x = EX.find(e => e.id === id);
      return x && txt === x.turns[0];
    });
    ok('B9 you walk in on the middle -- no opening line was ever heard ('
      + Object.keys(firstOf).length + ' exchanges seen)', heardOpeners.length === 0,
      heardOpeners.map(h => h[0]).join(' '));

    /* B10: THE BUBBLE IS PIXELS, NOT STATE. The barks failed four times with
       everything upstream perfect, the last one because a draw threw inside a
       swallowing try/catch. So: same frame, line vs no line, and the canvas
       must really differ. */
    const diff = await city.evaluate(() => {
      const c = document.getElementById('cv');
      const g2 = c.getContext('2d');
      /* force a known line over a known body, then draw */
      const d = BARK_DREW[0];
      if (!d) return -1;
      BARK.p = d.p; BARK.at = d.at;
      BARK.text = 'Then they already knew where I live.';
      BARK.until = performance.now() + 60000;
      render();
      const withBubble = g2.getImageData(0, 0, c.width, c.height).data;
      BARK.p = null; BARK.text = ''; BARK.until = 0;
      render();
      const without = g2.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 0; i < withBubble.length; i += 4) {
        if (withBubble[i] !== without[i] || withBubble[i + 1] !== without[i + 1]
          || withBubble[i + 2] !== without[i + 2]) n++;
      }
      return n;
    });
    ok('B10 the bubble reaches PIXELS, not just state (' + diff + ' pixels differ)',
      diff > 400);

    /* B11: AND THE SOLO BARK STILL WORKS WITH NOBODY TO TALK TO. The dial ships
       at 1 where pairs are rare; if the exchange path swallowed the fallback the
       street would go silent for nearly every player. */
    const solo = await city.evaluate(async () => {
      BohemiaPopulation.setDial(1);
      try { chunkCache.clear(); metaCache.clear(); __subCache.clear(); } catch (_e) {}
      render();
      XCH.on = false; BARK.p = null; BARK.text = ''; BARK.until = 0; BARK.next = 0;
      const out = [];
      for (let i = 0; i < 14; i++) {
        BARK.next = 0;
        barkTick(performance.now() + i * 9000);
        if (BARK.text && !out.includes(BARK.text)) out.push(BARK.text);
        BARK.p = null; BARK.until = 0;
      }
      return { lines: out.length, drew: BARK_DREW.length };
    });
    ok('B11 with nobody to talk to, one person still speaks (' + solo.lines
      + ' solo lines, ' + solo.drew + ' drawn)', solo.lines >= 1);

    /* B12: ON THE REAL STREET -- silent about him before, talking after. This is
       the whole claim, driven by rendering rather than by calling the picker. */
    /* PUT THE PEOPLE BACK. B11 sets the dial to 1 to prove the solo bark still
       fires with nobody to talk to, and left there it means no pairs, which is
       exactly what a conversation needs. Caught by this section failing with one
       lonely exchange in sixty renders. */
    await city.evaluate(() => {
      BohemiaPopulation.setDial(20);
      try { chunkCache.clear(); metaCache.clear(); __subCache.clear(); } catch (_e) {}
      XCH.on = false; XCH.spent = {}; XCH.key = '';
      BARK.p = null; BARK.until = 0; BARK.next = 0;
      render();
    });
    await SETTLE(page, 2200);

    const beforeIds = [];
    for (let i = 0; i < 34; i++) {
      await city.evaluate(() => render());
      const id = await city.evaluate(() => XCH.id);
      if (id && beforeIds.indexOf(id) < 0) beforeIds.push(id);
      await SETTLE(page, 280);
    }
    ok('B12 before he has asked anybody anything, nobody discusses him ('
      + beforeIds.length + ' conversations heard)',
      beforeIds.length > 0 && beforeIds.every(id => id.indexOf('you-') !== 0),
      beforeIds.join(' '));

    const w = await city.evaluate(() => {
      BohemiaExchanges.EXCHANGES.filter(e => e.leaks).slice(0, 4)
        .forEach(x => knownHeard(x, x.turns[3]));
      /* STAND NEXT TO SOMEBODY FIRST. ctAdjacent() is adjacency-only by design
         (you talk to somebody you could touch), and after a long render loop the
         player is not guaranteed to be beside anyone. The gate moves him, the
         same way it moved him into the settlement. */
      let p = ctAdjacent();
      if (!p && BARK_DREW.length) {
        hx = BARK_DREW[0].at[0] + 1; hy = BARK_DREW[0].at[1];
        render();
        p = ctAdjacent();
      }
      if (!p) return { asked: -1, known: -1, names: -1 };
      const who = ctPerson(p);
      ['water', 'power', 'the hill'].forEach(s => askAbout(who, who.key, s));
      XCH.on = false; XCH.spent = {}; XCH.key = '';
      BARK.p = null; BARK.until = 0; BARK.next = 0;
      return xchWorld();
    });
    ok('B13 the world counts what he has been doing (' + JSON.stringify(w) + ')',
      w.asked >= 2);

    const afterIds = [];
    for (let i = 0; i < 60; i++) {
      await city.evaluate(() => render());
      const id = await city.evaluate(() => XCH.id);
      if (id && afterIds.indexOf(id) < 0) afterIds.push(id);
      await SETTLE(page, 280);
      if (afterIds.some(id => id.indexOf('you-') === 0)) break;
    }
    ok('B14 once he has gone round asking, the street talks about him ('
      + afterIds.join(', ') + ')',
      afterIds.some(id => id.indexOf('you-') === 0), afterIds.join(' '));

    ok('B15 nothing threw while the street talked', errs.length === 0,
      errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('STREET EXCHANGE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
