/* ============================================================================
   TIES GATE (8/12/26, FACTIONS lane) — THE VALLEY'S PEOPLE KNOW EACH OTHER, AND
   THE GRAPH IS HONEST ABOUT IT.

   Law:   laws/BOHEMIA_ADDENDUM_WHO_KNOWS_WHO_8_12_26.md
   Organ: engine/bohemia_ties.js
   Page:  slices/BOHEMIA_WHO_KNOWS_WHO_8_12_26.html  (LIFE tab)

   WHY THIS EXISTS. Yesterday's sixteen introductions shipped with three earning
   conditions dead for one reason: every person in Bohemia was an island, so the
   four dossiers that ask for a third party (MOB vouch, REMNANTS overheard,
   COLORFUL onward, CARAVANS "nobody vouches for") could never resolve. This organ
   is the acquaintance graph they needed, derived from Feld's foci — the three
   shared settings the engine already stamped on every agent.

   THE FIVE WAYS THIS GOES WRONG, and every claim below is aimed at one of them:

     1. A ONE-WAY FRIENDSHIP. The thinning rule hashes a pair; hash an ORDERED
        pair and A knows B while B does not know A. It looks fine in a spot check
        and is nonsense.
        -> B1 checks EVERY pair on a real generated block, both directions.

     2. EVERYONE KNOWS EVERYONE. The easy version of this feature makes a focus a
        clique at any size, and a 300-person valley becomes 300 people who all
        know all 300. Dunbar's layers are the real ceiling and they have to BIND.
        -> B3/B4 measure the degree at four focus sizes and check the ceiling
           holds where it should and stops binding where it should not.

     3. A VOUCH FROM A STRANGER. The whole Mob mechanic is that the sponsor is a
        GUARANTOR (thieves-in-law, yakuza). If a tie you have merely met, or a tie
        outside the outfit, can introduce you, the faction is not closed, it is
        just slower.
        -> C1..C4 drive vouchFor through every wrong shape and require null.

     4. IT IS WIRED BY NAME AND DEAD IN FACT. This lane has shipped that exact bug
        twice (advance_territory 8/9, the allegiance line 8/11).
        -> D opens the REAL built run in a REAL browser, forces a Mob member,
           earns an insider's name through the REAL button, and requires the
           stranger's own name to arrive with the introducer printed on the card.

     5. IT INVENTS PEOPLE OR RELATIONSHIPS. MECHANISM-MINE / CONTENTS-PAOLO'S: the
        graph may only READ what the world already decided.
        -> A2/A3 assert the organ has no roster, no name pool and no dialogue, and
           that removing a focus from an agent removes exactly the ties it caused.

   node gates/ties_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ORGAN = path.join(ROOT, 'engine/bohemia_ties.js');
const RUN_SRC = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
const RUN_FILE = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_WHO_KNOWS_WHO_8_12_26.html');

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

const T = require(ORGAN);
const P = require(path.join(ROOT, 'engine/bohemia_people.js'));
const A = require(path.join(ROOT, 'engine/bohemia_agents.js'));
const S = require(path.join(ROOT, 'engine/bohemia_suburb.js'));

/* A REAL BLOCK, built the way the run builds one. Faking a roster would test the
   gate's own idea of a neighbourhood instead of the game's. */
const CELL = [40, 40];
const BASES = [{ name: 'MOB', x: 41, y: 41 }, { name: 'TRADES', x: 38, y: 44 },
               { name: 'CHURCH', x: 44, y: 39 }, { name: 'REMNANTS', x: 37, y: 38 }];
function blockOf(seed) {
  const r = S.generate(seed, { cw: 1, ch: 1, streets: ['S'] });
  const feet = S.homeFootprints({ g: r.g, W: r.W, H: r.H });
  const jobs = [{ district: 'commercial', dir: 'N', dist: 2 },
                { district: 'industrial', dir: 'E', dist: 1 },
                { district: 'farm', dir: 'W', dist: 3 }];
  const roster = A.agentsForBlock(seed, feet, jobs, null,
    { households: 7, cell: CELL, factionBases: BASES, preDialled: true });
  return { seed, roster, keyOf: a => P.keyOf(seed, a) };
}
const SEEDS = [12345, 777, 90210, 4242, 1861, 20260812];

