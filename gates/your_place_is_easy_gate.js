#!/usr/bin/env node
/* ==========================================================================
   YOUR PLACE IS EASY  (HOME BASE 6, 11/27/26, VAMILY rule 492(a)(c), plan C and B of
   records/BOHEMIA_HOME_BASE_YOUR_PLACE_WALKED_AS_A_STRANGER_11_27_26.md)

   PAOLO 11/27: 'the settlement stuff on my phone was so freaking confusing... I thought it'd be more intuitive and easy to
   navigate'; then 'build the easy shit man'. MEASURED BEFORE: the whole flow on the in-game phone's 100 px page, 8 px letters,
   18 px buttons, and nothing said the next step (twelve unclear moments in the stranger's walk).

   ENGINE (engine/bohemia_home.js step and bestMan, records/target/bb/home_base.json flow; pure):
     E1  every moment has its one step: day 1 nothing, day 2 the offer, LATER a YOUR PLACE button, good ground PLANT HERE, bad ground
         why and WALK THERE, walking, there, 'Are you sure? This is permanent.', planted GO IN, inside 'tap an empty lot', the first
         build said once, then nothing
     E2  every step with buttons has exactly one gold button (the one next thing); every line short enough to read at a glance (40
         letters at most) and drafted (flow.draft)
     E3  his best man says it: the highest level, then the most experience, never him, never the dead
     P1  PLANTED: a line of 60 letters and a step with two gold buttons read red on E2's own test
   ON THE DEMO, a phone upright and sideways, a new game, A STRANGER'S WHOLE WALK BY REAL TAPS on the glass (rule 492(c)):
     Y1  day 1 where he wakes and on the map: nothing of his place on the glass (never in the first minute)
     Y2  day 2 on the map: his best man's face (drawn), his name, the line in 20 px letters, LOOK FOR GROUND and LATER, every button
         44 px or more, under the finger, inside the glass, clear of the phone
     Y3  LATER leaves one YOUR PLACE button (44 px and up); a tap on it looks at the ground again
     Y4  bad ground: the reason and the way ('This is the road. Go north-west.'), the four marks, WALK THERE; a tap walks him there
         ('Walking. I'll say when.'), and where he stops: 'This is it. Plant it.' with PLANT HERE
     Y5  PLANT HERE asks 'Are you sure? This is permanent.'; PLANT HERE again plants the block; 'Ours now. Go in and build.' GO IN
     Y6  GO IN opens his place by the map's own door; 'Tap an empty lot to build.' on the glass, never over the empty lot it means
     Y7  a tap on that lot opens BUILD's desk and the glass steps aside; a build bought, the desk closed: 'It goes up tonight.', once,
         then the glass is quiet for good
     Y8  ONE FACE AT A TIME: while the map's own voice speaks, the panel is not on the glass
     PLANTED: a button shrunk to 30 px reads red on Y2's thumb test; the panel moved over the phone reads red on Y2's clear test
   About 3 minutes a way; --engine a second.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && !g ? '  [' + String(x).slice(0, 700) + ']' : '')); };
const done = () => { console.log('YOUR PLACE IS EASY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };

/* ---------------- ENGINE ---------------- */
const H = require(path.join(ROOT, 'engine/bohemia_home.js'));
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/home_base.json'), 'utf8'));
H.setData(DATA);
console.log('ENGINE');
const G = (ok_, why) => ({ ok: ok_, why: why || null, water: 2, power: 1, road: 3, danger: 1 });
const CASES = [
  ['day 1, or in a town', { offer: false }, 'quiet', []],
  ['day 2 on the map', { offer: true }, 'offer', ['look', 'later']],
  ['LATER', { offer: true, later: true }, 'pill', ['pill']],
  ['good ground', { offer: true, open: true, here: { g: G(true) } }, 'good', ['plant', 'close']],
  ['bad ground, better near', { offer: true, open: true, here: { g: G(false, 'on_road') }, better: { dir: 'NORTH-WEST' } }, 'bad', ['walk', 'close']],
  ['nothing near', { offer: true, open: true, here: { g: G(false, 'water') } }, 'none', ['close']],
  ['walking', { offer: true, open: true, going: true, travelling: true }, 'going', []],
  ['there', { offer: true, open: true, going: true, here: { g: G(true) }, target: [5, 5], at: [5, 6] }, 'arrived', ['plant', 'close']],
  ['are you sure', { offer: true, asked: true, here: { g: G(true) } }, 'sure', ['plant', 'no']],
  ['planted, on the map', { planted: true, onMap: true, booked: 0 }, 'planted', ['in']],
  ['inside his place', { planted: true, inside: true, booked: 0 }, 'inside', []],
  ['inside, a sheet open', { planted: true, inside: true, sheet: true, booked: 0 }, 'quiet', []],
  ['the first build', { planted: true, inside: true, booked: 1, built: true }, 'built', []],
  ['after', { planted: true, inside: true, booked: 1 }, 'quiet', []],
  ['planted, in a fight', { planted: true, onMap: false, booked: 0 }, 'quiet', []]
];
const steps = CASES.map(c => [c, H.step(c[1])]);
ok('E1 every moment has its one step: ' + steps.map(x => x[1].id).join(' > '), steps.every(x => x[1].id === x[0][2] && x[1].buttons.map(b => b.id).join() === x[0][3].join()),
   JSON.stringify(steps.filter(x => x[1].id !== x[0][2] || x[1].buttons.map(b => b.id).join() !== x[0][3].join()).map(x => [x[0][0], x[1]])));
