/* __BOHEMIA_SOLO__ -- THIS GATE WATCHES THE GLASS FRAME BY FRAME, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE CAMP IS SET UP ON THE BOARD WHILE HE WATCHES  (MOTION 3, 11/10/26, VAMILY rule 444(a)(b) and 441, ask lines 568 and 569; Paolo 11/10:
   'the camping right after combat still is kind of fucked and ugly: you start the timer up so time is going forward as it's getting set
   up... it should be the other way around: you watch them set up the camp on the combat map itself, not pull out into the big map and then
   try to zoom back in, and then once the camp is set up, then time fast forwards... see your guys on the combat map next to the rotten
   corpses... never putting any of our camp shit on top of any buildings'.)
   MEASURED BEFORE (main 04ead582a, this gate's own watch): MAKE CAMP took the glass off the board (the climb out to the big map, then the
   camp grew back in from the map), and the camp's clock ran from the moment it was made, through the whole set-up.
   On the demo, the phone UPRIGHT (390 x 844) and ON ITS SIDE (844 x 390), a fight on a suburb, a Strip and a freeway cell of the map
   (the first played whole on AUTO by a real tap, the rest won where they stand), MAKE CAMP tapped on the loot screen, watched every
   tenth of a second and shot every 150 ms from the tap until the camp stands:
     S1 THE CAMERA NEVER LEAVES THE BOARD: at every tenth of a second the glass holds the fight's page, the board's held last frame, or
        the camp's screen with its first frame drawn on the fight's view (never the map); every shot of the glass alike to the fight's
        last frame on the ground (Pearson 0.3 or more, its men, the camp's men and things and the bars left out)
     S2 THE CLOCK STOPPED FOR THE SET-UP: the map's clock the same from the tap to the set-up's end, the set-up played a second or more,
        and the hours run within four seconds of its end
     S3 HE WATCHES THEM SET IT UP: the set-up plays on the board (not skipped): the fire lit in it, his men walk from where they won; at
        rest a man goes through the dead (where the glass shows a body) and one keeps watch
     S4 NOTHING OF THE CAMP ON A BUILDING: every piece's footprint (the fire, the tents, the cart, the packs) and every man's feet on
        open ground of the board (the fight's own grid: street, yard, dirt), never a roof, a house, a wall or water; a piece with no
        open ground for it is left out and said, never laid on a house
     S5 A TAP SKIPS IT (once, the Strip upright): a tap on the glass mid set-up ends it, and the hours run
     P1 PLANTED: a tent of the camp laid on a roof tile of the fight (the camp's own read, its piece moved): S4's check goes RED
     P2 PLANTED: window.__CAMP_HOLD_OFF and __CAMP_CLOCK_DURING_SETUP (the order as it was), one more fight: S1's or S2's check goes RED
     A1 nothing of the camp or the hold threw
   HELD FOR THE MEASURE: a camp made for mending ends itself the hour his men are whole (CAMP's rule 278(a)); the map's campDone is held
   off on this page while the camp is read (as THE CAMP IS THE FIGHT'S BOARD does).
   node gates/the_camp_is_set_up_on_the_board_gate.js [--quick] (upright, a suburb, and the planted fails)   (about 14 minutes) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
const QUICK = process.argv.indexOf('--quick') > 0, SHOTS = (() => { const i = process.argv.indexOf('--shots'); return i > 0 ? process.argv[i + 1] : null; })();
const fs = require('fs');
const LOOT_MS = 5000;   /* he reads the loot a few seconds before MAKE CAMP, as a player does */
/* the glass as he saw it, kept for the picture (--shots DIR): every shot from the tap to a second after the set-up, its time and the clock */
function keep(tag, r, endT) {
  if (!SHOTS || !r || !r.watch) return; fs.mkdirSync(SHOTS, { recursive: true });
  const S = r.watch.samples || [], clockAt = (t) => { let c = null; S.forEach(q => { if (q.t <= t && q.clock != null) c = q.clock; }); return c; };
  const idx = r.watch.shots.filter(q => q.t <= endT + 1500).map((q, i) => { const f = path.join(SHOTS, tag + '_' + String(i).padStart(2, '0') + '.png'); fs.writeFileSync(f, q.png); return { t: q.t, file: f, clock: clockAt(q.t) }; });
  fs.writeFileSync(path.join(SHOTS, tag + '.json'), JSON.stringify({ tag, endT, fight: (() => { const f = path.join(SHOTS, tag + '_fight.png'); fs.writeFileSync(f, r.fightShot); return f; })(), shots: idx }, null, 1));
}
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const BOARDS = [{ name: 'a suburb', fam: '^suburb$' }, { name: 'the Strip', fam: '^strip$' }, { name: 'the freeway', fam: '^freeway$' }];
const WAYS = QUICK ? [{ name: 'upright', profile: 'phone_portrait' }] : [{ name: 'upright', profile: 'phone_portrait' }, { name: 'on its side', profile: 'phone_landscape' }];

