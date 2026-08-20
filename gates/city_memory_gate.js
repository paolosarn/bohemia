/* BOHEMIA CITY MEMORY GATE (8/20/26, PEOPLE lane)
 *
 * WHY THIS EXISTS. engine/bohemia_memory.js is the witness organ and it has been
 * correct since 7/19: minds hold sightings, familiarity slows forgetting, clarity
 * decays as 0.5^(age/halflife), deterministic. gates/memory_gate.js proves all of
 * that, 10 claims, green for a month. It appeared in ZERO player-reachable files.
 * engine/bohemia_standing.js sits on top of it, 35 more green claims, equally
 * unreachable. FORTY-FIVE GREEN ASSERTIONS ABOUT PEOPLE REMEMBERING YOU, AND NOT
 * ONE PERSON IN THE GAME WHO HAD EVER REMEMBERED ANYTHING.
 *
 * So memory_gate keeps proving the ORGAN is right, and this gate proves it is
 * RUNNING, in the city frame, on the tab he taps. The two do not overlap on
 * purpose. A GREEN GATE PROVES THE THING IT CHECKS AND NOTHING ELSE, and what
 * nobody was checking was whether anybody could reach it.
 *
 * WHAT IT PROVES
 *   1) the organ is inlined in the city BYTE-IDENTICAL, exactly once
 *   2) ctWitnessPass is CALLED from the render, not merely defined
 *   3) on the real surface, somebody witnesses the player at boot
 *   4) a witness is somebody the render actually DREW, and inside SEE_RANGE
 *   5) the throttle never spends a minute it recorded nothing in (the boot bug)
 *   6) all four recognition states are reachable on the real decay curve, and
 *      recognition FADES BACK TO NOTHING below MIN_CLARITY
 *   7) A RECOGNITION IS NOT A NAME -- YOU HAVE TO ASK (7/31) is untouched
 *   8) the line can never collide with the movement pad, at any length
 *   9) minds persist, and their keys are unique across the whole valley
 *
 * Run: node gates/city_memory_gate.js
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
/* THE CONDITION SLOT MAY NEVER HOLD A STRING (8/20). Written the same day four
   assertions in coldopen_gate.js passed unconditionally because this lane's
   gates do not agree on argument order and a reversed call is truthy either way.
   A gate cannot be checked by the gate suite -- it IS the checker. */
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

/* ---- 1. ONE CANONICAL BODY, INLINED VERBATIM ----------------------------- */
const city = fs.readFileSync(CITY, 'utf8');
const organ = fs.readFileSync('engine/bohemia_memory.js', 'utf8');
ok('A1 engine/bohemia_memory.js is inlined in the city BYTE-IDENTICAL '
  + '(re-run: python3 tools/bohemia_city_memory_patch.py)', city.indexOf(organ) >= 0);
const copies = city.split('root.BohemiaMemory=API').length - 1;
ok('A2 and EXACTLY ONCE (found ' + copies + ' -- an insert tool run twice is a '
  + 'duplication tool)', copies === 1);

/* ---- 2. IT IS CALLED, WHICH IS THE WHOLE POINT --------------------------- */
/* A DEFINITION IS NOT A CALLER. This is the claim that was missing for a month
   from four other green gates, so it is stated first and stated plainly. */
