#!/usr/bin/env node
/* HAZARD GATE (8/18/26, WORLD lane) — THE FLOOR CAN DO SOMETHING TO YOU.
 *
 * Paolo 8/17, LOCKED: "THE WORLD HAS TO FEEL MORE ALIVE."
 * laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md §5 routes that order to WORLD and says why:
 * it is TILE TYPES with combat-readable properties, not combat code. §5's last line is the
 * brief: A ROOM ONLY FEELS ALIVE IF THE FLOOR CAN DO SOMETHING TO YOU.
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this is the gate, and it holds two
 * separate claims that fail in completely different ways:
 *
 *   THE READING IS DERIVED, NOT TYPED.  The membership of every class comes from a RULE run
 *     against each district's own LEGEND, so a drained pool authored next month is lethal
 *     ground that afternoon with no edit anywhere. That claim is only worth anything if
 *     something attacks it, so this MUTATES a legend and watches the class follow — in both
 *     directions. A hand-kept table would sail through every other assertion here.
 *
 *   IT REACHES THE GLASS.  VERIFY ON THE REAL SURFACE (7/18): a module that classifies
 *     nineteen tiles and never shows up where he walks has shipped nothing. So the second
 *     half drives a REAL STEP through the page's own metronome, onto a real hazard tile in
 *     the real valley, and reads what he would see.
 *
 * WHAT THE REAL SURFACE ALREADY CORRECTED, and it is the reason that half exists. The first
 * version of the standability rule was "not solid and not a portal". Six tiles passed it and
 * came back walk:false when the running page was asked — `storage:3 debris / tumbleweed`
 * among them — because the kit calls a prop non-solid while the walked surface blocks it.
 * A PROP IS AN OBJECT ON THE GROUND, NOT THE GROUND. The rule is layer==='ground' now, and
 * the six went out. Nineteen tiles that are all actually standable beats twenty-five where
 * six are decoration.
 *
 * WHAT IT DELIBERATELY DOES NOT ASSERT: how COMMON any class is. That is his dial and the
 * table ships empty (MECHANISM-MINE / CONTENTS-PAOLO'S). What is asserted is that the dial
 * is empty and answers NO_RULING, so nobody quietly fills it in.
 *
 *   node gates/hazard_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}

require(path.join(ROOT, 'engine/bohemia_world.js'));
const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));
const H = require(path.join(ROOT, 'engine/bohemia_hazard.js'));

console.log('HAZARD GATE — the five classes, derived from the world that already exists\n');

/* ── 1. THE FIVE CLASSES ARE HIS, AND SO ARE THE NUMBERS ───────────────────────
   Not "five classes exist" — the five he named, with the effects his corpus states.
   A renamed class or a re-tuned multiplier is somebody deciding his design for him. */
console.log('THE CLASSES AND THE NUMBERS ARE HIS');
['KILLS', 'AMPLIFIES', 'DISABLES', 'FAVOURS', 'DENIES'].forEach(c =>
  ok('the class exists by his name: ' + c, !!H.CLASSES[c]));
ok('AMPLIFIES is +50% physical damage taken, exactly (his number, not a tuned one)',
   H.CLASSES.AMPLIFIES.effect.physicalTakenMult === 1.5);
ok('DISABLES switches off sprinting AND movement abilities, both',
   H.CLASSES.DISABLES.effect.sprint === false &&
   H.CLASSES.DISABLES.effect.movementAbilities === false);
ok('KILLS is outright, on the ENVIRONMENTAL channel',
   H.CLASSES.KILLS.effect.outright === true &&
   H.CLASSES.KILLS.effect.channel === 'environmental');
/* §2.4: "Pits, falls, hazards kill outright; no WEAPON ever does." The kill channel is the
   one thing in the game that bypasses the damage stat, and NO DAMAGE BEFORE THE DIAL only
   survives because a weapon can never reach it. That fence is an assertion, not a comment. */
ok('NO WEAPON may route damage through the kill channel (§2.4, the fence that keeps '
   + 'NO DAMAGE BEFORE THE DIAL intact)', H.CLASSES.KILLS.weaponsMayUse === false);

/* ── 2. FORCED ENTRY KILLS. DELIBERATE ENTRY DOES NOT ──────────────────────────
   His corpus: "an enemy KNOCKED or CHARGING in dies outright." Both are entries the body
   did not choose. This is the clause that dissolved the how-deep-is-fatal question — the
   test is not depth, it is whether you landed under control. */