/* the checks, pure on what was read, so the planted fails run the very same ones */
function glassHeld(samples, endT) {
  const bad = (samples || []).filter(q => q.t <= endT && !(q.fight || q.spoils || q.hold || (q.campShown && q.campOp >= 0.99 && q.first)));
  return { ok: (samples || []).length > 5 && !bad.length, why: (samples || []).length + ' samples, ' + bad.length + ' on the map' + (bad.length ? ' (first at ' + bad[0].t + ' ms: ' + JSON.stringify(bad[0]) + ')' : '') };
}
function clockHeld(samples, tapT, endT) {
  const S = (samples || []).filter(q => q.clock != null), during = S.filter(q => q.t >= tapT && q.t <= endT), after = S.filter(q => q.t > endT && q.t <= endT + 4000);
  const c0 = during.length ? during[0].clock : null, moved = during.filter(q => q.clock !== c0), ran = after.some(q => q.clock !== c0);
  const set = S.filter(q => q.pitch === 'on'), setMs = set.length ? set[set.length - 1].t - set[0].t : 0;
  return { ok: during.length > 5 && !moved.length && setMs >= 1000 && ran, why: 'clock ' + c0 + ' at the tap; ' + moved.length + ' samples moved before the set-up ended (' + (moved[0] ? moved[0].clock + ' at ' + moved[0].t + ' ms' : 'none') + '); the set-up ' + setMs + ' ms; the hours ran after: ' + ran };
}
function onGround(where) {
  const W = where || [], bad = W.filter(q => !q.open);
  return { ok: W.length > 0 && !bad.length, why: W.length + ' read, ' + W.filter(q => q.what === 'piece').length + ' pieces; on a house, a wall or water: ' + (bad.map(q => q.key + (q.kind ? ' (' + q.kind + ')' : '') + ' ' + JSON.stringify(q.tiles.filter(t => !(t.ok > 0) || t.roof).slice(0, 2))).join(', ') || 'none') };
}
module.exports = { glassHeld, clockHeld, onGround };

async function where(p, plant) {
  const sf = K.settle(p); if (!sf) return null;
  return sf.evaluate((plant) => {
    const L = BohemiaCampLook.state(), C = BohemiaCampBoard, F = C.fvState(); if (!F || !F.on) return { err: 'no fight view' };
    const pieces = (L.pieces || []).map(q => Object.assign({}, q)), men = (L.spots || []).map(q => ({ name: q.name, x: q.x, y: q.y, act: q.act }));
    let planted = null;
    if (plant) {   /* a tent laid on a roof tile of the fight, the camp's own read moved (nothing drawn): the first roof tile fvWhere finds */
      const at = (u, w) => [(F.sx0 + (u + 0.5) * F.gw - F.ox0) * F.q, (F.sy0 + (w + 0.5 - F.r0) * F.gh - F.oy0) * F.q];
      let roofT = null;
      const tent0 = pieces.find(q => q.kind === 'tent') || pieces.find(q => q.kind !== 'fire') || { kind: 'tent', sprite: 'tent' };
      for (let w = 0; w < 80 && !roofT; w++) for (let u = 0; u < 80 && !roofT; u++) { const xy = at(u, w), q = C.fvWhere([{ key: 'probe', kind: tent0.kind, sprite: tent0.sprite, x: xy[0], y: xy[1] }], []);
        if (q && q[0] && q[0].tiles.length && q[0].tiles.every(t => t.t[0] >= 0 && t.t[1] >= 0) && q[0].tiles.some(t => t.roof)) roofT = [u, w]; }   /* its whole footprint on the board, on a roof */
      const tent = pieces.find(q => q.kind === 'tent') || pieces.find(q => q.kind !== 'fire');   /* probed with its own footprint */
      if (tent && roofT) { const xy = at(roofT[0], roofT[1]); tent.x = xy[0]; tent.y = xy[1]; planted = { key: tent.key, roof: roofT }; }
    }
    return { where: C.fvWhere(pieces, men), left: F.left || [], planted };
  }, !!plant).catch(e => ({ err: String(e).slice(0, 160) }));
}
function fightMasks(c, W, H) {
  const m = [[0, 0, W, 110], [0, H - 64, W, H]];
  if (c) c.units.forEach(u => { const a = [c.sx0 + (u.x + 0.5) * c.tw, c.sy0 + (u.y + 0.9) * c.th], hgt = c.man * 1.15; m.push([a[0] - hgt * 0.7, a[1] - hgt * 1.1, a[0] + hgt * 0.7, a[1] + hgt * 0.4]); });
  return m;
}

