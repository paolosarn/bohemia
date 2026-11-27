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
    /* CAMP FOUR 11/27: on a new game the shell holds the map's people sheets until it says FIRST PLAY (PLUMBER 6 __FIRST_PLAY_IS_LIGHT__:
       the town he starts in up a second and a half, the map two and a half seconds after BEGIN, or 45 s after it); closing the start
       town before its picture was in left the hold on, and his two men were never drawn. Wait for it, as he would by playing. */
    for (let i = 0; i < 120; i++) { if (!(await d.page.evaluate(() => { try { return !!(window.bohemiaFirstPlayHeld && bohemiaFirstPlayHeld()); } catch (e) { return false; } }))) break; await d.page.waitForTimeout(500); }
    await d.fr.evaluate(SEED, W1);
    await d.page.waitForTimeout(1500);
    /* CAMP FOUR 11/27: his two men are drawn once their sheets are in (rigMixLook loads them the first time they are drawn); on a box at
       a load of 14 the first read came before them. Wait for both drawn beside him (up to 20 s), and say what the map held if not. */
    let crewSeen = null;
    for (let i = 0; i < 40; i++) {
      crewSeen = await d.fr.evaluate(() => ({ men: [0, 1].map(k => { try { return !!mapCompanyMan(k); } catch (e) { return false; } }), company: (window.MAP_DREW && MAP_DREW.company) | 0,
        bars: ((window.__MAP_BARS && __MAP_BARS.drew) || []).map(e => e.who), bare: !!window.__MAP_BARE, at: [city.x | 0, city.y | 0],
        mix: (window.RIG_MIX || {}).state, sheets: Object.keys((window.RIG_MIX && RIG_MIX.sheets) || {}).map(k => k + ':' + RIG_MIX.sheets[k].state), looks: mapCrewLooks().slice(0, 2), drawn: (window.ONE_RENDER || {}).drawn, cast: !!window.__RIG_CAST_OFF, asOne: !!(MAP_PARTY_AS_ONE && MAP_PARTY_AS_ONE.on), held: !!(window.MAP_SHEETS_HELD && MAP_SHEETS_HELD.on), first: (function () { try { return mapHeldForFirstPlay(); } catch (e) { return 'x'; } })() }));
      if (crewSeen.men[0] && crewSeen.men[1] && crewSeen.bars.length >= 2) break;
      await d.fr.evaluate(() => { try { window.dispatchEvent(new CustomEvent('bohemia:condition')); } catch (e) {} });   /* a heal's own word: one draw */
      await d.page.waitForTimeout(500);
    }
    const m1 = await d.fr.evaluate(() => (window.__MAP_BARS && __MAP_BARS.drew) || []);
    if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'bars_map_' + profile + '.png') });
    const b1 = judge(m1, W1.map(x => Object.assign({ show: x.hp < 0.87 || x.arm < 0.87 }, x)));
    ok(P + 'B1 *** THE MAP *** bars over YOU (40% hit points) and the man with his armour at 60%, none over the man at 95% of both; each fill his number over his maximum within a pixel',
      b1.length === 0 && m1.length === 2, (b1.join('; ') || m1.map(e => e.who + ' ' + e.hpFill + '/' + e.armFill + ' of ' + e.w).join(', ')) + (b1.length ? '; the map held ' + JSON.stringify(crewSeen) : ''));
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
    /* one step off the tile the town's LEAVE put him on: there HEAL is the town's own rest (rule 273(d)), here it is the camp */
    await d.fr.evaluate(() => { for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (cityWalkable(city.x + dx, city.y + dy)) { city.x += dx; city.y += dy; break; } try { TOWN_EXIT = null; } catch (e) {} try { BohemiaMapCamp.make(); } catch (e) {} });
    let cf = null; for (let k = 0; k < 50 && !cf; k++) { await d.page.waitForTimeout(300);
      for (const x of d.page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) { cf = x; break; } }
    if (!cf) ok(P + 'B4 the camp opens', false);
    else {
      /* RE-AIMED 11/27 (CAMP FOUR): since rules 406(b) and 442(a) the camp is drawn by its look on the fight's own board
         (slices/bohemia_camp_look.js), not by the settlement's folk, so the leg read 'the camp has 0 men'. Its men are the look's acts and
         its bars the look's own (state().bars.at, keyed by name, YOU by 'YOU'); the fill eases in and shines as an hour mends him
         (11/26, THE CAMP READS AT A GLANCE holds the rise), so what is read is the number the fill eases to (tb/ta) against the man's
         own number in the condition read in the camp's frame the same moment, within an hour's mending (the look reads it five times a
         second, the camp heals an hour every half second). The line is his: under 87 percent the bars, over it none (barOf, 11/27). */
      const LOOKB = () => { try { const L = BohemiaCampLook.state(); return { open: L.open, pitch: L.pitch ? L.pitch.on : null, acts: L.acts || [], bars: L.bars || { at: {} } }; } catch (e) { return null; } };
      let lb = null; for (let k = 0; k < 60; k++) { lb = await cf.evaluate(LOOKB).catch(() => null); if (lb && lb.open && lb.acts.filter(a => a.name !== 'YOU').length >= 2) break; await d.page.waitForTimeout(300); }
      const campMen = lb ? lb.acts.filter(a => a.name && a.name !== 'YOU').map(a => ({ name: a.name, look: a.look })) : [];
      const W4 = campMen.slice(0, 2).map((m, i) => ({ look: m.look, name: m.name, who: m.name || m.look, hp: [0.2, 1][i], arm: [1, 0.3][i] })).concat([{ main: true, who: 'YOU', hp: 0.95, arm: 0.95 }]);
      await cf.evaluate(SEED, W4);
      let r4 = null; for (let k = 0; k < 20; k++) { await d.page.waitForTimeout(250);
        r4 = await cf.evaluate((want) => { const L = BohemiaCampLook.state(), at = (L.bars && L.bars.at) || {};
          return { at, shown: (L.bars && L.bars.shown) | 0, now: want.map(w => { const b = BohemiaCondition.bars(w.main ? { main: true } : { name: w.name || '', look: w.look });
            const act = (L.acts || []).find(a => a.name === w.who) || null;
            return { who: w.who, show: !!(b && b.show), hp: b ? b.hpF : 1, arm: b ? b.armF : 1, actB: act ? act.blood : null, actA: act ? act.armour : null }; }) }; }, W4).catch(() => null);
        if (r4 && r4.now.every(x => !x.show || r4.at[x.who])) break; }
      const b4 = [], HOUR4 = 10 / 60 + 0.01;   /* an hour's mending (10 of his 60 seeded; the look reads the condition five times a second, the camp heals an hour a half second) */
      if (campMen.length < 2) b4.push('the camp has ' + campMen.length + ' men');
      else if (!r4) b4.push('the camp could not be read');
      else if (r4.now.map(x => x.show).join() !== 'true,true,false') b4.push('healed past the line before the picture was read: ' + JSON.stringify(r4.now));
      else r4.now.forEach(x => { const d4 = r4.at[x.who];
        if (x.show && !d4) b4.push(x.who + ' has no bars');
        if (!x.show && d4) b4.push(x.who + ' has bars at ' + Math.round(x.hp * 100) + '/' + Math.round(x.arm * 100));
        if (x.show && d4 && (Math.abs(d4.tb - x.hp) > HOUR4 || Math.abs(d4.ta - x.arm) > HOUR4)) b4.push(x.who + ' fills to ' + d4.tb + '/' + d4.ta + ' for ' + x.hp.toFixed(3) + '/' + x.arm.toFixed(3)); });
      if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'bars_camp_' + profile + '.png') });
      ok(P + 'B4 *** AT CAMP ***: bars over his man struck to 20% hit points and his man with armour at 30% (the camp healing them as it is read), none over YOU at 95%; each fill eases to his number now, within an hour\'s mending',
        b4.length === 0, b4.join('; ') || Object.keys((r4 && r4.at) || {}).map(k => k + ' ' + r4.at[k].tb + '/' + r4.at[k].ta + ' (drawn ' + r4.at[k].b + '/' + r4.at[k].a + ')').join(', ') + '; ' + JSON.stringify(r4 && r4.now.map(x => [x.who, x.show, +x.hp.toFixed(2), +x.arm.toFixed(2)])));
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
