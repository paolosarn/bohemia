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
  ok('A13 every unruled number is TAGGED and enumerable (EVERYTHING COSTS ONE, 8/15)',
    ph.length === S.STAGES.length && ph.every(p => p.placeholder === true && /EVERYTHING COSTS ONE/.test(p.law)),
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
    await page.waitForTimeout(6000);
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
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
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
      const lines = facs.filter(f =>
        BohemiaCommitment.whoHears(f, r, ctCell(), { ties: BohemiaTies }).length);
      return { people: r.length, affiliated: aff.length, outfits: facs.length,
               withLines: lines.length };
    });
    ok('D10 a real share of the valley runs with somebody, across many outfits',
      shape.people > 100 && shape.affiliated > 10 && shape.outfits >= 5,
      JSON.stringify(shape));
    ok('D11 some outfits can hear about each other and some genuinely cannot',
      shape.withLines >= 1 && shape.withLines < shape.outfits,
      'both halves matter — all-hear and none-hear are the same non-mechanic. '
      + JSON.stringify(shape));
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

(async function main() {
  console.log('COMMITMENT GATE — the wall, and who finds out\n');
  partA();
  partB();
  partC();
  await partD();
  partE();
  console.log('\nCOMMITMENT GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('COMMITMENT GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