console.log('\nFORCED ENTRY KILLS, DELIBERATE ENTRY DOES NOT');
ok('knocked in dies', H.killsOnEntry('KILLS', 'knocked') === true);
ok('charging in dies', H.killsOnEntry('KILLS', 'charged') === true);
ok('WALKING IN DOES NOT — you climbed down, which is what a drained pool is for',
   H.killsOnEntry('KILLS', 'walked') === false);
ok('no other class kills on any entry',
   ['AMPLIFIES', 'DISABLES', 'FAVOURS', 'DENIES'].every(c =>
     ['knocked', 'charged', 'walked'].every(e => H.killsOnEntry(c, e) === false)));
ok('the multiplier is 1 on every ground that is not AMPLIFIES',
   ['KILLS', 'DISABLES', 'FAVOURS', 'DENIES', null].every(c => H.physicalTakenMult(c) === 1));
ok('AMPLIFIES is the only ground that changes what a hit costs',
   H.physicalTakenMult('AMPLIFIES') === 1.5);
ok('DISABLES is the only ground that takes the movement budget away',
   H.canSprint('DISABLES') === false &&
   ['KILLS', 'AMPLIFIES', 'FAVOURS', null].every(c => H.canSprint(c) === true));

/* ── 3. THE CONTENTS HE RESERVED ARE STILL EMPTY ───────────────────────────────
   MECHANISM-MINE / CONTENTS-PAOLO'S, and each empty table is empty for its own stated
   reason. An assertion here is the only thing stopping a future session "finishing" them. */
console.log('\nWHAT IS HIS IS STILL EMPTY');
ok('the DIALS table is empty — how common each class is, is his call',
   Object.keys(H.DIALS).length === 0);
ok('and asking for one answers NO_RULING rather than inventing a number',
   H.dialFor('KILLS') === H.NO_RULING && H.dialFor('AMPLIFIES') === H.NO_RULING &&
   H.dialFor('DISABLES') === H.NO_RULING);
ok('DENIES is not a floor class at all — it is a predicate over a BODY, so no legend '
   + 'sweep could ever populate it', H.CLASSES.DENIES.floor === false);
ok('DENIES answers off occupancy, not off ground',
   H.deniesOn({ body: { dead: true }, standingOn: true }) === true &&
   H.deniesOn({ body: { dead: false }, standingOn: true }) === false &&
   H.deniesOn(null) === false);

/* ── 4. THE SWEEP IS DERIVED FROM THE REGISTRY ─────────────────────────────────
   A VALUE PASSED BY HAND WHERE A VALUE COULD BE DERIVED is this house's oldest bug and it
   has been sighted eight times. The sweep reads K.types() and nothing else, so a district
   that registers itself is swept without an edit here or in the module. */
console.log('\nDERIVED FROM THE REGISTRY, NEVER FROM A LIST');
const sweep = H.sweep(K);
const types = K.types();
let tiles = 0, byClass = {}, dcount = {};
for (const d in sweep) for (const c in sweep[d]) {
  tiles++; const cl = sweep[d][c];
  byClass[cl] = (byClass[cl] || 0) + 1;
  (dcount[cl] = dcount[cl] || new Set()).add(d);
}
console.log('       swept ' + types.length + ' registered district types -> ' + tiles +
            ' hazard tiles in ' + Object.keys(sweep).length + ' districts');
for (const cl of Object.keys(byClass).sort())
  console.log('       ' + cl.padEnd(10) + byClass[cl] + ' tiles in ' + dcount[cl].size + ' districts');
ok('the whole registry is swept, not a hand list (' + types.length + ' types)', types.length >= 60);
ok('the valley already contained hazards before anybody added one', tiles > 0);
['KILLS', 'AMPLIFIES', 'DISABLES'].forEach(cl =>
  ok('the world supplies real ground for ' + cl + ' (' + (byClass[cl] || 0) + ' tiles)',
     (byClass[cl] || 0) > 0));
ok('FAVOURS has ZERO members, because act one has no undead and ACT ONE ONLY forbids me '
   + 'inventing the ones that might', !byClass.FAVOURS);
ok('DENIES never appears in a sweep', !byClass.DENIES);

/* ── 5. MUTATION: IS IT REALLY DERIVED, OR JUST SHAPED LIKE IT ─────────────────
   A green from an unattacked checker is not evidence. Both directions, on a real legend. */
