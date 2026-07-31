/* ============================================================================
   PEOPLE GATE (7/31/26, PEOPLE lane) — THE BODIES ON THE BLOCK ARE PEOPLE.

   A law without a machine gate is not enforced. Three laws land here:

     1. MECHANISM-MINE / CONTENTS-PAOLO'S. engine/bohemia_people.js ships two
        EMPTY tables — NAMED_CAST (who the valley's named people are) and LINES
        (what anybody says). Both are Paolo's. This gate fails if either gains a
        row, and it fails if a name bank ever appears in the module. The realistic
        way this breaks is not malice: it is a future session adding "a few
        placeholder names so it can be tested", and the placeholder becoming
        canon by shipping. Same failure the purse's PAYOUT table is gated against.

     2. IDENTITY IS DERIVED, NEVER STORED. The run throws every agent away on a
        save load and rebuilds them from the seed. An identity hung on an agent
        object dies there. So this gate rebuilds the sim the way applyBlob does
        and asserts the SAME PEOPLE come back — "same cell twice = same people",
        which is the backlog's own definition of done for this item.

     3. VERIFY ON THE REAL SURFACE (7/18). Part C opens the actual run in a real
        browser at iPhone size, walks out of the player's own front door, chases
        a real scheduled body across the block by tapping the real arrows, taps
        the one action button, and reads the card the player actually sees. A
        side-door probe is a lie.

   THE PORTRAIT ASSERTION, and what is real about it: the run's cast is baked by
   the parent alpha and posted in, so a standalone run has no faces. Part C posts
   a SYNTHETIC cast whose portraits are flat distinguishable colours. The art is
   stood in for; the INDEXING is not — the gate asserts the drawn portrait is the
   one at (person.lookSeed % looks.length), which is the same index the walking
   body is drawn from, and that two people whose seeds differ get different
   faces. That is the whole NPC_LOOK_SEED class of bug, killed by measurement.

   Requires playwright (installed globally in this environment).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MOD_FILE = path.join(ROOT, 'engine/bohemia_people.js');
const RUN_FILE = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');
const PROOF_DIR = process.env.PEOPLE_GATE_PROOF_DIR
  ? path.resolve(ROOT, process.env.PEOPLE_GATE_PROOF_DIR)
  : require('os').tmpdir();

const P = require(MOD_FILE);
const A = require(path.join(ROOT, 'engine/bohemia_agents.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* A REAL BLOCK, built the way buildSim() builds it in the run: the real suburb
   generator, its real home footprints, and the run's own 6-household floor for
   the block the game opens on. Faking `feet` would test the gate's own idea of a
   neighbourhood instead of the game's. */
const S = require(path.join(ROOT, 'engine/bohemia_suburb.js'));
function roster(seed) {
  const r = S.generate(seed >>> 0, { cw: 1, ch: 1, streets: ['S'] });
  const feet = S.homeFootprints({ g: r.g, W: r.W, H: r.H });
  const agents = A.agentsForBlock(seed, feet, [], null,
    { occupiedRate: 6 / Math.max(1, feet.length) });
  return { res: { g: r.g, W: r.W, H: r.H }, feet, agents };
}

/* ==========================================================================
   PART A — THE LAW. The two tables are his and they are empty.
   ========================================================================== */
