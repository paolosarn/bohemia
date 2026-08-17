#!/usr/bin/env node
/* BOHEMIA — RF4 TEARDOWN: THE BOHEMIA-SIDE MEASUREMENT (LAB lane, 8/17/26)
 *
 * laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md §4: "LAB OWNS THE TEARDOWN. It studies
 * RF4 and produces THE SPEC: a numbered, mechanical inventory of RF4's systems ... plus a DIFF
 * against what Bohemia already has. LAB WRITES NO COMBAT CODE."
 *
 * This is the DIFF half, and it is MEASURED rather than remembered. It drives the real alpha's
 * COMBAT tab through the shipped functions and reports what is actually in the fight, so every
 * BUILT/SPECED status in the spec is a fact the machine re-derives instead of a claim I typed.
 *
 * IT WRITES NO COMBAT CODE AND CHANGES NO COMBAT STATE THAT PERSISTS. It calls setupCombat()
 * on throwaway arenas to read the roster, which is what the shipped gates already do.
 *
 * REUSE CHECK: cooks no graphic pixels, so the shopping law does not bind. The
 * drive-into-the-combat-frame path is lifted from gates/fight_moves_you_gate.js rather than
 * rewritten. It reads slices/BOHEMIA_ALPHA_0_9.html only.
 *
 * ★ TWO MEASUREMENT TRAPS THIS TOOL EXISTS TO AVOID, both of which I fell into on the first
 * pass and both of which nearly became false accusations against the COMBAT lane's work:
 *   1. I read `m.kind` to get enemy types. THAT FIELD DOES NOT EXIST -- it is `m.n` / `m.arch`.
 *      Every body came back as '?' and I nearly filed "all enemies are identical" as a finding
 *      when there are five real differentiated types.
 *   2. I grepped the top-level alpha HTML for myCoverAgainst / lineOfFire / dirIndex, got ZERO,
 *      and briefly believed the RF4 cover model was never shipped. It IS shipped -- it lives in
 *      the combat FRAME, which the top-level document does not contain.
 *      A GREP THAT MISSES IS NOT AN ABSENCE. Measure on the surface, through the real API.
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const ARENAS = 40;
const RF4_LO = 3, RF4_HI = 6;   /* Wang's own band. Not a number I picked. */

