/* ============================================================================
   PEOPLE GATE (7/31/26, PEOPLE lane) — THE BODIES ON THE BLOCK ARE PEOPLE.

   A law without a machine gate is not enforced. Three laws land here:

     1. YOU HAVE TO ASK (Paolo 7/31, LOCKED — laws/BOHEMIA_ADDENDUM_YOU_HAVE_TO_
        ASK_7_31_26.md). "Nobody will have a name unless you talk to them and ask
        them for their name... I hate how in other games you know everyone's name
        off the bat and I think it's complete bullshit... once you ask their name,
        if you see them again, then they would be named."
        THIS GATE ASSERTED THE EXACT OPPOSITE THIS MORNING — no names anywhere,
        plus a sweep of the module for a name bank — which was the right read of
        the standing rule then and is simply not the law now. A GATE MUST NEVER
        OUTRANK A RULING (7/31 precedent: the cough assertions died with the fix
        they locked), so the claims were rewritten rather than the ruling being
        worked around. What holds now: a stranger is NEVER named however big the
        pool gets, asking is what names them, the same person answers the same
        way forever, and it survives a save.
        STILL MECHANISM-MINE: KNOWN_AT_START (the story people you already know)
        and LINES (what anybody says) ship EMPTY and this gate fails if either
        gains a row. The realistic way that breaks is not malice — it is a future
        session adding "a few placeholder names so it can be tested" and the
        placeholder becoming canon by shipping.

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
  console.log('A. A NAME IS EARNED, NEVER GIVEN');

  ok('A1 KNOWN_AT_START ships empty (who you already know is his)',
    Object.keys(P.KNOWN_AT_START).length === 0);
  ok('A2 LINES ships empty (what anybody says is his)', Object.keys(P.LINES).length === 0);

  const { agents } = roster(0xB10C);
  const people = P.peopleOf(0xB10C, agents);
  ok('A3 a real block generates people (' + people.length + ')', people.length >= 6);

  /* A4-A6: THE RULING ITSELF. A pool exists now — that is the change — and it
     must still be unreachable until the player asks. This is the claim that
     would go red if somebody "helpfully" pre-filled names to make a screenshot
     look better. */
  ok('A4 every person on a fresh block is a STRANGER', people.every(p => p.tier === 'stranger'));
  ok('A5 NOT ONE of them has a name, though the pool is right there (' +
    P.GIVEN.length + ' x ' + P.SURNAME.length + ' available)',
    people.every(p => P.nameOf(p) === null));
  const words = new Set(Object.values(P.ROLE_WORDS));
  ok('A6 a stranger is called by their trade, never a name',
    people.every(p => words.has(P.headingOf(p))));

  /* A7-A9: asking is what names them, and it names them the SAME way forever. */
  const one = P.personOf(0xB10C, agents[0], { asked: true });
  ok('A7 asking gives them a name (' + one.name + ')', !!P.nameOf(one) && one.tier === 'asked');
  ok('A8 the same person answers the same way, every time, on any device',
    P.personOf(0xB10C, agents[0], { asked: true }).name === one.name);
  ok('A9 you call them by their first name once you know it',
    P.headingOf(one) === String(one.name).split(' ')[0].toUpperCase());

  /* A10-A11: the pool is a real spread, not four names in a trenchcoat. */
  const named = new Set(), firsts = new Set();
  let heads = 0;
  for (let s2 = 1; s2 <= 40; s2++) {
    const seed = (s2 * 2654435761) >>> 0;
    const b = roster(seed);
    b.agents.forEach(a => {
      /* the BLOCK's seed, not a constant — house 3 slot 2 is a different person
         on every block, and passing one seed here would collide them all */
      const n = P.personOf(seed, a, { asked: true }).name;
      heads++; named.add(n); firsts.add(n.split(' ')[0]);
    });
  }
  /* 64 x 64 = 4096 combinations against ~500 people is a birthday problem, so a
     handful of shared names is EXPECTED and honestly fine (real neighbourhoods
     have two Marias). What must not happen is systematic collapse. */
  ok('A10 the valley does not keep introducing the same person (' + named.size +
    ' distinct names across ' + heads + ' people on 40 blocks)',
    named.size >= heads * 0.85);
  ok('A11 first names spread across the pool (' + firsts.size + ' of ' + P.GIVEN.length + ')',
    firsts.size >= P.GIVEN.length * 0.7);
  ok('A12 no duplicate rows in either pool',
    new Set(P.GIVEN).size === P.GIVEN.length && new Set(P.SURNAME).size === P.SURNAME.length);

  /* A13: the exception he ruled — story people you have known your whole life —
     works, and needs no asking. The table stays empty; this proves it is wired. */
  P.KNOWN_AT_START['P:0:TEST-1'] = { name: 'Ruled Name' };
  const known = P.personOf(0, { id: 'TEST-1', role: 'scav', seed: 7 });
  const takes = known.tier === 'known' && P.headingOf(known) === 'RULED' &&
                P.nameOf(known) === 'Ruled Name';
  delete P.KNOWN_AT_START['P:0:TEST-1'];
  ok('A13 somebody he rules you already know is named WITHOUT asking', takes);

  P.LINES['scav'] = ['a line'];
  const spoke = P.linesFor({ key: 'x', role: 'scav' }).length === 1;
  delete P.LINES['scav'];
  ok('A14 a ruled line would be spoken the moment he writes one', spoke);
  ok('A15 with the table empty, nobody says anything', P.linesFor(people[0]).length === 0);

  /* A16: the missing name is VISIBLE, not blank. The hole IS the mechanic, and
     hiding it would make the card look finished when it is not. */
  const card = P.cardFor(people[0], agents[0], 600, null);
  const nameRow = card.find(r => r.label === 'NAME');
  ok('A16 the card says YOU HAVE NOT ASKED rather than hiding the row',
    !!nameRow && nameRow.value === 'YOU HAVE NOT ASKED');
  ok('A17 and it says their name once you have',
    (P.cardFor(one, agents[0], 600, null).find(r => r.label === 'NAME') || {}).value === one.name);
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

  /* B14: A ROUTINE IS FELT, NEVER READ (Paolo 7/31, LOCKED). This claim used to
     be the OPPOSITE — that the card showed you somebody's hours — and the module
     had a helper to do it. He ruled "it will all be invisible information" about
     an hour after it shipped. The people still HAVE different days; the player
     just learns them by being on the street at different hours. */
  ok('B14 the module cannot print a timetable even if asked', P.dayLineOf === undefined);
  const anyDay = /OUT \d\d:\d\d|THEIR DAY|HOME ALL DAY/;
  ok('B14b no card row is a timetable',
    !P.cardFor(p1[0], a1.agents[0], 600, null).some(r => anyDay.test(r.label + ' ' + r.value)));
  ok('B14c where they are RIGHT NOW is still legal — that is eyesight',
    !!P.cardFor(p1[0], a1.agents[0], 600, null).find(r => r.label === 'RIGHT NOW'));

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
    ok('C11 a stranger\'s card says YOU HAVE NOT ASKED', row('NAME') === 'YOU HAVE NOT ASKED');
    ok('C12 LIVES is their real house', row('LIVES') === 'HOUSE ' + (target.house + 1) + ' ON THIS BLOCK');
    ok('C13 WORKS is on the card', !!row('WORKS'));
    ok('C14 RIGHT NOW is on the card', !!row('RIGHT NOW'));
    ok('C15 NO TIMETABLE IS ON THE CARD (Paolo: "it will all be invisible information")',
      !row('THEIR DAY') && !rows.some(r => /OUT \d\d:\d\d/.test(r.v)));
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

    /* ------------------------------------------------------------------
       YOU HAVE TO ASK — the ruling, driven on the real surface by tapping
       the real button, because "once you ask their name, if you see them
       again, then they would be named" is a claim about PERSISTENCE and
       persistence is exactly what a unit test cannot prove.
       ------------------------------------------------------------------ */
    ok('C21 a stranger is offered the ask', await page.isVisible('#pplask'));
    ok('C22 the run knows nobody\'s name yet',
      (await page.evaluate(() => window.__RUN.people())).namesKnown === 0);
    await page.screenshot({ path: path.join(PROOF_DIR, 'BOHEMIA_PEOPLE_STRANGER_7_31_26.png') });

    await page.click('#pplask');
    const nameRow = await page.$$eval('#idcard .r', els => {
      const r = els.find(e => e.querySelector('.k').textContent.trim() === 'NAME');
      return r ? r.querySelector('.v').textContent.trim() : null; });
    const spk2 = (await page.textContent('#spk')).trim();
    ok('C23 ASKING NAMES THEM (' + nameRow + ')',
      !!nameRow && nameRow !== 'YOU HAVE NOT ASKED' && /^[A-Z][a-z]+ [A-Z]/.test(nameRow));
    ok('C24 the sheet stops calling them their trade and uses their name',
      spk2 === String(nameRow).split(' ')[0].toUpperCase());
    ok('C25 you cannot ask twice', !(await page.isVisible('#pplask')));
    ok('C26 the run counts one name known',
      (await page.evaluate(() => window.__RUN.people())).namesKnown === 1);

    await page.click('#pplleave');
    const verb2 = await page.evaluate(() => window.__RUN.verb());
    ok('C27 THE ONE BUTTON CALLS THEM BY NAME NOW (' + (verb2 && verb2.label) + ')',
      !!verb2 && verb2.label === 'TALK TO ' + String(nameRow).split(' ')[0].toUpperCase());

    await page.click('#act');
    await page.screenshot({ path: path.join(PROOF_DIR, 'BOHEMIA_PEOPLE_NAMED_7_31_26.png') });

    const met2 = await page.$$eval('#idcard .r', els => {
      const r = els.find(e => e.querySelector('.k').textContent.trim() === 'YOU HAVE MET');
      return r ? r.querySelector('.v').textContent.trim() : null; });
    ok('C28 the second meeting remembers the first', met2 === 'ONCE BEFORE');
    await page.click('#pplleave');
    ok('C29 leaving closes the sheet', !(await page.isVisible('#talk')));

    /* AND IT SURVIVES THE SAVE. The bodies do not survive a load; the people do. */
    const code = await page.evaluate(() => window.__RUN.exportCode());
    const fresh = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const ferr = [];
    fresh.on('pageerror', e => ferr.push('PAGEERROR: ' + e.message));
    await fresh.goto('file://' + RUN_FILE);
    await fresh.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
    const loaded = await fresh.evaluate(t => window.__RUN.importCode(t), code);
    ok('C30 the save loads on a fresh page', loaded === true);
    const after = await fresh.evaluate(() => window.__RUN.people());
    ok('C31 the same block comes back as the same people',
      after && after.people.length === morning.people.length &&
      after.people.every((p, i) => p.key === morning.people[i].key));
    ok('C32 WHO YOU HAVE MET SURVIVED THE LOAD', !!after.met[target.key] && after.met[target.key].times >= 2);
    /* THE HALF HE CALLED REALLY COOL: not that you learn a name, that the game
       still has it next time. A fresh page, a loaded save, and they are still
       named. */
    ok('C33 THE NAME SURVIVED THE LOAD ON A FRESH PAGE', after.namesKnown === 1 &&
      !!(after.people.find(p => p.key === target.key) || {}).name);
    ok('C34 and the loaded page calls them by it',
      (after.people.find(p => p.key === target.key) || {}).name === nameRow);
    ok('C35 the loaded page threw nothing', ferr.length === 0);

    ok('C36 the whole thing ran with zero page errors' + (errors.length ? ': ' + errors[0] : ''),
      errors.length === 0);
    return { errors, browser };
  } finally {
    await browser.close();
  }
}

