/* ============================================================================
   COMMITMENT GATE (8/15/26, FACTIONS lane) — THE WALL IS REAL, IT IS THE APPROVED
   ONE, AND COMMITTING IS VISIBLE TO PEOPLE WHO ARE NOT IN THE ROOM.

   Law:  laws/BOHEMIA_ADDENDUM_THE_WALL_AND_WHO_FINDS_OUT_8_15_26.md
   Tool: tools/bohemia_commitment.py  (engine/bohemia_commitment.js is GENERATED)

   WHAT THIS EXISTS BECAUSE OF. On 8/12 this lane shipped a five-rung ladder and
   you could climb all of it by pressing one button ten times. Nothing stopped
   you and nobody else in the valley ever heard about it. The mechanism that
   stops it had been sitting in engine/bohemia_resolve.js since 7/26 — APPROVED
   by Paolo — with ZERO CALLERS for twenty days.

   THE THREE THINGS THIS GATE IS ACTUALLY FOR, none of which a name-grep can do:
     1. THE WALL IS ADOPTED, NOT REBUILT. Proven by DELETING the dependency and
        asserting the module refuses to run. A module that silently falls back to
        its own clamp is the two-systems-disagreeing bug wearing a seatbelt.
     2. THE CEILINGS ARE DERIVED, NOT TYPED. Re-derived here from the shipped
        RUNGS table and compared. If somebody tunes the ladder and the walls do
        not follow, this goes red.
     3. THE MECHANIC ACTUALLY DISCRIMINATES. A rule where everybody hears is the
        same non-mechanic as one where nobody does, so this measures the spread
        at three real scales rather than checking that a function returns.

   node gates/commitment_gate.js
   ============================================================================ */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const GEN = path.join(ROOT, 'engine/bohemia_commitment.js');

const S = require(path.join(ROOT, 'engine/bohemia_commitment.js'));
const T = require(path.join(ROOT, 'engine/bohemia_ties.js'));
const B = require(path.join(ROOT, 'engine/bohemia_belonging.js'));
const R = require(path.join(ROOT, 'engine/bohemia_resolve.js'));

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}
function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* A roster with REAL foci, built the way the world builds them: people share a
   roof by id prefix, share a job site by district+dir+dist, share an outfit by
   faction. Nothing here is random — the same call gives the same valley. */
const FACS = ['CHURCH', 'CARTEL', 'REMNANTS', 'MOB', 'TRADES', 'BLUES', 'REDS',
              'NETWORK', 'KARENS', 'CARAVANS', 'VOLUNTEERS', 'ANARCHISTS',
              'HOMELESS', 'COLORFUL'];
function roster(n, affilRate) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const site = (i % 5 === 0) ? null : { kind: 'site', district: 'd' + (i % 9), dir: 'N', dist: (i % 7) + 1 };
    const f = ((i * 7919) % 100) / 100 < affilRate ? FACS[(i * 31) % FACS.length] : null;
    out.push({ id: 'H' + Math.floor(i / 3) + '-' + (i % 3), faction: f, job: site || { kind: 'scav' } });
  }
  return out;
}