console.log('\nMUTATION — attack the derivation from both sides');
{
  const spec = K.get('apartment'), was = spec.legend[8].name;
  ok('before: apartment:8 "' + was + '" reads KILLS',
     H.classOf(spec.legend[8], K) === 'KILLS');
  spec.legend[8].name = 'courtyard paving';
  ok('rename it to something harmless and the class GOES AWAY — a hand-kept table would '
     + 'have kept calling it a pit', H.classOf(spec.legend[8], K) === null);
  spec.legend[8].name = was;
  ok('put the name back and it is lethal again', H.classOf(spec.legend[8], K) === 'KILLS');

  /* the other direction: ordinary ground that becomes a hazard purely by being authored
     as one. This is the claim that a new district gets its hazards for free. */
  const park = K.get('park'), pwas = park.legend[0] && park.legend[0].name;
  if (park.legend[0]) {
    ok('before: park:0 "' + pwas + '" is not a hazard', H.classOf(park.legend[0], K) === null);
    park.legend[0].name = 'drained pool';
    ok('author a drained pool into a district that never had one and it is lethal ground '
       + 'immediately, with no edit to the module', H.classOf(park.legend[0], K) === 'KILLS');
    park.legend[0].name = pwas;
  }
}

/* ── 6. A FLOOR HAZARD MUST BE FLOOR ───────────────────────────────────────────
   The rule the running page taught. Attack it with a tile named like a hazard that a body
   can never stand on. */
console.log('\nA FLOOR HAZARD MUST BE FLOOR (the rule the running page corrected)');
{
  const solidNamedLikeAPit = { name: 'drained pool', kind: 'building', act1: 'x' };
  ok('a SOLID tile named "drained pool" is not a pit — you cannot be knocked into '
     + 'something that already blocks you', H.classOf(solidNamedLikeAPit, K) === null);
  const propNamedLikeRubble = { name: 'rubble / debris', kind: 'prop', act1: 'x' };
  ok('a PROP named "rubble / debris" is not footing — it is an object ON the ground, and '
     + 'the walked surface blocks it', H.classOf(propNamedLikeRubble, K) === null);
  const portalNamedLikeAPit = { name: 'sewer tunnel mouth', kind: 'portal', act1: 'x' };
  ok('a PORTAL is a door, not a drop — going through one is the intent',
     H.classOf(portalNamedLikeAPit, K) === null);
  let bad = [];
  for (const d in sweep) for (const c in sweep[d]) {
    const ly = K.tileLayer(K.get(d).legend[c]);
    if (ly.layer !== 'ground' || ly.solid) bad.push(d + ':' + c + ' (' + ly.layer + ')');
  }
  ok('EVERY classified tile in the whole valley is ground-layer and non-solid' +
     (bad.length ? ' — ' + bad.join(', ') : ''), bad.length === 0);
}

/* ── 7. A MENTION IS NOT A USE ─────────────────────────────────────────────────
   This house's most repeated bug, hit five times in one session on 8/16 alone. A rule may
   ADMIT only on the tile's NAME; the act-1 material is prose and prose mentions things the
   tile is not. Two real tiles proved it and they are the regression. */
console.log('\nA MENTION IS NOT A USE');
{
  const rail = K.get('rail'), yard = K.get('railyard');
  const cess = rail && rail.legend[4];
  ok('rail:4 "cess" — the crew WALKWAY, described as "beside the ballast" — is NOT bad '
     + 'footing. It exists precisely because ballast is.',
     !cess || H.classOf(cess, K) === null);
  const brush = yard && yard.legend[3];
  ok('railyard:3 "dead brush", described as "in the ballast", is NOT ballast',
     !brush || H.classOf(brush, K) === null);
  ok('but rail:1 "ballast" itself still is', H.classOf(rail.legend[1], K) === 'AMPLIFIES');
}

/* ── 8. THE VETOES ARE REAL COLLISIONS, NOT PADDING ────────────────────────────
   Each of these is a tile that actually exists and actually collided. */