function partA() {
  console.log('A. THE TABLES ARE HIS, AND THEY ARE EMPTY');
  const src = fs.readFileSync(MOD_FILE, 'utf8');

  ok('A1 NAMED_CAST ships empty', Object.keys(P.NAMED_CAST).length === 0);
  ok('A2 LINES ships empty', Object.keys(P.LINES).length === 0);

  /* A3: no name bank. A generated name is indistinguishable from canon three
     sessions later, so the shape itself is banned — an array literal holding
     three or more capitalised words that are not the module's own vocabulary. */
  const allowed = new Set([...Object.values(P.ROLE_WORDS), ...Object.values(P.ACT_WORDS),
    'NORTH', 'SOUTH', 'EAST', 'WEST', 'FIRST', 'SECOND', 'THIRD', 'FOURTH',
    'ONE', 'TWO', 'THREE', 'FOUR', 'NOT NAMED YET', 'FIRST TIME', 'ONCE BEFORE',
    'SOMEBODY', 'HOME ALL DAY', 'UNKNOWN', 'SCAVENGES THIS BLOCK']);
  let bank = false;
  for (const m of src.matchAll(/\[([^\]\n]{10,400})\]/g)) {
    const items = m[1].split(',').map(s => s.trim()).filter(Boolean);
    const names = items.filter(s => /^'[A-Z][a-zA-Z]{2,}'$|^"[A-Z][a-zA-Z]{2,}"$/.test(s))
      .map(s => s.slice(1, -1).toUpperCase())
      .filter(s => !allowed.has(s));
    if (names.length >= 3) bank = true;
  }
  ok('A3 no name bank in the module', !bank);

  /* A4: nobody alive has a name, because nobody has been ruled one. */
  const { agents } = roster(0xB10C);
  const people = P.peopleOf(0xB10C, agents);
  /* the run's own invariant for the block the game opens on: 6 households with
     somebody behind the door, so never fewer than 6 people. */
  ok('A4 a real block generates people (' + people.length + ')', people.length >= 6);
  ok('A5 not one of them has a name', people.every(p => P.nameOf(p) === null));
  ok('A6 every one of them is tier procedural', people.every(p => p.tier === 'procedural'));

  /* A7: the heading falls back only to the engine's OWN four role words. */
  const words = new Set(Object.values(P.ROLE_WORDS));
  ok('A7 headings are the engine\'s own role words', people.every(p => words.has(P.headingOf(p))));
  ok('A8 an unknown role is SOMEBODY, never a guess',
    P.headingOf({ role: 'wanderer', household: { house: 0, slot: 0, size: 1 } }) === 'SOMEBODY');

  /* A9: the empty tables are LOAD-BEARING — a row would actually be used. This
     is the check that stops the tables being decorative. */
  P.NAMED_CAST['P:0:TEST-1'] = { name: 'Ruled Name' };
  const named = P.personOf(0, { id: 'TEST-1', role: 'scav', seed: 7 });
  const takes = named.tier === 'named' && P.headingOf(named) === 'RULED NAME';
  delete P.NAMED_CAST['P:0:TEST-1'];
  ok('A9 a ruled name would be used the moment he writes one', takes);

  P.LINES['scav'] = ['a line'];
  const speaks = P.linesFor(people.find(p => p.role === 'scav') || people[0]).length >= 0;
  const spoke = P.linesFor({ key: 'x', role: 'scav' }).length === 1;
  delete P.LINES['scav'];
  ok('A10 a ruled line would be spoken the moment he writes one', speaks && spoke);
  ok('A11 with the table empty, nobody says anything', P.linesFor(people[0]).length === 0);

  /* A12: the empty state is VISIBLE, not hidden. Silence is honest; a blank row
     reads as finished. */
  const card = P.cardFor(people[0], agents[0], 600, null);
  const nameRow = card.find(r => r.label === 'NAME');
  ok('A12 the card says NOT NAMED YET instead of hiding the hole',
    !!nameRow && nameRow.value === 'NOT NAMED YET');
}

/* ==========================================================================
   PART B — IDENTITY IS DERIVED. Same three numbers, same person, forever.
   ========================================================================== */