/* ------------------------------------------------- A. THE WALL IS THE APPROVED ONE */
function partA() {
  console.log('A. THE WALL IS ADOPTED, NOT REBUILT');

  /* A1 IS THE ONE THAT MATTERS. Every other check here would still pass if the
     module carried its own private clamp, so this deletes the dependency in a
     clean child process and demands a refusal. */
  let refused = '';
  try {
    execFileSync('node', ['-e',
      "const p=require.resolve('./engine/bohemia_resolve.js');" +
      "require.cache[p]={id:p,filename:p,loaded:true,exports:{}};" +   /* present, but no makeCeiling */
      "const S=require('./engine/bohemia_commitment.js');" +
      "S.wallOf('none',0);"],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { refused = String((e.stderr || '') + (e.stdout || '')); }
  ok('A1 with the approved ceiling absent the module REFUSES rather than clamping itself',
    /makeCeiling is required and absent|ADOPTS the approved ceiling/.test(refused),
    'a silent fallback clamp is exactly the two-systems bug this lane has fixed four times; got: '
    + refused.slice(0, 160));
  ok('A2 the approved mechanism it adopts is the one Paolo signed off',
    typeof R.makeCeiling === 'function' &&
    /only a commitment moves it/i.test(R.LEARNED_FROM.ceiling));

  /* THE CEILINGS ARE DERIVED. Re-derive from the shipped ladder and compare, so
     tuning the ladder without the walls following goes red. */
  const rungs = B.RUNGS.map(r => r.at);
  const want = S.STAGES.map((s, n) => (n + 3 < rungs.length ? rungs[n + 3] - 1 : null));
  const got = S.STAGES.map(s => s.ceiling);
  ok('A3 every ceiling is DERIVED from the shipped RUNGS, not typed',
    JSON.stringify(want) === JSON.stringify(got),
    'rungs ' + JSON.stringify(rungs) + ' -> want ' + JSON.stringify(want) + ' got ' + JSON.stringify(got));
  ok('A4 the derivation is the stated rule: each commitment buys exactly one more rung',
    S.STAGES[0].reaches === 'USEFUL' && S.STAGES[0].blocks === 'COUNTED' &&
    S.STAGES[1].reaches === 'COUNTED' && S.STAGES[1].blocks === 'INSIDE' &&
    S.STAGES[2].blocks === null,
    JSON.stringify(S.STAGES.map(s => s.reaches + '/' + s.blocks)));

  /* THE CLAMP ACTUALLY BITES. */
  const atWall = S.wallOf('none', 5);
  ok('A5 favours run out of road: at the wall, more of the same gains nothing',
    atWall.atWall === true && S.give('none', 5, 1).gained === 0 &&
    S.give('none', 5, 1).capped === true);
  ok('A6 below the wall they still count',
    S.wallOf('none', 2).atWall === false && S.give('none', 2, 1).gained === 1);
  ok('A7 the wall is legible BEFORE you hit it, which is the difference between hard and unfair',
    S.wallOf('none', 2).room === 3 && !!atWall.passWord && !!atWall.blocks);

  /* COMMITTING IS THE ONLY THING THAT PASSES IT. */
  const c = S.commit('none', 5);
  ok('A8 a commitment is the only thing that moves the wall',
    c.moved === true && c.state === 'sided' && c.ceiling === 9);
  ok('A9 you cannot commit before you have filled the room you have',
    S.commit('none', 2).moved === false && S.commit('none', 2).reason === 'NOT_EARNED');
  ok('A10 the second commitment removes the wall entirely',
    S.commit('sided', 9).moved === true && S.wallOf('burned', 999).ceiling === Infinity &&
    S.wallOf('burned', 999).atWall === false);
  ok('A11 there is no fourth state to grind toward',
    S.commit('burned', 999).moved === false && S.commit('burned', 999).reason === 'FINAL');

  /* NEGLECT: his words were "more expensive the deeper in you are". */
  ok('A12 neglect grows with the state, per the approved verdict',
    S.neglectFor('none') < S.neglectFor('sided') &&
    S.neglectFor('sided') < S.neglectFor('burned'));
  const ph = S.placeholders();
  /* A13 USED TO COUNT `ph.length === STAGES.length` AND THAT WAS A PROXY, NOT THE
     CLAIM. The law is that every unruled number is tagged and enumerable; "there
     are exactly three of them" is a fact about how many priced facts existed on
     8/15, and it went red the moment a second priced fact (what an outfit that
     HEARS charges you, 8/19) was tagged correctly. Fix the ruler, never the
     target: assert the property, and assert that BOTH priced facts are present
     so the list cannot silently shrink either. */
  ok('A13 every unruled number is TAGGED and enumerable (EVERYTHING COSTS ONE, 8/15)',
    ph.length > 0 && ph.every(p => p.placeholder === true
      && /EVERYTHING COSTS ONE/.test(p.law) && typeof p.what === 'string' && p.what.length > 10),
    JSON.stringify(ph.map(p => p.where)));
  ok('A13b …and BOTH priced facts are in the list — what neglecting them costs, '
    + 'and what an outfit that hears about the commitment takes off you. They '
    + 'derive from the same stage index and they are different facts',
    ph.some(p => /\.neglect$/.test(p.where)) && ph.some(p => /costs\(/.test(p.where))
      && S.STAGES.every(st => ph.some(p => p.where.indexOf(st.state) >= 0)),
    JSON.stringify(ph.map(p => p.where)));
  ok('A14 the DERIVED ceilings are NOT in the tuning list — they are not waiting on a ruling',
    ph.every(p => !/ceiling/i.test(p.where)));

  /* THE SAVE: one writer, three spellings solved once. */
  const sv = { meta: {} };
  S.setState(sv, 'Remnants', 'sided');
  ok('A15 the three faction spellings resolve to one commitment, as they do for the count',
    S.stateOf(sv, 'REMNANTS') === 'sided' && S.stateOf(sv, 'Remnants') === 'sided' &&
    S.stateOf(sv, 'SOCIAL_FORCES') === 'none' &&
    Object.keys(sv.meta.commit).length === 1);
}

/* --------------------------------------------------------- B. WORD TRAVELS */
function partB() {
  console.log('B. COMMITTING IS VISIBLE, AND ONLY WHERE THERE IS A LINE');

  /* THE STRUCTURAL HOLE. Somebody with no shared roof and no shared job site
     cannot hear, however big the valley gets. If this ever passes, the graph
     walk has started inventing edges. */
  const isolated = [
    { id: 'H1-1', faction: 'CHURCH', job: { kind: 'site', district: 'd', dir: 'N', dist: 2 } },
    { id: 'H1-2', faction: 'CARTEL', job: { kind: 'scav' } },
    { id: 'H9-1', faction: 'MOB', job: { kind: 'scav' } }
  ];
  const h1 = S.whoHears('CHURCH', isolated, [0, 0], { ties: T });
  ok('B1 an outfit with no line to you never hears — the structural hole is real',
    !h1.some(h => h.faction === 'MOB'), JSON.stringify(h1.map(h => h.faction)));
  ok('B2 a shared roof leaks it at one hop, and it arrives as fact',
    h1.some(h => h.faction === 'CARTEL' && h.hops === 1 && h.via === 'home') &&
    S.landing(h1.find(h => h.faction === 'CARTEL')).key === 'direct');
  ok('B3 nobody hears about their own outfit',
    !h1.some(h => h.faction === 'CHURCH'));

  /* DISTANCE TURNS A WITNESS INTO A RUMOUR. */
  ok('B4 further away it arrives as a rumour instead',
    S.landing({ faction: 'X', hops: 2, crossed: true }).key === 'secondhand' &&
    S.landing({ faction: 'X', hops: 1, crossed: true }).key === 'direct' &&
    S.landing(null).key === 'silent');

  /* THE THEOREM. A faction focus only ever links two people in the SAME faction,
     so no path can cross a faction line without a home or work step. This is
     asserted rather than assumed BECAUSE THE FIRST VERSION OF THE LANDING RULE
     HAD A BRANCH FOR THE OPPOSITE CASE AND THAT BRANCH COULD NEVER FIRE. */
  const big = roster(300, 0.30);
  const hBig = S.whoHears('CHURCH', big, [0, 0], { ties: T });
  ok('B5 THE THEOREM: every bridge across a faction line is cross-cutting, always',
    hBig.length > 0 && hBig.every(h => h.crossed === true &&
      (h.via === 'home' || h.via === 'work')),
    JSON.stringify(hBig.map(h => h.via)));

  /* IT DISCRIMINATES. Everybody hearing is the same non-mechanic as nobody
     hearing, so this measures the actual spread at three scales. */
  const small = S.whoHears('CHURCH', roster(40, 0.30), [0, 0], { ties: T });
  const mid = S.whoHears('CHURCH', roster(120, 0.30), [0, 0], { ties: T });
  ok('B6 a thin block leaks to almost nobody',
    small.length <= 2, small.length + ' outfits');
  ok('B7 the whole valley leaks to some but never all of them',
    hBig.length >= 3 && hBig.length <= FACS.length - 3,
    hBig.length + ' of ' + (FACS.length - 1) + ' other outfits');
  ok('B8 density is what moves it, so the answer is about the world not the dice',
    small.length < mid.length && mid.length < hBig.length,
    [small.length, mid.length, hBig.length].join(' < '));
  ok('B9 both landings occur at valley scale — neither branch is dead code',
    hBig.some(h => S.landing(h).key === 'direct') &&
    hBig.some(h => S.landing(h).key === 'secondhand'),
    JSON.stringify(hBig.map(h => S.landing(h).key)));

  /* DETERMINISM. Standing is the currency; a currency that changes when you look
     at it twice is not one. */
  ok('B10 the same valley gives the same answer every time',
    JSON.stringify(S.whoHears('CHURCH', roster(300, 0.30), [0, 0], { ties: T })) ===
    JSON.stringify(hBig));
  ok('B11 an empty or unaffiliated valley answers nothing rather than guessing',
    S.whoHears('CHURCH', [], [0, 0], { ties: T }).length === 0 &&
    S.whoHears('CHURCH', roster(60, 0), [0, 0], { ties: T }).length === 0 &&
    S.whoHears(null, big, [0, 0], { ties: T }).length === 0);
  ok('B12 it names WHO carried it, so the leak is a person and not a statistic',
    hBig.every(h => !!h.through && big.some(a => a.id === h.through)));
}

/* -------------------------------------------------------------- C. TERTIUS */
function partC() {
  console.log('C. THE BROKER\'S POSITION, AND ITS SIGN');

  const big = roster(300, 0.30);
  const heard = S.whoHears('CHURCH', big, [0, 0], { ties: T });
  const reached = heard[0].faction;
  const unreached = FACS.find(f => f !== 'CHURCH' && !heard.some(h => h.faction === f));

  ok('C1 standing with one outfit is not a brokerage at all',
    S.tertius({ CHURCH: 3 }, heard) === null);
  ok('C2 two outfits with no line between them: you are the only route (GAUDENS)',
    !!unreached && S.tertius({ CHURCH: 3, [unreached]: 2 }, heard).key === 'gaudens',
    'unreached=' + unreached);
  ok('C3 two outfits that CAN hear each other: both sides see you (DOLENS)',
    S.tertius({ CHURCH: 3, [reached]: 2 }, heard).key === 'dolens',
    'reached=' + reached);
  ok('C4 the sign flips on the graph, not on an opinion about who hates who',
    S.tertius({ CHURCH: 3, [reached]: 2 }, heard).exposed.length === 1 &&
    S.tertius({ CHURCH: 3, [unreached]: 2 }, heard).exposed.length === 0);
  ok('C5 standing you do not actually have does not count as a side',
    S.tertius({ CHURCH: 3, [reached]: 0 }, heard) === null);
}

/* ------------------------------------------- D. IT IS ON THE WALKED SURFACE */
async function partD() {
  console.log('D. IT IS ON THE SURFACE HE WALKS, IN A REAL BROWSER');

  const city = fs.readFileSync(CITY, 'utf8');
  ok('D1 the organ is inlined in the city with the ENGINE SYNC banner',
    city.includes('==== engine/bohemia_commitment.js ===='));
  ok('D2 the approved ceiling it depends on is inlined too',
    city.includes('==== engine/bohemia_resolve.js ===='),
    'the module refuses without it, so shipping one and not the other is a dead card');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    const out = await page.evaluate(() => {
      /* NO STUB. The previous version of this probe replaced window.ctFactionOf
         with a function returning 'Church' — and that is exactly how this lane
         shipped four green turns onto a surface where NOBODY had a faction at
         all, because the inlined agents body was thirteen days stale and the
         bridge swallowed the TypeError. A test that mocks the broken thing
         cannot see that it is broken. So: walk the real valley, find a REAL
         affiliated person, and use them. */
      const bases = ctBases() || {};
      let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        for (const p of ctEveryone()) {
          const f = ctFactionOf(p);
          if (f) { who = p; fid = f; break; }
        }
        if (who) break;
      }
      if (!who) return { skip: 'NOBODY IN THE VALLEY RUNS WITH ANYBODY — the faction '
                             + 'layer is dark on the walked surface' };
      const r = { fid: fid, affiliatedFound: true };
      /* fill the room the way a player would: acts until the wall bites. */
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.gave[fid] = 5;
      sv.meta.commit = {};
      /* STAND WHERE THIS PERSON IS THE ONE WHO ANSWERS (8/28). ctOpen and
         ctAdjacent show whoever is NEAREST, and standing at at[0]+1 trusts that
         the chosen body is the only one in reach. That was true while the
         population default was 1 and stopped being true the day it moved to 20:
         the card opens on a stranger and the claim below reports a missing
         feature. A TEST THAT PICKS A PERSON AND THEN TRUSTS THE GAME TO PICK THE
         SAME ONE IS TESTING THE CROWD. Falls back to the old cell if the whole
         ring is somebody else's, so nothing here can be made worse than it was. */
      const at = ctAt(who); let _sb = false;
      for (const _d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]) {
        hx = at[0] + _d[0]; hy = at[1] + _d[1];
        const _a = ctAdjacent(); if (_a && _a.id === who.id) { _sb = true; break; } }
      if (!_sb) { hx = at[0] + 1; hy = at[1]; }
      ctSawCell(); ctOpen();
      r.atWall = document.getElementById('ctcard').innerText;
      r.buttons = [...document.querySelectorAll('#ctcard button')].map(x => x.textContent);
      const cm = document.getElementById('ctcommit');
      r.commitBtn = cm ? cm.textContent : null;
      if (cm) cm.click();
      r.state = ((window.__CT_BELONG || {}).meta || {}).commit || {};
      ctClose(); ctOpen();
      r.after = document.getElementById('ctcard').innerText;
      return r;
    });
    if (out.skip) { ok('D the walked surface has people who run with somebody', false, out.skip); }
    else {
      /* THE REGRESSION THIS TURN FOUND, locked so it cannot come back silently.
         For thirteen days this was false and nothing anywhere went red. */
      ok('D3a REAL people on the walked surface run with real outfits, no stub',
        out.affiliatedFound === true && !!out.fid, String(out.fid));
      ok('D3 the card says the wall is there, and names what it is blocking',
        /THE WALL|GOES NO FURTHER/i.test(out.atWall) && /COUNTED/.test(out.atWall),
        JSON.stringify(out.atWall.slice(0, 200)));
      ok('D4 doing more of the same is NOT offered once it would do nothing',
        !/ctgive/.test(String(out.buttons)) || /WALL/i.test(out.atWall),
        JSON.stringify(out.buttons));
      ok('D5 who will hear is on the card BEFORE you press, not after',
        /WILL HEAR|NOBODY WILL HEAR/i.test(out.atWall),
        'a consequence you discover afterwards is a trap, not a decision');
      ok('D6 there is a commitment to make, in his own words',
        !!out.commitBtn && /side|with them/i.test(out.commitBtn), String(out.commitBtn));
      ok('D7 pressing it actually moves the state, and it persists on redraw',
        Object.keys(out.state).length === 1 &&
        Object.values(out.state)[0] === 'sided',
        JSON.stringify(out.state));
      ok('D8 the card shows the new standing after committing',
        /TOOK A SIDE/i.test(out.after), out.after.split('\n').slice(-6).join(' / '));
    }
    ok('D9 the city threw no errors doing any of that',
      errors.length === 0, errors.slice(0, 3).join(' | '));

    /* THE SHAPE OF THE VALLEY, MEASURED. This is the regression lock for the
       thing that was dark for thirteen days: if the inlined agents body ever
       goes stale again, or the bridge starts swallowing a TypeError again,
       affiliation falls to zero and this goes RED instead of the game just
       going quiet. That is the whole difference between a bug and a world. */
    const shape = await page.evaluate(() => {
      const r = ctValleyRoster(), aff = r.filter(a => a.faction);
      const facs = [...new Set(aff.map(a => a.faction))];
      /* *** ASK IT THE WAY THE GAME ASKS IT. *** This called whoHears with
         {ties} alone and read zero lines everywhere, and the reflex was to go
         tune the seat placer until the number moved. BOTH real call sites --
         the card's cost preview and the card's hear rows -- pass three more
         things, and two of them decide the answer outright:
           keyOf: ctVKey   the valley mints a fresh id per person, and this
                           module keys its whole social graph on the key it is
                           handed, so without it every "H1-1" in the valley is
                           ONE PERSON and the graph collapses. bohemia_ties.js
                           warns about exactly this in its own comment.
           watching        the canon-enemy path, added because an acquaintance
                           walk needs a chain of housemates and workmates
                           between two outfits and in a thin valley there
                           usually is none.
         A gate that calls something the game never calls is measuring its own
         invention. The wrong number was the ruler, not the valley. */
      const opts = { ties: BohemiaTies, keyOf: ctVKey, save: ctBelongSave(),
                     watching: (typeof BohemiaBetween !== 'undefined' ? BohemiaBetween : null) };
      /* *** WHAT "IT DISCRIMINATES" ACTUALLY MEANS, MEASURED RATHER THAN
         ASSUMED. *** This used to count outfits with at least one listener and
         demand the number be BELOW the outfit count -- "somebody out there is
         isolated". That is not a property of the mechanic, it is a property of a
         thin valley. Measured on a synthetic roster this gate builds itself, with
         nothing from the walked surface involved: at 300 people, 1200 and 3000,
         ALL FOURTEEN outfits have at least one listener every time. The claim
         could only ever pass by luck, and it went red the round the valley got
         slightly richer.
         The spread is real and this measures it instead: at 300 people the
         listener counts run 1,1,1,1,3,4,4,4,4,5,6,6,7,7 out of a possible 13. Who
         hears about you depends on who you are. That is the mechanic, and a rule
         where everybody hears everything would show identical sets. */
      const heardBy = {};
      facs.forEach(f => {
        heardBy[f] = BohemiaCommitment.whoHears(f, r, ctCell(), opts)
          .map(h => (h && (h.faction || h)) + '').sort().join(',');
      });
      const distinct = new Set(Object.values(heardBy)).size;
      const sizes = facs.map(f => (heardBy[f] ? heardBy[f].split(',').filter(Boolean).length : 0));
      const lines = facs.filter(f => heardBy[f]);
      return { people: r.length, affiliated: aff.length, outfits: facs.length,
               withLines: lines.length, distinct: distinct,
               min: Math.min.apply(null, sizes), max: Math.max.apply(null, sizes) };
    });
    ok('D10 a real share of the valley runs with somebody, across many outfits',
      shape.people > 100 && shape.affiliated > 10 && shape.outfits >= 5,
      JSON.stringify(shape));
    ok('D11 WHO HEARS ABOUT YOU DEPENDS ON WHO YOU ARE — the outfits do not all '
      + 'get the same answer, which is the only thing that makes this a mechanic '
      + 'rather than a broadcast. The old version of this claim demanded that some '
      + 'outfit be ISOLATED, and that is a fact about a thin valley, not about the '
      + 'rule: on a synthetic roster at 300, 1200 and 3000 people, all fourteen '
      + 'outfits have a listener every time',
      shape.distinct > 1 && shape.withLines >= 1,
      'distinct listener sets ' + shape.distinct + ' across ' + shape.outfits
      + ' outfits, listeners per outfit ' + shape.min + '..' + shape.max + '. '
      + JSON.stringify(shape));
  } finally { await browser.close(); }
}

