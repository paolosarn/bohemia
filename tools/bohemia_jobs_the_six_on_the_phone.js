#!/usr/bin/env node
// JOBS [more contract kinds] 11/10 -- THE SIX ON HIS PHONE (VAMILY rules 443(c), 441(a); EYES row 551).
// The demo on a phone (upright 390 x 844 and sideways 844 x 390), A NEW CREW picked at the door: for each of Battle Brothers' six contract
// kinds (escort a caravan, defend a place, hunt a beast, deliver, clear a place, collect a debt) one offer is taken off a town's board
// by the board's own message (the settlement's 'Take it'), its fight is set off by the job's own code where he would meet it (the
// crew is put on the job's spot and the map's own arrival or step is called: the walk there is the one shortcut, said), the fight
// opens on the page, every one of theirs is put down (THE LOOP's own way), and the end screen's head line is read: who they were. A
// photograph of each end screen. Writes records/target/jobs_11_10/<shape>_<kind>.png and records/target/jobs_11_10/six.json.
// node tools/bohemia_jobs_the_six_on_the_phone.js [--shapes phone_portrait,phone_landscape] [--out records/target/jobs_11_10] [--tag after]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.join(ROOT, arg('--out', 'records/target/jobs_11_10')), TAG = arg('--tag', 'after');
/* --plant nofoe: the job kinds' own names for their enemies taken away in this page only (foe_says, and every row's own), for the gate's
   planted fail; the end screen then falls back to what it said before */
const PLANT = arg('--plant', '');
fs.mkdirSync(OUTD, { recursive: true });
/* the six, each an offer of the kind (the new ones where they exist; on a tree without them the kind's old offer) */
const SIX = [
  { kind: 'haul-caravan', word: 'ESCORT A CARAVAN', ids: ['jb-escort-tanks', 'qd-ae09'] },
  { kind: 'hold-defend', word: 'DEFEND A PLACE', ids: ['jb-hold-pumps', 'qd-r01'] },
  { kind: 'hunt-kind', word: 'HUNT A BEAST', ids: ['qd-ap03', 'qd-aa01'] },
  { kind: 'carry', word: 'DELIVER', ids: ['jb-carry-insulin', 'qd-ar08'] },
  { kind: 'clear-camp', word: 'CLEAR A PLACE', ids: ['jb-clear-lot', 'qd-s01'] },
  { kind: 'collect', word: 'COLLECT A DEBT', ids: ['jb-collect-tito', 'jk-collect-beto'] }];

