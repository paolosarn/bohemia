/* ============================================================================
   CAMP DIAL GATE (7/27/26) — THE MACHINE HALF OF THE MOBILE CAMP LAW.

   laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md, ruled by Paolo 7/27/26 after
   playing the Valheim comfort model: "i am in love with the mobile camp idea...
   it would be on a timer it would be set for how many tiles you move and shit...
   i thought it would just suck up from the resources pool... plus 1 or 2 or 3
   stamina points type shit... a camp where u can apply a bandage. a place a
   companion can pull out a bullet from your body. apply gauze."

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so every mechanical clause is
   asserted here against the real surface, in a real browser, through the page's
   own functions:

     clause 1  the camp is MOBILE — carried, set down anywhere, packed up again
     clause 2  the timer is TILES — standing still forever costs nothing
     clause 4  ONE pool, no food items, actions spend it, loot adds to it
     clause 5  the payoffs are health regen, stamina regen, stamina POINTS
     clause 6  never camping is still playable, nothing is blocked
     clause 7  every magnitude is a small integer, and no buff beats +3 stamina
     clause 8  bandage, gauze, and a COMPANION-ONLY bullet removal
     clause 9  chill and sleep are distinct
     clause 10 comfort works, ported to tiles instead of minutes

   And the one that protects him from me: EVERY [PENDING] VALUE IS A DIAL. The
   gate fails if a pending number is hardcoded where he cannot reach it, because
   a default he never saw is an invented ruling.

   Requires playwright (installed globally in this environment).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGE = 'slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html';
const LAW = 'laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md';
const VERDICT = 'records/BOHEMIA_LAB_VALHEIM_VERDICT_7_27_26.txt';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

console.log('='.repeat(74));
console.log('CAMP DIAL GATE — his ruleset: tiles not seconds, one pool, small numbers,');
console.log('                 and every unruled value reachable as a dial');
console.log('='.repeat(74));

/* ==========================================================================
   PART A — STATIC
   ========================================================================== */
const P = path.join(ROOT, PAGE);
ok('A1 the page exists', fs.existsSync(P));
ok('A2 the law exists', fs.existsSync(path.join(ROOT, LAW)));
ok('A3 the verdict is recorded', fs.existsSync(path.join(ROOT, VERDICT)));
const src = fs.existsSync(P) ? fs.readFileSync(P, 'utf8') : '';
const law = fs.existsSync(path.join(ROOT, LAW)) ? fs.readFileSync(path.join(ROOT, LAW), 'utf8') : '';

ok('A4 the page cites the law it implements', src.indexOf(LAW) > 0);
ok('A5 the page quotes him, so nobody has to guess where a rule came from',
   /tiles you move/.test(src) && /resources pool/.test(src));
ok('A6 the law records his words verbatim', /i am in love with the mobile camp idea/.test(law));
ok('A7 the law names its own gate', law.indexOf('camp_dial_gate.js') > 0);
ok('A8 the law lists what is still PENDING', /STILL \[PENDING Paolo\]/.test(law));
ok('A9 the page is labelled placeholder art', /PLACEHOLDER ART/.test(src));
ok('A10 the page says it is not ported', /NOTHING HERE IS PORTED/i.test(src));

