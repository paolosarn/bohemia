/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES FRAMES, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE CAMP IS THE FIGHT'S BOARD  (MOTION 3, 11/10/26, rule 442(a) and 441; Paolo voted NO on 11/9l, the camp after a fight: 'This did
   not look like it was on the combat map'. The coordinator's brief: the camp after a win IS the fight's own board, the same tiles, the
   same buildings, the same dead where they fell, the same camera and zoom; his men at rest ON it, one going through the dead, one
   leaning on a house that was in the fight, the fire on a tile they fought on; proof: the fight's last moment beside the camp's first
   frame, the same place, on the real page, on a phone both ways, on three boards: a suburb, the Strip, the freeway.)
   MEASURED BEFORE (main d74940d89, the demo, phone upright, a suburb fight won, MAKE CAMP): the fight showed its street with a tile 44 px
   on the glass and a man 56 px; the camp opened on ONE tile drawn 488 px on the glass (from a picture 231 px wide), the same 56 px men:
   the ground eleven times closer than the fight, no house on the glass.
   On the demo, the phone UPRIGHT (390 x 844) and ON ITS SIDE (844 x 390), a fight on a suburb, a Strip and a freeway cell of the map
   (the first upright one played whole on AUTO by a real tap, the rest won where they stand), MAKE CAMP tapped on the loot screen:
     Cn1 THE SAME BOARD: the camp stands on that fight's own board (its fingerprint), made from the fight, the camp on
     Cn2 THE SAME CAMERA AND ZOOM: the board's four corners, its dead and the camp's tile land on the glass where the fight had them
         (within 3 px, the fight's own camera read off its own page at its last frame) and a man stands as tall (within 4%)
     Cn3 THE SAME PICTURE: the fight's last frame (its own canvas) and the camp's first frame alike on the ground (Pearson over the
         glass, grey, its men, the camp's first things and the bars left out): 0.4 or more (P2: the voted-NO camp, the same check, under)
     Cn4 HIS MEN WHERE THEY STOOD: in the camp's first frame every man of his is drawn where he stood when the fight ended (within 10 px)
     Cn5 AT REST ON IT, by day: the fire on a board tile on the glass; a man goes through a body on the glass; a man leans on a HOUSE
         of the fight (a roof tile of the board, the wall at his right hand, on the glass), where the fight's glass shows one within
         two tiles of the camp (a body or a house the fight's last glass did not show is said, never faked); no man stands in a house,
         a wall or water; three acts or more (two when one of them is said)
     T1  the phone turned on its side mid-camp: still the fight's view, a man as tall, the glass covered, the fire on the glass
     F1  the camp at rest draws 70% or more of the frames of the camp that was voted NO, measured round it on the same box (20+ fps),
         no frame over 200 ms (the box draws in software; PLUMBER owns 60 on a phone)
     P1  PLANTED: window.__CAMP_NO_FIGHT_VIEW = true (the 11/9l camp that was voted NO), the camp laid again: Cn2's check goes RED
     P2  PLANTED: Cn3's check on that camp's frame against the same fight frame goes RED
     A1  nothing of the camp's threw
   HELD FOR THE MEASURE: a camp made for mending ends itself the hour his men are whole (CAMP's rule 278(a)); after a fight on AUTO that
   is about two seconds of the camp's clock, so the map's campDone is held off on this page while the camp is read (the gate reads the
   camp's look, never the healing rule, which THE CAMP's own gates hold).
   node gates/the_camp_is_the_fights_board_gate.js [--quick] [--shots DIR] [--only suburb|strip|freeway] [--way upright|side]   (about 12 minutes; --quick: upright, suburb only) */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
const arg = (k, dflt) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : dflt; };
const QUICK = process.argv.indexOf('--quick') > 0, QUICK_NO_TURN = process.argv.indexOf('--no-turn') > 0, SHOTS = arg('--shots', process.env.BOHEMIA_SHOT_DIR || null);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const BOARDS = [{ fam: '^suburb$', name: 'a suburb' }, { fam: '^strip$', name: 'the Strip' }, { fam: '^freeway$', name: 'the freeway' }];
const ONLY = arg('--only', null), WAY = arg('--way', null);   /* one board ('freeway'), one way ('upright' | 'side'): a re-check of one case */
const WAYS = (QUICK ? [{ profile: 'phone_portrait', name: 'upright' }] : [{ profile: 'phone_portrait', name: 'upright' }, { profile: 'phone_landscape', name: 'on its side' }])
  .filter(w => !WAY || (WAY === 'upright') === (w.profile === 'phone_portrait'));

/* where the fight had a board point on the glass, and where the camp has it (top glass css px) */
const fightAt = (c, u, v) => [c.fx + c.sx0 + u * c.tw * c.z, c.fy + c.sy0 + v * c.th * c.z];
function campAt(cr, u, v) {
  const F = cr.fv, X = (F.sx0 + u * F.gw - F.ox0) * F.q, Y = (F.sy0 + v * F.gh - F.oy0) * F.q;   /* the camp's own picture px for that tile point */
  return [cr.top[0] + cr.view.ox + X * cr.view.s, cr.top[1] + cr.view.oy + Y * cr.view.s];
}
/* THE ONE CAMERA CHECK, for the real camp and the planted one alike */
function sameCamera(c, cr) {
  if (!c || !cr || !cr.fv || !cr.fv.on || !cr.view || !(cr.view.s > 0)) return { good: false, why: 'no fight view on the camp (' + (cr && cr.fv ? 'fv off' : 'none') + '), its man ' + (cr && cr.view ? Math.round(cr.personH * cr.view.s) : '?') + ' px against the fight\'s ' + Math.round(c && c.man) };
  const pts = [[0, 0], [c.w, 0], [0, c.h], [c.w, c.h]].concat(c.units.filter(u => u.dead && u.side === 'them').map(u => [u.x + 0.5, u.y + 0.9]));
  if (cr.pitch) pts.push([cr.pitch.x + 0.5, cr.pitch.y + 0.5]);
  const off = pts.map(q => { const a = fightAt(c, q[0], q[1]), b = campAt(cr, q[0], q[1]); return Math.hypot(a[0] - b[0], a[1] - b[1]); });
  const man = cr.personH * cr.view.s, r = man / c.man, worst = Math.max.apply(null, off);
  return { good: worst <= 3 && Math.abs(r - 1) <= 0.04, worst, man, why: pts.length + ' board points, the worst ' + worst.toFixed(1) + ' px off; a man ' + man.toFixed(1) + ' px at camp, ' + c.man.toFixed(1) + ' in the fight (' + ((r - 1) * 100).toFixed(1) + '%); a tile ' + (c.tw * c.z).toFixed(1) + ' px wide in the fight' };
}
/* what the picture check leaves out (top glass css px): the bars, the phone, every man and body of the fight, the camp's men and things */
function masks(c, cr, W, H, phone) {
  const m = [[0, 0, W, 110], [0, H - 64, W, H]];
  if (phone) m.push([phone.l - 12, phone.t - 12, phone.r + 12, phone.b + 12]);
  if (c) c.units.forEach(u => { const a = fightAt(c, u.x + 0.5, u.y + 0.9), hgt = c.man * 1.15; m.push([a[0] - hgt * 0.55, a[1] - hgt, a[0] + hgt * 0.55, a[1] + hgt * 0.25]); });
  if (cr && cr.view) {
    const s = cr.view.s, at = (x, y) => [cr.top[0] + cr.view.ox + x * s, cr.top[1] + cr.view.oy + y * s];
    /* in the camp's first frame only the fire (cold) and the cart rolling in are up: the tents rise and the load comes out later */
    (cr.pieces || []).forEach(p => { const a = at(p.x, p.y);
      if (p.kind === 'fire') m.push([a[0] - 90 * s, a[1] - 90 * s, a[0] + 90 * s, a[1] + 40 * s]);
      else if (p.kind === 'carrier') m.push([0, a[1] - 160 * s, W, a[1] + 40 * s]); });
    Object.keys(cr.drawnAt || {}).forEach(k => { const q = cr.drawnAt[k]; m.push([cr.top[0] + q[0] - 70 * s, cr.top[1] + q[1] - 170 * s, cr.top[0] + q[0] + 70 * s, cr.top[1] + q[1] + 30 * s]); });
    if (cr.lead && cr.lead.x != null) { const a = at(cr.lead.x, cr.lead.y); m.push([a[0] - 70 * s, a[1] - 170 * s, a[0] + 70 * s, a[1] + 30 * s]); }
  }
  return m;
}
(async () => {
  console.log('THE CAMP IS THE FIGHT\'S BOARD' + (QUICK ? ' (quick: upright, a suburb)' : ''));
  const shots = [];
  let planted = false, framed = false;
  for (const way of WAYS) {
    let d;
    try { d = await open({ profile: way.profile, door: 120000, engage: true }); }
    catch (e) { ok('the demo opened ' + way.name, false, String(e.message).slice(0, 160)); continue; }
    const p = d.page, errs = [];
    p.on('pageerror', e => { const st = String(e && e.stack || ''); if (/camp_(look|board)|SETTLEMENT/.test(st)) errs.push(String(e && e.message || e).slice(0, 140)); });
    const W = way.profile === 'phone_portrait' ? 390 : 844, H = way.profile === 'phone_portrait' ? 844 : 390;
    try {
      await p.waitForTimeout(2500);
      const boards = (QUICK ? BOARDS.slice(0, 1) : BOARDS).filter(b => !ONLY || b.fam.indexOf(ONLY) >= 0);
      for (let bi = 0; bi < boards.length; bi++) {
        const B = boards[bi], tag = B.name + ', ' + way.name;
        const r = await K.oneFight(d, { fam: B.fam, end: bi === 0 && way.profile === 'phone_portrait' ? 'auto' : 'won' });
        if (r.err) { ok('Cn1 ' + tag + ': a fight there, won, MAKE CAMP', false, r.err); continue; }
        const c = r.cam, cr = r.camp;
        ok('Cn1 ' + tag + ': the camp stands on that fight\'s own board (' + (c && c.board) + '), made from the fight, the camp on', !!c && !!cr && cr.state === 'in' && cr.fromFight && cr.sig === c.sig && r.on,
          JSON.stringify({ played: r.played, deployed: r.deployed, forced: !!r.forced, fight: c && c.sig, camp: cr && cr.sig, on: r.on, dead: cr && cr.dead, campMs: r.campMs, why: r.on ? undefined : r.why }));
        const S2 = sameCamera(c, cr);
        ok('Cn2 ' + tag + ': THE SAME CAMERA AND ZOOM: every tile where the fight had it on the glass, a man as tall', S2.good, S2.why);
        const M = masks(c, cr, W, H, r.kept && r.kept.view && r.kept.view.phone ? { l: r.kept.view.phone.l + r.kept.view.fx, t: r.kept.view.phone.t + r.kept.view.fy, r: r.kept.view.phone.r + r.kept.view.fx, b: r.kept.view.phone.b + r.kept.view.fy } : null), sim = r.fightShot && r.campShot ? await K.same(d, r.fightShot, r.campShot, M, W, H) : null;
        ok('Cn3 ' + tag + ': THE SAME PICTURE: the fight\'s last frame and the camp\'s first alike on the ground (Pearson, its men, things and bars left out)', !!sim && sim.r >= 0.4,
          sim ? 'r ' + sim.r.toFixed(3) + ' over ' + Math.round(sim.n / sim.of * 100) + '% of the glass' : 'not measured');
        /* Cn4: each man of his drawn in the camp's first frame where he stood when it ended */
        const kept = cr && cr.fv ? cr.fv.men : [], s = cr && cr.view ? cr.view.s : 1, offs = [];
        kept.forEach(m => { let at = null;
          if (m.main) { if (cr.lead && cr.lead.x != null) at = [cr.top[0] + cr.view.ox + cr.lead.x * s, cr.top[1] + cr.view.oy + cr.lead.y * s]; }
          else { const A = cr.firstAt || cr.drawnAt || {}, k = Object.keys(A).find(q => q.toUpperCase() === 'M:' + m.name); if (k) at = [cr.top[0] + A[k][0], cr.top[1] + A[k][1]]; }
          const want = [cr.top[0] + cr.view.ox + m.x * s, cr.top[1] + cr.view.oy + m.y * s];
          offs.push({ name: m.name, main: m.main, off: at ? Math.round(Math.hypot(at[0] - want[0], at[1] - want[1])) : null }); });
        ok('Cn4 ' + tag + ': in the camp\'s first frame every man of his is drawn where he stood when the fight ended (within 10 px; YOU within 30, on his own walk\'s ground)', kept.length > 0 && offs.every(o => o.off != null && o.off <= (o.main ? 30 : 10)),
          offs.map(o => o.name + ' ' + (o.off == null ? 'NOT DRAWN' : o.off + ' px')).join(', ') + (cr.firstAt ? ' (the first frame\'s own record)' : ' (no first-frame record: read late)'));
        if (SHOTS) { const f1 = path.join(SHOTS, 'board_' + bi + '_' + way.profile + '_fight.png'), f2 = path.join(SHOTS, 'board_' + bi + '_' + way.profile + '_camp.png');
          fs.writeFileSync(f1, r.fightShot); fs.writeFileSync(f2, r.campShot); shots.push({ board: B.name, way: way.name, fight: f1, camp: f2 }); }
        /* Cn5: at rest by day */
        const R = await K.atRest(d);
        /* the camp's own ground: the board's grid, and on the fight's view the raised ground fought on (a deck) at its own height */
        const G = R && R.grid, F = R && R.fv, OK = F && F.okS ? F.okS : (G && G.ok), r0 = (F && F.r0) || 0;
        const tileOf = (x, y) => [Math.floor((x / F.q + F.ox0 - F.sx0) / F.gw), Math.floor((y / F.q + F.oy0 - F.sy0) / F.gh + r0)];
        const okAt = (x, y) => { const t = tileOf(x, y); return OK && OK[t[1]] ? OK[t[1]][t[0]] | 0 : 0; };
        const gl = R && R.glass, onGlass = (x, y) => !!gl && x > gl.x0 + 20 && x < gl.x1 - 20 && (gl.y0 == null || (y > gl.y0 + 60 && y < gl.y1 - 20));
        const acts = (R && R.acts) || [], spots = (R && R.spots) || [];
        const loot = spots.filter(q => q.act === 'loot' && (R.bodies || []).some(b => Math.hypot(b.x - q.x, b.y - q.y) < 90 && onGlass(b.x, b.y)));
        const deadSeen = (R && R.bodies || []).filter(b => onGlass(b.x, b.y)).length;
        const houseNear = (R && R.walls || []).filter(w => w.roof || w.mass >= 4).length;
        const lean = spots.filter(q => q.act === 'lean' && (R.walls || []).some(w => Math.abs(w.x - q.x) < 2 && Math.abs(w.y - q.y) < 2 && w.face === q.face && (w.roof || w.mass >= 4)) && onGlass(q.x, q.y));
        const fire = R && R.fire && okAt(R.fire.x, R.fire.y) > 0 && onGlass(R.fire.x, R.fire.y);
        const inHouse = spots.filter(q => q.act !== 'lean' && !okAt(q.x, q.y));
        const kinds = new Set(acts.map(a => a.act)).size;
        ok('Cn5 ' + tag + ': AT REST ON IT by day: the fire on a board tile on the glass, a man at the dead' + (deadSeen ? '' : ' (NO BODY ON THIS GLASS: the fight\'s last camera showed none; said, not gone through)') + ', a man leaning on a house of the fight' + (houseNear ? '' : ' (NO HOUSE OF THE FIGHT within two tiles of the camp on this glass: said, not leaned)') + ', nobody in a house, three acts',
          !!R && !R.night && fire && (loot.length >= 1 || !deadSeen) && (lean.length >= 1 || !houseNear) && !inHouse.length && kinds >= (deadSeen && houseNear ? 3 : 2),
          JSON.stringify({ hour: R && R.hour, fire: !!fire, loot: loot.map(q => q.name), lean: lean.map(q => q.name), wallsByHouses: houseNear, inHouse: inHouse.map(q => q.name + ':' + q.act), fireAt: R && R.fire ? [Math.round(R.fire.x), Math.round(R.fire.y), okAt(R.fire.x, R.fire.y)] : null, glass: gl ? [gl.x0, gl.x1, gl.y0, gl.y1].map(v => v == null ? null : Math.round(v)) : null, bodies: (R && R.bodies || []).length, acts: acts.map(a => a.name + ' ' + a.act).join(', '), drawnBy: R && R.drawnBy, anims: R && R.anims }));
        /* T1 once: the phone turned on its side mid-camp (rule 441: both ways), and back */
        if (bi === 0 && way.profile === 'phone_portrait' && !QUICK_NO_TURN) {
          const before = await K.campRead(p).catch(() => null);
          await p.setViewportSize({ width: 844, height: 390 }); let after = null;
          for (let k = 0; k < 40; k++) { await p.waitForTimeout(250); after = await K.campRead(p).catch(() => null); if (after && after.view && after.view.W > after.view.H && after.lastFlip !== (before && before.lastFlip)) break; }
          await p.waitForTimeout(1200); after = await K.campRead(p).catch(() => after);
          const man0 = before && before.view ? before.personH * before.view.s : 0, man1 = after && after.view ? after.personH * after.view.s : 0;
          const cover = after && after.view && after.fv ? after.view.ox <= 0.5 && after.view.oy <= 0.5 && after.view.ox + after.fv.PW * after.view.s >= after.view.W - 0.5 && after.view.oy + after.fv.PH * after.view.s >= after.view.H - 0.5 : false;
          const fireOn = after && after.fire && after.glass ? after.fire.x > after.glass.x0 && after.fire.x < after.glass.x1 : false;
          if (SHOTS) { const f3 = path.join(SHOTS, 'board_0_turned.png'); fs.writeFileSync(f3, await p.screenshot()); }
          ok('T1 the phone turned on its side mid-camp: still the fight\'s view, a man as tall (4%), the glass covered (never a black edge), the fire on the glass', !!after && !!after.fv && after.fv.on && man0 > 0 && Math.abs(man1 / man0 - 1) <= 0.04 && cover && fireOn,
            JSON.stringify({ man: [Math.round(man0 * 10) / 10, Math.round(man1 * 10) / 10], view: after && after.view, cover, fireOn }));
          await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(2000); }
        /* F1 + P1 once: the camp at rest measured, then the camp that was voted NO laid again on the same box and measured the same way */
        const sf = K.settle(p);
        const calm = async () => {   /* in a calm stretch of daylight (the camp lays itself out again at dusk and dawn, and a turn glides: one-offs) */
          let o = [];
          for (let tries = 0; tries < 4; tries++) {
            for (let k = 0; k < 80; k++) { const h = await sf.evaluate(() => { const L = BohemiaCampLook.state(); return L.night || L.gliding || (L.pitch && L.pitch.on) ? -1 : L.hour; }).catch(() => -1); if (h >= 7 && h <= 12) break; await p.waitForTimeout(150); }
            const k0 = await sf.evaluate(() => BohemiaCampLook.state().acts.map(a => a.act).join(',')).catch(() => '');
            o = await sf.evaluate(() => new Promise(res => { const t = []; const t0 = performance.now(); const tick = x => { t.push(x); if (x - t0 < 4500) requestAnimationFrame(tick); else res(t); }; requestAnimationFrame(tick); })).catch(() => []);
            const k1 = await sf.evaluate(() => BohemiaCampLook.state().acts.map(a => a.act).join(',')).catch(() => '');
            if (k0 === k1) break; }
          /* three stretches of 1.5 s, the median (this box swings 10 fps between two samples of one picture) */
          const parts = [0, 1, 2].map(i => o.filter(x => x >= o[0] + i * 1500 && x < o[0] + (i + 1) * 1500)).filter(a => a.length > 1);
          const fpsOf = a => (a.length - 1) / ((a[a.length - 1] - a[0]) / 1000), f3 = parts.map(fpsOf).sort((a, b) => a - b);
          const g = o.slice(1).map((x, i) => x - o[i]);
          return { fps: f3.length ? f3[Math.floor(f3.length / 2)] : 0, all: f3.map(v => Math.round(v * 10) / 10), worst: g.length ? Math.max.apply(null, g) : 999 }; };
        if (!planted && sf) { planted = true;
          const nowF = await calm();
          if (process.env.BOHEMIA_CAMP_PROF) { const cdp = await p.context().newCDPSession(p); await cdp.send('Profiler.enable'); await cdp.send('Profiler.start'); await p.waitForTimeout(2500); const { profile } = await cdp.send('Profiler.stop');
            const self = {}, byId = {}; profile.nodes.forEach(n => byId[n.id] = n); profile.samples.forEach((id, i) => { const n = byId[id], k = n.callFrame.functionName + ' ' + (n.callFrame.url || '').split('/').pop() + ':' + n.callFrame.lineNumber; self[k] = (self[k] || 0) + (profile.timeDeltas[i] || 0); });
            console.log('PROF top ' + Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 16).map(([k, v]) => k + ' ' + Math.round(v / 1000) + 'ms').join(' | ')); }
          await sf.evaluate(() => { window.__CAMP_NO_FIGHT_VIEW = true; try { BohemiaCampLook.time(); } catch (e) {} });
          let pr = null; for (let k = 0; k < 160; k++) { await p.waitForTimeout(150); pr = await K.campRead(p).catch(() => null); if (pr && pr.state === 'in' && !(pr.fv && pr.fv.on) && pr.plates && pr.plates.length) break; }
          await p.waitForTimeout(800); pr = await K.campRead(p).catch(() => pr);
          const P2 = sameCamera(c, pr);
          ok('P1 PLANTED: the camp that was voted NO (window.__CAMP_NO_FIGHT_VIEW), laid again: Cn2\'s own check goes RED', !!pr && pr.state === 'in' && !P2.good, P2.why);
          /* P2: Cn3's own check on the voted-NO camp's frame against the same fight frame (its men and things left out the same way) */
          const oldShot = await p.screenshot(), simOld = r.fightShot ? await K.same(d, r.fightShot, oldShot, masks(c, pr, W, H, null), W, H) : null;
          ok('P2 PLANTED: the same picture check (Cn3) on the camp that was voted NO goes RED (under 0.4)', !!simOld && simOld.r < 0.4, simOld ? 'r ' + simOld.r.toFixed(3) + ' over ' + Math.round(simOld.n / simOld.of * 100) + '% of the glass' : 'not measured');
          const oldF = await calm();
          await sf.evaluate(() => { window.__CAMP_NO_FIGHT_VIEW = false; try { BohemiaCampLook.time(); } catch (e) {} });
          for (let k = 0; k < 160; k++) { await p.waitForTimeout(150); const q = await K.campRead(p).catch(() => null); if (q && q.state === 'in' && q.fv && q.fv.on) break; }
          await p.waitForTimeout(1500); const nowF2 = await calm(), best = nowF2.fps > nowF.fps ? nowF2 : nowF;   /* the same camp measured twice, round the voted-NO one */
          ok('F1 the camp on the fight\'s view at rest draws 70% or more of the frames of the camp that was voted NO on the same box (20+ fps: a man and every piece of the camp are drawn twice as tall, as the fight draws them), no frame over 200 ms', best.fps >= 0.70 * oldF.fps && best.fps >= 20 && best.worst <= 200,
            'now ' + nowF.fps.toFixed(1) + ' and ' + nowF2.fps.toFixed(1) + ' fps (' + nowF.all.concat(nowF2.all).join(', ') + '), worst ' + Math.round(best.worst) + ' ms; the voted-NO camp ' + oldF.fps.toFixed(1) + ' fps (' + oldF.all.join(', ') + '), worst ' + Math.round(oldF.worst) + ' ms (this box draws in software; PLUMBER owns 60 on a phone)'); }
        await K.breakCamp(d);
      }
    } catch (e) { ok('the gate ran to its end (' + way.name + ')', false, String(e && e.stack || e).slice(0, 300)); }
    ok('A1 ' + way.name + ': nothing of the camp\'s threw', !errs.length, errs.length ? errs.slice(0, 3).join(' | ') : 'none');
    try { await d.close(); } catch (e) {}
  }
  if (SHOTS) fs.writeFileSync(path.join(SHOTS, 'shots.json'), JSON.stringify(shots, null, 1));
  console.log('THE CAMP IS THE FIGHT\'S BOARD: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