console.log('\nTHE NAME COLLISIONS IN THE REAL LEGENDS');
{
  const cases = [
    ['speedway', 9, 'pit road is a ROAD named "pit"'],
    ['golf', 8, 'a golf "dry water hazard" is a hazard in the golf sense, 300 mm deep'],
    ['park', 9, 'an ornamental dead pond is a step down, not a drop'],
    ['cityhall', 8, 'a dry fountain basin is not a pit'],
    ['courthouse', 8, 'a dry reflecting basin is not a pit']
  ];
  cases.forEach(([d, c, why]) => {
    const spec = K.get(d);
    ok(why, !spec || !spec.legend[c] || H.classOf(spec.legend[c], K) === null);
  });
  ok('and a DRY basin is never mistaken for a liquid either',
     H.classOf({ name: 'dry basin floor', kind: 'ground', act1: 'cracked concrete' }, K) === null);
}

/* ── 9. ONE CELL, ONE CLASS ────────────────────────────────────────────────────
   Precedence is DECLARED (KILLS > DISABLES > AMPLIFIES), so a crusted pond that is both a
   trap and bad footing is a trap. classOf returning a single value is the mechanism; this
   proves the ORDER is the declared one rather than whatever the loop happened to do. */
console.log('\nONE CELL, ONE CLASS, IN A DECLARED ORDER');
ok('KILLS outranks AMPLIFIES on ground that is both',
   H.classOf({ name: 'crusted pond centre', kind: 'ground', act1: 'crust over fines' }, K) === 'KILLS');
ok('the rule order in the module IS that precedence',
   H.RULES.map(r => r.cls).join('>') === 'KILLS>DISABLES>AMPLIFIES');
ok('every rule carries a WHY in prose, because a classifier nobody can argue with is a '
   + 'classifier nobody can correct', H.RULES.every(r => (r.why || '').length > 40));
ok('every deliberate NON-member is written down with its reason — an unrecorded refusal '
   + 'is indistinguishable from an oversight',
   H.UNCLASSIFIED.length >= 4 && H.UNCLASSIFIED.every(u => u.tile && (u.why || '').length > 40));

/* ── 10. THE REAL SURFACE ──────────────────────────────────────────────────────
   Everything above could be true of a module nobody loads. */
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