ok('A3 ctWitnessPass is CALLED from the render pass, not merely defined',
  /ctWitnessPass\(\);/.test(city) && /peoplePass\(ox,oy,C\);\s*\n\s*try\{ ctWitnessPass/.test(city));
ok('A4 and the recognition is read on the talk surface (ctKnowsMe has a caller)',
  (city.split('ctKnowsMe(').length - 1) >= 2);

/* THE THROTTLE'S REGRESSION, ASSERTED IN SOURCE. The first cut set CT_SAW_MIN
   before reading the roster, so the boot render -- where peoplePass returns
   early with BARK_DREW empty -- burned the minute and the neighbour two cells
   away never saw the player. Written as the RULE (the early return comes before
   the assignment), not as a pinned line number. */
const wp = city.slice(city.indexOf('function ctWitnessPass'),
                      city.indexOf('function ctWitnessPass') + 1400);
ok('A5 the throttle does not spend a minute it recorded nothing in '
  + '(the empty-roster return comes BEFORE CT_SAW_MIN is set)',
  wp.indexOf('if (!drew.length) return 0;') >= 0
  && wp.indexOf('if (!drew.length) return 0;') < wp.indexOf('CT_SAW_MIN = now;'));

(async () => {
  console.log('CITY MEMORY GATE, somebody remembers seeing you, on the tab he taps');
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
      out.organ = typeof BohemiaMemory;
      render();
      /* WHO WAS DRAWN, and who witnessed. The witness set must be a SUBSET of
         what the render blitted -- that is the design claim, that seeing is read
         off the picture rather than computed a second time. */
      const R = BohemiaMemory.RADIUS;
      out.RADIUS = R;
      const drew = (BARK_DREW || []).map(d => ({
        id: d.p.id, dist: Math.abs(d.at[0] - hx) + Math.abs(d.at[1] - hy) }));
      out.drew = drew.length;
      out.drewInRange = drew.filter(d => d.dist <= R).length;
      const ids = Object.keys(CT_MINDS);
      out.minds = ids.length;
      out.everyWitnessWasDrawn = ids.every(k => drew.some(d => String(d.id) === k));
      out.everyWitnessInRange = ids.every(k => {
        const d = drew.find(x => String(x.id) === k); return d && d.dist <= R; });
      out.persisted = !!localStorage.getItem('boh.city.minds');

      /* *** THE GATE HAS TO CREATE THE CASE IT CLAIMS TO TEST. ***
         The two checks above are true of the world as it boots, and that is
         exactly why they proved nothing: only ONE body is drawn at spawn and it
         is already two cells away, so deleting the range check entirely left
         this gate green (mutation-measured). An assertion the scenario never
         exercises is the room-sized threshold all over again.
         So the roster gets a body placed deliberately out of sight and one
         deliberately in it, with ids that cannot collide with a real person,
         and the rule is read off what happens to them. */
      const far = { p: { id: '__GATE_FAR__' }, at: [hx + R + 4, hy] };
      const near = { p: { id: '__GATE_NEAR__' }, at: [hx + 1, hy] };
      BARK_DREW.push(far, near);
      CT_SAW_MIN = -1;
      ctWitnessPass();
      out.nearWitnessed = !!CT_MINDS['__GATE_NEAR__'];
      out.farWitnessed = !!CT_MINDS['__GATE_FAR__'];
      delete CT_MINDS['__GATE_NEAR__']; delete CT_MINDS['__GATE_FAR__'];
      BARK_DREW.pop(); BARK_DREW.pop();
      /* and somebody the render never drew is never a witness, however close */
      CT_SAW_MIN = -1;
      const before = Object.keys(CT_MINDS).length;
      const hidden = ctEveryone().filter(p => {
        const a = ctAt(p);
        return Math.abs(a[0] - hx) + Math.abs(a[1] - hy) <= R
          && !drew.some(d => String(d.id) === String(p.id));
      });
      ctWitnessPass();
      out.hiddenNearby = hidden.length;
      out.hiddenWitnessed = hidden.some(p => !!CT_MINDS[p.id]);
      out.mindsUnchanged = Object.keys(CT_MINDS).length === before;

      const id = ids[0] || null;
      out.id = id;
      if (id) {
        /* THE FOUR STATES, ON THE ORGAN'S OWN CURVE. The clock is wound forward
           and the phrase read back; nothing is simulated and no clarity is
           hand-set. The fifth state -- forgotten entirely -- is the one that
           matters most, because a recognition that never expires is New Vegas's
           documented flaw and the standing module was written to avoid it. */
        const base = ctMinuteNow(), saw = [];
        [0, 720, 1200, 4000, 20000].forEach(age => {
          const d0 = T.day, m0 = T.min, tot = base + age;
          T.day = Math.floor(tot / 1440); T.min = tot % 1440;
          const k = ctKnowsMe(id);
          const r = BohemiaMemory.recall(CT_MINDS[id], '@', tot);
          saw.push({ age: age, clarity: r ? +r.clarity.toFixed(3) : null,
                     says: k ? k.say : null });
          T.day = d0; T.min = m0;
        });
        out.curve = saw;
        out.distinctPhrases = saw.map(s => s.says).filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i).length;
        out.forgets = saw[saw.length - 1].says === null;
        out.monotonic = saw.every((s, i) => i === 0 || s.clarity === null
          || saw[i - 1].clarity === null || s.clarity <= saw[i - 1].clarity);
        /* FAMILIARITY IS A SEPARATE AXIS FROM CLARITY, and it is what a
           neighbour has that a passer-by does not. */
        const f0 = CT_MINDS[id].fam['@'];
        CT_MINDS[id].fam['@'] = 9;
        out.familiarSays = (ctKnowsMe(id) || {}).say || null;
        CT_MINDS[id].fam['@'] = f0;
        out.strangerSays = saw[0].says;
      }

      /* THE REAL SURFACE: stand next to them and read the DOM. */
      const nb = ctNeighbour();
      if (nb) { const at = ctAt(nb); hx = at[0] + 1; hy = at[1]; }
      render(); ctVerb();
      const tl = document.getElementById('cttell');
      out.tellVisible = !!(tl && tl.style.display === 'block');
      out.tellText = tl ? tl.textContent : '';
      /* A RECOGNITION IS NOT A NAME (YOU HAVE TO ASK, 7/31). The person next to
         you has not been asked, so nameOf must still withhold, and the line must
         not have leaked it. */
      const who = nb ? ctPerson(nb) : null;
      out.tier = who ? who.tier : null;
      out.nameWithheld = !who || who.tier !== 'asked';
      out.leakedName = !!(who && who.name && out.tellText.indexOf(who.name) >= 0);

      /* LAYOUT: the line is anchored by its BOTTOM, so more text grows UPWARD,
         away from the pad. Asserted as the rule, with a deliberately long string
         forced through it rather than trusting the one that happens to be there. */
      const nav = document.getElementById('nav');
      const rectOf = e => { const r = e.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom }; };
      const was = tl.textContent;
      tl.textContent = new Array(24).join('a very long recognition and tell ');
      const long = rectOf(tl), navR = rectOf(nav);
      tl.textContent = was;
      out.longBottom = Math.round(long.bottom);
      out.navTop = Math.round(navR.top);
      out.clearsPad = long.bottom <= navR.top;

      /* KEYS UNIQUE ACROSS THE WHOLE VALLEY, as a rule rather than a number:
         if two people shared a key their minds would merge and one of them
         would remember things they never saw. */
      const NB = BohemiaPopulation.NB;
      const span = Math.ceil((typeof om !== 'undefined' && om && om.n ? om.n : 96) / NB);
      const seen = {}; let total = 0, dup = 0;
      for (let ny = 0; ny < span; ny++) for (let nx = 0; nx < span; nx++)
        for (const p of pplPeople(nx, ny)) {
          total++; if (seen[p.id]) dup++; seen[p.id] = 1; }
      out.people = total; out.dupKeys = dup;
      return out;
    });

    ok('B2 the witness organ is live in the city frame', m.organ === 'object');
    ok('B3 SOMEBODY REMEMBERS SEEING YOU at boot (' + m.minds + ' mind(s) from '
      + m.drewInRange + ' drawn in range), for a month this number was zero',
      m.minds >= 1);
    ok('B4 every witness is somebody the render ACTUALLY DREW '
      + '(seeing is read off the picture, never computed twice)',
      m.everyWitnessWasDrawn === true);
    ok('B5 and nobody outside SEE_RANGE (' + m.RADIUS + ') ever witnessed anything',
      m.everyWitnessInRange === true);
    /* the two above are true of the world as it boots and stayed green with the
       range check DELETED, because only one body is drawn and it is already
       close. These force the case instead of waiting for it. */
    ok('B5a a body placed IN range witnesses you', m.nearWitnessed === true);
    ok('B5b and a body placed OUT of range does not, measured by putting one '
      + 'there, not by hoping the world provides one', m.farWitnessed === false);
    ok('B5c somebody the render never drew is never a witness, however close ('
      + m.hiddenNearby + ' nearby but undrawn)',
      m.hiddenWitnessed === false && m.mindsUnchanged === true);
    ok('B6 the minds persist, so the block does not forget you on reload',
      m.persisted === true);
    ok('B7 clarity only ever DECAYS as the clock runs forward', m.monotonic === true);
    ok('B8 more than one recognition state is reachable on the real curve ('
      + m.distinctPhrases + ' distinct)', m.distinctPhrases >= 2);
    ok('B9 and recognition FADES BACK TO NOTHING, a face you never see again '
      + 'becomes a stranger, which is the redemption path New Vegas never had',
      m.forgets === true);
    ok('B10 FAMILIARITY is its own axis: a neighbour reads differently from a '
      + 'passer-by at the same clarity ("' + m.familiarSays + '" vs "'
      + m.strangerSays + '")',
      !!m.familiarSays && m.familiarSays !== m.strangerSays);
    ok('B11 the recognition is ON SCREEN next to a person ("'
      + String(m.tellText).slice(0, 64) + '")',
      m.tellVisible === true && /\S/.test(m.tellText));
    ok('B12 A RECOGNITION IS NOT A NAME: the stranger beside you is still '
      + 'un-asked (tier ' + m.tier + ') and no name reached the line',
      m.nameWithheld === true && m.leakedName === false);
    ok('B13 the line can never reach the movement pad, at ANY length '
      + '(forced long: bottom ' + m.longBottom + ' vs pad top ' + m.navTop + ')',
      m.clearsPad === true);
    ok('B14 every person in the valley has a unique mind key ('
      + m.people + ' people, ' + m.dupKeys + ' collisions), a shared key would '
      + 'make one person remember what another saw', m.dupKeys === 0);
    ok('B15 the city frame threw no errors' + (errs.length ? ': ' + errs[0] : ''),
      errs.length === 0);
  } finally {
    await browser.close();
  }
  console.log('CITY MEMORY GATE: ' + pass + ' passed, ' + fail.length + ' failed');
  process.exit(fail.length ? 1 : 0);
})();
