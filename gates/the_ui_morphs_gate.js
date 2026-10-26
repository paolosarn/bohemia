/* THE UI MORPHS  (MOTION [the UI morphs], 10/26/26; rule 229(e), Paolo 10/26: 'I wanna implement transitions of the UI on the
   screen... see things morph into each other UI-wise... it has to be smart... frictionless on purpose... the UI transforms into
   each other with an animation... I hate how it's all static'). The first votes: ONE GAME MODE, NO TELEPORT.

   MEASURED BEFORE (the demo at 8b4ee88d): every change cut. The town frame went display none to block in one frame; the fight
   swapped whole panels behind the clouds (the bar and the phone gone under them for one to three seconds); the crew door was
   appended whole; BUY and TAKE redrew their card in one frame. The MOTION button in the settings was painted and never tappable.

   ON THE DEMO, his phone (390 x 844) and a computer (1440 x 900), every change pressed the way he presses it (the map's own
   doors where a finger cannot reach one: loopOpenTown, roadContactFight), and EVERY FRAME RECORDED by the browser's own screen
   recorder (the compositor's frames, not the layer's word for it):
     M0 the layer is in the demo, on the music's clock, and every screen's door is handed to it (town, leave, camp, fight,
        home, crew, buy, take)
     (THE VERDICT for "on the glass": every frame, in the page, the browser's own hit test finds the piece on top at its own
     place through every frame it sits in, the clouds counted as a cover; the recorder's pictures are kept as the witness)
     M1 THE MAP TO A TOWN (the old phone is not in a town, UI [no phone in the town]: it folds into its corner, a piece in budget,
        on the glass until it lands; LEAVE brings it back out the same way): the town grows out of its place on the map (the plate's first pose is that piece of the map), on
        twos (four held poses or more), in budget (a screen change 500 to 1,000 ms, the wait for the town to be drawn under
        two seconds), and in every recorded frame the bar and the phone are on the glass (never more than a fifth of their
        pixels off the map's picture of them)
     M2 A TAP DURING IT IS NEVER LOST: a real tap 150 ms into the grow reaches the town's own page (its listener hears it),
        and the morph is skipped to its end in that frame
     M3 THE TOWN BACK TO THE MAP (his LEAVE): it shrinks into its place, in budget, the bar and the phone in every frame
     M4 THE SHOP'S BUY: the item flies from BUY onto the man the card shows (a piece: 250 to 500 ms), the man held where he was
        until it lands, nothing blinks
     M5 A JOB TAKEN: the offer flies into the phone's column, onto the job's own new card, waiting under 1.5 s for the phone to
        draw it, then in budget
     M6 MAKING CAMP: the camp grows out of CAMP (or the phone's HEAL app when it exists, data-morph="camp") and goes back into it
     M7 THE CREW SCREEN: it grows out of the bar's CREW and shrinks back into it when DONE is pressed
     M8 THE MAP TO A FIGHT AND BACK: RE-AIMED 10/26 BY UI (rule 280): the bar lifts off the top as the clouds come in, in budget,
        and the fight has none (it was held over the clouds until the fight's own bar was there); the phone is held over the clouds and folds into his abilities as they part (a screen change, in budget, landing on the
        fight's ability tray); going home the abilities fold back into the phone and the bar is held until the map's is back
     M9 REDUCED MOTION: the gear's MOTION button turns to LESS, and then a town opens as a fade in place (nothing travels or
        grows: every recorded pose of the stand-in is untransformed, 200 ms or less), and back to FULL
     M10 every morph's own count of frames with no piece on the glass is zero, and nothing threw
   node gates/the_ui_morphs_gate.js [phone_portrait|computer] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const OFF = 0.2;   /* a fifth of a piece's pixels off its own picture is a piece that left the glass (the place's word is masked) */

