/* EVERY CHANGE, MEASURED (MOTION 3, 11/8/26, rule 436(a), asks 151, 257, 278; Paolo: 'the UI morphs... every big change (map,
   town, fight, camp, shop, jobs, the crew) transforms the shared pieces into each other... never static, never a cut; nothing just
   appears or vanishes').

   WHAT IT DOES: opens the demo on his phone (390 x 844 at 3, touch), presses every change of state the way he presses it (a finger
   at the real spot; the map's own door where a finger cannot reach one), and for each change keeps EVERY FRAME the compositor
   sends (the browser's screencast) and every frame the page draws (a requestAnimationFrame clock in the top page).

   WHAT IT ANSWERS, per change:
     glass   the share of the glass that differs between the frame before the tap and the frame after the change settled
     big     the biggest share of the glass that changed between two frames in a row, and when (ms after the tap)
     sum     every frame-to-frame step of 2% of the glass or more, added up: all the change the eye saw
     inOne   big / sum: how much of all that change happened in ONE frame. A CUT is a change whose most is one frame:
             inOne >= 0.6 with big >= 3% of the glass (a piece that just appears or vanishes); a morph spreads it over its holds.
     fps     frames the page drew a second over the change, and the worst frame (ms)
   A pixel is 'changed' when a channel moves more than 40 of 255 (the grain and the boil never do at a third of the size).

   USE: node tools/bohemia_motion_three_every_change.js [phone_portrait|computer] [--only a,b] [--json out.json] [--old]
        --old  runs it with window.__MOTION_THREE_OFF = true armed before the page (MOTION 3's morphs off: the way it was)
   It is also the measuring half of gates/the_ui_morphs_everywhere_gate.js. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

const CHANGED = 40, CUT_SHARE = 0.6, CUT_MIN = 0.03;

async function recorder(p) {
  const cdp = await p.context().newCDPSession(p), V = p.viewportSize(), frames = [];
  let on = false;
  cdp.on('Page.screencastFrame', async f => { if (on) frames.push({ t: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {} });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: V.width, maxHeight: V.height, everyNthFrame: 1 });
  return { start: () => { frames.length = 0; on = true; }, stop: () => { on = false; return frames.slice(); }, close: async () => { try { await cdp.send('Page.stopScreencast'); } catch (e) {} } };
}
/* every step between two frames in a row, and the whole change, as shares of the glass (a third of the size, every pixel) */
async function steps(cmp, frames) {
  return cmp.evaluate(async ({ frames, CHANGED }) => {
    const W = 130, H = Math.round(130 * 844 / 390);
    const dec = async s => { try { const im = new Image(); im.src = 'data:image/jpeg;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = W; c.height = Math.round(W * im.height / im.width); const g = c.getContext('2d'); g.drawImage(im, 0, 0, c.width, c.height); return g.getImageData(0, 0, c.width, c.height).data; } catch (e) { return null; } };
    const D = []; for (const f of frames) D.push(await dec(f.data));
    const diff = (a, b) => { if (!a || !b || a.length !== b.length) return null; let n = 0, c = 0; for (let k = 0; k < a.length; k += 4) { n++; if (Math.max(Math.abs(a[k] - b[k]), Math.abs(a[k + 1] - b[k + 1]), Math.abs(a[k + 2] - b[k + 2])) > CHANGED) c++; } return c / n; };
    const out = []; for (let i = 1; i < D.length; i++) out.push(diff(D[i - 1], D[i]));
    return { steps: out, glass: D.length > 1 ? diff(D[0], D[D.length - 1]) : 0 };
  }, { frames: frames.map(f => ({ data: f.data })), CHANGED });
}
/* EVERY FRAME THE PAGE DRAWS, what each piece covers of the glass (its box on the glass, times its opacity through every frame it
   sits in): the sheet, the weapon card, the shop's man strip, the settings, the loot screen's door, the crew door, the layer's own
   stand-ins. The screen recorder on a software-drawn box drops the frames the compositor draws alone, so this is the verdict and the
   recording the witness. */
const FRAMECLOCK = () => {
  const PIECES = ['#sheet', '#bwcard', '#shopfaces', '#setwrap', '#spoilsdoor', '#crewdoor', '#bmotion .bm-s'];
  const docs = () => { const out = []; const v = (w, d) => { if (d > 4) return; try { if (w.document) out.push(w); for (let i = 0; i < w.frames.length; i++) v(w.frames[i], d + 1); } catch (e) {} }; v(window, 0); return out; };
  const G = innerWidth * innerHeight;
  const up = (w, r) => { let x = r.left, y = r.top, k = 1; for (let fe = w.frameElement; fe; fe = fe.ownerDocument.defaultView.frameElement) { const fr = fe.getBoundingClientRect(); x += fr.left + fe.clientLeft; y += fr.top + fe.clientTop; } return { x, y, w: r.width, h: r.height }; };
  const opa = (el) => { let v = 1; let w = el.ownerDocument.defaultView, e = el; for (;;) { for (let q = e; q && q.nodeType === 1; q = q.parentElement) { const cs = w.getComputedStyle(q); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; v *= parseFloat(cs.opacity); } const fe = w.frameElement; if (!fe) break; e = fe; w = fe.ownerDocument.defaultView; } return v; };
  window.__m3f = { on: true, t: [], s: [] };
  const tick = (t) => { if (!window.__m3f.on) return; window.__m3f.t.push(t);
    const row = { t: performance.timeOrigin + t };
    for (const w of docs()) for (const sel of PIECES) { let list; try { list = w.document.querySelectorAll(sel); } catch (e) { continue; }
      list.forEach((el, i) => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return; const b = up(w, r);
        const ww = Math.max(0, Math.min(b.x + b.w, innerWidth) - Math.max(b.x, 0)), hh = Math.max(0, Math.min(b.y + b.h, innerHeight) - Math.max(b.y, 0));
        const c = ww * hh / G * opa(el); const key = sel + (i ? ':' + i : ''); row[key] = Math.max(row[key] || 0, +c.toFixed(3)); }); }
    window.__m3f.s.push(row); requestAnimationFrame(tick); };
  requestAnimationFrame(tick); };
/* a piece's frames: where it started and ended, the biggest step between two drawn frames, the frames it spent between */
function pieceSteps(samples, key) {
  const v = samples.map(r => r[key] || 0); if (!v.length) return null;
  const a = v[0], b = v[v.length - 1]; let big = 0, at = -1; for (let i = 1; i < v.length; i++) { const d = Math.abs(v[i] - v[i - 1]); if (d > big) { big = d; at = i; } }
  const lo = Math.min(a, b), hi = Math.max(a, b), mid = v.filter(x => x > lo + 0.02 && x < hi - 0.02).length;
  const moved = Math.max(...v) - Math.min(...v);
  return { from: +a.toFixed(3), to: +b.toFixed(3), moved: +moved.toFixed(3), big: +big.toFixed(3), mid, at: at >= 0 ? Math.round(samples[at].t - samples[0].t) : null };
}

async function measure(opts) {
  opts = opts || {};
  const profile = opts.profile || 'phone_portrait';
  const only = opts.only || null;
  const arm = (opts.old ? 'window.__MOTION_THREE_OFF = true;' : '') + (opts.arm || '');
  const d = await open(Object.assign({ profile, door: 120000, engage: true }, arm ? { arm } : {}));
  const p = d.page, fr = d.fr, touch = profile !== 'computer';
  const tap = async (x, y) => { if (touch) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); };
  const cmp = await p.context().newPage();
  const rec = await recorder(p);
  const M = (fn, a) => p.evaluate(fn, a);
  const now = () => M(() => performance.timeOrigin + performance.now());
  const idle = async (ms) => { for (let i = 0; i < (ms || 6000) / 100; i++) { if (!(await M(() => !!window.BohemiaMotion && BohemiaMotion.busy()))) return true; await p.waitForTimeout(100); } return false; };
  const rows = [];
  const log = (s) => { if (!opts.quiet) console.log(s); };
  /* one change: start the recorder, press, wait for it to settle, keep its numbers */
  const change = async (name, press, settleMs) => {
    if (only && only.indexOf(name) < 0) { await press(); await p.waitForTimeout(settleMs || 1600); await idle(3000); return null; }
    rec.start(); await M(FRAMECLOCK); await p.waitForTimeout(250);
    const t0 = await now(), w0 = await M(() => performance.now());
    let pressed = true; try { const r = await press(); if (r === false) pressed = false; } catch (e) { pressed = false; }
    await p.waitForTimeout(settleMs || 1600); await idle(3000); await p.waitForTimeout(250);
    const frames = rec.stop();
    const ft = await M(() => { window.__m3f.on = false; return window.__m3f.t.slice(); });
    const samples = await M(() => window.__m3f.s.slice());
    const keys = [...new Set(samples.flatMap(r => Object.keys(r).filter(k => k !== 't')))];
    const pieces = {}; for (const k of keys) { const ps = pieceSteps(samples, k); if (ps && ps.moved >= 0.03) pieces[k] = ps; }
    const m3 = await M(t0 => (window.BohemiaMotion && BohemiaMotion.log ? BohemiaMotion.log.filter(r => r.t0 >= t0 - 5).map(r => ({ id: r.id, how: r.how, dir: r.dir, kind: r.kind, planned: r.planned, holds: r.holds, poses: r.poses, step: r.step, gaps: r.gaps, skipped: r.skipped, reduced: r.reduced, why: r.why, waitedReady: r.waitedReady, whyNot: r.whyNot, stall: r.stall, frozen: r.frozen, cover: r.cover })) : []), t0);
    const at = frames.findIndex(f => f.t >= t0);
    const fs0 = at > 0 ? frames.slice(at - 1) : frames;
    const st = fs0.length > 1 ? await steps(cmp, fs0) : { steps: [], glass: 0 };
    let big = 0, bigAt = null; st.steps.forEach((v, i) => { if (v != null && v > big) { big = v; bigAt = Math.round(fs0[i + 1].t - t0); } });
    const ws = ft.filter(t => t >= w0 + 250), gaps = []; for (let i = 1; i < ws.length; i++) gaps.push(ws[i] - ws[i - 1]);
    const span = ws.length > 1 ? ws[ws.length - 1] - ws[0] : 0;
    const row = { name, pressed, frames: fs0.length, glass: +(st.glass || 0).toFixed(3), big: +big.toFixed(3), bigAt, sum: +st.steps.filter(v => v != null && v >= 0.02).reduce((a, v) => a + v, 0).toFixed(3),
      over5: st.steps.filter(v => v > 0.05).length, pieces, fps: span ? +(gaps.length / span * 1000).toFixed(1) : null, worst: gaps.length ? Math.round(Math.max(...gaps)) : null, morphs: m3 };
    row.trail = st.steps.map((v, i) => v != null && v >= 0.02 ? [Math.round(fs0[i + 1].t - t0), +v.toFixed(3)] : null).filter(Boolean);
    if (opts.frames && big > 0) { try { const i = st.steps.indexOf(big), nm = name.replace(/\W+/g, '_'); fs.writeFileSync(path.join(opts.frames, nm + '_a.jpg'), Buffer.from(fs0[i].data, 'base64')); fs.writeFileSync(path.join(opts.frames, nm + '_b.jpg'), Buffer.from(fs0[i + 1].data, 'base64')); } catch (e) {} }
    row.inOne = row.sum > 0 ? +(row.big / row.sum).toFixed(2) : 0;
    row.cut = row.pressed && row.big >= CUT_MIN && row.inOne >= CUT_SHARE;
    rows.push(row);
    if (opts.stopAfter && opts.stopAfter === name) { const e = new Error('stop'); e.stop = true; throw e; }
    log((row.cut ? 'CUT   ' : 'ok    ') + name.padEnd(22) + ' glass ' + String(Math.round(row.glass * 100)).padStart(3) + '%  biggest one frame ' + String(Math.round(row.big * 100)).padStart(3) + '% at ' + String(row.bigAt).padStart(5) + ' ms  (' + Math.round(row.inOne * 100) + '% of it in one frame, '
      + row.over5 + ' frames over 5%)  ' + row.fps + ' fps, worst ' + row.worst + ' ms  ' + (pressed ? '' : '[NOT PRESSED] ') + m3.map(r => r.id + ':' + r.how + (r.dir ? '-' + r.dir : '') + (r.planned ? ' ' + r.planned + 'ms' : '') + (r.poses ? ' ' + r.poses + ' poses, step ' + Math.round(r.step * 100) + '%' : '')).join(' ')
      + '\n        frames ' + Object.keys(pieces).map(k => k + ' ' + Math.round(pieces[k].from * 100) + '>' + Math.round(pieces[k].to * 100) + '% biggest ' + Math.round(pieces[k].big * 100) + '% (' + pieces[k].mid + ' frames between)').join('; '));
    return row;
  };
  const S = { d, p, fr, M, tap, idle, rows, change, errors: [] };
  p.on('pageerror', e => { S.errors.push(String(e && e.message || e).slice(0, 160) + (/bohemia_motion/.test(String(e && e.stack)) ? ' [bohemia_motion.js]' : '')); });
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await fr.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
    if (await M(() => BohemiaMotion.reduced())) await M(() => BOHEMIA_SETTINGS.setMotion(false));
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
    const town = await fr.evaluate(() => { const L = (window.MAP_TOWN_HIT || []).filter(t => t.bld && t.bld.x > 30 && t.bld.x + t.bld.w < innerWidth - 30 && t.bld.y > 150 && t.bld.y < innerHeight - 200);
      const bs = ctBases(); for (const t of L) if (bs[t.name]) return t.name; return null; });
    S.town = town;
    /* the leave, pressed where he presses it: the phone's LEAVE, else the town's own, else the map's close */
    const leave = async () => {
      const lb = await M(() => { const pl = [...document.querySelectorAll('#bohphone.on .lv, #bohphone.on .app[data-app=leave]')].find(e => e.getBoundingClientRect().width > 0), pr = pl && pl.getBoundingClientRect(); if (pr) return [pr.x + pr.width / 2, pr.y + pr.height / 2];
        const cw = document.getElementById('cityFrame').contentWindow, sd = cw.LOOP.frame && cw.LOOP.frame.contentDocument, l = sd && sd.getElementById('leave'); const b = l && l.getBoundingClientRect().width > 0 && BohemiaMotion.box(l); return b ? [b.x + b.w / 2, b.y + b.h / 2] : null; });
      if (lb) await tap(lb[0], lb[1]); else await fr.evaluate(() => loopClose()); return true; };
    S.leave = leave;
    const app = async (a) => { const b = await M(a => { const e = [...document.querySelectorAll('#bohphone.on .app[data-app=' + a + ']')].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, a); if (!b) return false; await tap(b[0], b[1]); return true; };
    S.app = app;
    const townOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'));
    /* ---- the town he wakes in, back to the map, by his LEAVE ---- */
    if (await townOpen()) await change('town>map (first)', leave, 2200);
    await p.waitForTimeout(900);
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
    /* ---- the map to a town ---- */
    await change('map>town', () => fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); }, town), 2200);
    const sf = await (await fr.waitForSelector('#settleFrame')).contentFrame();
    await sf.waitForFunction(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }, null, { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(1200);
    const sbox = await M(() => { const b = BohemiaMotion.box(document.getElementById('cityFrame').contentWindow.LOOP.frame); return [b.x, b.y]; });
    const tapWhere = async (k) => { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return false; await tap(sbox[0] + w.x, sbox[1] + w.y); return true; };
    const tapSel = async (sel) => { const b = await sf.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return r.width ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, sel); if (!b) return false; await tap(sbox[0] + b[0], sbox[1] + b[1]); return true; };
    const openK = () => sf.evaluate(() => BohemiaSettlement.state.open || null);
    S.tapSel = tapSel; S.tapWhere = tapWhere;
    let shopK = null; for (const k of ['smith', 'arms', 'armourer']) if (await sf.evaluate(k => (BohemiaSettlement.state.stock[k] || []).length > 0 && !!BohemiaSettlement.where(k), k)) { shopK = k; break; }
    S.shopK = shopK;
    /* ---- the town to a shop (a building tapped: its sheet) ---- */
    await change('town>shop', async () => { if (!shopK) return false; return tapWhere(shopK); });
    if (shopK && (await openK()) !== shopK) { await tapWhere(shopK); await p.waitForTimeout(900); }
    /* ---- an item tapped (rule 433: its card) ---- */
    /* a weapon if the shelf has one (its card, UI 8's #bwcard, is the detail rule 433 shows on a tap), else the cheapest piece */
    const slotSel = shopK ? await sf.evaluate(() => { const L = [...document.querySelectorAll('#shelfgrid .slot')]; const w = L.findIndex(e => /^weapon:/.test(e.getAttribute('data-item') || '') || !!e.querySelector('[data-item^="weapon:"]'));
      return '#shelfgrid .slot:nth-child(' + ((w >= 0 ? w : 0) + 1) + ')'; }) : '#shelfgrid .slot';
    await change('shop>item', () => tapSel(slotSel));
    /* ---- the sheet closed (his x) back to the town ---- */
    await change('sheet>town', () => tapSel('#close'));
    if (await openK()) { await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await p.waitForTimeout(600); }
    /* ---- the board, and a job's card on it ---- */
    await change('town>board', () => tapWhere('board'));
    if ((await openK()) !== 'board') { await tapWhere('board'); await p.waitForTimeout(900); }
    /* the board posts its jobs once they are read (BohemiaJobDanger plans them in the frames' gaps): wait for a line to tap */
    /* a page turned on the board: a job's line to its card, or (the board opens on its first job's card when it has one to say,
       11/9) that card's 'Not now' back to the board */
    const pageTurn = async () => { for (let i = 0; i < 30 && !(await sf.evaluate(() => !!document.querySelector('#sbody .act.client') || [...document.querySelectorAll('#sbody .act')].some(e => /^\s*Not now/i.test(e.textContent)))); i++) await p.waitForTimeout(200);
      if (await sf.evaluate(() => !!document.querySelector('#sbody .act.client'))) return tapSel('#sbody .act.client');
      await sf.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(e => /^\s*Not now/i.test(e.textContent)); if (b) b.setAttribute('data-m3-turn', '1'); });
      return tapSel('[data-m3-turn]'); };
    S.pageTurn = pageTurn;
    await change('board>job', pageTurn);
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(700);
    /* ---- another building: the scavenge lot ---- */
    const lot = await sf.evaluate(() => ['lot', 'scavenge', 'bar', 'clinic', 'stall'].find(k => !!BohemiaSettlement.where(k)) || null);
    await change('town>' + (lot || 'lot'), () => lot ? tapWhere(lot) : false);
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(700);
    /* ---- the town back to the map, by his LEAVE ---- */
    await change('town>map', leave, 2000);
    await p.waitForTimeout(800);
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
    /* ---- the crew screen and back ---- */
    const crewBox = async () => (await M(() => { const e = document.querySelector('#bohphone.on .bprow .app[data-app=crew]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.x, r.y, r.width, r.height] : null; }))
      || await M(() => { const e = BohemiaMotion.find('crew'); const b = e && BohemiaMotion.box(e); return b ? [b.x, b.y, b.w, b.h] : null; });
    await change('map>crew', async () => { if (await app('crew')) return true; const cb = await crewBox(); if (!cb) return false; await tap(cb[0] + cb[2] / 2, cb[1] + cb[3] / 2); }, 2200);
    await p.waitForTimeout(1500);
    /* UI TWO: the crew screen's DONE is the phone's (the screen's own is hidden under the phone's rule); else the screen's own */
    let doneAt = null; for (let i = 0; i < 12 && !doneAt; i++) { doneAt = await M(() => { const pe = [...document.querySelectorAll('#bohphone.on button, #bohphone.on .app, #bohphone.on [role=button], #bohphone.on .lv')].find(e => /^\s*DONE\s*$/i.test(e.textContent || '') && e.getBoundingClientRect().width > 0);
      if (pe) { const r = pe.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }
      let hit = null; const v = (w, dd) => { if (hit || dd > 4) return; try { const e = w.document.getElementById('crewdoor'); if (e) { hit = e; return; } for (let i = 0; i < w.frames.length; i++) v(w.frames[i], dd + 1); } catch (_e) {} }; v(window, 0);
      const f = hit && hit.querySelector('iframe'), b = f && f.contentDocument && f.contentDocument.getElementById('done'); const x = b && b.getBoundingClientRect().width > 0 && BohemiaMotion.box(b); return x ? [x.x + x.w / 2, x.y + x.h / 2] : null; }); if (!doneAt) await p.waitForTimeout(400); }
    await change('crew>map', async () => { if (!doneAt) return false; await tap(doneAt[0], doneAt[1]); }, 2000);
    await fr.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (_e) {} });
    await p.waitForTimeout(800);
    /* ---- making camp and breaking it ---- */
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
    await change('map>camp', async () => { if (await app('heal')) return true; const camp = await M(() => { const e = BohemiaMotion.find('camp'); const b = e && BohemiaMotion.box(e); return b ? [b.x, b.y, b.w, b.h] : null; }); if (!camp) return false; await tap(camp[0] + camp[2] / 2, camp[1] + camp[3] / 2); }, 2600);
    await p.waitForTimeout(800);
    await change('camp>map', async () => { const on = await fr.evaluate(() => !!(window.__CAMP && __CAMP.on) || !!(window.BohemiaMapCamp && BohemiaMapCamp.on && BohemiaMapCamp.on()) || !!(LOOP.open && LOOP.open.camp)); if (!on) return false; await leave(); }, 2600);
    await p.waitForTimeout(800);
    /* ---- the settings (the phone's gear) and back ---- */
    await change('map>settings', () => app('settings'));
    const setClose = async () => { const c = await M(() => { const docs = []; const v = (w, dd) => { if (dd > 4) return; try { docs.push(w.document); for (let i = 0; i < w.frames.length; i++) v(w.frames[i], dd + 1); } catch (_e) {} }; v(window, 0);
      for (const doc of docs) { const e = [...doc.querySelectorAll('button, [role=button], .x, .close, #gearclose, #setclose')].find(b => /^(CLOSE|DONE|BACK|\u00d7|X|BACK TO THE GAME)$/i.test((b.textContent || b.getAttribute('aria-label') || '').trim()) && b.getBoundingClientRect().width > 0); if (e) { const x = BohemiaMotion.box(e); if (x) return [x.x + x.w / 2, x.y + x.h / 2]; } } return null; }); if (!c) return false; await tap(c[0], c[1]); return true; };
    S.setClose = setClose;
    await change('settings>map', setClose);
    await p.waitForTimeout(600);
    /* ---- the map to a fight, the spoils, and home ---- */
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
    await change('map>fight', () => fr.evaluate(() => { try { (function () { var N = om.n, best = null, bd = 1e9; for (var y = 4; y < N - 4; y++) for (var x = 4; x < N - 4; x++) { if (!cityWalkable(x, y)) continue; var near = false; for (var a = -3; a <= 3 && !near; a++) for (var b = -3; b <= 3 && !near; b++) if (townGround(x + a, y + b) || townSafeAt(x + a, y + b)) near = true; if (near) continue; var dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd < bd) { bd = dd; best = [x, y]; } } if (best) { city.x = best[0]; city.y = best[1]; } })(); stepOnce(0); stepOnce(4); } catch (_e) {} meetWalk(() => roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 })); }), 9000);
    let fw = null;
    for (let i = 0; i < 100 && !fw; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) fw = c; } if (!fw) await p.waitForTimeout(200); }
    for (let i = 0; i < 60; i++) { if (await M(() => !window.NFC || NFC.state === 'off')) break; await p.waitForTimeout(200); }
    await p.waitForTimeout(1200);
    S.fw = fw;
    await change('fight>over', async () => { if (!fw) return false; await fw.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }); }, 2400);
    await change('over>spoils', async () => { for (let i = 0; i < 40; i++) { if (await M(() => !window.CITYFIGHT || !!(window.SPOILS && SPOILS.frame))) return true; await p.waitForTimeout(250); } return false; }, 1600);
    await change('spoils>map', () => M(() => { try { if (typeof spoilsLeave === 'function' && window.SPOILS && SPOILS.frame) spoilsLeave(); else nfHome(); } catch (_e) {} }), 6000);
    await fr.evaluate(() => { try { contactClear(); } catch (_e) {} });
  } catch (e) { if (!e || !e.stop) throw e; } finally {
    try { await rec.close(); } catch (e) {}
    if (!opts.keep) { try { await d.close(); } catch (e) {} }
  }
  return { rows, S };
}
/* one more change on a page measure() kept open (opts.keep): the gate's planted fails */
function measureOne(S, name, press, settleMs) { return S.change(name, press, settleMs); }
module.exports = { measure, measureOne, steps, recorder, pieceSteps };

if (require.main === module) {
  const a = process.argv.slice(2);
  const profile = a.find(x => /^(phone_portrait|phone_landscape|computer|tablet)$/.test(x)) || 'phone_portrait';
  const oi = a.indexOf('--only'), only = oi >= 0 ? a[oi + 1].split(',') : null;
  const si = a.indexOf('--stop'), stopAfter = si >= 0 ? a[si + 1] : null;
  const ji = a.indexOf('--json'), jf = ji >= 0 ? a[ji + 1] : null;
  const fi = a.indexOf('--frames'), fd = fi >= 0 ? a[fi + 1] : null;
  (async () => {
    console.log('EVERY CHANGE, MEASURED: ' + profile + (a.includes('--old') ? ' (MOTION 3 off)' : ''));
    const r = await measure({ profile, only, old: a.includes('--old'), frames: fd, stopAfter });
    const cuts = r.rows.filter(x => x.cut);
    console.log('\n' + cuts.length + ' of ' + r.rows.length + ' changes still cut: ' + (cuts.map(x => x.name).join(', ') || 'none'));
    if (jf) fs.writeFileSync(jf, JSON.stringify(r.rows, null, 1));
    process.exit(0);
  })().catch(e => { console.error(e); process.exit(1); });
}