/* ----------------------------------------------------- A. NOTHING INVENTED */
function partA() {
  console.log('A. THE GRAPH ONLY READS WHAT THE WORLD ALREADY DECIDED');

  const js = fs.readFileSync(ORGAN, 'utf8');
  /* strip comments first: a checker that cannot tell a mention from a use is the
     broken one (Paolo 8/1, and this lane has made that mistake). */
  const code = js.split('\n').filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

  ok('A1 the organ has no roster, no name pool and no dialogue of its own',
    !/\bGIVEN\s*[:=]/.test(code) && !/\bSURNAME\s*[:=]/.test(code) &&
    !/\bLINES\s*[:=]/.test(code) && !/\bPEOPLE\s*[:=]\s*\[/.test(code));

  /* the foci must be READ, never assigned. Strip a focus off an agent and exactly
     the ties that focus caused must disappear, and no others. */
  const B = blockOf(12345);
  const target = B.roster.filter(a => a.job && a.job.kind === 'site' && a.faction)[0]
              || B.roster.filter(a => a.job && a.job.kind === 'site')[0];
  ok('A2 a block produces somebody with a real job site to test with', !!target);
  if (target) {
    const key = B.keyOf(target);
    const before = T.tiesOf(key, B.roster, CELL, B.keyOf);
    const stripped = B.roster.map(a => a === target ? Object.assign({}, a, { job: null }) : a);
    const after = T.tiesOf(key, stripped, CELL, B.keyOf);
    const lostWork = before.filter(t => t.via === 'work').length;
    ok('A3 taking away a person\'s job takes away exactly their work ties, nothing else',
      before.length - after.length === lostWork &&
      after.every(t => t.via !== 'work'),
      'before ' + before.length + ' after ' + after.length + ' work ' + lostWork);
  }

  ok('A4 a scavenger works alone, so scavenging is not a focus',
    !T.fociOf({ id: 'H1-1', job: { kind: 'scav' } }, CELL).work);
  /* THE HERMIT. A real id, a house nobody else is in, no job, no outfit: one focus
     and nobody in it but them. The first version of this claim used a malformed id
     ('X'), which has no house at all -- that measured the parser, not the person. */
  ok('A5 a person alone in a house, with no job and no outfit, knows nobody',
    Object.keys(T.fociOf({ id: 'H99-1', job: null }, CELL)).length === 1 &&
    T.tiesOf('H99-1', [{ id: 'H99-1', job: null }, { id: 'H4-1', job: null }], CELL,
      x => x.id).length === 0);
  ok('A6 the layers are Dunbar\'s, not a tuned dial',
    T.LAYERS.home === 5 && T.LAYERS.work === 15 && T.LAYERS.faction === 50 &&
    T.ACTIVE === 150);
}

/* --------------------------------------------------------- B. THE GRAPH */
function partB() {
  console.log('B. THE GRAPH IS SYMMETRIC AND THE CEILING BINDS');

  let asym = 0, pairs = 0, empty = 0;
  SEEDS.forEach(seed => {
    const B = blockOf(seed);
    if (!B.roster.length) { empty++; return; }
    const keys = B.roster.map(B.keyOf);
    const ties = {};
    keys.forEach(k => { ties[k] = {}; T.tiesOf(k, B.roster, CELL, B.keyOf)
      .forEach(t => { ties[k][t.key] = t.via; }); });
    keys.forEach(a => keys.forEach(b => {
      if (a === b) return; pairs++;
      if (!!ties[a][b] !== !!ties[b][a]) asym++;
      /* and they must agree on HOW they know each other, not just that they do */
      if (ties[a][b] && ties[a][b] !== ties[b][a]) asym++;
    }));
  });
  ok('B0 the seeds produce real blocks to measure', empty === 0 && pairs > 200,
    pairs + ' pairs, ' + empty + ' empty blocks');
  ok('B1 nobody knows somebody who does not know them back, on any seed',
    asym === 0, asym + ' asymmetric of ' + pairs);

  ok('B2 a person is never their own acquaintance',
    SEEDS.every(seed => { const B = blockOf(seed);
      return B.roster.every(a => T.tiesOf(B.keyOf(a), B.roster, CELL, B.keyOf)
        .every(t => t.key !== B.keyOf(a))); }));

  /* THE CEILING, MEASURED. Below the layer a shared setting acquaints everybody;
     above it the expected degree lands ON the layer. Both halves are the claim. */
  function avgDegree(n) {
    const R = []; for (let i = 0; i < n; i++) R.push({ id: 'H' + i + '-1', job: null, faction: 'MOB' });
    const d = T.degrees(R, [0, 0], a => a.id);
    const v = Object.keys(d).map(k => d[k]);
    return v.reduce((s, x) => s + x, 0) / v.length;
  }
  const small = avgDegree(20), atLayer = avgDegree(51), big = avgDegree(400), huge = avgDegree(1200);
  ok('B3 below the layer a shared setting really does acquaint everybody',
    Math.abs(small - 19) < 0.001, 'avg ' + small.toFixed(2) + ' of a possible 19');
  ok('B4 above the layer the graph thins to the affinity layer, not to a clique',
    Math.abs(big - T.LAYERS.faction) < 3 && Math.abs(huge - T.LAYERS.faction) < 3,
    '400 -> ' + big.toFixed(1) + ', 1200 -> ' + huge.toFixed(1) + ' (layer ' + T.LAYERS.faction + ')');
  ok('B5 the ceiling is a ceiling, not a target: it stops binding below itself',
    atLayer > big * 0.9 && small < T.LAYERS.faction,
    'at-layer ' + atLayer.toFixed(1) + ' vs big ' + big.toFixed(1));

  /* DETERMINISM. The run throws every agent away on a save load and rebuilds them
     from the seed, so a graph hung on object identity dies there. */
  const A1 = blockOf(777), A2 = blockOf(777);
  const sig = B => B.roster.map(a => B.keyOf(a) + ':' +
    T.tiesOf(B.keyOf(a), B.roster, CELL, B.keyOf).map(t => t.key + '/' + t.via).join(',')).join('|');
  ok('B6 the same block rebuilt from the same seed has the same graph, exactly',
    sig(A1) === sig(A2));
  ok('B7 a different seed is a different neighbourhood, not the same one relabelled',
    sig(blockOf(777)) !== sig(blockOf(90210)));

  /* the strongest tie wins when two people share more than one focus, because
     "how do you know them" has one best answer. */
  const R = [{ id: 'H1-1', job: { kind: 'site', district: 'c', dir: 'N', dist: 1 }, faction: 'MOB' },
             { id: 'H1-2', job: { kind: 'site', district: 'c', dir: 'N', dist: 1 }, faction: 'MOB' }];
  const t = T.tiesOf('H1-1', R, CELL, a => a.id);
  ok('B8 people who share a roof AND a job AND an outfit are reported by the roof',
    t.length === 1 && t[0].via === 'home', JSON.stringify(t));
}

/* ------------------------------------------------------------ C. THE VOUCH */
function partC() {
  console.log('C. A VOUCH IS A GUARANTEE, NOT A FLAG');

  const kb = a => a.id;
  const R = [
    { id: 'H1-1', faction: 'MOB', job: { kind: 'site', district: 'c', dir: 'N', dist: 2 } },
    { id: 'H1-2', faction: null, job: null },                       // their housemate, outside
    { id: 'H2-1', faction: 'MOB', job: { kind: 'site', district: 'c', dir: 'N', dist: 2 } },
    { id: 'H3-1', faction: 'TRADES', job: { kind: 'site', district: 'c', dir: 'N', dist: 2 } },
    { id: 'H4-1', faction: 'MOB', job: null }                       // in the outfit, no tie
  ];
  const V = known => T.vouchFor('H1-1', R, CELL, { keyOf: kb, known });

  ok('C1 knowing nobody gets you nothing', V({}) === null);
  ok('C2 their own housemate cannot vouch if they are not in the outfit',
    V({ 'H1-2': 1 }) === null);
  ok('C3 a workmate in a DIFFERENT outfit cannot vouch either',
    V({ 'H3-1': 1 }) === null);
  /* IN A SMALL OUTFIT, BEING IN IT IS THE TIE. H4-1 shares no roof and no job with
     H1-1, but a three-person Mob is far below the affinity layer, so of course
     they know each other -- that is Feld's whole point and the first version of
     this claim had it backwards. What the tie requirement really buys is the BIG
     case: put them in a 400-strong outfit and knowing one member no longer means
     knowing this one. Both halves are checked, because only the pair is the rule. */
  ok('C4 in a small outfit, being in it IS the tie, so an insider can vouch',
    !!V({ 'H4-1': 1 }));
  const BIG = [{ id: 'H1-1', faction: 'MOB', job: null }];
  for (let i = 2; i < 402; i++) BIG.push({ id: 'H' + i + '-1', faction: 'MOB', job: null });
  const strangersInside = BIG.slice(1).filter(m =>
    T.vouchFor('H1-1', BIG, CELL, { keyOf: kb, known: { [m.id]: 1 } }) === null).length;
  ok('C4b in a 400-strong outfit, most members cannot vouch for any given one',
    strangersInside > 300, strangersInside + ' of 400 cannot');
  const good = V({ 'H2-1': 1 });
  ok('C5 somebody in the outfit who is tied to them CAN, and the card can name them',
    !!good && good.by === 'H2-1' && good.faction === 'MOB' && !!good.via,
    JSON.stringify(good));

  /* OVERHEARD is deliberately weaker: you only have to have MET the other soldier,
     not to know what to call them. That difference IS the difference between the
     Mob's mechanic and the Remnants'. */
  const O = met => T.overheardFrom('H1-1', R, CELL, { keyOf: kb, met });
  ok('C6 overhearing needs only that you MET the other one, not that you know them',
    !!O({ 'H2-1': 1 }) && V({}) === null);
  ok('C7 you cannot overhear a name from somebody in a different outfit',
    O({ 'H3-1': 1 }) === null);
  ok('C8 a person who runs with nobody can never be vouched for, and that is correct',
    T.vouchFor('H1-2', R, CELL, { keyOf: kb, known: { 'H1-1': 1 } }) === null);

  const onward = T.onwardFrom('H3-1', R, CELL, { keyOf: kb, n: 3, met: {} });
  ok('C9 an introduce-onward is their real ties, capped at three, minus who you have met',
    onward.length > 0 && onward.length <= 3 &&
    T.onwardFrom('H3-1', R, CELL, { keyOf: kb, n: 3, met: { 'H1-1': 1 } }).length
      === onward.length - 1,
    JSON.stringify(onward));
}

/* ------------------------------------------------- D. IT REACHES THE PLAYER */
async function partD() {
  console.log('D. IT REACHES THE PLAYER (the built run, in a real browser)');

  const src = fs.readFileSync(RUN_SRC, 'utf8');
  const built = fs.readFileSync(RUN_FILE, 'utf8');
  ok('D0 the organ is inlined in the file the alpha actually loads',
    built.includes('bohemia_ties.js') && built.includes('BohemiaTies'));
  ok('D1 the run feeds the graph the SAME faction answer the rest of the card uses',
    /faction:\s*factionForPerson\(a\)/.test(src),
    'a second opinion about who somebody runs with is two systems disagreeing');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + RUN_FILE);
    await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 90000 });
    await page.evaluate(() => window.__RUN.wipeSaves());

    const live = await page.evaluate(() => {
      const r = window.__RUN.people();
      const withTies = (r.people || []).filter(p => p.ties);
      const deg = withTies.map(p => p.ties.length);
      return { n: r.n, tied: withTies.length,
               avg: deg.length ? deg.reduce((s, x) => s + x, 0) / deg.length : 0,
               vias: [...new Set(withTies.flatMap(p => p.ties.map(t => t.via)))].sort() };
    });
    ok('D2 every person on the real block resolves a tie list through the organ',
      live.tied === live.n && live.n > 0, JSON.stringify(live));
    ok('D3 the block really is connected: people know somebody, and by real foci',
      live.avg > 0 && live.vias.length >= 2, JSON.stringify(live));

    /* THE WHOLE MECHANIC, END TO END, THROUGH THE REAL DOM. Force two people into
       the Mob, learn one of their names with the REAL button, then open the other
       and require the name to arrive BY THE VOUCH with the introducer printed. */
    const story = await page.evaluate(() => {
      const ags = (SIM && SIM.agents || []);
      if (ags.length < 2) return { skip: 'too few people on the block' };
      const orig = window.factionForPerson;
      const insider = ags[0], stranger = ags[1];
      window.factionForPerson = function (a) { return (a === insider || a === stranger) ? 'MOB' : null; };
      const rowOf = () => [...document.querySelectorAll('#idcard .r')]
        .map(r => [r.querySelector('.k').textContent, r.querySelector('.v').textContent]);

      openPerson(stranger);
      const before = rowOf();
      const beforeName = (before.find(r => r[0] === 'NAME' || r[0] === 'KNOWN AS') || [])[1];
      const beforeBtn = document.getElementById('pplask');
      if (beforeBtn) beforeBtn.click();          // asking the Mob is the mistake
      const afterAsk = (rowOf().find(r => r[0] === 'NAME' || r[0] === 'KNOWN AS') || [])[1];

      /* now earn the insider's name the only honest way: open them and ask. They
         are Mob too, so asking will not work -- give them no faction for a moment,
         which is what any ordinary neighbour is. */
      window.factionForPerson = function (a) { return a === stranger ? 'MOB' : null; };
      openPerson(insider);
      const ib = document.getElementById('pplask'); if (ib) ib.click();
      const insiderNamed = !!BohemiaPeople.nameOf(personFor(insider));

      /* insider is back in the outfit, and now their word counts */
      window.factionForPerson = function (a) { return (a === insider || a === stranger) ? 'MOB' : null; };
      openPerson(stranger);
      const after = rowOf();
      const vouchRow = after.find(r => r[0] === 'INTRODUCED BY');
      const nameRow = after.find(r => r[0] === 'NAME' || r[0] === 'KNOWN AS');
      window.factionForPerson = orig;
      return { beforeName, afterAsk, insiderNamed,
               vouch: vouchRow || null, name: nameRow || null,
               real: BohemiaPeople.generatedName(personFor(stranger).key) };
    });

    if (story.skip) { ok('D4 the block has people to run the vouch story on', false, story.skip); }
    else {
      ok('D4 asking a Mob member directly gets you nothing, on the real card',
        story.afterAsk === story.beforeName && !String(story.afterAsk || '').includes(story.real),
        JSON.stringify(story));
      ok('D5 an ordinary neighbour still gives their name when asked',
        story.insiderNamed === true, JSON.stringify(story));
      ok('D6 once that neighbour is inside the outfit, the stranger has a name',
        !!story.name && story.name[1] === story.real, JSON.stringify(story));
      ok('D7 and the card says WHO introduced you and how they know each other',
        !!story.vouch && /·/.test(story.vouch[1]) && story.vouch[1].length > 3,
        JSON.stringify(story.vouch));
    }

    ok('D8 the run threw no errors while doing any of that',
      errors.length === 0, errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }
}