async function walk(shape) {
  const d = await drive.open({ profile: shape, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], out = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const fightUp = () => page.evaluate(() => !!CITYFIGHT);
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.LOOP && LOOP.start && PARTY_MATH.loaded, null, { timeout: 150000 });
    await page.waitForTimeout(2500);
    if (PLANT === 'nofoe') await fr.evaluate(() => { const D = BohemiaJobKinds.data(); D.foe_says = {}; Object.values(D.offers || {}).forEach(o => { if (o) delete o.foe_says; }); });
    for (const K of SIX) {
      const row = { kind: K.kind, word: K.word, id: null, head: null, foe: null, faction: null, n: null, png: null };
      try {
        await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; try { loopClose(); } catch (e) {} });
        const id = await fr.evaluate((ids) => { const all = BohemiaBoardShelf.shelf().offers; return ids.filter(i => all.some(o => o.id === i))[0] || null; }, K.ids);
        row.id = id; if (!id) throw new Error('no offer of the kind');
        /* the board's own 'Take it' message, from the nearest town (THE LOOP's contract handler makes the job) */
        const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { n, d: dd }; } return best && best.n; });
        await fr.evaluate(([id, town]) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0];
          const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) });
          window.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: town, batteries: null, contract: c }, '*'); }, [id, town]);
        await waitFor(() => fr.evaluate((id) => LOOP.held.some(h => h.id === id), id), 8000);
        /* the job's own code where he meets its fight */
        const fired = await fr.evaluate((id) => {
          const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return 'no job';
          const at = (x, y) => { travelStop(); city.x = x; city.y = y; };
          if (j.plays === 'hold-defend') { at(j.target.x, j.target.y); return BohemiaJobKinds.arrived(j.target.x, j.target.y) ? 'wave' : 'no wave'; }
          if (j.plays === 'clear-camp') { at(j.camp.x, j.camp.y); return BohemiaJobKinds.arrived(j.camp.x, j.camp.y) ? 'camp' : 'no camp'; }
          if (j.plays === 'hunt-kind') { const p = j.packs[0]; at(p.x, p.y); return BohemiaJobKinds.arrived(p.x, p.y) || BohemiaJobKinds.step() ? 'pack' : 'no pack'; }
          if (j.plays === 'haul-caravan') { j.walked = (j.ambush && j.ambush[0]) || 3; for (let k = 0; k < 6 && !LOOP.fighting; k++) { BohemiaJobKinds.step(); if (j.raid) { at(j.raid.x, j.raid.y); BohemiaJobKinds.step(); } } return LOOP.fighting ? 'raid' : 'no raid'; }
          if (j.plays === 'carry') { j.thiefAt = 1; j.walked = 1; for (let k = 0; k < 6 && !LOOP.fighting; k++) { BohemiaJobKinds.step(); if (j.thief) { at(j.thief.x, j.thief.y); BohemiaJobKinds.arrived(j.thief.x, j.thief.y) || BohemiaJobKinds.step(); } } return LOOP.fighting ? 'thief' : 'no thief'; }
          if (j.plays === 'collect') { const L = j.legs[0]; at(L.x, L.y); BohemiaJobKinds.arrived(L.x, L.y); return 'talk'; }
          return 'kind ' + j.plays;
        }, id);
        row.fired = fired;
        if (fired === 'talk') {   /* the debtor's own card: a finger on 'Take all of it' */
          await page.waitForTimeout(1200);
          const tapped = await fr.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Take all of it/i.test(x.textContent || '') && x.getBoundingClientRect().width > 0)[0]; if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
          if (tapped) { const cb = await (await page.$('#cityFrame')).boundingBox(); await page.touchscreen.tap(cb.x + tapped[0], cb.y + tapped[1]); } else row.fired = 'no card';
        }
        if (!(await waitFor(fightUp, 20000))) throw new Error('no fight opened (' + row.fired + ')');
        row.foe = await page.evaluate(() => (window.__FIGHT_NOW && window.__FIGHT_NOW.foe) || null);
        /* the fight on the page: every one of theirs down, its own end */
        let cf = null;
        for (let i = 0; i < 150 && !cf; i++) { const h = await page.$('#fightFrame'); if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && typeof showOver === 'function').catch(() => false)) cf = f; } if (!cf) await page.waitForTimeout(200); }
        if (!cf) throw new Error('the fight page never stood');
        const th = await cf.evaluate(() => { const t = FIGHT.S.units.filter(u => u.side === 'them'); return { n: t.length, kinds: [...new Set(t.map(u => u.kind))].slice(0, 3), faction: FIGHT.S.party && FIGHT.S.party.faction }; });
        row.n = th.n; row.faction = th.faction; row.kinds = th.kinds;
        await cf.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
        let sf = null;
        await waitFor(async () => { const h = await page.$('#spoilsdoor iframe'); if (!h) return false; sf = await h.contentFrame(); return !!sf && await sf.evaluate(() => { const e = document.getElementById('head'); return !!e && (e.textContent || '').trim().length > 0 || !!document.getElementById('leave'); }); }, 20000);
        /* the head is written when the screen is dressed, a beat after it stands: read it once it says something, after the photograph */
        if (sf) await waitFor(() => sf.evaluate(() => (document.getElementById('head').textContent || '').trim().length > 0), 8000);
        await page.waitForTimeout(1200);
        row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_' + K.kind + '.png'));
        await page.screenshot({ path: path.join(ROOT, row.png) });
        if (sf) { row.head = await sf.evaluate(() => (document.getElementById('head').textContent || '').trim()); row.said = await sf.evaluate(() => (document.getElementById('word').textContent || '').trim()); }
        /* LEAVE, as he would, and home */
        if (sf) { const b = await sf.evaluate(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; });
          const box = await (await page.$('#spoilsdoor iframe')).boundingBox(); if (b) await page.touchscreen.tap(box.x + b[0], box.y + b[1]); }
        await waitFor(async () => !(await fightUp()), 20000); await page.waitForTimeout(1500);
      } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
      out.push(row);
      console.log('  ' + shape + ' ' + K.word.padEnd(17) + ' ' + (row.id || '-') + ': ' + (row.err ? 'ERR ' + row.err : '"' + row.head + '" (' + row.n + ' ' + (row.kinds || []).join('/') + ', foe handed: ' + row.foe + ')'));
    }
  } catch (e) { out.push({ err: String(e && e.message || e).slice(0, 300) }); }
  await d.close().catch(() => {});
  return { shape, rows: out, errs };
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'six_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_the_six_on_the_phone.js', tag: TAG, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();
