/* THE BARS OVER THEIR HEADS GATE (CAMP [the bars over their heads], VAMILY rule 261(e) and 278(c), 10/26/26).
   PAOLO 10/26: 'I need the HP and the armour displaying on top of my characters, right now, any time... if they're at full health it
   never has to display... above 87 percent it doesn't display anymore... I need that immediately, I need to see how everyone's
   healing'; and again: 'in any settlement it should show above each person in my company, as they walk or chill, a health bar and an
   armour bar'.
   On the cut he plays, phone and computer, a company with a man at 40 percent of his hit points, a man with his armour at 60 percent
   and a man at 95 percent of both (the company's own condition, engine/bohemia_condition.js, what a fight leaves):
     B1 THE MAP: over YOU and the two of his men who walk with him, bars over the first two only; each bar's fill is his number over
        his maximum within a pixel
     B2 AT 87 THEY GO: the third man at 86 percent carries his bars, at 87 percent nothing
     B3 IN A TOWN (through the map's door): over the men of his company in the town's picture, the same: the first two only, the fill
        within a pixel
     B4 AT CAMP: the same over the camp's men (the camp heals an hour every half second: each fill against the man's number in the
        frame the picture was drawn)
     B5 nothing threw
     B6 THE MAP DRAWS ONCE: a heal on the map asks for one draw on the next frame, none of its own while the map is drawing anyway,
        and none under a town or the camp (one whole draw is 0.4 to 0.7 s on a phone at 4x, __ONE_RENDER_A_FRAME__)
   node gates/the_bars_over_their_heads_gate.js [--profile phone_portrait|computer]   (no flag: both) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
/* three men's records in the company's condition, by look (the map and the town draw a man by his look), YOU by his key */
const SEED = (who) => {
  const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] };
  s.men = s.men || {}; s.dead = s.dead || [];
  /* one record a man: an earlier leg's record on the same look goes (two records on one look is no man the game has) */
  who.forEach(w => { if (w.look) for (const k in s.men) if (s.men[k] && s.men[k].look === w.look && !s.men[k].main) delete s.men[k]; });
  who.forEach((w, i) => { const k = w.main ? 'YOU' : (w.name && window.BohemiaCondition) ? BohemiaCondition.canon(w.name) : 'GATE' + i;   /* his own record when he has a name */
    s.men[k] = { shown: w.main ? 'YOU' : k, look: w.look || null, main: !!w.main, hpMax: 60, lostHp: 60 * (1 - w.hp), armHMax: 20, lostH: 20 * (1 - w.arm), armBMax: 80, lostB: 80 * (1 - w.arm), head: null, body: null, fights: 1, day: 1 }; });
  localStorage.setItem(KEY, JSON.stringify(s));
  try { window.dispatchEvent(new CustomEvent('bohemia:condition')); } catch (e) {}   /* what the condition says on every write of its own */
};
const near = (a, b) => Math.abs(a - b) <= 1;
/* in the town's or the camp's frame: what its last picture drew and, in the same frame, what each man is now (the camp heals an hour
   every half second, so the men are read the moment the picture is, never against the numbers seeded a second before) */
const READ = async (want) => {
  const t0 = Date.now();   /* a picture drawn after the seed (the camp may still be growing in, its frame not drawing yet) */
  for (let i = 0; i < 90; i++) { await new Promise(r => requestAnimationFrame(r)); if (window.__HEADBARS && __HEADBARS.at >= t0 && i >= 1) break; }
  const drew = ((window.__HEADBARS && __HEADBARS.drew) || []).slice();
  return { drew, now: want.map(w => { const b = BohemiaCondition.bars(w.main ? { main: true } : { name: w.name || '', look: w.look });
    return { who: w.who, show: !!(b && b.show), hp: b ? b.hpF : 1, arm: b ? b.armF : 1 }; }) };
};
/* what was drawn, against what each man is: shown for the two under 87, the fill his number over his maximum */
const judge = (drew, want, w) => {
  const bad = [];
  want.forEach(x => { const d = drew.find(e => e.who === x.who);
    if (x.show && !d) bad.push(x.who + ' has no bars');
    if (!x.show && d) bad.push(x.who + ' has bars at ' + Math.round(x.hp * 100) + '/' + Math.round(x.arm * 100));
    if (x.show && d && (!near(d.hpFill, d.w * x.hp) || !near(d.armFill, d.w * x.arm))) bad.push(x.who + ' fills ' + d.hpFill + '/' + d.armFill + ' of ' + d.w + ' for ' + x.hp + '/' + x.arm); });
  return bad;
};