function partB() {
  console.log('B. THE SAME NEIGHBOUR IS THE SAME PERSON TOMORROW');
  const SEED = 0x51AB;
  const a1 = roster(SEED), a2 = roster(SEED);
  const p1 = P.peopleOf(SEED, a1.agents), p2 = P.peopleOf(SEED, a2.agents);

  ok('B1 two independent builds of one block agree on the roster', p1.length === p2.length);
  ok('B2 ...and on every key', p1.every((p, i) => p.key === p2[i].key));
  ok('B3 ...and on every look seed', p1.every((p, i) => p.lookSeed === p2[i].lookSeed));
  ok('B4 ...and on every heading', p1.every((p, i) => P.headingOf(p) === P.headingOf(p2[i])));

  /* B5: keys are unique. Two people are never one person. */
  ok('B5 every person on the block has their own key',
    new Set(p1.map(p => p.key)).size === p1.length);

  /* B6: a DIFFERENT block is different people, or the block seed is decorative. */
  const other = roster(SEED + 1);
  const po = P.peopleOf(SEED + 1, other.agents);
  const shared = po.filter(p => p1.some(q => q.key === p.key)).length;
  ok('B6 another block is other people', shared === 0);

  /* B7: THE ONE THAT MATTERS. The run's applyBlob throws every agent away and
     rebuilds from the seed, then re-steps. Identity has to survive that or a
     save load quietly replaces the neighbourhood with strangers. */
  const sim1 = A.makeSim(a1.res, a1.feet, a1.agents, { startTurn: 0 });
  for (let i = 0; i < 480; i++) sim1.step();                 // sleep the night, as the run does
  ok('B7 a real sim runs the block through to morning',
    !!sim1 && sim1.agents.length === a1.agents.length && sim1.outAgents().length > 0);
  const rebuilt = A.agentsForBlock(SEED, a1.feet, [], null,
    { occupiedRate: 6 / Math.max(1, a1.feet.length) });
  const pr = P.peopleOf(SEED, rebuilt);
  ok('B8 the people survive the sim being thrown away and rebuilt',
    pr.length === p1.length && pr.every((p, i) => p.key === p1[i].key && p.lookSeed === p1[i].lookSeed));

  /* B9-B10: THE REGRESSION THIS GATE FOUND ON ITS FIRST RUN, locked open.
     The alpha bakes RUN_LOOKS = 6 townsfolk bodies. Taking the modulus of the
     RAW agent seed can only ever return 0, 2 or 4 — three of Paolo's six baked
     looks were unreachable, measured over 528 bodies on 40 blocks — because
     bohemia_agents.hash loses its low bits in a float64 multiply. If somebody
     ever puts the raw seed back, B9 goes red on the same measurement. */
  const RUN_LOOKS = 6;
  let raw = new Set(), mixed = new Set(), bodies = 0;
  for (let s = 1; s <= 40; s++) {
    const b = roster((s * 2654435761) >>> 0);
    P.peopleOf(1, b.agents).forEach((p, i) => {
      bodies++; raw.add((b.agents[i].seed >>> 0) % RUN_LOOKS); mixed.add(p.lookSeed % RUN_LOOKS);
    });
  }
  ok('B9 the raw agent seed still cannot reach every look — the bug is real (' +
    [...raw].sort().join(',') + ' of 0-5, ' + bodies + ' bodies)', raw.size < RUN_LOOKS);
  ok('B10 EVERY ONE of Paolo\'s six baked bodies is reachable now (' +
    [...mixed].sort().join(',') + ')', mixed.size === RUN_LOOKS);
  const slots = new Set(p1.map(p => p.lookSeed % RUN_LOOKS)).size;
  ok('B10b one real block spreads across the cast (' + slots + ' of 6)', slots >= 4);

  /* B11-B13: every card row is a fact the sim already knew. Change the fact,
     the row changes; change nothing, nothing changes. */
  const ag = a1.agents[0], pe = p1[0];
  const c1 = P.cardFor(pe, ag, 600, null), c2 = P.cardFor(pe, ag, 600, null);
  ok('B11 the card is a pure function of the world', JSON.stringify(c1) === JSON.stringify(c2));
  const lives = c1.find(r => r.label === 'LIVES');
  ok('B12 LIVES is the house the sim put them in',
    !!lives && lives.value === 'HOUSE ' + (P.seatOf(ag).house + 1) + ' ON THIS BLOCK');
  const nightCard = P.cardFor(pe, ag, 60, null);      // 01:00
  const dayCard = P.cardFor(pe, ag, 13 * 60, null);   // 13:00
  ok('B13 RIGHT NOW moves with the clock',
    JSON.stringify(nightCard) !== JSON.stringify(dayCard));

  /* B14: the day line comes off the schedule, so two different days read
     differently. The 7/29 archetype work made 296 of 297 days distinct and
     nothing has ever shown one to the player. */
  const dayLines = new Set(a1.agents.map(x => P.dayLineOf(x)));
  ok('B14 people have visibly different days (' + dayLines.size + ' distinct)', dayLines.size >= 6);

  /* B15: a worker's job is a real neighbouring district, not a label. */
  const jobbed = { id: 'H1-1', role: 'worker', seed: 3,
    job: { kind: 'site', district: 'solar', dir: 'E', dist: 2 } };
  ok('B15 a site job names the real district and which way it is',
    P.workLineOf(P.personOf(1, jobbed)) === 'SOLAR, EAST');
  ok('B16 no site job says so plainly',
    P.workLineOf(p1.find(p => p.work && p.work.kind !== 'site')) === 'SCAVENGES THIS BLOCK');

  /* B17-B20: the meeting ledger. The smallest honest memory there is. */
  const led = P.makeLedger(null);
  const k = p1[0].key;
  ok('B17 nobody is remembered before you meet them', led.times(k) === 0);
  const first = led.meet(k, 0);
  ok('B18 the meeting that makes it not-the-first still reads FIRST TIME',
    P.metWords(first) === 'FIRST TIME');
  led.meet(k, 1);
  ok('B19 the second meeting remembers the first', P.metWords(led.get(k)) === 'ONCE BEFORE');
  const round = P.makeLedger(JSON.parse(JSON.stringify(led.serialize())));
  ok('B20 the ledger survives a JSON round trip (it rides in the save blob)',
    round.times(k) === 2 && round.get(k).first === 0 && round.get(k).last === 1);
  ok('B21 a junk save does not crash the ledger',
    P.makeLedger({ bad: 7, worse: null }).known() === 0);
}