if (require.main === module) (async () => {
  console.log('THE CAMP IS SET UP ON THE BOARD WHILE HE WATCHES' + (QUICK ? ' (quick: upright, a suburb)' : ''));
  const errs = [];
  let skipped = false, planted = false;
  for (const way of WAYS) {
    let d;
    try { d = await open({ profile: way.profile, door: 120000, engage: true }); }
    catch (e) { ok('the demo opened ' + way.name, false, String(e.message).slice(0, 160)); continue; }
    const p = d.page, W = way.profile === 'phone_portrait' ? 390 : 844, H = way.profile === 'phone_portrait' ? 844 : 390;
    p.on('pageerror', e => { const st = String(e && e.stack || ''); if (/camp_(look|board)|bohemia_motion|SETTLEMENT|campSettingUp|campHold/.test(st)) errs.push(String(e && e.message || e).slice(0, 140)); });
    try {
      await p.waitForTimeout(2500);
      const boards = QUICK ? BOARDS.slice(0, 1) : BOARDS;
      for (let bi = 0; bi < boards.length; bi++) {
        const B = boards[bi], tag = B.name + ', ' + way.name, skip = !QUICK && !skipped && bi === 1 && way.profile === 'phone_portrait';
        const r = await K.oneFight(d, { fam: B.fam, end: bi === 0 && way.profile === 'phone_portrait' ? 'auto' : 'won', watch: true, skip, lootMs: LOOT_MS });
        if (r.err || !r.watch) { ok('S1 ' + tag + ': a fight there, won, MAKE CAMP', false, r.err || 'no watch'); continue; }
        const S = r.watch.samples || [], tapT = 0, endT = S.filter(q => q.pitch === 'on').reduce((m, q) => Math.max(m, q.t), 0) || (S.length ? S[S.length - 1].t - 3500 : 0);
        /* S1: what the glass held, and every shot of it against the fight's last frame */
        const g = glassHeld(S, endT);
        if (bi === 0 && way.profile === 'phone_portrait') keep('now', r, endT);
        const lootGone = (S.find((q, i) => !q.spoils && i > 0 && !q.busy) || S.find(q => !q.spoils) || { t: 0 }).t, M = fightMasks(r.cam, W, H), shots = r.watch.shots.filter(q => q.t >= lootGone + 150 && q.t <= endT + 300), rs = [];   /* from the loot screen gone (it is the fight's own end, over its board) */
        for (let i = 0; i < shots.length; i += Math.max(1, Math.floor(shots.length / 14))) { const sim = await K.same(d, r.fightShot, shots[i].png, M, W, H).catch(() => null); rs.push({ t: shots[i].t, r: sim ? Math.round(sim.r * 100) / 100 : null }); }
        const low = rs.filter(q => q.r == null || q.r < 0.3);
        ok('S1 ' + tag + ': THE CAMERA NEVER LEAVES THE BOARD: the fight, its held last frame or the camp on its view at every tenth of a second, never the map; every shot from the loot screen gone alike to the fight\'s last frame (0.3+)',
          g.ok && rs.length >= 3 && !low.length, g.why + '; shots ' + rs.map(q => q.r).join(' ') + (low.length ? ' (low at ' + low.map(q => q.t + ' ms').join(', ') + ')' : ''));
        const c = clockHeld(S, tapT, endT);
        ok('S2 ' + tag + ': THE CLOCK STOPPED FOR THE SET-UP: the same from the tap to its end, a second or more of set-up, then the hours run', skip ? c.ok || /the hours ran after: true/.test(c.why) && !/[1-9]\d* samples moved/.test(c.why) : c.ok, c.why);
        if (skip) {
          const sk = S.slice(Math.max(0, S.findIndex(q => q.pitch === 'on'))).some(q => q.pitch === 'skipped');
          ok('S5 ' + tag + ': A TAP SKIPS IT: a tap on the glass mid set-up ends it, and the hours run', sk && /the hours ran after: true/.test(c.why), 'skipped ' + sk + '; ' + c.why);
          skipped = true;
        } else {
          const R = await K.atRest(d), acts = (R && R.acts) || [], spots = (R && R.spots) || [], gl = R && R.glass;
          const onGlass = (x, y) => !!gl && x > gl.x0 + 20 && x < gl.x1 - 20 && (gl.y0 == null || (y > gl.y0 + 60 && y < gl.y1 - 20));
          const deadSeen = (R && R.bodies || []).filter(b => onGlass(b.x, b.y)).length, loot = spots.filter(q => q.act === 'loot'), watchMan = acts.filter(a => a.act === 'watch' || a.lookout);
          const walked = S.some(q => q.pitch === 'on') && S.filter(q => q.pitch === 'on').length >= 10;
          ok('S3 ' + tag + ': HE WATCHES THEM SET IT UP: the set-up played on the board (the fire lit in it, his men walk from where they won), then a man at the dead and one on watch',
            walked && !S.slice(S.findIndex(q => q.pitch === 'on')).some(q => q.pitch === 'skipped') && (loot.length >= 1 || !deadSeen) && watchMan.length >= 1, JSON.stringify({ setupSamples: S.filter(q => q.pitch === 'on').length, loot: loot.map(q => q.name), deadOnGlass: deadSeen, watch: watchMan.map(a => a.name), acts: acts.map(a => a.name + ' ' + a.act).join(', ') }));
        }
        const wr = await where(p, false), og = onGround(wr && wr.where);
        ok('S4 ' + tag + ': NOTHING OF THE CAMP ON A BUILDING: every piece\'s footprint and every man\'s feet on open ground of the board' + (wr && wr.left && wr.left.length ? ' (left out, no open ground for it: ' + wr.left.join(', ') + ')' : ''), !!wr && !wr.err && og.ok, (wr && wr.err) || og.why);
        if (!planted) { const pw = await where(p, true), pg = onGround(pw && pw.where);
          ok('P1 PLANTED: a tent laid on a roof tile of the fight (' + JSON.stringify(pw && pw.planted) + '): S4\'s check goes RED, on the roof', !!pw && !!pw.planted && !pg.ok && /"roof":true/.test(pg.why), pg.why); planted = true; }
        await K.breakCamp(d).catch(() => {});
      }
      /* P2 once, upright: the order as it was, the same watch */
      if (way.profile === 'phone_portrait') {
        await p.evaluate(() => { window.__CAMP_HOLD_OFF = true; try { document.getElementById('cityFrame').contentWindow.__CAMP_CLOCK_DURING_SETUP = true; } catch (e) {} });
        const r = await K.oneFight(d, { fam: BOARDS[0].fam, end: 'won', watch: true, lootMs: LOOT_MS });
        await p.evaluate(() => { window.__CAMP_HOLD_OFF = false; try { document.getElementById('cityFrame').contentWindow.__CAMP_CLOCK_DURING_SETUP = false; } catch (e) {} });
        const S = (r.watch && r.watch.samples) || [], endT = S.filter(q => q.pitch === 'on').reduce((m, q) => Math.max(m, q.t), 0);
        const g = glassHeld(S, endT), c = clockHeld(S, 0, endT);
        keep('before', r, endT || 6000);
        ok('P2 PLANTED: the order as it was (window.__CAMP_HOLD_OFF, __CAMP_CLOCK_DURING_SETUP): S1\'s or S2\'s check goes RED', !g.ok || !c.ok, 'S1: ' + g.why + ' | S2: ' + c.why);
        await K.breakCamp(d).catch(() => {});
      }
    } catch (e) { ok('the walk ' + way.name, false, String(e && e.stack || e).slice(0, 300)); }
    await d.close();
  }
  ok('A1 nothing of the camp or the hold threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nTHE CAMP IS SET UP ON THE BOARD: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
