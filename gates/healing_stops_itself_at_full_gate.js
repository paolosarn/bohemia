/* HEALING STOPS ITSELF AT FULL GATE (CAMP [healing stops itself at full], VAMILY rule 278(a)(d), 10/26/26).
   PAOLO 10/26: 'I camp out, time speeds along, and it will stop, pause the game, as soon as my whole team is at 99 health and 99
   armour'.
   On the cut he plays, phone and computer, his company hurt in the company's own condition (engine/bohemia_condition.js, what a fight
   leaves), tape enough to mend it, camp made with the HEAL button's own call:
     F1 THE CAMP STOPS ITSELF at the very hour the last man reaches 99 percent of his hit points and of his armour (the hour the table's
        camp rates say, never an hour sooner, never later): back on the map, the camp's frame closed, the game on PAUSE, one of his men
        says they are ready
     F2 A REST HE ASKED FOR HOLDS: camp made with everybody already whole stands six hours (it is his to end, rule 267(a))
     F3 HEAL STILL ENDS IT SOONER: hurt again and camped, his HEAL ends it before they are whole
     F4 nothing threw
   (278(b) the struck down on the next board is STRUCK DOWN, HE STILL FIGHTS S3; 278(c) the bars in a town is THE BARS OVER THEIR HEADS
   B3.)
   node gates/healing_stops_itself_at_full_gate.js [--profile phone_portrait|computer]   (no flag: both) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const REST = () => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} };
/* every man of the company hurt the same: half his hit points, his helmet half, his body armour half; tape for all of it */
const HURT = (cut) => {
  const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
  const names = BohemiaCondition.company().names;
  names.forEach(k => { s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 60 * cut, armHMax: 20, lostH: 20 * cut, armBMax: 80, lostB: 80 * cut, wound: null }); });
  localStorage.setItem(KEY, JSON.stringify(s));
  const W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); W.tape = 400; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W));
  const R = BohemiaCondition.rates({ camped: true }), cut99 = 0.01;
  /* the hour the table's rates bring the last man to 99 percent of both */
  let h = 0; for (; h < 200; h++) { const hp = Math.max(0, 60 * cut - R.hp * h), arm = Math.max(0, 20 * cut - R.armour * h) + Math.max(0, 80 * cut - R.armour * h); if (hp <= 60 * cut99 + 1e-9 && arm <= 100 * cut99 + 1e-9) break; }
  return { names, want: h, rates: { hp: R.hp, armour: R.armour } };
};

async function run(profile) {
  console.log('--- ' + profile + ' ---');
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, profile }); }
  catch (e) { ok(profile + ': the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  const P = profile + ': ';
  try {
    await d.page.waitForTimeout(2500);
    /* ---- F1 ---- */
    await d.fr.evaluate(REST); await d.page.waitForTimeout(500);
    const f1a = await d.fr.evaluate(HURT, 0.5);
    const made1 = await d.fr.evaluate(() => { window.__CAMP_HEALED = null; window.__F1 = []; const made = BohemiaMapCamp.make();
      window.__F1T = setInterval(() => { try { const c = BohemiaMapCamp.condition(); __F1.push({ h: BohemiaMapCamp.state().hours, on: BohemiaMapCamp.on(), lo: c ? c.lowest : null }); } catch (e) {} }, 60); return made; });
    let f1 = null; for (let k = 0; k < 40; k++) { await d.page.waitForTimeout(500); f1 = await d.fr.evaluate(() => ({ on: BohemiaMapCamp.on(), healed: window.__CAMP_HEALED, why: (window.__CAMP || {}).why, frame: LOOP.frame ? LOOP.frame.style.display : null, speed: TRAVEL_SPEED, lowest: BohemiaMapCamp.condition().lowest })); if (!f1.on) break; }
    const trace = await d.fr.evaluate(() => { clearInterval(__F1T); return __F1; });
    const before = trace.filter(t => t.on && t.h < f1a.want).every(t => t.lo < 0.99);   /* never an hour sooner */
    if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'healed_' + profile + '.png') });
    ok(P + 'F1 *** THE CAMP STOPS ITSELF *** the hour the last man reaches 99% of both (hour ' + f1a.want + ' at ' + f1a.rates.hp + ' hit points and ' + f1a.rates.armour + ' armour an hour): back on the map, on PAUSE, one of his men says they are ready',
      made1 && !!f1 && !f1.on && f1.why === 'healed' && !!f1.healed && f1.healed.hours === f1a.want && f1.healed.lowest >= 0.99 && before && f1.frame === 'none' && f1.speed === 0 && /\w/.test(f1.healed.line || ''),
      JSON.stringify({ men: f1a.names.length, want: f1a.want, got: f1 && f1.healed && f1.healed.hours, why: f1 && f1.why, lowest: f1 && f1.healed && f1.healed.lowest, frame: f1 && f1.frame, speed: f1 && f1.speed, said: f1 && f1.healed && (f1.healed.by + ': ' + f1.healed.line), soonerNever: before }));
    /* ---- F2 ---- */
    await d.fr.evaluate(REST); await d.page.waitForTimeout(500);
    const f2 = await d.fr.evaluate(async () => { const made = BohemiaMapCamp.make(); const c = BohemiaMapCamp.condition(); await new Promise(r => setTimeout(r, 500 * 6 + 900));
      return { made, whole: c.lowest, on: BohemiaMapCamp.on(), hours: BohemiaMapCamp.state().hours }; });
    ok(P + 'F2 A REST HE ASKED FOR HOLDS: camped with everybody whole, the camp stands six hours', f2.made && f2.whole >= 0.99 && f2.on && f2.hours >= 6, JSON.stringify(f2));
    await d.fr.evaluate(() => BohemiaMapCamp.break()); await d.page.waitForTimeout(400);
    /* ---- F3 ---- */
    await d.fr.evaluate(REST); await d.page.waitForTimeout(400);
    await d.fr.evaluate(HURT, 0.8);
    const f3 = await d.fr.evaluate(async () => { const made = BohemiaMapCamp.make(); await new Promise(r => setTimeout(r, 1100)); BohemiaMapCamp.break();
      return { made, on: BohemiaMapCamp.on(), why: (window.__CAMP || {}).why, lowest: BohemiaMapCamp.condition().lowest }; });
    ok(P + 'F3 HEAL STILL ENDS IT SOONER: hurt and camped, his HEAL ends it before they are whole', f3.made && !f3.on && f3.why === 'left' && f3.lowest < 0.99, JSON.stringify(f3));
    ok(P + 'F4 nothing threw', d.errs.length === 0, d.errs.length ? String(d.errs[0]).slice(0, 160) : 'no errors');
  } catch (e) {
    ok(P + 'the gate ran without throwing [' + String(e.stack || e.message).slice(0, 300) + ']', false);
  } finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'computer'];
  for (const p of profiles) await run(p);
  console.log('=== HEALING STOPS ITSELF AT FULL GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