async function run(profile) {
  console.log('--- ' + profile + ' ---');
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, profile }); }
  catch (e) { ok(profile + ': the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  const P = profile + ': ';
  try {
    await d.page.waitForTimeout(2500);
    /* ---- B1 the map (no town over it: the game may open on one) ---- */
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} });
    const looks = await d.fr.evaluate(async () => { for (let i = 0; i < 40; i++) { const L = mapCrewLooks(); if (MAP_CREW_LOOKS.ready && L.length >= 2) return L.slice(0, 2); await new Promise(r => setTimeout(r, 250)); } return mapCrewLooks().slice(0, 2); });
    if (looks.length < 2) { ok(P + 'B1 his two men walk with him on the map', false, JSON.stringify(looks)); return; }
    const W1 = [{ main: true, who: 'YOU', hp: 0.4, arm: 1 }, { look: looks[0], who: looks[0], hp: 1, arm: 0.6 }, { look: looks[1], who: looks[1], hp: 0.95, arm: 0.95 }];
    await d.fr.evaluate(SEED, W1);
    await d.page.waitForTimeout(1500);
    const m1 = await d.fr.evaluate(() => (window.__MAP_BARS && __MAP_BARS.drew) || []);
    if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'bars_map_' + profile + '.png') });
    const b1 = judge(m1, W1.map(x => Object.assign({ show: x.hp < 0.87 || x.arm < 0.87 }, x)));
    ok(P + 'B1 *** THE MAP *** bars over YOU (40% hit points) and the man with his armour at 60%, none over the man at 95% of both; each fill his number over his maximum within a pixel',
      b1.length === 0 && m1.length === 2, b1.join('; ') || m1.map(e => e.who + ' ' + e.hpFill + '/' + e.armFill + ' of ' + e.w).join(', '));
    /* ---- B2 at 87 they go ---- */
    await d.fr.evaluate((L) => { const s = JSON.parse(localStorage.getItem('bohemia.condition.v1')); for (const k in s.men) if (s.men[k].look === L) s.men[k].lostHp = s.men[k].hpMax * 0.14; localStorage.setItem('bohemia.condition.v1', JSON.stringify(s)); window.dispatchEvent(new CustomEvent('bohemia:condition')); }, looks[1]);
    await d.page.waitForTimeout(1200);
    const at86 = await d.fr.evaluate((L) => ((window.__MAP_BARS && __MAP_BARS.drew) || []).some(e => e.who === L), looks[1]);
    await d.fr.evaluate((L) => { const s = JSON.parse(localStorage.getItem('bohemia.condition.v1')); for (const k in s.men) if (s.men[k].look === L) s.men[k].lostHp = s.men[k].hpMax * 0.13; localStorage.setItem('bohemia.condition.v1', JSON.stringify(s)); window.dispatchEvent(new CustomEvent('bohemia:condition')); }, looks[1]);
    await d.page.waitForTimeout(1200);
    const at87 = await d.fr.evaluate((L) => ((window.__MAP_BARS && __MAP_BARS.drew) || []).some(e => e.who === L), looks[1]);
    ok(P + 'B2 AT 87 THEY GO: the third man at 86% carries his bars, at 87% nothing', at86 && !at87, '86%: ' + at86 + ', 87%: ' + at87);
    /* ---- B3 a town ---- */
    const town = await d.fr.evaluate(() => { const bs = ctBases(), names = Object.keys(bs); const n = names.find(k => mapTierOf(k) === 'town') || names[0]; return { name: n }; });
    await d.fr.evaluate((n) => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, town.name);
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await d.page.waitForTimeout(400);
      for (const x of d.page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp && BohemiaSettlement.crewTown().length > 0; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) { ok(P + 'B3 a town with his men through the map\'s door', false, town.name); }
    else {
      const men = await sf.evaluate(() => BohemiaSettlement.crewTown().map(m => ({ name: m.name, look: m.look })));
      const m1 = men[1] || men[0];
      const W3 = [{ look: men[0].look, name: men[0].name, who: men[0].name || men[0].look, hp: 0.4, arm: 1 }, { look: m1.look, name: m1.name, who: m1.name || m1.look, hp: 1, arm: 0.6 }, { main: true, who: 'YOU', hp: 0.95, arm: 0.95 }];
      await sf.evaluate(SEED, W3);
      const r3 = await sf.evaluate(READ, W3), t3 = r3.drew;
      const b3 = men.length < 2 ? ['the town has ' + men.length + ' of his men'] : r3.now.map(x => x.show).join() !== 'true,true,false' ? ['healed past the line before the picture was read: ' + JSON.stringify(r3.now)] : judge(t3, r3.now);
      if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'bars_town_' + profile + '.png') });
      ok(P + 'B3 *** IN A TOWN *** (' + town.name + '): bars over his man at 40% hit points and his man with armour at 60%, none over YOU at 95%; the fill within a pixel',
        b3.length === 0, b3.join('; ') || t3.map(e => e.who + ' ' + e.hpFill + '/' + e.armFill + ' of ' + e.w).join(', '));
      await sf.evaluate(() => { try { const c = document.getElementById('leave') || document.getElementById('close'); if (c) c.click(); } catch (e) {} });
    }
    /* ---- B4 at camp ---- */
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} });
    await d.page.waitForTimeout(800);
    await d.fr.evaluate(() => { try { BohemiaMapCamp.make(); } catch (e) {} });
    let cf = null; for (let k = 0; k < 50 && !cf; k++) { await d.page.waitForTimeout(300);
      for (const x of d.page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) { cf = x; break; } }
    if (!cf) ok(P + 'B4 the camp opens', false);
    else {
      const campMen = await cf.evaluate(() => BohemiaSettlement.folk().filter(p => p.campMan).map(p => ({ name: p.name, look: p.look })));
      const W4 = campMen.slice(0, 2).map((m, i) => ({ look: m.look, name: m.name, who: m.name || m.look, hp: [0.2, 1][i], arm: [1, 0.3][i] })).concat([{ main: true, who: 'YOU', hp: 0.95, arm: 0.95 }]);
      await cf.evaluate(SEED, W4);
      const r4 = await cf.evaluate(READ, W4), t4 = r4.drew;
      const b4 = campMen.length < 2 ? ['the camp has ' + campMen.length + ' men'] : r4.now.map(x => x.show).join() !== 'true,true,false' ? ['healed past the line before the picture was read: ' + JSON.stringify(r4.now)] : judge(t4, r4.now);
      if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'bars_camp_' + profile + '.png') });
      ok(P + 'B4 *** AT CAMP ***: bars over his man struck to 20% hit points and his man with armour at 30% (the camp healing them as it is read), none over YOU at 95%; the fill his number that moment within a pixel',
        b4.length === 0, b4.join('; ') || t4.map(e => e.who + ' ' + e.hpFill + '/' + e.armFill + ' of ' + e.w).join(', '));
      await d.fr.evaluate(() => { try { BohemiaMapCamp.break(); } catch (e) {} });
    }
    /* ---- B6 the map draws once ---- */
    const b6 = await d.fr.evaluate(async () => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} await new Promise(r => setTimeout(r, 400));
      const fire = () => window.dispatchEvent(new CustomEvent('bohemia:condition'));
      const d0 = ONE_RENDER.drawn, r0 = window.__MAP_BARS_REPAINTS | 0;
      for (let i = 0; i < 10; i++) fire();   /* ten heals in one beat */
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const idle = { draws: ONE_RENDER.drawn - d0, repaints: (window.__MAP_BARS_REPAINTS | 0) - r0 };
      /* the map drawing anyway (a draw in the same frame as the ask): the heal adds none */
      const r1 = window.__MAP_BARS_REPAINTS | 0; fire(); render();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const busy = (window.__MAP_BARS_REPAINTS | 0) - r1;
      /* a town over the map: none */
      const f = loopFrame(); const was = f.style.display; f.style.display = 'block'; const r2 = window.__MAP_BARS_REPAINTS | 0, d2 = ONE_RENDER.drawn; fire();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const under = { repaints: (window.__MAP_BARS_REPAINTS | 0) - r2, draws: ONE_RENDER.drawn - d2 }; f.style.display = was;
      return { idle, busy, under }; });
    ok(P + 'B6 THE MAP DRAWS ONCE: ten heals in a beat on the map ask for one draw at most; a heal while the map draws anyway asks for none; under a town none',
      /* the bars' own repaints are counted (__MAP_BARS_REPAINTS); the map's other animations may draw in the same frames, and then the
         bars ride on their draw and ask for none */
      b6.idle.repaints <= 1 && b6.idle.draws >= 1 && b6.idle.draws <= 2 && b6.busy === 0 && b6.under.repaints === 0, JSON.stringify(b6));
    ok(P + 'B5 nothing threw', d.errs.length === 0, d.errs.length ? String(d.errs[0]).slice(0, 160) : 'no errors');
  } catch (e) {
    ok(P + 'the gate ran without throwing [' + String(e.stack || e.message).slice(0, 300) + ']', false);
  } finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'computer'];
  for (const p of profiles) await run(p);
  console.log('=== THE BARS OVER THEIR HEADS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