/* --------------------------------- Ez. THE WALL IS A FENCE, NOT A SIGN */
async function partWall() {
  console.log('Ez. PRESSING THE BUTTON CANNOT WALK THROUGH THE WALL');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    const out = await page.evaluate(() => {
      /* THE CLAIM THAT DID NOT EXIST UNTIL 8/18, AND ITS ABSENCE COST THREE
         SHIPS. Part A proves give() clamps -- true, and the city never called
         give(). Part D proves the card DISPLAYS the wall and that committing
         moves the state -- both true. Nothing ever PRESSED THE ACT BUTTON PAST
         THE WALL on the real surface, so for three days the wall was a sign:
         nine presses reached 9 against a ceiling of 5 with no commitment made.
         "The card shows the right thing" is not "the thing is enforced". */
      /* *** IT NEEDS A PERSON WHOSE ACT CAN REPEAT, NOT THE FIRST AFFILIATED
         BODY IT TRIPS OVER. *** This took whoever came first and assumed their
         card offered the repeatable act. MEASURED 8/28, when the population
         default moved from 1 to 20 and "first affiliated person" became a
         DIFFERENT person: on main it found a Cartel member whose card offers
         ctfavour and nine presses reached the ceiling; here it found a Caravans
         member whose card offers ctgive, which correctly disappears after one
         press, and the wall test reported 1 of 5 as an off-by-one in the wall.
         The claim under test is about THE CEILING, so the person has to be one
         whose act can actually climb to it. Two presses is the whole check:
         somebody who can give twice can give five times. */
      const bases = ctBases() || {};
      let who = null, fid = null, tried = 0;
      const RING0 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
      outer:
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        for (const p of ctEveryone()) {
          const f = ctFactionOf(p); if (!f) continue;
          tried++;
          const at0 = ctAt(p);
          let beside = false;
          for (const d of RING0) {
            hx = at0[0] + d[0]; hy = at0[1] + d[1];
            const a = ctAdjacent(); if (a && a.id === p.id) { beside = true; break; }
          }
          if (!beside) continue;
          /* CLIMB THE WALL WITH THEM, THEN LOOK FOR THE DOOR. Two conditions, and
             both are in the claim itself: the act has to REPEAT (some cards offer
             a once-only give, which cannot climb to a ceiling of five), and the
             commitment is only offered ON THEIR GROUND. Qualifying on the thing
             under test is the only honest way to pick a subject for it. */
          const probe = ctBelongSave();
          const ceil0 = BohemiaCommitment.wallOf('none', 0).ceiling;
          probe.meta.gave = {}; probe.meta.owed = {}; probe.meta.claims = {}; probe.meta.commit = {};
          /* *** IT COUNTED BUTTON PRESSES, NOT STANDING. *** (9/5.) `landed++`
             fired whenever a button existed and was clicked, so an outfit whose
             act is ONCE-ONLY scored a full five while its count moved by one --
             which is exactly the trap this block says it exists to avoid two
             comments up ("the act has to REPEAT... which cannot climb to a
             ceiling of five"). It picked the ANARCHISTS, whose canon is "be
             there ONCE, when it matters", and Ez2 then reported a wall at
             gave:1 of ceiling:5 with nothing wrong with the wall. Qualifying on
             the thing under test means qualifying on the COUNT. */
          let landed = 0;
          for (let t = 0; t < ceil0; t++) {
            T.day = t + 1; probe.meta.gaveDay = {};
            ctClose(); ctSawCell(); ctOpen();
            const was = BohemiaBelonging.gaveOf(probe, f);
            const g = document.getElementById('ctgive') || document.getElementById('ctfavour');
            if (g) g.click();
            if (BohemiaBelonging.gaveOf(probe, f) > was) landed++;
          }
          ctClose(); ctOpen();
          const doorThere = !!document.getElementById('ctcommit');
          ctClose();
          probe.meta.gave = {}; probe.meta.owed = {}; probe.meta.claims = {}; probe.meta.commit = {};
          (window.__EZQ = window.__EZQ || []).push({ f: f, landed: landed, ceil0: ceil0, door: doorThere });
          if (landed === ceil0 && doorThere) { who = p; fid = f; break outer; }
        }
      }
      if (!who) return { skip: 'none of the ' + tried + ' affiliated people reachable from a '
        + 'base offers an act that can be repeated, so the wall cannot be climbed to',
        qualify: (window.__EZQ || []).slice(0, 12) };
      /* STAND WHERE THIS PERSON IS THE ONE WHO ANSWERS (8/28). ctOpen and
         ctAdjacent show whoever is NEAREST, and standing at at[0]+1 trusts that
         the chosen body is the only one in reach. That was true while the
         population default was 1 and stopped being true the day it moved to 20:
         the card opens on a stranger and the claim below reports a missing
         feature. A TEST THAT PICKS A PERSON AND THEN TRUSTS THE GAME TO PICK THE
         SAME ONE IS TESTING THE CROWD. Falls back to the old cell if the whole
         ring is somebody else's, so nothing here can be made worse than it was. */
      const at = ctAt(who); let _sb = false;
      for (const _d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]) {
        hx = at[0] + _d[0]; hy = at[1] + _d[1];
        const _a = ctAdjacent(); if (_a && _a.id === who.id) { _sb = true; break; } }
      if (!_sb) { hx = at[0] + 1; hy = at[1]; }
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      const ceiling = BohemiaCommitment.wallOf('none', 0).ceiling;
      ctSawCell(); ctOpen();
      /* press whatever writer the card offers, once a "day", well past the wall */
      for (let i = 0; i < 9; i++) {
        T.day = i + 1; sv.meta.gaveDay = {};
        /* RE-ESTABLISH THE PERSON BEFORE EVERY PRESS (8/28). Standing once and
           re-opening nine times assumes the card comes back to the same body,
           which is only guaranteed while nobody else is within reach. The player
           is not moving between presses, so re-checking costs nothing.
           (Traced first, and it was NOT the cause of the red this was written
           during: the card stayed on the right person all nine times and the
           BUTTON was gone from the second press on. Kept anyway, because the
           assumption it removes is a real one, and the note is corrected rather
           than quietly left saying something the trace disproved.) */
        /* AND NEVER [0,0], WHICH IS STANDING ON TOP OF THEM. (9/5.) This ring
           began at the person's OWN cell, and ctAdjacent counts distance 0 as a match,
           so the very first candidate always "succeeded" and left the player
           inside the body it meant to stand beside. The qualification probe's
           ring (RING0, above) starts at [1,0] and never does this -- which is
           why the probe climbed to the ceiling on the same person the real loop
           could only move once. OCCUPANCY LAW says one body per cell; a test
           that puts two there is asking the game a question it does not have. */
        /* *** RE-READ WHERE THEY ARE, AND NEVER LAND ON A JUNK CELL. *** (9/6.)
           Two bugs in four lines, and the trace this loop now prints found both:
             day 1  restood:true   at 6933,1259  button ctgive  gave 0->1
             day 2  restood:FALSE  at 6931,1258  button MISSING gave 1->1
           `at` was captured ONCE before the loop, so every offset after the first
           press was measured from where the person USED TO BE -- people walk. And
           when no offset matched, the loop fell out leaving hx,hy on the LAST
           ring cell it happened to try, which is nobody's doorstep: the card then
           opened on a stranger and the give button was simply absent. Eight days
           of "the wall stops you at 1 of 5" was the probe standing in a gap.
           The position is re-read every press and a failure restores the cell
           that last worked, so a miss can never be worse than staying put. */
        let _re = false;
        const _now = ctAt(who);
        const _keep = [hx, hy];
        for (const _d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]) {
          hx = _now[0] + _d[0]; hy = _now[1] + _d[1];
          const _a = ctAdjacent(); if (_a && _a.id === who.id) { _re = true; break; }
        }
        if (!_re) { hx = _keep[0]; hy = _keep[1]; }
        /* ctSawCell EVERY PRESS, BECAUSE THE QUALIFICATION DOES. (9/5.) The
           candidate probe above climbs with `ctClose(); ctSawCell(); ctOpen();`
           and this climbed with `ctClose(); ctOpen();`. So the probe reported
           landed:5 on a subject the real loop could only move once -- it
           qualified the person on a routine the run did not perform, which makes
           the qualification worth nothing. Measured: with the probe's routine
           the count reaches the ceiling; without it the give button is gone from
           the second press on. A TEST THAT PICKS ITS SUBJECT WITH ONE PROCEDURE
           AND THEN USES ANOTHER IS NOT TESTING WHAT IT SELECTED FOR. */
        ctClose(); ctSawCell(); ctOpen();
        const was9 = BohemiaBelonging.gaveOf(sv, fid);
        const g = document.getElementById('ctgive') || document.getElementById('ctfavour');
        if (g) g.click();
        (window.__EZ = window.__EZ || []).push({ day: T.day, button: !!g, restood: _re,
          at: hx + ',' + hy, opened: (typeof CT_OPEN !== 'undefined' && CT_OPEN) ? String(CT_OPEN.id) : null,
          want: String(who.id),
          id: (g || {}).id || null, gave: was9 + '->' + BohemiaBelonging.gaveOf(sv, fid) });
      }
      ctClose(); ctOpen();
      return { fid, ceiling, presses: window.__EZ, qualify: (window.__EZQ || []).slice(0, 12),
        gave: BohemiaBelonging.gaveOf(sv, fid),
        state: BohemiaCommitment.stateOf(sv, fid),
        actOffered: !!document.getElementById('ctgive'),
        commitOffered: !!document.getElementById('ctcommit') };
    });
    if (out.skip) { ok('Ez the walked surface has somebody who runs with somebody', false, out.skip); }
    else {
      ok('Ez1 NINE PRESSES CANNOT PASS THE WALL — the count stops at the ceiling '
        + 'with no commitment made',
        out.gave <= out.ceiling && out.state === 'none',
        JSON.stringify({ gave: out.gave, ceiling: out.ceiling, state: out.state,
                         presses: out.presses }));
      ok('Ez2 …and it stops AT the ceiling rather than short of it, so the wall is '
        + 'the limit and not an off-by-one',
        out.gave === out.ceiling, JSON.stringify(out));
      ok('Ez3 the act button is not offered once it could do nothing — a button '
        + 'that does nothing tells the player the wall is soft',
        out.actOffered === false);
      ok('Ez4 …and the commitment IS offered there, so the road continues',
        out.commitOffered === true);
    }
    /* ★ Ez1-Ez4 PASSED THE MUTATION TEST FOR THE WRONG REASON, and finding that
       out is why this claim exists. I reopened the hole (routed the writer back
       around the clamp) and the gate stayed green -- because the OTHER half of
       the fix, hiding the act button at the wall, means no further presses ever
       happen, so the count cannot exceed the ceiling whether the clamp works or
       not. A claim that cannot separate "the clamp holds" from "the button is
       hidden" cannot catch the regression it was written for.
       So this presses the WRITER ITSELF, past the wall, with no button in the
       way. Belt and braces are two things, and each needs its own claim. */
    const clamp = await page.evaluate(() => {
      const bases = ctBases() || {};
      let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return { skip: 1 };
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.commit = {}; sv.meta.gaveDay = {};
      const ceiling = BohemiaCommitment.wallOf('none', 0).ceiling;
      if (typeof ctGiveCapped !== 'function') return { missing: 1, ceiling };
      for (let i = 0; i < 9; i++) { T.day = i + 1; sv.meta.gaveDay = {}; ctGiveCapped(sv, fid); }
      return { ceiling, gave: BohemiaBelonging.gaveOf(sv, fid) };
    });
    ok('Ez6 THE CLAMP ITSELF HOLDS, tested with no button in the way — calling the '
      + 'writer nine times past the wall still stops at the ceiling',
      !clamp.skip && !clamp.missing && clamp.gave === clamp.ceiling,
      JSON.stringify(clamp) + ' (if this passes while the clamp is removed, the '
      + 'claim is measuring the hidden button again)');

    ok('Ez5 the city threw no errors doing any of that', errors.length === 0,
      errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }
}

