/* THE CREW SCREEN SEES THE FIGHT  (ANIMATION [crew screen after a fight], rule 369 amended 11/4, ask line 433, 11/7/26)

   PAOLO 11/4: 'if I level up my character right after [a fight], and it's doing the victory screen and they're scavenging the remains,
   if you bring up the crew screen it should be showing them in that victory scavenging background, not just them at the camp.'
   THE COORDINATOR 11/7: the battlefield with his men going through the dead, the fight's own board and the rig's existing poses (rule
   430), simple and quick, 60 on a phone, nothing shown he did not tap for (rule 433), inside UI 9's sizes.

   MEASURED BEFORE (the demo, 390 x 844, a road fight won, CHOOSE HIS LEVEL-UP on the end screen): the company screen opened on COOK
   FOUR's camp picture (camp-0), his three men round a fire (records/target/animation/crew_after_fight/before_phone.png).

   On the DEMO, through the one driver, with a finger, upright (390 x 844) and on its side (844 x 390): a road fight won, one of his
   men given a level (upright: a friend down; on its side: a man who ran, so not on the board), the end screen's CHOOSE HIS LEVEL-UP
   tapped:
     F1 THE FIGHT'S OWN BOARD: the company screen's picture is the fight that just ended (the same baked board the fight drew, read off
        the fight still standing behind), the dead and the down where the fight left them, every man of his who can walk in it; no
        camp picture; the end screen's own copy holds still while the company screen is up (one scene plays at a time)
     F2 HIS MEN GO THROUGH THE DEAD: over twelve seconds every man who can walk is seen walking and seen stopped at a body or a friend
        down, and at least one kneels in a dead man's coat (ANIMATION's loot, the rig's existing act); the friend down is gone to
     F3 THE MAN PICKED, IN THE MIDDLE OF HIS SHEET: the camera holds him with his feet within 14 points of where his figure's feet are
        (unless the board's own edge holds it, then said), between his slot columns; the board draws him, so his sheet's figure
        stands down; his people the figure's size (98 points, rule 21)
     F4 A FINGER ON EACH MAN IN THE LINE GLIDES THE CAMERA TO HIM: a glide starts, is drawn every frame, lands inside a beat and a
        tenth (planned 450 ms, landed under 550) with him in the middle as F3
     F5 A FINGER ON A MAN ON THE GROUND picks him, and the camera glides to him the same way
     F6 A MAN NOT ON THE BOARD (on its side: the man who ran) stands as his sheet's own figure, at the middle, among them
     F7 NOTHING PRINTED ON IT (rule 433): the picture adds one canvas, hidden from the reader, no finger on it, and the player draws no
        words (no fillText or strokeText in it)
     F8 THE WORDS AT THE FLOOR: every word that sits on the picture reads at 4.5 to 1 or better against the pixels behind it (the
        brightest and darkest tenth), measured off the screen with the words taken out, at open, after the glides and after the watch
     F9 60 ON A PHONE: the picture's own draw under 8 ms a frame on average and 12 at the 95th (its twelve a second, and every frame of a
        glide: three quarters of a 60 Hz count at least); the page's frames a second with it playing within 15 percent of the same
        page with its clock held (the box's late frames are said beside, not judged: it has no phone's GPU)
     F10 DONE ON THE PHONE goes back to the end screen as he left it, and its own copy plays again; no page error
   PLANTED (upright): the camp put back (the fight's end not yet read: F1 catches it); the camera frozen on a tap (F4); his men held
   still (F2).
   node gates/the_crew_screen_sees_the_fight_gate.js [phone_portrait|phone_landscape] [--shoot] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const SHOOT = process.argv.indexOf('--shoot') >= 0, SHOTS = path.join(ROOT, 'records/target/animation/crew_after_fight');
if (SHOOT) fs.mkdirSync(SHOTS, { recursive: true });
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const NEAR = 14, BEAT = 550, FLOOR = 4.5;

/* ---- the judges (the same for the real run and the plants) ---- */
const judgeF1 = (s, fought) => s.kind === 'fight' && s.from === 'fight' && s.same && !s.src && JSON.stringify(s.lying) === JSON.stringify(fought.lying) && JSON.stringify(s.up) === JSON.stringify(fought.walk);
const judgeF2 = (seen, walk, downIds) => { const ids = Object.keys(seen);
  return ids.length === walk.length && ids.length > 0 && ids.every(id => seen[id].walk > 0 && seen[id].stop > 0) && ids.some(id => seen[id].loot > 0)
    && downIds.every(d => ids.some(id => seen[id].stops['body:' + d])); };