async function measure() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  await page.goto('file://' + ALPHA);
  await page.waitForTimeout(9000);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.click('[data-p="combat"]'); await page.waitForTimeout(7000);
  await page.mouse.click(215, 450); await page.waitForTimeout(5000);

  const frame = page.frames().find(f => f.name() === 'combatFrame');
  if (!frame) { await browser.close(); return { reached: false, errors }; }

  const m = await frame.evaluate(N => {
    if (typeof BohemiaArena === 'undefined' || typeof setupCombat !== 'function')
      return { reached: false };
    const counts = [], names = {};
    const hp = new Set(), reach = new Set(), cad = new Set();
    let bodies = 0, melee = 0, elite = 0, armored = 0;
    for (let a = 1; a <= N; a++) {
      BohemiaArena.set(a); setupCombat();
      const e = G.e || [];
      counts.push(e.length);
      e.forEach(x => {
        bodies++;
        names[x.n] = (names[x.n] || 0) + 1;      /* ★ x.n / x.arch, NOT x.kind */
        hp.add(x.hpMax || x.max || x.hp);
        reach.add(x.reach); cad.add(x.cad);
        if (x.melee) melee++;
        if (x.elite) elite++;
        if (x.armor) armored++;
      });
    }
    const fn = n => typeof window[n] === 'function';
    const inG = k => k in G;
    return {
      reached: true, counts, bodies, names, types: Object.keys(names).length,
      hpTiers: hp.size, reachVals: reach.size, cadVals: cad.size, melee, elite, armored,
      /* RF4 systems, each probed for its Bohemia counterpart */
      cover:       ['myCoverAgainst', 'myConcealAgainst', 'dirIndex', 'hasLine', 'peeking', 'firing'].filter(fn),
      environment: ['chewCover', 'coverHP', 'cookOff', 'onDeck', 'stairNear', 'underDeck', 'isDark'].filter(fn),
      readouts:    ['coverWord', 'coverLine', 'rangeTier', 'threatRank', 'pkgName'].filter(fn),
      determinism: ['bohemiaDice'].filter(fn),
      targeting:   ['pickTarget', 'nearestFoe', 'threatWeight', 'exposedToMe'].filter(fn),
      ranges:      ['wpnRange', 'myRange', 'foeRange', 'maxRange', 'rangeMult', 'distAccuracy'].filter(fn),
      /* the gaps the spec has to name */
      abilityFns:  ['useAbility', 'castAbility', 'spendCharge', 'chargeUp'].filter(fn),
      verbs:       ['grenade', 'dashArm', 'sprintArm', 'suppCd', 'hold', 'defend', 'stam'].filter(inG),
      /* RF4's Power unification -- one stat that replaces many damage boosts */
      powerStat:   Object.keys(G).filter(k => /^power$|^pow$/i.test(k)),
      /* RF4 zone/boss structure */
      zones:       ['BohemiaArena'].filter(n => typeof window[n] !== 'undefined'),
      exitWire:    ['placeWayOut', 'exitCheck'].filter(fn),
    };
  }, ARENAS);

  await browser.close();
  if (!m.reached) return { reached: false, errors };

  const inBand = m.counts.filter(c => c >= RF4_LO && c <= RF4_HI).length;
  return {
    ...m, errors,
    arenas: ARENAS,
    encMin: Math.min(...m.counts), encMax: Math.max(...m.counts),
    encMean: +(m.counts.reduce((a, b) => a + b, 0) / m.counts.length).toFixed(1),
    inBand, rf4Lo: RF4_LO, rf4Hi: RF4_HI,
  };
}

if (require.main === module) {
  measure().then(r => {
    if (!r.reached) { console.log('COULD NOT REACH THE COMBAT FRAME'); process.exit(1); }
    if (process.argv.includes('--json')) { console.log(JSON.stringify(r, null, 1)); return; }
    console.log('BOHEMIA-SIDE MEASUREMENT (the DIFF column of the teardown spec)');
    console.log(`  ${r.bodies} bodies across ${r.arenas} arenas`);
    console.log(`  ENCOUNTER SIZE  min ${r.encMin} · max ${r.encMax} · mean ${r.encMean}`);
    console.log(`    inside RF4's ${r.rf4Lo}-${r.rf4Hi}: ${r.inBand}/${r.arenas}`);
    console.log(`  ROSTER  ${r.types} types ${JSON.stringify(r.names)}`);
    console.log(`    ${r.hpTiers} hp tiers · ${r.melee} melee · ${r.elite} elite · armor used on ${r.armored}`);
    console.log(`  cover model  ${r.cover.join(', ') || 'NONE'}`);
    console.log(`  environment  ${r.environment.join(', ') || 'NONE'}`);
    console.log(`  readouts     ${r.readouts.join(', ') || 'NONE'}`);
    console.log(`  ranges       ${r.ranges.join(', ') || 'NONE'}`);
    console.log(`  targeting    ${r.targeting.join(', ') || 'NONE'}`);
    console.log(`  exit wire    ${r.exitWire.join(', ') || 'NONE'}`);
    console.log(`  ability fns  ${r.abilityFns.join(', ') || 'NONE  <-- RF4 gap'}`);
    console.log(`  POWER stat   ${r.powerStat.join(', ') || 'NONE  <-- RF4 gap'}`);
    console.log(`  verbs in G   ${r.verbs.join(', ')}`);
    console.log(`  page errors  ${r.errors.length}`);
  });
}

module.exports = { measure, RF4_LO, RF4_HI, ARENAS };
