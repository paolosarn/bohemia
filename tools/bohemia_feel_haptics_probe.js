#!/usr/bin/env node
/* BOHEMIA -- YOU FEEL IT, THE PROBE (FEEL 11/2/26, rule 309, ask line 302)

   Plays the shipped demo at the phone's profile (390 x 844, touch) with the hardware stubbed in every frame: navigator.vibrate
   records each pattern, and one controller is plugged in whose vibrationActuator records each rumble. Then, like a player:
     1. THE MAP: real taps on the phone's own buttons (PLAY/PAUSE twice, CREW and its DONE).
     2. THE TOWN: the first town opened the way arriving opens it (loopOpenTown), a look around, real taps on the people.
     3. THE FIGHT: a road crew the way the road starts one (roadContactFight), played to the end on AUTO, the recap left up.
     4. THE SETTING: the phone's SETTINGS app, then BUZZ tapped FULL -> LIGHT -> OFF; with OFF a tap and a kill reach no motor; back to FULL.
   It reads the one call's own log (BOH_HAPTICS.log: every kind asked, what played it, or why it was dropped) and the stubs'
   own logs (what reached the hardware), and counts them per minute, because sparse is the point.
   Writes records/target/FEEL_HAPTICS_PROBE.json.  Run: node tools/bohemia_feel_haptics_probe.js [--stay 10] */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const A = process.argv.slice(2);
const STAY = A.includes('--stay') ? +A[A.indexOf('--stay') + 1] : 10;
const OUT = path.join(ROOT, 'records/target/FEEL_HAPTICS_PROBE.json');

/* armed in every frame before the page's own code: the phone's motor and a plugged-in pad, both recording to the top window */
const ARM = `(function(){
  var TOP; try { TOP = window.top; void TOP.document; } catch (e) { TOP = window; }
  var L = function () { try { return TOP.__HW || (TOP.__HW = { vib: [], pad: [] }); } catch (e) { return (window.__HW = window.__HW || { vib: [], pad: [] }); } };
  var me = String(location.pathname).split('/').pop();
  try { Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, writable: true,
    value: function (p) { L().vib.push({ at: Date.now(), p: p, frame: me }); return true; } }); } catch (e) {}
  var pad = { id: 'probe pad (dual-rumble)', index: 0, connected: true, mapping: 'standard', buttons: [], axes: [], timestamp: 0,
    vibrationActuator: { type: 'dual-rumble', effects: ['dual-rumble'],
      playEffect: function (t, o) { L().pad.push({ at: Date.now(), type: t, o: o, frame: me }); return Promise.resolve('complete'); },
      reset: function () { return Promise.resolve('complete'); } } };
  try { Object.defineProperty(Navigator.prototype, 'getGamepads', { configurable: true, writable: true, value: function () { return [pad, null, null, null]; } }); } catch (e) {}
})();`;

function phase(name, log, hw, t0, t1) {
  const H = log.filter(e => e.wall >= t0 && e.wall < t1), felt = H.filter(e => !e.drop), mins = Math.max(1e-6, (t1 - t0) / 60000);
  const by = {}; felt.forEach(e => { by[e.kind] = (by[e.kind] || 0) + 1; });
  const drop = {}; H.filter(e => e.drop).forEach(e => { drop[e.drop] = (drop[e.drop] || 0) + 1; });
  const vib = hw.vib.filter(v => v.at >= t0 && v.at < t1), pad = hw.pad.filter(v => v.at >= t0 && v.at < t1);
  const buzzMs = vib.reduce((s, v) => s + [].concat(v.p).filter((x, i) => i % 2 === 0).reduce((a, b) => a + (+b || 0), 0), 0);
  return { phase: name, seconds: Math.round((t1 - t0) / 1000), asked: H.length, felt: felt.length, per_minute: +(felt.length / mins).toFixed(1),
    by_kind: by, dropped: drop, vibrate_calls: vib.length, vibrate_ms_total: buzzMs, buzz_share: +(buzzMs / Math.max(1, t1 - t0)).toFixed(4),
    pad_rumbles: pad.length };
}