const bad = steps.filter(x => x[0][2] === 'bad')[0][1];
ok('E1 bad ground says why and which way: "' + bad.line + '"', /^This is the road\. Go north-west\.$/.test(bad.line), bad.line);
ok('E1 the sure line is his own words: "' + steps.filter(x => x[0][2] === 'sure')[0][1].line + '"', steps.filter(x => x[0][2] === 'sure')[0][1].line === 'Are you sure? This is permanent.');
const glance = (st) => st.filter(x => x.buttons.length).every(x => x.buttons.filter(b => b.gold).length === 1) && st.every(x => x.line.length <= 40);
const all = steps.map(x => x[1]);
ok('E2 one gold button a step (the one next thing), every line 40 letters or fewer (longest ' + Math.max.apply(null, all.map(x => x.line.length)) + '), the words drafted', glance(all) && DATA.flow.draft === true && DATA.words.page_none,
   JSON.stringify(all.map(x => [x.id, x.line.length, x.buttons.filter(b => b.gold).length])));
const men = [{ name: 'YOU', look: 'a', main: true, level: 9 }, { name: 'DESI', look: 'b', level: 2, xp: 10 }, { name: 'RAY', look: 'c', level: 2, xp: 30 }, { name: 'OLD', look: 'd', level: 5, dead: true }, { name: 'NOFACE', level: 7 }];
const bm = H.bestMan(men);
ok('E3 his best man says it (' + (bm && bm.name) + '): the highest level, then experience, never him, never the dead, never a man with no face', !!bm && bm.name === 'RAY' && !H.bestMan([men[0], men[3]]));
/* planted: E2's own test on a long line and two gold buttons */
const P1 = all.map(x => Object.assign({}, x)); P1[1] = Object.assign({}, P1[1], { line: 'x'.repeat(60) });
const P2 = all.map(x => Object.assign({}, x)); P2[3] = Object.assign({}, P2[3], { buttons: P2[3].buttons.map(b => Object.assign({}, b, { gold: true })) });
ok('P1 planted: a 60-letter line and a step with two gold buttons each read red on E2\'s test', !glance(P1) && !glance(P2));
if (process.argv.includes('--engine')) done();

