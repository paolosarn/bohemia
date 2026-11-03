#!/usr/bin/env node
/* THE KILL CAMS (COMBAT 7, rule 351(f), ask line 365; Paolo 11/3: 'in the early combat you know we had kill cams, bro why don't we have
   kill cams here... it will just like fit into the timing of the game... I always just care about the frames per second').
   The first combat module's killshot camera on today's fight: slices/BOHEMIA_FIGHT.html killCut/cutStep/cutAfter, ours.kill_cams.
   Legs, the real fight page on the upright phone (390 x 844 at 3x, touch), AUTO on:
   K1 THE RULE IS DATA: ours.kill_cams with source, his words and why; the first module's five styles and the stake's long cut
   K2 EARNED AND ON THE BEAT: every cut a whole number of beats; a plain kill short, the long cut only for a stake (the last man, a
      boss or champion, his last man standing), CHAIN on a second kill by one man in his turn; AUTO halves; never two cuts within
      gap_beats unless a chain
   K3 EVERY STYLE ON A REAL KILL: SHARP, HAMMER, CINE-FOLLOW, ORBIT, X-RAY and HELD BREATH each played (forced in turn) on a kill
   K4 THE CAMERA NEVER MOVES FOR IT: the fight's zoom and aim are the same before, through and after a cut (the punch-in is the
      compositor's), the tags over the men step aside and come back
   K5 A TAP SKIPS IT: a finger on the board mid-cut ends it at once and the fight goes on
   K6 NO FRAME LOST: on the same seed the frames of a kill with the cams on draw within 3 ms of the same kill with them off (mean),
      measured round the page's own draw
   K7 THE SWITCH, OFF BY DEFAULT (rule 379, ask line 408; Paolo 11/3: 'Toggle kill cams on or off'): the fight with nothing set (the
      game's own default) plays a whole AUTO fight with its kills and never cuts: no cut, no bars, no camcorder zoom, the tags never
      hidden; on the demo on his upright phone, after NEW GAME, the gear's settings card carries KILL CAMS (ON / OFF) under FIGHTS, OFF
      lit; a tap on ON keeps 'on' in the game's key, a tap on OFF clears it
   (K2 to K6 run with the switch ON, the way he would turn it on)
   Run: node gates/the_kill_cams_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const KC = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).kill_cams;
leg(!!(KC && KC.value && KC.source && KC.quote && KC.why && KC.value.on) && ['sharp', 'hammer', 'follow', 'orbit', 'xray'].every(s => KC.value.short_styles.indexOf(s) >= 0) && KC.value.long_beats > KC.value.short_beats,
  '*** K1 THE RULE IS DATA ***: ours.kill_cams, the first module\'s five styles, the long cut longer', JSON.stringify(KC && KC.value && { short: KC.value.short_beats, long: KC.value.long_beats, auto: KC.value.auto_share, gap: KC.value.gap_beats }));

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const OPTS = seed => ({ seed, speed: 1, kind: 'street', deploy: false, formation: null, auto: true, company: [{}, {}, {}, {}, {}, {}], cap: 6, band: ['brigand_thug', 'brigand_thug', 'brigand_leader'] });
  const open = async (seed, on, force) => {
    const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify(OPTS(seed)) + (on === 'default' ? '' : ";try{localStorage.setItem('bohemia.killcams.v1','on')}catch(e){}") });
    const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
    await p.evaluate(([on, force]) => {
      if (on !== 'default') DB.ours.kill_cams.value.on = on; FIGHT_UI.cutForce = force || null;
      window.__D = []; window.__K = []; const od = window.draw;
      window.draw = function (now) { const t = performance.now(); const z = [FIGHT_UI.zoom, FIGHT_UI.cx, FIGHT_UI.cy]; od(now);
        const a0 = FIGHT_UI.anim[0], kill = !!FIGHT_UI.cut || !!(a0 && a0.k === 'note' && a0.e && a0.e.t === 'dead' && a0.at <= now && now - a0.at < Math.max(a0.dur, 500));
        window.__D.push([performance.now() - t, kill]);
        if (FIGHT_UI.cut) window.__K.push({ c: FIGHT_UI.cut.style, z0: z, z1: [FIGHT_UI.zoom, FIGHT_UI.cx, FIGHT_UI.cy], hid: getComputedStyle(document.getElementById('num') || document.body).visibility }); };
    }, [on, force]);
    return { d, p, errs };
  };
  const toEnd = async (p, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(() => FIGHT.S.over && !FIGHT_UI.anim.length).catch(() => true)) break; await p.waitForTimeout(250); } };
  const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
  try {
    /* K2, K4, K6 (on), then K6 (off) on the same seeds */
    const runs = { on: [], off: [] }, cuts = [], moved = [], errs = [];
    let beatOk = true, stakeOk = true, gapOk = true, autoOk = true, hidOk = true, back = true;
    for (const seed of [23, 31]) for (const on of [true, false]) {
      const { d, p, errs: e } = await open(seed, on);
      await toEnd(p, 160000);
      const r = await p.evaluate(() => ({ D: window.__D, K: window.__K, cuts: FIGHT_UI.cuts || [], B: beatMs(), K0: R('ours.kill_cams'), auto: !!FIGHT_UI.auto, numVis: getComputedStyle(document.getElementById('num') || document.body).visibility, cut: !!FIGHT_UI.cut }));
      runs[on ? 'on' : 'off'].push(...r.D.filter(x => x[1]).map(x => x[0]));
      if (on) {
        r.cuts.forEach((c, i) => {
          cuts.push(c.style + (c.stake ? '/' + c.stake : '') + ' ' + Math.round(c.ms / r.B * 100) / 100 + 'b');
          if (Math.abs(c.ms / r.B - Math.round(c.ms / r.B)) > 0.01) beatOk = false;
          const want = (c.stake && c.stake !== 'chain' ? r.K0.long_beats : r.K0.short_beats) * (r.auto ? r.K0.auto_share : 1);
          if (Math.abs(c.ms / r.B - Math.max(1, Math.round(want))) > 0.01) autoOk = false;
          if ((c.style === 'held') !== !!(c.stake && c.stake !== 'chain')) stakeOk = false;
          const prev = r.cuts[i - 1]; if (prev && c.at - (prev.at + prev.ms) < r.B * r.K0.gap_beats - 1 && c.stake !== 'chain') gapOk = false;
        });
        r.K.forEach(k => { if (Math.abs(k.z0[0] - k.z1[0]) > 1e-9 || Math.abs(k.z0[1] - k.z1[1]) > 1e-6 || Math.abs(k.z0[2] - k.z1[2]) > 1e-6) moved.push(k.c); if (k.hid !== 'hidden') hidOk = false; });
        if (r.numVis === 'hidden' || r.cut) back = false;
      }
      errs.push(...e); await d.close();
    }
    leg(cuts.length >= 2 && beatOk && stakeOk && gapOk && autoOk, '*** K2 EARNED AND ON THE BEAT ***: every cut whole beats, short on a plain kill, the long only for a stake, AUTO halves, never two within the gap', cuts.join(', '));
    leg(moved.length === 0 && hidOk && back, '*** K4 THE CAMERA NEVER MOVES FOR IT ***: the fight\'s zoom and aim unchanged through every cut, the tags aside and back', moved.length + ' frames moved' + (hidOk ? '' : ', tags not hidden') + (back ? '' : ', not back after'));
    const mOn = mean(runs.on), mOff = mean(runs.off);
    leg(runs.on.length > 10 && runs.off.length > 10 && mOn - mOff <= 3, '*** K6 NO FRAME LOST ***: a kill\'s frames draw within 3 ms of the same kills with the cams off (mean, the page\'s own draw)',
      'on ' + (mOn && mOn.toFixed(1)) + ' ms over ' + runs.on.length + ' frames, off ' + (mOff && mOff.toFixed(1)) + ' ms over ' + runs.off.length);
    /* K3: every style on a real kill (forced in turn) and K5 the tap */
    const seen = {}; let tapped = null;
    for (const st of ['sharp', 'hammer', 'follow', 'orbit', 'xray', 'held']) {
      const { d, p, errs: e } = await open(23, true, st);
      const ok = await p.waitForFunction(() => !!FIGHT_UI.cut, null, { timeout: 120000 }).then(() => true).catch(() => false);
      if (ok) { seen[st] = await p.evaluate(() => FIGHT_UI.cut.style + ' on ' + FIGHT.byId(FIGHT_UI.cut.victim).name);
        if (st === 'held' && !tapped) { const at = await p.evaluate(() => ({ x: innerWidth / 2, y: innerHeight * 0.4 })); await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(120);
          tapped = await p.evaluate(() => ({ gone: !FIGHT_UI.cut, skipped: FIGHT_UI.cutSkipped || 0, bars: (document.getElementById('cutT') || {}).style ? document.getElementById('cutT').style.height : null }));
          await p.waitForTimeout(3000); tapped.goesOn = await p.evaluate(() => FIGHT.S.over || FIGHT.S.log.length > 0); } }
      errs.push(...e); await d.close();
    }
    leg(Object.keys(seen).length === 6, '*** K3 EVERY STYLE ON A REAL KILL ***: SHARP, HAMMER, CINE-FOLLOW, ORBIT, X-RAY, HELD BREATH', JSON.stringify(seen));
    leg(!!tapped && tapped.gone && tapped.skipped >= 1 && tapped.goesOn && (tapped.bars === '0' || tapped.bars === '0px'), '*** K5 A TAP SKIPS IT ***: a finger on the board mid-cut ends it, the bars go, the fight goes on', JSON.stringify(tapped));
    /* K7: the fight with the game's default (nothing set), then the settings card on the demo by his finger */
    {
      const { d, p, errs: e } = await open(23, 'default');
      await toEnd(p, 160000);
      const r = await p.evaluate(() => ({ kills: FIGHT.S.log.filter(x => x.t === 'dead' && FIGHT.byId(x.id) && FIGHT.byId(x.id).side === 'them').length, cuts: (FIGHT_UI.cuts || []).length, framesInCut: window.__K.length,
        cutting: document.body.classList.contains('cutting'), bars: !!document.getElementById('cutT') && document.getElementById('cutT').style.height !== '0px' && document.getElementById('cutT').style.height !== '0' && document.getElementById('cutT').style.height !== '', key: localStorage.getItem('bohemia.killcams.v1') }));
      errs.push(...e); await d.close();
      const dm = await D.open({ profile: 'phone_portrait' }); const q = dm.page, e2 = []; q.on('pageerror', x => e2.push(String(x.message).slice(0, 140)));
      let row = null;
      try {
        const tapEl = async sel => { const at = await q.evaluate(sel => { const b = document.querySelector(sel); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return r.width > 2 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }, sel); if (at) await q.touchscreen.tap(at.x, at.y); return !!at; };
        await tapEl('#gearbtn'); await q.waitForTimeout(600);
        const look = () => q.evaluate(() => { const h = document.getElementById('setcams'), r = h && h.closest('.setrow'), f = document.getElementById('setdiff');
          const pos = (a, b) => a && b ? !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) : false;
          return h ? { label: r.querySelector('.setlab').textContent, buttons: [...h.children].map(b => b.textContent + (b.classList.contains('on') ? '*' : '')).join(' '), shown: getComputedStyle(r).display !== 'none' && r.getBoundingClientRect().height > 4,
            underFights: pos(r, f), key: localStorage.getItem('bohemia.killcams.v1'), atStart: document.body.classList.contains('setatstart') } : null; });
        const first = await look();
        await tapEl('#setcams .setbtn[data-k=on]'); await q.waitForTimeout(250); const onNow = await look();
        await tapEl('#setcams .setbtn[data-k=off]'); await q.waitForTimeout(250); const offNow = await look();
        row = { first, onNow, offNow };
      } catch (x) { row = { err: String(x.message).slice(0, 160) }; }
      errs.push(...e2); await dm.close();
      const ok = r.kills > 0 && r.cuts === 0 && r.framesInCut === 0 && !r.cutting && !r.bars && r.key === null && row && row.first && row.first.label === 'KILL CAMS' && row.first.shown && row.first.underFights
        && /OFF\*/.test(row.first.buttons) && !/ON\*/.test(row.first.buttons) && row.first.key === null && row.onNow.key === 'on' && /ON\*/.test(row.onNow.buttons) && row.offNow.key === null && /OFF\*/.test(row.offNow.buttons);
      leg(ok, '*** K7 THE SWITCH, OFF BY DEFAULT *** [upright 390 x 844, touch]: the game\'s default fight never cuts; KILL CAMS (ON / OFF) on the gear\'s card under FIGHTS, OFF lit, his taps set and clear it',
        JSON.stringify({ fight: r, card: row }));
    }
    leg(errs.length === 0, '  nothing threw', errs.slice(0, 2).join(' | ') || 'none');
  } catch (e) { leg(false, 'the page legs ran', String(e.message).slice(0, 200)); }
  console.log('\n=== THE KILL CAMS: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