(async () => {
  const R = { at: new Date().toISOString(), profile: 'phone_portrait' };
  let d;
  try { d = await drive.open({ keepCards: true, profile: 'phone_portrait', arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { console.log('the demo did not boot: ' + e.message); process.exit(2); }
  const p = d.page; const perr = []; p.on('pageerror', e => perr.push(String(e.message)));
  const tap = (x, y) => p.touchscreen.tap(x, y);
  const tapEl = async (frame, sel) => { const h = await frame.$(sel); if (!h) return false; const b = await h.boundingBox(); if (!b || !b.width) return false;
    await tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  await p.waitForFunction(() => window.BOH_HAPTICS && BOH_HAPTICS.backends().table, null, { timeout: 60000 });
  R.backends = await p.evaluate(() => BOH_HAPTICS.backends());
  R.version = await p.evaluate(() => { const s = document.getElementById('buildstamp'); return s ? s.textContent : null; });
  /* the one call's log, on the wall clock so it lines up with the stubs */
  const pull = async () => p.evaluate(() => { const off = Date.now() - performance.now(); return BOH_HAPTICS.log.map(e => Object.assign({ wall: Math.round(e.t + off) }, e)); });
  const T = {};

  /* ---- 1. THE MAP: the phone's own buttons ---- */
  T.map0 = Date.now();
  await p.waitForTimeout(STAY * 1000);
  const phoneTaps = [];
  for (const sel of ['#bohphone .app[data-app=play]', '#bohphone .app[data-app=play]', '#bohphone .app[data-app=crew]']) { phoneTaps.push(sel + ':' + await tapEl(p.mainFrame(), sel)); await p.waitForTimeout(1500); }
  phoneTaps.push('crew DONE:' + await tapEl(p.mainFrame(), '#bohphone .cdone'));
  await p.evaluate(() => { try { if (window.BohemiaCrewDoor && BohemiaCrewDoor.close) BohemiaCrewDoor.close(); } catch (e) {} });
  await p.waitForTimeout(1500);
  T.map1 = Date.now();

  /* ---- 2. THE TOWN ---- */
  T.town0 = Date.now();
  const town = await d.fr.evaluate(() => { const bs = ctBases(), ks = Object.keys(bs), n = ks[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
  let sf = null;
  for (let k = 0; k < 80 && !sf; k++) { await p.waitForTimeout(500);
    for (const fr of p.frames().filter(fr => /SETTLEMENT/.test(fr.url()))) {
      const ok = await fr.evaluate(() => { try { return BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false);
      if (ok) sf = fr; } }
  const box = sf ? await (await sf.frameElement()).boundingBox() : null;
  if (box) await tap(box.x + box.width * 0.5, box.y + box.height * 0.35);
  await p.waitForTimeout(STAY * 1000);
  const order = sf ? await sf.evaluate(() => { try { return BohemiaSettlement.order(); } catch (e) { return []; } }).catch(() => []) : [];
  let talked = 0;
  for (const key of (order || []).slice(0, 4)) {
    const w = await sf.evaluate(k => { try { return BohemiaSettlement.where(k); } catch (e) { return null; } }, key).catch(() => null);
    if (!w || !box) continue;
    await tap(box.x + w.x, box.y + w.y); talked++;
    await p.waitForTimeout(1300);
    await sf.evaluate(() => { try { hide(); } catch (e) {} }).catch(() => {});
    await p.waitForTimeout(500);
  }
  /* batteries come in the way a job's pay comes in: the purse is credited and the shell hears the payday */
  const paidBefore = await d.fr.evaluate(() => { try { return BohemiaPurse.balance(purseGet(), 'electricity') | 0; } catch (e) { return null; } });
  await d.fr.evaluate(() => { try { BohemiaPurse.credit(purseGet(), 'electricity', 1, 'probe: a job paid', 'contract:probe:' + Date.now(), loopDay()); } catch (e) {} try { saveNow('probe'); } catch (e) {} });
  await p.waitForTimeout(STAY * 1000);
  await d.fr.evaluate(() => { try { loopClose(); } catch (e) {} });
  await p.waitForTimeout(1500);
  T.town1 = Date.now();

  /* ---- 3. THE FIGHT ---- */
  T.fight0 = Date.now();
  await p.evaluate(() => { const L = window.__FO = { over: null };
    addEventListener('message', ev => { const m = ev.data; if (m && m.type === 'BOHEMIA_FIGHT_OVER' && !L.over) L.over = { t: Date.now(), result: m.result }; }); });
  await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
  let f = null;
  for (let i = 0; i < 300 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
    if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
  /* a few of his own taps on the fight's phone first (the buttons a player presses), then AUTO plays it out */
  const fightTaps = [];
  if (f) { await p.waitForTimeout(2500); fightTaps.push('auto:' + await f.evaluate(() => { FIGHT_UI.auto = true; return true; })); }
  let over = null;
  for (let i = 0; i < 900 && !over; i++) { over = await p.evaluate(() => window.__FO.over); if (!over) await p.waitForTimeout(500); }
  await p.waitForTimeout(6000);
  T.fight1 = Date.now();
  R.fight = { opened: !!f, over, taps: fightTaps,
    sent: f ? await f.evaluate(() => (FIGHT_UI.sent || []).map(x => x[0])).catch(() => null) : null };

  /* ---- 4. THE SETTING ---- */
  T.set0 = Date.now();
  const setting = { steps: [] };
  /* the way a player gets there: the phone's SETTINGS app opens the gear's card */
  setting.door = await tapEl(p.mainFrame(), '#bohphone .app[data-app=settings]') ? 'the phone\'s SETTINGS app' : 'BohemiaSettings.open()';
  await p.waitForTimeout(900);
  if (!(await p.evaluate(() => { const w = document.getElementById('setwrap'); return !!(w && w.classList.contains('on')); }))) await p.evaluate(() => { try { BohemiaSettings.open(); } catch (e) {} });
  await p.waitForTimeout(800);
  setting.row = await p.evaluate(() => { const b = document.getElementById('sethap'); return b ? { label: b.parentNode.querySelector('.setlab').textContent, says: b.textContent, after: (b.parentNode.previousElementSibling || {}).textContent || null } : null; });
  for (let i = 0; i < 3; i++) {
    await p.evaluate(() => { const b = document.getElementById('sethap'); if (b) b.scrollIntoView({ block: 'center' }); }); await p.waitForTimeout(250);
    await tapEl(p.mainFrame(), '#sethap'); await p.waitForTimeout(400);
    setting.steps.push(await p.evaluate(() => ({ says: document.getElementById('sethap').textContent, prefs: BOH_HAPTICS.prefs(), saved: localStorage.getItem('boh.haptics') })));
    if (setting.steps[setting.steps.length - 1].says === 'OFF') {
      const before = await p.evaluate(() => (window.__HW.vib.length + ':' + window.__HW.pad.length));
      await p.evaluate(() => { window.playSFX('ui_tap'); BOH_HAPTICS.haptic('kill', 'probe'); });
      await p.waitForTimeout(300);
      setting.off_silent = before === await p.evaluate(() => (window.__HW.vib.length + ':' + window.__HW.pad.length));
    }
  }
  setting.light = await p.evaluate(() => { localStorage.setItem('boh.haptics', JSON.stringify({ on: true, strength: 'light' }));
    const n = window.__HW.vib.length; BOH_HAPTICS.haptic('struck_down', 'probe'); const v = window.__HW.vib[n]; return v ? v.p : null; });
  await p.evaluate(() => { localStorage.removeItem('boh.haptics'); });
  T.set1 = Date.now();
  R.setting = setting;

  /* ---- the sums ---- */
  const log = await pull(), hw = await p.evaluate(() => window.__HW);
  R.phases = [phase('the map (the phone\'s buttons)', log, hw, T.map0, T.map1), phase('the town (' + town + ')', log, hw, T.town0, T.town1),
    phase('the fight (AUTO, to the recap)', log, hw, T.fight0, T.fight1)];
  R.all = phase('map + town + fight', log, hw, T.map0, T.fight1);
  R.town = { name: town, talked, paid_before: paidBefore };
  R.map = { taps: phoneTaps };
  R.raw_frames = hw.vib.filter(v => v.frame !== 'BOHEMIA_DEMO.html').length;   /* a frame that buzzed on its own, past the one call */
  R.sample = log.filter(e => !e.drop).slice(0, 40).map(e => e.kind + ' <- ' + e.from + ' [' + (e.via || []).join('+') + ']');
  R.errors = perr.concat(d.errs || []).slice(0, 8);
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1) + '\n');
  console.log(JSON.stringify(R, null, 1).slice(0, 6000));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