/* ==========================================================================
   PART D — THE OTHER END OF THE COMMUTE. Every worker in the valley walked out
   of their gate to a named district and then LEFT THE WORLD: loc.mode 'away',
   rendered by nobody, while the site they worked at stood empty all day. And
   in the other direction the generator made a HOUSEHOLD out of every building
   in the valley, so ten people slept in a strip mall and three in a solar
   farm's inverter shed — 52 of 58 sampled cells had the census saying nobody
   lived there while agents materialised anyway.
   Driven on the REAL run through the run's own loadCell, because a model that
   is right in node and wrong on the surface is wrong.
   ========================================================================== */
async function partD() {
  console.log('D. A WORKER IS THE SAME PERSON AT WORK AS AT HOME');
  const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
  global.window = global;
  const world = (global.BohemiaWorld || W).world(7);

  /* D1-D3: the lie is gone, valley-wide, and the two sources of truth agree. */
  let mismatch = 0, checked = 0, sleepersInShops = 0;
  for (let y = 0; y < 48; y += 3) for (let x = 0; x < 48; x += 3) {
    const c = world.at(x, y); if (!c || !c.district) continue;
    const res = A.agentsForPlot(world, x, y);
    const cen = A.censusForPlot(world, x, y).people;
    checked++; if (cen !== res.length) mismatch++;
    if (!A.RESIDENTIAL[c.district] && res.length) sleepersInShops += res.length;
  }
  ok('D1 census and agents agree on every sampled cell (' + checked + ' cells)', mismatch === 0);
  ok('D2 NOBODY SLEEPS IN THE STRIP MALL any more', sleepersInShops === 0);
  ok('D3 the housing list matches the kit\'s own registrations (apartment + trailer are homes)',
    !!A.RESIDENTIAL.apartment && !!A.RESIDENTIAL.trailer && !!A.RESIDENTIAL.suburb);

  /* D4-D5: workers arrive, and they are not new people. */
  /* FIND a staffed job site rather than naming one. Hard-coded coordinates broke
     the moment the occupancy rate was derived down 8x on 8/1: cell 20,3 stopped
     having commuters and the claim went red without anything being wrong. The
     claim was always "job sites are staffed by the blocks that send them", never
     "cell 20,3 specifically". */
  let wk = [], home = [], at = null;
  outer:
  for (let y = 0; y < 48 && !at; y++) for (let x = 0; x < 48; x++) {
    const w = A.workersForPlot(world, x, y);
    if (!w.length) continue;
    wk = w; at = [x, y];
    home = A.agentsForPlot(world, w[0].fromCell[0], w[0].fromCell[1]);
    break outer;
  }
  ok('D4 a job site somewhere is staffed by the blocks that send it people' +
    (at ? ' (' + at + ', ' + wk.length + ' workers)' : ''), wk.length > 0);
  ok('D5 every worker there is one of the residents of the block they came from',
    wk.length > 0 && wk.every(w => {
      const h = A.agentsForPlot(world, w.fromCell[0], w.fromCell[1]);
      return h.some(r => r.id === w.id && r.seed === w.seed);
    }));
  ok('D6 a visitor is flagged so the sim never treats them as a resident',
    wk.every(w => w.visiting === true && Array.isArray(w.fromCell)));

  /* D7: THE REAL SURFACE. Walk the run to the clinic west of home and check the
     people standing in it are the player's own neighbours. */
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + RUN_FILE);
    await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
    const homeCell = await page.evaluate(() => window.__RUN.cell());
    /* THE WORKPLACE IS DERIVED FROM THE DOORSTEP, NOT HARDCODED (8/1, CITY lane).
       This asked for cell (38,23) by name, because that was the clinic next door
       to the doorstep findHomeCell happened to pick. Then Paolo's NO DISTRICT IS
       A PRISON ruling landed - the start cell must touch a real street, and the
       old one did not - so the doorstep moved and D7-D10 went red while the
       thing they assert, that a worker keeps ONE identity at home and at work,
       was still perfectly true.
       A gate that names a coordinate produced by a function it does not own will
       go red every time that function is legitimately improved. So it asks the
       run where home is and walks to whatever workplace is actually next door. */
    /* the FOUR the commute actually uses (bohemia_agents.js JOB_DISTRICTS).
       A wider list finds buildings nobody is ever sent to, which is how this
       first came back green on D7 and empty on D8. */
    const WORKPLACE = /^(commercial|industrial|medical|solar)$/;
    const nb = await page.evaluate(() => window.__RUN.neighbours());
    const side = Object.keys(nb).find(k => WORKPLACE.test(String(nb[k] || '')));
    const DIR = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
    ok('D7a the doorstep has a workplace next door to walk to', !!side);
    const wc = side ? [homeCell.at[0] + DIR[side][0], homeCell.at[1] + DIR[side][1]] : [38, 23];
    const clinic = await page.evaluate(c => window.__RUN.gotoCell(c[0], c[1]), wc);
    ok('D7 the run can stand on a workplace cell',
      !!clinic && WORKPLACE.test(String(clinic.name || '')));
    const atWork = await page.evaluate(() => window.__RUN.people());
    ok('D8 THE CLINIC HAS PEOPLE IN IT (' + (atWork ? atWork.n : 0) + ')', !!atWork && atWork.n > 0);
    ok('D9 and some of them are out in it right now (' +
      (atWork ? atWork.people.filter(p => p.outside).length : 0) + ')',
      !!atWork && atWork.people.some(p => p.outside));
    const workKeys = atWork.people.map(p => p.key);
    await page.evaluate(c => window.__RUN.gotoCell(c[0], c[1]), homeCell.at);
    const atHome = await page.evaluate(() => window.__RUN.people());
    const shared = atHome.people.filter(p => workKeys.includes(p.key)).length;
    /* THE WHOLE POINT: identity keyed to where you LIVE, not where you stand. If
       a worker were re-keyed by the cell they are standing on, this is 0 and you
       would ask somebody their name at work and be a stranger to them at home. */
    ok('D10 YOUR OWN NEIGHBOURS ARE AT THE CLINIC (' + shared + ' of ' + atWork.n +
      ' share an identity with this block)', shared > 0);
    ok('D11 nothing threw while crossing the valley', errs.length === 0);
  } finally { await browser.close(); }
}

