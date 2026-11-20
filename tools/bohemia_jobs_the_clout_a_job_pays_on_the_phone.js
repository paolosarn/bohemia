#!/usr/bin/env node
// JOBS [the CLOUT a job pays] 11/20 -- ON HIS PHONE (VAMILY rules 461, 441). The game on a phone (upright and sideways), the demo or
// the alpha (--alpha), A NEW CREW, the valley K7QM9X.
//   The card (BohemiaJobKinds.asks, the offer's 'What it asks') says what a job pays in name: 'Your name: about +N CLOUT' (the job done
//   +100, each man beaten +5, each place put down its own). The handoff's open question since 11/11: the phone walk's forced fight
//   ends counted fewer (+130 where the card said about +140). Here a job whose every fight is sure (no maybe, no talk) is taken by the
//   map's own contract door, walked by the map's own clock and steps, and EVERY FIGHT IS PLAYED ON AUTO, pressed with a finger (the
//   phone's AUTO, the fight's own speed), to the end; the spoils left with a finger. The CLOUT the company gained against the card's.
// Writes <out>/clout_pays_<tag>.json.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { fightPress } = require(path.join(ROOT, 'tools/bohemia_fight_press.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, NIGHT = process.argv.indexOf('--night') > 0, CODE = arg('--code', 'K7QM9X'), JOBS = +arg('--jobs', 2);   /* --night: only the jobs whose card says who comes in the dark */
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_20')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], row = { shape, alpha: ALPHA, jobs: [] };
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const fightUp = () => page.evaluate(() => !!CITYFIGHT);
  const tapPage = async (frameSel, xy) => { const h = await page.$(frameSel); const b = await h.boundingBox(); await page.touchscreen.tap(b.x + xy[0], b.y + xy[1]); };
  async function playFight() {
    let ff = null;
    for (let i = 0; i < 150 && !ff; i++) { const h = await page.$('#fightFrame'); if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) ff = f; } if (!ff) await page.waitForTimeout(200); }
    if (!ff) throw new Error('the fight page never stood');
    await page.waitForTimeout(1500);
    const already = await ff.evaluate(() => !!FIGHT.S.over).catch(() => false);   /* the fight just played, its page not yet gone: no new fight */
    const out = { them0: await ff.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind)) };
    if (already) { out.again = true; await waitFor(async () => !(await fightUp()), 30000); return out; }
    for (let k = 0; k < 4 && await ff.evaluate(() => FIGHT.S.deploy).catch(() => false); k++) { await fightPress(page, ff, 'bend', { ms: 8000 }).catch(() => {}); await page.waitForTimeout(1500); }   /* his line as it stands: FIGHT */
    for (let k = 0; k < 3 && !(await ff.evaluate(() => FIGHT_UI.auto).catch(() => true)); k++) { out.autoBy = await fightPress(page, ff, 'bauto', { ms: 8000 }).catch(() => null); await page.waitForTimeout(600); }   /* AUTO, with a finger */
    for (let k = 0; k < 3 && (await ff.evaluate(() => FIGHT_UI.hand || 1).catch(() => 4)) !== 4; k++) { await fightPress(page, ff, 'bspeed', { ms: 4000 }).catch(() => {}); await page.waitForTimeout(400); }   /* the fight's own fast-forward */
    out.auto = await ff.evaluate(() => !!FIGHT_UI.auto).catch(() => null);
    const t0 = Date.now();
    while (Date.now() - t0 < 300000) { const st = await ff.evaluate(() => FIGHT.S.over).catch(() => true); if (st) break; await page.waitForTimeout(500); }
    out.night = await ff.evaluate(() => !!FIGHT.S.night).catch(() => null);
    Object.assign(out, await ff.evaluate(() => { const t = FIGHT.S.units.filter(u => u.side === 'them');
      return { over: FIGHT.S.over, result: FIGHT.S.result, rounds: FIGHT.S.round, them: t.length, dead: t.filter(u => u.dead).length, fled: t.filter(u => u.fled).length, down: t.filter(u => !u.dead && !u.fled && u.down).length, standing: t.filter(u => !u.dead && !u.fled && !u.down).length }; }).catch(() => ({ over: null })));
    out.ms = Date.now() - t0;
    out.district = await fr.evaluate(() => window.__FIGHT_DISTRICT || null).catch(() => null);   /* the card's place's district and where he stood */
    let sf = null;
    await waitFor(async () => { const h = await page.$('#spoilsdoor iframe'); if (!h) return false; sf = await h.contentFrame(); return !!sf && await sf.evaluate(() => !!document.getElementById('leave')); }, 30000);
    await page.waitForTimeout(900);
    if (sf) { const b = await sf.evaluate(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }); if (b) await tapPage('#spoilsdoor iframe', b); }
    await waitFor(async () => !(await fightUp()), 30000); await page.waitForTimeout(1500);
    return out;
  }
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaJobDanger && BohemiaJobDanger.ready() && window.BohemiaRenown && window.LOOP && LOOP.start, null, { timeout: 180000 });
    await page.waitForTimeout(4000);
    /* the jobs: every offer at every town the map has, read by the card's own words; one-skull, every fight sure, no talk, no hunt, no night */
    row.cands = await fr.evaluate((NIGHT) => { const out = [], seen = {}, bs = ctBases() || {};
      BohemiaBoardShelf.shelf().offers.forEach(o => { if (seen[o.id] || (o.skulls | 0) > (NIGHT ? 2 : 1)) return; Object.keys(bs).forEach(n => { if (seen[o.id]) return;
        let A = null; try { A = BohemiaJobKinds.asks(o, n); } catch (e) { A = null; }
        if (!A || A.sure < 1 || A.maybe || A.choose || /hunt/.test(A.plays || '') || (NIGHT ? !/in the dark/.test(A.words) : /in the dark|night/.test(A.words))) return;
        seen[o.id] = 1; out.push({ id: o.id, town: n, plays: A.plays, sure: A.sure, clout: A.clout, words: A.words }); }); });
      return out; }, NIGHT);
    for (const C of row.cands.slice(0, 12)) {
      if (row.jobs.filter(j => j.done).length >= JOBS) break;
      const J = { id: C.id, town: C.town, plays: C.plays, card: C.clout, cardWords: C.words, fights: [] };
      try {
        /* the card as he reads it, right before the yes (the world moves while another job is played: who holds a spot can change) */
        const A = await fr.evaluate(([id, n]) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; const A = BohemiaJobKinds.asks(o, n); return A ? { clout: A.clout, words: A.words, sure: A.sure, maybe: A.maybe, choose: A.choose } : null; }, [C.id, C.town]);
        if (!A || A.maybe || A.choose || A.sure < 1) { J.skipped = 'the card moved: ' + JSON.stringify(A); row.jobs.push(J); continue; }
        J.card = A.clout; J.cardWords = A.words;
        J.clout0 = await fr.evaluate(([id, n]) => { try { loopClose(); } catch (e) {} LOOP.held = []; LOOP.fighting = null;
          const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) });
          const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; loopTakeContract(c); return BohemiaRenown.score(); }, [C.id, C.town]);
        if (!await waitFor(() => fr.evaluate((id) => LOOP.held.some(h => h.id === id), C.id), 10000)) throw new Error('not taken');
        J.from = await fr.evaluate((id) => (LOOP.held.filter(h => h.id === id)[0] || {}).from || null, C.id);
        J.cardHeld = await fr.evaluate(([id]) => { const j = LOOP.held.filter(h => h.id === id)[0]; try { const A = BohemiaJobKinds.asks(BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0], j.from); return A ? A.clout : null; } catch (e) { return null; } }, [C.id]);
        for (let s = 0; s < 60; s++) {
          if (await fightUp()) { const F = await playFight(); if (!F.again) J.fights.push(F); continue; }
          const st = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return 'gone';
            const p = j.stage === 'look' && j.spot ? j.spot : (j.target || j.spot); if (!p) { BohemiaJobKinds.step(); return 'step:' + j.stage; }
            travelStop(); city.x = p.x; city.y = p.y; BohemiaJobKinds.arrived(p.x, p.y) || BohemiaJobKinds.step(); return String(j.stage || '?'); }, C.id);
          (J.trace = J.trace || []).push(st + '@' + (await fr.evaluate(() => { try { return loopDay() + ' ' + Math.floor(T.min / 60) + ':' + String(T.min % 60).padStart(2, '0'); } catch (e) { return '?'; } })));
          if (st === 'gone') break;
          await page.waitForTimeout(900);
          await waitFor(fightUp, 2500);
        }
        J.clout1 = await fr.evaluate(() => BohemiaRenown.score());
        J.paid = await fr.evaluate((id) => (window.__JOB_PAID || []).filter(p => p.id === id).slice(-1)[0] || null, C.id);
        J.log = await fr.evaluate(() => { try { return (JSON.parse(localStorage.getItem('bohemia.renown.v1') || '{}').log || []).slice(-8); } catch (e) { return null; } });
        J.gain = J.clout1 - J.clout0; J.done = !!J.paid && J.fights.length > 0 && J.fights.every(f => f.result === 'won');
        try { J.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_job' + (row.jobs.length + 1) + '.png')); await page.screenshot({ path: path.join(ROOT, J.png) }); } catch (e) {}
      } catch (e) { J.err = String(e && e.message || e).slice(0, 200); }
      row.jobs.push(J);
      try { fs.writeFileSync(path.join(OUTD, 'clout_pays_' + TAG + '.partial.json'), JSON.stringify(row, null, 1)); } catch (e) {}   /* kept job by job */
      console.log('  ' + TAG + ' ' + shape + ' ' + J.id + ' @' + J.town + ' (' + J.plays + '): card +' + J.card + (J.cardHeld != null && J.cardHeld !== J.card ? ' (held ' + J.cardHeld + ')' : '') + (J.err ? ' ERR ' + J.err : ', gained +' + J.gain + ' (' + J.clout0 + ' -> ' + J.clout1 + '), fights ' + J.fights.map(f => f.result + ' ' + f.them + ' (' + f.dead + ' dead ' + f.fled + ' ran ' + f.down + ' down ' + f.standing + ' up, auto ' + f.auto + ')').join(', ') + ', paid ' + (J.paid ? J.paid.paid : 'no')));
    }
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); console.log('  ' + TAG + ' ' + shape + ' ERR ' + row.err); }
  row.errs = errs.slice(0, 5);
  await d.close().catch(() => {});
  return row;
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'clout_pays_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_the_clout_a_job_pays_on_the_phone.js', tag: TAG, alpha: ALPHA, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();
