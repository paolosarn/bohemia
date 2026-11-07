#!/usr/bin/env node
/* AUTO AT 4X NEVER CRASHES (COMBAT 10, rule 417(a), ask line 473; Paolo 11/6: 'when I put the combat on auto at four times speed and
   I have like 11 people and they have like 16 people the game crashes, so you gotta do what you gotta do to handle that'; rule 378:
   no cap on theirs). The finish line's stage 1 item 1: nothing breaks a run.
   MEASURED BEFORE (records/BOHEMIA_COMBAT_10_AUTO_AT_4X_NEVER_CRASHES_11_6_26.md): nothing stacked at 4x and no page error; AUTO's
   longest think 41 ms in the demo's 11 against 16; the TAB is what goes: 1.5 GB on the map, 2.1 to 2.3 GB in that fight, the fight's
   own decoded pictures 329 MB by day and 847 MB AT NIGHT (134 whole darkened sheet copies, 518 MB, never let go).
   Legs:
   A1 THE BRAIN IS THE SAME (headless, the live rules against the same rules with this round's three speed-ups taken back out): every
      event of every fight the same, on the same dice, from 6 against 8 to 16 against 30, men, beasts, the mechanic's machines, kids,
      heavies, some at night; and no slower
   A2 16 AGAINST 30 ON HIS PHONE, AUTO AT 4X (upright, the fight's page, tools/bohemia_combat_auto_at_4x_probe_11_6_26.js): plays from
      the board to the end with no page error and no broken turn; nothing stacks (timers alive, motions queued); AUTO's longest think
      and the frames' middle in budget, no freeze; the JS heap flat (after a collection, start and end); the decoded pictures under the
      ceiling and lower at the end than at their peak (a sheet nobody is drawn from is let go)
   A3 THE SAME AT NIGHT: the night's cells under NIGHT_CELLS_MB, no whole night sheet made for a man, the decoded pictures no more than
      the night's cells over the day's ceiling; and the way it was (FIGHT_OPTS.nightWhole) on 11 against 16 at night: at least twice as many
   ('nothing stacks': the motions that take time stay under QUEUED; a burst of zero-length notes, every morale check after a death, is
   let through as long as the queue is drained by the next sample)
   A4 THE NIGHT IS THE SAME PIXELS: a cell darkened alone against the same cell cut from the whole darkened sheet, four moons, a body
      sheet and a held sheet: no channel of any pixel differs; the pick's light the same number
   A5 ON HIS COMPUTER: 12 against 20, AUTO at 4x, to the end, no error
   A6 THE DEMO, THROUGH THE MAP'S OWN DOOR (his upright phone, his company of 11 against 16, AUTO and 4x pressed on the phone): to the
      end, no error, the heap flat, the pictures under the ceiling
   Run: node gates/auto_at_4x_never_crashes_gate.js [--fast] (skips A3's before, A5, A6) [--nodemo] (skips A6) [--n 4] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const H = require(path.join(ROOT, 'tools/bohemia_fight_headless.js')), G = require(path.join(ROOT, 'tools/bohemia_tuning_the_whole_grid.js'));
const { probe } = require(path.join(ROOT, 'tools/bohemia_combat_auto_at_4x_probe_11_6_26.js'));
const { performance } = require('perf_hooks');
const has = k => process.argv.indexOf(k) > 0, arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const FAST = has('--fast'), NODEMO = FAST || has('--nodemo'), N = +arg('--n', 4);
/* the budgets (this box's browser paints without a graphics chip, so a frame's length here is the floor of what a phone with one does) */
const THINK_MS = 150, FRAME_MED_MS = 20, FREEZE_MS = 750, TIMERS = 12, QUEUED = 16, HEAP_GROWTH_MB = 24, PICS_CEILING_MB = 450, NIGHT_CELLS_MB = 48;
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');