const judgeLand = (w) => !!w && w.sel === w.held && w.inMiddle && (w.dist <= NEAR || w.edge);

/* in the company screen: the picture, what it reads, the man held and where he lands */
const SEEN = () => {
  const R = window.BohemiaRosterScreen, C = R.camp, A = window.BohemiaAftermath, st = A && A.state();
  let same = false; try { const fw = window.parent.parent.document.getElementById('fightFrame').contentWindow; same = !!st && st.same(fw.FIGHT_UI.board); } catch (_e) {}
  return { kind: C.kind, from: st && st.from, same, src: C.c && C.c.dataset.src || null,
    lying: st ? st.lying.map(m => m.id + '@' + m.x + ',' + m.y).sort() : [], up: st ? st.men.map(m => m.id).sort() : [], n: st ? st.men.length : 0 };
};
const WHERE = () => {
  const R = window.BohemiaRosterScreen, A = window.BohemiaAftermath, st = A.state(), sel = (R.state.crew[R.state.sel] || {}).name, sp = R.campSpot();
  const q = R.campMenOnGlass().find(m => m.name === sel), v = st.view, b = st.board;
  const sl = [...document.querySelectorAll('#card .gslot')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0);
  const left = Math.max(0, ...sl.filter(r => sp && r.right <= sp.x).map(r => r.right)), right = Math.min(innerWidth, ...sl.filter(r => sp && r.left >= sp.x).map(r => r.left));
  const W = st.canvas[0], H = st.canvas[1], bw = b.bw * v.k, bh = b.bh * v.k;
  const edge = Math.abs(v.ox) < 1 || Math.abs(v.ox - (W - bw)) < 1 || Math.abs(v.oy) < 1 || Math.abs(v.oy - (H - bh)) < 1;
  const fig = document.querySelector('#card .rbody'), figOn = !!fig && getComputedStyle(fig).visibility !== 'hidden';
  return { sel, held: st.held, sp: sp && [Math.round(sp.x), Math.round(sp.y)], at: q && [Math.round(q.x), Math.round(q.y)], h: q && q.h,
    dist: q && sp ? Math.round(Math.hypot(q.x - sp.x, q.y - sp.y)) : null, inMiddle: !!q && q.x > left && q.x < right && q.y > 0 && q.y < innerHeight, edge,
    figOn, town: document.documentElement.classList.contains('bm-camp-town'), glides: st.glides, glide: st.glide, gliding: st.gliding, onBoard: !!q };
};
/* the words on the picture (the screen's own list) and their ink; the luminance of the pixels behind each, read off a screenshot */
async function floor(p, rf, dpr) {
  const words = await rf.evaluate(() => { const fe = window.frameElement.getBoundingClientRect();
    return window.BohemiaRosterScreen.campWords().map(e => { const r = e.getBoundingClientRect(); return { t: e.textContent.trim().slice(0, 28), x: r.left + fe.left, y: r.top + fe.top, w: r.width, h: r.height, c: getComputedStyle(e).color }; }); });
  await rf.evaluate(() => { const st = document.createElement('style'); st.id = 'gate-nowords'; st.textContent = '*{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important}'; document.head.appendChild(st); });
  await p.waitForTimeout(60);
  const png = await p.screenshot();
  await rf.evaluate(() => { const st = document.getElementById('gate-nowords'); if (st) st.remove(); });
  const L = await p.evaluate(async ({ b64, rects }) => {
    const im = new Image(); await new Promise(r => { im.onload = r; im.src = 'data:image/png;base64,' + b64; });
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return rects.map(q => { const x = Math.max(0, Math.round(q.x)), y = Math.max(0, Math.round(q.y)), w = Math.max(1, Math.min(c.width - x, Math.round(q.w))), h = Math.max(1, Math.min(c.height - y, Math.round(q.h)));
      const d = g.getImageData(x, y, w, h).data, a = []; for (let i = 0; i < d.length; i += 4) a.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]));
      a.sort((m, n) => m - n); return { lo: a[Math.floor(a.length * 0.1)], hi: a[Math.min(a.length - 1, Math.floor(a.length * 0.9))] }; });
  }, { b64: png.toString('base64'), rects: words.map(r => ({ x: r.x * dpr, y: r.y * dpr, w: r.w * dpr, h: r.h * dpr })) });
  const lumC = (rgb) => { const m = String(rgb).match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return words.map((w, i) => ({ t: w.t, k: Math.min(ratio(lumC(w.c), L[i].lo), ratio(lumC(w.c), L[i].hi)) }));
}