/* ------------------------------------------------------------- E. THE PAGE */
function partE() {
  console.log('E. HE CAN SEE IT WITHOUT HUNTING');

  const page = fs.readFileSync(PAGE, 'utf8');
  ok('E1 the page runs the REAL organ, inlined, not a drawing of one',
    page.includes('function pairTies(aKey, bKey, focusId, size, kind)') &&
    page.includes('BohemiaTies.tiesOf('));
  ok('E2 it builds a REAL block with the real generator and the real agents',
    page.includes('BohemiaAgents.agentsForBlock(') && page.includes('BohemiaSuburb.generate('));
  ok('E3 it plays the vouch out rather than describing it',
    page.includes('BohemiaTies.vouchFor('));
  ok('E4 it measures the Dunbar ceiling on the page rather than asserting it',
    page.includes('BohemiaTies.degrees('));
  ok('E5 it asks him for nothing: no thumb controls, no verdict export',
    ![/id=["']export/i, /class=["'][^"']*thumb/i, /data-(vote|verdict|thumb)=/i]
      .some(re => re.test(page)));

  const hub = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_LIFE_CURRENT.html'), 'utf8');
  ok('E6 the LIFE tab links to it, so it is a room he can reach and not a file',
    hub.includes('BOHEMIA_WHO_KNOWS_WHO_8_12_26.html'),
    'NEVER MAKE HIM HUNT (8/11): a surface he cannot reach does not exist');
}

(async function main() {
  console.log('TIES GATE — who knows who, and what that opens\n');
  partA();
  partB();
  partC();
  await partD();
  partE();
  console.log('\nTIES GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('TIES GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
