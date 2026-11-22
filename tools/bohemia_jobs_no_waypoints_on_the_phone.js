#!/usr/bin/env node
// JOBS TWO [no waypoints] 11/22 -- NO WAYPOINT ARROWS ON THE MAP, ON HIS PHONE (VAMILY rules 473, 441). Paolo 11/22: 'I don't want
// direction arrows if my map is zoomed in... my whole map gets cluttered with waypoint arrows towards these little side quests... just
// have the part highlighted when you're close... I have like 14 white points on my map'. The game on a phone (upright and sideways),
// the demo or the alpha (--alpha), A NEW CREW, the valley K7QM9X:
//   1. his road holds 14 side places (the road's own quest record, each quest begun with a place to go, the one shortcut, said) and
//      two jobs from a board (the board's own message, as the town's book walk takes them);
//   2. the map at its near stop: every mark the jobs' layer drew (__JOB_MARKS), how many stand at the glass's edge (a name and a point
//      off toward a place off the glass), and how many places on the glass are ringed where they stand; a picture;
//   3. the camera moved over one side place that was off the glass: it is ringed where it stands, its name under it;
//   4. the phone's own door: the first job's line on the phone tapped with a finger walks him toward it (rule 448).
// Writes <out>/no_waypoints_<tag>.json.
// node tools/bohemia_jobs_no_waypoints_on_the_phone.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir] [--tag t]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, CODE = arg('--code', 'K7QM9X');
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_22')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], row = { shape };
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const side = shape === 'phone_portrait' ? 'upright' : 'sideways';
  const shot = async (name) => { const p = path.relative(ROOT, path.join(OUTD, TAG + '_' + side + '_' + name + '.png')); await page.screenshot({ path: path.join(ROOT, p) }); return p; };
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaRoadEvents && BohemiaRoadEvents.ready() && window.LOOP && LOOP.start, null, { timeout: 180000 });
    await page.waitForTimeout(2500);
    /* 1. fourteen side places on his road (each a quest begun, its place 12 to 60 blocks out, round him) and two jobs held */
    row.planted = await fr.evaluate(() => {
      try { loopClose(); } catch (e) {} LOOP.held = [];
      const Q = BohemiaRoadEvents.data().quests.quests, ids = Object.keys(Q).slice(0, 14), s = JSON.parse(localStorage.getItem('bohemia.roadevents.v1') || '{}');
      s.quests = s.quests || {}; s.seen = s.seen || {}; s.flags = s.flags || {};
      const free = (x, y) => { try { return (typeof cityWalkable !== 'function' || cityWalkable(x, y)) && !townGround(x, y); } catch (e) { return true; } };
      const out = [];
      ids.forEach((qid, i) => { const a = i / ids.length * Math.PI * 2, r = 12 + (i * 7) % 48; let x = Math.round(city.x + Math.cos(a) * r), y = Math.round(city.y + Math.sin(a) * r);
        for (let k = 0; k < 30 && !free(x, y); k++) { x += 1; y += (k % 2); }
        s.quests[qid] = { stage: 10, at: { x: city.x, y: city.y }, node: Q[qid].start, know: {}, seen: {}, spots: {}, began: 1, ctx: { town: 'the next town' }, mark: { x, y, name: 'PLACE ' + (i + 1), act: 'FIND' } };
        out.push([qid, x, y]); });
      localStorage.setItem('bohemia.roadevents.v1', JSON.stringify(s));
      return { at: [city.x, city.y], places: out, held: BohemiaRoadEvents.places().length };
    });
    row.jobs = [];
    for (const id of ['jb-find-singer', 'qd-ar05']) {
      const got = await fr.evaluate((jid) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === jid)[0] || (BohemiaJobKinds.offers ? null : null); if (!o) return false;
        const t = (Object.keys(ctBases())[0]); const c = Object.assign({}, o, { says: String(o.says || '').replace(/\{pay\}/g, o.pay) });
        window.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: (o.towns && o.towns[0]) || t, batteries: null, contract: c }, '*'); return true; }, id);
      if (got) await waitFor(() => fr.evaluate((jid) => LOOP.held.some(h => h.id === jid), id), 10000);
      row.jobs.push({ id, held: await fr.evaluate((jid) => LOOP.held.some(h => h.id === jid), id) });
    }
    /* 2. the near stop: what the jobs' layer drew */
    const read = () => fr.evaluate(() => { try { render(); } catch (e) {} const M = window.__JOB_MARKS || [];
      return { marks: M.length, onGlass: M.filter(m => m.on).length, atEdge: M.filter(m => !m.on && (m.box || m.ex != null)).length, offGlass: M.filter(m => !m.on).length,
        drew: { rings: (MAP_DREW && MAP_DREW.jobRings) | 0, edges: (MAP_DREW && MAP_DREW.jobEdges) | 0 }, labels: M.filter(m => !m.on && (m.box || m.ex != null)).map(m => m.label).slice(0, 20) }; });
    await page.waitForTimeout(1500);
    row.near = await read(); row.near.png = await shot('near');
    /* 3. one side place that was off the glass: the camera over it (the map's own fit to a cell), ringed where it stands */
    const target = await fr.evaluate(() => { const M = window.__JOB_MARKS || []; const m = M.filter(x => !x.on && /^quest:/.test(String(x.id)))[0]; return m ? { id: m.id, x: m.x, y: m.y, name: m.name } : null; });
    row.target = target;
    if (target) {
      await fr.evaluate((t) => { try { travelStop(); } catch (e) {} city.x = t.x + 2; city.y = t.y + 2; try { if (typeof camSnap === 'function') camSnap(); } catch (e) {} try { render(); } catch (e) {} }, target);
      await page.waitForTimeout(1500);
      row.over = await fr.evaluate((t) => { try { render(); } catch (e) {} const m = (window.__JOB_MARKS || []).filter(x => x.id === t.id)[0]; return m ? { on: m.on, sx: m.sx, sy: m.sy, label: m.label } : null; }, target);
      row.over.png = await shot('over_a_place');
      row.overAll = await read();
    }
    /* 4. the phone's door: the first held job's line tapped with a finger walks him toward it */
    const line = await page.evaluate(() => { const e = document.querySelector('#bohphone .home .jobs .jc, #bohphone .home .jobs [data-job]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, id: e.dataset.job || e.dataset.id || null, t: e.textContent.trim().slice(0, 40) }; });
    row.phoneLine = line;
    if (line) { await page.evaluate(() => { window.__PHONE_JOB_GO = null; }); await page.touchscreen.tap(line.x, line.y); await page.waitForTimeout(1500);
      row.phoneGo = await page.evaluate(() => window.__PHONE_JOB_GO || window.__PHONE_QUEST_GO || null).catch(() => null);
      if (!row.phoneGo) row.phoneGo = await fr.evaluate(() => window.__PHONE_JOB_GO || null); }
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); }
  console.log('  ' + TAG + ' ' + side + ': ' + (row.err ? 'ERR ' + row.err : 'side places ' + row.planted.held + ', jobs held ' + row.jobs.filter(j => j.held).length + '; at the near stop: marks ' + row.near.marks + ', on the glass ' + row.near.onGlass + ', AT THE EDGE ' + row.near.atEdge + ' ' + JSON.stringify(row.near.labels) + '; over ' + (row.target ? row.target.name : 'none') + ': ' + JSON.stringify(row.over) + '; the phone\'s line ' + JSON.stringify(row.phoneLine) + ' -> ' + JSON.stringify(row.phoneGo)));
  await d.close().catch(() => {});
  return { shape, alpha: ALPHA, row, errs };
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'no_waypoints_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_no_waypoints_on_the_phone.js', tag: TAG, alpha: ALPHA, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();