async function side(profile) {
  console.log('\n' + profile);
  const UP = profile === 'phone_portrait', dpr = 3, name = UP ? 'UPRIGHT' : 'ON ITS SIDE';
  let d;
  try { d = await drive.open({ profile, keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok(name + ' the demo boots', false, String(e.message).slice(0, 160)); return; }
  const p = d.page, fr = d.fr, errs = []; p.on('pageerror', e => errs.push(e.message));
  try {
    await p.waitForTimeout(2500);
    /* out of the town the demo opens in, off its safe ground, and a road fight through the map's own door */
    const sf0 = p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url())); if (sf0) { await sf0.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); }).catch(() => {}); await p.waitForTimeout(4000); }
    /* off any town's ground (a town is safe, and its door holds a crew that comes to him), then a road fight through the map's own door */
    const road = await fr.evaluate(() => { const clear = (x, y) => { try { return !townSafeAt(x, y) && !townGround(x, y); } catch (_e) { return true; } };
      if (!clear(city.x, city.y)) { outer: for (let r = 4; r < 80; r += 2) for (let a = 0; a < 8; a++) { const x = Math.round(city.x + r * Math.cos(a * Math.PI / 4)), y = Math.round(city.y + r * Math.sin(a * Math.PI / 4)); if (clear(x, y)) { city.x = x + 0.5; city.y = y + 0.5; break outer; } } }
      try { stepOnce(0); stepOnce(4); } catch (_e) {}
      return { at: [city.x, city.y], went: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 51 }) }; });
    let f = null;
    for (let i = 0; i < 200 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) { ok(name + ' a road fight through the map\'s door', false, JSON.stringify(road)); return; }
    await p.waitForTimeout(1200);
    /* won: theirs dead where they stand; upright one of his down (a friend to go to), on its side one of his ran (not on the board);
       the second of his given a level, so the end screen offers CHOOSE HIS LEVEL-UP */
    const fought = await f.evaluate((UP) => { const S = FIGHT.S, now = performance.now();
      S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u._fallAt = now - 4000; });
      const you = S.units.filter(u => u.side === 'you'), last = you[you.length - 1];
      if (you.length > 2) { if (UP) { last.down = true; last._fallAt = now - 4000; } else last.fled = true; }
      you[1].xpGained = 400;
      S.over = true; S.result = 'won'; showOver('won');
      return { lying: S.units.filter(u => !u.fled && (u.dead || u.down)).map(u => u.id + '@' + u.x + ',' + u.y).sort(), walk: S.units.filter(u => u.side === 'you' && !u.dead && !u.down && !u.fled).map(u => u.id).sort(),
        down: S.units.filter(u => u.side === 'you' && u.down && !u.dead).map(u => u.id), ran: S.units.filter(u => u.fled).map(u => u.name), level: you[1].name }; }, UP);
    const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaAftermath && BohemiaAftermath.state().on).catch(() => false)); i++) await p.waitForTimeout(200);
    await p.waitForTimeout(1200);
    const sf = SF(); if (!sf) { ok(name + ' the end screen came up', false); return; }
    const rf0 = () => p.frames().find(x => /ROSTER_SCREEN/.test(x.url()));
    const openDoor = async () => {
      const at = await sf.evaluate(() => { const b = document.querySelector('button.perk'); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, b.textContent]; });
      if (!at) return null;
      const fb = await (await sf.frameElement()).boundingBox(); await p.touchscreen.tap(fb.x + at[0], fb.y + at[1]);
      let rf = null; for (let i = 0; i < 80; i++) { rf = rf0(); if (rf && await rf.evaluate(() => { const R = window.BohemiaRosterScreen; return !!R && !!R.camp.c && +R.camp.c.style.opacity === 1 && !!R.camp.t.drawn; }).catch(() => false)) break; rf = null; await p.waitForTimeout(250); }
      return rf ? { rf, label: at[2] } : null;
    };
    const closeDoor = async () => {
      const tapped = await p.evaluate(() => { const b = document.querySelector('#bohphone.on .crewp .cdone'); if (!b) return null; const r = b.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; });
      if (tapped) await p.touchscreen.tap(tapped[0], tapped[1]); else await sf.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (_e) {} });
      for (let i = 0; i < 30 && await sf.evaluate(() => !!document.getElementById('crewdoor')); i++) await p.waitForTimeout(200);
      return !!tapped;
    };
    /* PLANTED, upright, first: the fight's end not read yet (it reads as a fight still on): the company screen falls back to the camp */
    if (UP) {
      await f.evaluate(() => { FIGHT.S.over = false; });
      const o = await openDoor();
      if (o) { await p.waitForTimeout(800); const s = await o.rf.evaluate('(' + SEEN + ')()');
        ok('PLANTED: the camp put back is caught (F1)', !judgeF1(s, fought), s.kind + ', ' + (s.src || 'no picture')); await closeDoor(); }
      else ok('PLANTED: the company screen opened for the plant', false);
      await f.evaluate(() => { FIGHT.S.over = true; });
      await p.waitForTimeout(800);
    }
    const o = await openDoor();
    if (!o) { ok(name + ' CHOOSE HIS LEVEL-UP on the end screen opens the company screen', false); return; }
    const rf = o.rf, fo = await (await rf.frameElement()).boundingBox();
    ok(name + ' a finger on "' + o.label + '" on the end screen opens the company screen', true);
    /* F1 */
    const af0 = await sf.evaluate(() => BohemiaAftermath.state().frames);
    const s1 = await rf.evaluate('(' + SEEN + ')()');
    await p.waitForTimeout(2000);
    const af1 = await sf.evaluate(() => BohemiaAftermath.state().frames);
    ok(name + ' F1 THE FIGHT\'S OWN BOARD: the same baked board, the dead and the down where the fight left them, every man who can walk; no camp picture; the end screen\'s copy holds still',
      judgeF1(s1, fought) && af1 === af0, s1.kind + ', ' + s1.lying.length + ' lying (' + s1.lying.join(' ') + '), ' + s1.up.length + ' up; the end screen\'s frames ' + af0 + ' then ' + af1);
    /* F3 and F8 at open */
    const w0 = await rf.evaluate('(' + WHERE + ')()');
    ok(name + ' F3 THE MAN PICKED (' + w0.sel + ') in the middle of his sheet, the board drawing him (his sheet\'s figure stands down), the figure\'s size',
      judgeLand(w0) && !w0.figOn && w0.town && Math.abs(w0.h - 98) <= 2, 'at ' + w0.at + ' vs ' + w0.sp + ', ' + w0.dist + ' pt' + (w0.edge ? ' (the board\'s edge)' : '') + ', ' + w0.h + ' pt tall');
    if (SHOOT) await p.screenshot({ path: path.join(SHOTS, 'after_' + profile + '_open.png') });
    const fl = [], fx = async (tag) => { const r = await floor(p, rf, dpr); fl.push(...r.map(x => Object.assign({ tag }, x))); };
    await fx('open');
    /* F2: twelve seconds of watching from the open (the camera holds the man picked) */
    const watch = async (n) => { const seen = {};
      for (let k = 0; k < n; k++) {
        const st = await rf.evaluate(() => BohemiaAftermath.state().men.map(m => ({ id: m.id, act: m.act, drawn: m.drawn, stop: m.stop })));
        st.forEach(m => { const e = seen[m.id] = seen[m.id] || { walk: 0, stop: 0, loot: 0, stops: {} };
          if (m.drawn === 'walk') e.walk++; if (/^(loot|tend|smoke|talk|watch)$/.test(m.act) && m.drawn !== 'walk') e.stop++; if (m.drawn === 'act:loot') e.loot++;
          if (m.stop && m.drawn !== 'walk') e.stops[m.stop] = (e.stops[m.stop] || 0) + 1; });
        await p.waitForTimeout(250);
      } return seen; };
    const seen = await watch(48);
    ok(name + ' F2 HIS MEN GO THROUGH THE DEAD (twelve seconds): every man who can walk seen walking and stopped at a body or a friend, one kneeling in a dead man\'s coat, the friend down gone to',
      judgeF2(seen, fought.walk, fought.down), Object.keys(seen).map(id => id + ' walk ' + seen[id].walk + ' stop ' + seen[id].stop + ' loot ' + seen[id].loot + ' at ' + Object.keys(seen[id].stops).join('/')).join('; '));
    if (SHOOT) await p.screenshot({ path: path.join(SHOTS, 'after_' + profile + '_watch.png') });
    if (UP) {
      await rf.evaluate(() => BohemiaAftermath.hold(true)); const held = await watch(12); await rf.evaluate(() => BohemiaAftermath.hold(false));
      ok('PLANTED: his men held still are caught (F2)', !judgeF2(held, fought.walk, fought.down), Object.keys(held).map(id => id + ' walk ' + held[id].walk).join(', '));
    }
    await fx('after the watch');
    /* F4: each man in the line by a finger */
    const names = await rf.evaluate(() => window.BohemiaRosterScreen.state.crew.filter(m => m && !m.dead).map(m => m.name));
    const onBoard = [], bad = [], frames = [];
    const sel0 = await rf.evaluate(() => (window.BohemiaRosterScreen.state.crew[window.BohemiaRosterScreen.state.sel] || {}).name), i0 = Math.max(0, names.indexOf(sel0));
    for (const n of names.slice(i0 + 1).concat(names.slice(0, i0 + 1))) {
      const at = await rf.evaluate((n) => { const R = window.BohemiaRosterScreen, i = R.state.crew.findIndex(m => m.name === n); const c = document.querySelector('.cell[data-man="' + i + '"]'); if (!c) return null; const r = c.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, n);
      if (!at) { bad.push(n + ' not in the line'); continue; }
      const b4 = await rf.evaluate(() => BohemiaAftermath.state().glides), was = await rf.evaluate(() => BohemiaAftermath.state().held);
      await p.touchscreen.tap(fo.x + at[0], fo.y + at[1]);
      await p.waitForTimeout(BEAT + 150);
      for (let i = 0; i < 15 && await rf.evaluate(() => BohemiaAftermath.state().gliding); i++) await p.waitForTimeout(100);
      const w = await rf.evaluate('(' + WHERE + ')()');
      if (fought.ran.indexOf(n) >= 0) { onBoard.push({ n, w }); continue; }
      const g = w.glide, good = w.sel === n && (was === n || w.glides > b4 && g && g.who === n && g.ms != null && g.plan <= 500 && g.ms <= BEAT) && judgeLand(w);   /* a man the camera already holds needs no glide */
      if (g) frames.push({ n, frames: g.frames, gap: g.gap, ms: g.ms });
      if (!good) bad.push(n + ': picked ' + w.sel + ', held ' + w.held + ' (was ' + was + '), glides ' + b4 + ' then ' + w.glides + ' (' + (g && g.who) + '), glide ' + (g ? g.ms + ' ms (' + g.frames + ' frames, latest ' + g.gap + ')' : 'none') + ', at ' + w.at + ' vs ' + w.sp + (w.edge ? ' (edge)' : '') + (w.inMiddle ? '' : ' OUTSIDE THE MIDDLE'));
    }
    ok(name + ' F4 a finger on each man in the line glides the camera to him inside a beat, him in the middle of his sheet', bad.length === 0 && frames.length > 0,
      bad.length ? bad.join(' | ') : frames.map(x => x.n + ' ' + x.ms + ' ms').join(', '));
    if (SHOOT) await p.screenshot({ path: path.join(SHOTS, 'after_' + profile + '_glided.png') });
    await fx('after the glides');
    /* F6: the man who ran */
    if (!UP) { const r = onBoard[0];
      ok(name + ' F6 A MAN NOT ON THE BOARD (' + (r ? r.n : '-') + ', who ran) stands as his sheet\'s own figure at the middle, among them, nobody of the board held under him', !!r && r.w.sel === r.n && r.w.figOn && !r.w.town && !r.w.onBoard && r.w.held === null,
        r ? 'figure ' + (r.w.figOn ? 'shown' : 'hidden') + ', on the board ' + r.w.onBoard + ', the camera holds ' + (r.w.held || 'the scene\'s middle') : 'no man ran'); }
    /* F5: a finger on a man on the ground (another of his, clear of the sheet) */
    const findT = () => rf.evaluate(() => { const R = window.BohemiaRosterScreen, sel = (R.state.crew[R.state.sel] || {}).name;
      for (const q of R.campMenOnGlass()) { if (q.name === sel) continue;
        for (const dy of [0.5, 0.35, 0.65, 0.2, 0.8]) for (const dx of [0, -6, 6]) { const x = q.x + dx, y = q.y - q.h * dy; if (x < 4 || y < 4 || x > innerWidth - 4 || y > innerHeight - 4) continue;
          if (!R.campTapOpen(x, y)) continue; const who = R.campManAtPoint(x, y); if (!who || who.name !== q.name) continue;
          /* one man's body under the finger, with room round it (a friend down is tended by a man standing over him) */
          if (R.campMenOnGlass().some(o => o.name !== q.name && Math.abs(x - o.x) <= Math.max(22, o.h * 0.28) + 10 && y <= o.y + 18 && y >= o.y - o.h - 16)) continue;
          let ph = null; try { const e = window.top.document.querySelector('#bohphone.on'); if (e) { const r = e.getBoundingClientRect(), fe = window.frameElement.getBoundingClientRect(); ph = [r.left - fe.left, r.top - fe.top, r.right - fe.left, r.bottom - fe.top]; } } catch (_e) {}
          if (ph && x >= ph[0] && x <= ph[2] && y >= ph[1] && y <= ph[3]) continue;
          return { n: q.name, x, y }; } }
      return null; });
    let target = await findT();
    for (const n of names) { if (target) break; await rf.evaluate((n) => { const R = window.BohemiaRosterScreen; R.choose(R.state.crew.findIndex(m => m.name === n)); }, n);
      await p.waitForTimeout(BEAT + 150); for (let i = 0; i < 15 && await rf.evaluate(() => BohemiaAftermath.state().gliding); i++) await p.waitForTimeout(100); target = await findT(); }
    if (target) { const b4 = await rf.evaluate(() => BohemiaAftermath.state().glides);
      await p.touchscreen.tap(fo.x + target.x, fo.y + target.y);
      for (let i = 0; i < 15 && await rf.evaluate(() => BohemiaAftermath.state().gliding); i++) await p.waitForTimeout(100);
      const w = await rf.evaluate('(' + WHERE + ')()');
      ok(name + ' F5 a finger on a man on the ground (' + target.n + ') picks him and the camera glides to him', w.sel === target.n && w.glides > b4 && judgeLand(w),
        'tapped at ' + Math.round(target.x) + ',' + Math.round(target.y) + '; picked ' + w.sel + ', held ' + w.held + ', glides ' + b4 + ' then ' + w.glides + ', at ' + w.at + ' vs ' + w.sp + (w.edge ? ' (edge)' : '') + (w.inMiddle ? '' : ' OUTSIDE THE MIDDLE'));
    } else ok(name + ' F5 a man of his on the open ground to tap', false, 'none clear of the sheet');
    await fx('after the tap on the ground');
    const worst = fl.slice().sort((a, b) => a.k - b.k)[0];
    ok(name + ' F8 THE WORDS AT THE FLOOR: every word on the picture at ' + FLOOR + ' to 1 or better (open, after the watch, after the glides, after the tap on the ground)', fl.length > 0 && fl.every(x => x.k >= FLOOR),
      fl.length + ' readings; the worst "' + (worst && worst.t) + '" ' + (worst ? worst.k.toFixed(2) + ' (' + worst.tag + ')' : '-'));
    /* PLANTED, upright: the camera frozen on a tap (the scene's clock held: no glide, he is not brought to the middle) */
    if (UP) {
      const nx = await rf.evaluate(() => { const R = window.BohemiaRosterScreen, o = R.order(); return o[(o.indexOf(R.state.sel) + 1) % o.length]; });
      const b4 = await rf.evaluate(() => BohemiaAftermath.state().glides);
      await rf.evaluate((nx) => { BohemiaAftermath.hold(true); window.BohemiaRosterScreen.choose(nx); }, nx); await p.waitForTimeout(BEAT + 150);
      const w = await rf.evaluate('(' + WHERE + ')()'); await rf.evaluate(() => BohemiaAftermath.hold(false));
      ok('PLANTED: the camera frozen on a tap is caught (F4)', !(w.glides > b4 && judgeLand(w)), (w.glides - b4) + ' glides, ' + w.dist + ' pt off');
      await p.waitForTimeout(BEAT + 300);
    }
    /* F7 */
    const f7 = await rf.evaluate(() => { const c = document.getElementById('campbg'), cs = c && getComputedStyle(c); return { tag: c && c.tagName, aria: c && c.getAttribute('aria-hidden'), pe: cs && cs.pointerEvents, words: c ? c.textContent.trim().length : -1 }; });
    const src = fs.readFileSync(path.join(ROOT, 'slices/bohemia_aftermath.js'), 'utf8'), texts = (src.match(/\b(fillText|strokeText)\s*\(/g) || []).length;
    ok(name + ' F7 NOTHING PRINTED ON IT: one canvas, hidden from the reader, no finger on it, its player draws no words', f7.tag === 'CANVAS' && f7.aria === 'true' && f7.pe === 'none' && f7.words === 0 && texts === 0, JSON.stringify(f7) + ', words drawn by the player ' + texts);
    /* F9 */
    const rate = () => rf.evaluate(() => new Promise(res => { let n = 0; const t0 = performance.now(); const fr2 = () => { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(fr2); else res(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(fr2); }));
    const held = [], run = [], med = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
    for (let k = 0; k < 4; k++) { await rf.evaluate(() => BohemiaAftermath.hold(true)); held.push(await rate()); await rf.evaluate(() => BohemiaAftermath.hold(false)); run.push(await rate()); }
    const s9 = await rf.evaluate(() => BohemiaAftermath.state()), gaps = frames.map(x => x.gap), worstGap = Math.max(0, ...gaps);
    ok(name + ' F9 60 ON A PHONE: the picture\'s draw ' + s9.msAvg.toFixed(2) + ' ms a frame on average, ' + s9.msP95.toFixed(1) + ' at the 95th; each glide drawn every frame; the page ' + med(run).toFixed(0) + ' frames a second with it, ' + med(held).toFixed(0) + ' held',
      s9.msAvg < 8 && s9.msP95 < 12 && frames.length > 0 && frames.every(x => x.frames >= 0.75 * x.ms / (1000 / 60)) && med(run) >= med(held) * 0.85 - 1 && s9.errs === 0,
      frames.map(x => x.n + ' ' + x.frames + ' frames in ' + x.ms + ' ms').join(', ') + ' (this box has no phone\'s GPU: its latest frame ' + worstGap + ' ms is said, not judged); errors ' + s9.errs);
    /* F10 */
    const a0 = await sf.evaluate(() => BohemiaAftermath.state().frames);
    const byPhone = await closeDoor(); await p.waitForTimeout(1500);
    const back = await sf.evaluate(() => ({ door: !!document.getElementById('crewdoor'), frames: BohemiaAftermath.state().frames, on: BohemiaAftermath.state().on }));
    ok(name + ' F10 DONE ' + (byPhone ? 'on the phone' : '(the door\'s own close: the phone had no DONE)') + ' goes back to the end screen, its own copy playing again', byPhone && !back.door && back.on && back.frames > a0, a0 + ' then ' + back.frames + ' frames');
    ok(name + ' no page error', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok(name + ' ran to the end', false, String(e && e.message).slice(0, 240)); }
  finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  const only = process.argv.slice(2).filter(a => !/^--/.test(a))[0];
  for (const pr of ['phone_portrait', 'phone_landscape']) if (!only || only === pr) await side(pr);
  console.log('\nTHE CREW SCREEN SEES THE FIGHT: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
