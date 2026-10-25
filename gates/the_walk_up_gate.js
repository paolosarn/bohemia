/* THE WALK-UP GATE (RUN TWO [the walk-up], VAMILY rule 138, 10/25/26).
   PAOLO 10/24: 'on the settlement screen... the main character of the group, or any member with the highest level... when
   you click anything or someone, you still talk to them at pretty much the same speed, but you see your main guy or woman
   walking up to them... extra interactivity and engagement'.
   WHY THIS WALKS THE DEMO: rule 150(d), on the surface he plays: a town through the map's own door, real fingers.
     W1 your lead stands in the town: the main character (YOU), his own 3D body drawn on the glass (pixels change where he
        stands when he is taken off), on nobody's spot
     W2 *** THE TALK OPENS AT TODAY'S SPEED *** a real tap on the bar: its sheet is up on the same tap (no wait added), and
        he is already walking
     W3 he walks to the bar's keeper and stops beside him, facing him; the keeper never left his spot (131(b))
     W4 every leg of his walk stays off the buildings' bodies (nobody walks over a roof), and he never turns more than an
        eighth between two drawn frames (the envelope law: never a spin)
     W5 a tall sheet (the hall) slides the town up so his feet and where he is going stand above it; closing it slides it back
     W6 a finger on a man in the crowd: he walks up beside that man, who stays on his spot
     W7 a company without YOU is led by its highest level
     W8 nothing threw
   node gates/the_walk_up_gate.js */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== THE WALK-UP GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => errs.push(e.message));
  try {
    await p.waitForTimeout(2500);
    const n = await fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
    let sf = null;
    for (let k = 0; k < 60 && !sf; k++) { await p.waitForTimeout(400);
      for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) {
        if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } } }
    if (!sf) { ok('a town through the map\'s own door', false, n); return done(); }
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const box = await (await sf.frameElement()).boundingBox();
    const lead = () => sf.evaluate(() => { const l = BohemiaSettlement.lead(); delete l.blocked; return l; });
    const close = async () => { if (await sf.evaluate(() => !!BohemiaSettlement.state.open)) { const c = await sf.$('#close'); if (c) { await c.tap(); await p.waitForTimeout(500); } } };
    /* he has arrived when he stops walking and has finished turning to face what he walked to (an eighth a key) */
    const settle = async (ms) => { for (let i = 0; i < ms / 200; i++) { const l = await lead(); if (!l.walking && !l.path) { await p.waitForTimeout(1400); return lead(); } await p.waitForTimeout(200); } return lead(); };

    /* ---- W1 he stands in the town ---- */
    await sf.waitForFunction(() => { const l = BohemiaSettlement.lead(); return l.drawn === 'idle' || l.drawn === 'stand'; }, null, { timeout: 15000 }).catch(() => {});
    const w1 = await sf.evaluate(async () => {
      const S = BohemiaSettlement, l = S.lead(), v = S._view(), cv = document.getElementById('cv'), dpr = window.devicePixelRatio || 1;
      const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      S.still(true); S.walkers(false); S.glow(false); await frame();
      const h = S.scale().person * v.s, x0 = Math.round((v.ox + l.x * v.s - h * .4) * dpr), y0 = Math.round((v.oy + l.y * v.s - h * 1.1) * dpr), w = Math.round(h * .8 * dpr), hh = Math.round(h * 1.2 * dpr);
      const grab = () => cv.getContext('2d').getImageData(Math.max(0, x0), Math.max(0, y0), w, hh).data;
      const a = grab(); S.lead(false); await frame(); const b = grab(); S.lead(true); S.still(false); S.walkers(true); S.glow(true);
      let diff = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30) diff++;
      const ph = S.scale().person, near = S.folk().filter(p => Math.abs(p.x - l.x) < ph * .3 && Math.abs(p.y - l.y) < ph * .4).length;
      let you = null; try { const c = BohemiaCrewDoor.company(); you = !c || !c.length || c.some(m => m && (m.look === 'you' || m.main)); } catch (e) {}
      return { look: l.look, you, diff, near, at: [Math.round(l.x), Math.round(l.y)] };
    });
    ok('W1 your lead stands in the town: ' + w1.look + ' (the main character), his own 3D body on the glass, on nobody\'s spot',
      w1.look === 'you' && w1.you !== false && w1.diff > 150 && w1.near === 0, w1.diff + ' px of him on the glass at ' + w1.at + ', ' + w1.near + ' people under him');

    /* ---- W2, W3, W4 a real tap on the bar ---- */
    await sf.evaluate(() => { window.__WU = { up: 0, on: 0, faces: [], walk0: null, keeper: null };
      window.addEventListener('pointerup', () => { if (!window.__WU.up) window.__WU.up = performance.now(); }, true);
      const sh = document.getElementById('sheet');
      new MutationObserver(() => { if (sh.classList.contains('on') && !window.__WU.on && window.__WU.up) { window.__WU.on = performance.now(); window.__WU.walk0 = BohemiaSettlement.lead().walking || !!BohemiaSettlement.lead().path; } }).observe(sh, { attributes: true, attributeFilter: ['class'] });
      const k = BohemiaSettlement.folk().find(p => p.keeper && p.k === 'bar'); window.__WU.keeper = k ? { x: k.x, y: k.y } : null;
      const tick = () => { const l = BohemiaSettlement.lead(); if (l.drawn) window.__WU.faces.push(l.face); if (window.__WU.faces.length < 4000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    const wb = await sf.evaluate(() => BohemiaSettlement.where('bar'));
    const start = await lead();
    if (wb) await p.touchscreen.tap(box.x + wb.x, box.y + wb.y);
    await p.waitForTimeout(400);
    const w2 = await sf.evaluate(() => ({ open: BohemiaSettlement.state.open, ms: window.__WU.on && window.__WU.up ? Math.round(window.__WU.on - window.__WU.up) : null, walk0: window.__WU.walk0 }));
    const going = await lead();
    ok('W2 the talk opens at today\'s speed: a real tap on the bar, its sheet is up on that same tap, and he is already walking', w2.open === 'bar' && w2.ms != null && w2.ms < 60 && !!w2.walk0,
      'sheet ' + w2.open + ' ' + w2.ms + ' ms after the finger lifted; walking ' + w2.walk0 + ' from ' + [Math.round(start.x), Math.round(start.y)]);
    const path0 = going.path || [];
    const arrived = await settle(30000);
    const w3 = await sf.evaluate(() => { const k = BohemiaSettlement.folk().find(p => p.keeper && p.k === 'bar'); return { k: k ? { x: k.x, y: k.y } : null, was: window.__WU.keeper }; });
    const toward = w3.k && (w3.k.x > arrived.x ? 'E' : 'W');
    ok('W3 he walks to the bar\'s keeper and stops beside him, facing him; the keeper never left his spot',
      !!w3.k && arrived.goal && arrived.goal.key === 'b:bar' && Math.abs(arrived.x - arrived.goal.x) < 1 && Math.abs(arrived.y - arrived.goal.y) < 1 && Math.abs(arrived.x - w3.k.x) < 90 && Math.abs(arrived.y - w3.k.y) < 20 && arrived.face === toward && !!w3.was && w3.was.x === w3.k.x && w3.was.y === w3.k.y,
      'he stands at ' + [Math.round(arrived.x), Math.round(arrived.y)] + ' facing ' + arrived.face + ', the keeper at ' + (w3.k ? [Math.round(w3.k.x), Math.round(w3.k.y)] : '-'));
    const w4 = await sf.evaluate((P) => { const B = BohemiaSettlement.lead().blocked; let bad = 0, n = 0;
      for (let i = 1; i < P.length; i++) for (let k = 0; k <= 40; k++) { const t = k / 40; n++; if (B(P[i - 1].x + (P[i].x - P[i - 1].x) * t, P[i - 1].y + (P[i].y - P[i - 1].y) * t)) bad++; }
      const D = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], F = window.__WU.faces; let spin = 0;
      for (let i = 1; i < F.length; i++) { const a = D.indexOf(F[i]), b = D.indexOf(F[i - 1]), df = Math.min((a - b + 8) % 8, (b - a + 8) % 8); if (df > 1) spin++; }
      return { bad, n, legs: P.length - 1, spin, frames: F.length, turns: F.filter((f, i) => i && f !== F[i - 1]).length }; }, path0);
    ok('W4 every leg of his walk stays off the buildings\' bodies, and he never turns more than an eighth between two drawn frames',
      path0.length >= 2 && w4.bad === 0 && w4.spin === 0 && w4.frames > 30,
      w4.legs + ' legs, ' + w4.bad + ' of ' + w4.n + ' steps on a building; ' + w4.turns + ' turns over ' + w4.frames + ' frames, ' + w4.spin + ' bigger than an eighth');
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'walk_up_bar.png') });

    /* ---- W5 a tall sheet slides the town up above it ---- */
    await close();
    const wh = await sf.evaluate(() => BohemiaSettlement.where('hall'));
    if (wh) await p.touchscreen.tap(box.x + wh.x, box.y + wh.y);
    const see = () => sf.evaluate(() => { const l = BohemiaSettlement.lead(), v = BohemiaSettlement._view(), sh = document.getElementById('sheet'), top = v.H - sh.offsetHeight, ph = BohemiaSettlement.scale().person;
      return { open: BohemiaSettlement.state.open, lift: Math.round(l.lift), top: Math.round(top), goalFeet: l.goal ? Math.round(v.oy + l.goal.y * v.s) : null, feet: Math.round(v.oy + l.y * v.s), head: Math.round(v.oy + (l.y - ph) * v.s), H: v.H }; });
    await p.waitForTimeout(900);
    const w5a = await see();   /* on his way: the town has gone up and he is above the sheet, his head on the glass */
    await settle(30000);
    const w5 = await see();    /* there: his feet at the door, above the sheet */
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'walk_up_hall.png') });
    await close(); await p.waitForTimeout(500);
    const back = await lead();
    ok('W5 the hall\'s tall sheet slides the town up: he walks above it, his feet at its door above it when he gets there; closing it slides it back',
      w5a.open === 'hall' && w5a.lift > 0 && w5a.feet <= w5a.top + 4 && w5a.head >= -4 && w5.open === 'hall' && w5.goalFeet != null && w5.goalFeet <= w5.top && w5.head >= -4 && back.lift < 1,
      'sheet top ' + w5.top + ' of ' + w5.H + '; on his way the town up ' + w5a.lift + ' px, his feet at ' + w5a.feet + '; there, up ' + w5.lift + ', the door at ' + w5.goalFeet + ', his head at ' + w5.head + '; closed: ' + Math.round(back.lift));

    /* ---- W6 a man in the crowd ---- */
    const cw = await sf.evaluate(() => { const S = BohemiaSettlement, v = S._view(), r = document.getElementById('cv').getBoundingClientRect(), ph = S.scale().person;
      const L = S.folk().filter(p => p.crowd).map(p => ({ slot: p.slot, x: p.x, y: p.y, sx: v.ox + p.x * v.s, sy: v.oy + (p.y - ph * .55) * v.s }))
        .filter(p => p.sx > 20 && p.sx < v.W - 20 && p.sy > 20 && p.sy < v.H - 20).filter(p => { const u = S.peopleUnder(p.sx, p.sy); return u[0] && u[0].slot === p.slot; });
      return L.length ? Object.assign(L[0], { rx: r.left, ry: r.top }) : null; });
    let w6 = null;
    if (cw) { await p.touchscreen.tap(box.x + cw.rx + cw.sx, box.y + cw.ry + cw.sy); await p.waitForTimeout(400);
      const opened = await sf.evaluate(() => BohemiaSettlement.state.open);
      const at = await settle(30000);
      const now = await sf.evaluate((slot) => { const q = BohemiaSettlement.folk().find(p => p.crowd && p.slot === slot); return q ? { x: q.x, y: q.y } : null; }, cw.slot);
      w6 = { opened, goal: at.goal && at.goal.key, x: Math.round(at.x), y: Math.round(at.y), man: now, was: { x: cw.x, y: cw.y }, face: at.face }; }
    ok('W6 a finger on a man in the crowd: he walks up beside that man, who stays on his spot',
      !!w6 && w6.opened === 'person' && w6.goal === 'crowd:' + cw.slot && !!w6.man && w6.man.x === w6.was.x && w6.man.y === w6.was.y && Math.abs(w6.x - w6.man.x) < 90 && Math.abs(w6.y - w6.man.y) < 20 && w6.face === (w6.man.x > w6.x ? 'E' : 'W'),
      JSON.stringify(w6));
    await close();

    /* ---- W7 a company without YOU ---- */
    const w7 = await sf.evaluate(async () => {
      const K = 'bohemia.company.v1', was = localStorage.getItem(K), frame = () => new Promise(r => setTimeout(r, 300));
      localStorage.setItem(K, JSON.stringify([{ look: 'cast_longcoat', level: 2 }, { look: 'cast_cape', level: 6 }, { look: 'cast_apron', level: 4 }]));
      await frame(); const a = BohemiaSettlement.lead().look;
      if (was == null) localStorage.removeItem(K); else localStorage.setItem(K, was);
      await frame(); const b = BohemiaSettlement.lead().look;
      return { a, b };
    });
    ok('W7 a company without YOU is led by its highest level (cast_cape at 6 over 4 and 2); with YOU back, YOU leads', w7.a === 'cast_cape' && w7.b === 'you', JSON.stringify(w7));
  } catch (e) { ok('the walk-up ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('W8 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (e) {}
  done();
})();