/* ==========================================================================
   PART C — THE REAL SURFACE. The run, in a real browser, tapped like a thumb.
   ========================================================================== */
const CAST_COLOURS = [[220, 40, 40], [40, 200, 90], [60, 110, 240], [230, 200, 40],
                      [200, 60, 220], [40, 210, 210], [240, 140, 40], [150, 150, 150]];

/* a stand-in cast: real message shape, flat colours instead of Paolo's art. */
function synthCast() {
  const frame = (w, h, rgb) => {
    const raw = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      raw[i * 4] = rgb[0]; raw[i * 4 + 1] = rgb[1]; raw[i * 4 + 2] = rgb[2]; raw[i * 4 + 3] = 255;
    }
    return { w, h, raw };
  };
  const dirs = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
  const set = rgb => ({ idle: frame(56, 56, rgb), walk: [frame(56, 56, rgb), frame(56, 56, rgb)] });
  const out = { type: 'BOHEMIA_RUN_CAST', w: 56, h: 56, packed: true,
                player: {}, looks: [], portraits: { you: frame(64, 64, [90, 90, 90]), looks: [] } };
  for (const d of dirs) out.player[d] = set([120, 120, 120]);
  CAST_COLOURS.forEach(rgb => {
    const L = { dirs: {} };
    for (const d of dirs) L.dirs[d] = set(rgb);
    out.looks.push(L);
    out.portraits.looks.push(frame(64, 64, rgb));
  });
  return out;
}

function route(pass2d, from, to, doorStops) {
  const H = pass2d.length, W = pass2d[0].length;
  const key = (x, y) => x + ',' + y;
  const prev = {}, seen = { [key(from[0], from[1])]: true };
  let q = [from];
  while (q.length) {
    const cur = q.shift();
    if (cur[0] === to[0] && cur[1] === to[1]) break;
    for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cur[0] + d[0], ny = cur[1] + d[1], k = key(nx, ny);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[k] || !pass2d[ny][nx]) continue;
      seen[k] = true; prev[k] = cur;
      if (doorStops && doorStops[k] != null && !(nx === to[0] && ny === to[1])) continue;
      q.push([nx, ny]);
    }
  }
  if (!seen[key(to[0], to[1])]) return null;
  const steps = []; let cur = to;
  while (!(cur[0] === from[0] && cur[1] === from[1])) {
    const p = prev[key(cur[0], cur[1])];
    if (!p) return null;
    steps.unshift([cur[0] - p[0], cur[1] - p[1]]); cur = p;
  }
  return steps;
}
const tap = (page, d) => page.click(d[0] === 1 ? '#br' : d[0] === -1 ? '#bl' : d[1] === 1 ? '#bd' : '#bu');

async function tapThroughDoor(page, d, wasInside) {
  for (let i = 0; i < 14; i++) {
    await tap(page, d);
    const st = await page.evaluate(() => window.__RUN.state());
    if ((st.mode === 'int') !== wasInside) return true;
    await page.waitForTimeout(120);
  }
  return false;
}
async function walkOutOfHouse(page) {
  const inr = await page.evaluate(() => window.__RUN.interior());
  const st = await page.evaluate(() => window.__RUN.state());
  const steps = route(inr.pass, [st.px, st.py], inr.door, null);
  if (!steps) throw new Error('no route to the front door');
  for (let i = 0; i < steps.length; i++) {
    if (i === steps.length - 1) { if (!await tapThroughDoor(page, steps[i], true)) throw new Error('the front door never opened'); }
    else await tap(page, steps[i]);
  }
}

/* CHASE. A scheduled body moves one tile per world-turn and so do you, so the
   only way to stand next to one is to re-plan after every single step. */
