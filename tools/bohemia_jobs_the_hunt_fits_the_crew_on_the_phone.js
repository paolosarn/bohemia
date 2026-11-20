#!/usr/bin/env node
// JOBS [a hunt fits] 11/20 -- ROW 574 ON HIS PHONE (VAMILY rules 461, 441): A DAY-ONE HUNT NEVER DEALS A BEAST ONE OF WHICH BEATS THE
// COMPANY. The game on a phone (upright and sideways), the demo or the alpha (--alpha), A NEW CREW (three men), the valley K7QM9X.
//   THE SURVEY: every hunt on the shelf taken at every town by the map's own contract door (loopTakeContract, the function the town's
//   'contract' message calls), its packs read, the job let go; with his three men, then with the company counted as six (the one
//   shortcut, said: the map's crewCount answered 6), then planted (the bison's min_men taken out of the page's data) with three.
//   THE HUNT, PLAYED: a board that posts a hunt, opened with a finger, the client tapped, Take it; every pack walked to and fought (the
//   fight's foes read off its own board, then won by the shortcut the jobs' tools use), back to the client, paid.
// Writes <out>/hunt_fits_<tag>.json.
// node tools/bohemia_jobs_the_hunt_fits_the_crew_on_the_phone.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir] [--tag t]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, CODE = arg('--code', 'K7QM9X');
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_20')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], row = { shape, alpha: ALPHA };
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const fightUp = () => page.evaluate(() => !!CITYFIGHT);
  const tapPage = async (frameSel, xy) => { const h = await page.$(frameSel); const b = await h.boundingBox(); await page.touchscreen.tap(b.x + xy[0], b.y + xy[1]); };
  async function fightOut() {
    let cf = null;
    for (let i = 0; i < 150 && !cf; i++) { const h = await page.$('#fightFrame'); if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && typeof showOver === 'function').catch(() => false)) cf = f; } if (!cf) await page.waitForTimeout(200); }
    if (!cf) throw new Error('the fight page never stood');
    const th = await cf.evaluate(() => { const t = FIGHT.S.units.filter(u => u.side === 'them'), y = FIGHT.S.units.filter(u => u.side === 'you'); return { n: t.length, kinds: [...new Set(t.map(u => u.kind))], men: y.length }; });
    await cf.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    let sf = null;
    await waitFor(async () => { const h = await page.$('#spoilsdoor iframe'); if (!h) return false; sf = await h.contentFrame(); return !!sf && await sf.evaluate(() => !!document.getElementById('leave')); }, 20000);
    await page.waitForTimeout(900);
    if (sf) { const b = await sf.evaluate(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }); if (b) await tapPage('#spoilsdoor iframe', b); }
    await waitFor(async () => !(await fightUp()), 20000); await page.waitForTimeout(1200);
    return th;
  }
  /* a finger on an element inside the town's frame, the drawn size read against the frame's own (the alpha held sideways draws it scaled) */
  async function tapIn(sf, sfH, sel, ms) {
    const t0 = Date.now(); let last = null;
    while (Date.now() - t0 < (ms || 8000)) {
      const r = await sf.evaluate((q) => { const e = document.querySelector(q); if (!e || e.disabled) return null; let b = e.getBoundingClientRect(); if (b.top < 0 || b.bottom > innerHeight) { e.scrollIntoView({ block: 'center', behavior: 'instant' }); b = e.getBoundingClientRect(); }
        const x = b.left + b.width / 2, y = b.top + b.height / 2, h = document.elementFromPoint(x, y); return { x, y, hit: !!(h && (h === e || e.contains(h))) }; }, sel).catch(() => null);
      if (r && r.hit && last && Math.abs(r.x - last.x) < 1 && Math.abs(r.y - last.y) < 1) { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]);
        await page.touchscreen.tap(hb.x + r.x * hb.width / (iw[0] || hb.width), hb.y + r.y * hb.height / (iw[1] || hb.height)); return true; }
      last = r; await page.waitForTimeout(250);
    }
    return false;
  }
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.LOOP && LOOP.start && PARTY_MATH.loaded && typeof crewCount === 'function', null, { timeout: 180000 });
    await page.waitForTimeout(2500);
    const HUNTS = await fr.evaluate(() => BohemiaBoardShelf.shelf().offers.filter(o => BohemiaJobKinds.kindOf(o) === 'hunt-kind').map(o => o.id));   /* every hunt on the shelf */
    row.huntIds = HUNTS;
    /* THE SURVEY */
    const survey = (men, plant) => fr.evaluate(([ids, men, plant]) => {
      const keep = window.crewCount, D = BohemiaJobKinds.data(), B = D.beast_looks.bison, mm = B.min_men;
      if (men != null) window.crewCount = function () { return men; }; if (plant) delete B.min_men;
      const out = { company: crewCount(), hunts: 0, packs: 0, kinds: {}, bisonAt: [] }, bs = ctBases(), all = BohemiaBoardShelf.shelf().offers;
      try { Object.keys(bs).forEach(n => ids.forEach(id0 => [0, 1, 2, 3, 4, 5].forEach(v => { const o = all.filter(x => x.id === id0)[0]; if (!o) return; LOOP.held = []; LOOP.open = null;
          const id = v ? id0 + '~' + v : id0, b = bs[n]; travelStop(); city.x = b.x; city.y = b.y;   /* six takes of each hunt (its id marked), so a rare beast cannot hide by chance */
          const c = Object.assign({}, o, { id: id, says: String(o.says).replace(/\{pay\}/g, o.pay) });
          if (!loopTakeContract(c)) return; const j = LOOP.held.filter(h => h.id === id)[0]; if (!j || !j.packs) return; out.hunts++;
          j.packs.forEach(p => { out.packs++; out.kinds[p.faction] = (out.kinds[p.faction] || 0) + 1; if (p.faction === 'bison') out.bisonAt.push(n + ':' + id); }); })));
      } finally { LOOP.held = []; window.crewCount = keep; if (plant) B.min_men = mm; }
      return out; }, [HUNTS, men, plant]);
    /* the hunt reads the ground under a pack from the danger reader's data (it loads behind the page); until it does every pack stands
       on the default ground. Wait for it: the reader's engine, then a warm-up draw, so every survey below reads the real ground */
    await fr.evaluate(async () => { try { if (window.BohemiaJobDanger && BohemiaJobDanger.engine) await BohemiaJobDanger.engine(); } catch (e) {} });
    for (let k = 0; k < 20 && process.argv.indexOf('--nosurvey') < 0; k++) { const w = await survey(6, false); if (w.kinds.bison > 0 || Object.keys(w.kinds).some(x => ['horses', 'stilts', 'goats', 'llamas', 'shrub_oxen', 'teratorns'].indexOf(x) >= 0)) { row.warm = k; break; } await page.waitForTimeout(1000); }
    if (process.argv.indexOf('--nosurvey') > 0) { row.six = { bisonAt: [], kinds: {} }; row.three = { kinds: {}, company: 3, hunts: 0, packs: 0 }; row.planted = { kinds: {} }; }   /* a debugging run */
    else { row.six = await survey(6, false); row.three = await survey(null, false); row.planted = await survey(null, true); }
    /* THE HUNT, PLAYED: for a new crew the day's floor keeps every hunt off the boards (measured: none in twenty-one windows), so the
       hunt is taken through the map's own contract door (loopTakeContract, what a board's Take it posts to) at the town where a company
       of six meets bison, with his own three men, and played to the end */
    const where = (arg('--hunt', '') || row.six.bisonAt[0] || '').split(':');
    if (!where[0]) throw new Error('no town meets bison even at six men');
    row.hunt = { town: where[0], id: where[1], fights: [] };
    await fr.evaluate(([n, id]) => { try { loopClose(); } catch (e) {} LOOP.held = []; LOOP.open = null; const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y;
      const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id.split('~')[0])[0]; loopTakeContract(Object.assign({}, o, { id: id, says: String(o.says).replace(/\{pay\}/g, o.pay) })); }, [where[0], where[1]]);
    if (!await waitFor(() => fr.evaluate((id) => LOOP.held.some(h => h.id === id), where[1]), 10000)) throw new Error('the hunt was not taken');
    row.hunt.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_hunt_taken.png')); await page.screenshot({ path: path.join(ROOT, row.hunt.png) });
    const cand = { id: where[1] };
    row.hunt.packs = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; return j ? { need: j.need, packs: j.packs.map(p => p.faction + ' x' + p.n) } : null; }, cand.id);
    row.hunt.taps = 0; row.hunt.marked = 0;
    for (let s = 0; s < 30; s++) {
      /* a pack is gone after the way a player goes after it: a finger on the pack where the map draws it (its hit box), which marks the
         chase (a pack he tapped is never held at a town's door); a pack off the glass is marked the same way the tap would (said) */
      const hit = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j || j.stage !== 'hunt' || !j.packs[0]) return null; const p = j.packs[0];
        const h = BohemiaJobKinds.hits().filter(x => x.job === id && x.pack === p.id)[0]; return h ? [h.x + h.w / 2, h.y + h.h / 2, p.id] : { mark: p.id }; }, cand.id);
      const cfH1 = await page.$('#cityFrame'), cb = cfH1 ? await cfH1.boundingBox() : null;   /* the frame is read again each step: after a fight its handle can go stale */
      if (hit && Array.isArray(hit) && cb) { const cw = await fr.evaluate(() => [innerWidth, innerHeight]); await page.touchscreen.tap(cb.x + hit[0] * cb.width / cw[0], cb.y + hit[1] * cb.height / cw[1]); row.hunt.taps++; await page.waitForTimeout(400);
        await fr.evaluate(([id, pid]) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (j && j.chase == null) { j.chase = pid; window.__HUNT_MARKED = (window.__HUNT_MARKED | 0) + 1; } }, [cand.id, hit[2]]); }
      else if (hit && (hit.mark != null || Array.isArray(hit))) { if (Array.isArray(hit)) hit.mark = hit[2]; await fr.evaluate(([id, pid]) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (j) j.chase = pid; }, [cand.id, hit.mark]); row.hunt.marked++; }
      const st = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return { gone: true };
        const at = (x, y) => { travelStop(); city.x = x; city.y = y; };
        let x, y; if (j.stage === 'hunt') { const p = j.packs[0]; if (!p) return { wait: 'no pack yet' }; x = p.x; y = p.y; } else { if (!j.target) return { wait: 'no target yet' }; x = j.target.x; y = j.target.y; }   /* between two steps a hunt can be between packs or turning home */
        at(x, y); const r = BohemiaJobKinds.arrived(x, y) || BohemiaJobKinds.step(); return { stage: j.stage, got: j.got, need: j.need, fight: !!r }; }, cand.id);
      (row.hunt.steps = row.hunt.steps || []).push(st); if (st.gone) break; if (st.stuck) throw new Error(st.stuck); if (st.wait) { await page.waitForTimeout(800); continue; }
      if (await waitFor(fightUp, st.fight ? 20000 : 2500)) row.hunt.fights.push(await fightOut());
      else if (st.fight && !row.hunt.stall) { row.hunt.stall = await fr.evaluate(() => ({ fighting: LOOP.fighting, refused: window.__JOB_REFUSED | 0, meet: typeof MEET !== 'undefined' ? { on: MEET.on, up: MEET.up, walk: MEET.walk } : null, mode: typeof MODE !== 'undefined' ? MODE : null,
          meetCard: !!document.querySelector('#meetcard') && getComputedStyle(document.querySelector('#meetcard')).display, held: LOOP.held.map(h => h.id + ':' + h.stage) })).catch(e => String(e));
        row.hunt.stallTop = await page.evaluate(() => ({ cityfight: typeof CITYFIGHT !== 'undefined' ? !!CITYFIGHT : 'none', frame: !!document.getElementById('fightFrame') })).catch(e => String(e));
        row.hunt.stallPng = path.relative(ROOT, path.join(OUTD, TAG + '_stall.png')); await page.screenshot({ path: path.join(ROOT, row.hunt.stallPng) }); if (process.argv.indexOf('--nosurvey') > 0) break; }
      await page.waitForTimeout(600);
    }
    row.hunt.paid = await fr.evaluate((id) => (window.__JOB_PAID || []).filter(p => p.id === id).slice(-1)[0] || null, cand.id);
    row.hunt.tapMissed = await fr.evaluate(() => window.__HUNT_MARKED | 0);   /* taps that landed but did not mark the chase */
    row.hunt.company = await fr.evaluate(() => crewCount());
    row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_hunt_done.png')); await page.screenshot({ path: path.join(ROOT, row.png) });
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); row.errAt = String(e && e.stack || '').split('\n').slice(0, 4).join(' | ').slice(0, 400); }
  row.errs = errs.slice(0, 5);
  console.log('  ' + TAG + ' ' + shape + ': ' + (row.err ? 'ERR ' + row.err + ' ' : '') + (row.three ? 'his ' + row.three.company + ' men: ' + row.three.hunts + ' hunts, ' + row.three.packs + ' packs, bison ' + (row.three.kinds.bison || 0) + ' | six men: bison ' + ((row.six || {}).kinds || {}).bison + ' of ' + (row.six || {}).packs + ' | planted (three men, no line): bison ' + ((row.planted || {}).kinds || {}).bison : '') +
    (row.hunt && row.hunt.paid ? ' | ' + row.hunt.id + ' at ' + row.hunt.town + ' played: packs ' + JSON.stringify(row.hunt.packs.packs) + ', fights ' + row.hunt.fights.map(f => f.kinds.join('+') + ' x' + f.n).join(', ') + ', paid ' + row.hunt.paid.paid : ''));
  await d.close().catch(() => {});
  return row;
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'hunt_fits_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_the_hunt_fits_the_crew_on_the_phone.js', tag: TAG, alpha: ALPHA, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();