/* ------------------------------------------- E. THE GENERATOR IS THE TRUTH */
function partE() {
  console.log('E. THE FILE IS GENERATED, AND THE ANCHORS STILL HOLD');

  const before = fs.readFileSync(GEN, 'utf8');
  execFileSync('python3', ['tools/bohemia_commitment.py'], { cwd: ROOT, stdio: 'pipe' });
  ok('E1 re-running the generator reproduces the shipped file byte for byte',
    fs.readFileSync(GEN, 'utf8') === before,
    'if this fails, somebody hand-edited a generated file');

  /* THE ANCHOR LAW: the generator must REFUSE when a claim it makes about
     another file goes stale. Proven by breaking one in a temp copy. */
  const tool = path.join(ROOT, 'tools/bohemia_commitment.py');
  const src = fs.readFileSync(tool, 'utf8');
  const broken = src.replace(
    "'CEILING — a cap that only moves on a COMMITMENT, never on more points'",
    "'A SENTENCE THAT IS NOT IN THE VERDICT'");
  ok('E2 the mutation actually changed the tool (the test tests something)',
    broken !== src);
  const tmp = path.join(ROOT, 'tools/.commitment_anchor_probe.py');
  let refused = false;
  try {
    fs.writeFileSync(tmp, broken);
    try { execFileSync('python3', [tmp], { cwd: ROOT, stdio: 'pipe' }); }
    catch (e) { refused = /REFUSING TO GENERATE|ANCHOR MOVED/.test(String(e.stderr || '')); }
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
  ok('E3 a stale citation makes the generator REFUSE, not shrug',
    refused, 'a citation a machine cannot check is a name-drop');
}

/* ------------------------------- F. THE TWO RUNGS TABLES ARE NOT ONE TABLE */
/* THIS LANE FLAGGED ITS OWN CONSOLIDATION ON 8/15 AND THE FLAG WAS WRONG.
   The 8/15 law noticed that bohemia_standing (8/2, PEOPLE) and bohemia_belonging
   (8/12, this lane) "both now carry a RUNGS table" and wrote FLAGGED FOR
   CONSOLIDATION -- three lines under its own table saying they answer DIFFERENT
   QUESTIONS. It was a NAME COLLISION read as a duplicate mechanism, and it sat in
   the handoff as the next job for four days.

   Doing it would not have been a cleanup. It would have deleted a distinction the
   game depends on, and the damage is measurable: feed the SAME NUMBER to both and
   they disagree on every single input.

       n=3   belonging -> USEFUL          (you did three things for that outfit)
             standing  -> FWU             (they would take a bullet for you)

   These are orthogonal axes, not two spellings of one. You can be INSIDE the
   Cartel and HOSTILE to a specific member of it, both true at once, and a merged
   table cannot represent that state at all.

   SO THE FIX IS NOT A MERGE, IT IS A FENCE. These claims exist to make the next
   session that reads "consolidate the two RUNGS tables" stop and read this
   instead. A GATE MUST NEVER OUTRANK A RULING -- and a FLAG must never outrank
   the evidence sitting three lines above it. */
function partF() {
  console.log('F. THE TWO RUNGS TABLES ANSWER DIFFERENT QUESTIONS, MEASURABLY');

  let St = null;
  try { St = require(path.join(ROOT, 'engine/bohemia_standing.js')); } catch (_e) {}
  ok('F1 the other lane\'s standing organ is still there to compare against',
    !!(St && Array.isArray(St.RUNGS) && typeof St.rungFor === 'function'),
    'read-only: this gate never writes to another lane\'s module');
  if (!St || !St.RUNGS) return;

  const bWords = B.RUNGS.map(r => r.word);
  const sWords = St.RUNGS.map(r => r[0]);

  ok('F2 the two tables share not one word, so nothing is a re-spelling of '
    + 'anything: ' + JSON.stringify(sWords) + ' vs ' + JSON.stringify(bWords),
    bWords.filter(w => sWords.includes(w)).length === 0);

  ok('F3 STANDING GOES NEGATIVE AND BELONGING CANNOT. People can think worse of '
    + 'you than nothing; you cannot be less than a stranger to an outfit you '
    + 'have never helped. A merged table has to pick one, and either choice is '
    + 'a lie about the other system',
    St.RUNGS.some(r => r[1] < 0) === true && B.RUNGS.every(r => r.at >= 0));

  /* THE DAMAGE, MEASURED. Same number in, different answer out, every time. */
  const rule = B.ruleOf('CARTEL') || B.DEFAULT;
  const collisions = [];
  for (const n of [0, 1, 3, 6, 10]) {
    const b = B.rungOf(rule, n);
    collisions.push({ n, belonging: b && b.word, standing: St.rungFor(n) });
  }
  ok('F4 fed the SAME NUMBER both tables disagree on EVERY input -- 3 is USEFUL '
    + 'to one and FWU to the other -- so consolidating them would silently '
    + 'rewrite both systems\' answers rather than tidy them',
    collisions.every(c => c.belonging && c.belonging !== c.standing),
    JSON.stringify(collisions));

  /* AND THE NUMBERS MEAN DIFFERENT KINDS OF THING. Belonging's `at` is a FLOOR
     you reach by doing things; standing's is the CEILING of an opinion band. */
  ok('F5 belonging\'s number is a floor you climb to (monotonic thresholds on a '
    + 'count of deeds) and standing\'s is the top of an opinion band -- different '
    + 'shapes, so the row types are not even interchangeable',
    B.RUNGS.every((r, i) => i === 0 || r.at > B.RUNGS[i - 1].at)
    && B.RUNGS.every(r => typeof r.key === 'string' && typeof r.word === 'string')
    && St.RUNGS.every(r => Array.isArray(r) && r.length === 2));

  ok('F6 the orthogonal state is REACHABLE and that is the whole argument: you '
    + 'can be INSIDE an outfit and still be somebody a given member thinks badly '
    + 'of. One table cannot hold both, so there must be two',
    B.rungOf(rule, 10).key === 'inside' && St.rungFor(-5) === 'HOSTILE');
}

/* --------------------------- G. IT COSTS YOU SOMEWHERE ELSE (THE ORGAN) */
/* THE `burned` STAGE HAS SAID THIS IN WRITING SINCE 8/15 AND NOTHING DID IT:
   "You cost yourself somewhere else to be here." adjust() was only ever called
   on the outfit standing in front of you. Word travelled and nothing happened.

   NO RIVALRY TABLE, AND THAT IS DELIBERATE. Who hates whom is HIS canon and
   unruled. Coser / Lipset & Rokkan: a tie to one side is a liability with EVERY
   other side, not only declared enemies, and that generalised liability is the
   whole mechanism by which cross-cutting ties damp conflict. Taking a side is
   exclusive by construction, so the cost lands on whoever finds out. */
function partG() {
  console.log('G. TAKING A SIDE COSTS YOU WITH WHOEVER HEARS IT');

  /* two outfits sharing one roof, a third with no line at all. */
  const roster = [
    { id: 'A1', faction: 'CHURCH', home: { building: 7 }, job: { kind: 'scav' } },
    { id: 'A2', faction: 'CARTEL', home: { building: 7 }, job: { kind: 'scav' } },
    { id: 'B1', faction: 'MOB', home: { building: 90 }, job: { kind: 'scav' } }
  ];
  const heard = S.whoHears('CHURCH', roster, [0, 0], { ties: T });
  const standings = { CHURCH: 5, CARTEL: 4, MOB: 6 };

  ok('G1 nothing said out loud costs nothing — you have not taken a side yet',
    S.costs('none', heard, standings).length === 0);

  const sided = S.costs('sided', heard, standings);
  ok('G2 TAKING A SIDE COSTS YOU WITH THE OUTFIT THAT HEARD IT AS FACT. The '
    + 'stage promised this on 8/15 and adjust() was only ever called on the '
    + 'outfit in front of you',
    sided.length === 1 && sided[0].faction === 'CARTEL' && sided[0].lose === 1,
    JSON.stringify(sided.map(c => c.faction + ' -' + c.lose)));

  ok('G3 …and it does NOT cost you with an outfit that has no line to you. '
    + 'Burt/Simmel: the structural hole is worth something, and this is where '
    + 'tertius stops being a caption and starts being a number',
    !sided.some(c => c.faction === 'MOB'));

  ok('G4 burning a bridge costs more than taking a side, and the amount is the '
    + 'STAGE INDEX — derived like neglect, never typed, so a fourth stage would '
    + 'follow on its own',
    S.costs('burned', heard, standings)[0].lose === 2
    && S.costs('sided', heard, standings)[0].lose === 1);

  /* A RUMOUR NAMES NOTHING. LANDING.secondhand says it itself. */
  const far = [
    { id: 'C1', faction: 'CHURCH', home: { building: 1 }, job: { kind: 'site', site: 'J1' } },
    { id: 'C2', faction: null, home: { building: 1 }, job: { kind: 'site', site: 'J2' } },
    { id: 'C3', faction: 'BLUES', home: { building: 3 }, job: { kind: 'site', site: 'J2' } }
  ];
  const fh = S.whoHears('CHURCH', far, [0, 0], { ties: T });
  const blues = fh.find(h => h.faction === 'BLUES');
  ok('G5 A RUMOUR CANNOT COST YOU, and that is read off LANDING\'s own shipped '
    + 'words — "They will hear that you did something. They will not hear '
    + 'exactly what." You do not lose standing over what nobody can pin on you',
    !blues || S.landing(blues).key !== 'direct'
      ? !S.costs('sided', fh, { CHURCH: 5, BLUES: 4 }).some(c => c.faction === 'BLUES')
      : true,
    JSON.stringify(fh.map(h => h.faction + '@' + h.hops)));

  ok('G6 an outfit that never counted you has nothing to take — you cannot fall '
    + 'below a stranger, which is exactly why belonging does not go negative',
    S.costs('burned', heard, { CHURCH: 5, CARTEL: 0, MOB: 6 })
      .every(c => c.faction !== 'CARTEL'));

  ok('G7 …and it never takes more than you had, so a deep commitment cannot '
    + 'drive somebody into a debt the ladder cannot express',
    S.costs('burned', heard, { CHURCH: 5, CARTEL: 1, MOB: 6 })[0].lose === 1);

  ok('G8 no outfit is named in the organ — the cost needs no rivalry table and '
    + 'invents none of his canon',
    !/CHURCH|CARTEL|MOB|BLUES|REMNANTS/.test(
      fs.readFileSync(GEN, 'utf8').split('function costs(')[1].split('\n  }')[0]));
}

/* ------------------- H. TWO PEOPLE WITH THE SAME NAME ARE TWO PEOPLE */
/* 298 PEOPLE IN THE VALLEY SHARED 17 NAMES. bohemia_population numbers people
   PER NEIGHBOURHOOD (H1-1, H2-1...) and ctValleyRoster concatenates every
   neighbourhood, so "H1-1" stood in for ~140 real people across nine outfits.
   whoHears keys byKey/seen/tiesOf on that id, so the social graph of the valley
   was largely fiction -- it reported TRADES hearing a Reds commitment through a
   FACTION focus, which cannot happen (F:REDS and F:TRADES do not match).

   WHY NO CLAIM CAUGHT IT: every who-hears assertion tested SHAPE -- somebody
   hears, a rumour lands further than a fact, the bridge is cross-cutting -- and
   all of those stay true on a graph built from colliding keys, because
   collisions ADD edges rather than remove them. Nothing ever looked empty.
   NOBODY ASKED WHETHER TWO PEOPLE WITH THE SAME NAME WERE THE SAME PERSON. */
async function partH() {
  console.log('H. THE VALLEY ROSTER IS PEOPLE, NOT NAMES');
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  try {
    await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'));
    await SETTLE(page, 6000);
    const m = await page.evaluate(() => {
      hx = 1026; hy = 8322;                 /* the Reds base: where it showed */
      const roster = ctValleyRoster(), cell = ctCell();
      const byOld = {}, byNew = {};
      roster.forEach(a => { byOld[String(a.id)] = 1; byNew[ctVKey(a)] = 1; });
      /* do two outfits actually share a setting anywhere? ground truth, and it
         does not depend on keys at all. */
      const buckets = {};
      roster.forEach(a => {
        const f = BohemiaTies.fociOf(a, cell);
        for (const k of ['home', 'work', 'faction']) {
          if (!f[k]) continue;
          (buckets[f[k]] = buckets[f[k]] || new Set()).add(String(a.faction || '-'));
        }
      });
      let mixed = 0;
      for (const v of Object.values(buckets))
        if ([...v].filter(x => x !== '-').length > 1) mixed++;
      /* and what the card says, on the real surface */
      const fids = [...new Set(roster.map(a => a.faction).filter(Boolean))];
      let claimsSomebodyHeard = 0;
      for (const fid of fids) {
        let h = [];
        try { h = BohemiaCommitment.whoHears(fid, roster, cell, { ties: BohemiaTies, keyOf: ctVKey }); } catch (_e) {}
        if (h.length) claimsSomebodyHeard++;
      }
      return { people: roster.length, oldKeys: Object.keys(byOld).length,
               newKeys: Object.keys(byNew).length, mixedFoci: mixed,
               outfits: fids.length, claimsSomebodyHeard };
    });

    ok('H1 EVERY PERSON IN THE VALLEY HAS THEIR OWN KEY. Before this, ' + m.people
      + ' people answered to ' + m.oldKeys + ' names and the graph walk treated '
      + 'them as the same person',
      m.newKeys === m.people,
      JSON.stringify(m));

    ok('H2 …and the old key really was colliding, so this is measuring a fix '
      + 'rather than restating a fact that was already true',
      m.oldKeys < m.people,
      m.oldKeys + ' distinct ids for ' + m.people + ' people');

    /* THE HONEST PART, AND IT IS NOT A PASS DISGUISED AS ONE. With real keys
       the valley has NO cross-faction ties at all, so nobody hears anything.
       That is a fact about the WORLD (base placement is MAP LAW, and
       REACH_CELLS / AFFILIATED_RATE are [PENDING Paolo]), not about the organ,
       which part G proves works the moment a shared setting exists. The claim
       is CONSISTENCY -- the card must never say an outfit heard when no two
       outfits share a setting -- and it holds in both worlds. */
    ok('H3 THE CARD NEVER CLAIMS AN OUTFIT HEARD WHEN NO TWO OUTFITS SHARE A '
      + 'SETTING. Measured: ' + m.mixedFoci + ' shared settings in this valley '
      + 'join two named outfits, and ' + m.claimsSomebodyHeard + ' of '
      + m.outfits + ' outfits report being heard about. Before the key fix it '
      + 'claimed three, through ties that did not exist',
      (m.mixedFoci === 0) === (m.claimsSomebodyHeard === 0),
      JSON.stringify(m));

    ok('H4 no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  } finally { await browser.close(); }
}

(async function main() {
  console.log('COMMITMENT GATE — the wall, and who finds out\n');
  partA();
  partB();
  partC();
  await partD();
  await partWall();
  partE();
  partF();
  partG();
  await partH();
  console.log('\nCOMMITMENT GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('COMMITMENT GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
