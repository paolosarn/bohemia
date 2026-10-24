#!/usr/bin/env node
/* ============================================================================
   THE TEN CHANGES, THE UI'S PART, WALKED (UI 10/24/26, VAMILY [the ten changes: the UI's part], rule 133)

   TUNING's page (records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md) walked a
   stranger through the demo; RUN made that walk a tool (tools/bohemia_run_the_first_hour_walk.js) and built the
   map's half. This is the same stranger for the screen's five, through the one driver (rule 14g), real touches on
   the phone profile, so before and after are one walk:

     U5  THE BAR: how many numbers the glass strip carries (and how many are dashes), whether the second one is the
         days the batteries feed the crew (window.__BILL.daysLeft), whether the crew tag is the crew the bill feeds
     U8a NOTHING SPEAKS IN THE FIRST SIXTY SECONDS: every line the voice said, and when (play seconds from BEGIN)
     U2  THE PHONE: the first job touched; does the post say what the map now shows and the one touch that goes
     U3  A PARTY: the first touch on a crew on the road; the plate: drawn from the kit, the size of its words, the
         danger said in a word
     U8b THE VOICE AFTER SIXTY SECONDS: the line, the face, the tap that lets it go (and the map did not move)
     U6a THE FIRST JOB WON: the bar's battery figure read every 60 ms for 5 s (does it count or jump, how many
         ticks, how long), the moments posted for SOUNDS, the client's face paying, the laid-up man's face
         (SCRIPTED, marked: one of his men is struck down before the fight's own end, laid up 34 days)
     U6b NIGHTFALL: the clock moved to 21:50 by script (marked), across 22:00; the day's tally said by his second

   node tools/bohemia_ui_the_ten_changes_walk.js [--before] [--out path.json] [--shots dir/]
     --before [--rev <commit>]  serves the three files as git HEAD (or <commit>) has them (bohemia_ui_materials.js, bohemia_phone_board.js,
               BOHEMIA_CITY_WORLD.html) through the driver's serve map, so the walk is the same and only the
               files differ. Run it before committing; after a commit HEAD is the after.
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

const argv = process.argv.slice(2);
const arg = (k, dflt) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : dflt; };
const BEFORE = argv.indexOf('--before') >= 0;
const OUT = arg('--out', null);
const SHOTS = arg('--shots', null);
const FILES = ['slices/bohemia_ui_materials.js', 'slices/bohemia_phone_board.js', 'slices/BOHEMIA_CITY_WORLD.html'];

function beforeServe(rev) {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ui-ten-before-'));
  const serve = {};
  FILES.forEach(f => { const out = path.join(dir, path.basename(f)); fs.writeFileSync(out, cp.execSync('git show ' + (rev || 'HEAD') + ':' + f, { cwd: ROOT, maxBuffer: 64 << 20 })); serve['/' + f] = out; });
  return serve;
}

async function walk(opts) {
  opts = opts || {};
  const W = { when: new Date().toISOString(), before: !!opts.before, box: 'Playwright Chromium, phone 390x844 touch, full CPU', scripted: [] };
  const say = (k, v) => { W[k] = v; if (!opts.quiet) console.log('  ' + k + ': ' + JSON.stringify(v)); };
  const d = await drive.open(Object.assign({ file: 'BOHEMIA_DEMO.html', keepCards: true }, opts.before ? { serve: beforeServe(opts.rev) } : {}));
  const fr = d.fr, page = d.page;
  const shot = async (name, clip) => { if (!opts.shots) return; try { await page.screenshot(Object.assign({ path: path.join(opts.shots, (opts.before ? 'before_' : 'after_') + name + '.png') }, clip ? { clip } : {})); } catch (_e) {} };
  const shellFight = () => page.evaluate(() => !!CITYFIGHT);
  const waitFor = async (fn, ms, every) => { const s = Date.now(); while (Date.now() - s < ms) { if (await fn()) return true; await page.waitForTimeout(every || 250); } return false; };
  const fb = async () => { const h = await page.$('#cityFrame'); return h ? h.boundingBox() : null; };
  const cvAt = async () => fr.evaluate(() => { const b = document.getElementById('cv').getBoundingClientRect(); return { x: b.left, y: b.top }; });
  const touchCv = async (sx, sy) => { const b = await fb(), r = await cvAt(); await page.touchscreen.tap(b.x + r.x + sx, b.y + r.y + sy); };
  const touchCell = async (x, y) => { const q = await fr.evaluate(([x, y]) => { const p = __CITY.isoAt(x, y); return { sx: p.sx, sy: p.sy + TH / 2 }; }, [x, y]); await touchCv(q.sx, q.sy); };
  const touchEl = async (sel) => { const b = await fb(); const p = await fr.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); if (r.width < 4) return null; return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!p) return false; await page.touchscreen.tap(b.x + p.x, b.y + p.y); return true; };
  const playS = () => fr.evaluate(() => Math.round((performance.now() - (window.HUNT_T0 || 0)) / 100) / 10);
  const voice = () => fr.evaluate(() => { const V = window.__VOICE || null; const el = document.getElementById('bmvoice');
    return { shown: V ? V.shown : [], on: V ? V.on : null, plate: el && el.classList.contains('on') ? (() => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, text: el.textContent.trim() }; })() : null }; });
  const clearFight = async (script) => {
    let f = null;
    for (let i = 0; i < 120 && !f; i++) { const h = await page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await page.waitForTimeout(250); }
    if (f) await f.evaluate((script) => {
      if (script === 'laid-up') { const u = FIGHT.S.units.filter(x => x.side !== 'them' && !x.main)[0];
        if (u) { u.down = true; u.laidUp = 34; u.longInjury = { id: 'scripted', name: 'Broken leg', line: '', days: 34 }; } }
      FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }, script).catch(() => {});
    await waitFor(async () => !(await shellFight()), 20000);
    return !!f;
  };
  try {
    await page.waitForTimeout(2500);
    W.openS = await playS();
    /* ---- U5 THE BAR ---- */
    const bar = async () => fr.evaluate(() => {
      const g = document.querySelector('#bmtb [data-tb=g]'); if (!g) return null;
      const s = [...g.querySelectorAll('.s')], nums = s.filter(x => /\d/.test(x.querySelector('b') ? x.querySelector('b').textContent : '')), dash = s.filter(x => /^[–-]$/.test((x.querySelector('b') || {}).textContent || ''));
      const crewTag = document.querySelector('#bmtb .t.crew b'), dTag = g.querySelector('[data-f=nights] b');
      return { figures: s.length, numbers: nums.length, dashes: dash.length, kinds: s.map(x => x.dataset.f), text: g.textContent.replace(/\s+/g, ' ').trim(),
        daysShown: dTag ? +dTag.textContent : null, bill: window.__BILL ? { daysLeft: window.__BILL.daysLeft, crew: window.__BILL.crew } : null,
        crewShown: crewTag ? parseInt(crewTag.textContent, 10) : null, crewTicks: document.querySelectorAll('#bmtb .ticks i').length,
        batteries: (g.querySelector('[data-f=batteries] b') || {}).textContent || null };
    });
    say('U5_bar', await bar());
    await shot('bar', { x: 0, y: 0, width: 390, height: 110 });

    /* ---- U2 THE PHONE ---- */
    await waitFor(() => fr.evaluate(() => !!document.querySelector('#bmboard .fp.job')), 15000);
    const tapped = await touchEl('#bmboard .fp.job');
    await page.waitForTimeout(1200);
    const u2 = await fr.evaluate(() => { const e = document.querySelector('#bmboard .fp.job.picked'); if (!e) return { picked: false };
      const go = e.querySelector('.go'), cs = getComputedStyle(e);
      return { picked: true, text: e.textContent.replace(/\s+/g, ' ').trim(), saysNextTouch: !!go && /TOUCH/.test(go.textContent), next: go ? go.textContent : null,
        beats: cs.animationName !== 'none' ? cs.animationName + ' ' + cs.animationDuration : null, roadDrawn: (MAP_DREW && MAP_DREW.phoneRoute) | 0, townLit: (MAP_DREW && MAP_DREW.townLit) | 0 }; });
    u2.tapped = tapped; u2.s = await playS();
    say('U2_phone', u2);
    await shot('phone', { x: 220, y: 110, width: 170, height: 230 });

    /* ---- U8 THE VOICE: nothing in the first sixty seconds; after them, the line, the face, the tap ---- */
    const v0 = await voice();
    const early = v0.shown.filter(x => x.s < 60);
    const sNow = await playS();
    if (sNow < 61) await page.waitForTimeout((61 - sNow) * 1000);
    const v1 = await voice();
    let u8 = { earlyLines: early.length, linesBy61: v1.shown.length, first: v1.shown.length ? { id: v1.shown[0].id, s: v1.shown[0].s, who: v1.shown[0].who, line: v1.shown[0].line } : null,
      lines: v1.shown.map(x => ({ id: x.id, s: x.s })) };
    say('U8_voice', u8);

    /* ---- U6a THE FIRST JOB WON ---- */
    let u6 = { took: null };
    const town = await fr.evaluate(() => { const R = window.BOH_PHONE_ROUTE; const bs = ctBases() || {}; const n = R && bs[R.place] ? R.place : null; return n ? { name: n, x: bs[n].x, y: bs[n].y } : null; });
    if (town) {
      for (let i = 0; i < 4; i++) {
        if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'))) break;
        await touchCell(town.x, town.y);
        await waitFor(async () => (await shellFight()) || await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')), 12000, 300);
        if (await shellFight()) await clearFight();
      }
      const fh = await fr.$('#settleFrame'), sf = fh ? await fh.contentFrame() : null, sb = fh ? await fh.boundingBox() : null;
      if (sf && await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'))) {
        const b = await fb();
        const tapText = async (re) => { const p = await sf.evaluate((src) => { const re = new RegExp(src, 'i');
            const els = [...document.querySelectorAll('button,.pl,.hot,a,div')].filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 20 && r.height > 20 && st.display !== 'none' && re.test((e.textContent || '').trim()); });
            els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
            const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, re.source);
          if (p) await page.touchscreen.tap(b.x + sb.x + p.x, b.y + sb.y + p.y); return p; };
        await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 6000 }).catch(() => {});
        let bp = null; for (let i = 0; i < 20 && !bp; i++) { bp = await sf.evaluate(() => (window.BohemiaSettlement && BohemiaSettlement.where) ? BohemiaSettlement.where('board') : null); if (!bp) await page.waitForTimeout(250); }
        if (bp) await page.touchscreen.tap(b.x + sb.x + bp.x, b.y + sb.y + bp.y); else await tapText(/^BOARD/);
        await page.waitForTimeout(1000);
        const offer = await sf.evaluate(() => { const e = [...document.querySelectorAll('#sheet .client')].filter(e => /\d+ batt(ery)?$/i.test((e.textContent || '').trim()) && e.getBoundingClientRect().height > 20)[0];
          return e ? ((e.querySelector('.cl > span') || e.querySelector('span') || e).textContent.trim()) : null; });
        if (offer) { await tapText(new RegExp('^' + offer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await page.waitForTimeout(800); await tapText(/^Take it/); await page.waitForTimeout(800); }
        u6.took = offer;
        await tapText(/^LEAVE$/); await page.waitForTimeout(1000);
      }
      const job = await fr.evaluate(() => LOOP.held[0] ? { id: LOOP.held[0].id, x: LOOP.held[0].target.x, y: LOOP.held[0].target.y, pay: LOOP.held[0].pay } : null);
      u6.job = job;
      if (job) {
        await touchCell(job.x, job.y);
        let fight = await waitFor(() => shellFight(), 30000, 300);
        if (!fight) { await touchCell(job.x, job.y); fight = await waitFor(() => shellFight(), 20000, 300); }
        if (fight) {
          const bats0 = await fr.evaluate(() => loopBats());
          W.scripted.push('U6a: one of his men struck down before the fight\'s own end, laid up 34 days (the fight\'s own fields)');
          await clearFight('laid-up');
          /* the bar's figure, every 60 ms, for six seconds from the map's return */
          const seen = []; const t0 = Date.now(); let midShot = false;
          while (Date.now() - t0 < 6000) {
            const v = await fr.evaluate(() => { const e = document.querySelector('#bmtb [data-f=batteries] b'); return e ? e.textContent : null; });
            if (v != null && (!seen.length || seen[seen.length - 1].v !== v)) seen.push({ v, ms: Date.now() - t0 });
            if (!midShot && seen.length >= 3) { midShot = true; await shot('count', { x: 0, y: 0, width: 390, height: 110 }); }
            await page.waitForTimeout(60);
          }
          const vals = seen.map(x => +x.v).filter(x => !isNaN(x));
          const bats1 = await fr.evaluate(() => loopBats());
          const steps = vals.filter(x => x !== bats0 && x !== bats1).length;
          const firstMove = seen.find(x => +x.v !== bats0), last = seen.find(x => +x.v === bats1);
          const moments = await fr.evaluate(() => (window.__MOMENTS || []).map(m => m.kind));
          u6.count = { from: bats0, to: bats1, paid: bats1 - bats0, figures: seen.map(x => x.v), betweenValues: steps, jumped: steps === 0 && bats1 !== bats0,
            ms: (firstMove && last) ? last.ms - firstMove.ms : 0, ticksPosted: moments.filter(k => k === 'count_tick').length, countUpPosted: moments.filter(k => k === 'count_up').length };
          /* THE TAP THAT LETS A FACE GO (U8): the first face after the fight, touched once; the map must not move */
          if (await waitFor(async () => !!(await voice()).plate, 15000, 100)) {
            const v1 = await voice(); await page.waitForTimeout(1200); await shot('voice');
            const face = await fr.evaluate(() => { const c = document.querySelector('#bmvoice.on .face canvas'); if (!c) return 0; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; });
            const m0 = await fr.evaluate(() => [city.x, city.y, !!TRAVEL]);
            const b = await fb(); await page.touchscreen.tap(b.x + v1.plate.x + v1.plate.w * 0.7, b.y + v1.plate.y + v1.plate.h / 2);
            await page.waitForTimeout(350);
            const v2 = await voice(), m1 = await fr.evaluate(() => [city.x, city.y, !!TRAVEL]);
            const pad = await fr.evaluate(() => { const p = document.getElementById('speedpad'); if (!p) return null; const r = p.getBoundingClientRect(); return { y: r.y, h: r.height }; });
            W.U8_tap = { line: v1.plate.text, box: { y: Math.round(v1.plate.y), h: Math.round(v1.plate.h), w: Math.round(v1.plate.w) }, tapLetsGo: !v2.plate || v2.plate.text !== v1.plate.text,
              mapMovedOnTap: m0.join() !== m1.join() && !m0[2], overPad: pad ? (v1.plate.y + v1.plate.h > pad.y + 1) : null,
              face: face };
            if (!opts.quiet) console.log('  U8_tap: ' + JSON.stringify(W.U8_tap));
          }
          /* the faces after the fight: the client paying, the laid-up man */
          await waitFor(async () => { const v = await voice(); return v.shown.some(x => /^pay:/.test(x.id)) && v.shown.some(x => /^hurt:/.test(x.id)); }, 20000, 200);
          const vv = await voice();
          u6.faces = vv.shown.filter(x => /^(pay|hurt|dead|first_pay|first_hurt):?/.test(x.id)).map(x => ({ id: x.id, who: x.who, line: x.line, tag: x.tag, s: x.s }));
          await shot('after_fight');
        }
      }
    }
    say('U6a_win', u6);

    /* ---- U3 A PARTY ---- */
    const pty = await fr.evaluate(() => { render(); const pa = (MAP_DREW && MAP_DREW.partyAt) || {}; let best = null, bd = 1e9; const ph = document.getElementById('cityfeed'), q = ph ? ph.getBoundingClientRect() : null;
      for (const id in pa) { const g = pa[id]; const p = __CITY.isoAt(g[0], g[1]); if (p.sx < 30 || p.sx > CVW - 30 || p.sy < 160 || p.sy > CVH - 140) continue;
        if (q && p.sx > q.left - 20 && p.sy < q.bottom + 20) continue;   /* not under the phone */
        const dd = Math.abs(g[0] - city.x) + Math.abs(g[1] - city.y); if (dd < bd && dd >= 2) { bd = dd; best = { id, sx: p.sx, sy: p.sy + TH / 2 - 8 }; } }
      return best; });
    let u3 = { party: pty };
    if (!pty) {   /* no crew on the glass: a forced road event's crew (SCRIPTED, marked; RUN's W10 the same way), its plate is up from the first second */
      W.scripted.push('U3: no roaming crew on the glass, so the hunters were spawned (huntSpawn, the sixty-second guard set behind)');
      u3.hunters = await fr.evaluate(() => { try { if (TRAVEL) travelStop(); } catch (_e) {} HUNT = null; HUNT_T0 = Math.min(HUNT_T0, performance.now() - 61000);
        huntSpawn({ id: 'bounty_squad', name: 'Bounty squad', seq: 7, kind: 'forced' }); render(); return HUNT ? { at: HUNT.at.slice(), count: HUNT.count } : null; });
      await page.waitForTimeout(800);
      Object.assign(u3, await fr.evaluate(() => ({ plate: window.__PARTY_PLATE || null, kit: window.__PLATE_KIT || null, kitDrawn: (MAP_DREW && MAP_DREW.partyPlateKit) | 0 })));
      u3.read = u3.kit ? { countPx: 12, wherePx: 9, dangerWord: u3.kit.word, fromKit: true } : (u3.plate ? { countPx: 9, wherePx: 9, dangerWord: null, fromKit: false } : null);
      const hb = await fr.evaluate(() => HUNT && HUNT.box ? HUNT.box : null);
      if (hb) { const b = await fb(), r = await cvAt(); const k = u3.kit || { x: hb.x - 40, y: hb.y - 40 }; await shot('plate', { x: Math.max(0, b.x + r.x + k.x - 30), y: Math.max(0, b.y + r.y + k.y - 20), width: 220, height: 130 }); }
    }
    if (pty) {
      await touchCv(pty.sx, pty.sy); await page.waitForTimeout(1200);
      Object.assign(u3, await fr.evaluate(() => ({ plate: window.__PARTY_PLATE || null, kit: window.__PLATE_KIT || null, kitDrawn: (MAP_DREW && MAP_DREW.partyPlateKit) | 0, fight: false })));
      u3.fight = await shellFight();
      /* the words' size and the danger word, as the map draws them */
      u3.read = u3.kit ? { countPx: 12, wherePx: 9, dangerWord: u3.kit.word, fromKit: true } : (u3.plate ? { countPx: 9, wherePx: 9, dangerWord: null, fromKit: false } : null);
      if (u3.kit) { const b = await fb(), r = await cvAt(); await shot('plate', { x: Math.max(0, b.x + r.x + u3.kit.x - 30), y: Math.max(0, b.y + r.y + u3.kit.y - 20), width: 220, height: 110 }); }
      else if (u3.plate) { const b = await fb(), r = await cvAt(); await shot('plate', { x: Math.max(0, b.x + r.x + pty.sx - 110), y: Math.max(0, b.y + r.y + pty.sy - 90), width: 220, height: 110 }); }
    }
    say('U3_party', u3);

    /* ---- U6b NIGHTFALL (by script: the clock to 21:50, then twenty minutes across 22:00) ---- */
    W.scripted.push('U6b: advance() to 21:50, then one 20-minute advance across 22:00 (RUN\'s W9 the same way)');
    const n0 = await fr.evaluate(() => { const r = { before: loopBats() }; try { const need = ((DAY.NIGHT_MIN | 0) - 10) - (DAY.min | 0); if (need > 0) advance(need); advance(20); } catch (e) { r.err = String(e); } r.after = loopBats(); r.bill = window.__BILL ? window.__BILL.last : null; r.day = DAY.day; return r; });
    await waitFor(async () => (await voice()).shown.some(x => /^tally:/.test(x.id)), 20000, 200);
    const vn = await voice();
    const tally = vn.shown.filter(x => /^tally:|^first_night/.test(x.id));
    if (tally.length) { await waitFor(async () => !!(await voice()).plate, 3000, 100); await page.waitForTimeout(1500); await shot('night'); }
    say('U6b_night', { clock: n0, said: tally.map(x => ({ id: x.id, who: x.who, line: x.line, tag: x.tag })), saysNumbers: tally.some(x => /\d+ in, \d+ out/.test(x.line) && /nights left/.test(x.line)) });
    const vAll = await voice();
    W.allLines = vAll.shown.map(x => ({ id: x.id, who: x.who, s: x.s }));
    W.errors = d.errs.slice(0, 5);
  } catch (e) { W.crash = String(e && e.stack || e).slice(0, 800); console.log('  CRASH ' + W.crash); }
  await d.close();
  if (opts.out) { fs.writeFileSync(opts.out, JSON.stringify(W, null, 1)); if (!opts.quiet) console.log('  wrote ' + opts.out); }
  return W;
}
module.exports = { walk, FILES };
if (require.main === module) walk({ before: BEFORE, rev: arg('--rev', null), out: OUT, shots: SHOTS });