/* ==========================================================================
   PART E — THE POPULATION DIAL (Paolo 8/1: "till I make a population slider ...
   extremely important as we go throughout the three acts ... extremely easy to
   control ... all the way from zero to a maximum").
   ONE number that everything asking "how many people live here" multiplies by.
   The wiring is mine; the slider and the numbers are his.
   ========================================================================== */
async function partE() {
  console.log('E. ONE DIAL, ZERO TO MAXIMUM');
  const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
  global.window = global;
  const POP = require(path.join(ROOT, 'engine/bohemia_population.js'));
  global.BohemiaPopulation = POP;
  const world = (global.BohemiaWorld || W).world(7);
  const count = () => { let n = 0, c = 0;
    for (let y = 0; y < 48; y += 3) for (let x = 0; x < 48; x += 3) {
      const k = A.agentsForPlot(world, x, y).length; n += k; if (k) c++; }
    return { n, c }; };

  ok('E1 the dial defaults to 1 — nothing in the world moved until he moves it',
    POP.dial() === 1);

  POP.setDial(0);
  const zero = count();
  /* THE BOTTOM OF HIS SLIDER HAS TO BE A REAL ZERO. Not "fewer people" — nobody,
     anywhere, so an emptied valley is reachable for act 3 or a difficulty. */
  ok('E2 dial 0 is a GHOST VALLEY, not just fewer people (' + zero.n + ' people)',
    zero.n === 0 && zero.c === 0);

  const steps = [];
  for (const d of [0, 0.5, 1, 2, POP.DIAL_MAX]) { POP.setDial(d); steps.push(count().n); }
  ok('E3 more dial is never fewer people (' + steps.join(' -> ') + ')',
    steps.every((v, i) => i === 0 || v >= steps[i - 1]));
  ok('E4 the top of the slider really fills it up', steps[steps.length - 1] > steps[2]);

  ok('E5 it clamps to its own range', POP.setDial(-5) === POP.DIAL_MIN &&
    POP.setDial(9999) === POP.DIAL_MAX && POP.setDial('nonsense') === POP.DIAL_MAX);

  /* E6: the dial says HOW MANY, never WHERE. His 7/29 zone map ruling is that
     the valley is clusters AND no man's lands; thinning it must not relocate
     anybody, so the cells alive at a lower dial are a SUBSET of the ones alive
     higher up. */
  POP.setDial(1);
  const alive1 = new Set();
  for (let y = 0; y < 48; y += 3) for (let x = 0; x < 48; x += 3)
    if (A.agentsForPlot(world, x, y).length) alive1.add(x + ',' + y);
  POP.setDial(0.5);
  let outside = 0;
  for (let y = 0; y < 48; y += 3) for (let x = 0; x < 48; x += 3)
    if (A.agentsForPlot(world, x, y).length && !alive1.has(x + ',' + y)) outside++;
  ok('E7 turning it down thins the valley, it never MOVES anybody', outside === 0);

  /* E8: determinism survives. Same dial, same people, or identity is a lie. */
  POP.setDial(1);
  const a1 = A.agentsForPlot(world, 20, 5).map(a => a.id + '/' + a.seed).join(',');
  POP.setDial(3); POP.setDial(1);
  ok('E9 the same dial gives back the same people',
    A.agentsForPlot(world, 20, 5).map(a => a.id + '/' + a.seed).join(',') === a1);

  ok('E10 the ACT table ships EMPTY — which acts want which number is his',
    Object.keys(POP.ACT_DIAL).length === 0 && POP.dialForAct(1) === null);

  /* E11: THE REAL SURFACE. A dial nothing consumes is a decoration, so turn it
     to zero and check the run itself empties. */
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto('file://' + RUN_FILE);
    await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
    const before = await page.evaluate(() => window.__RUN.people().n);
    const after = await page.evaluate(() => {
      BohemiaPopulation.setDial(0);
      const c = window.__RUN.cell().at;
      window.__RUN.gotoCell(c[0], c[1]);
      const n = window.__RUN.people().n;
      BohemiaPopulation.setDial(1);
      return n;
    });
    ok('E11 the run itself empties when the dial goes to zero (' + before + ' -> ' + after + ')',
      before > 0 && after === 0);
  } finally { await browser.close(); POP.setDial(1); }
}

