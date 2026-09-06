/* ============================================================================
   WHAT YOU HEARD GATE (8/17/26, PEOPLE lane)

   The street exchanges shipped this morning with ELEVEN conversations marked
   `leaks:true`, each saying something TRUE about this valley that is said
   nowhere else. And the fact went nowhere: you overheard it, the bubble faded,
   and the game forgot. Q001.P8 "W8 (reward the listener" asks to "gate a
   solution behind a detail only an attentive player caught", and a detail that
   is caught and then dropped gates nothing. That was atmosphere wearing a
   mechanic's coat, and this is the gate that stops it going back to being one.

   WHAT IT HOLDS:

   1. STAYING IS WHAT PAYS. The fact is recorded when the conversation reaches
      its LAST turn, and the line quoted is that last turn, because that is
      where the payoff sits in all eleven. Walk off halfway and you heard people
      talking and learned nothing. Measured first: quoting the JOIN turn gave
      rows like `HEARD: "Where then."`, which is a fact about nothing.

   2. IT REACHES THE LOG FROM THE STREET, not from a require(). The worst reach
      failure this lane has found was a table nobody could hear; a log nobody
      can fill is the same failure with a different noun. This walks a real
      settlement through the one link and demands the log FILL ITSELF.

   3. IT SURVIVES. A notebook that forgets on reload is not a notebook. Its own
      localStorage key, the way CT_MET already persists, so it never rides
      another lane's save.

   4. IT NEVER POINTS AT ANYTHING. Q018.W3 THE RUMOR WEB: "a thread to pull,
      with NO waypoints." No cell, no coordinate, no arrow anywhere in a stored
      row. MAP LAW and the corpus agree and this holds both.

   5. HE CAN READ IT. A line he cannot reach is a line that does not exist to
      him. The talk card he already opens carries what he last heard and the
      question it leaves open.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  /* ---- A. THE LOG ITSELF, headless -------------------------------------- */
  global.window = global;
  const K = require(path.join(ROOT, 'engine/bohemia_known.js'));
  const X = require(path.join(ROOT, 'engine/bohemia_exchanges.js'));

  const leaks = X.EXCHANGES.filter(e => e.leaks);
  ok('A1 there are facts in the world worth overhearing (' + leaks.length + ')', leaks.length >= 8);

  /* A2: EVERY LEAK CARRIES BOTH HALVES. Q018.W3 asks for known AND implied. */
  const halfBaked = leaks.filter(e => !e.subject || !e.implies);
  ok('A2 every leak names a subject and the question it leaves open ('
    + halfBaked.length + ' do not)', halfBaked.length === 0,
    halfBaked.map(e => e.id).join(' '));

  /* A3: AND NOT ONE OF THEM POINTS AT A PLACE. No coordinate, no cell, no
     "go to". A waypoint in the words would defeat the whole finding. */
  const pointy = leaks.filter(e => /\b\d{3,}\b|go to |head to |marker|waypoint/i.test(e.implies));
  ok('A3 no leak places a waypoint (' + pointy.length + ')', pointy.length === 0,
    pointy.map(e => e.id).join(' '));

  const log = K.make();
  ok('A4 a fresh log is empty', log.count() === 0 && log.all().length === 0);

  const e0 = leaks[0], e1 = leaks[1];
  log.note({ id: e0.id, subject: e0.subject, implies: e0.implies, line: e0.turns[3], day: 1 });
  log.note({ id: e1.id, subject: e1.subject, implies: e1.implies, line: e1.turns[3], day: 1 });
  ok('A5 hearing something puts it in the log', log.count() === 2);

  /* A6: HEARING IT AGAIN IS NOT LEARNING IT AGAIN, and it must not reorder --
     the ORDER you learned things in is part of what you know. */
  const firstBefore = log.all()[log.all().length - 1].id;
  log.note({ id: e0.id, subject: e0.subject, implies: e0.implies, line: 'x', day: 9 });
  ok('A6 hearing it twice counts but does not duplicate or reshuffle ('
    + log.count() + ' rows, times=' + log.get(e0.id).times + ')',
    log.count() === 2 && log.get(e0.id).times === 2
    && log.all()[log.all().length - 1].id === firstBefore);

  ok('A7 a fact with nothing behind it is refused', log.note({ id: 'junk' }) === null
    && log.note({ id: 'j2', subject: 'water' }) === null);

  ok('A8 it answers what you know about one subject',
    log.knows(e0.subject) === true && log.knows('a subject nobody mentions') === false);

  const back = K.make(log.serialize());
  ok('A9 it survives being written down and read back',
    back.count() === log.count() && back.knows(e0.subject));

  /* ---- B. THE STREET ----------------------------------------------------- */
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  const boot = async () => {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    const _runTab = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (!t) return false;
      t.click(); return true;
    });
    ok('the RUN tab exists in the alpha and was tapped', _runTab === true);
    await SETTLE(page, 16000);
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof LANDED !== 'undefined' && typeof knownLoad === 'function')) return f; }
      catch (_e) {}
    }
    return null;
  };

  try {
    let city = await boot();
    ok('B1 the log reached the frame the player actually looks at', !!city);
    if (!city) throw new Error('no city frame');

    await city.evaluate(() => { if (MODE !== 'human') { swapMode(); HC = HZOOM; } render(); });
    await SETTLE(page, 2200);

    /* stand where people are: a spread neighbourhood is one household per
       subdivision BY HIS 7/29 RULING, so a conversation lives in a settlement.
       *** AND "WHERE PEOPLE ARE" MOVED ON 9/6, SO THIS HAD TO. *** This stood
       beside the FIRST RESIDENT'S FRONT DOOR, which was where everybody was while
       every person walked a private ray from their own doorstep. LIFE + CITY's
       A BEARING IS A PLACE (9/6) sends the working half of a settlement to shared
       places during the day, so a doorstep at noon is now an empty street and the
       leg below heard one conversation instead of two -- the mechanism working,
       reported as the mechanism missing. The claim is unchanged and so is the
       difficulty: two conversations have to accumulate ON THEIR OWN, driven only
       by rendering. It is just asked where the settlement actually is.
       Falls back to the doorstep when a settlement has no place, so ground the art
       has not filled in is measured exactly as it was.
       Record: records/BOHEMIA_A_BEARING_IS_A_PLACE_9_6_26.md */
    const found = await city.evaluate(() => {
      BohemiaPopulation.setDial(20);
      /* *** AND PIN THE HOUR, BECAUSE THIS LEG'S OWN COMMENT DEMANDS IT. *** B5
         below already says "A GATE THAT FAILS INTERMITTENTLY IS WORSE THAN NO
         GATE", and it was still choosing its spot at whatever minute the page
         happened to have booted to -- which decides whether the settlement is
         indoors, out at work, or sheltering from the afternoon heat. Measured
         9/6: the same code answered 21/0 and 20/1 on consecutive runs. Mid-morning
         is when this valley is outdoors (alive_gate measures two thirds of it out
         at 10:00), so the leg asks its question at the hour the question has an
         answer, every time. */
      try { T.min = 10 * 60; if (typeof DAY !== 'undefined') DAY.min = 10 * 60; } catch (e) {}
      const NB = BohemiaPopulation.NB;
      for (let ny = 0; ny < 24; ny++) for (let nx = 0; nx < 24; nx++) {
        if (BohemiaPopulation.zoneAt(om, POWER, nx * NB, ny * NB, seed) !== 'cluster') continue;
        const ppl = pplPeople(nx, ny);
        if (ppl.length < 5) continue;
        /* THE DENSEST SPOT RIGHT NOW, asked of the people themselves rather than
           guessed from a doorstep or from place index 0 -- only the people with
           one particular bearing go to any one place, and a third of a settlement
           works alone by trade. Standing beside whichever body has the most
           neighbours is what "stand where people are" actually means, and it is
           the same sentence this comment always carried. */
        let at = null, most = -1;
        for (const a of ppl) {
          const pa = pplAt(a);
          let n = 0;
          for (const b of ppl) {
            const pb = pplAt(b);
            if (Math.max(Math.abs(pa[0] - pb[0]), Math.abs(pa[1] - pb[1])) <= 6) n++;
          }
          if (n > most) {
            for (const d of [[1,0],[-1,0],[0,1],[0,-1]]) {
              if (pplStandable(pa[0] + d[0], pa[1] + d[1])) {
                most = n; at = [pa[0] + d[0], pa[1] + d[1]]; break;
              }
            }
          }
        }
        if (!at) at = [ppl[0].home[0] + 1, ppl[0].home[1] + 1];
        hx = at[0]; hy = at[1];
        city.x = (nx * NB) | 0; city.y = (ny * NB) | 0;
        render();
        return true;
      }
      return false;
    });
    ok('B2 there is a settlement to stand in', found);
    await SETTLE(page, 2200);

    ok('B3 the log starts empty', await city.evaluate(() => knownLoad().count()) === 0);

    /* B4: WALK OFF HALFWAY AND YOU LEARN NOTHING. Start a leaking conversation,
       hear one turn, leave. This is the claim that makes staying worth
       anything, so it is asserted before the happy path. */
    const bailed = await city.evaluate(() => {
      const leak = BohemiaExchanges.EXCHANGES.find(e => e.leaks);
      const heard = BohemiaExchanges.heard(leak);
      XCH.on = true; XCH.turns = heard; XCH.i = 0; XCH.id = leak.id;
      XCH.a = BARK_DREW[0] && BARK_DREW[0].p; XCH.b = BARK_DREW[1] && BARK_DREW[1].p;
      XCH.atA = BARK_DREW[0] && BARK_DREW[0].at; XCH.atB = BARK_DREW[1] && BARK_DREW[1].at;
      xchSay(performance.now());           /* one turn only */
      XCH.on = false;                      /* he walked away */
      return knownLoad().count();
    });
    ok('B4 walking off mid-conversation teaches you nothing (' + bailed + ' learned)',
      bailed === 0);

    /* B5: STAY, AND THE STREET FILLS THE LOG BY ITSELF. Driven by rendering,
       never by calling the recorder.
       DRIVEN UNTIL IT HAPPENS, NOT FOR A FIXED COUNT. Only 11 of 31
       conversations leak, and which pair says which is deterministic per pair
       but arbitrary from the gate's point of view, so a fixed 130 renders
       returned 4 facts one run and 1 the next. A GATE THAT FAILS INTERMITTENTLY
       IS WORSE THAN NO GATE: it teaches everybody to re-run it until it goes
       green, which is how a real failure gets waved through. So this walks a
       bounded distance and stops the moment the claim is satisfied. */
    /* *** THE BOUND WAS THE COIN FLIP, AND IT IS MEASURED NOW RATHER THAN GUESSED.
       *** This waited 260 renders. Measured 9/6 on two consecutive runs of the same
       code, the number of renders it actually takes for two conversations to leak:
       120 and 380. THE OLD BOUND SAT IN THE MIDDLE OF THE NATURAL SPREAD, which is
       exactly a coin flip, and it is why this leg answered 21/0 and 20/1 by turns.
       The claim was never in doubt: both runs reached it. LIFE + CITY's A BEARING
       IS A PLACE (9/6) sends the working half of a settlement to shared places and
       leaves the solitary trades walking alone, which thins the pairs standing
       close enough to overhear near any one spot and stretched the tail.
       900 is a little over twice the slowest run observed. The leg is not weaker:
       it still requires two conversations to accumulate ON THEIR OWN, driven only
       by rendering, and stubbing knownHeard() to return null still takes it and
       three others red. And it PRINTS what it took, so the next person who sees
       this wobble reads the number instead of re-deriving it.
       Record: records/BOHEMIA_A_BEARING_IS_A_PLACE_9_6_26.md */
    let __took = -1;
    for (let i = 0; i < 900; i++) {
      await city.evaluate(() => render());
      await SETTLE(page, 260);
      if (i % 10 === 9) {
        const n = await city.evaluate(() => knownLoad().count());
        if (n >= 2) { __took = i + 1; break; }
      }
    }
    console.log('    [probe] two facts took ' + __took + ' renders');
    const after = await city.evaluate(() => {
      const k = knownLoad();
      return { n: k.count(), subs: k.subjects().length, rows: k.all() };
    });
    ok('B5 standing on a street fills the log ON ITS OWN (' + after.n + ' facts across '
      + after.subs + ' subjects)', after.n >= 2);

    /* B6: AND THE QUOTED LINE IS THE ONE THAT CARRIES THE FACT -- the LAST
       turn, never the one you joined on. Measured, not assumed: quoting the
       join turn produced `HEARD: "Where then."`. */
    const wrongLine = after.rows.filter(r => {
      const x = X.EXCHANGES.find(e => e.id === r.id);
      return x && r.line !== x.turns[x.turns.length - 1];
    });
    ok('B6 the line it writes down is the one carrying the fact (' + wrongLine.length
      + ' wrong)', wrongLine.length === 0,
      wrongLine.map(r => r.id + ': ' + r.line).slice(0, 2).join(' | '));

    /* B7: NOTHING STORED POINTS ANYWHERE. */
    const stored = await city.evaluate(() => localStorage.getItem('boh.city.known') || '');
    ok('B7 nothing in the log is a waypoint',
      stored.length > 0 && !/"cell"|"at"\s*:\s*\[|"x"\s*:\s*\d/.test(stored));

    /* B8: HE CAN READ IT on a surface he already opens. */
    const card = await city.evaluate(() => {
      ctOpen();
      const c = document.getElementById('ctcard');
      return c && c.style.display === 'block' ? (c.innerText || '') : '';
    });
    ok('B8 the talk card shows what he heard and what it leaves open',
      /YOU HEARD/.test(card) && /WHICH LEAVES/.test(card) && /THINGS YOU KNOW/.test(card),
      card.slice(0, 120).replace(/\n/g, ' / '));

    /* B9: IT SURVIVES A RELOAD. A notebook that forgets is not a notebook. */
    const before = after.n;
    city = await boot();
    const survived = await city.evaluate(() => knownLoad().count());
    ok('B9 it survives a reload (' + before + ' -> ' + survived + ')',
      survived === before && survived > 0);

    ok('B10 nothing threw while he listened', errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('WHAT YOU HEARD GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