/* ---------------- ON THE DEMO ---------------- */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const GL = require(path.join(ROOT, 'tools/bohemia_your_place_glass.js'));
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
/* the panel and every button against the thumb, the glass and the phone (the phone's own rect, in the map's frame) */
async function laid(P, F) {
  const p = await GL.panel(F); if (!p) return null;
  const bs = []; for (const id of p.buttons) bs.push(Object.assign({ id }, await GL.button(P, F, id)));
  const geo = await F.evaluate(() => { const d = document.getElementById('yourplace'), q = d.getBoundingClientRect(), r = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null;
    const over = r && r.width > 0 && !(q.right <= r.left || q.left >= r.right || q.bottom <= r.top || q.top >= r.bottom);
    return { box: [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)], phone: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null, overPhone: !!over,
      inGlass: q.left >= 0 && q.top >= 0 && q.right <= innerWidth && q.bottom <= innerHeight }; });
  return Object.assign(p, { bs, geo, thumbs: bs.length > 0 && bs.every(b => b.h >= 44 && b.w >= 44 && b.hit && b.in) });
}
(async () => {
  for (const prof of PROFS) {
    console.log('ON THE DEMO, ' + prof);
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    for (let i = 0; i < 60; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaYourPlace && window.__YOUR_PLACE)).catch(() => false)) break; await P.waitForTimeout(250); }
    const y1 = await GL.state(F);
    await F.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(1500);
    const y1m = await GL.state(F);
    ok('Y1 day 1 where he wakes (' + (y1 && y1.step) + ') and on the map (' + (y1m && y1m.step) + '): nothing of his place on the glass', !!y1 && !!y1m && y1.step === 'quiet' && !y1.shown && y1m.step === 'quiet' && !y1m.shown, JSON.stringify([y1, y1m]));
    /* a block he can stand on where nothing can be planted, with better ground nearest (the walk there short) */
    const spot = await F.evaluate(() => { const x0 = city.x, y0 = city.y, c = [];
      for (let r = 0; r < 16 && c.length < 30; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && !ch.g.ok) c.push([x, y]); }
      let best = null; c.forEach(p => { city.x = p[0]; city.y = p[1]; const b = BohemiaHomeMap.state().better; if (b && (!best || b.d < best.d)) best = { at: p, d: b.d, to: [b.x, b.y] }; });
      if (best) { city.x = best.at[0]; city.y = best.at[1]; } else { city.x = x0; city.y = y0; } try { render(); } catch (e) {} return best; });
    await F.evaluate(() => { DAY.day = 2; try { render(); } catch (e) {} }); await P.waitForTimeout(1000);
    const y2 = await GL.until(F, 'offer', 40000), l2 = await laid(P, F), men2 = await F.evaluate(() => { let m = JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]');   /* the company's own record, else the crew the game started with (CREW_DEFS, the first man is him) */
      if (!m.length) { const D = window.CREW_DEFS; m = (D.men || []).map((x, i) => ({ name: x.name, look: (D.looks || [])[i], level: x.level, xp: x.xp, main: i === 0 })); }
      const b = BohemiaHome.bestMan(m.filter(x => x && BohemiaCrewFaces.has(x.look))); return b ? String(b.name).toUpperCase() : null; });
    ok('Y2 day 2 on the map: ' + (l2 && l2.who) + ' (his best man, ' + men2 + ') says "' + (l2 && l2.line) + '" at ' + (l2 && l2.font) + ' px, his face drawn (' + (l2 && l2.face) + ' px of it)',
       !!y2 && !y2.timedOut && !!l2 && !!men2 && l2.who === men2 && l2.face > 200 && l2.font >= 20 && l2.line === y2.line, JSON.stringify([y2, l2 && { who: l2.who, face: l2.face, font: l2.font, line: l2.line }, men2]));
    ok('Y2 LOOK FOR GROUND (gold) and LATER: ' + (l2 ? l2.bs.map(b => b.id + ' ' + b.w + 'x' + b.h + (b.hit ? '' : ' MISSED')).join(', ') : '-') + '; the panel in the glass and clear of the phone (' + (l2 && l2.geo.box) + ' / ' + (l2 && l2.geo.phone) + ')',
       !!l2 && l2.thumbs && l2.bs.map(b => b.id).join() === 'look,later' && l2.bs[0].gold && l2.geo.inGlass && !l2.geo.overPhone, JSON.stringify(l2 && [l2.bs, l2.geo]));
    /* PLANTED: the same tests on a button shrunk to 30 px, and the panel put over the phone */
    const pl = await F.evaluate(() => { const b = document.querySelector('#yourplace button[data-yp="later"]'), d = document.getElementById('yourplace'); const keep = [b.style.cssText, d.style.cssText];
      b.style.minHeight = '30px'; b.style.height = '30px'; b.style.padding = '0'; const r = window.BOH_PHONE_RECT(); d.style.left = Math.round(r.left) + 'px'; d.style.right = ''; window.__YP_KEEP = keep; return true; });
    const lp = await laid(P, F);
    await F.evaluate(() => { const b = document.querySelector('#yourplace button[data-yp="later"]'), d = document.getElementById('yourplace'); if (b) b.style.cssText = window.__YP_KEEP[0]; d.style.cssText = window.__YP_KEEP[1]; window.BohemiaYourPlace.press && 0; });
    ok('P2 planted: LATER shrunk to 30 px reads red on the thumb test (' + (lp && lp.bs.map(b => b.id + ' ' + b.h).join(', ')) + '); the panel over the phone reads red on the clear test', pl && !!lp && !lp.thumbs && lp.geo.overPhone, JSON.stringify(lp && [lp.bs, lp.geo]));
    await P.waitForTimeout(400);
    /* Y8 one face at a time: while the offer is on the glass the map's own voice speaks; the panel is never on with it, and comes back after */
    const y8 = await F.evaluate(async () => { const T = window.BohemiaMaterials && BohemiaMaterials.ten; if (!T || !T.say) return { none: true };
      window.HUNT_T0 = Math.min(window.HUNT_T0 || performance.now(), performance.now() - 120000);   /* past the voice's own first sixty seconds */
      const D = window.CREW_DEFS, who = { name: String(D.men[1].name), look: D.looks[1] }; T.say({ id: 'yp-gate-' + Date.now(), line: 'The gate speaks over the glass.', who, prio: 0, ttl: 30 });
      const both = []; let voice = 0, panel = 0; for (let i = 0; i < 60; i++) { await new Promise(r => setTimeout(r, 150)); const v = document.getElementById('bmvoice'), vo = !!(v && v.classList.contains('on'));
        const yp = document.getElementById('yourplace'), po = !!(yp && yp.classList.contains('on')); if (vo) voice++; if (po) panel++; if (vo && po) both.push(i); }
      return { voice, panel, both: both.length, step: window.__YOUR_PLACE.step }; });
    const y8b = await GL.until(F, 'offer', 30000);
    ok('Y8 one face at a time: the map\'s voice on the glass ' + y8.voice + ' samples, the panel on with it ' + y8.both + '; the offer back after it (' + (y8b && y8b.shown) + ')', !y8.none && y8.voice > 0 && y8.both === 0 && !!y8b && !y8b.timedOut, JSON.stringify([y8, y8b]));
    /* Y3 LATER, then YOUR PLACE */
    await GL.tap(P, F, 'later');
    const y3 = await GL.until(F, 'pill', 15000), l3 = await laid(P, F);
    ok('Y3 LATER leaves one YOUR PLACE button (' + (l3 && l3.bs.map(b => b.label + ' ' + b.w + 'x' + b.h).join()) + '), under the finger', !!y3 && !y3.timedOut && !!l3 && l3.pill && l3.thumbs && l3.bs.length === 1 && l3.bs[0].id === 'pill', JSON.stringify([y3, l3 && l3.bs]));
    await GL.tap(P, F, 'pill', 1100);
    /* Y4 bad ground: why, which way, WALK THERE; walking; there */
    const y4 = await GL.until(F, ['bad', 'none', 'good'], 20000), l4 = await laid(P, F);
    ok('Y4 on ground that cannot be planted (' + (spot && spot.at) + '): "' + (l4 && l4.line) + '", the four marks (' + (l4 && l4.marks.map(m => m.k + ' ' + m.n).join(', ')) + '), WALK THERE gold under the finger',
       !!spot && !!y4 && y4.step === 'bad' && !!l4 && l4.thumbs && l4.marks.length === 4 && l4.bs[0].id === 'walk' && l4.bs[0].gold && / Go (north|south|east|west)/.test(l4.line), JSON.stringify([spot, y4, l4 && [l4.line, l4.bs]]));
    await GL.tap(P, F, 'walk', 600);
    const y4g = await GL.until(F, ['going', 'arrived'], 15000);
    let y4a = null;
    for (let i = 0; i < 120; i++) { await P.waitForTimeout(500);
      await F.evaluate(() => { try { if (window.BohemiaRoadEvents && BohemiaRoadEvents.up()) BohemiaRoadEvents.close(); } catch (e) {} });   /* a card on the road is another gate's: answered away */
      const s = await GL.state(F); if (s && s.step === 'arrived' && s.shown) { y4a = s; break; } }
    const at4 = await F.evaluate(() => [city.x, city.y]), l4a = await laid(P, F);
    ok('Y4 WALK THERE walks him (' + (y4g && y4g.step) + ': "' + (y4g && y4g.line) + '"), and where he stops ' + at4 + ' (the way pointed ' + (spot && spot.to) + '): "' + (y4a && y4a.line) + '" with PLANT HERE gold',
       !!y4g && (y4g.step === 'going' || y4g.step === 'arrived') && !!y4a && y4a.line === H.step({ offer: true, going: true, here: { g: G(true) }, target: [0, 0], at: [0, 0] }).line && !!l4a && l4a.thumbs && l4a.bs[0].id === 'plant' && l4a.bs[0].gold,
       JSON.stringify([y4g, y4a, at4, l4a && l4a.bs]));
    /* Y5 PLANT HERE, are you sure, PLANT HERE */
    await GL.tap(P, F, 'plant', 800);
    const y5 = await GL.until(F, 'sure', 15000), l5 = await laid(P, F);
    ok('Y5 PLANT HERE asks "' + (y5 && y5.line) + '" with PLANT HERE and NOT YET (' + (l5 && l5.bs.map(b => b.w + 'x' + b.h).join(', ')) + ')', !!y5 && y5.line === 'Are you sure? This is permanent.' && !!l5 && l5.thumbs && l5.bs.map(b => b.id).join() === 'plant,no', JSON.stringify([y5, l5 && l5.bs]));
    await GL.tap(P, F, 'plant', 1800);
    const pl5 = await F.evaluate(() => BohemiaHomeMap.state().planted), y5p = await GL.until(F, 'planted', 20000), l5p = await laid(P, F);
    ok('Y5 planted (' + pl5 + '): "' + (y5p && y5p.line) + '" and GO IN, gold, under the finger', pl5 && !!y5p && y5p.step === 'planted' && !!l5p && l5p.thumbs && l5p.bs.map(b => b.id).join() === 'in' && l5p.bs[0].gold, JSON.stringify([y5p, l5p && l5p.bs]));
    /* Y6 GO IN by the map's own door */
    await GL.tap(P, F, 'in', 1200);
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
    const y6 = await GL.until(F, 'inside', 30000), l6 = await laid(P, F);
    const lot = fr ? await fr.evaluate(() => { const w = BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; }) : null;
    const arrive6 = fr ? await fr.evaluate(() => { const a = document.getElementById('arrive'); return !!(a && a.classList.contains('on')); }) : null;   /* the line came after the place's arrival card */
    const sfb = fr ? await (await fr.frameElement()).boundingBox() : null, mfb = await (await F.frameElement()).boundingBox();
    const lotOnGlass = lot && sfb ? [sfb.x + lot[0] - mfb.x, sfb.y + lot[1] - mfb.y] : null, gb = l6 && l6.geo.box;
    const overLot = !!(lotOnGlass && gb && lotOnGlass[0] >= gb[0] && lotOnGlass[0] <= gb[0] + gb[2] && lotOnGlass[1] >= gb[1] && lotOnGlass[1] <= gb[1] + gb[3]);
    ok('Y6 GO IN opened his place (' + !!fr + '); once its arrival card is gone (' + !arrive6 + ') the glass says "' + (y6 && y6.line) + '", not over the empty lot it means (' + (lotOnGlass && lotOnGlass.map(Math.round)) + ' against ' + gb + ')', !!fr && !!y6 && y6.step === 'inside' && arrive6 === false && !!lot && !overLot, JSON.stringify([y6, lot, gb, arrive6]));
    /* Y7 the lot, the desk, a build, the sheet closed: said once, then quiet */
    let y7 = null, y7b = null, y7q = null, bought = null;
    if (fr && lot) {
      /* his place's camera can be pushing in on patrol as the finger lands: a player taps the lot again; three tries, the lot read each time */
      for (let i = 0; i < 3; i++) { const w = await fr.evaluate(() => { const w = BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; }); if (!w) break;
        await P.touchscreen.tap(sfb.x + w[0], sfb.y + w[1]); await P.waitForTimeout(1500); if (await fr.evaluate(() => !!BohemiaSettlement.state.open)) break; }
      y7 = await GL.state(F);
      bought = await fr.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act[data-build]')].filter(e => !e.disabled)[0]; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: b.innerText.replace(/\s+/g, ' ').slice(0, 40) }; });
      if (bought) { await P.touchscreen.tap(sfb.x + bought.x, sfb.y + bought.y); await P.waitForTimeout(1500); }
      const cx = await fr.evaluate(() => { const x = document.getElementById('close'); if (!x) return null; const r = x.getBoundingClientRect(); return r.width > 1 ? [r.left + r.width / 2, r.top + r.height / 2] : null; });
      if (cx) await P.touchscreen.tap(sfb.x + cx[0], sfb.y + cx[1]); await P.waitForTimeout(1200);   /* the sheet's own close, by a tap */
      y7b = await GL.until(F, 'built', 15000);
      for (let i = 0; i < 40; i++) { await P.waitForTimeout(500); const s = await GL.state(F); if (s && s.step === 'quiet') { y7q = s; break; } }
    }
    ok('Y7 a tap on the lot opened BUILD\'s desk and the glass stepped aside (' + (y7 && y7.step + (y7.shown ? ' SHOWN' : ' off')) + '); ' + (bought && bought.t) + ' bought, the desk closed: "' + (y7b && y7b.line) + '"; then quiet (' + (y7q && y7q.step) + ')',
       !!y7 && !y7.shown && !!bought && !!y7b && !y7b.timedOut && y7b.step === 'built' && !!y7q && !y7q.shown, JSON.stringify([y7, bought, y7b, y7q]));
    await d.close();
  }
  done();
})().catch(e => { console.error(e); process.exit(1); });