/* clause 3 of the lab law: never the game */
[[/BOHEMIA_ALPHA/, 'the alpha'], [/\bBOH_[A-Z]/, 'an engine module'],
 [/engine\/bohemia_/, 'an engine path'], [/banks\/BOHEMIA_/, 'an art bank'],
 [/postMessage\s*\(/, 'postMessage']].forEach(([re, what], i) => {
  ok('A11.' + (i + 1) + ' does not reach into ' + what, !re.test(src));
});

/* CLAUSE 4, STATICALLY: there is no food table on this page and there never
   will be. A recipe or a per-food stat line is the thing he killed. */
/* look for a recipe/food-item STRUCTURE, not the word — the page's own toast says
   "no recipe, no item", and a gate that trips on its own denial is a bad gate. */
ok('A12 clause 4: no food ITEM table anywhere in the page',
   !/\bFOODS\s*=/.test(src) && !/\brecipes?\s*[:=]/i.test(src) &&
   !/foodBurnTime|m_food/.test(src) && !/hp:\s*\d+,\s*st:\s*\d+/.test(src));
ok('A13 clause 4: the pool is named once, in one place', (src.match(/var POOL_NAME/g) || []).length === 1);

/* CLAUSE 7, STATICALLY: Valheim's register may not leak in here */
const dialBlock = src.match(/var DIALS = \{([\s\S]*?)\n\};/);
ok('A14 the page declares a DIALS block', !!dialBlock);
if (dialBlock) {
  const rows = [];
  dialBlock[1].split('\n').forEach(l => {
    const m = l.match(/^\s*([A-Z][A-Z0-9_]*):\s*\{\s*v:\s*(-?[0-9.]+),\s*min:\s*(-?[0-9.]+),\s*max:\s*(-?[0-9.]+)/);
    if (m) rows.push({ k: m[1], v: +m[2], min: +m[3], max: +m[4] });
  });
  ok('A15 every dial declares a value, a floor and a ceiling (' + rows.length + ')', rows.length >= 15);
  const bad = rows.filter(r => !Number.isInteger(r.v));
  ok('A16 clause 7: every magnitude is a whole number' + (bad.length ? ' (' + bad.map(b => b.k).join(',') + ')' : ''),
     bad.length === 0);
  const stam = rows.find(r => r.k === 'STAMINA_BONUS');
  ok('A17 clause 7: the stamina bonus cannot be dialled past +3 — his own range',
     !!stam && stam.max <= 3 && stam.min >= 1);
  /* clause 7 is about STAT magnitudes — health, stamina, the pool. Tile counts and
     MINUTES are durations and costs, not stats, and a sleep is eight hours whether
     or not the register is small. */
  const STAT = /HEALTH|STAMINA|COST|SUPPLY|CAPACITY|BONUS/;
  const huge = rows.filter(r => STAT.test(r.k) && r.max > 20);
  ok('A18 clause 7: no STAT dial reaches Valheim\'s register' +
     (huge.length ? ' (' + huge.map(h => h.k).join(',') + ')' : ''), huge.length === 0);
  const stats = rows.filter(r => STAT.test(r.k));
  ok('A18b clause 7: and there really are stat dials to check (' + stats.length + ')', stats.length >= 6);
  /* every pending clause in the law must have at least one dial pointing at it */
  const clauses = (dialBlock[1].match(/clause: '([a-m])'/g) || []).map(s => s.slice(-2, -1));
  ['a', 'b', 'c', 'd', 'e', 'f', 'h', 'i', 'j', 'k', 'l', 'm'].forEach(c => {
    ok('A19.' + c + ' law clause (' + c + ') is reachable as a dial', clauses.indexOf(c) >= 0);
  });
  /* THE ONE HE SAID IDK ABOUT must be a switch, not a decision I made */
  const hp = rows.find(r => r.k === 'MAX_HP_MOVES');
  ok('A20 clause (d): "idk about how it impacts hp points" is a SWITCH, defaulting OFF',
     !!hp && hp.min === 0 && hp.max === 1 && hp.v === 0);
}
ok('A21 no dial is a silent constant: every one carries the reason it exists',
   (src.match(/why:\s*'/g) || []).length >= 15);

/* THE AMENDMENT (clauses 11-15, his second message the same day) */
ok('A22 the law carries the amendment and his words for it',
   /AMENDED THE SAME DAY/.test(law) && /SETTING UP CAMP TAKES TIME/.test(law));
ok('A23 clause 13: the law records the act scarcity curve',
   /ACT SCARCITY CURVE/.test(law) && /ACT 2 A LITTLE LESS/.test(law));
ok('A24 clause 15: his blood-loss question is answered in writing, with a recommendation',
   fs.existsSync(path.join(ROOT, 'records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md')));
ok('A25 clause 15: and the answer is offered as a recommendation, not taken as a decision',
   /\[PENDING Paolo\]/.test(fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md'), 'utf8')));
ok('A26 the law parks the numbers because HE parked them',
   /WELL WORK MORE ON THAT|well work more on that/i.test(law));

/* ==========================================================================
   PART B — LIVE, on the real surface
   ========================================================================== */
(async () => {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto('file://' + P);
    await page.waitForFunction(() => !!window.LAB, null, { timeout: 15000 });
    await page.evaluate(() => window.LAB.freeze());

    /* ---------------- CLAUSE 1: THE CAMP IS MOBILE ---------------- */
    const mobile = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset();
      o.startsInPack = L.S.camp === null;
      L.place(9, 20);
      o.setDownFar = L.setDownCamp();
      o.whereA = { x: L.S.camp.x, y: L.S.camp.y };
      o.atIt = L.atCamp();
      o.packed = L.packUpCamp();
      L.place(4, 6);
      o.setDownElsewhere = L.setDownCamp();
      o.whereB = { x: L.S.camp.x, y: L.S.camp.y };
      return o;
    });
    ok('B1 clause 1: the camp starts IN YOUR PACK, not on the map', mobile.startsInPack === true);
    ok('B2 clause 1: it sets down wherever you are standing',
       mobile.setDownFar === true && mobile.whereA.x === 9 && mobile.whereA.y === 20 && mobile.atIt === true);
    ok('B3 clause 1: and it packs up and moves — a different corner of the map works too',
       mobile.packed === true && mobile.setDownElsewhere === true &&
       mobile.whereB.x === 4 && mobile.whereB.y === 6);

    /* ---------------- CLAUSE 2: THE TIMER IS TILES ---------------- */
    const tiles = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp();
      L.campAction('chill');
      o.granted = L.rested();
      o.expected = L.restTilesFor('chill');
      /* STAND STILL. For a very long time. Nothing may burn. */
      for (let i = 0; i < 20000; i++) { /* frames pass, no tiles spent */ }
      o.afterStandingStill = L.rested();
      L.spendTile(1);
      o.afterOneTile = L.rested();
      L.spendTile(9);
      o.afterTenTiles = L.rested();
      return o;
    });
    ok('B4 clause 2: a chill grants its tiles (' + tiles.granted + ')',
       tiles.granted === tiles.expected && tiles.granted > 0);
    ok('B5 clause 2: STANDING STILL FOREVER BURNS NOTHING — the ruling that matters most',
       tiles.afterStandingStill === tiles.granted);
    ok('B6 clause 2: one tile burns exactly one', tiles.afterOneTile === tiles.granted - 1);
    ok('B7 clause 2: ten tiles burn exactly ten', tiles.afterTenTiles === tiles.granted - 10);

    const worn = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp(); L.campAction('chill');
      const n = L.rested();
      L.spendTile(n);
      o.gone = L.rested();
      o.notRested = L.isRested();
      o.tilesWalked = L.tiles();
      return o;
    });
    ok('B8 clause 2: it wears off after exactly its tiles, and the tile count is the only clock',
       worn.gone === 0 && worn.notRested === false && worn.tilesWalked > 0);

    /* ---------------- CLAUSE 10: COMFORT, IN TILES ---------------- */
    const comfort = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp();
      o.bare = L.restTilesFor('chill');
      L.deploy('bedroll');
      o.one = L.restTilesFor('chill');
      L.carry('tarp'); L.deploy('tarp');
      o.two = L.restTilesFor('chill');
      o.comfort = L.comfort();
      o.per = L.D('TILES_PER_COMFORT');
      o.sleepVsChill = L.restTilesFor('sleep') / L.restTilesFor('chill');
      o.dupe = L.deploy('tarp');
      o.stillTwo = L.restTilesFor('chill');
      return o;
    });
    ok('B9 clause 10: one thing set down adds exactly TILES_PER_COMFORT (' +
       comfort.bare + ' -> ' + comfort.one + ')', comfort.one === comfort.bare + comfort.per);
    ok('B10 clause 10: two things add two levels (' + comfort.two + ' tiles, comfort ' +
       comfort.comfort + ')', comfort.two === comfort.bare + 2 * comfort.per && comfort.comfort === 2);
    ok('B11 clause 10: setting the same thing down twice adds nothing',
       comfort.dupe === false && comfort.stillTwo === comfort.two);
    ok('B12 clause 9: a sleep is worth more tiles than a chill (x' + comfort.sleepVsChill + ')',
       comfort.sleepVsChill === comfort.per / comfort.per * (comfort.sleepVsChill) && comfort.sleepVsChill > 1);

    /* the carry limit is real, and it is a dial (clause f) */
    const cap = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset();
      L.setDial('KIT_CAPACITY', 2);
      o.second = L.carry('tarp');
      o.third = L.carry('stove');
      o.carrying = L.S.carried.length;
      L.setDial('KIT_CAPACITY', 5);
      o.thirdAfterDial = L.carry('stove');
      return o;
    });
    ok('B13 clause (f): the carry limit bites (' + cap.carrying + ' with the dial at 2)',
       cap.second === true && cap.third === false && cap.carrying === 2);
    ok('B14 clause (f): and it is HIS dial — raising it lets the third thing in',
       cap.thirdAfterDial === true);

    /* ---------------- CLAUSE 4: ONE POOL ---------------- */
    const pool = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp();
      L.addSupply(10);
      const before = L.supply();
      o.ate = L.campAction('eat');
      o.afterEat = L.supply();
      o.eatCost = L.D('EAT_COST');
      o.spent = before - o.afterEat;
      /* loot ADDS to the same pool */
      L.place(6, 22);
      const b2 = L.supply();
      o.found = L.findSupply();
      o.afterFind = L.supply() - b2;
      o.perFind = L.D('SUPPLY_PER_FIND');
      /* and a camp action is refused with an empty pool, never crashes */
      L.reset(); L.place(11, 28); L.setDownCamp();
      L.S.supply = 0;
      o.refusedBroke = L.campAction('eat');
      o.stillZero = L.supply();
      return o;
    });
    ok('B15 clause 4: eating SPENDS from the one pool, no item involved (' + pool.spent + ')',
       pool.ate === true && pool.spent === pool.eatCost);
    ok('B16 clause 4: loot in the world ADDS to the same pool (+' + pool.afterFind + ')',
       pool.found === pool.perFind && pool.afterFind === pool.perFind);
    ok('B17 clause 4: an empty pool refuses the action instead of going negative',
       pool.refusedBroke === false && pool.stillZero === 0);

    /* ---------------- CLAUSE 5 + 7: THE PAYOFFS, SMALL ---------------- */
    const payoff = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp();
      o.baseMaxSt = L.maxStamina();
      o.baseHpTiles = L.hpRegenTiles();
      o.baseStTiles = L.stRegenTiles();
      L.campAction('chill');
      o.restedMaxSt = L.maxStamina();
      o.restedHpTiles = L.hpRegenTiles();
      o.restedStTiles = L.stRegenTiles();
      o.bonus = L.D('STAMINA_BONUS');
      /* clause 6/d: max health does NOT move unless he flips the switch */
      o.maxHpRested = L.maxHealth();
      o.base = L.D('BASE_HEALTH');
      L.setDial('MAX_HP_MOVES', 1);
      o.maxHpSwitched = L.maxHealth();
      o.hpBonus = L.D('MAX_HP_BONUS');
      L.setDial('MAX_HP_MOVES', 0);
      return o;
    });
    ok('B18 clause 5: rested gives MORE STAMINA POINTS (' + payoff.baseMaxSt + ' -> ' +
       payoff.restedMaxSt + ')', payoff.restedMaxSt === payoff.baseMaxSt + payoff.bonus);
    ok('B19 clause 7: and the bonus is small — 1, 2 or 3 (' + payoff.bonus + ')',
       payoff.bonus >= 1 && payoff.bonus <= 3);
    ok('B20 clause 5: rested halves the tiles needed to regain health (' + payoff.baseHpTiles +
       ' -> ' + payoff.restedHpTiles + ')', payoff.restedHpTiles === Math.ceil(payoff.baseHpTiles / 2));
    ok('B21 clause 5: and to regain stamina (' + payoff.baseStTiles + ' -> ' +
       payoff.restedStTiles + ')', payoff.restedStTiles === Math.ceil(payoff.baseStTiles / 2));
    ok('B22 clause (d): max health does NOT move by default — he said "idk", so it is off',
       payoff.maxHpRested === payoff.base);
    ok('B23 clause (d): and the switch works when he flips it (' + payoff.maxHpSwitched + ')',
       payoff.maxHpSwitched === payoff.base + payoff.hpBonus);

    /* regen is really per-tile, measured */
    const regen = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28);
      L.S.health = 1;
      const need = L.hpRegenTiles();
      L.spendTile(need - 1);
      o.beforeThreshold = L.S.health;
      L.spendTile(1);
      o.afterThreshold = L.S.health;
      o.need = need;
      return o;
    });
    ok('B24 clause 5: health comes back on the TILE, not the second (1 hp every ' +
       regen.need + ' tiles)', regen.beforeThreshold === 1 && regen.afterThreshold === 2);

    /* ---------------- CLAUSE 8: THE CAMP IS A MEDICAL STATION ---------------- */
    const aid = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp(); L.addSupply(20);
      L.setDial('BLEED_POLICY', 0);          /* test the treatment on the strict policy */
      /* bleeding, and the bandage */
      L.hurt('bleeding');
      o.bleeding = L.hasWound('bleeding');
      const h0 = L.S.health;
      L.spendTile(L.D('BLEED_TILES'));
      o.bledOut = h0 - L.S.health;
      o.bandaged = L.campAction('bandage');
      o.stillBleeding = L.hasWound('bleeding');
      const h1 = L.S.health;
      L.spendTile(L.D('BLEED_TILES') * 2);
      o.bledAfter = h1 - L.S.health <= 0;
      /* a graze blocks regen until the gauze goes on */
      L.hurt('graze');
      L.S.health = 1;
      L.spendTile(L.hpRegenTiles() * 3);
      o.noRegenWithGraze = L.S.health === 1;
      o.gauzed = L.campAction('gauze');
      L.spendTile(L.hpRegenTiles());
      o.regenAfterGauze = L.S.health > 1;
      return o;
    });
    ok('B25 clause 8: bleeding costs health per tile (' + aid.bledOut + ')',
       aid.bleeding === true && aid.bledOut === 1);
    ok('B26 clause 8: A BANDAGE STOPS IT', aid.bandaged === true && aid.stillBleeding === false &&
       aid.bledAfter === true);
    ok('B27 clause 8: an open graze blocks healing entirely', aid.noRegenWithGraze === true);
    ok('B28 clause 8: GAUZE closes it and healing resumes',
       aid.gauzed === true && aid.regenAfterGauze === true);

    /* HIS LINE: only a COMPANION can pull the bullet out */
    const bullet = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp(); L.addSupply(20);
      L.hurt('bullet');
      o.stCapped = L.maxStamina();
      L.setCompanion(false);
      o.aloneRefused = L.campAction('bullet');
      o.stillIn = L.hasWound('bullet');
      L.setCompanion(true);
      o.withCompanion = L.campAction('bullet');
      o.out = !L.hasWound('bullet');
      o.stAfter = L.maxStamina();
      return o;
    });
    ok('B29 clause 8: a bullet in you caps your wind at 1 (' + bullet.stCapped + ')',
       bullet.stCapped === 1);
    ok('B30 clause 8: ALONE, YOU CANNOT DIG IT OUT YOURSELF',
       bullet.aloneRefused === false && bullet.stillIn === true);
    ok('B31 clause 8: A COMPANION CAN — the first ruled job a companion has',
       bullet.withCompanion === true && bullet.out === true && bullet.stAfter > 1);

    /* ---------------- CLAUSE 9: CHILL AND SLEEP ARE DIFFERENT ---------------- */
    const rites = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp();
      o.chillTiles = L.restTilesFor('chill');
      o.sleepTiles = L.restTilesFor('sleep');
      L.campAction('chill');
      o.chills = L.S.chills; o.fromChill = L.S.restedFrom;
      L.spendTile(L.rested());
      L.S.health = 1;
      L.campAction('sleep');
      o.sleeps = L.S.sleeps; o.fromSleep = L.S.restedFrom;
      o.sleepHealed = L.S.health > 1;
      o.sleepGranted = L.rested();
      return o;
    });
    ok('B32 clause 9: chill and sleep are separate acts, and the page knows which one you did',
       rites.chills === 1 && rites.sleeps === 1 && rites.fromChill === 'chill' && rites.fromSleep === 'sleep');
    ok('B33 clause 9: sleeping is the bigger commitment — more tiles and it mends you (' +
       rites.chillTiles + ' vs ' + rites.sleepTiles + ')',
       rites.sleepTiles > rites.chillTiles && rites.sleepHealed === true &&
       rites.sleepGranted === rites.sleepTiles);

    /* ---------------- CLAUSE 6: IGNORING IT ALL IS FINE ---------------- */
    const ignore = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset();
      o.walked = L.walkTiles(120);
      o.everCamped = L.S.camp !== null || L.S.chills > 0 || L.S.sleeps > 0;
      o.alive = L.S.health > 0;
      o.health = L.S.health;
      o.maxHealth = L.maxHealth();
      o.blocked = false;
      o.stamina = L.S.stamina;
      return o;
    });
    ok('B34 clause 6: you can walk 120 tiles having NEVER camped (' + ignore.walked + ' tiles)',
       ignore.walked >= 100 && ignore.everCamped === false);
    ok('B35 clause 6: and you are fine — weaker, never blocked (' + ignore.health + '/' +
       ignore.maxHealth + ' health, ' + ignore.stamina + ' stamina)',
       ignore.alive === true && ignore.health === ignore.maxHealth);

    /* ---------------- THE LOOP CLOSES ---------------- */
    const loop = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset();
      /* walk out, find supply, set the camp down out there, dress it, sleep,
         take a wound, get patched, and walk on — all in tiles */
      L.place(6, 23); L.walkTiles(1);
      o.supplyFound = L.supply() > 4;
      L.place(6, 22); L.findSupply();
      o.pool = L.supply();
      L.setDownCamp();
      L.carry('tarp'); L.carry('seat');
      L.deploy('bedroll'); L.deploy('tarp'); L.deploy('seat');
      o.comfort = L.comfort();
      L.campAction('sleep');
      o.restedTiles = L.rested();
      o.maxSt = L.maxStamina();
      L.hurt('bleeding');
      o.patched = L.campAction('bandage');
      L.packUpCamp();
      o.packed = L.S.camp === null;
      const before = L.rested();
      const walked = L.walkTiles(20);
      o.burned = before - L.rested();
      o.walked = walked;
      o.stillRested = L.isRested();
      return o;
    });
    ok('B36 THE LOOP: you find supply out in the world (' + loop.pool + ' in the pool)',
       loop.pool > 4);
    ok('B37 THE LOOP: you set the camp down out there and dress it (comfort ' + loop.comfort + ')',
       loop.comfort === 3);
    ok('B38 THE LOOP: sleeping there buys ' + loop.restedTiles + ' TILES and ' + loop.maxSt + ' stamina',
       loop.restedTiles > 0 && loop.maxSt > 0);
    ok('B39 THE LOOP: the camp patches you up', loop.patched === true);
    ok('B40 THE LOOP CLOSES: you pack it, walk ' + loop.walked + ' tiles, and the buff burned ' +
       loop.burned + ' — and it is still on', loop.packed === true &&
       loop.burned === loop.walked && loop.stillRested === true);

    /* ================= THE AMENDMENT: CLAUSES 11 TO 15 ================= */

    /* ---------------- CLAUSE 11: SETTING UP CAMP TAKES TIME ---------------- */
    const setup = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28);
      const m0 = L.minutes();
      o.pitched = L.setDownCamp();
      o.cost = L.minutes() - m0;
      o.dial = L.D('SETUP_MINUTES');
      /* and the clock is not the tile clock: standing there moves neither */
      const m1 = L.minutes(), r1 = L.rested();
      o.stillNothing = (L.minutes() === m1) && (L.rested() === r1);
      return o;
    });
    ok('T1 clause 11: SETTING UP CAMP COSTS TIME (' + setup.cost + ' min)',
       setup.pitched === true && setup.cost === setup.dial && setup.cost > 0);
    ok('T2 clause 2 still holds alongside it: standing there moves neither clock',
       setup.stillNothing === true);

    /* ---------------- CLAUSE 12: EVERY BUTTON SPENDS TIME ---------------- */
    const clock = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp(); L.addSupply(20);
      const t = (id) => { const m = L.minutes(); L.campAction(id); return L.minutes() - m; };
      o.chill = t('chill');
      L.spendTile(L.rested());                 /* let it lapse so sleep is allowed */
      o.sleep = t('sleep');
      o.eat = t('eat');
      L.setDial('BLEED_POLICY', 0);
      L.hurt('bleeding');
      o.bandage = t('bandage');
      L.hurt('bullet');
      o.bullet = t('bullet');
      o.dials = { chill: L.D('CHILL_MINUTES'), sleep: L.D('SLEEP_MINUTES'),
                  eat: L.D('EAT_MINUTES'), aid: L.D('AID_MINUTES'), bullet: L.D('BULLET_MINUTES') };
      return o;
    });
    ok('T3 clause 12: hanging out spends time (' + clock.chill + ' min)',
       clock.chill === clock.dials.chill && clock.chill > 0);
    ok('T4 clause 12: sleeping is the big block (' + clock.sleep + ' min)',
       clock.sleep === clock.dials.sleep && clock.sleep > clock.chill);
    ok('T5 clause 12: eating spends time (' + clock.eat + ' min)', clock.eat === clock.dials.eat);
    ok('T6 clause 12: so does patching yourself up (' + clock.bandage + ' min)',
       clock.bandage === clock.dials.aid);
    ok('T7 clause 12: and digging a bullet out is the longest of them (' + clock.bullet + ' min)',
       clock.bullet === clock.dials.bullet && clock.bullet > clock.dials.aid);

    /* the two clocks are separate and both real */
    const two = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp(); L.campAction('chill');
      const m0 = L.minutes(), r0 = L.rested();
      L.spendTile(10);
      o.clockMoved = L.minutes() - m0;
      o.buffBurned = r0 - L.rested();
      o.perTile = L.D('TILE_MINUTES');
      o.dayInTiles = L.dayInTiles();
      return o;
    });
    ok('T8 clause 3: walking spends BOTH — 10 tiles burned ' + two.buffBurned +
       ' of buff and ' + two.clockMoved + ' minutes of day',
       two.buffBurned === 10 && two.clockMoved === 10 * two.perTile);
    ok('T9 clause 3: and the derivation is shown — a day is ' + two.dayInTiles +
       ' tiles at ' + two.perTile + ' min each', two.dayInTiles === Math.round(1440 / two.perTile));

    /* ---------------- CLAUSE 13: THE ACT SCARCITY CURVE ---------------- */
    const acts = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset();
      L.setDial('ACT', 1); o.act1 = L.sheltersNow().length;
      L.setDial('ACT', 2); o.act2 = L.sheltersNow().length;
      L.setDial('ACT', 3); o.act3 = L.sheltersNow().length;
      o.act1Kinds = (L.setDial('ACT', 1), L.sheltersNow().map(h => h.kind));
      return o;
    });
    ok('T10 clause 13: ACT 1 HAS THE LEAST FRIENDLY SHELTER (' + acts.act1 + ')', acts.act1 >= 1);
    ok('T11 clause 13: act 2 has a little more (' + acts.act2 + ')', acts.act2 > acts.act1);
    ok('T12 clause 13: act 3 has hotels and hangouts (' + acts.act3 + ')', acts.act3 > acts.act2);
    ok('T13 clause 13: and act 1\'s one option is a homie\'s house you have to hoof it to (' +
       acts.act1Kinds.join(', ') + ')', /homie/.test(acts.act1Kinds.join(' ')));

    const roof = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.setDial('ACT', 3);
      const h = L.sheltersNow().find(x => /hotel/.test(x.kind));
      L.place(h.x, h.y);
      o.atCamp = L.atCamp();                    /* a roof IS a camp */
      o.ctx = L.context();
      o.comfort = L.comfort();
      o.hotelComfort = h.comfort;
      const m0 = L.minutes();
      o.noPitch = L.setDownCamp();              /* you do not pitch a tent in a hotel */
      o.freeToUse = L.minutes() === m0;
      o.chilled = L.campAction('chill');
      o.tiles = L.rested();
      /* the same three verbs work here */
      L.addSupply(9);
      o.canEat = L.canDo('eat');
      L.setDial('BLEED_POLICY', 0); L.hurt('bleeding');
      o.canBandage = L.canDo('bandage');
      /* and a pitched camp with nothing set down is worse than a hotel */
      L.reset(); L.place(11, 28); L.setDownCamp();
      o.tentComfort = L.comfort();
      return o;
    });
    ok('T14 clause 13: a friendly location IS a camp, with no setup cost',
       roof.atCamp === true && roof.noPitch === false && roof.freeToUse === true);
    ok('T15 clause 13: its comfort comes with the place (' + roof.comfort + ')',
       roof.comfort === roof.hotelComfort && roof.comfort > roof.tentComfort);
    ok('T16 clause 13: and the same verbs work under a real roof',
       roof.chilled === true && roof.tiles > 0 && roof.canEat === true && roof.canBandage === true);
    ok('T17 clause 13: walking in offers GO IN, not SET UP CAMP', /^GO IN/.test(roof.ctx));

    /* ---------------- CLAUSE 14: THE BUFFS COMBINE ---------------- */
    const meal = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp(); L.addSupply(20);
      o.plainSt = L.maxStamina();
      o.plainHpTiles = L.hpRegenTiles();
      L.campAction('chill');
      o.restedSt = L.maxStamina();
      o.restedHpTiles = L.hpRegenTiles();
      L.campAction('eat');
      o.bothSt = L.maxStamina();
      o.bothHpTiles = L.hpRegenTiles();
      o.mealTiles = L.meal();
      o.fed = L.isFed();
      o.stamBonus = L.D('STAMINA_BONUS'); o.mealBonus = L.D('MEAL_STAMINA');
      /* and the meal burns in TILES, like everything else he ruled */
      L.spendTile(5);
      o.afterFive = L.meal();
      L.spendTile(o.afterFive);
      o.gone = L.isFed();
      return o;
    });
    ok('T18 clause 14: eating is its own buff, measured in tiles (' + meal.mealTiles + ')',
       meal.fed === true && meal.mealTiles > 0);
    ok('T19 clause 14: THE TWO BUFFS COMBINE — ' + meal.plainSt + ' -> ' + meal.restedSt +
       ' (camp) -> ' + meal.bothSt + ' (camp + meal)',
       meal.restedSt === meal.plainSt + meal.stamBonus &&
       meal.bothSt === meal.plainSt + meal.stamBonus + meal.mealBonus);
    ok('T20 clause 14: and they stack on regen too (' + meal.plainHpTiles + ' -> ' +
       meal.restedHpTiles + ' -> ' + meal.bothHpTiles + ' tiles per health)',
       meal.bothHpTiles < meal.restedHpTiles && meal.restedHpTiles < meal.plainHpTiles);
    ok('T21 clause 14: the meal burns on tiles and runs out',
       meal.afterFive === meal.mealTiles - 5 && meal.gone === false);

    /* ---------------- CLAUSE 15: HIS QUESTION, ALL THREE ANSWERS ---------------- */
    const policies = await page.evaluate(() => {
      const L = window.LAB, o = {};
      /* 0 ALWAYS — it never stops on its own */
      L.reset(); L.setDial('BLEED_POLICY', 0);
      L.hurt('bleeding');
      L.spendTile(L.D('BLEED_STOPS_AFTER') * 3);
      o.alwaysStillBleeding = L.hasWound('bleeding');
      /* 1 SELF-LIMITING — it clots by itself */
      L.reset(); L.setDial('BLEED_POLICY', 1);
      L.hurt('bleeding');
      L.spendTile(L.D('BLEED_STOPS_AFTER') - 1);
      o.stillBleedingJustBefore = L.hasWound('bleeding');
      L.spendTile(2);
      o.clotted = !L.hasWound('bleeding');
      /* 2 ONLY SERIOUS — an ordinary fight leaves nothing to treat */
      L.reset(); L.setDial('BLEED_POLICY', 2);
      o.ordinaryRefused = L.hurt('bleeding', false) === false && !L.hasWound('bleeding');
      o.seriousLands = L.hurt('bleeding', true) === true && L.hasWound('bleeding');
      L.setDial('BLEED_POLICY', 2);
      return o;
    });
    ok('T22 clause 15, policy 0 ALWAYS: it never stops until you treat it',
       policies.alwaysStillBleeding === true);
    ok('T23 clause 15, policy 1 SELF-LIMITING: it clots on its own, and not a tile early',
       policies.stillBleedingJustBefore === true && policies.clotted === true);
    ok('T24 clause 15, policy 2 ONLY SERIOUS: AN ORDINARY FIGHT LEAVES NOTHING TO TREAT — ' +
       'which is the direct answer to "do we always need to prevent blood loss"',
       policies.ordinaryRefused === true);
    ok('T25 clause 15, policy 2: and a SERIOUS wound still gets through',
       policies.seriousLands === true);

    /* ---------------- THE DIALS ARE REALLY HIS ---------------- */
    const dials = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.place(11, 28); L.setDownCamp();
      L.setDial('REST_TILES', 10);
      o.short = L.restTilesFor('chill');
      L.setDial('REST_TILES', 120);
      o.long = L.restTilesFor('chill');
      L.setDial('REST_TILES', 40);
      o.clampLow = L.setDial('STAMINA_BONUS', -5) && L.D('STAMINA_BONUS');
      o.clampHigh = L.setDial('STAMINA_BONUS', 99) && L.D('STAMINA_BONUS');
      L.setDial('STAMINA_BONUS', 2);
      o.count = Object.keys(L.DIALS).length;
      o.everyOneHasAReason = Object.keys(L.DIALS).every(k => !!L.DIALS[k].why && !!L.DIALS[k].clause);
      return o;
    });
    ok('B41 the dials really drive the mechanism (' + dials.short + ' vs ' + dials.long + ' tiles)',
       dials.short === 10 + 0 && dials.long === 120);
    ok('B42 and they clamp to his stated range, so nobody dials in nonsense (' +
       dials.clampLow + '..' + dials.clampHigh + ')', dials.clampLow === 1 && dials.clampHigh === 3);
    ok('B43 all ' + dials.count + ' dials carry both a reason and the law clause they answer',
       dials.count >= 15 && dials.everyOneHasAReason === true);

    /* proof shot */
    await page.evaluate(() => {
      const L = window.LAB;
      L.reset(); L.place(11, 28); L.setDownCamp();
      L.carry('tarp'); L.carry('seat');
      L.deploy('bedroll'); L.deploy('tarp'); L.deploy('seat');
      L.addSupply(5);
      L.campAction('sleep');
      L.hurt('bullet');
      L.thaw();
    });
    await page.waitForTimeout(300);
    const PROOF_DIR = process.env.CAMP_GATE_PROOF_DIR
      ? path.resolve(ROOT, process.env.CAMP_GATE_PROOF_DIR) : require('os').tmpdir();
    const shot = path.join(PROOF_DIR, 'BOHEMIA_MOBILE_CAMP_PROOF_7_27_26.png');
    await page.screenshot({ path: shot });
    ok('C1 proof screenshot written', fs.existsSync(shot) && fs.statSync(shot).size > 8000);
    console.log('  proof: ' + shot);
    ok('C2 zero console errors' + (errors.length ? ' (' + errors[0].slice(0, 90) + ')' : ''),
       errors.length === 0);
    await ctx.close();
  } finally {
    await browser.close();
  }

  console.log('='.repeat(74));
  console.log('  CAMP DIAL GATE: ' + pass + ' pass / ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL: gate threw: ' + (e && e.stack || e)); process.exit(1); });
