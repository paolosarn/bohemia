#!/usr/bin/env node
/* ============================================================================
   NO TAPE, NO PLATE
   (9/12/26, COMBAT lane, VAMILY [plates cost] = BB-THE-FIGHT-EATS-TAPE)

   THE ROW'S OWN SHIP TEST, in its own words: "the bell debits one tape AND a purse
   at zero rings with no plate."

   MEASURED BEFORE A LINE WAS WRITTEN, on the real surface, with the pocket emptied:
   the purse already refuses (INSUFFICIENT, have 0, wanted 1, short 1), the city
   already spends when the fight comes home, and THE BELL HANDED OVER A PLATE ANYWAY
   (pp:1). The missing half was the fight ASKING, and a bill you always pay and never
   fail is not a resource you manage.

   THIS DRIVES THE REAL GAME through the shipped door: it empties the purse, bumps a
   real hostile on the walked street, and asks the fight what it is wearing. Then it
   puts a tape in the pocket and does it again, because a rule that is right once can
   be a constant.

   AND IT PROVES THE AMOUNT IS NOT OURS by TUNING THE PURSE: with upkeep charging two
   instead of one, a pocket holding one has to start refusing, with not one line of
   combat edited. That is the difference between reading his ruling and copying it.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      const f = path.join(REPO, u);
      if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

let pass = 0, fail = 0, SRV = null;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close(); if (SRV) try { SRV.close(); } catch (e) {}
  console.log('=== PLATE COSTS TAPE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

/* put the pocket at exactly n, using the purse's own verbs */
const SET_POCKET = `(n)=>{ const p=purseGet();
  const cur=BohemiaPurse.VERBS['fight:plate'].currency;
  let guard=0;
  while(BohemiaPurse.balance(p,cur)>n && guard++<200) BohemiaPurse.debit(p,cur,1,'gate:set',null,1);
  const need=n-BohemiaPurse.balance(p,cur);
  if(need>0) BohemiaPurse.credit(p,cur,need,'gate:set',null,1);
  return BohemiaPurse.balance(p,cur); }`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

  SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(4000);
  await page.evaluate(() => { try { markBeatTaught(); } catch (e) {} });

  const city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
  ok('the walked street is on screen, which is the only place the purse lives', !!city);
  if (!city) return done(browser);

  /* ---- 1. THE DOOR ASKS THE PURSE, AND IT NEVER WRITES THE AMOUNT DOWN ---- */
  const asked = await city.evaluate((setSrc) => {
    const set = eval(setSrc);
    const cur = BohemiaPurse.VERBS['fight:plate'].currency;
    set(0); const at0 = cityPlateNow();
    set(1); const at1 = cityPlateNow();
    set(5); const at5 = cityPlateNow();
    return { cur: cur, at0: at0, at1: at1, at5: at5,
      untouched: BohemiaPurse.balance(purseGet(), cur) };
  }, SET_POCKET);
  console.log('  the door asks: ' + JSON.stringify(asked));
  ok('*** THE DOOR ASKS THE PURSE WHAT A PLATE COSTS, AND THE ANSWER IS THE PURSE\'S. *** The pocket is `'
    + asked.cur + '`, read off the purse\'s OWN verb table rather than copied, which is the currency fight:plate already spends. At zero it answers no ('
    + asked.at0.can + ', ' + asked.at0.why + ', short ' + asked.at0.short + '), at one yes (' + asked.at1.can
    + ') and at five yes (' + asked.at5.can + '). Every answer comes from ' + asked.at0.from
    + ' run on a THROWAWAY purse, so asking costs you nothing: the real pocket still holds '
    + asked.untouched + ' after three questions',
    asked.cur === 'resources' && asked.at0.can === false && asked.at0.why === 'INSUFFICIENT'
    && asked.at1.can === true && asked.at5.can === true
    && asked.at0.from === 'BohemiaPurse.upkeep' && asked.untouched === 5);

  ok('AND THE AMOUNT IS NOWHERE IN IT, which is what keeps his 8/15 ONE in one place: the refusal reports wanted '
    + asked.at0.wanted + ' and the door never asked for that number, it was told. A door that tested "balance >= 1" would be a second copy of a ruling, and a copy drifts the first time he tunes it',
    asked.at0.wanted === 1 && asked.at0.short === 1);

  /* ---- 2. THE SHIP TEST: A PURSE AT ZERO RINGS WITH NO PLATE ------------- */
  const shots = [];
  for (const probe of [{ have: 0, name: 'an empty pocket' }, { have: 2, name: 'two tape in the pocket' }]) {
    await city.evaluate((a) => { const set = eval(a[0]); set(a[1]); }, [SET_POCKET, probe.have]);
    const before = await city.evaluate((setSrc) => {
      const cur = BohemiaPurse.VERBS['fight:plate'].currency;
      return BohemiaPurse.balance(purseGet(), cur); }, SET_POCKET);
    const fired = await city.evaluate(() => {
      const realAdj = window.ctAdjacent;
      window.ctAdjacent = () => ({ id: 'pt_foe_' + Math.random(), home: [3, 3], hostile: true });
      SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
      try { contactClear(); } catch (e) {}
      FZOOMING = false;
      const r = streetFightOnStep();
      window.ctAdjacent = realAdj;
      return r;
    });
    await sleep(6000);
    const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
    const got = cf ? await cf.evaluate(() => ({
      pp: G.pp, PLATE_START: (typeof PLATE_START !== 'undefined') ? PLATE_START : null,
      stamp: G.plate ? { can: G.plate.can, have: G.plate.have, from: G.plate.from } : null,
      cut: G._plateCut || null,
      read: G.lastRead ? { t: G.lastRead.t, s: G.lastRead.s } : null,
      teach: !!G.teachBeat, obj: !!(G._ctx && G._ctx.objective)
    })) : null;
    const after = await city.evaluate((setSrc) => {
      const cur = BohemiaPurse.VERBS['fight:plate'].currency;
      return BohemiaPurse.balance(purseGet(), cur); }, SET_POCKET);
    shots.push({ probe: probe, fired: fired, got: got, before: before, after: after });
    console.log('  ' + probe.name + ': fired ' + fired + ' -> ' + JSON.stringify(got)
      + '  pocket ' + before + ' -> ' + after);
    await page.click('[data-p="run"]', { timeout: 15000 }).catch(() => {});
    await sleep(2500);
  }

  const empty = shots[0], held = shots[1];
  ok('*** THE ROW\'S OWN SHIP TEST, DRIVEN: A PURSE AT ZERO RINGS WITH NO PLATE. *** Bumping a real hostile on the walked street with nothing in the pocket, the bell hands over '
    + (empty.got && empty.got.pp) + ' plates against a PLATE_START of ' + (empty.got && empty.got.PLATE_START)
    + '. It is not a new number: a plate that cracks already leaves zero and the fight already has a line for it. The stamp that decided it came through the door saying you could not pay ('
    + JSON.stringify(empty.got && empty.got.stamp) + ')',
    empty.fired === true && !!empty.got && empty.got.pp === 0
    && empty.got.PLATE_START === 1 && !!empty.got.stamp && empty.got.stamp.can === false);

  ok('AND WITH TAPE IN THE POCKET NOTHING CHANGED AT ALL, which is the half that proves this is a cost and not a nerf: '
    + (held.got && held.got.pp) + ' plates, exactly PLATE_START, and no cut recorded ('
    + JSON.stringify(held.got && held.got.cut) + ')',
    held.fired === true && !!held.got && held.got.pp === held.got.PLATE_START
    && !held.got.cut && !!held.got.stamp && held.got.stamp.can === true);

  ok('AND HE IS TOLD, because armour that quietly is not there is the same as a bug (V210\'s rule, one round old in this lane): with an empty pocket the readout reads "'
    + (empty.got && empty.got.read && empty.got.read.t) + ' / ' + (empty.got && empty.got.read && empty.got.read.s)
    + '". IT SPEAKS EVEN THOUGH THIS FIGHT CARRIES AN OBJECTIVE (' + (empty.got && empty.got.obj)
    + '), which is the bug this row found in V207: showObjective writes its own chip and never touched the readout, so standing down for an objective silenced the line on every one of the four real entries -- a row that only ever spoke on the test bench',
    !!empty.got && !!empty.got.read && /NO PLATE/.test(empty.got.read.t)
    && /tape/.test(empty.got.read.s) && empty.got.obj === true);

  ok('*** AND THE BELL DOES NOT DEBIT, WHICH IS DELIBERATE AND IS THE ONE PLACE THIS DEPARTS FROM THE ROW\'S WORDING. *** The spend is already built, shipped, and held by another lane\'s gate, in the handler that fires when the fight comes home. A second debit here would charge twice for one plate, which is worse than charging at the far end of the fight. So starting a fight moves the pocket by nothing: '
    + held.before + ' before the bell, ' + held.after + ' after it',
    held.before === held.after && empty.before === empty.after);

  /* ---- 3. TUNE THE PURSE AND THE BELL CHANGES ITS MIND ------------------- */
  const tuned = await city.evaluate((setSrc) => {
    const set = eval(setSrc);
    set(1);
    const beforeTune = cityPlateNow();
    const real = BohemiaPurse.upkeep;
    /* his ONE tuned to a TWO, in the purse and nowhere else */
    BohemiaPurse.upkeep = function (purse, verb, ref, day) {
      const v = (BohemiaPurse.VERBS || {})[verb];
      if (!v) return real(purse, verb, ref, day);
      return BohemiaPurse.debit(purse, v.currency, 2, verb, ref || null, day);
    };
    const afterTune = cityPlateNow();
    set(2); const atTwo = cityPlateNow();
    BohemiaPurse.upkeep = real;
    const restored = cityPlateNow();
    return { beforeTune: beforeTune, afterTune: afterTune, atTwo: atTwo, restored: restored };
  }, SET_POCKET);
  console.log('  tuned: ' + JSON.stringify(tuned));
  ok('*** AND THE AMOUNT IS HIS TO TUNE, PROVED BY TUNING IT. *** With the purse charging ONE, a pocket holding one can pay ('
    + tuned.beforeTune.can + '). Charging TWO, the same pocket holding one CANNOT ('
    + tuned.afterTune.can + ', short ' + tuned.afterTune.short + ') and a pocket holding two can ('
    + tuned.atTwo.can + ') -- with not one line of the fight or the door edited, because the answer is the purse\'s own upkeep() run on a throwaway purse. Put back, it pays again ('
    + tuned.restored.can + '). THIS IS THE ARM THAT WOULD CATCH SOMEBODY REPLACING THE DRY RUN WITH "balance >= 1"',
    tuned.beforeTune.can === true && tuned.afterTune.can === false && tuned.afterTune.short === 1
    && tuned.atTwo.can === true && tuned.restored.can === true);

  /* ---- 4. A BENCH FIGHT AND THE LESSON ARE BOTH LEFT ALONE --------------- */
  const cf2 = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  const standDowns = cf2 ? await cf2.evaluate(() => {
    const out = {};
    /* NO STAMP: a fight that never came from the city cannot know your purse */
    G.plate = null; G.teachBeat = false; G.pp = 1;
    out.noStamp = { cut: plateAtBell(), pp: G.pp };
    /* THE LESSON: never made harder by an empty pocket */
    G.plate = { can: false, have: 0 }; G.teachBeat = true; G.pp = 1;
    out.lesson = { cut: plateAtBell(), pp: G.pp };
    /* and with a stamp saying no and no lesson, it bites */
    G.teachBeat = false; G.pp = 1;
    out.bites = { cut: plateAtBell(), pp: G.pp };
    /* THE PERKS GO WITH IT: a plate perk bought, pocket empty, still none.
       Staged through the REAL tree so the allowance is the game's own, not a number
       this gate typed: PLATE CARRIER is "you walk in wearing two". */
    const spentWas = (TREE.spent || []).slice();
    TREE.spent = spentWas.indexOf('carrier') >= 0 ? spentWas : spentWas.concat(['carrier']);
    G.plate = { can: true, have: 9 }; G.pp = 0;
    out.perkPaid = { cut: plateAtBell(), pp: G.pp };      /* can pay: the perk plate is there */
    G.plate = { can: false, have: 0 }; G.pp = 0;
    out.perks = { cut: plateAtBell(), pp: G.pp };         /* cannot pay: none of them */
    TREE.spent = spentWas;
    return out;
  }) : null;
  console.log('  stand-downs: ' + JSON.stringify(standDowns));
  ok('AND A FIGHT THAT DID NOT COME FROM THE CITY KEEPS ITS PLATE (' + (standDowns && standDowns.noStamp.pp)
    + '), because the test bench has no access to a purse and punishing it for a wire it cannot reach would be this tool inventing a rule. NO STAMP, NO CHANGE',
    !!standDowns && standDowns.noStamp.cut === null && standDowns.noStamp.pp === 1);

  ok('AND THE TEACHING FIGHT IS NEVER MADE HARDER BY AN EMPTY POCKET (' + (standDowns && standDowns.lesson.pp)
    + '), the same stand-down V207 wrote for the same reason -- while the very same stamp with the lesson off does bite ('
    + (standDowns && standDowns.bites.pp) + '), so the stand-down is a stand-down and not a broken wire',
    !!standDowns && standDowns.lesson.cut === null && standDowns.lesson.pp === 1
    && standDowns.bites.pp === 0);

  ok('AND THE PLATE PERKS GO WITH IT, which is a decision and not an oversight: applyPerks runs one line after the reset and PLATE CARRIER is the first BODY perk at level 1, so sparing perks would stop this row biting almost immediately. With that perk really bought on the real tree, a payable bell hands over '
    + (standDowns && standDowns.perkPaid.pp) + ' ("you walk in wearing two", and the gate never typed that 2 -- the perk did), and an empty pocket leaves '
    + (standDowns && standDowns.perks.pp) + ' with the readout naming the ' + (standDowns && standDowns.perks.cut && standDowns.perks.cut.lost)
    + ' it cancelled. The perk is not taken away, it is unpayable for this one fight',
    !!standDowns && standDowns.perkPaid.pp === 2 && standDowns.perkPaid.cut === null
    && standDowns.perks.pp === 0 && standDowns.perks.cut && standDowns.perks.cut.lost === 2);

  /* ---- 4b. *** THE RESET THE ROW ASSUMED EXISTED, AND MEASURED DID NOT *** -- */
  const reset = cf2 ? await cf2.evaluate(() => {
    /* crack it the way a hit does, leave a kit sentinel, and ask the bell */
    G.plate = { can: true, have: 9 }; G.teachBeat = false;
    G.pp = 0; G.kit = { SENTINEL: 1 };
    const cut = plateAtBell();
    return { pp: G.pp, cut: cut, owed: plateOwed(),
      plateStart: (typeof PLATE_START !== 'undefined') ? PLATE_START : null,
      kitStillThere: !!(G.kit && G.kit.SENTINEL),
      powerKept: G.power };
  }) : null;
  console.log('  the reset at the bell: ' + JSON.stringify(reset));
  ok('*** AND THE BELL NOW ACTUALLY HANDS YOU THE PLATE, WHICH IT NEVER DID ON A REAL ENTRY. *** Measured on clean main before any of this, so it is not mine: the row quotes day 10 saying "G.pp=PLATE_START runs at the top of every fight", and that line lives in resetFightState -- which V107 wrote for this exact class of bug ("EVERY PER-FIGHT FIELD LIVES HERE NOW, and both doors call it") -- while THE CITY IS A THIRD DOOR THAT CALLS NEITHER. Driven twice through a real street bump with the plate cracked in between, fight two started with 0 against a PLATE_START of 1, and the bench door correctly gave it back. You have to build the reset to be able to charge for it, so this row carries both halves: from a cracked '
    + '0 the bell hands back ' + (reset && reset.pp) + ' (owed ' + (reset && reset.owed) + ')',
    !!reset && reset.pp === reset.plateStart && reset.owed === reset.plateStart && reset.cut === null);

  ok('AND IT RESETS THE PLATE AND NOTHING ELSE, because the same hole is leaking the kit and power too and those are somebody else\'s numbers: the kit sentinel is still sitting there after the bell ('
    + (reset && reset.kitStillThere) + ') and power came back exactly as it was ('
    + (reset && reset.powerKept) + '). That leak is measured and ROUTED, not quietly fixed on the way past a row about armour -- a row that moves a stat nobody asked it to move is how a lane loses the right to be trusted with the next one',
    !!reset && reset.kitStillThere === true && typeof reset.powerKept === 'number');

  /* ---- 5. NO DAMAGE BEFORE THE DIAL ------------------------------------- */
  const dial = cf2 ? await cf2.evaluate(() => ({
    plateStart: (typeof PLATE_START !== 'undefined') ? PLATE_START : null,
    ppMax: (typeof PP_MAX !== 'undefined') ? PP_MAX : null,
    dmg: (typeof applyDamage === 'function') ? String(applyDamage).length : null,
    dmgHasPlate: (typeof applyDamage === 'function') ? /plate|tape|G\.plate/.test(String(applyDamage)) : null,
    authored: (typeof plateAtBell === 'function')
      ? /[><]=?\s*\d|\bhave\s*[><]/.test(String(plateAtBell)) : null
  })) : null;
  console.log('  the dial: ' + JSON.stringify(dial));
  ok('NO DAMAGE BEFORE THE DIAL: PLATE_START is still ' + (dial && dial.plateStart) + ', PP_MAX still '
    + (dial && dial.ppMax) + ', and applyDamage knows nothing about tape or a purse ('
    + (dial && dial.dmgHasPlate) + '). Not one damage value, hit chance or roll is authored by this row -- the only thing that moves is how many plates you are handed, between two numbers the game already uses. AND THE BELL ITSELF AUTHORS NO COMPARISON AGAINST AN AMOUNT ('
    + (dial && dial.authored) + '): it honours the answer the door was given',
    !!dial && dial.plateStart === 1 && dial.ppMax !== null
    && dial.dmgHasPlate === false && dial.authored === false);

  ok('no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('  errors: ' + JSON.stringify(errors.slice(0, 3)));
  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  fail++; return done(null);
});