/* ==========================================================================
   PART F — THIS LANE'S PATCH TOOL CANNOT EAT ANOTHER LANE'S CODE.
   tools/bohemia_people_identity_patch.py fences its edits with PEOPLE:<name>
   markers and RESTORES each fence before re-applying. On 8/1 another lane
   anchored its 29-line RUN PERSON FACTS block on a line INSIDE the
   PEOPLE:WORKERS fence, so a re-run DELETED IT — silently, taking RUN_PEOPLE
   with it and turning run_people_gate from 45/0 to 34/5.
   A STATIC CHECK, on purpose: this gate must never RUN the tool (it writes
   files). It reads the committed slice and asserts the shape that makes the
   tool safe — no fence spans code the tool does not own.
   ========================================================================== */
function partF() {
  console.log('F. THE PATCH TOOL CANNOT EAT ANOTHER LANE\'S CODE');
  const SLICE = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
  const TOOL = path.join(ROOT, 'tools/bohemia_people_identity_patch.py');
  const slice = fs.readFileSync(SLICE, 'utf8');
  const tool = fs.readFileSync(TOOL, 'utf8');

  ok('F1 the tool refuses rather than deleting: the guard is present',
    /REFUSING TO WRITE: a line inside the PEOPLE:/.test(tool));
  /* the guard has to compare against what the block INSERTS. A guard that
     sniffed for banner comments flagged this tool's own headers - a checker that
     cannot tell a mention from a use is the broken one (8/1 law). */
  ok('F2 the guard compares against the block\'s own insert text, not a heuristic',
    /function restore\(text, name, original='', mine=None\)|def restore\(text, name, original='', mine=None\)/.test(tool));

  const names = [...tool.matchAll(/\('([A-Z0-9]+)',\s+A_/g)].map(m => m[1]);
  ok('F3 the tool declares its fences (' + names.length + ')', names.length >= 8);

  let spanning = [];
  for (const n of names) {
    const re = new RegExp('/\\*\\s*PEOPLE:' + n + '\\s*\\*/[\\s\\S]*?/\\*\\s*/PEOPLE:' + n + '\\s*\\*/');
    const m = re.exec(slice);
    if (!m) continue;
    /* another lane's code fences itself with a ==== banner. One inside our
       region means the region is not ours to delete. */
    if (/\/\* ==== (?!\/?RUN PERSON FACTS)/.test(m[0]) ||
        (/RUN PERSON FACTS/.test(m[0]))) spanning.push(n + ' (' + m[0].split('\n').length + ' lines)');
  }
  ok('F4 NO FENCE SPANS ANOTHER LANE\'S BLOCK' +
    (spanning.length ? ': ' + spanning.join(', ') : ''), spanning.length === 0);

  /* F5: the specific shape that was wrong. WORKERS has to stop before their
     block and JOIN has to pick up after it, or the two fences merge again. */
  const wi = slice.indexOf('/* /PEOPLE:WORKERS */');
  const fi = slice.indexOf('/* ==== RUN PERSON FACTS');
  const ji = slice.indexOf('/* PEOPLE:JOIN */');
  ok('F5 WORKERS closes before their block and JOIN opens after it',
    wi > 0 && fi > wi && ji > fi);
  ok('F6 their conditioning code is still in the file', /BohemiaPopulation.conditionAgents/.test(slice));
}

/* ==========================================================================
   PART G — THE SCALE MODEL. Paolo, 8/1, asked the question that settles how many
   people belong in this valley: take our Las Vegas against the real one, put the
   full 2040/2050 population into the scale model first, THEN apply the
   apocalypse. tools/bohemia_scale_model.js runs that derivation against the LIVE
   map. These claims keep the map, the arithmetic and the sim from drifting apart.
   ========================================================================== */
function partG() {
  console.log('G. THE SCALE MODEL SAYS HOW MANY');
  const SM = require(path.join(ROOT, 'tools/bohemia_scale_model.js'));
  const m = SM.measure(7), d = SM.derive(m);

  ok('G1 the map is the size the valley-scale law says (' + m.km2.toFixed(2) + ' km2)',
    Math.abs(m.km2 - 21.23) < 0.05);
  ok('G2 the map really contains the homes the model counts (' + m.dwellings + ')',
    m.dwellings > 10000 && m.dwellings < 15000);

  /* G3 IS THE ONE THAT MATTERS. Two independent scales - area and housing - have
     to agree, or the map is not a model of anything and the whole derivation is
     numerology. */
  const gap = Math.abs(d.byArea - d.byHomes) / d.byHomes;
  ok('G3 area scale (1:' + d.byArea.toFixed(1) + ') and housing scale (1:' +
    d.byHomes.toFixed(1) + ') agree within 25% (' + Math.round(gap * 100) + '%)', gap < 0.25);

  ok('G4 step 1: full 2050 Vegas at this scale is tens of thousands, not millions (' +
    Math.round(d.noApocalypse).toLocaleString('en-US') + ')',
    d.noApocalypse > 20000 && d.noApocalypse < 80000);
  ok('G5 step 2: after the 3% survival the valley holds about a thousand people (' +
    Math.round(d.afterCrash) + ')', d.afterCrash > 600 && d.afterCrash < 2000);

  /* G6: the SIM has to actually hold that many. This is the claim that goes red
     if somebody edits the occupancy rate back to a round guess. */
  const W2 = require(path.join(ROOT, 'engine/bohemia_world.js'));
  global.window = global;
  const world = (global.BohemiaWorld || W2).world(7);
  let live = 0;
  for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) {
    const c = world.at(x, y);
    if (c && A.RESIDENTIAL[c.district]) live += A.agentsForPlot(world, x, y).length;
  }
  const off = Math.abs(live - d.afterCrash) / d.afterCrash;
  ok('G6 THE SIM HOLDS WHAT THE ARITHMETIC SAYS: ' + live + ' people vs ' +
    Math.round(d.afterCrash) + ' derived (' + Math.round(off * 100) + '% off)', off < 0.25);

  /* G7: the old placeholder was 0.30 and it was 7x too many. Lock the door. */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_agents.js'), 'utf8');
  const rate = /var OCCUPIED_RATE=([0-9.]+);/.exec(src);
  ok('G7 the occupancy rate is the derived one, not a round guess (' +
    (rate ? rate[1] : '?') + ')', !!rate && parseFloat(rate[1]) < 0.08);
  ok('G8 the derivation is written down where the number lives',
    /scale model of our Las Vegas|SCALE|1,113|scale_model/.test(src));

  /* G9: his slider has to be able to REACH the truthful setting. The zone-map
     path yields ~60 at dial 1, so the answer is around 19x - a max of 4 could
     not express it, which is a broken slider. */
  const POP = require(path.join(ROOT, 'engine/bohemia_population.js'));
  ok('G9 the dial can reach the scale-model answer (max ' + POP.DIAL_MAX + ')',
    POP.DIAL_MAX >= 20);
}