(async () => {
  console.log('\nTHE REAL SURFACE — the valley he walks in, not a fixture');
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await p.waitForTimeout(3000);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });

    const base = await p.evaluate(() => ({
      mod: typeof BohemiaHazard !== 'undefined',
      reader: typeof hazardUnder === 'function',
      el: !!document.getElementById('footing'),
      mode: (typeof MODE !== 'undefined') ? MODE : '?',
      kitTypes: (typeof BohemiaDistrictKit !== 'undefined') ? BohemiaDistrictKit.types().length : 0
    }));
    ok('the hazard module is ON the page he walks in', base.mod);
    ok('the page can ask what is under his feet', base.reader);
    ok('the readout element exists on the stage', base.el);
    ok('and the page opens on foot, which is where a footing readout means anything',
       base.mode === 'human');

    /* FIND REAL GROUND IN THE REAL VALLEY. Not a fixture, not a synthesised cell: walk the
       overmap until a hazard tile turns up that the page itself calls walkable, with
       ordinary ground beside it to step off. */
    const scan = await p.evaluate(() => {
      const out = { picks: {}, walkable: {}, hazardDistricts: 0, pageSweep: [] };
      const s = BohemiaHazard.sweep(BohemiaDistrictKit);
      out.pageSweep = Object.keys(s);
      out.hazardDistricts = out.pageSweep.length;
      const N = om.n;
      outer:
      for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
        const t = om.at(tx, ty); if (!t || !s[t.district]) continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        const grid = m.kit || m.sub; if (!grid) continue;
        const legend = deadLegendFor(m); if (!legend) continue;
        for (let ly = 0; ly < FN; ly++) for (let lx = 1; lx < FN; lx++) {
          const e = legend[grid[ly * FN + lx]];
          const cls = BohemiaHazard.classOf(e, BohemiaDistrictKit); if (!cls) continue;
          const gx = tx * FN + lx, gy = ty * FN + ly;
          const here = cellAt(gx, gy); if (!(here && here.walk)) continue;
          out.walkable[cls] = (out.walkable[cls] || 0) + 1;
          /* the step must be a TRANSITION: ordinary ground beside it, or the readout
             appearing proves nothing about the step that made it appear. */
          if (!out.picks[cls]) {
            const west = cellAt(gx - 1, gy);
            if (west && west.walk && !BohemiaHazard.classOf(
                  legend[grid[ly * FN + (lx - 1)]], BohemiaDistrictKit))
              out.picks[cls] = { gx: gx, gy: gy, d: t.district, name: e.name || '' };
          }
          if (Object.keys(out.picks).length >= 3) break outer;
        }
      }
      return out;
    });
    console.log('       the page kit registers ' + base.kitTypes + ' of the engine\'s ' +
                types.length + ' district types; ' + scan.hazardDistricts +
                ' of them carry hazards: ' + scan.pageSweep.join(', '));
    ok('hazard ground exists in the real valley, on tiles the page itself calls walkable ' +
       '(' + JSON.stringify(scan.walkable) + ')',
       Object.keys(scan.walkable).length > 0);

    const SAYS = { KILLS: 'does not come back out', AMPLIFIES: 'cannot set your feet',
                   DISABLES: 'no sprinting' };
    for (const cls of ['KILLS', 'AMPLIFIES', 'DISABLES']) {
      const pk = scan.picks[cls];
      if (!pk) { ok('a walkable ' + cls + ' tile with ordinary ground beside it exists in ' +
                    'the real valley', false); continue; }
      /* THE REAL STEP, AND IT IS A TAP. startHold()+endHold() leaves the request in `pend`
         and clears the hold, so the page's own 120 BPM metronome executes EXACTLY ONE step
         — the same path his thumb takes, and the same one an accidental two-beat hold does
         not. Holding for 700 ms was the first attempt and it caught two ticks on one of the
         three picks, walking him straight over the hazard tile and out the far side: a
         green "the readout is missing" that was the harness's fault, not the build's.
         No direct call to footingUpdate() in the step itself, either: a gate that calls the
         function it is testing has proved the function works, not that the game calls it. */
      const r = await p.evaluate(async (pk) => {
        __proof.setPos(pk.gx - 1, pk.gy);
        footingUpdate();
        const before = document.getElementById('footing').style.display;
        startHold(2); endHold();                       /* DIRS[2] = east, one tap */
        await new Promise(r2 => setTimeout(r2, 700));
        const el = document.getElementById('footing');
        const on = { display: el.style.display, cls: el.className, text: el.textContent,
                     at: __proof.getPos() };
        /* AND STEPPING BACK OFF MUST CLEAR IT. You may swallow an intent; you may never
           swallow a cleanup — that lesson cost a P0 on this same page five days ago. */
        startHold(6); endHold();                       /* DIRS[6] = west */
        await new Promise(r2 => setTimeout(r2, 700));
        return { before: before, on: on, offDisplay: el.style.display,
                 offAt: __proof.getPos() };
      }, pk);
      ok(cls + ': ordinary ground shows nothing before the step (' + pk.d + ', ' + pk.name + ')',
         r.before === 'none');
      ok(cls + ': ONE REAL STEP east onto it and the readout is there',
         r.on.display === 'block' && r.on.at.hx === pk.gx);
      ok(cls + ': it is labelled as this class, and it says what the floor does in the ' +
         'floor\'s own words',
         r.on.cls === cls.toLowerCase() && r.on.text.indexOf(SAYS[cls]) >= 0);
      ok(cls + ': and stepping back off CLEARS it — a readout that sticks is a readout ' +
         'that lies about where he is standing', r.offDisplay === 'none');
    }

    /* IT READS ON THE STEP, NOT ON THE FRAME. This page was measured down from 46,859 world
       lookups per frame three days ago; a tile resolve in render() would hand that straight
       back. Counted, not asserted from reading the code. */
    const perFrame = await p.evaluate(() => {
      const real = window.hazardUnder;
      let n = 0;
      window.hazardUnder = function () { n++; return real.apply(this, arguments); };
      for (let i = 0; i < 20; i++) render();
      window.hazardUnder = real;
      return n;
    });
    ok('twenty full redraws ask the ground NOTHING (' + perFrame + ' calls) — it reads on ' +
       'the step, which is the only moment the answer can change', perFrame === 0);

    ok('no page errors while walking on and off hazard ground' +
       (errs.length ? ' — ' + errs[0] : ''), errs.length === 0);

    await browser.close();
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_e) {}
    ok('the real-surface half ran at all — ' + String(e).split('\n')[0], false);
  }

  console.log('\nHAZARD GATE: ' + pass + ' passed, ' + fail + ' failed  (the five classes are ' +
              'his, the membership is derived from ground the valley already had, and it ' +
              'reaches the glass he walks on)');
  process.exit(fail ? 1 : 0);
})();