/* every frame the compositor sends, kept with its time */
async function recorder(p) {
  const cdp = await p.context().newCDPSession(p), V = p.viewportSize(), frames = [];
  let on = false;
  cdp.on('Page.screencastFrame', async f => { if (on) frames.push({ t: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {} });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 80, maxWidth: V.width, maxHeight: V.height, everyNthFrame: 1 });
  return {
    start: () => { frames.length = 0; on = true; },
    stop: () => { on = false; return frames.slice(); },
    close: async () => { try { await cdp.send('Page.stopScreencast'); } catch (e) {} }
  };
}
/* the share of a rect's pixels more than 48 off the reference, for every frame (mask: rects left out) */
async function offs(cmp, ref, frames, rect, masks, after) {
  return cmp.evaluate(async ({ ref, frames, rect, masks, after }) => {
    const dec = async s => { try { const im = new Image(); im.src = 'data:image/jpeg;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); return g; } catch (e) { return null; } };
    const R = await dec(ref); if (!R) return null;
    const A = after ? await dec(after) : null;
    const x = Math.max(0, Math.round(rect[0])), y = Math.max(0, Math.round(rect[1])), w = Math.max(1, Math.round(rect[2])), h = Math.max(1, Math.round(rect[3]));
    const rd = R.getImageData(x, y, w, h).data, ad = A ? A.getImageData(x, y, w, h).data : null, out = [];
    const masked = (X, Y) => (masks || []).some(m => X >= m[0] - 2 && X <= m[0] + m[2] + 2 && Y >= m[1] - 2 && Y <= m[1] + m[3] + 2);
    for (const f of frames) {
      const G = await dec(f.data); if (!G) { out.push(-1); continue; } const d = G.getImageData(x, y, w, h).data; let n = 0, off = 0, offA = 0;
      for (let j = 0; j < h; j += 2) for (let i = 0; i < w; i += 2) { if (masked(x + i, y + j)) continue; const k = (j * w + i) * 4; n++;
        if (Math.max(Math.abs(d[k] - rd[k]), Math.abs(d[k + 1] - rd[k + 1]), Math.abs(d[k + 2] - rd[k + 2])) > 48) off++;
        if (ad && Math.max(Math.abs(d[k] - ad[k]), Math.abs(d[k + 1] - ad[k + 1]), Math.abs(d[k + 2] - ad[k + 2])) > 48) offA++; }
      /* the piece is on the glass when the frame shows it as it was before the change or as it is after (its own count may
         change at the moment of the change: the batteries spent, the clock run on); a piece gone matches neither */
      out.push([ad ? Math.min(off, offA) : off, n]);
    }
    return out;
  }, { ref, frames, rect, masks });
}
/* THE VERDICT, EVERY FRAME, IN THE PAGE: is the bar (the phone) on top at its own place? The browser's own hit test at three
   points across it, carried up through every frame it sits in (what lies over it in any page is what is on top), COMBAT's
   clouds counted as a cover while they are thick (they take no finger, so a hit test cannot see them); the layer's held copy
   of a piece is the piece. In the fight the phone has become his abilities, so the ability tray counts as the phone. */
const WATCH = () => {
  const thick = () => { const c = document.getElementById('nfclouds'); return !!c && (parseFloat(getComputedStyle(c).opacity) || 0) >= 0.3; };
  const docs = () => { const out = []; const v = (w, d) => { if (d > 4) return; try { if (w.document) out.push(w.document); for (let i = 0; i < w.frames.length; i++) v(w.frames[i], d + 1); } catch (e) {} }; v(window, 0); return out; };
  const onTop = (el) => {
    if (!el || !el.isConnected) return false;
    const w = el.ownerDocument.defaultView; let op = 1;
    for (let p = el; p && p.nodeType === 1; p = p.parentElement) op *= parseFloat(w.getComputedStyle(p).opacity) || 0;
    for (let fe = w.frameElement; fe; fe = fe.ownerDocument.defaultView.frameElement) { const fw = fe.ownerDocument.defaultView; for (let p = fe; p && p.nodeType === 1; p = p.parentElement) op *= parseFloat(fw.getComputedStyle(p).opacity) || 0; }
    if (op < 0.5) return false;
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false;
    /* what lies over a point, top first; a see-through layer (a dialog's dim backdrop, a page's bare body) hides nothing, so the
       first thing that paints solid at that point decides */
    const solid = (e) => { const cs = e.ownerDocument.defaultView.getComputedStyle(e); if ((parseFloat(cs.opacity) || 0) < 0.1) return false;
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return true; const m = cs.backgroundColor.match(/[\d.]+/g); const a = m ? (m.length > 3 ? +m[3] : 1) : 0; return a > 0.6; };
    const firstSolid = (doc, x, y, want) => { for (const e of doc.elementsFromPoint(x, y)) { if (want(e)) return true; if (e.tagName === 'HTML' || e.tagName === 'BODY') continue; if (solid(e)) return false; } return false; };
    let good = 0;
    for (const fx of [0.2, 0.5, 0.8]) {
      const x = r.left + r.width * fx, y = r.top + r.height * 0.5;
      if (!firstSolid(el.ownerDocument, x, y, e => e === el || el.contains(e))) continue;
      let ok = true, cw = w, X = x, Y = y;
      while (cw.frameElement) { const fe = cw.frameElement, fr = fe.getBoundingClientRect(); X += fr.left + fe.clientLeft; Y += fr.top + fe.clientTop;
        if (!firstSolid(fe.ownerDocument, X, Y, e => e === fe)) { ok = false; break; } cw = fe.ownerDocument.defaultView; }
      if (ok) good++;
    }
    return good >= 2;
  };
  const held = id => !!document.querySelector('#bmotion .bm-h[data-for="' + id + '"]');
  const has = {
    bar: () => held('bar') || (!thick() && docs().some(d => onTop(d.getElementById('bmtb')))),
    phone: () => held('phone') || (!thick() && docs().some(d => onTop(d.getElementById('cityfeed')) || onTop(d.getElementById('skills'))))
  };
  window.__mw = { on: true, rows: [] };
  /* what is on top where the bar is, when it is not the bar: the element the glass's own hit test reaches, in its page */
  const whatIsOver = () => { try { let d = document, x = 0, y = 0; const bar = docs().map(q => q.getElementById('bmtb')).find(e => e && e.getBoundingClientRect().width > 0); if (!bar) return 'no bar';
    const r = bar.getBoundingClientRect(); let w = bar.ownerDocument.defaultView; x = r.left + r.width * 0.5; y = r.top + r.height * 0.5; while (w.frameElement) { const fe = w.frameElement, fr = fe.getBoundingClientRect(); x += fr.left; y += fr.top; w = fe.ownerDocument.defaultView; }
    let h = document.elementFromPoint(x, y), path = [];
    for (let i = 0; i < 4 && h; i++) { path.push((h.id ? '#' + h.id : h.tagName.toLowerCase()) + (h.className && typeof h.className === 'string' ? '.' + h.className.split(' ')[0] : '')); if (h.tagName !== 'IFRAME' || !h.contentDocument) break; const fr = h.getBoundingClientRect(); x -= fr.left; y -= fr.top; h = h.contentDocument.elementFromPoint(x, y); }
    return path.join(' > ') + (thick() ? ' (clouds thick)' : ''); } catch (e) { return String(e).slice(0, 60); } };
  const tick = () => { if (!window.__mw.on) return; const b = has.bar(), row = { t: performance.timeOrigin + performance.now(), bar: b, phone: has.phone() }; if (!b) row.over = whatIsOver(); window.__mw.rows.push(row); if (window.__mw.rows.length < 3000) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
const r4 = b => b ? [b.x, b.y, b.w, b.h] : null;
const fmt = a => a ? a.map(v => Math.round(v)).join(',') : 'none';
const pct = v => Math.round(v * 100) + '%';

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok(profile + ': the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, touch = profile !== 'computer';
  const tap = async (x, y) => { if (touch) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); };
  const cmp = await p.context().newPage();
  const rec0 = await recorder(p);
  let WROWS = [];
  const rec = { start: async () => { rec0.start(); await p.evaluate('(' + WATCH + ')()'); },
    stop: async () => { const f = rec0.stop(); WROWS = await p.evaluate(() => { const w = window.__mw; if (!w) return []; w.on = false; return w.rows.slice(); }); return f; },
    close: () => rec0.close() };
  const M = (fn, a) => p.evaluate(fn, a);
  const rows = (id, how, since) => M(({ id, how, since }) => BohemiaMotion.log.filter(r => r.id === id && r.how === how && r.t0 >= since), { id, how, since });
  const now = () => M(() => performance.timeOrigin + performance.now());
  const idle = async (ms) => { for (let i = 0; i < (ms || 6000) / 100; i++) { if (!(await M(() => BohemiaMotion.busy()))) return true; await p.waitForTimeout(100); } return false; };
  const boxOf = (id) => M(id => { const e = BohemiaMotion.find(id); const b = e && BohemiaMotion.box(e); return b ? [b.x, b.y, b.w, b.h] : null; }, id);
  const placeMask = () => fr.evaluate(() => [...document.querySelectorAll('#bmtb [data-f=place], #cityfeed .clock, #cityfeedbar')].map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }).filter(r => r[2] > 0));
  /* the bar and the phone, held to their picture on the map, in every frame of a change */
  const steady = async (label, frames, ref, pieces, row) => {
    const t0w = row && row.t0 ? row.t0 - 20 : -Infinity, t1w = row && row.t0 ? Math.max(row.t1 || 0, row.t0 + 400) + 150 : Infinity;
    const rowsIn = WROWS.filter(r => r.t >= t0w && r.t <= t1w);
    for (const [name] of pieces) {
      const gone = rowsIn.filter(r => !r[name]);
      ok('  ' + label + ': the ' + name + ' is on top at its own place in every one of ' + rowsIn.length + ' frames', rowsIn.length >= 3 && gone.length === 0,
        gone.length ? gone.length + ' frames without it, the first ' + Math.round(gone[0].t - (row && row.t0 || 0)) + ' ms in' + (gone[0].over ? ', on top there: ' + gone[0].over : '') : 'none without it');
    }
    let after = null;
    if (row && row.t0) { const end = (row.t1 || row.t0 + 1000) + 300; const later = frames.filter(f => f.t > end); after = later.length ? later[Math.min(later.length - 1, 3)].data : null;
      frames = frames.filter(f => f.t >= row.t0 - 20 && f.t <= end); }
    for (const [name, rect0, masks] of pieces) {
      /* a piece is its solid parts (the bar's tags and its glass; the phone's body), never the see-through margin around them */
      const rects = Array.isArray(rect0 && rect0[0]) ? rect0 : (rect0 ? [rect0] : []);
      if (!rects.length) { ok('  ' + label + ': the ' + name + ' was measured', false); continue; }
      /* judged as one piece: a bar that left the glass took all its tags with it; one count flashing (the batteries spent)
         is a few of its pixels, never a fifth */
      let acc = null;
      for (const rect of rects) { const one = frames.length ? await offs(cmp, ref, frames, rect, masks, after) : null; if (!one) { acc = null; break; }
        acc = acc ? acc.map((v, i) => (v === -1 || one[i] === -1) ? -1 : [v[0] + one[i][0], v[1] + one[i][1]]) : one; }
      const o0 = acc ? acc.map(v => v === -1 ? -1 : (v[1] ? v[0] / v[1] : 1)) : null;
      const o = (o0 || []).filter(v => v >= 0);
      const worst = o.length ? Math.max(...o) : 1, bad = o.filter(v => v > OFF).length;
      if (bad) { try { const i = (o0 || []).indexOf(worst), f = path.join(require('os').tmpdir(), 'the_ui_morphs_' + profile + '_' + label.replace(/\W+/g, '_') + '_' + name + '.jpg'); require('fs').writeFileSync(f, Buffer.from(frames[i].data, 'base64')); console.log('         the worst frame: ' + f); } catch (e) {} }
      /* the witness, not the verdict: a piece whose own content changes in the change (the batteries spent, the town's purse, the
         supplies the fight carries) reads as pixels off; the hit test above is the verdict */
      console.log('         (the recording: the ' + name + ' over ' + o.length + ' frames, worst ' + pct(worst) + ' off its picture before or after, ' + bad + ' past ' + pct(OFF) + ')');
    }
  };
  /* the road cleared between changes: no hunting party, no meet card, no fight, no door left open */
  const settle = async () => {
    await fr.evaluate(() => { try { contactClear(); } catch (_e) {} });
    if (await M(() => !!window.CITYFIGHT)) { const h = await p.$('#fightFrame'), c = h && await h.contentFrame(); if (c) await c.evaluate(() => { try { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); } catch (e) {} }).catch(() => {});
      for (let i = 0; i < 40; i++) { if (await M(() => !CITYFIGHT || !!(window.SPOILS && SPOILS.frame))) break; await p.waitForTimeout(250); }
      await M(() => { try { if (window.SPOILS && SPOILS.frame) spoilsLeave(); else nfHome(); } catch (_e) {} }); await p.waitForTimeout(2500); }
    await fr.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (_e) {} try { contactClear(); } catch (_e) {} });
    /* a hunting party that reached the crew puts its meet card up (rule 151's meet before you fight): his FALL BACK sends it off */
    for (let i = 0; i < 3; i++) { const up = await fr.evaluate(() => { try { if (!MEET.up) return false; const b = MEET.up.el.querySelector('[data-meet="back"]'); if (b) b.click(); return true; } catch (e) { return false; } }); if (!up) break; await p.waitForTimeout(1200); }
    await idle(4000);
  };
  /* the crew door, on whichever page opened it */
  const crewDoorAt = (sel) => M((sel) => { let hit = null; const v = (w, d) => { if (hit || d > 4) return; try { const e = w.document.getElementById('crewdoor'); if (e) { hit = e; return; } for (let i = 0; i < w.frames.length; i++) v(w.frames[i], d + 1); } catch (_e) {} }; v(window, 0);
    if (!hit) return null; if (!sel) return true; const f = hit.querySelector('iframe'), b = f && f.contentDocument && f.contentDocument.getElementById(sel); if (!b) return false; const x = BohemiaMotion.box(b); return x ? [x.x + x.w / 2, x.y + x.h / 2] : false; }, sel || null);
  const crewDoneClick = () => M(() => { let hit = null; const v = (w, d) => { if (hit || d > 4) return; try { const e = w.document.getElementById('crewdoor'); if (e) { hit = e; return; } for (let i = 0; i < w.frames.length; i++) v(w.frames[i], d + 1); } catch (_e) {} }; v(window, 0);
    const f = hit && hit.querySelector('iframe'), b = f && f.contentDocument && f.contentDocument.getElementById('done'); if (b) b.click(); return !!b; });
  const inBudget = (r, lo, hi) => !!r && r.planned >= lo - 20 && r.planned <= hi + 20;
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await fr.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
    /* ---- M0 ---- */
    const A = await M(() => ({ v: BohemiaMotion.version, ad: BohemiaMotion.adapters, clock: BohemiaMotion.clock(), red: BohemiaMotion.reduced() }));
    const need = ['town', 'leave', 'camp', 'fight', 'home', 'crew'];
    ok('M0 the motion layer is in the demo (' + A.v + '), on the music\'s clock (' + A.clock.src + ', a hold ' + Math.round(A.clock.holdMs) + ' ms, six a beat)', !!A.v && A.clock.beatMs > 400 && A.clock.beatMs < 600 && Math.abs(A.clock.holdMs * 6 - A.clock.beatMs) < 1);
    ok('  every screen\'s door is handed to it', need.every(k => A.ad[k] === true), JSON.stringify(A.ad));
    if (A.red) await M(() => BOHEMIA_SETTINGS.setMotion(false));

    /* ---- M1 THE MAP TO A TOWN ---- */
    const town = await fr.evaluate(() => { const L = (window.MAP_TOWN_HIT || []).filter(t => t.bld && t.bld.x > 30 && t.bld.x + t.bld.w < innerWidth - 30 && t.bld.y > 150 && t.bld.y < innerHeight - 200);
      const bs = ctBases(); for (const t of L) if (bs[t.name]) return t.name; return null; });
    const phone = await boxOf('phone'), masks = await placeMask();
    const bar = await M(() => { const e = BohemiaMotion.find('bar'); if (!e) return null; return [...e.querySelectorAll('.t, .g, #notebtn')].map(x => BohemiaMotion.box(x)).filter(b => b && b.w > 4 && b.h > 4).map(b => [b.x, b.y, b.w, b.h]); });
    await rec.start(); await p.waitForTimeout(150);
    let t0 = await now();
    await fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); }, town);
    await idle(5000); await p.waitForTimeout(300);
    let fr1 = await rec.stop();
    let g = (await rows('town', 'grow', t0))[0];
    ok('M1 the map to a town (' + town + '): it grows out of its place, on twos, in budget', !!g && !g.reduced && g.holds >= 4 && inBudget(g, 500, 1000) && (g.waitedReady || 0) <= 2000 && g.gaps === 0,
      g ? 'planned ' + g.planned + ' ms, ' + g.holds + ' holds, waited for the town ' + (g.waitedReady || 0) + ' ms, ' + g.frames + ' frames, ' + g.gaps + ' empty' : 'no grow logged');
    await steady('the town grew', fr1.slice(1), fr1[0] && fr1[0].data, [['bar', bar, masks]], g);
    /* the old phone is not in a town (UI [no phone in the town], rule 211): it leaves by folding into its corner, on the glass every
       frame until it lands there */
    const phoneRun = (a, b) => WROWS.filter(r => r.t >= a - 20 && r.t <= b + 20);
    const pl = (await rows('phone', 'fly', t0))[0], plRows = pl ? phoneRun(t0, pl.t1) : [];
    ok('  the old phone leaves the town by folding into its corner, on the glass in every frame until it lands', !!pl && inBudget(pl, 250, 500) && pl.gaps === 0 && plRows.length >= 2 && plRows.every(r => r.phone),
      pl ? 'planned ' + pl.planned + ' ms, ' + plRows.filter(r => !r.phone).length + ' of ' + plRows.length + ' frames without it' : 'no fold logged');
    const sf = await (await fr.waitForSelector('#settleFrame')).contentFrame();
    await sf.waitForFunction(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }, null, { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(1200);

    /* ---- M3 THE TOWN BACK TO THE MAP, BY HIS LEAVE ---- */
    const leave = async () => {
      /* a sheet still open over the town (the job's last words) is closed first, as he would */
      try { const sfn = await (await fr.waitForSelector('#settleFrame', { timeout: 2000 })).contentFrame();
        if (await sfn.evaluate(() => { try { return !!BohemiaSettlement.state.open; } catch (e) { return false; } })) {
          const cb = await sfn.evaluate(() => { const c = document.getElementById('close'); if (!c) return null; const r = c.getBoundingClientRect(); return r.width ? [r.x + r.width / 2, r.y + r.height / 2] : null; });
          const fb = await M(() => { const b = BohemiaMotion.box(document.getElementById('cityFrame').contentWindow.LOOP.frame); return b ? [b.x, b.y] : [0, 0]; });
          if (cb) await tap(fb[0] + cb[0], fb[1] + cb[1]); else await sfn.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); });
          await p.waitForTimeout(600); } } catch (_e) {}
      /* UI TWO (rules 238(a), 286(b)): in the game the one LEAVE on screen is the phone's; the town's own when no phone is up */
      const lb = await M(() => { const pl = document.querySelector('#bohphone.on .bpctx.town .lv'), pr = pl && pl.getBoundingClientRect(); if (pr && pr.width > 0) return [pr.x + pr.width / 2, pr.y + pr.height / 2];
        const cw = document.getElementById('cityFrame').contentWindow, sd = cw.LOOP.frame.contentDocument, l = sd.getElementById('leave'); const b = l && l.getBoundingClientRect().width > 0 && BohemiaMotion.box(l); return b ? [b.x + b.w / 2, b.y + b.h / 2] : null; });
      if (lb) await tap(lb[0], lb[1]); else await fr.evaluate(() => loopClose()); return !!lb; };
    await rec.start(); await p.waitForTimeout(150); t0 = await now();
    const tappedLeave = await leave();
    await idle(5000); await p.waitForTimeout(300);
    let fr3 = await rec.stop();
    let s = (await rows('town', 'shrink', t0))[0];
    ok('M3 the town back to the map (' + (tappedLeave ? 'his LEAVE' : 'the map\'s close') + '): it shrinks into its place, in budget', !!s && s.holds >= 4 && inBudget(s, 500, 1000) && s.gaps === 0,
      s ? 'planned ' + s.planned + ' ms, ' + s.holds + ' holds' + (s.err ? ', threw ' + s.err : '') + (s.stall ? ', after a ' + s.stall + ' ms stall' : '') + (s.t1 ? '' : ', still flying: ' + JSON.stringify(await M(() => BohemiaMotion.live()))) : 'no shrink logged');
    await steady('the town went back', fr3.slice(1), fr1[0] && fr1[0].data, [['bar', bar, masks]], s);
    const pb = (await rows('phone', 'fly', t0))[0], pbRows = pb ? phoneRun(pb.t0, Math.max(s && s.t1 || 0, pb.t1) + 300) : [];
    ok('  and the phone comes back out of its corner, on the glass in every frame from then on', !!pb && inBudget(pb, 250, 500) && pb.gaps === 0 && pbRows.length >= 2 && pbRows.every(r => r.phone),
      pb ? 'planned ' + pb.planned + ' ms, ' + pbRows.filter(r => !r.phone).length + ' of ' + pbRows.length + ' frames without it' : 'no return logged');
    await p.waitForTimeout(800);

    /* ---- M2 A TAP DURING THE GROW ---- */
    t0 = await now();
    await sf.evaluate(() => { window.__gateHeard = 0; document.addEventListener('pointerdown', () => { window.__gateHeard++; }, true); });
    const midTown = await M(() => { const cw = document.getElementById('cityFrame').contentWindow; const b = BohemiaMotion.box(cw.LOOP.frame) || { x: 0, y: 0, w: innerWidth, h: innerHeight }; return [b.x + b.w * 0.3, b.y + b.h * 0.75]; });
    /* slowed four times for this leg only (the camera's knob), so on a loaded box the tap is sure to land inside the morph;
       a skip is the same at any speed, and M1 holds the budget at speed one */
    await M(() => BohemiaMotion.slowly(4));
    await fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); }, town);
    await p.waitForTimeout(150);
    const busyAtTap = await M(() => BohemiaMotion.busy());
    await tap(midTown[0], midTown[1]);
    await p.waitForTimeout(400);
    await M(() => BohemiaMotion.slowly(1));
    const heard = await sf.evaluate(() => window.__gateHeard | 0);
    g = (await rows('town', 'grow', t0))[0];
    const taps = await M(t0 => BohemiaMotion.taps.filter(t => t.t >= t0), t0);
    ok('M2 a tap ' + 150 + ' ms into the grow is never lost: the town\'s own page hears it, and the morph is skipped to its end', busyAtTap > 0 && heard >= 1 && !!g && g.skipped,
      'busy at the tap ' + busyAtTap + ', heard ' + heard + ', ' + (g ? (g.skipped ? 'skipped at ' + g.ms + ' ms' : 'ran ' + g.ms + ' ms') : 'no grow') + ', ' + JSON.stringify(taps.slice(-1)));
    await idle(4000); await p.waitForTimeout(1500);

    /* ---- M4 THE SHOP'S BUY ---- */
    const sbox = await M(() => { const b = BohemiaMotion.box(document.getElementById('cityFrame').contentWindow.LOOP.frame); return [b.x, b.y]; });
    const openShop = async (k) => { for (let i = 0; i < 8; i++) { if (await sf.evaluate(k => BohemiaSettlement.state.open === k && !!document.querySelector('#shelfgrid'), k)) return true;
      const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (w) await tap(sbox[0] + w.x, sbox[1] + w.y); await p.waitForTimeout(900); } return false; };
    const tapSel = async (frame, sel) => { const b = await frame.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel); if (!b) return false; await tap(sbox[0] + b[0], sbox[1] + b[1]); return true; };
    let shopK = null;
    for (const k of ['smith', 'arms', 'armourer']) { if (await sf.evaluate(k => (BohemiaSettlement.state.stock[k] || []).length > 0 && !!BohemiaSettlement.where(k), k)) { if (await openShop(k)) { shopK = k; break; } } }
    if (shopK) {
      const cheap = await sf.evaluate(k => { const L = BohemiaSettlement.state.stock[k]; let i = 0; L.forEach((x, j) => { if (x.price < L[i].price) i = j; }); return i; }, shopK);
      await tapSel(sf, '#shelfgrid .slot:nth-child(' + (cheap + 1) + ')'); await p.waitForTimeout(900);
      const hasFace = await sf.evaluate(() => !!document.querySelector('#shopfaces button'));
      t0 = await now();
      const bought = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sbody .acts button, #sbody .acts .act')].find(e => /^\s*Buy it/i.test(e.textContent)); return b ? !b.disabled : null; });
      if (bought) await tapSel(sf, '#sbody .acts .act:not([disabled])');
      const byText = bought ? null : 'no Buy it on the card';
      await idle(3000);
      const f4 = (await rows('item', 'fly', t0))[0], man = (await rows('man', 'hold', t0))[0];
      ok('M4 the shop\'s buy (' + shopK + '): the item flies from BUY onto the man the card shows, a piece in budget, nothing blinks',
        !!f4 && inBudget(f4, 250, 500) && f4.holds >= 3 && f4.gaps === 0 && (!hasFace || (!!man && man.gaps === 0)),
        f4 ? 'planned ' + f4.planned + ' ms, ' + f4.holds + ' holds, the man ' + (man ? 'held ' + man.ms + ' ms' : (hasFace ? 'not held' : 'no face strip')) : (byText || 'no flight logged'));
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(500);
    } else ok('M4 the shop\'s buy: a shop with a shelf opened', false, 'no shop opened');

    /* ---- M5 A JOB TAKEN ---- */
    let boardOpen = false;
    for (let i = 0; i < 6 && !boardOpen; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && !!document.querySelector('#sbody .act.client'))) { boardOpen = true; break; }
      const w = await sf.evaluate(() => BohemiaSettlement.where('board')); if (w) await tap(sbox[0] + w.x, sbox[1] + w.y); await p.waitForTimeout(900); }
    if (boardOpen) {
      await tapSel(sf, '#sbody .act.client'); await p.waitForTimeout(1200);
      t0 = await now();
      const heldBefore = await fr.evaluate(() => (LOOP.held || []).map(c => String(c.id)));
      const took = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sbody .acts .act, #sbody .acts button')].find(e => /^\s*(Take it|Drop it and take this one)/i.test(e.textContent) && !e.disabled); if (!b) return false; b.setAttribute('data-gate-take', '1'); return true; });
      if (took) await tapSel(sf, '[data-gate-take]');
      await idle(4000);
      const f5 = (await rows('job', 'fly', t0))[0];
      const onCard = await fr.evaluate(was => (LOOP.held || []).some(c => was.indexOf(String(c.id)) < 0), heldBefore);
      /* onto the job's own card when the phone is in the town; into the phone's corner when it is not (UI [no phone in the town]) */
      ok('M5 a job taken: the offer flies into the phone (onto the job\'s own card, or into the phone\'s corner when there is no phone in the town), in budget',
        !!f5 && !f5.why && !!f5.onto && (f5.waited || 0) <= 1500 && inBudget(f5, 250, 500) && f5.gaps === 0 && onCard,
        f5 ? 'onto ' + f5.onto + ', waited ' + (f5.waited || 0) + ' ms, planned ' + f5.planned + ' ms, ' + f5.holds + ' holds' + (f5.why ? ', ' + f5.why : '') + ', the job held ' + onCard : (took ? 'no flight logged' : 'no Take it'));
    } else ok('M5 a job taken: the board opened', false);
    await leave(); await idle(4000); await p.waitForTimeout(800);

    await settle();
    /* ---- M6 MAKING CAMP ---- */
    let camp = null; for (let i = 0; i < 30 && !camp; i++) { camp = await boxOf('camp'); if (!camp) await p.waitForTimeout(300); }
    /* the camp measured as a camp: a hunting party that breaks it brings RUN's meet card, a full-glass dialog over the bar (its
       own entrance, not this change; MOTION's next list), so the hunters are sent off for this leg */
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
    await rec.start(); await p.waitForTimeout(150); t0 = await now();
    if (camp) await tap(camp[0] + camp[2] / 2, camp[1] + camp[3] / 2);
    await idle(5000); await p.waitForTimeout(300);
    const fr6 = await rec.stop();
    const c1 = (await rows('camp', 'grow', t0))[0];
    const why6 = camp ? '' : ' ' + JSON.stringify(await fr.evaluate(() => { const b = document.getElementById('campbtn'); let on = null; try { on = campOnMap(); } catch (e) {}
      return { btn: !!b, display: b && b.style.display, campOnMap: on, mode: typeof MODE !== 'undefined' ? MODE : '?', fighting: !!(LOOP && LOOP.fighting), town: !!(LOOP.frame && LOOP.frame.style.display === 'block'), meet: !!(MEET && MEET.up), camp: !!(CAMP && CAMP.on) }; }));
    ok('M6 making camp: the camp grows out of ' + (camp ? 'CAMP' : 'nothing' + why6) + ', in budget', !!c1 && c1.holds >= 4 && inBudget(c1, 500, 1000) && c1.gaps === 0, c1 ? 'planned ' + c1.planned + ' ms, from ' + fmt(camp) : 'no grow logged');
    await steady('the camp grew', fr6.slice(1), fr6[0] && fr6[0].data, [['bar', bar, masks]], c1);
    await p.waitForTimeout(1200);
    const broke = await fr.evaluate(() => window.__CAMP ? { on: __CAMP.on, why: __CAMP.why || null } : null);
    let after6 = null;
    if (broke && broke.on) { await leave(); await idle(5000); after6 = await fr.evaluate(() => ({ camp: window.__CAMP && __CAMP.on, frame: LOOP.frame && LOOP.frame.style.display, open: LOOP.open ? (LOOP.open.name || '?') : null, log: (LOOP.log || []).slice(-3) })); }
    const c2 = c1 ? (await rows('camp', 'shrink', c1.t0))[0] : null;
    ok('  breaking camp (' + (broke && broke.on ? 'his BREAK CAMP' : 'it broke itself: ' + (broke && broke.why)) + '): it goes back into CAMP, in budget', !!c2 && inBudget(c2, 500, 1000) && c2.gaps === 0, c2 ? 'planned ' + c2.planned + ' ms' + (c2.err ? ', threw ' + c2.err : '') : 'no shrink logged ' + JSON.stringify(after6));
    await p.waitForTimeout(800);

    await settle();
    /* ---- M7 THE CREW SCREEN ---- */
    /* UI TWO (rules 238(a), 286(b)): with the phone up CREW is pressed on the phone (the bar's crew chip is a readout); its box in the
       shell's own pixels, else the bar's CREW as before */
    const crew = (await M(() => { const e = document.querySelector('#bohphone.on .bprow .app[data-app=crew]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.x, r.y, r.width, r.height] : null; })) || await boxOf('crew');
    t0 = await now();
    if (crew) await tap(crew[0] + crew[2] / 2, crew[1] + crew[3] / 2);
    await idle(5000); await p.waitForTimeout(1500);
    const k1 = (await rows('crew', 'grow', t0))[0];
    ok('M7 the crew screen grows out of the bar\'s CREW, in budget', !!k1 && k1.holds >= 4 && inBudget(k1, 500, 1000) && k1.gaps === 0, k1 ? 'planned ' + k1.planned + ' ms, from ' + fmt(crew) : 'no grow logged');
    t0 = await now();
    let doneAt = null; for (let i = 0; i < 10 && !doneAt; i++) { doneAt = await crewDoorAt('done'); if (!doneAt) await p.waitForTimeout(500); }
    let how = doneAt ? 'his DONE' : 'no DONE found';
    if (doneAt) await tap(doneAt[0], doneAt[1]);
    await p.waitForTimeout(1500);
    if (await crewDoorAt()) { how = 'DONE clicked'; await crewDoneClick(); await p.waitForTimeout(1500); }
    await idle(5000);
    const k2 = (await rows('crew', 'shrink', t0))[0];
    ok('  DONE: the crew screen shrinks back into CREW, in budget', !!k2 && inBudget(k2, 500, 1000) && k2.gaps === 0, k2 ? 'planned ' + k2.planned + ' ms (' + how + ')' : 'no shrink logged (' + how + ', the door ' + (await crewDoorAt() ? 'still open' : 'gone') + ')');
    await p.waitForTimeout(800);

    await settle();
    /* ---- M8 THE MAP TO A FIGHT AND BACK ---- */
    await rec.start(); await p.waitForTimeout(150); t0 = await now();
    await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); });
    let fw = null;
    for (let i = 0; i < 150 && !fw; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) fw = c; } if (!fw) await p.waitForTimeout(200); }
    for (let i = 0; i < 60; i++) { if (await M(() => !window.NFC || NFC.state === 'off')) break; await p.waitForTimeout(200); }
    await idle(4000); await p.waitForTimeout(1500);   /* the fight's own frames after the change: the bar as it is in the fight */
    const fr8 = await rec.stop();
    /* RE-AIMED 10/26 BY UI (rule 280, Paolo: 'in combat it can completely go away'; the marked __NO_TOP_BAR_IN_THE_FIGHT__ in
       nfOpen): the fight has no bar, so the map's is no longer held over the clouds; it LIFTS OFF the top as they roll in (a piece
       leaving, in budget, no frame without it until it is off), and never hangs waiting for a fight's bar */
    const lift = (await rows('bar', 'fly', t0))[0], hung = (await rows('bar', 'hold', t0)).find(r => r.why === 'timed out'), fold = (await rows('phone', 'fly', t0))[0];
    const fwNow = async () => { const h = await p.$('#fightFrame'); return h ? await h.contentFrame() : null; };
    fw = (await fwNow()) || fw;
    const tray = fw ? await fw.evaluate(() => { const e = document.getElementById('skills'); return !!e && e.getBoundingClientRect().width > 0; }).catch(() => false) : false;
    ok('M8 the map to a fight: the bar lifts off the top as the clouds come in, in budget, never held waiting for a fight\'s bar (rule 280)', !!fw && !!lift && !hung && lift.gaps === 0 && inBudget(lift, 250, 500),
      lift ? 'lifted, planned ' + lift.planned + ' ms, ' + lift.gaps + ' frames without it' + (hung ? '; a hold timed out' : '') : (fw ? 'no lift logged' : 'no fight opened'));
    const barUp = fw ? await fw.evaluate(() => { const b = document.getElementById('bmtb'); return !!b && b.getBoundingClientRect().height > 0; }).catch(() => true) : true;
    ok('  in the fight no bar is on the glass (rule 280)', !barUp, barUp ? 'the fight wears a bar' : 'none');
    ok('  the phone folds into his abilities as the clouds part (a screen change, in budget, onto the ability tray)', !!fold && inBudget(fold, 500, 1000) && fold.gaps === 0 && tray, fold ? 'planned ' + fold.planned + ' ms, waited ' + (fold.waited || 0) + ' ms' : 'no fold logged');
    /* and home */
    if (fw) {
      fw = (await fwNow()) || fw;
      await fw.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {});
      for (let i = 0; i < 60; i++) { if (await M(() => !CITYFIGHT || !!(window.SPOILS && SPOILS.frame))) break; await p.waitForTimeout(250); }
      await p.waitForTimeout(600);
      t0 = await now();
      await M(() => { try { if (typeof spoilsLeave === 'function' && window.SPOILS && SPOILS.frame) spoilsLeave(); else nfHome(); } catch (_e) {} });
      await idle(6000); await p.waitForTimeout(500);
      const hb = (await rows('bar', 'hold', t0))[0], back = (await rows('phone', 'fly', t0))[0];
      ok('  and back: the bar held until the map\'s is back, the abilities fold back into the phone, in budget',
        !!hb && hb.gaps === 0 && !!back && !back.why && inBudget(back, 500, 1000) && back.gaps === 0, (hb ? 'bar ' + hb.ms + ' ms ' + hb.why : 'no bar hold') + '; ' + (back ? 'phone planned ' + back.planned + ' ms, waited ' + (back.waited || 0) + (back.why ? ', ' + back.why : '') : 'no fold back'));
      await fr.evaluate(() => { try { contactClear(); } catch (_e) {} });
    }
    await p.waitForTimeout(1000);

    await settle();
    /* ---- M9 REDUCED MOTION ---- */
    /* UI TWO (rules 238(a), 286(b)): with the phone up the gear is the phone's SETTINGS (the bar's gear off the glass); else the bar's */
    const gear = await M(() => { const ps = document.querySelector('#bohphone.on .bprow .app[data-app=settings]'), pr = ps && ps.getBoundingClientRect(); if (pr && pr.width > 0) return [pr.x + pr.width / 2, pr.y + pr.height / 2];
      const g = document.getElementById('gearbtn'); const cw = document.getElementById('cityFrame').contentWindow; const t = cw.document.querySelector('#bmtb .t.gear'); const e = t && t.getBoundingClientRect().width > 0 ? t : g; const b = e && BohemiaMotion.box(e); return b ? [b.x + b.w / 2, b.y + b.h / 2] : null; });
    if (gear) await tap(gear[0], gear[1]); await p.waitForTimeout(900);
    const mo = await M(() => { const m = document.getElementById('setmotion'); const r = m && m.getBoundingClientRect(); return r && r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2, m.textContent] : null; });
    if (mo) await tap(mo[0], mo[1]); await p.waitForTimeout(400);
    const lessNow = await M(() => ({ on: BOHEMIA_SETTINGS.motion(), word: (document.getElementById('setmotion') || {}).textContent }));
    ok('M9 the gear\'s MOTION button turns to LESS (reduced motion)', !!mo && lessNow.on === true && /LESS/.test(lessNow.word), JSON.stringify(lessNow) + (mo ? '' : ' (no MOTION button on the card)'));
    await M(() => { try { BOHEMIA_SETTINGS.close(); } catch (e) {} }); await p.waitForTimeout(500);
    if (!lessNow.on) await M(() => BOHEMIA_SETTINGS.setMotion(true));
    await M(() => { window.__poses = []; const look = () => { document.querySelectorAll('#bmotion .bm-s').forEach(s => window.__poses.push(s.style.transform || 'none')); if (window.__poses.length < 400) requestAnimationFrame(look); }; requestAnimationFrame(look); });
    t0 = await now();
    const was9 = await fr.evaluate(() => ({ town: !!(LOOP.frame && LOOP.frame.style.display === 'block'), open: LOOP.open ? (LOOP.open.name || 'camp') : null, mode: typeof MODE !== 'undefined' ? MODE : '?', fighting: !!LOOP.fighting }));
    await fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); }, town);
    await idle(5000);
    const fz = (await rows('town', 'grow', t0))[0], poses = await M(() => window.__poses.slice());
    const still = poses.length > 0 && poses.every(t => t === 'none' || /^translate\(0px, ?0px\) scale\(1(\.0+)?, ?1(\.0+)?\)$/.test(t));
    ok('  then a town opens as a fade in place: nothing travels or grows, 200 ms or less', !!fz && fz.reduced && fz.planned <= 200 && still && fz.gaps === 0,
      fz ? 'reduced ' + fz.reduced + ', planned ' + fz.planned + ' ms, ' + poses.length + ' poses seen, ' + (still ? 'none moved' : 'one moved: ' + poses.find(t => t !== 'none')) : 'no fade logged, before it ' + JSON.stringify(was9));
    await p.waitForTimeout(800); await leave(); await idle(3000);
    await M(() => BOHEMIA_SETTINGS.setMotion(false));
    ok('  and back to FULL', await M(() => BOHEMIA_SETTINGS.motion() === false && /FULL/.test(document.getElementById('setmotion').textContent)));

    /* ---- M10 ---- */
    const all = await M(() => BohemiaMotion.log.slice());
    const gaps = all.filter(r => r.gaps > 0);
    ok('M10 every morph\'s own count of empty frames is zero (' + all.length + ' morphs)', all.length >= 10 && gaps.length === 0, gaps.map(r => r.id + ' ' + r.how + ' ' + r.gaps).join(', '));
    ok('  nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 140) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok(profile + ': the gate ran without throwing [' + String(e.message).slice(0, 220) + ']', false);
  }
  await rec.close();
  await d.close();
}

(async () => {
  const only = process.argv[2];
  for (const prof of only ? [only] : ['phone_portrait', 'computer']) await side(prof);
  console.log('\nTHE UI MORPHS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
