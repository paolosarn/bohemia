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
   PART A — THE LAW, AS IT STANDS TODAY. WHO anybody IS is still his and still
   empty. WHAT THEY SAY stopped being empty on 8/11.

   A2 USED TO ASSERT "LINES ships empty" AND THAT CLAIM IS NOW BACKWARDS.
   ALWAYS MAKE AN ATTEMPT (Paolo 8/11, LOCKED) overturned exactly that reading:
   "This law was read as 'ship no words at all', and THAT READING COST HIM THE
   QUESTS -- an empty field is a BLANK PAGE, and he does not write from nothing,
   HE EDITS." An empty mouth was the blank page, so it is filled with drafts he
   can retype in the WORDS tab, every one citing the corpus finding it came from.
   A GATE MUST NEVER OUTRANK A RULING (Paolo 8/1): a claim written under the old
   reading does not get to outlive the ruling that replaced it. It is INVERTED,
   not deleted, and the half that did NOT change is checked harder than before.
   ========================================================================== */
function partA() {
  console.log('A. A NAME IS EARNED, NEVER GIVEN');

  ok('A1 KNOWN_AT_START ships empty (who you already know is his)',
    Object.keys(P.KNOWN_AT_START).length === 0);
  /* A2 WAS "LINES SHIPS EMPTY" AND THAT RULING IS DEAD. It was the correct read of
     MECHANISM-MINE / CONTENTS-PAOLO'S on 7/31, and Paolo overturned it for WORDS on
     8/11, twice in one day: ALWAYS MAKE AN ATTEMPT ("FOR ANY TEXT JUST HAVE
     PLACEHOLDING GOOD ESTIMATES OF SPEECH BRO I WILL EDIT IT LIVE") and then
     DIALOGUE ALWAYS REFERS TO THE CATALOGUE. Newest date wins (CLAUDE.md truth
     hierarchy), and A GATE MUST NEVER OUTRANK A RULING (Paolo 8/1) -- so the
     WORDS lane wiring 244 ambient lines into LINES is the law being obeyed, and
     this claim failing was the RULER being wrong, not the target. Fix the ruler.

     WHAT THE CLAIM PROTECTS NOW, because the old one was protecting something
     real and deleting it outright would lose that: the danger was never "a line
     exists", it was "a line exists that HE CANNOT REACH TO EDIT" -- which is
     exactly how "I will edit it later" rots into "Claude writes the dialogue".
     So: lines are allowed, and every one of them must be in the WORDS book he
     edits from. A line nobody can find is still a violation.
     The DECISION half is untouched and still empty above (A1): who you already
     know is a ruling, not words. */
  const lineCount = Object.values(P.LINES).reduce(
    (n, v) => n + (Array.isArray(v) ? v.length : 1), 0);
  const bookPath = path.join(ROOT, 'records/BOHEMIA_WORDS_BOOK.json');
  let bookHas = 0;
  try {
    const book = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    const flat = JSON.stringify(book);
    let found = 0, total = 0;
    Object.values(P.LINES).forEach(v => (Array.isArray(v) ? v : [v]).forEach(line => {
      total++;
      if (typeof line === 'string' && flat.includes(JSON.stringify(line).slice(1, -1))) found++;
    }));
    bookHas = total ? found / total : 1;
  } catch (_e) { bookHas = 0; }
  ok('A2 every drafted line is reachable in the WORDS tab he edits from ('
    + lineCount + ' lines)',
    lineCount === 0 || bookHas >= 0.99,
    Math.round(bookHas * 100) + '% of LINES are in records/BOHEMIA_WORDS_BOOK.json '
    + '-- a line he cannot reach is a line he cannot edit (8/11)');

  /* AND THE MOUTH ANSWERS THE WORLD, not just the clock. Ambient time-of-day
     lines were the whole vocabulary: a person said the same thing whether you
     had robbed the block or fed it. REACTIONS keys on what the sim already
     emits (standing rung, clout tier seen/heard, memory of meeting you), so
     depth is reactivity and not word count. */
  ok('A2b the world REACTS to what you did, not just to the time of day',
    P.REACTIONS && Object.keys(P.REACTIONS).length >= 10,
    P.REACTIONS ? Object.keys(P.REACTIONS).length + ' reaction buckets' : 'no REACTIONS export');
  /* DECISIONS: still his, still empty. WHO anybody IS was never words. */
  ok('A2c NAMED_CAST is STILL EMPTY — WHO anybody is remains a DECISION',
    !P.NAMED_CAST || Object.keys(P.NAMED_CAST).length === 0);

  /* A2d EVERY met: STATE THE LEDGER CAN REACH HAS SOMETHING TO SAY, and this is
     the claim that would have caught `met:lied` shipping dead. Before 8/13 the
     ledger stored honest:0|1 and nothing else, so "never answered" and "answered
     and lied" were the same record -- metState could never return 'lied' and two
     written lines could never fire. A key the sim never emits is a line that can
     never fire, and the cure is on the EMITTING side: the boolean was already
     arriving at answer() and being discarded. This walks the ledger through every
     transition a player can actually cause and demands a bucket at each stop. */
  {
    const L = P.makeLedger(null);
    const seen = [];
    seen.push(L.metState('w'));                        // never met
    L.meet('w', 1); L.meet('w', 2); seen.push(L.metState('w'));   // met again
    L.meet('w', 3); L.meet('w', 4); seen.push(L.metState('w'));   // a regular
    L.ask('w', 5); seen.push(L.metState('w'));         // you asked their name
    L.answer('w', 6, false); seen.push(L.metState('w'));          // you lied
    L.answer('w', 7, true); seen.push(L.metState('w'));           // you told the truth
    const dead = seen.filter(s => !(P.REACTIONS && (P.REACTIONS['met:' + s] || []).length));
    ok('A2d every met: state the LEDGER can reach has lines (' + seen.join('>') + ')',
      dead.length === 0,
      dead.length ? 'DEAD KEYS, written and unreachable: ' + dead.join(', ') : '');
    ok('A2e metState covers all six — a state nothing can produce is a dead bucket',
      new Set(seen).size === 6, seen.join(' > '));
    /* AND IT SURVIVES A SAVE, or lying to somebody is forgiven by a reload. The
       honest bit needed exactly this check on 8/2 and the answered bit needs it
       for the same reason: serialize() is what the run writes into the blob. */
    const L2 = P.makeLedger(L.serialize());
    ok('A2f the answered bit survives serialize — a reload does not forgive a lie',
      L2.metState('w') === L.metState('w') && L2.lied('w') === L.lied('w'));
  }

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
/* THE BLOCK IS 128 TILES ACROSS and a scheduled body can be anywhere on it, so
   the nearest person out on the street is routinely a HUNDRED tiles away.

   RE-TARGET EVERY STEP, BECAUSE THAT IS WHAT A PLAYER DOES. The old version
   locked onto one person, walked at them, and gave up the instant they stepped
   indoors - then tried the next of only three candidates the same way. Over a
   hundred-tile chase somebody almost always goes inside first, so whether it
   passed came down to luck: on 8/2 a change that moved nobody and removed nobody
   (same three people outdoors, same distances, measured) flipped it from green to
   red purely by shifting when one of them went in for the morning.
   A gate whose answer depends on that is not measuring the thing it names. The
   claim is "you can walk up to a scheduled body", so this walks toward whoever
   is outdoors NOW, re-picks when that changes, and only fails if it truly cannot
   reach anybody in a full block's worth of walking. */
async function walkUpToAnyone(page, grid) {
  const g = grid || await page.evaluate(() => window.__RUN.grid());
  let stuck = 0;
  for (let guard = 0; guard < 400; guard++) {
    const st = await page.evaluate(() => window.__RUN.state());
    const pl = await page.evaluate(() => window.__RUN.people());
    const outs = pl.people.filter(p => p.outside)
      .map(p => ({ p, d: Math.abs(p.x - st.px) + Math.abs(p.y - st.py) }))
      .sort((a, b) => a.d - b.d);
    if (!outs.length) { if (++stuck > 40) return null; await tap(page, [0, 1]); continue; }
    const who = outs[0].p;
    if (outs[0].d === 1) { await tap(page, [who.x - st.px, who.y - st.py]); return who; }
    /* if the closest is unroutable, try the next few before burning a step */
    let stepped = false;
    for (const c of outs.slice(0, 4)) {
      const steps = route(g.pass, [st.px, st.py], [c.p.x, c.p.y], g.doorOf);
      if (steps && steps.length) { await tap(page, steps[0]); stepped = true; break; }
    }
    if (!stepped && ++stuck > 40) return null;
  }
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

    /* C4c: SOMEBODY IS RIGHT THERE WHEN YOU STEP OUTSIDE.
       Paolo, 8/2, in these words: "can you just have one extra NPC chilling
       outside the spawn in the suburb that I can just talk to and test out your
       mechanics." He had to ask because roam() sends every body to a random tile
       on a 128-tile block, so the nearest person outdoors was routinely a HUNDRED
       tiles from his front door - everything this lane built was reachable only
       after a long walk and a lot of luck.
       THE NUMBER IS THE CLAIM. "There exists a porch sitter" would pass with him
       standing anywhere at all; what he asked for is somebody he does not have to
       go looking for. */
    const outNow = await page.evaluate(() => window.__RUN.state());
    const near = morning.people.filter(p => p.outside)
      .map(p => Math.abs(p.x - outNow.px) + Math.abs(p.y - outNow.py))
      .sort((a, b) => a - b)[0];
    ok('C4c SOMEBODY IS CHILLING OUTSIDE YOUR DOOR — nearest body on the street ' +
      'is ' + near + ' tiles away, not across the block', near != null && near <= 12);

    /* C4d: AND HE IS NOT PLUGGING A WALKWAY. A body that never moves permanently
       removes a cell (OCCUPANCY LAW: one body per cell), so parking him in a
       driveway is not a decoration, it is a wall. The first placement did exactly
       that: at 15:00 three bodies sat stacked in a one-wide path all wanting
       home, two of them ordinary residents queued behind him, and run_people_gate
       went red on 'every body is indoors after the edit' - not because the edit
       missed anybody but because they could not walk. */
    const openness = await page.evaluate(() => {
      const g = window.__RUN.grid(), st = window.__RUN.state();
      const pl = window.__RUN.people().people.filter(p => p.outside)
        .map(p => ({ p, d: Math.abs(p.x - st.px) + Math.abs(p.y - st.py) }))
        .sort((a, b) => a.d - b.d)[0];
      if (!pl) return -1;
      let open = 0;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        if (!dx && !dy) continue;
        const row = g.pass[pl.p.y + dy];
        if (row && row[pl.p.x + dx]) open++;
      }
      return open;
    });
    ok('C4d and he is standing on OPEN GROUND, not plugging a walkway (' +
      openness + ' walkable sides)', openness >= 4);

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

    /* GOLD ON THE CANVAS BEFORE ANYONE IS NAMED. Taken standing exactly where
       C27a-c will take it again, so the two are the same view of the same street
       with one thing changed. It has to be a DELTA and not an absolute: the run
       already paints #e8b84a for your own front door, so "there is gold on
       screen" would have passed on the door alone and the claim would have been
       true for the wrong reason. */
    const goldOnScreen = () => page.evaluate(() => {
      const c = document.getElementById('cv') || document.querySelector('canvas');
      if (!c) return -1;
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let gold = 0;
      for (let i = 0; i < d.length; i += 4)
        if (d[i] > 200 && d[i + 1] > 150 && d[i + 1] < 210 && d[i + 2] < 110) gold++;
      return gold;
    });
    const goldBefore = await goldOnScreen();
    const strangerNames = await page.evaluate(() => window.__RUN_NAMES_DRAWN || []);
    ok('C6a NOBODY HAS A NAME OVER THEM YET — a stranger is anonymous on the ' +
      'world, not just on the card', strangerNames.length === 0);

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

    /* C19 WAS "NOBODY SPEAKS, BECAUSE HIS LINES TABLE IS EMPTY" and that is the
       FOURTH claim in this repo enforcing a ruling Paolo overturned on 8/11
       ("FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH BRO I WILL
       EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET"). A GATE MUST NEVER
       OUTRANK A RULING (8/1): fix the ruler, never the target.
       AND THE INVERSION IS THE HARDER CLAIM, which is the point of doing it here
       rather than deleting the line. Silence passed the old check whether the
       table was empty BY LAW or empty BY BUG -- and it was empty by bug for a
       month, because the call site asked with no arguments. Now the surface has
       to actually produce words, in the browser, on a real person. */
    const said = await page.$$eval('#says p', ns => ns.map(n => n.textContent.trim()));
    ok('C19 THEY SPEAK: the person card puts real words on screen (' +
      said.length + ' line' + (said.length === 1 ? '' : 's') + ')',
      said.length > 0 && said.every(s => s.length > 0),
      JSON.stringify(said.slice(0, 2)));
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

    /* ------------------------------------------------------------------
       AND YOU CAN SEE IT (Paolo 7/31, the half of the ruling that had never
       been built): "the game will track that SO ANYTIME YOU MIGHT SEE THEM IN
       THE FUTURE LIKE THEIR NAME WILL POP UP."
       Before this, the name lived on the card and on the one button - both of
       which need you close enough to touch them. Walk five steps and the person
       whose name you earned looked exactly like every stranger in the valley.
       READ THE PAINTED PIXELS, not a helper (7/18 law: a side-door probe is a
       lie). __RUN_NAMES_DRAWN says what the render decided; the canvas sample
       proves it actually put ink on the screen.
       ------------------------------------------------------------------ */
    const firstName = String(nameRow).split(' ')[0];
    const drawn = await page.evaluate(() => window.__RUN_NAMES_DRAWN || []);
    ok('C27a THE NAME YOU EARNED IS ON THE WORLD, not just on the card (' +
      JSON.stringify(drawn) + ')', drawn.indexOf(firstName) >= 0);
    ok('C27b and ONLY the one you asked — every other body on screen is still ' +
      'a stranger with no name over them', drawn.length === 1);

    const goldAfter = await goldOnScreen();
    /* THE THRESHOLD IS SMALL ON PURPOSE. A four-letter first name at 10px is
       only about twenty lit pixels, so this can never be a big number - the
       strength of the claim is that it is a DELTA in a view where nothing else
       moved, not that it is large. C27a and C27b are the exact checks; this one
       exists to prove the ink reached the canvas at all. */
    ok('C27c the letters are REALLY PAINTED on the run canvas — gold went ' +
      goldBefore + ' -> ' + goldAfter + ' with nothing else changed',
      goldBefore >= 0 && goldAfter - goldBefore >= 10);
    await page.screenshot({ path: path.join(PROOF_DIR, 'BOHEMIA_PEOPLE_NAME_ON_THE_WORLD_8_2_26.png') });

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
  for (let y = 0; y < world.n; y += 3) for (let x = 0; x < world.n; x += 3) {
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
  for (let y = 0; y < world.n && !at; y++) for (let x = 0; x < world.n; x++) {
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
    /* D11a/D11b: THE MASS-EDIT LAW, CHECKED WHERE IT BROKE. Paolo 7/29: editing
       the people means adding a rule, and the rule reaches everybody. A body with
       no person record is a body no rule can touch, and for one commit on 8/2
       the workers were concatenated TWICE - once before the person-facts pass and
       once after - so the block carried more bodies than records and every worker
       was standing next to a copy of himself. The old check only ever looked at
       the cell the game opens on, which is residential and has no commuters, so
       it could not see any of it. This looks on the CLINIC. */
    const bal = await page.evaluate(() => ({
      bodies: window.__RUN_PEOPLE.count(),
      recs: (window.__RUN_PEOPLE.facts() || []).length,
      ids: new Set(window.__RUN.people().people.map(p => p.key)).size,
    }));
    ok('D11a ONE PERSON RECORD PER BODY AT THE WORKPLACE (' + bal.recs + '/' +
      bal.bodies + ') — nobody at work is outside a mass edit',
      bal.recs === bal.bodies);
    ok('D11b and nobody is standing next to a copy of himself (' + bal.ids +
      ' identities, ' + bal.bodies + ' bodies)', bal.ids === bal.bodies);
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
    for (let y = 0; y < world.n; y += 3) for (let x = 0; x < world.n; x += 3) {
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
  for (let y = 0; y < world.n; y += 3) for (let x = 0; x < world.n; x += 3)
    if (A.agentsForPlot(world, x, y).length) alive1.add(x + ',' + y);
  POP.setDial(0.5);
  let outside = 0;
  for (let y = 0; y < world.n; y += 3) for (let x = 0; x < world.n; x += 3)
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
    /* another lane's code fences itself with a ==== banner, and calls its own
       module. Either one inside our region means the region is not ours to
       delete. IT MUST BE A USE, NOT A MENTION (8/1 law): this used to flag the
       bare words "RUN PERSON FACTS", so writing a COMMENT that said where their
       block starts turned the gate red while nothing was wrong. A checker that
       cannot tell a mention from a use is the broken one, so it looks for the
       banner syntax and the actual call. */
    if (/\/\* ==== /.test(m[0]) || /BohemiaPopulation\.conditionAgents/.test(m[0]))
      spanning.push(n + ' (' + m[0].split('\n').length + ' lines)');
  }
  ok('F4 NO FENCE SPANS ANOTHER LANE\'S BLOCK' +
    (spanning.length ? ': ' + spanning.join(', ') : ''), spanning.length === 0);

  /* F5: the shape that was wrong, TWICE, in opposite directions.
     First the WORKERS fence swallowed their block. The fix was a second fence,
     PEOPLE:JOIN, below theirs - and that put the worker concat AFTER the
     person-facts pass, which is what made workers immune to mass edits. Moving
     the concat back up killed JOIN, and the corpse of that fence stayed applied
     in the file, so for one commit the concat ran twice.
     So the invariant is now stated as what it actually is: this lane touches
     buildSim in EXACTLY ONE place, that place closes before their banner, and
     the dead fence is not lurking in the file. */
  const wi = slice.indexOf('/* /PEOPLE:WORKERS */');
  const fi = slice.indexOf('/* ==== RUN PERSON FACTS');
  const joins = (slice.match(/BohemiaAgents\.workersForPlot\(WORLD, CELL\[0\], CELL\[1\]/g) || []).length;
  ok('F5 the workers join the block EXACTLY ONCE (' + joins +
    '), before the person-facts pass, and the dead JOIN fence is gone',
    wi > 0 && fi > wi && joins === 1 && slice.indexOf('/* PEOPLE:JOIN */') < 0 &&
    slice.indexOf('BohemiaAgents.workersForPlot(WORLD, CELL[0], CELL[1]') < fi);
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
    /* RE-PINNED 8/6: was 21.23 km2, the area of a 48x48 valley that has not existed
       for some time. The map is 96x96 = 84.93 km2 (MAP SIZE gate agrees). */
    Math.abs(m.km2 - 84.93) < 0.2);
  ok('G2 the map really contains the homes the model counts (' + m.dwellings + ')',
    /* RE-PINNED 8/6: was 10,000-15,000, the home count of the 48x48 quarter.
       The whole valley draws ~55,391. */
    m.dwellings > 45000 && m.dwellings < 70000);

  /* G3 IS THE ONE THAT MATTERS. Two independent scales - area and housing - have
     to agree, or the map is not a model of anything and the whole derivation is
     numerology. */
  const gap = Math.abs(d.byArea - d.byHomes) / d.byHomes;
  ok('G3 area scale (1:' + d.byArea.toFixed(1) + ') and housing scale (1:' +
    d.byHomes.toFixed(1) + ') agree within 25% (' + Math.round(gap * 100) + '%)', gap < 0.25);

  ok('G4 step 1: full 2050 Vegas at this scale is tens of thousands, not millions (' +
    Math.round(d.noApocalypse).toLocaleString('en-US') + ')',
    /* RE-PINNED 8/6: the scale is 1:17.3 now, not 1:78.2, so 2.9M lands on
       ~167,553 rather than ~37,082. "Tens of thousands, not millions" is still
       the claim and is still true -- hundreds of thousands, not millions. */
    d.noApocalypse > 100000 && d.noApocalypse < 300000);
  /* RE-PINNED 8/6: "about a thousand" was an artefact of measuring a quarter of the
     valley. An exact census of every residential cell returns 4,723 people; the
     corrected arithmetic derives ~5,027. THE OCCUPANCY RATE DID NOT CHANGE -- only
     the count of the world it is applied to. */
  ok('G5 step 2: after the 3% survival the valley holds a few thousand people (' +
    Math.round(d.afterCrash) + ')', d.afterCrash > 3000 && d.afterCrash < 8000);

  /* G6: the SIM has to actually hold that many. This is the claim that goes red
     if somebody edits the occupancy rate back to a round guess. */
  const W2 = require(path.join(ROOT, 'engine/bohemia_world.js'));
  global.window = global;
  const world = (global.BohemiaWorld || W2).world(7);
  let live = 0;
  /* *** THE COMMON-MODE BUG, FOUND 8/6/26, AND IT IS THE WHOLE REASON THE 4.25x
     POPULATION ERROR SURVIVED. *** G6 is the ONE claim in this block that is
     supposed to be INDEPENDENT: it counts the live sim and compares it to the
     arithmetic. It counted the sim with `y < 48` HARDCODED -- the exact same
     literal that tools/bohemia_scale_model.js had.
     So the sim side measured a quarter of the world, the model side measured a
     quarter of the world, and the two agreed PERFECTLY while both were wrong by
     4.25x. A cross-check whose two sides share an error is not a cross-check; it
     is one measurement written twice, and it will agree with itself forever.
     `world.n` now, on both sides, so the check is finally what it says it is. */
  const N = world.n;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
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

/* ==========================================================================
   PART I — REPAIR A DISTRICT AND PEOPLE MOVE IN (Paolo 8/1, direction:
   laws/BOHEMIA_ADDENDUM_REPAIR_A_DISTRICT_8_1_26.md). "when you fully repair a
   district ... more people will want to move in and live in the recovered
   ruins." The socket for that, and nothing else: WHAT counts as repaired and
   what it is worth is his table and it ships empty.
   ========================================================================== */
function partI() {
  console.log('I. A REPAIRED DISTRICT CAN FILL UP, AND ITS NEIGHBOUR DOES NOT');
  const POP = require(path.join(ROOT, 'engine/bohemia_population.js'));
  const W2 = require(path.join(ROOT, 'engine/bohemia_world.js'));
  global.window = global; global.BohemiaPopulation = POP;
  const world = (global.BohemiaWorld || W2).world(7);
  POP.clearCellDials(); POP.setDial(1);

  ok('I1 REPAIR_WORTH ships EMPTY — what a repair is worth is his design',
    Object.keys(POP.REPAIR_WORTH).length === 0 && POP.repairWorth('solar') === null);
  ok('I2 an untouched district carries no dial of its own', POP.cellDial(20, 20) === 1);

  /* find a lived-in cell and repair it */
  /* THE NEIGHBOUR MUST ALSO HAVE PEOPLE IN IT. First version of this claim
     compared against an EMPTY neighbour, so a repair that leaked everywhere still
     multiplied zero by eight and got zero - the mutation walked straight past it.
     A control that cannot move is not a control. */
  let at = null, nb = null;
  outer2:
  for (let y = 0; y < world.n; y++) for (let x = 0; x < world.n; x++) {
    const c = world.at(x, y), c2 = world.at(x + 1, y);
    if (!c || !c2 || !A.RESIDENTIAL[c.district] || !A.RESIDENTIAL[c2.district]) continue;
    if (A.agentsForPlot(world, x, y).length > 2 && A.agentsForPlot(world, x + 1, y).length > 2) {
      at = [x, y]; nb = [x + 1, y]; break outer2;
    }
  }
  ok('I3 there is a district to repair, next to one that also has people', !!at && !!nb);
  if (!at) return;
  const before = A.agentsForPlot(world, at[0], at[1]).length;
  const nbBefore = A.agentsForPlot(world, nb[0], nb[1]).length;
  POP.setCellDial(at[0], at[1], 8);
  const after = A.agentsForPlot(world, at[0], at[1]).length;
  const nbAfter = A.agentsForPlot(world, nb[0], nb[1]).length;

  ok('I4 REPAIRING A DISTRICT BRINGS PEOPLE IN (' + before + ' -> ' + after + ')', after > before);
  /* the whole point: it is THIS district, not the valley. A change that leaked
     into the neighbour would make repair a global cheat rather than a place. */
  ok('I5 and the district next door, which ALSO has people, is untouched (' +
    nbBefore + ' -> ' + nbAfter + ')', nbAfter === nbBefore && nbBefore > 2);

  /* the global dial still outranks it, or "zero to a maximum" stops being true */
  POP.setDial(0);
  ok('I6 a ghost valley stays a ghost valley however much you repaired',
    A.agentsForPlot(world, at[0], at[1]).length === 0);
  POP.setDial(1); POP.clearCellDials();
  ok('I7 clearing the repairs puts it back exactly where it was',
    A.agentsForPlot(world, at[0], at[1]).length === before);

  const law = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_REPAIR_A_DISTRICT_8_1_26.md');
  ok('I8 his words are written down where the next session reads them',
    fs.existsSync(law) && /more people will want to move in/.test(fs.readFileSync(law, 'utf8')));
  ok('I9 the law names the holes rather than smoothing them over',
    /WATER IS MISSING FROM HIS LIST/.test(fs.readFileSync(law, 'utf8')));
}

/* ==========================================================================
   PART J — A WORKER AT A JOB SITE IS INSIDE THE MASS EDIT.
   Paolo 7/29, LOCKED: editing the people means ADDING A RULE, and the rule has
   to REACH them. This lane introduced commuting workers on 8/1 and they were the
   one set of bodies on the surface immune to that law: added to the sim AFTER
   the person-facts pass, so they had no person record and no rule could touch
   them. They also took their character from the cell they were STANDING on, so
   the same person had one personality at the clinic and another in their own
   yard.
   ========================================================================== */
function partJ() {
  console.log('J. A WORKER AT A JOB SITE IS STILL ONE OF THE PEOPLE');
  const POP = require(path.join(ROOT, 'engine/bohemia_population.js'));
  const W2 = require(path.join(ROOT, 'engine/bohemia_world.js'));
  global.window = global; global.BohemiaPopulation = POP;
  const world = (global.BohemiaWorld || W2).world(7);
  POP.clearCellDials(); POP.setDial(1);

  let at = null, wk = [];
  for (let y = 0; y < world.n && !at; y++) for (let x = 0; x < world.n; x++) {
    const k = A.workersForPlot(world, x, y);
    if (k.length) { at = [x, y]; wk = k; break; }
  }
  ok('J1 somebody in the valley commutes to work', !!at && wk.length > 0);
  if (!at) return;

  /* J2: WHAT travels with a commuter. This used to assert `homeIndex != null` -
     their position in their home block's roster - and that field WAS the bug it
     was guarding against, one layer down: a roster position moves the moment a
     neighbour moves in. What actually travels is the cell they live on and the
     SEAT they hold in a house there, which rides along in their own agent id. */
  ok('J2 a visitor carries where they live AND their SEAT (house + place in the ' +
     'household), never a roster position',
    wk.every(v => Array.isArray(v.fromCell) && POP.seatNumberOf(v) != null) &&
    wk.every(v => v.homeIndex === undefined));

  /* J3: EVERY body on the cell gets a person record, visitors included. A body
     with no record is a body no rule can reach. */
  const residents = A.agentsForPlot(world, at[0], at[1]);
  const all = residents.concat(wk);
  const recs = POP.peopleForAgents(all, at[0], at[1], 7, 'spread');
  ok('J3 ONE PERSON RECORD PER BODY, workers included (' + recs.length + '/' + all.length + ')',
    recs.length === all.length);

  /* J4: and the record is the one they have at HOME, not one invented here.
     Found BY SEAT, not by roster position - the whole point of the 8/2 fix is
     that a position is not a way to find a person, so a gate that finds them by
     position is testing the wrong thing even when it passes. */
  const v = wk[0];
  const homeRoster = A.agentsForPlot(world, v.fromCell[0], v.fromCell[1]);
  const homeRecs = POP.peopleForAgents(homeRoster, v.fromCell[0], v.fromCell[1], 7, 'spread');
  const seatAtHome = homeRoster.findIndex(h => h.id === v.id);
  const mine = recs[residents.length];
  ok('J4a the commuter really is one of the people who live on their home block',
    seatAtHome >= 0);
  ok('J4 THE SAME PERSON AT WORK AND AT HOME — same character, not two people',
    seatAtHome >= 0 && JSON.stringify(mine) === JSON.stringify(homeRecs[seatAtHome]));

  /* J5: the whole point of the law. A rule added in bulk must land on them. */
  const before = JSON.stringify(POP.peopleForAgents(all, at[0], at[1], 7, 'spread')[residents.length]);
  const vBefore = POP.rulesVersion();
  POP.addRule({ name: 'gate-probe', where: function () { return true; },
                set: { heatTol: 0.123456 } });
  const after = POP.peopleForAgents(all, at[0], at[1], 7, 'spread')[residents.length];
  ok('J5 A BULK EDIT REACHES THE WORKER AT THE JOB SITE', after.heatTol === 0.123456);
  ok('J6 and the rules version moved, so cached surfaces know to re-derive',
    POP.rulesVersion() !== vBefore);
  POP.clearRules();
  ok('J7 removing the rule puts them back exactly',
    JSON.stringify(POP.peopleForAgents(all, at[0], at[1], 7, 'spread')[residents.length]) === before);
}

/* ==========================================================================
   PART K — YOUR NEIGHBOUR IS STILL YOUR NEIGHBOUR AFTER YOU REPAIR THE STREET.

   Two of Paolo's locked rulings meet here and the code was breaking both.
     7/31, YOU HAVE TO ASK: "once you ask their name, if you see them again,
       then they would be named."
     8/1, REPAIR A DISTRICT: "when you fully repair a district ... more people
       will want to move in and live in the recovered ruins."
   Put them together and the game promises: repair your street, more neighbours
   arrive, and the ones you already know are still the people you knew.

   IT DID THE OPPOSITE. bohemia_agents builds a roster by walking the houses and
   SKIPPING the abandoned ones, so a person's position in that array is a fact
   about how many neighbours are home, not a fact about them. Character was
   derived from that position. Measured on cell (3,5): 2 residents before the
   repair, 4 after, and BOTH originals came back as different human beings -
   H12-1 and H12-2 swapped personalities with each other. Their NAMES stayed put,
   because bohemia_people.js keys those to the seat, so the effect on the surface
   is the worst possible one: the name you earned still shows, attached to a
   stranger.
   ========================================================================== */
function partK() {
  console.log('K. YOUR NEIGHBOUR IS STILL YOUR NEIGHBOUR AFTER YOU REPAIR THE STREET');
  const POP = require(path.join(ROOT, 'engine/bohemia_population.js'));
  const W2 = require(path.join(ROOT, 'engine/bohemia_world.js'));
  global.window = global; global.BohemiaPopulation = POP;
  const world = (global.BohemiaWorld || W2).world(7);
  POP.clearCellDials(); POP.setDial(1);

  /* K1: the seat is a real, parseable thing on every body the generator makes.
     A fallback to array position would silently reintroduce the whole bug, so
     it is counted rather than trusted. */
  let seatless = 0, bodies = 0, sample = 0;
  for (let y = 0; y < world.n; y += 2) for (let x = 0; x < world.n; x += 2) {
    const ag = A.agentsForPlot(world, x, y);
    if (!ag.length) continue;
    sample++; bodies += ag.length; seatless += POP.seatlessIn(ag);
  }
  ok('K1 EVERY body has a seat to be keyed by, across ' + sample + ' blocks and ' +
    bodies + ' people (' + seatless + ' fell back to a list position)',
    bodies > 100 && seatless === 0);

  /* K2: the seat encoding cannot collide. household() returns 1..4 today; if it
     ever returns more than SLOTS_PER_HOUSE, two different people in different
     houses would share one key and quietly become the same person. */
  let maxSlot = 0;
  for (let y = 0; y < world.n; y += 2) for (let x = 0; x < world.n; x += 2)
    for (const a of A.agentsForPlot(world, x, y)) {
      const m = /^H(\d+)-(\d+)$/.exec(String(a.id || ''));
      if (m) maxSlot = Math.max(maxSlot, parseInt(m[2], 10));
    }
  ok('K2 the biggest household in the valley (' + maxSlot + ') fits the seat ' +
    'encoding (' + POP.SLOTS_PER_HOUSE + ' per house), so no two people share a key',
    maxSlot > 0 && maxSlot <= POP.SLOTS_PER_HOUSE);

  /* K3-K5: THE REPAIR ITSELF, on a real cell that really fills up. */
  let cell = null, n0 = 0, n1 = 0;
  outer:
  for (let y = 0; y < world.n; y++) for (let x = 0; x < world.n; x++) {
    POP.clearCellDials();
    const a = A.agentsForPlot(world, x, y).length;
    if (a < 2) continue;
    POP.setCellDial(x, y, 4);
    const b = A.agentsForPlot(world, x, y).length;
    if (b > a) { cell = [x, y]; n0 = a; n1 = b; break outer; }
  }
  POP.clearCellDials();
  ok('K3 a district in this valley really does fill up when it is repaired ' +
    (cell ? '(' + cell + ': ' + n0 + ' -> ' + n1 + ')' : ''), !!cell && n1 > n0);
  if (!cell) return;

  const snap = () => {
    const ag = A.agentsForPlot(world, cell[0], cell[1]);
    const pe = POP.peopleForAgents(ag, cell[0], cell[1], 7, 'spread');
    const m = {};
    ag.forEach((a, i) => { m[a.id] = JSON.stringify(pe[i]); });
    return m;
  };
  const before = snap();
  POP.setCellDial(cell[0], cell[1], 4);
  const after = snap();

  let kept = 0, lost = 0;
  for (const id of Object.keys(before)) {
    if (!after[id]) continue;
    if (after[id] === before[id]) kept++; else lost++;
  }
  ok('K4 THE PEOPLE YOU ALREADY KNEW ARE STILL THEMSELVES AFTER THE REPAIR (' +
    kept + ' unchanged, ' + lost + ' turned into somebody else)',
    kept > 0 && lost === 0);

  /* K5: and the newcomers are ADDITIONAL people, not a renumbering. */
  const newcomers = Object.keys(after).filter(id => !before[id]).length;
  ok('K5 the extra residents are NEW people moving in (' + newcomers + ' of them), ' +
    'not the old ones renumbered', newcomers === (n1 - n0) && newcomers > 0);

  /* K6: it has to hold going DOWN as well. A district can lose people (the dial
     runs to zero by his own ruling, and a repair can be undone), and the ones
     who stay have to be the ones who stayed. Walking back from the REPAIRED
     roster guarantees the two states actually overlap - the first version of
     this claim dialled the cell to 0.5, emptied it completely, and then compared
     an empty set to a full one and called the zero result a pass. A claim that
     can be satisfied by having nothing to check is not a claim. */
  POP.setCellDial(cell[0], cell[1], 4);
  const full = snap();
  POP.clearCellDials();
  const thin = snap();
  let survived = 0, mangled = 0;
  for (const id of Object.keys(thin)) {
    if (!full[id]) continue;
    if (thin[id] === full[id]) survived++; else mangled++;
  }
  ok('K6 and when people LEAVE, the ones who stay are the ones who stayed (' +
    survived + ' unchanged, ' + mangled + ' scrambled)',
    Object.keys(thin).length > 0 && survived === Object.keys(thin).length && mangled === 0);
  POP.clearCellDials(); POP.setDial(1);
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
  partI();
  partJ();
  partK();
  console.log((fail ? 'FAILED' : 'OK') + ': ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL: gate threw — ' + (e && e.stack || e)); process.exit(1); });