async function walkUpTo(page, key, grid) {
  const g = grid || await page.evaluate(() => window.__RUN.grid());
  for (let guard = 0; guard < 240; guard++) {
    const st = await page.evaluate(() => window.__RUN.state());
    const pl = await page.evaluate(() => window.__RUN.people());
    const who = pl && pl.people.find(p => p.key === key);
    if (!who || !who.outside) return false;      // they went indoors: pick another
    if (Math.abs(who.x - st.px) + Math.abs(who.y - st.py) === 1) {
      await tap(page, [who.x - st.px, who.y - st.py]);       // face them and stop
      return true;
    }
    const steps = route(g.pass, [st.px, st.py], [who.x, who.y], g.doorOf);
    if (!steps || !steps.length) return false;
    await tap(page, steps[0]);
  }
  return false;
}
/* THE BLOCK IS 128 TILES ACROSS and a scheduled body can be anywhere on it, so
   chase the NEAREST one and fall through to the next if they go inside. */
async function walkUpToAnyone(page, grid) {
  const st = await page.evaluate(() => window.__RUN.state());
  const pl = await page.evaluate(() => window.__RUN.people());
  const outs = pl.people.filter(p => p.outside)
    .map(p => ({ p, d: Math.abs(p.x - st.px) + Math.abs(p.y - st.py) }))
    .sort((a, b) => a.d - b.d);
  for (const c of outs.slice(0, 3)) if (await walkUpTo(page, c.p.key, grid)) return c.p;
  return null;
}

