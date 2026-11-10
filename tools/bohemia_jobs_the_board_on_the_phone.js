#!/usr/bin/env node
// JOBS [jobs that fit] 11/8 -- THE BOARD ON HIS PHONE, BEFORE AND AFTER (VAMILY rule 441(a): a ship plays end to end on the page he
// plays, on a phone upright and sideways, started the way he starts it).
// The demo on a phone (390 x 844 upright, 844 x 390 sideways): A NEW CREW of three picked at the door, the valley VEGAS7, day 50 (the
// day-fifty filter lets the whole range stand, so the board shows what the job math deals); the map walks into the camp whose board
// holds the most hunts and jobs of the beasts, taps its BOARD with a finger, waits for every row's stars and blood (the game's own
// reader, its own plays), and photographs the board. BEFORE: the same page with party_math.json served without job_contract (the
// job math before JOBS 11/8); AFTER: the file as it is. Writes records/target/jobs_11_8/board_<before|after>_<shape>.png and
// records/target/jobs_11_8/board.json (each row: the job, its stars, its danger).
// node tools/bohemia_jobs_the_board_on_the_phone.js [--code VEGAS7] [--day 50] [--origin newcrew]
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const CODE = arg('--code', 'VEGAS7'), DAY = +arg('--day', 50), ORIGIN = arg('--origin', 'newcrew');
const OUTD = path.join(ROOT, 'records/target/jobs_11_8'); fs.mkdirSync(OUTD, { recursive: true });
const PM = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/party_math.json'), 'utf8'));
const OLD = path.join(os.tmpdir(), 'jobs_party_math_before_' + process.pid + '.json');
const P2 = JSON.parse(JSON.stringify(PM)); delete P2.job_contract; fs.writeFileSync(OLD, JSON.stringify(P2));

async function walk(variant, profile) {
  const d = await drive.open({ profile, fog: false, engage: false, keepCards: true,
    serve: variant === 'before' ? { '/records/target/bb/party_math.json': OLD } : {},
    arm: "try { localStorage.setItem('bohemia.world.bench.v1', '" + CODE + "'); var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = '" + ORIGIN + "'; localStorage.setItem('bohemia.start', JSON.stringify(s)); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(400); } return false; };
  const out = { variant, profile, rows: null, place: null, errs };
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaJobDanger && BohemiaJobDanger.ready() && window.LOOP && LOOP.start && LOOP.start.company && PARTY_MATH.loaded, null, { timeout: 150000 });
    out.contract = await fr.evaluate(() => !!partyV('job_contract'));
    /* the calendar at day DAY; the camp (or town) whose own deal holds the most beast and hunt jobs */
    const pick = await fr.evaluate((day) => { DAY.day = day; const P = BohemiaBoardShelf.mapPlaces(day) || [], bs = ctBases() || {}; let best = null;
      P.forEach(p => { const L = BohemiaBoardShelf.pick({ name: p.name, tier: p.tier }, day, { traits: p.traits || [], held: [], places: P }) || [];
        const k = L.filter(o => { const K = String(BohemiaJobKinds.kindOf(o)); return K === 'hunt-kind' || K === 'lair' || /beast|wolv|hyen|dog/.test(JSON.stringify(o).toLowerCase()); }).length;
        const b = bs[p.name]; if (b && (!best || k > best.k)) best = { n: p.name, x: b.x, y: b.y, k, ids: L.map(o => o.id) }; });
      return best; }, DAY);
    out.place = pick;
    const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
    for (let k = 0; k < 4 && !(await settleOpen()); k++) { await fr.evaluate((t) => { travelStop(); townTap({ name: t.n, x: t.x, y: t.y }); }, pick); await waitFor(settleOpen, 60000);
      if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); }
    if (!(await settleOpen())) throw new Error('the town did not open');
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    for (let k = 0; k < 4; k++) {
      const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox();
      if (xy) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y);
      if (await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && document.querySelectorAll('#sheet button.act.client').length > 0), 8000)) break;
    }
    /* every row read: its stars and its blood are the reader's own (the game's plays, not this tool's) */
    const IDS = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id));
    const rowsNow = () => fr.evaluate(([ids, place]) => { const all = BohemiaBoardShelf.shelf().offers; return ids.map(id => { const o = all.filter(x => x.id === id)[0]; const R = o && BohemiaJobDanger.peek(o, place);
      return { id, title: o && o.title, skulls: o && o.skulls, state: R ? R.state : null, stars: R && R.stars, danger: R && R.danger != null ? +R.danger.toFixed(3) : null,
        fights: R && R.fights ? R.fights.filter(f => f.p >= 0.999 && !f.road).map(f => f.n + ' ' + f.faction) : [] }; }); },
      [IDS, pick.n]);
    await waitFor(async () => (await rowsNow()).every(r => r.state === 'read'), 600000);
    await page.waitForTimeout(1500);
    out.rows = await rowsNow();
    out.png = 'records/target/jobs_11_8/board_' + variant + '_' + (profile === 'phone_portrait' ? 'upright' : 'sideways') + '.png';
    await page.screenshot({ path: path.join(ROOT, out.png) });
  } catch (e) { out.err = String(e && e.message || e).slice(0, 300); }
  await d.close().catch(() => {});
  console.log(variant + ' ' + profile + ': ' + (out.err ? 'ERR ' + out.err : (out.place && out.place.n) + ' ' + out.rows.map(r => r.id + ' ' + r.stars + '* ' + r.danger + ' [' + r.fights.join(', ') + ']').join(' | ')));
  return out;
}
(async () => {
  const res = [];
  res.push(await walk('before', 'phone_portrait'));
  res.push(await walk('after', 'phone_portrait'));
  res.push(await walk('after', 'phone_landscape'));
  fs.writeFileSync(path.join(OUTD, 'board.json'), JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_the_board_on_the_phone.js', code: CODE, day: DAY, origin: ORIGIN, walks: res }, null, 1));
  try { fs.unlinkSync(OLD); } catch (e) {}
})();