/* A1 */
{
  const BACK = [
    [/let near = m;\n    if \(!near\) \{ let bd = Infinity;[^\n]*\n/, 'const near = m || foes(t).sort(function (p, q) { return dist(p, t) - dist(q, t); })[0];\n'],
    ['const Z = ZOC && ZOC.side === u.side ? ZOC : null', 'const Z = null']
  ];
  let found = 0;
  const before = r => { BACK.forEach(([a, b]) => { const r2 = r.replace(a, b); if (r2 !== r) found++; r = r2; }); return r; };
  const KINDS = [s => ({ faction: 'brigands', count: s }), s => ({ faction: 'beasts', count: s }),
    s => { const band = ['necromancer']; for (let i = 1; i < s; i++) band.push(i % 3 === 2 ? 'armored_wiederganger' : 'wiederganger'); return { band, count: band.length, rolled: true }; },
    s => ({ faction: 'kids', count: s }), s => ({ faction: 'heavies', count: s })];
  const play = (ctx, k, a, b) => { const F = ctx.FIGHT, ds = ctx.DB.boardKinds.districts, d = ds[(k * 7 + 3) % ds.length], st = ['early', 'middle'][k % 2];
    ctx.setSeed(9100 + k + a * 31);
    F.setup({ auto: true, formation: null, company: G.companyOf(a, st), cap: a, party: Object.assign({ days: st === 'early' ? 1 : 30 }, KINDS[k % KINDS.length](b)), days: st === 'early' ? 1 : 30,
      district: d.district, cell: { x: 11 + k % 29, y: 7 + k % 31 }, act: 1, night: k % 3 === 1 });
    const S = F.S; S.deploy = false; try { F.startFight && F.startFight(); } catch (e) {}
    let g = 0; const t0 = performance.now(), idle = G.idleWatch(F);
    while (!S.over && g < 60000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; if (idle()) break; }
    return { log: JSON.stringify(S.log), ms: performance.now() - t0, res: S.result }; };
  const nw = H.engine(), od = H.engine({ patch: before });
  let same = 0, n = 0, tN = 0, tO = 0; const bad = [];
  for (const [a, b] of [[6, 8], [11, 16], [16, 30]]) for (let k = 0; k < N; k++) {
    let x, y; try { x = play(nw, k, a, b); } catch (e) { x = { log: 'THREW ' + e.message, ms: 0 }; } try { y = play(od, k, a, b); } catch (e) { y = { log: 'THREW ' + e.message, ms: 0 }; }
    n++; if (x.log === y.log) same++; else bad.push(a + 'v' + b + ' #' + k + ' ' + x.res + '/' + y.res); tN += x.ms; tO += y.ms;
  }
  leg(found === BACK.length && same === n && n >= 9 && tN <= tO * 1.05,
    '*** A1 THE BRAIN IS THE SAME *** (headless, ' + n + ' fights from 6 against 8 to 16 against 30, men, beasts, machines, kids, heavies, some at night): every event the same on the same dice as the brain without this round\'s speed-ups, and no slower',
    same + ' of ' + n + ' the same' + (bad.length ? ', differ: ' + bad.slice(0, 3).join('; ') : '') + '; the brain\'s time ' + Math.round(tO) + ' ms before, ' + Math.round(tN) + ' ms now');
}

const fightOk = (s, think) => s && s.over && s.errors === 0 && s.broke === 0 && s.hand === 4 && s.auto && s.timersMax <= TIMERS && s.timedMax <= QUEUED && s.drains &&
  s.thinkMax <= (think || THINK_MS) && s.frameMed <= FRAME_MED_MS && s.longMax <= FREEZE_MS && s.heap1 !== null && s.heap1 <= s.heap0 + HEAP_GROWTH_MB;
const brief = s => s ? JSON.stringify({ over: s.over, result: s.result, rounds: s.rounds, secs: s.secs, errors: s.errors, broke: s.broke, speed: s.hand, auto: s.auto, timers: s.timersMax, queued: s.timedMax, queuedAll: s.animMax, drains: s.drains,
  think: s.thinkMax, frameMed: s.frameMed, frameP95: s.frameP95, freezeMax: s.longMax, heapMB: [s.heap0, s.heap1], picsMB: [s.heldPeak, s.heldEnd], night: s.pics && s.pics.night, letGo: s.pics && s.pics.poseLetGo, err: s.firstErrors }) : 'no run';

(async () => {
  /* A2 */
  let day = null;
  try { day = await probe({ his: 16, theirs: 30, profile: 'phone_portrait', mode: 'bare', seed: 7 }); } catch (e) { day = null; }
  leg(fightOk(day) && day.stood.his === 16 && day.stood.theirs === 30 && day.heldPeak <= PICS_CEILING_MB && day.heldEnd < day.heldPeak && day.pics.poseLetGo > 0,
    '*** A2 16 AGAINST 30 ON HIS PHONE, AUTO AT 4X *** (upright, start to end): no error, nothing stacks, AUTO\'s think under ' + THINK_MS + ' ms, the frames\' middle under ' + FRAME_MED_MS + ' ms, no freeze over ' + FREEZE_MS + ' ms, the heap flat, the decoded pictures under ' + PICS_CEILING_MB + ' MB and let go as they go unused', brief(day));

  /* A3 */
  let night = null;
  try { night = await probe({ his: 16, theirs: 30, profile: 'phone_portrait', mode: 'bare', seed: 7, night: true }); } catch (e) { night = null; }
  leg(fightOk(night) && night.night && night.picsPeak && night.picsPeak.night <= NIGHT_CELLS_MB + 1 && night.pics.night <= NIGHT_CELLS_MB + 1 && night.picsPeak.nightWholeN === 0 && night.heldPeak <= PICS_CEILING_MB + NIGHT_CELLS_MB,
    '*** A3 THE SAME AT NIGHT ***: the night laid cell by cell under ' + NIGHT_CELLS_MB + ' MB, no whole darkened sheet for a man, the pictures no more than the night\'s cells over the day\'s ceiling', brief(night) + ' cells ' + (night && night.pics && night.pics.nightCells));
  if (!FAST) {
    /* the way it was: 11 against 16 at night with the whole darkened sheets (FIGHT_OPTS.nightWhole), against the same now */
    const pa = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js')), { sides } = require(path.join(ROOT, 'tools/bohemia_combat_auto_at_4x_probe_11_6_26.js'));
    const nightPics = async whole => { const P = sides(11, 16);
      const d = await pa.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'try{localStorage.setItem("bohemia.fight.speed","4")}catch(e){};window.FIGHT_OPTS=' + JSON.stringify({ seed: 7, kind: 'suburb', night: true, nightWhole: whole, deploy: false, formation: null, auto: true, company: P.company, cap: 11, band: P.band, party: { band: P.band, count: 16, rolled: true } }) });
      try { await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 120000 }); await d.page.evaluate(() => { try { handSpeed(4, true); } catch (e) {} });
        let peak = 0; const t0 = Date.now(); while (Date.now() - t0 < 300000) { await d.page.waitForTimeout(1500); const q = await d.page.evaluate(() => ({ over: FIGHT.S.over, pics: FIGHT_PICS() })); peak = Math.max(peak, q.pics.held); if (q.over) break; }
        return peak; } finally { await d.close(); } };
    let was = null, now = null; try { was = await nightPics(true); now = await nightPics(false); } catch (e) {}
    leg(was !== null && now !== null && now <= was * 0.5, '  A3 the way it was, 11 against 16 at night: the whole darkened sheets held ' + was + ' MB of pictures at their peak, the cells ' + now + ' MB: the night no longer doubles the fight', was + ' -> ' + now);
  }

  /* A4 */
  {
    const pa = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    const company = Array.from({ length: 6 }, (_, i) => i % 2 ? { background: 'militia', gear: { main: 'pipe', off: 'car_door' } } : {}), band = ['brigand_thug', 'brigand_marksman', 'brigand_thug', 'brigand_thug'];
    let r = null;
    try {
      const d = await pa.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 7, kind: 'suburb', night: true, deploy: false, formation: null, auto: true, company, cap: 6, band, party: { band, count: 4, rolled: true } }) });
      try {
        await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 120000 });
        await d.page.waitForFunction(() => Object.keys(HOLD.ims).some(k => /^rig_hold\//.test(k) && !/_guns/.test(k) && HOLD.ims[k].b), null, { timeout: 30000 }).catch(() => {});
        r = await d.page.evaluate(() => {
          const out = [], lifts = [MAN_MOON, MOON_SHADE, MAN_MOONLIT, MAN_MOONLIT2];
          const cmp = (img, rects) => lifts.forEach(lift => rects.forEach(q => {
            const [sx, sy, sw, sh] = q, A = document.createElement('canvas'), B = document.createElement('canvas'); A.width = B.width = sw; A.height = B.height = sh;
            const a = A.getContext('2d'), b = B.getContext('2d'); a.drawImage(nightSheet(img, lift), sx, sy, sw, sh, 0, 0, sw, sh); b.drawImage(nightWhole(img, lift), sx, sy, sw, sh, 0, 0, sw, sh);
            const pa = a.getImageData(0, 0, sw, sh).data, pb = b.getImageData(0, 0, sw, sh).data; let mx = 0, fig = 0; for (let i = 0; i < pa.length; i++) mx = Math.max(mx, Math.abs(pa[i] - pb[i])); for (let i = 3; i < pa.length; i += 4) if (pa[i]) fig++;
            out.push({ max: mx, fig }); }));
          const L = lookOf(FIGHT.S.units[0]), body = UI.imgs['fight_rig/' + L.file];
          cmp(body, [[0, 0, L.w, L.h], [3 * L.w, 2 * L.h, L.w, L.h], [7 * L.w, 5 * L.h, L.w, L.h]]);
          const hk = Object.keys(HOLD.ims).find(k => /^rig_hold\//.test(k) && HOLD.ims[k].b && !/_guns/.test(k)); let held = 0;
          if (hk) { const look = hk.split('/')[1].replace('.webp', ''), dd = HOLD.looks[look] && HOLD.looks[look].d; if (dd) { cmp(HOLD.ims[hk].b, [dd.sheet.cells[0], dd.sheet.cells[40], dd.sheet.cells[200]].map(c => c.slice(0, 4))); held = 1; } }
          const lum = lifts.map(l => { nightWhole(body, l); return UI.darkOf.get(body)['lum' + l] === nightLum(body, l); });
          return { cells: out.length, worst: Math.max(...out.map(o => o.max)), figure: out.every(o => o.fig > 200), held, lum: lum.every(Boolean) };
        });
      } finally { await d.close(); }
    } catch (e) { r = { err: String(e.message).slice(0, 120) }; }
    leg(r && r.cells >= 24 && r.worst === 0 && r.figure && r.held === 1 && r.lum, '*** A4 THE NIGHT IS THE SAME PIXELS ***: ' + (r && r.cells) + ' cells, four moons, a body sheet and a held sheet, darkened alone against cut from the whole darkened sheet: no channel of any pixel differs; the pick\'s light the same number', JSON.stringify(r));
  }

  /* A5 */
  if (!FAST) {
    let pc = null; try { pc = await probe({ his: 12, theirs: 20, profile: 'computer', mode: 'bare', seed: 11 }); } catch (e) {}
    leg(fightOk(pc) && pc.heldPeak <= PICS_CEILING_MB, '*** A5 ON HIS COMPUTER ***: 12 against 20 on AUTO at 4x, start to end, the same budgets', brief(pc));
  }
  /* A6 */
  if (!NODEMO) {
    let dm = null; try { dm = await probe({ his: 11, theirs: 16, profile: 'phone_portrait', mode: 'demo' }); } catch (e) {}
    leg(fightOk(dm) && dm.stood && dm.stood.his === 11 && dm.stood.theirs === 16 && dm.heldPeak <= PICS_CEILING_MB,
      '*** A6 THE DEMO, THROUGH THE MAP\'S OWN DOOR *** (his upright phone, 11 of his against 16, AUTO and 4x pressed on the phone): to the end, no error, the heap flat, the pictures under the ceiling',
      brief(dm) + ' tab ' + (dm && dm.mapRss) + ' MB on the map, ' + (dm && dm.rssPeak) + ' MB at the fight\'s peak');
  }
  console.log('\n=== AUTO AT 4X NEVER CRASHES: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