async function partC() {
  console.log('C. THE REAL RUN, IN A REAL BROWSER, TAPPED LIKE A THUMB');
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    /* C0: the SHIPPED surface draws bodies through the identity layer. A body
       drawn from the raw seed can only ever wear three of Paolo's six looks
       (see B9/B10), and the portrait would stop being the body you walked up
       to. Read the built file, because that is the one the alpha loads. */
    const built = fs.readFileSync(RUN_FILE, 'utf8');
    ok('C0 the shipped run draws scheduled bodies from the identity layer',
      built.includes('lookFor(personFor(a).lookSeed)') && !built.includes('lookFor(a.seed)'));

    await page.goto('file://' + RUN_FILE);
    await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
    await page.evaluate(() => window.__RUN.wipeSaves());

    /* the cast the parent alpha would have posted, stood in for (see header) */
    await page.evaluate(c => window.postMessage(c, '*'), synthCast());
    await page.waitForTimeout(150);
    const looks = await page.evaluate(() => window.__RUN.people() && window.__RUN.people().looks);
    ok('C1 the run has a cast to draw faces from', looks === CAST_COLOURS.length);

    /* THE RUN OPENS ON A LIVING STREET: buildSim(450) warms the block to ~07:30
       before you ever get out of bed, so there are real people to walk up to. */
    const boot = await page.evaluate(() => window.__RUN.people());
    ok('C2 the block holds a real roster (' + boot.n + ' people)', boot.n >= 6);
    ok('C3 the run opens after breakfast, not at midnight (turn ' + boot.turn + ')', boot.turn >= 400);
    await walkOutOfHouse(page);
    const morning = await page.evaluate(() => window.__RUN.people());
    ok('C4 there are people out on the street (' +
      morning.people.filter(p => p.outside).length + ')', morning.people.some(p => p.outside));

    /* THE KEY IS THE BLOCK'S, NOT THE VALLEY'S. `SEED` is 7 for the whole world;
       if identity keyed off it, house 3's second resident would be the same
       person in every cell there is. */
    ok('C4b identities are keyed to THIS block, not the whole valley',
      morning.people.every(p => /^P:\d+:H\d+-\d+$/.test(p.key)) &&
      !morning.people.some(p => p.key.startsWith('P:7:')));

    /* WALK UP TO A REAL ONE. */
    const grid = await page.evaluate(() => window.__RUN.grid());
    const target = await walkUpToAnyone(page, grid);
    ok('C5 you can walk up to a scheduled body', !!target);
    if (!target) return { errors, browser };

    const verb = await page.evaluate(() => window.__RUN.verb());
    ok('C6 the one button names WHO it is (' + (verb && verb.label) + ')',
      !!verb && verb.verb === 'talk' && verb.label === 'TALK TO THE ' + target.heading);

    await page.click('#act');
    ok('C7 the dialogue sheet opens', await page.isVisible('#talk'));
    ok('C8 the identity card is on it', await page.isVisible('#idcard'));

    const spk = (await page.textContent('#spk')).trim();
    const seat = (await page.textContent('#seat')).trim();
    ok('C9 the sheet names them by what the world calls them', spk === target.heading);
    ok('C10 and says where they sit in their household (' + seat + ')', seat === target.seat);

    const rows = await page.$$eval('#idcard .r', els => els.map(e => ({
      k: e.querySelector('.k').textContent.trim(), v: e.querySelector('.v').textContent.trim() })));
    const row = k => (rows.find(r => r.k === k) || {}).v;
    ok('C11 the card shows the empty named-cast honestly', row('NAME') === 'NOT NAMED YET');
    ok('C12 LIVES is their real house', row('LIVES') === 'HOUSE ' + (target.house + 1) + ' ON THIS BLOCK');
    ok('C13 WORKS is on the card', !!row('WORKS'));
    ok('C14 RIGHT NOW is on the card', !!row('RIGHT NOW'));
    ok('C15 THEIR DAY is on the card', /OUT \d\d:\d\d|HOME ALL DAY/.test(row('THEIR DAY') || ''));
    ok('C16 the first meeting reads as the first', row('YOU HAVE MET') === 'FIRST TIME');

    /* THE FACE IS THE BODY. Read the pixels the player is looking at. */
    const px1 = await page.evaluate(() => {
      const c = document.getElementById('spkface');
      if (!c || c.style.display === 'none') return null;
      const d = c.getContext('2d').getImageData(32, 32, 1, 1).data;
      return [d[0], d[1], d[2], d[3]];
    });
    const want = CAST_COLOURS[(target.lookSeed >>> 0) % CAST_COLOURS.length];
    ok('C17 the portrait is drawn at all', !!px1 && px1[3] === 255);
    ok('C18 THE FACE IS THIS PERSON\'S FACE, at their own look index',
      !!px1 && px1[0] === want[0] && px1[1] === want[1] && px1[2] === want[2]);

    ok('C19 nobody speaks, because his lines table is empty',
      (await page.$$('#says p')).length === 0);
    ok('C20 the hour with them is still on offer, inside the conversation',
      await page.isVisible('#pplhang'));

    await page.screenshot({ path: path.join(PROOF_DIR, 'BOHEMIA_PEOPLE_CARD_7_31_26.png') });

    /* WALK AWAY AND COME BACK: they remember. */
    await page.click('#pplleave');
    ok('C21 leaving closes the sheet', !(await page.isVisible('#talk')));
    const again = await walkUpTo(page, target.key, grid);
    if (again) {
      await page.click('#act');
      const met2 = await page.$$eval('#idcard .r', els => {
        const r = els.find(e => e.querySelector('.k').textContent.trim() === 'YOU HAVE MET');
        return r ? r.querySelector('.v').textContent.trim() : null; });
      ok('C22 the second meeting remembers the first', met2 === 'ONCE BEFORE');
      await page.click('#pplleave');
    } else ok('C22 the second meeting remembers the first (could not re-reach)', false);

    /* AND IT SURVIVES THE SAVE. The bodies do not survive a load; the people do. */
    const code = await page.evaluate(() => window.__RUN.exportCode());
    const fresh = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const ferr = [];
    fresh.on('pageerror', e => ferr.push('PAGEERROR: ' + e.message));
    await fresh.goto('file://' + RUN_FILE);
    await fresh.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
    const loaded = await fresh.evaluate(t => window.__RUN.importCode(t), code);
    ok('C23 the save loads on a fresh page', loaded === true);
    const after = await fresh.evaluate(() => window.__RUN.people());
    ok('C24 the same block comes back as the same people',
      after && after.people.length === morning.people.length &&
      after.people.every((p, i) => p.key === morning.people[i].key));
    ok('C25 WHO YOU HAVE MET SURVIVED THE LOAD', !!after.met[target.key] && after.met[target.key].times >= 2);
    ok('C26 the loaded page threw nothing', ferr.length === 0);

    ok('C27 the whole thing ran with zero page errors' + (errors.length ? ': ' + errors[0] : ''),
      errors.length === 0);
    return { errors, browser };
  } finally {
    await browser.close();
  }
}

(async () => {
  console.log('PEOPLE GATE — the bodies on the block are people');
  partA();
  partB();
  await partC();
  console.log((fail ? 'FAILED' : 'OK') + ': ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL: gate threw — ' + (e && e.stack || e)); process.exit(1); });