/* ==========================================================================
   PART H — FOUR FAMILIES (Paolo 8/1, LOCKED: "in my starting neighborhood I want
   there to be four families"). EXACTLY four, and a family means more than one
   person. Driven on the real run, because the starting neighbourhood is the one
   place in the game he is guaranteed to stand.
   ========================================================================== */
async function partH() {
  console.log('H. FOUR FAMILIES IN THE STARTING NEIGHBOURHOOD');
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + RUN_FILE);
    await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
    const h = await page.evaluate(() => window.__RUN.people());
    const fam = {};
    h.people.forEach(p => { const k = p.id.split('-')[0]; (fam[k] = fam[k] || []).push(p); });
    const keys = Object.keys(fam);

    ok('H1 THE STARTING NEIGHBOURHOOD HOLDS EXACTLY FOUR FAMILIES (' + keys.length + ')',
      keys.length === 4);
    /* A RATE cannot say four. The old floor was a per-house coin flip that landed
       near six and came out five on this seed - which is why he asked twice. */
    ok('H2 every one of them is a FAMILY, not somebody living alone (' +
      keys.map(k => fam[k].length).join('/') + ')',
      keys.length > 0 && keys.every(k => fam[k].length >= 2));
    ok('H3 they are spread across the block, not clumped together',
      keys.length === 4 && new Set(keys).size === 4 &&
      Math.max(...keys.map(k => +k.slice(1))) - Math.min(...keys.map(k => +k.slice(1))) >= 6);
    ok('H4 the neighbourhood is a real handful of people (' + h.n + ')', h.n >= 8 && h.n <= 16);
    ok('H5 and some of them are outside where he can meet them (' +
      h.people.filter(p => p.outside).length + ')', h.people.some(p => p.outside));
    ok('H6 nothing threw', errs.length === 0);
  } finally { await browser.close(); }
}

(async () => {
  console.log('PEOPLE GATE — the bodies on the block are people');
  partA();
  partB();
  await partC();
  await partD();
  await partE();
  partF();
  partG();
  await partH();
  console.log((fail ? 'FAILED' : 'OK') + ': ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL: gate threw — ' + (e && e.stack || e)); process.exit(1); });
